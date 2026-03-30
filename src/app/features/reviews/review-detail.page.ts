import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { ContentRepository } from '../../core/content/content.repository';

@Component({
  selector: 'app-review-detail-page',
  imports: [RouterLink, NgOptimizedImage],
  host: {
    class: 'review-detail-page'
  },
  template: `
    @if (post(); as currentPost) {
      <article class="page-section">
        <header class="page-section">
          <h1 class="page-title">{{ currentPost.title }}</h1>
          <p class="meta">{{ currentPost.publishedAt }} · {{ currentPost.market }}</p>
          <p>{{ currentPost.summary }}</p>
        </header>

        <section class="card page-section">
          <h2>當日走勢圖</h2>
          <img
            [ngSrc]="currentPost.imagePath"
            [alt]="currentPost.title + ' 當日走勢圖'"
            width="1400"
            height="900"
            style="width: 100%; height: auto; border-radius: 0.85rem; border: 1px solid var(--border);"
          />
        </section>

        <section #contentSection class="card page-section">
          <h2>內容</h2>
          <div class="article-content">
            @for (block of contentBlocks(currentPost.content); track block.trackId) {
              @switch (block.type) {
                @case ('h2') {
                  <h2>{{ block.text }}</h2>
                }
                @case ('h3') {
                  <h3>{{ block.text }}</h3>
                }
                @case ('ul') {
                  <ul>
                    @for (item of block.items; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                }
                @case ('quote') {
                  <blockquote>{{ block.text }}</blockquote>
                }
                @default {
                  <p>{{ block.text }}</p>
                }
              }
            }
          </div>
        </section>

        <a
          class="btn-link review-detail__back-link"
          [class.review-detail__back-link--visible]="showFloatingBack()"
          [style.bottom.px]="floatingBackBottom()"
          routerLink="/reviews"
          aria-label="返回覆盤列表"
        >
          <span class="review-detail__back-icon" aria-hidden="true">←</span>
          <span>回覆盤列表</span>
        </a>
      </article>
    } @else {
      <section class="card page-section">
        <h1>找不到這篇覆盤</h1>
        <p>請回覆盤列表確認連結。</p>
        <a class="btn-link" routerLink="/reviews">回覆盤列表</a>
      </section>
    }
  `,
  styleUrl: './review-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ContentRepository);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly contentSectionRef = viewChild<ElementRef<HTMLElement>>('contentSection');

  protected readonly showFloatingBack = signal(false);
  protected readonly floatingBackBottom = signal(20);

  private readonly onViewportChange = (): void => {
    this.updateFloatingBackVisibility();
  };

  protected readonly post = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug');
    return slug ? this.repository.findReviewBySlug(slug) : undefined;
  });

  protected readonly contentBlocks = (content: string): readonly ContentBlock[] => parseMarkdownBlocks(content);

  constructor() {
    window.addEventListener('scroll', this.onViewportChange, { passive: true });
    window.addEventListener('resize', this.onViewportChange);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', this.onViewportChange);
      window.removeEventListener('resize', this.onViewportChange);
    });

    queueMicrotask(() => this.updateFloatingBackVisibility());
  }

  private updateFloatingBackVisibility(): void {
    const contentSection = this.contentSectionRef()?.nativeElement;

    if (!contentSection || !this.post()) {
      this.showFloatingBack.set(false);
      return;
    }

    const scrollTop = window.scrollY || this.document.documentElement.scrollTop || 0;
    const revealOffset = 120;
    const contentTop = contentSection.getBoundingClientRect().top + scrollTop;
    const hasReachedContent = scrollTop + revealOffset >= contentTop;

    const footerElement = this.document.querySelector<HTMLElement>('.site-footer');
    const footerTop = footerElement?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
    const baseBottomOffset = 20;
    const footerOverlap = Math.max(0, window.innerHeight - footerTop + 12);

    this.floatingBackBottom.set(baseBottomOffset + footerOverlap);
    this.showFloatingBack.set(hasReachedContent);
  }
}

type ContentBlockType = 'p' | 'h2' | 'h3' | 'ul' | 'quote';

type ContentBlock =
  | { readonly type: 'p' | 'h2' | 'h3' | 'quote'; readonly text: string; readonly trackId: string }
  | { readonly type: 'ul'; readonly items: readonly string[]; readonly trackId: string };

function parseMarkdownBlocks(content: string): readonly ContentBlock[] {
  const lines = content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim());

  const blocks: ContentBlock[] = [];
  const paragraphBuffer: string[] = [];
  let index = 0;

  const flushParagraph = (): void => {
    if (paragraphBuffer.length === 0) {
      return;
    }

    blocks.push({
      type: 'p',
      text: paragraphBuffer.join(' '),
      trackId: `p-${index++}`
    });
    paragraphBuffer.length = 0;
  };

  for (const line of lines) {
    if (!line || line === '---') {
      flushParagraph();
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      blocks.push({ type: 'h2', text: line.slice(2).trim(), trackId: `h2-${index++}` });
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      blocks.push({ type: 'h2', text: line.slice(3).trim(), trackId: `h2-${index++}` });
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      blocks.push({ type: 'h3', text: line.slice(4).trim(), trackId: `h3-${index++}` });
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();

      const previous = blocks.at(-1);
      if (previous?.type === 'ul') {
        const mergedItems = [...previous.items, line.slice(2).trim()];
        blocks[blocks.length - 1] = { ...previous, items: mergedItems };
      } else {
        blocks.push({
          type: 'ul',
          items: [line.slice(2).trim()],
          trackId: `ul-${index++}`
        });
      }
      continue;
    }

    if (line.startsWith('>')) {
      flushParagraph();
      blocks.push({
        type: 'quote',
        text: line.replace(/^>\s?/, ''),
        trackId: `q-${index++}`
      });
      continue;
    }

    paragraphBuffer.push(line);
  }

  flushParagraph();
  return blocks;
}
