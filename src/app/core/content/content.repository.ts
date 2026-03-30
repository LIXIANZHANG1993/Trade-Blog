import { Injectable, computed, signal } from '@angular/core';
import { CONTENT_MANIFEST } from './content.manifest';
import {
  ContentManifestItem,
  KnowledgeDifficulty,
  KnowledgePost,
  ReviewPost
} from './content.types';
import { getRequiredString, parseFrontmatter, parseList } from './frontmatter-parser';

interface ContentState {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly error: string | null;
  readonly reviews: readonly ReviewPost[];
  readonly knowledge: readonly KnowledgePost[];
}

const INITIAL_STATE: ContentState = {
  loaded: false,
  loading: false,
  error: null,
  reviews: [],
  knowledge: []
};

@Injectable({ providedIn: 'root' })
export class ContentRepository {
  private readonly state = signal<ContentState>(INITIAL_STATE);

  readonly isLoaded = computed(() => this.state().loaded);
  readonly isLoading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly reviewPosts = computed(() => this.state().reviews);
  readonly knowledgePosts = computed(() => this.state().knowledge);

  readonly reviewTags = computed(() => this.collectTags(this.state().reviews));
  readonly knowledgeTags = computed(() => this.collectTags(this.state().knowledge));
  readonly allTags = computed(() =>
    [...new Set([...this.reviewTags(), ...this.knowledgeTags()])].sort((a, b) => a.localeCompare(b))
  );

  async loadAll(): Promise<void> {
    if (this.state().loaded || this.state().loading) {
      return;
    }

    this.state.update((current) => ({ ...current, loading: true, error: null }));

    try {
      const [reviews, knowledge] = await Promise.all([
        this.loadReviews(),
        this.loadKnowledge()
      ]);

      this.state.set({
        loaded: true,
        loading: false,
        error: null,
        reviews,
        knowledge
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '內容載入失敗';
      this.state.update((current) => ({
        ...current,
        loading: false,
        error: message
      }));
      throw new Error(message);
    }
  }

  findReviewBySlug(slug: string): ReviewPost | undefined {
    return this.state().reviews.find((post) => post.slug === slug);
  }

  findKnowledgeBySlug(slug: string): KnowledgePost | undefined {
    return this.state().knowledge.find((post) => post.slug === slug);
  }

  private async loadReviews(): Promise<readonly ReviewPost[]> {
    const reviewEntries = CONTENT_MANIFEST.filter((item) => item.kind === 'review');
    const posts = await Promise.all(reviewEntries.map((entry) => this.loadReview(entry)));

    return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }

  private async loadKnowledge(): Promise<readonly KnowledgePost[]> {
    const knowledgeEntries = CONTENT_MANIFEST.filter((item) => item.kind === 'knowledge');
    const posts = await Promise.all(knowledgeEntries.map((entry) => this.loadKnowledgePost(entry)));

    return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }

  private async loadReview(entry: ContentManifestItem): Promise<ReviewPost> {
    const response = await fetch(entry.path);

    if (!response.ok) {
      throw new Error(`無法讀取檔案: ${entry.path}`);
    }

    const markdown = await response.text();
    const normalizedMarkdown = markdown.replace(/\r\n/g, '\n').trim();
    const imagePath = await this.resolveImagePath(entry.path);

    if (normalizedMarkdown.startsWith('---\n')) {
      const parsed = parseFrontmatter(markdown);
      const fields = parsed.attributes;

      return {
        slug: getRequiredString(fields, 'slug', entry.path),
        title: getRequiredString(fields, 'title', entry.path),
        summary: getRequiredString(fields, 'summary', entry.path),
        publishedAt: getRequiredString(fields, 'publishedAt', entry.path),
        tags: parseList(getRequiredString(fields, 'tags', entry.path)),
        imagePath,
        market: getRequiredString(fields, 'market', entry.path),
        content: parsed.body
      };
    }

    const title = this.parseTitleFromMarkdown(normalizedMarkdown, entry.path);
    const publishedAt = this.parsePublishedAtFromPath(entry.path);

    return {
      slug: this.parseSlugFromPath(entry.path),
      title,
      summary: this.buildSummaryFromMarkdown(normalizedMarkdown, title),
      publishedAt,
      tags: [this.parseMarketFromTitle(title), '交易覆盤'],
      imagePath,
      market: this.parseMarketFromTitle(title),
      content: normalizedMarkdown
    };
  }

  private async loadKnowledgePost(entry: ContentManifestItem): Promise<KnowledgePost> {
    const response = await fetch(entry.path);

    if (!response.ok) {
      throw new Error(`無法讀取檔案: ${entry.path}`);
    }

    const markdown = await response.text();
    const parsed = parseFrontmatter(markdown);
    const fields = parsed.attributes;

    const difficultyCandidate = getRequiredString(fields, 'difficulty', entry.path);

    if (!isKnowledgeDifficulty(difficultyCandidate)) {
      throw new Error(`檔案 ${entry.path} difficulty 不合法`);
    }

    return {
      slug: getRequiredString(fields, 'slug', entry.path),
      title: getRequiredString(fields, 'title', entry.path),
      summary: getRequiredString(fields, 'summary', entry.path),
      publishedAt: getRequiredString(fields, 'publishedAt', entry.path),
      tags: parseList(getRequiredString(fields, 'tags', entry.path)),
      category: getRequiredString(fields, 'category', entry.path),
      difficulty: difficultyCandidate,
      references: parseList(fields['references'] ?? ''),
      content: parsed.body
    };
  }

  private collectTags(posts: readonly { readonly tags: readonly string[] }[]): readonly string[] {
    return [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b));
  }

  private parseSlugFromPath(path: string): string {
    const fileName = path.split('/').at(-1);

    if (!fileName) {
      throw new Error(`無法從路徑取得檔名: ${path}`);
    }

    return fileName.replace(/\.md$/i, '');
  }

  private parsePublishedAtFromPath(path: string): string {
    const dateDir = path.split('/').at(-2) ?? '';
    const match = dateDir.match(/^(\d{4})(\d{2})(\d{2})$/);

    if (!match) {
      return dateDir;
    }

    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  private parseTitleFromMarkdown(markdown: string, path: string): string {
    const firstLine = markdown.split('\n').find((line) => line.trim().length > 0)?.trim();

    if (!firstLine || !firstLine.startsWith('# ')) {
      throw new Error(`檔案 ${path} 缺少標題 (第一行需為 # 標題)`);
    }

    return firstLine.slice(2).trim();
  }

  private buildSummaryFromMarkdown(markdown: string, title: string): string {
    const lines = markdown
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('>'));

    const candidate = lines[0] ?? title;
    return candidate.length > 90 ? `${candidate.slice(0, 90)}…` : candidate;
  }

  private parseMarketFromTitle(title: string): string {
    const token = title.split(/\s+/)[0]?.trim().toUpperCase();
    return token || 'UNKNOWN';
  }

  private async resolveImagePath(markdownPath: string): Promise<string> {
    const basePath = markdownPath.replace(/\.md$/i, '');
    const extensions = ['.png', '.jpg', '.jpeg', '.webp', '.avif'] as const;

    for (const extension of extensions) {
      const candidate = `${basePath}${extension}`;
      const response = await fetch(candidate);

      if (response.ok) {
        return candidate;
      }
    }

    throw new Error(`找不到對應圖片檔案: ${basePath}.{png|jpg|jpeg|webp|avif}`);
  }
}

function isKnowledgeDifficulty(value: string): value is KnowledgeDifficulty {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced';
}
