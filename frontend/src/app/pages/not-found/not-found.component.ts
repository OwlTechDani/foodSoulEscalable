import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="empty-state">
      <span class="eyebrow">ERROR 404</span>
      <h1>Esta mesa<br><em>está vacía.</em></h1>
      <p>La página que buscas no está aquí. Regresemos a las recetas.</p>
      <a class="button button-dark" routerLink="/recipes">Ir al catálogo</a>
    </section>
  `,
})
export class NotFoundComponent {}
