import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/content/content.repository';
import { KnowledgePost } from '../../core/content/content.types';

@Component({
  selector: 'app-knowledge-list-page',
  imports: [FormsModule, RouterLink],
  template: `
    <section class="page-section">
      <h2 class="page-title">交易知識</h2>
      <p class="page-subtitle">整理風控、心態與流程化決策，建立穩定的交易系統。</p>
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
            placeholder="搜尋標題、分類、標籤"
          />
        </label>
      </div>
    </section>

    <section class="page-section">
      <p class="meta">共 {{ filteredPosts().length }} 篇知識文章</p>
      <div class="grid grid-2">
        @for (post of filteredPosts(); track post.slug) {
          <article class="card">
            <h2>{{ post.title }}</h2>
            <p class="meta">{{ post.publishedAt }} · {{ post.category }} · {{ post.difficulty }}</p>
            <p>{{ post.summary }}</p>
            <ul class="tag-list">
              @for (tag of post.tags; track tag) {
                <li><a class="tag-chip" [routerLink]="['/tags', tag]">#{{ tag }}</a></li>
              }
            </ul>
            <p><a class="btn-link" [routerLink]="['/knowledge', post.slug]">閱讀文章</a></p>
          </article>
        } @empty {
          <article class="card">
            <h2>找不到符合條件的知識文章</h2>
            <p>請調整關鍵字後再試一次。</p>
          </article>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KnowledgeListPage {
  private readonly repository = inject(ContentRepository);

  protected readonly query = signal('');
  protected readonly posts = this.repository.knowledgePosts;

  protected readonly filteredPosts = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();

    return this.posts().filter((post) => this.matchesFilter(post, normalizedQuery));
  });

  private matchesFilter(post: KnowledgePost, query: string): boolean {
    return (
      query.length === 0 ||
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }
}
