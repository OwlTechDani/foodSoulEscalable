import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../models/recipe.interface';
@Component({
  selector: 'app-recipe-card', standalone: true, imports: [RouterLink],
  template: `<article class="recipe-card" [class.portrait]="portrait"><a [routerLink]="['/recipes', recipe.id]">
    <div class="card-image-wrap"><img [src]="recipe.imageUrl" [alt]="recipe.title" loading="lazy"><span class="time-label">{{ recipe.prepMinutes }} min</span></div>
    <div class="card-copy"><span class="card-category">{{ recipe.category }}</span><h3>{{ recipe.title }}</h3><p>{{ recipe.description }}</p><div class="card-bottom"><span>{{ recipe.author }}</span><span class="card-arrow" aria-hidden="true">↗</span></div></div>
  </a></article>`
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
  @Input() portrait = false;
}
