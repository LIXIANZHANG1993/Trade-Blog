import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-knowledge-list-page',
  imports: [FormsModule],
  host: {
    class: 'knowledge-list-page'
  },
  template: `
    <section class="page-section reviews-toolbar">
      <div class="reviews-toolbar__copy">
        <p class="reviews-toolbar__eyebrow">Trade Journal</p>
        <h2 class="page-title">交易知識</h2>
        <p class="page-subtitle">整理風控、心態與流程化決策，建立穩定的交易系統。</p>
      </div>

      <form class="reviews-toolbar__search-row" role="search" aria-label="搜尋知識文章">
        <label class="reviews-toolbar__search-input-wrap" for="knowledge-search-input">
          <span class="reviews-toolbar__search-icon" aria-hidden="true"></span>
          <span class="reviews-toolbar__sr-only">搜尋關鍵字</span>
          <input
            id="knowledge-search-input"
            class="reviews-toolbar__search-input"
            type="search"
            [ngModel]="query()"
            (ngModelChange)="query.set($event)"
            name="query"
            placeholder="搜尋標題、分類、標籤"
          />
        </label>
      </form>
    </section>
  `,
  styleUrl: './knowledge-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KnowledgeListPage {
  protected readonly query = signal('');
}
