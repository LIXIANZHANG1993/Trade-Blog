import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  template: `
    <section class="page-section">
      <h1 class="page-title">關於我</h1>
      <p class="page-subtitle">記錄交易過程、沉澱知識，讓每次虧損都轉成可執行的改進。</p>
    </section>

    <section class="card page-section">
      <h2>這個網站的目的</h2>
      <ul>
        <li>沉澱交易覆盤，找出決策中的可複製流程。</li>
        <li>把風控與交易知識整理成可回顧的知識庫。</li>
        <li>建立個人化交易系統，不斷迭代。</li>
      </ul>
    </section>

    <section class="card page-section">
      <h2>免責聲明</h2>
      <p>本站內容僅為個人學習與紀錄，不構成任何投資建議。交易有風險，請自行評估風險承受能力。</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutPage {}
