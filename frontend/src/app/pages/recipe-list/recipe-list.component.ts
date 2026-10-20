import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RecipeCardComponent],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="eyebrow-dot"></span> RECETAS PARA COMPARTIR</span>
        <h1>Un poco de amor,<br><em>en cada bocado.</em></h1>
        <p>Ideas sencillas, sabores que reconfortan y recetas hechas para pasar de una cocina a otra.</p>
        <a class="button button-dark" href="#catalogo">Encuentra algo rico <span aria-hidden="true">↓</span></a>
      </div>
      <div class="hero-image" role="img" aria-label="Mesa cálida con platillos para compartir">
      </div>
    </section>

    <section id="catalogo" class="catalog-section">
      <div class="section-heading">
        <div><span class="eyebrow">UN RECETARIO PARA TODOS</span><h2>Algo rico <em>te espera.</em></h2></div>
        <p>Recetas sencillas para cocinar a tu ritmo<br>y disfrutar cada momento.</p>
      </div>

      <form class="search-form" (ngSubmit)="search()">
        <label for="recipe-search">Buscar por nombre</label>
        <input id="recipe-search" name="query" [(ngModel)]="query" placeholder="Ej. pasta">
        <button class="button button-dark" type="submit">Buscar</button>
      </form>

      <p class="loading-message" *ngIf="loading">Buscando recetas…</p>
      <div class="recipe-grid" *ngIf="!loading && recipes.length">
        <app-recipe-card *ngFor="let recipe of recipes" [recipe]="recipe" />
      </div>
      <p class="loading-message" *ngIf="!loading && !recipes.length">No hay recetas con ese nombre.</p>
      <p class="mock-note">Contenido de ejemplo para el prototipo; la publicación de recetas está pendiente.</p>
    </section>
  `,
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  allRecipes: Recipe[] = [];
  query = '';
  loading = true;

  constructor(private readonly recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getAll().subscribe((recipes) => {
      this.allRecipes = recipes;
      this.search();
      this.loading = false;
    });
  }

  search(): void {
    const text = this.query.trim().toLowerCase();
    this.recipes = this.allRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(text)
    );
  }
}
