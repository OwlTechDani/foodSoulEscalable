import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="simple-page simple-page-short">
      <h1>Asistente de IA</h1>
      <p class="page-lead">El asistente de cocina todavía no está disponible.</p>
      <a class="button button-dark" routerLink="/">Explorar recetas</a>
    </section>
  `,
})
export class AiComponent {}
