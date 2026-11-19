import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Recipe } from '../../models/recipe.interface';
import { CatalogService } from '../../services/catalog.service';
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
        <app-recipe-card *ngFor="let recipe of recipes" [recipe]="recipe" />
      </div>
      <nav class="pagination" aria-label="Páginas del catálogo" *ngIf="!loading && recipes.length">
        <button class="button" type="button" [disabled]="page === 1" (click)="loadPage(page - 1)">Anterior</button>
        <span aria-live="polite">Página {{ page }} de {{ totalPages }}</span>
        <button class="button" type="button" [disabled]="page === totalPages" (click)="loadPage(page + 1)">Siguiente</button>
      </nav>
      <p class="loading-message" *ngIf="!loading && !error && !recipes.length">No hay recetas en esta categoría.</p>
    </section>
  `,
})
export class CommunityComponent implements OnInit, OnDestroy {
  private request?: Subscription;
  recipes: Recipe[] = [];
  categories: string[] = []; types: string[] = []; tags: string[] = [];
  selectedCategory = ''; selectedType = ''; selectedTag = ''; query = '';
  page = 1; totalPages = 1;
  private filters = { q: '', category: '', type: '', tag: '' };
  loading = true;
  error = '';

  constructor(private readonly recipeService: RecipeService, private readonly catalog: CatalogService) {}

  ngOnInit(): void {
    this.catalog.getAll().subscribe({
      next: items => {
        this.categories = items.filter(item => item.kind === 'category').map(item => item.name);
        this.types = items.filter(item => item.kind === 'type').map(item => item.name);
        this.tags = items.filter(item => item.kind === 'tag').map(item => item.name);
      },
      error: () => this.error = 'No se pudieron cargar los filtros. Recarga la página.',
    });
    this.filterRecipes();
  }

  filterRecipes(): void {
    this.filters = { q: this.query, category: this.selectedCategory, type: this.selectedType, tag: this.selectedTag };
    this.loadPage(1);
  }

  ngOnDestroy() { this.request?.unsubscribe(); }

  loadPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.request?.unsubscribe();
    this.loading = true; this.error = '';
    const { q, category, type, tag } = this.filters;
    this.request = this.recipeService.getPage(page, q, category, type, tag).subscribe({
      next: result => {
        this.totalPages = result.totalPages;
        if (page > result.totalPages) { this.loadPage(result.totalPages); return; }
        this.recipes = result.data; this.page = result.page; this.loading = false;
      },
      error: () => { this.loading = false; this.recipes = []; this.error = 'No se pudieron cargar las recetas. Vuelve a aplicar el filtro.'; },
    });
  }
}
