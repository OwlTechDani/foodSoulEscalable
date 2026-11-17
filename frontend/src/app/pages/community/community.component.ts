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
      <h1>Comunidad</h1>
      <p class="page-lead">Descubre recetas compartidas por otras personas y encuentra tu próxima preparación.</p>

      <form class="filter-form" (ngSubmit)="filterRecipes()">
        <label for="community-search">Buscar por nombre</label>
        <input id="community-search" name="query" [(ngModel)]="query">
        <label for="category-filter">Filtrar por categoría</label>
        <select id="category-filter" name="category" [(ngModel)]="selectedCategory">
          <option value="">Todas las categorías</option>
          <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
        </select>
        <label for="type-filter">Tipo</label><select id="type-filter" name="type" [(ngModel)]="selectedType"><option value="">Todos los tipos</option><option *ngFor="let type of types" [value]="type">{{ type }}</option></select>
        <label for="tag-filter">Etiqueta</label><select id="tag-filter" name="tag" [(ngModel)]="selectedTag"><option value="">Todas las etiquetas</option><option *ngFor="let tag of tags" [value]="tag">{{ tag }}</option></select>
        <button class="button button-dark" type="submit">Aplicar filtro</button>
      </form>

      <p class="form-error" role="alert" *ngIf="error">{{ error }}</p>
      <p class="loading-message" *ngIf="loading">Cargando recetas…</p>
      <div class="recipe-grid" *ngIf="!loading && recipes.length">
        <app-recipe-card *ngFor="let recipe of visibleRecipes" [recipe]="recipe" />
      </div>
      <nav class="pagination" aria-label="Páginas del catálogo" *ngIf="!loading && recipes.length">
        <button class="button" type="button" [disabled]="page === 1" (click)="page = page - 1">Anterior</button>
        <span aria-live="polite">Página {{ page }} de {{ totalPages }}</span>
        <button class="button" type="button" [disabled]="page === totalPages" (click)="page = page + 1">Siguiente</button>
      </nav>
      <p class="loading-message" *ngIf="!loading && !error && !recipes.length">No hay recetas en esta categoría.</p>
    </section>
  `,
})
export class CommunityComponent implements OnInit {
  allRecipes: Recipe[] = [];
  recipes: Recipe[] = [];
  categories: string[] = [];
  selectedCategory = '';
  selectedType = ''; selectedTag = ''; types: string[] = []; tags: string[] = [];
  query = '';
  page = 1;
  pageSize = 6;

  get totalPages(): number { return Math.max(1, Math.ceil(this.recipes.length / this.pageSize)); }
  get visibleRecipes(): Recipe[] { return this.recipes.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }
  loading = true;
  error = '';

  constructor(private readonly recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getAll().subscribe({ next: (recipes) => {
      this.allRecipes = recipes;
      for (const recipe of recipes) {
        if (!this.categories.includes(recipe.category)) {
          this.categories.push(recipe.category);
        }
      }
      this.types = [...new Set(recipes.map(r => r.recipeType).filter(Boolean))];
      this.tags = [...new Set(recipes.flatMap(r => r.tags || []))];
      this.filterRecipes();
      this.loading = false;
    }, error: () => { this.loading = false; this.error = 'No se pudieron cargar las recetas. Comprueba que la API esté encendida y recarga la página.'; } });
  }

  filterRecipes(): void {
    this.page = 1;
    this.recipes = this.allRecipes.filter((recipe) =>
      (!this.selectedCategory || recipe.category === this.selectedCategory) && (!this.selectedType || recipe.recipeType === this.selectedType) && (!this.selectedTag || recipe.tags.includes(this.selectedTag)) && recipe.title.toLowerCase().includes(this.query.trim().toLowerCase())
    );
  }
}
