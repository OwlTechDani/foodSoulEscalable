import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { RecipeSearchComponent } from '../../components/recipe-search/recipe-search.component';
import { CategoryFilterComponent } from '../../components/category-filter/category-filter.component';
import { KitchenNoteComponent } from '../../components/kitchen-note/kitchen-note.component';
@Component({
  selector: 'app-recipe-list', standalone: true,
  imports: [NgFor, NgIf, RecipeCardComponent, RecipeSearchComponent, CategoryFilterComponent, KitchenNoteComponent],
  template: `<section class="recipe-intro"><span class="eyebrow">FOOD FOR MY SOUL / EL RECETARIO</span><div class="intro-heading"><h1>Lo que se cocina,<br><em>se queda contigo.</em></h1><p>Un tablón de ideas para días de prisa,<br>mesas largas y antojos de casa.</p></div><app-recipe-search [query]="query" (search)="query = $event" /></section>
    <section class="catalog-section" aria-labelledby="catalog-title"><div class="board-heading"><h2 id="catalog-title">Para tu próxima comida</h2><span class="board-count" aria-live="polite">{{ filteredRecipes.length }} recetas</span></div>
      <app-category-filter [categories]="categories" [selected]="selectedCategory" (categoryChange)="selectedCategory = $event" />
      <p *ngIf="loading" role="status">Abriendo el recetario…</p>
      <div class="recipe-board" *ngIf="!loading && filteredRecipes.length"><app-recipe-card *ngFor="let recipe of filteredRecipes; let i = index" [recipe]="recipe" [portrait]="i % 2 === 0" /><app-kitchen-note number="01" title="Antes de encender la estufa" text="Lee los pasos y acomoda los ingredientes. Cocinar se disfruta más cuando todo está a la mano." /></div>
      <div *ngIf="!loading && !filteredRecipes.length" class="no-results"><h3>Por aquí todavía no hay recetas.</h3><p>Prueba otro ingrediente o vuelve a todas las categorías.</p><button type="button" (click)="resetFilters()">Limpiar búsqueda y filtros</button></div>
    </section>`
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  query = '';
  selectedCategory = 'Todas';
  loading = true;
  constructor(private readonly recipeService: RecipeService) {}
  get categories(): string[] { return ['Todas', ...new Set(this.recipes.map(recipe => recipe.category))]; }
  get filteredRecipes(): Recipe[] {
    const query = this.query.trim().toLocaleLowerCase('es');
    return this.recipes.filter(recipe =>
      (this.selectedCategory === 'Todas' || recipe.category === this.selectedCategory) &&
      (!query || [recipe.title, ...recipe.ingredients].join(' ').toLocaleLowerCase('es').includes(query))
    );
  }
  resetFilters(): void {
    this.query = '';
    this.selectedCategory = 'Todas';
  }
  ngOnInit(): void {
    this.recipeService.getAll().subscribe(recipes => { this.recipes = recipes; this.loading = false; });
  }
}
