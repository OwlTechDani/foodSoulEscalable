import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../models/recipe.interface';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a class="recipe-card" [routerLink]="['/recipes', recipe.id]">
      <div class="card-image-wrap">
        <img [src]="recipe.imageUrl" [alt]="recipe.title" loading="lazy">
        <span class="category-pill">{{ recipe.category }}</span>
      </div>
      <div class="card-copy">
        <div class="card-meta"><span>{{ recipe.prepMinutes }} min</span><span>·</span><span>por {{ recipe.author }}</span></div>
        <h3>{{ recipe.title }}</h3>
        <p>{{ recipe.description }}</p>
        <span class="card-link">Ver receta <span aria-hidden="true">↗</span></span>
      </div>
    </a>
  `,
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
}
