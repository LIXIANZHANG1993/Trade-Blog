import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
  protected readonly title = signal('Trade Blog');

  protected readonly navLinks: readonly NavLink[] = [
    { path: '/', label: '首頁' },
    { path: '/reviews', label: '交易覆盤' },
    { path: '/knowledge', label: '交易知識' },
    { path: '/about', label: '關於我' }
  ];
}
