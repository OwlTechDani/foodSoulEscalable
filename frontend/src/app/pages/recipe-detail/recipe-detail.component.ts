import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <section class="detail-page" *ngIf="recipe; else missing">
      <a class="back-link" routerLink="/recipes">← Volver a todas las recetas</a>
      <div class="detail-hero">
        <div class="detail-copy">
          <span class="eyebrow">{{ recipe.category }} · {{ recipe.prepMinutes }} MIN</span>
          <h1>{{ recipe.title }}<em>.</em></h1>
          <p>{{ recipe.description }}</p>
          <span class="detail-author">Una receta de <strong>{{ recipe.author }}</strong></span>
        </div>
        <img [src]="recipe.imageUrl" [alt]="recipe.title">
      </div>
      <div class="recipe-content">
        <section><span class="eyebrow">LO QUE VAS A NECESITAR</span><h2>Ingredientes</h2>
          <ul class="ingredient-list"><li *ngFor="let ingredient of recipe.ingredients"><span>✳</span>{{ ingredient }}</li></ul>
        </section>
        <section><span class="eyebrow">PASO A PASO</span><h2>Manos a la obra</h2>
          <ol class="step-list"><li *ngFor="let step of recipe.steps; let i = index"><span>{{ i + 1 }}</span><p>{{ step }}</p></li></ol>
        </section>
      </div>
      <aside class="future-note"><span>✳</span><p>Los comentarios y la publicación de recetas estarán disponibles en una siguiente etapa del proyecto.</p></aside>
    </section>
    <ng-template #missing><section class="empty-state"><span class="eyebrow">RECETA NO DISPONIBLE</span><h1>No encontramos<br><em>esa receta.</em></h1><a class="button button-dark" routerLink="/recipes">Volver al catálogo</a></section></ng-template>
  `,
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;

  constructor(private readonly route: ActivatedRoute, private readonly recipeService: RecipeService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.recipeService.getById(id).subscribe((recipe) => { this.recipe = recipe; });
  }
}
