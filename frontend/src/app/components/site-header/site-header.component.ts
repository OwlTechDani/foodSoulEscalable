import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-site-header', standalone: true, imports: [RouterLink, RouterLinkActive],
  template: `<header class="site-header">
    <a class="brand" routerLink="/recipes"><span class="brand-mark" aria-hidden="true">f.</span><span>food for<br><strong>my soul</strong></span></a>
    <nav aria-label="Principal"><a routerLink="/recipes" routerLinkActive="active">El recetario</a><a routerLink="/recipes" fragment="acerca">Sobre esta cocina</a></nav>
    <span class="header-caption">Una receta lleva a otra.</span>
  </header>`
})
export class SiteHeaderComponent {}
