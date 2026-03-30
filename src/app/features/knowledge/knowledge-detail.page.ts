import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/content/content.repository';

@Component({
  selector: 'app-knowledge-detail-page',
  imports: [RouterLink],
  template: `
    @if (post(); as currentPost) {
      <article class="page-section">
        <header class="page-section">
          <h1 class="page-title">{{ currentPost.title }}</h1>
          <p class="meta">{{ currentPost.publishedAt }} · {{ currentPost.category }} · {{ currentPost.difficulty }}</p>
          <p>{{ currentPost.summary }}</p>
        </header>

        <section class="card page-section">
          <h2>內容</h2>
          <div class="article-content">{{ currentPost.content }}</div>
        </section>

        @if (currentPost.references.length > 0) {
          <section class="card page-section">
            <h2>參考資料</h2>
            <ul>
              @for (reference of currentPost.references; track reference) {
                <li>{{ reference }}</li>
              }
            </ul>
          </section>
        }

        <p><a class="btn-link" routerLink="/knowledge">回知識列表</a></p>
      </article>
    } @else {
      <section class="card page-section">
        <h1>找不到這篇知識文章</h1>
        <p>請回知識列表確認連結。</p>
        <a class="btn-link" routerLink="/knowledge">回知識列表</a>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KnowledgeDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ContentRepository);

  private readonly routeParamMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  protected readonly post = computed(() => {
    const slug = this.routeParamMap().get('slug');
    return slug ? this.repository.findKnowledgeBySlug(slug) : undefined;
  });
}
