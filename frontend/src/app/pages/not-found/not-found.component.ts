import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="empty-state">
      <h1>Página no encontrada</h1>
      <p>Revisa la dirección o vuelve al catálogo.</p>
      <a class="button button-dark" routerLink="/">Ir al catálogo</a>
    </section>
  `,
})
export class NotFoundComponent {}
