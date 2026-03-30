import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/content/content.repository';

@Component({
  selector: 'app-tag-page',
  imports: [RouterLink],
  template: `
    <section class="page-section">
      <h2 class="page-title">標籤：#{{ tag() }}</h2>
      <p class="page-subtitle">跨覆盤與知識文章的彙整。</p>
    </section>

    <section class="page-section">
      <h2>交易覆盤</h2>
      <div class="grid grid-2">
        @for (post of taggedReviews(); track post.slug) {
          <article class="card">
            <h3>{{ post.title }}</h3>
            <p class="meta">{{ post.publishedAt }} · {{ post.market }}</p>
            <p>{{ post.summary }}</p>
            <a class="btn-link" [routerLink]="['/reviews', post.slug]">閱讀覆盤</a>
          </article>
        } @empty {
          <article class="card"><p>此標籤尚無覆盤文章。</p></article>
        }
      </div>
    </section>

    <section class="page-section">
      <h2>交易知識</h2>
      <div class="grid grid-2">
        @for (post of taggedKnowledge(); track post.slug) {
          <article class="card">
            <h3>{{ post.title }}</h3>
            <p class="meta">{{ post.publishedAt }} · {{ post.category }}</p>
            <p>{{ post.summary }}</p>
            <a class="btn-link" [routerLink]="['/knowledge', post.slug]">閱讀文章</a>
          </article>
        } @empty {
          <article class="card"><p>此標籤尚無知識文章。</p></article>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagPage {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ContentRepository);

  protected readonly tag = computed(() => this.route.snapshot.paramMap.get('tag') ?? '');

  protected readonly taggedReviews = computed(() => {
    const selectedTag = this.tag();
    return this.repository.reviewPosts().filter((post) => post.tags.includes(selectedTag));
  });

  protected readonly taggedKnowledge = computed(() => {
    const selectedTag = this.tag();
    return this.repository.knowledgePosts().filter((post) => post.tags.includes(selectedTag));
  });
}
