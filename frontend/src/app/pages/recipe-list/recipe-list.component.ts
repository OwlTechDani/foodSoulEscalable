import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RecipeCardComponent, RouterLink],
  template: `
    <section class="welcome-slider" aria-label="Imágenes de bienvenida">
      <a *ngIf="slide === 0" href="#recipe-search"><img src="assets/bienvenida.jpg" alt="Bienvenido a la comunidad. Explorar recetas."></a>
      <img *ngIf="slide === 1" src="assets/fest.jpg" alt="Foodies Fest, 24 de diciembre de 2026, en el Ángel de la Independencia. Información del evento.">
      <a *ngIf="slide === 2" routerLink="/bot"><img src="assets/cocinabot.jpg" alt="¿Tienes dudas sobre el sitio? Hablar con Cocina Bot."></a>
      <button type="button" class="slider-prev" aria-label="Imagen anterior" (click)="changeSlide(-1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>
      <button type="button" class="slider-next" aria-label="Imagen siguiente" (click)="changeSlide(1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>
    </section>

    <section id="catalogo" class="catalog-section">
      <div class="section-heading"><h2>Recetas</h2></div>

      <form class="search-form" (ngSubmit)="search()">
        <label for="recipe-search">Buscar por nombre</label>
        <input id="recipe-search" name="query" [(ngModel)]="query" placeholder="Ej. pasta">
        <button class="button button-dark" type="submit">Buscar</button>
      </form>

      <p class="form-error" role="alert" *ngIf="error">{{ error }}</p>
      <p class="loading-message" *ngIf="loading">Buscando recetas…</p>
      <div class="recipe-grid" *ngIf="!loading && recipes.length">
        <app-recipe-card *ngFor="let recipe of recipes" [recipe]="recipe" />
      </div>
      <p class="loading-message" *ngIf="!loading && !error && !recipes.length">No hay recetas con ese nombre.</p>
    </section>
  `,
})
export class RecipeListComponent implements OnInit {
  slide = 0;
  changeSlide(direction: number): void { this.slide = (this.slide + direction + 3) % 3; }

  recipes: Recipe[] = [];
  allRecipes: Recipe[] = [];
  query = '';
  loading = true;
  error = '';

  constructor(private readonly recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getAll().subscribe({ next: (recipes) => {
      this.allRecipes = recipes;
      this.search();
      this.loading = false;
    }, error: () => { this.loading = false; this.error = 'No se pudieron cargar las recetas. Comprueba que la API esté encendida y recarga la página.'; } });
  }

  search(): void {
    const text = this.query.trim().toLowerCase();
    this.recipes = this.allRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(text)
    );
  }
}
