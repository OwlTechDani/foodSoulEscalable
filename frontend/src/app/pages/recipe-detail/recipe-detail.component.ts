import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <p class="simple-page" *ngIf="loading">Cargando receta…</p>
    <p class="simple-page form-error" role="alert" *ngIf="error">{{ error }}</p>
    <section class="detail-page" *ngIf="recipe">
      <a class="back-link" routerLink="/recipes">← Volver a todas las recetas</a>
      <div class="detail-hero">
        <div class="detail-copy">
          <span class="eyebrow">{{ recipe.category }} · {{ recipe.prepMinutes }} MIN</span>
          <h1>{{ recipe.title }}<em>.</em></h1>
          <p>{{ recipe.description }}</p>
          <span class="detail-author">Una receta de <strong>{{ recipe.author }}</strong></span>
        </div>
        <img *ngIf="recipe.imageUrl" [src]="recipe.imageUrl" [alt]="recipe.title">
      </div>
      <div class="recipe-content">
        <section><span class="eyebrow">LO QUE VAS A NECESITAR</span><h2>Ingredientes</h2>
          <ul class="ingredient-list"><li *ngFor="let ingredient of recipe.ingredients"><span>✳</span>{{ ingredient }}</li></ul>
        </section>
        <section><span class="eyebrow">PASO A PASO</span><h2>Manos a la obra</h2>
          <ol class="step-list"><li *ngFor="let step of recipe.steps; let i = index"><span>{{ i + 1 }}</span><p>{{ step }}</p></li></ol>
        </section>
      </div>
      <div class="recipe-actions">
        <a class="button button-dark" [routerLink]="['/recipes', recipe.id, 'editar']">Editar receta</a>
        <button class="button" type="button" (click)="confirmDelete = true">Eliminar receta</button>
      </div>
      <div class="future-note" *ngIf="confirmDelete">
        <p>¿Eliminar esta receta? Esta acción no se puede deshacer.</p>
        <button class="button" type="button" [disabled]="deleting" (click)="remove()">{{ deleting ? 'Eliminando…' : 'Confirmar eliminación' }}</button>
        <button class="button" type="button" [disabled]="deleting" (click)="confirmDelete = false">Cancelar</button>
      </div>
      <p class="mock-note">Modo de demostración sin cuentas: cualquier visitante puede editar. Los cambios duran hasta reiniciar el servidor.</p>
    </section>

  `,
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;
  loading = true;
  error = '';
  confirmDelete = false;
  deleting = false;

  constructor(private readonly route: ActivatedRoute, private readonly recipeService: RecipeService, private readonly router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.loading = false; this.error = 'Falta el identificador de la receta.'; return; }
    this.recipeService.getById(id).subscribe({
      next: recipe => { this.recipe = recipe; this.loading = false; },
      error: response => { this.loading = false; this.error = response.status === 404 ? 'No encontramos esa receta.' : 'No se pudo cargar la receta. Comprueba la conexión con la API.'; },
    });
  }

  remove(): void {
    if (!this.recipe || this.deleting) return;
    this.deleting = true;
    this.error = '';
    this.recipeService.delete(this.recipe.id).subscribe({
      next: () => { this.router.navigate(['/comunidad']); },
      error: () => { this.deleting = false; this.error = 'No se pudo eliminar. Vuelve a intentarlo.'; },
    });
  }
}
