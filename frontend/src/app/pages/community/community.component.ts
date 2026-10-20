import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RecipeCardComponent],
  template: `
    <section class="simple-page">
      <span class="eyebrow">RECETAS DE LA COMUNIDAD</span>
      <h1>Comunidad<em>.</em></h1>
      <p class="page-lead">Explora las recetas disponibles. En esta etapa son ejemplos; las cuentas y los comentarios aún están pendientes.</p>

      <form class="filter-form" (ngSubmit)="filterRecipes()">
        <label for="category-filter">Filtrar por categoría</label>
        <select id="category-filter" name="category" [(ngModel)]="selectedCategory">
          <option value="">Todas las categorías</option>
          <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
        </select>
        <button class="button button-dark" type="submit">Aplicar filtro</button>
      </form>

      <p class="loading-message" *ngIf="loading">Cargando recetas…</p>
      <div class="recipe-grid" *ngIf="!loading && recipes.length">
        <app-recipe-card *ngFor="let recipe of recipes" [recipe]="recipe" />
      </div>
      <p class="loading-message" *ngIf="!loading && !recipes.length">No hay recetas en esta categoría.</p>
    </section>
  `,
})
export class CommunityComponent implements OnInit {
  allRecipes: Recipe[] = [];
  recipes: Recipe[] = [];
  categories: string[] = [];
  selectedCategory = '';
  loading = true;

  constructor(private readonly recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getAll().subscribe((recipes) => {
      this.allRecipes = recipes;
      for (const recipe of recipes) {
        if (!this.categories.includes(recipe.category)) {
          this.categories.push(recipe.category);
        }
      }
      this.filterRecipes();
      this.loading = false;
    });
  }

  filterRecipes(): void {
    this.recipes = this.allRecipes.filter((recipe) =>
      !this.selectedCategory || recipe.category === this.selectedCategory
    );
  }
}
