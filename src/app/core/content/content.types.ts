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
  readonly market: string;
  readonly timeframe: string;
  readonly setup: string;
  readonly direction: TradeDirection;
  readonly outcome: TradeOutcome;
  readonly pnlR: number;
  readonly mistakes: readonly string[];
  readonly lessons: readonly string[];
}

export interface KnowledgePost extends BasePost {
  readonly category: string;
  readonly difficulty: KnowledgeDifficulty;
  readonly references: readonly string[];
}

export interface ContentManifestItem {
  readonly kind: ContentKind;
  readonly path: string;
}
