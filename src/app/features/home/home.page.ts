import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <section class="home-landing-hero" aria-labelledby="home-landing-title">
      <div class="home-landing-hero__content">
        <h1 id="home-landing-title" class="home-landing-hero__title">從盤勢觀察到風險控管，建立你的交易決策框架</h1>
        <p class="home-landing-hero__description">
          聚焦交易覆盤與方法論整理，幫助你用結構化方式回顧盤勢、優化策略與落實風險控管。
        </p>

        <nav class="home-landing-hero__actions" aria-label="首頁主要行動">
          <a class="home-landing-hero__button home-landing-hero__button--primary" routerLink="/reviews"
            >前往交易覆盤</a
          >
          <a class="home-landing-hero__button home-landing-hero__button--secondary" routerLink="/knowledge"
            >前往交易知識</a
          >
        </nav>
      </div>

      <figure class="home-landing-hero__media">
        <img
          ngSrc="/images/trading-hero.svg"
          width="640"
          height="480"
          alt="顯示交易圖表、趨勢線與風險管理元素的示意圖"
          priority
        />
      </figure>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .home-landing-hero {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
      align-items: center;
      gap: clamp(1.5rem, 3vw, 3rem);
      padding-block: clamp(1.2rem, 2.5vw, 2.25rem);
    }

    .home-landing-hero__content {
      order: 1;
      display: grid;
      gap: 1rem;
      max-width: 62ch;
    }

    .home-landing-hero__kicker {
      margin: 0;
      font-size: 0.74rem;
      letter-spacing: 0.14em;
      font-weight: 700;
      color: #57534e;
    }

    .home-landing-hero__title {
      margin: 0;
      font-family: 'Playfair Display', 'Noto Serif TC', serif;
      font-size: clamp(1.8rem, 3vw, 2.55rem);
      line-height: 1.2;
      color: #0c0a09;
    }

    .home-landing-hero__description {
      margin: 0;
      line-height: 1.72;
      color: #57534e;
    }

    .home-landing-hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0.35rem;
    }

    .home-landing-hero__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.75rem;
      min-width: 9.5rem;
      padding: 0.6rem 0.98rem;
      border-radius: 0.92rem;
      border: 1px solid transparent;
      text-decoration: none;
      font-weight: 600;
      transition:
        background-color 180ms ease,
        color 180ms ease,
        border-color 180ms ease,
        transform 180ms ease,
        box-shadow 180ms ease;
    }

    .home-landing-hero__button:hover,
    .home-landing-hero__button:focus-visible {
      transform: translateY(-1px);
    }

    .home-landing-hero__button--primary {
      color: #ffffff;
      background: #a16207;
      border-color: transparent;
    }

    .home-landing-hero__button--primary:hover,
    .home-landing-hero__button--primary:focus-visible {
      color: #ffffff;
      background: #854d0e;
      border-color: transparent;
      box-shadow: 0 10px 20px rgb(161 98 7 / 24%);
    }

    .home-landing-hero__button--secondary {
      color: #1c1917;
      background: transparent;
      border-color: #a8a29e;
    }

    .home-landing-hero__button--secondary:hover,
    .home-landing-hero__button--secondary:focus-visible {
      color: #1c1917;
      background: #ede7df;
      border-color: #78716c;
      box-shadow: 0 8px 16px rgb(28 25 23 / 10%);
    }

    .home-landing-hero__media {
      order: 2;
      margin: 0;
      padding: clamp(0.65rem, 1.2vw, 1rem);
      border: 1px solid #d6d3d1;
      border-radius: 1.2rem;
      background: #ffffff;
      box-shadow: 0 16px 28px rgb(12 10 9 / 8%);
    }

    .home-landing-hero__media img {
      display: block;
      width: 100%;
      height: auto;
    }

    .home-landing-hero__button:focus-visible {
      outline: 3px solid #1c1917;
      outline-offset: 2px;
    }

    @media (max-width: 767px) {
      .home-landing-hero {
        grid-template-columns: 1fr;
        align-items: start;
      }

      .home-landing-hero__content {
        order: 1;
      }

      .home-landing-hero__media {
        order: 2;
      }

      .home-landing-hero__actions {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {}
