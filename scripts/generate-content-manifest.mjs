import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const publicContentDir = path.join(projectRoot, 'public', 'content');
const reviewsDir = path.join(publicContentDir, 'reviews');
const knowledgeDir = path.join(publicContentDir, 'knowledge');
const manifestPath = path.join(projectRoot, 'src', 'app', 'core', 'content', 'content.manifest.ts');

const toWebPath = (absolutePath) => {
  const relative = path.relative(path.join(projectRoot, 'public'), absolutePath);
  return `/${relative.split(path.sep).join('/')}`;
};

const isMarkdownFile = (fileName) => fileName.toLowerCase().endsWith('.md');

const readMarkdownFiles = async (directoryPath) => {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile() && isMarkdownFile(entry.name)).map((entry) => path.join(directoryPath, entry.name));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
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
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeManifest = async () => {
  const [reviewMarkdownFiles, knowledgeMarkdownFiles] = await Promise.all([
    readReviewMarkdownFiles(),
    readMarkdownFiles(knowledgeDir)
  ]);

  const reviewEntries = reviewMarkdownFiles
    .map((filePath) => `  { kind: 'review', path: '${toWebPath(filePath)}' },`)
    .join('\n');

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
