import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [NgFor, NgIf, RecipeCardComponent],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="eyebrow-dot"></span> RECETAS PARA COMPARTIR</span>
        <h1>Un poco de amor,<br><em>en cada bocado.</em></h1>
        <p>Ideas sencillas, sabores que reconfortan y recetas hechas para pasar de una cocina a otra.</p>
        <a class="button button-dark" href="#catalogo">Encuentra algo rico <span aria-hidden="true">↓</span></a>
        <div class="hero-note"><span class="note-line"></span><span>Hecho para cocinar<br>y compartir</span></div>
      </div>
      <div class="hero-image" role="img" aria-label="Mesa cálida con platillos para compartir">
        <div class="hero-sticker"><span>cocina</span><strong>con<br>cariño</strong><span>siempre</span></div>
        <span class="hero-caption">Una mesa, muchas historias.</span>
      </div>
      <div class="hero-bottom"><span>01 — DESCUBRE</span><span>DESLIZA PARA INSPIRARTE ↓</span></div>
    </section>

    <section id="catalogo" class="catalog-section">
      <div class="section-heading">
        <div><span class="eyebrow">UN RECETARIO PARA TODOS</span><h2>Algo rico <em>te espera.</em></h2></div>
        <p>Recetas sencillas para cocinar a tu ritmo<br>y disfrutar cada momento.</p>
      </div>

      <div class="recipe-grid" *ngIf="recipes.length; else loading">
        <app-recipe-card *ngFor="let recipe of recipes" [recipe]="recipe" />
      </div>
      <ng-template #loading><p class="loading-message">Buscando recetas…</p></ng-template>
      <p class="mock-note">Contenido de ejemplo para el prototipo; pronto podrás compartir tus propias recetas.</p>
    </section>
  `,
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private readonly recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getAll().subscribe((recipes) => { this.recipes = recipes; });
  }
}
