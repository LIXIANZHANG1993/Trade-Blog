import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/content/content.repository';
import { ReviewPost } from '../../core/content/content.types';

@Component({
  selector: 'app-review-list-page',
  imports: [FormsModule, RouterLink, NgOptimizedImage],
  host: {
    class: 'review-list-page'
  },
  template: `
    <section class="page-section content-toolbar">
      <div class="content-toolbar__copy">
        <p class="content-toolbar__eyebrow">Trade Journal</p>
        <h2 class="page-title">交易覆盤</h2>
        <p class="page-subtitle">依照市場、標籤與結果快速回顧交易決策。</p>
      </div>

      <form class="content-toolbar__search-row" role="search" aria-label="搜尋覆盤文章">
        <label class="content-toolbar__search-input-wrap" for="reviews-search-input">
          <span class="content-toolbar__search-icon" aria-hidden="true"></span>
          <span class="content-toolbar__sr-only">搜尋關鍵字</span>
          <input
            id="reviews-search-input"
            class="content-toolbar__search-input"
            type="search"
            [ngModel]="query()"
            (ngModelChange)="query.set($event)"
            name="query"
            placeholder="搜尋標題、策略、市場"
          />
        </label>

      </form>
    </section>

    <section class="page-section">
      <div class="reviews-result-meta">
        <p class="meta">共 {{ filteredPosts().length }} 筆覆盤</p>
      </div>
    </section>

    <section class="page-section">
        <div class="reviews-grid">
        @for (post of filteredPosts(); track post.slug) {
          <article class="review-card">
            <a class="review-card__image-link" [routerLink]="['/reviews', post.slug]" [attr.aria-label]="post.title">
              <img
                class="review-card__image"
                [ngSrc]="post.imagePath"
                [alt]="post.title + ' 當日走勢圖'"
                width="1200"
                height="675"
              />
            </a>

            <header class="review-card__header">
              <h3 class="review-card__title">
                <a class="review-card__title-link" [routerLink]="['/reviews', post.slug]">{{ post.title }}</a>
              </h3>
            </header>

            <p class="review-card__meta">{{ post.publishedAt }} · {{ post.market }}</p>
            <p class="review-card__summary">{{ post.summary }}</p>

            <ul class="review-card__tag-list">
              @for (tag of post.tags; track tag) {
                <li><a class="review-card__tag" [routerLink]="['/tags', tag]">#{{ tag }}</a></li>
              }
            </ul>

            <p class="review-card__action">
              <a class="review-card__link" [routerLink]="['/reviews', post.slug]">查看詳情</a>
            </p>
          </article>
        } @empty {
          <article class="review-card review-card--empty">
            <h2>找不到符合條件的覆盤</h2>
            <p>請調整關鍵字或篩選條件。</p>
          </article>
        }
      </div>
    </section>
  `,
  styleUrl: './review-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewListPage {
  private readonly repository = inject(ContentRepository);

  protected readonly query = signal('');
  protected readonly posts = this.repository.reviewPosts;

  protected readonly filteredPosts = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    return this.posts().filter((post) => this.matchesQuery(post, normalizedQuery));
  });

  private matchesQuery(post: ReviewPost, query: string): boolean {
    if (query.length === 0) {
      return true;
    }

    const normalizedDateQuery = query.replace(/[^\d]/g, '');
    const normalizedDate = post.publishedAt.replace(/[^\d]/g, '');

    return (
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.market.toLowerCase().includes(query) ||
      post.publishedAt.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      (normalizedDateQuery.length > 0 && normalizedDate.includes(normalizedDateQuery))
    );
  }
}
