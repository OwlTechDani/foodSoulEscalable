import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="site-header">
      <a class="brand" routerLink="/" aria-label="Food For My Soul, ir al inicio">
        <span class="brand-mark">✳</span>
        <span>food for <em>my soul</em></span>
      </a>
      <nav aria-label="Navegación principal">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
        <a routerLink="/comunidad" routerLinkActive="active">Comunidad</a>
        <a routerLink="/publicar" routerLinkActive="active">Publicar</a>
        <a routerLink="/ia" routerLinkActive="active">IA</a>
        <a routerLink="/perfil" routerLinkActive="active">Perfil</a>
      </nav>
    </header>

    <main><router-outlet /></main>

    <footer id="proyecto" class="site-footer">
      <a class="brand footer-brand" routerLink="/"><span class="brand-mark">✳</span><span>food for <em>my soul</em></span></a>
      <p>Recetas que se sienten como en casa.</p>
      <small>Prototipo académico · Food For My Soul</small>
    </footer>
  `,
})
export class AppComponent {}
