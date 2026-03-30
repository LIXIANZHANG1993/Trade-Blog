import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <section class="card page-section">
      <h2 class="page-title">找不到頁面</h2>
      <p>你造訪的頁面不存在，可能是連結錯誤或文章已搬移。</p>
      <a class="btn-link" routerLink="/">回到首頁</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPage {}
