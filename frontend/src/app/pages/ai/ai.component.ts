import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="simple-page simple-page-short">
      <span class="eyebrow">IDEA PARA MÁS ADELANTE</span>
      <h1>Asistente de IA<em>.</em></h1>
      <p class="page-lead">El asistente de cocina aparece en la propuesta como una función futura. Esta versión todavía no genera sugerencias ni se conecta a un servicio de IA.</p>
      <a class="button button-dark" routerLink="/">Explorar recetas</a>
    </section>
  `,
})
export class AiComponent {}
