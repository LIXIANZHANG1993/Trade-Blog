import { Injectable, computed, signal } from '@angular/core';
import { CONTENT_MANIFEST } from './content.manifest';
import {
  ContentManifestItem,
  KnowledgeDifficulty,
  KnowledgePost,
  ReviewPost,
  TradeDirection,
  TradeOutcome
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
    const parsed = parseFrontmatter(markdown);
    const fields = parsed.attributes;

    const directionCandidate = getRequiredString(fields, 'direction', entry.path);
    const outcomeCandidate = getRequiredString(fields, 'outcome', entry.path);

    if (!isTradeDirection(directionCandidate)) {
      throw new Error(`檔案 ${entry.path} direction 不合法`);
    }

    if (!isTradeOutcome(outcomeCandidate)) {
      throw new Error(`檔案 ${entry.path} outcome 不合法`);
    }

    const pnlR = Number(getRequiredString(fields, 'pnlR', entry.path));

    if (Number.isNaN(pnlR)) {
      throw new Error(`檔案 ${entry.path} 的 pnlR 不是有效數字`);
    }

    return {
      slug: getRequiredString(fields, 'slug', entry.path),
      title: getRequiredString(fields, 'title', entry.path),
      summary: getRequiredString(fields, 'summary', entry.path),
      publishedAt: getRequiredString(fields, 'publishedAt', entry.path),
      tags: parseList(getRequiredString(fields, 'tags', entry.path)),
      market: getRequiredString(fields, 'market', entry.path),
      timeframe: getRequiredString(fields, 'timeframe', entry.path),
      setup: getRequiredString(fields, 'setup', entry.path),
      direction: directionCandidate,
      outcome: outcomeCandidate,
      pnlR,
      mistakes: parseList(getRequiredString(fields, 'mistakes', entry.path)),
      lessons: parseList(getRequiredString(fields, 'lessons', entry.path)),
      content: parsed.body
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
}

function isTradeDirection(value: string): value is TradeDirection {
  return value === 'long' || value === 'short';
}

function isTradeOutcome(value: string): value is TradeOutcome {
  return value === 'win' || value === 'loss' || value === 'breakeven';
}

function isKnowledgeDifficulty(value: string): value is KnowledgeDifficulty {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced';
}
