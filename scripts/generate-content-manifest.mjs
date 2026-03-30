import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const publicContentDir = path.join(projectRoot, 'public', 'content');
const reviewsDir = path.join(publicContentDir, 'reviews');
const knowledgeDir = path.join(publicContentDir, 'knowledge');
const manifestPath = path.join(projectRoot, 'src', 'app', 'core', 'content', 'content.manifest.ts');
const reviewImageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];

const toWebPath = (absolutePath) => {
  const relative = path.relative(path.join(projectRoot, 'public'), absolutePath);
  return relative.split(path.sep).join('/');
};

const isMarkdownFile = (fileName) => fileName.toLowerCase().endsWith('.md');

const isFileMissingError = (error) => error instanceof Error && 'code' in error && error.code === 'ENOENT';

const readMarkdownFiles = async (directoryPath) => {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile() && isMarkdownFile(entry.name)).map((entry) => path.join(directoryPath, entry.name));
  } catch (error) {
    if (isFileMissingError(error)) {
      return [];
    }
    throw error;
  }
};

const readReviewMarkdownFiles = async () => {
  try {
    const entries = await fs.readdir(reviewsDir, { withFileTypes: true });

    const filesByDateDir = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const dateDirPath = path.join(reviewsDir, entry.name);
          const markdownFiles = await readMarkdownFiles(dateDirPath);
          return markdownFiles;
        })
    );

    return filesByDateDir.flat().sort((a, b) => a.localeCompare(b));
  } catch (error) {
    if (isFileMissingError(error)) {
      return [];
    }
    throw error;
  }
};

const fileExists = async (absolutePath) => {
  try {
    await fs.access(absolutePath);
    return true;
  } catch (error) {
    if (isFileMissingError(error)) {
      return false;
    }
    throw error;
  }
};

const resolveReviewImagePath = async (markdownPath) => {
  const basePath = markdownPath.replace(/\.md$/i, '');

  for (const extension of reviewImageExtensions) {
    const candidate = `${basePath}${extension}`;
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `找不到對應圖片檔案: ${toWebPath(basePath)}.{${reviewImageExtensions.map((extension) => extension.slice(1)).join('|')}}`
  );
};

const writeManifest = async () => {
  const [reviewMarkdownFiles, knowledgeMarkdownFiles] = await Promise.all([
    readReviewMarkdownFiles(),
    readMarkdownFiles(knowledgeDir)
  ]);

  const reviewEntries = (
    await Promise.all(
      reviewMarkdownFiles.map(async (filePath) => {
        const imagePath = await resolveReviewImagePath(filePath);
        return `  { kind: 'review', path: '${toWebPath(filePath)}', imagePath: '${toWebPath(imagePath)}' },`;
      })
    )
  ).join('\n');

  const knowledgeEntries = knowledgeMarkdownFiles
    .sort((a, b) => a.localeCompare(b))
    .map((filePath) => `  { kind: 'knowledge', path: '${toWebPath(filePath)}' },`)
    .join('\n');

  const allEntries = [reviewEntries, knowledgeEntries].filter((section) => section.length > 0).join('\n');

  const content = `import { ContentManifestItem } from './content.types';\n\nexport const CONTENT_MANIFEST: readonly ContentManifestItem[] = [\n${allEntries}\n];\n`;

  await fs.writeFile(manifestPath, content, 'utf8');
  console.log(`Generated content manifest with ${reviewMarkdownFiles.length} review item(s) and ${knowledgeMarkdownFiles.length} knowledge item(s).`);
};

await writeManifest();
