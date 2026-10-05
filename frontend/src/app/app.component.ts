import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="site-header">
      <a class="brand" routerLink="/recipes" aria-label="Food For My Soul, ir al catálogo">
        <span class="brand-mark">✳</span>
        <span>food for <em>my soul</em></span>
      </a>
      <nav aria-label="Navegación principal">
        <a routerLink="/recipes" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Recetas</a>
        <a class="nav-note" href="#proyecto">Una cocina compartida</a>
      </nav>
      <a class="header-action" routerLink="/recipes">Explorar <span aria-hidden="true">↗</span></a>
    </header>

    <main><router-outlet /></main>

    <footer id="proyecto" class="site-footer">
      <a class="brand footer-brand" routerLink="/recipes"><span class="brand-mark">✳</span><span>food for <em>my soul</em></span></a>
      <p>Recetas que se sienten como en casa.</p>
      <small>Prototipo académico · Food For My Soul</small>
    </footer>
  `,
})
export class AppComponent {}
