import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/content/content.repository';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <section class="page-section">
      <h1 class="page-title">交易部落格</h1>
      <p class="page-subtitle">
        專注記錄交易覆盤與交易知識，持續迭代紀律、風控與策略。
      </p>
    </section>

    @if (repository.error()) {
      <section class="card page-section" aria-live="polite">
        <h2>內容載入失敗</h2>
        <p>{{ repository.error() }}</p>
      </section>
    }

    <section class="page-section">
      <div class="controls" role="group" aria-label="快速導覽">
        <a class="btn-link" routerLink="/reviews">瀏覽交易覆盤</a>
        <a class="btn-link" routerLink="/knowledge">瀏覽交易知識</a>
      </div>
    </section>

    <section class="page-section">
      <h2>最新覆盤</h2>
      <div class="grid grid-3">
        @for (post of latestReviews(); track post.slug) {
          <article class="card">
            <h3>{{ post.title }}</h3>
            <p class="meta">{{ post.publishedAt }} · {{ post.market }} · {{ post.setup }}</p>
            <p>{{ post.summary }}</p>
            <a class="btn-link" [routerLink]="['/reviews', post.slug]">閱讀覆盤</a>
          </article>
        }
      </div>
    </section>

    <section class="page-section">
      <h2>最新知識</h2>
      <div class="grid grid-3">
        @for (post of latestKnowledge(); track post.slug) {
          <article class="card">
            <h3>{{ post.title }}</h3>
            <p class="meta">{{ post.publishedAt }} · {{ post.category }} · {{ post.difficulty }}</p>
            <p>{{ post.summary }}</p>
            <a class="btn-link" [routerLink]="['/knowledge', post.slug]">閱讀文章</a>
          </article>
        }
      </div>
    </section>

    <section class="page-section">
      <h2>熱門標籤</h2>
      <ul class="tag-list">
        @for (tag of topTags(); track tag) {
          <li><a class="tag-chip" [routerLink]="['/tags', tag]">#{{ tag }}</a></li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  protected readonly repository = inject(ContentRepository);

  protected readonly latestReviews = computed(() => this.repository.reviewPosts().slice(0, 3));
  protected readonly latestKnowledge = computed(() => this.repository.knowledgePosts().slice(0, 3));
  protected readonly topTags = computed(() => this.repository.allTags().slice(0, 10));
}
