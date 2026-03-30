import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/content/content.repository';

@Component({
  selector: 'app-review-detail-page',
  imports: [RouterLink],
  template: `
    @if (post(); as currentPost) {
      <article class="page-section">
        <header class="page-section">
          <h1 class="page-title">{{ currentPost.title }}</h1>
          <p class="meta">
            {{ currentPost.publishedAt }} · {{ currentPost.market }} · {{ currentPost.timeframe }} · {{ currentPost.setup }}
          </p>
          <p>{{ currentPost.summary }}</p>
          <p>
            <span class="status-pill" [class]="'status-pill ' + currentPost.outcome">{{ currentPost.outcome }}</span>
          </p>
        </header>

        <section class="card page-section">
          <h2>交易重點</h2>
          <p class="meta">方向：{{ currentPost.direction }} · PnL(R)：{{ currentPost.pnlR }}</p>

          <h3>錯誤</h3>
          <ul>
            @for (item of currentPost.mistakes; track item) {
              <li>{{ item }}</li>
            }
          </ul>

          <h3>改進</h3>
          <ul>
            @for (item of currentPost.lessons; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        </section>

        <section class="card page-section">
          <h2>內容</h2>
          <div class="article-content">{{ currentPost.content }}</div>
        </section>

        <p><a class="btn-link" routerLink="/reviews">回覆盤列表</a></p>
      </article>
    } @else {
      <section class="card page-section">
        <h1>找不到這篇覆盤</h1>
        <p>請回覆盤列表確認連結。</p>
        <a class="btn-link" routerLink="/reviews">回覆盤列表</a>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ContentRepository);

  protected readonly post = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug');
    return slug ? this.repository.findReviewBySlug(slug) : undefined;
  });
}
