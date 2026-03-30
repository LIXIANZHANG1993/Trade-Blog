import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

interface NavLink {
  readonly path: string;
  readonly label: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly router = inject(Router);

  protected readonly title = signal('Trade Blog');
  protected readonly currentYear = new Date().getFullYear();

  private readonly allNavLinks: readonly NavLink[] = [
    { path: '/', label: '首頁' },
    { path: '/reviews', label: '交易覆盤' },
    { path: '/knowledge', label: '交易知識' },
    { path: '/about', label: '關於我' }
  ];

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected readonly isHomePage = computed(() => this.normalizePath(this.currentUrl()) === '/');

  protected readonly navLinks = computed(() =>
    this.isHomePage() ? this.allNavLinks.filter((link) => link.path === '/about') : this.allNavLinks
  );

  private normalizePath(url: string): string {
    const path = url.split('?')[0]?.split('#')[0] ?? '/';
    return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  }
}
