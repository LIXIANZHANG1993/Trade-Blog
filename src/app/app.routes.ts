import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { ContentRepository } from './core/content/content.repository';

const contentReadyResolver: ResolveFn<true> = async (): Promise<true> => {
  await inject(ContentRepository).loadAll();
  return true;
};

export const routes: Routes = [
  {
    path: '',
    title: '首頁 | Trade Blog',
    resolve: { ready: contentReadyResolver },
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage)
  },
  {
    path: 'reviews',
    title: '交易覆盤 | Trade Blog',
    resolve: { ready: contentReadyResolver },
    loadComponent: () =>
      import('./features/reviews/review-list.page').then((m) => m.ReviewListPage)
  },
  {
    path: 'reviews/:slug',
    title: '覆盤詳情 | Trade Blog',
    resolve: { ready: contentReadyResolver },
    loadComponent: () =>
      import('./features/reviews/review-detail.page').then((m) => m.ReviewDetailPage)
  },
  {
    path: 'knowledge',
    title: '交易知識 | Trade Blog',
    resolve: { ready: contentReadyResolver },
    loadComponent: () =>
      import('./features/knowledge/knowledge-list.page').then((m) => m.KnowledgeListPage)
  },
  {
    path: 'knowledge/:slug',
    title: '知識文章 | Trade Blog',
    resolve: { ready: contentReadyResolver },
    loadComponent: () =>
      import('./features/knowledge/knowledge-detail.page').then((m) => m.KnowledgeDetailPage)
  },
  {
    path: 'tags/:tag',
    title: '標籤文章 | Trade Blog',
    resolve: { ready: contentReadyResolver },
    loadComponent: () => import('./features/tags/tag.page').then((m) => m.TagPage)
  },
  {
    path: 'about',
    title: '關於我 | Trade Blog',
    loadComponent: () => import('./features/about/about.page').then((m) => m.AboutPage)
  },
  {
    path: '**',
    title: '找不到頁面 | Trade Blog',
    loadComponent: () => import('./features/not-found/not-found.page').then((m) => m.NotFoundPage)
  }
];
