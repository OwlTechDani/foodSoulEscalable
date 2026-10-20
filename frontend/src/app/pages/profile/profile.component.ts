import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="simple-page simple-page-short">
      <span class="eyebrow">TU ESPACIO</span>
      <h1>Perfil<em>.</em></h1>
      <p class="page-lead">Más adelante podrás iniciar sesión y consultar aquí tus recetas publicadas. Aún no hay cuentas ni recetas personales guardadas.</p>
      <a class="button button-dark" routerLink="/comunidad">Ver la comunidad</a>
    </section>
  `,
})
export class ProfileComponent {}
