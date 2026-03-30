export interface ParsedMarkdown {
  readonly attributes: Readonly<Record<string, string>>;
  readonly body: string;
}

export function parseFrontmatter(markdown: string): ParsedMarkdown {
  const normalized = markdown.replace(/\r\n/g, '\n').trim();

  if (!normalized.startsWith('---\n')) {
    throw new Error('Markdown 缺少 front matter 區塊。');
  }

  const endMarker = '\n---\n';
  const frontmatterEnd = normalized.indexOf(endMarker, 4);

  if (frontmatterEnd === -1) {
    throw new Error('front matter 結尾標記不存在。');
  }

  const frontmatterBlock = normalized.slice(4, frontmatterEnd);
  const body = normalized.slice(frontmatterEnd + endMarker.length).trim();

  const attributes = frontmatterBlock
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .reduce<Record<string, string>>((accumulator, line) => {
      const separatorIndex = line.indexOf(':');

      if (separatorIndex === -1) {
        throw new Error(`front matter 格式錯誤: ${line}`);
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (!key) {
        throw new Error(`front matter key 無效: ${line}`);
      }

      accumulator[key] = value;
      return accumulator;
    }, {});

  return {
    attributes,
    body
  };
}

export function getRequiredString(
  attributes: Readonly<Record<string, string>>,
  key: string,
  filePath: string
): string {
  const value = attributes[key];

  if (!value) {
    throw new Error(`檔案 ${filePath} 缺少必要欄位: ${key}`);
  }

  return value;
}

export function parseList(value: string): readonly string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
