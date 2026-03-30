import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/content/content.repository';
import { ReviewPost, TradeOutcome } from '../../core/content/content.types';

@Component({
  selector: 'app-review-list-page',
  imports: [FormsModule, RouterLink],
  template: `
    <section class="page-section">
      <h2 class="page-title">交易覆盤</h2>
      <p class="page-subtitle">依照市場、標籤與結果快速回顧交易決策。</p>
    </section>

    <section class="card page-section" aria-label="篩選條件">
      <div class="controls">
        <label>
          <span class="meta">關鍵字</span><br />
          <input
            class="input"
            type="search"
            [ngModel]="query()"
            (ngModelChange)="query.set($event)"
            placeholder="搜尋標題、策略、市場"
          />
        </label>

        <label>
          <span class="meta">結果</span><br />
          <select
            class="select"
            [ngModel]="outcomeFilter()"
            (ngModelChange)="onOutcomeChange($event)"
          >
            <option value="all">全部</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="breakeven">Breakeven</option>
          </select>
        </label>
      </div>
    </section>

    <section class="page-section">
      <p class="meta">共 {{ filteredPosts().length }} 筆覆盤</p>

      <div class="grid grid-2">
        @for (post of filteredPosts(); track post.slug) {
          <article class="card">
            <h2>{{ post.title }}</h2>
            <p class="meta">{{ post.publishedAt }} · {{ post.market }} · {{ post.timeframe }}</p>
            <p>{{ post.summary }}</p>
            <p class="meta">策略：{{ post.setup }} · {{ post.direction }} · PnL(R): {{ post.pnlR }}</p>
            <p>
              <span class="status-pill" [class]="'status-pill ' + post.outcome">{{ post.outcome }}</span>
            </p>

            <ul class="tag-list">
              @for (tag of post.tags; track tag) {
                <li><a class="tag-chip" [routerLink]="['/tags', tag]">#{{ tag }}</a></li>
              }
            </ul>

            <p><a class="btn-link" [routerLink]="['/reviews', post.slug]">查看詳情</a></p>
          </article>
        } @empty {
          <article class="card">
            <h2>找不到符合條件的覆盤</h2>
            <p>請調整關鍵字或篩選條件。</p>
          </article>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewListPage {
  private readonly repository = inject(ContentRepository);

  protected readonly query = signal('');
  protected readonly outcomeFilter = signal<'all' | TradeOutcome>('all');
  protected readonly posts = this.repository.reviewPosts;

  protected readonly filteredPosts = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    const outcome = this.outcomeFilter();

    return this.posts().filter((post) => this.matchesFilter(post, normalizedQuery, outcome));
  });

  protected onOutcomeChange(value: string): void {
    if (value === 'all' || value === 'win' || value === 'loss' || value === 'breakeven') {
      this.outcomeFilter.set(value);
    }
  }

  private matchesFilter(post: ReviewPost, query: string, outcome: 'all' | TradeOutcome): boolean {
    const queryMatched =
      query.length === 0 ||
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.market.toLowerCase().includes(query) ||
      post.setup.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query));

    const outcomeMatched = outcome === 'all' || post.outcome === outcome;

    return queryMatched && outcomeMatched;
  }
}
