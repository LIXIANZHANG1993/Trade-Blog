export type ContentKind = 'review' | 'knowledge';

export type TradeDirection = 'long' | 'short';
export type TradeOutcome = 'win' | 'loss' | 'breakeven';
export type KnowledgeDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface BasePost {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly publishedAt: string;
  readonly tags: readonly string[];
  readonly content: string;
}

export interface ReviewPost extends BasePost {
  readonly imagePath: string;
  readonly market: string;
}

export interface KnowledgePost extends BasePost {
  readonly category: string;
  readonly difficulty: KnowledgeDifficulty;
  readonly references: readonly string[];
}

export interface ReviewManifestItem {
  readonly kind: 'review';
  readonly path: string;
  readonly imagePath: string;
}

export interface KnowledgeManifestItem {
  readonly kind: 'knowledge';
  readonly path: string;
}

export type ContentManifestItem = ReviewManifestItem | KnowledgeManifestItem;
