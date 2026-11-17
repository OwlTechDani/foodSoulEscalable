import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="site-header">
      <a class="brand" routerLink="/" aria-label="Food For My Soul, ir al inicio">
        <img class="brand-logo" src="assets/logo.png" alt="Food For My Soul">
      </a>
      <nav aria-label="Navegación principal">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
        <a routerLink="/comunidad" routerLinkActive="active">Comunidad</a>
        <a routerLink="/publicar" routerLinkActive="active">Publicar</a>
        <a routerLink="/bot" routerLinkActive="active">Bot</a>
        <a routerLink="/perfil" routerLinkActive="active">Perfil</a>
      </nav>
    </header>

    <main><router-outlet /></main>

    <footer class="site-footer">
      <a class="footer-logo" routerLink="/"><img src="assets/logo.png" alt="Food For My Soul, inicio"></a>
      <div>
        <p class="footer-title">Síguenos</p>
        <nav class="social-links" aria-label="Redes sociales">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 22v-9h3l.5-4H14V7c0-1 .4-2 2-2h2V1h-3c-4 0-6 2-6 6v2H6v4h3v9z"/></svg></a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2h5l5 7 6-7h2l-7 9 8 11h-5l-6-8-7 8H2l8-10zm3 2 12 16h2L7 4z"/></svg></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6" r="1"/></svg></a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="4"/><path d="m10 8 7 4-7 4z" fill="var(--green)"/></svg></a>
          <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><svg viewBox="0 0 24 24" aria-hidden="true"><text x="5" y="20" font-size="25" font-family="Georgia" font-weight="bold">p</text></svg></a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2h4c0 3 2 5 5 5v4c-2 0-4-1-5-2v8a6 6 0 1 1-6-6v4a2 2 0 1 0 2 2z"/></svg></a>
          <a href="https://www.threads.net/" target="_blank" rel="noopener noreferrer" aria-label="Threads"><svg viewBox="0 0 24 24" aria-hidden="true"><text x="1" y="20" font-size="24" font-family="Arial">&#64;</text></svg></a>
          <a href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20 2 22l1-5a10 10 0 1 1 2 3z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 6c-4 3 3 11 7 11l2-3-3-1-1 1c-2-1-3-2-3-4l1-1z"/></svg></a>
        </nav>
      </div>
      <div class="footer-contact">
        <p class="footer-title">Contacto</p>
        <a href="mailto:contacto@example.com">contacto&#64;example.com</a>
        <span>Tel. 000 000 0000</span>
      </div>
    </footer>
  `,
})
export class AppComponent {}
