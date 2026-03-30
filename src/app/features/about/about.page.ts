import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface AboutSection {
  readonly kicker: string;
  readonly title: string;
  readonly description: string;
  readonly bullets: readonly string[];
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
}

@Component({
  selector: 'app-about-page',
  imports: [NgOptimizedImage, RouterLink],
  template: `
    <header class="about-hero page-section" aria-labelledby="about-title">
      <p class="about-hero__kicker">TRADER PROFILE</p>
      <h1 id="about-title" class="page-title">關於我：以風控為核心的專業交易者</h1>
      <p class="page-subtitle">
        我專注於建立可重複、可驗證、可迭代的交易系統。這個頁面不是單純自我介紹，而是我如何做決策、
        管理風險與持續精進交易流程的完整工作圖譜。
      </p>
    </header>

    <section class="about-sections page-section" aria-label="交易者專業能力區塊">
      @for (section of sections; track section.title; let index = $index) {
        <article class="about-section" [class.about-section--reverse]="index % 2 === 1">
          <figure class="about-section__media">
            <img
              [ngSrc]="section.imageSrc"
              [width]="section.imageWidth"
              [height]="section.imageHeight"
              [alt]="section.imageAlt"
              loading="lazy"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </figure>

          <div class="about-section__content">
            <p class="about-section__kicker">{{ section.kicker }}</p>
            <h2>{{ section.title }}</h2>
            <p class="about-section__description">{{ section.description }}</p>
            <ul class="about-section__list">
              @for (bullet of section.bullets; track bullet) {
                <li>{{ bullet }}</li>
              }
            </ul>
          </div>
        </article>
      }
    </section>

    <section class="about-cta card page-section" aria-labelledby="about-cta-title">
      <div>
        <h2 id="about-cta-title">想看我如何實際執行交易系統？</h2>
        <p>
          我會在交易覆盤中公開每筆交易的進出理由、失誤修正與下一步優化方向，
          在交易知識頁整理可複製的策略框架。
        </p>
        <div class="about-cta__actions">
          <a class="about-cta__nav-link" routerLink="/reviews" aria-label="前往交易覆盤列表">
            <span class="about-cta__nav-icon" aria-hidden="true">↩</span>
            <span>查看交易覆盤</span>
          </a>
          <a
            class="about-cta__nav-link about-cta__nav-link--secondary"
            routerLink="/knowledge"
            aria-label="前往交易知識列表"
          >
            <span class="about-cta__nav-icon" aria-hidden="true">↩</span>
            <span>閱讀交易知識</span>
          </a>
        </div>
      </div>

      <figure class="about-cta__media">
        <img
          ngSrc="/images/about/about-cta-system.svg"
          width="1200"
          height="800"
          alt="交易系統儀表板示意圖，包含策略模組、風險監控與覆盤流程"
          loading="lazy"
          sizes="(max-width: 900px) 100vw, 35vw"
        />
      </figure>
    </section>

    <section class="card page-section" aria-labelledby="disclaimer-title">
      <h2 id="disclaimer-title">免責聲明</h2>
      <p class="about-disclaimer__text">
        本站內容僅為個人研究與交易紀錄，不構成任何投資建議。市場波動與風險皆由交易者自行承擔，
        請務必依照自身風險承受度進行決策。
      </p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .about-hero {
      max-width: 80ch;
    }

    .about-hero__kicker {
      margin: 0 0 0.65rem;
      font-size: 0.74rem;
      letter-spacing: 0.15em;
      font-weight: 700;
      color: #57534e;
    }

    .about-sections {
      display: grid;
      gap: 1.3rem;
    }

    .about-section {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
      gap: 1.25rem;
      align-items: stretch;
      border: 1px solid #d6d3d1;
      border-radius: 1.15rem;
      padding: 1rem;
      background: linear-gradient(160deg, #ffffff, #f8f7f4);
      box-shadow: 0 12px 28px rgb(12 10 9 / 6%);
    }

    .about-section--reverse {
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    }

    .about-section--reverse .about-section__media {
      order: 2;
    }

    .about-section--reverse .about-section__content {
      order: 1;
    }

    .about-section__media {
      margin: 0;
      border-radius: 0.95rem;
      overflow: hidden;
      border: 1px solid #d6d3d1;
      background: #ffffff;
      min-height: 100%;
    }

    .about-section__media img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .about-section__content {
      display: grid;
      align-content: start;
      gap: 0.55rem;
      padding: 0.25rem 0.15rem;
    }

    .about-section__kicker {
      margin: 0;
      font-size: 0.74rem;
      letter-spacing: 0.12em;
      font-weight: 700;
      color: #57534e;
    }

    .about-section__content h2 {
      margin: 0;
      font-family: 'Playfair Display', 'Noto Serif TC', serif;
      line-height: 1.25;
      color: #0c0a09;
    }

    .about-section__description {
      margin: 0.1rem 0 0;
      line-height: 1.7;
      color: #57534e;
    }

    .about-section__list {
      margin: 0.2rem 0 0;
      padding-left: 1.1rem;
      display: grid;
      gap: 0.42rem;
      color: #1c1917;
      line-height: 1.6;
    }

    .about-cta {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
      gap: 1rem;
      align-items: center;
    }

    .about-cta p {
      margin: 0.7rem 0 0;
      color: #57534e;
      line-height: 1.7;
    }

    .about-cta__media {
      margin: 0;
      border-radius: 0.9rem;
      overflow: hidden;
      border: 1px solid #d6d3d1;
      background: #ffffff;
    }

    .about-cta__media img {
      display: block;
      width: 100%;
      height: auto;
    }

    .about-cta__actions {
      margin-top: 0.9rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
    }

    .about-cta__nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      text-decoration: none;
      padding: 0.64rem 1.02rem;
      border-radius: 0.92rem;
      border: 1px solid transparent;
      background: #a16207;
      color: #ffffff;
      font-weight: 700;
      min-height: 2.8rem;
      box-shadow: 0 10px 20px rgb(161 98 7 / 24%);
      transition:
        transform 180ms ease,
        box-shadow 180ms ease,
        background-color 180ms ease;
    }

    .about-cta__nav-link:hover,
    .about-cta__nav-link:focus-visible {
      background: #854d0e;
      box-shadow: 0 12px 24px rgb(161 98 7 / 30%);
      transform: translateY(-1px);
    }

    .about-cta__nav-link--secondary {
      background: #1c1917;
      box-shadow: 0 10px 20px rgb(28 25 23 / 24%);
    }

    .about-cta__nav-link--secondary:hover,
    .about-cta__nav-link--secondary:focus-visible {
      background: #292524;
      box-shadow: 0 12px 24px rgb(28 25 23 / 30%);
    }

    .about-cta__nav-icon {
      display: inline-grid;
      place-items: center;
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 999px;
      background: rgb(255 255 255 / 22%);
      color: #ffffff;
      font-size: 0.9rem;
      line-height: 1;
    }

    .about-cta__nav-link:focus-visible {
      outline: 3px solid #1c1917;
      outline-offset: 2px;
    }

    .about-cta__nav-link--secondary:focus-visible {
      background: #292524;
      outline-color: #1c1917;
      color: #ffffff;
    }

    .about-disclaimer__text {
      margin: 0.7rem 0 0;
      color: #57534e;
      line-height: 1.7;
    }

    @media (max-width: 900px) {
      .about-section,
      .about-section--reverse,
      .about-cta {
        grid-template-columns: 1fr;
      }

      .about-section--reverse .about-section__media,
      .about-section--reverse .about-section__content {
        order: initial;
      }

      .about-section__media img {
        height: auto;
      }

      .about-cta__actions {
        flex-direction: column;
        align-items: stretch;
      }

      .about-cta__actions .about-cta__nav-link {
        justify-content: center;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutPage {
  protected readonly sections: readonly AboutSection[] = [
    {
      kicker: 'TRADING PHILOSOPHY',
      title: '以系統思維建立交易優勢',
      description:
        '我的核心方法是先定義規則，再執行交易。只交易符合策略情境的機會，避免依賴盤中情緒判斷。',
      bullets: ['明確定義趨勢與結構條件', '訊號未成立不進場', '只做可量化風險的交易'],
      imageSrc: '/images/about/about-philosophy.svg',
      imageAlt: '交易儀表板示意圖，包含趨勢線與策略框架',
      imageWidth: 1200,
      imageHeight: 800
    },
    {
      kicker: 'RISK MANAGEMENT',
      title: '風險管理優先於報酬追求',
      description:
        '我將「先活下來」視為第一原則。每筆交易先定義停損與最大損失，再決定是否值得承擔風險。',
      bullets: ['固定單筆風險上限', '使用預設停損與部位大小', '連續虧損時降低曝險與交易頻率'],
      imageSrc: '/images/about/about-risk-management.svg',
      imageAlt: '風險管理儀表板示意圖，顯示停損界線與部位配置',
      imageWidth: 1200,
      imageHeight: 800
    },
    {
      kicker: 'EXECUTION DISCIPLINE',
      title: '執行紀律讓策略有統計意義',
      description:
        '策略是否有效，取決於執行是否一致。我使用交易前 checklist 與交易後檢核，維持樣本品質。',
      bullets: ['下單前檢查市場狀態與事件風險', '進出場完全依據計畫', '避免臨場追價與情緒加碼'],
      imageSrc: '/images/about/about-execution-discipline.svg',
      imageAlt: '交易執行流程示意圖，展示檢核清單與下單節奏',
      imageWidth: 1200,
      imageHeight: 800
    },
    {
      kicker: 'REVIEW & ITERATION',
      title: '透過覆盤，把經驗沉澱成方法',
      description:
        '我把每次交易結果拆解為可改善項目，將錯誤模式回寫到交易手冊，形成持續優化的閉環。',
      bullets: ['每週固定進行交易覆盤', '追蹤高勝率情境與常見失誤', '將改進方案落地到下一週計畫'],
      imageSrc: '/images/about/about-review-iteration.svg',
      imageAlt: '覆盤迭代看板示意圖，展示績效檢視與改進循環',
      imageWidth: 1200,
      imageHeight: 800
    }
  ];
}
