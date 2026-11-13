import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [NgIf, FormsModule, RouterLink],
  template: `
    <section class="simple-page">
      <span class="eyebrow">COMPARTE TU COCINA</span>
      <h1>{{ id ? "Editar receta" : "Publicar" }}<em>.</em></h1>
      <p class="page-lead">Las recetas se guardan durante esta sesión del servidor y se pierden al reiniciarlo. Aún no hay cuentas ni permisos de autor.</p>

      <p role="alert" class="form-error" *ngIf="error">{{ error }}</p>
      <p *ngIf="loading">Cargando receta…</p>
      <form *ngIf="!loading && !loadFailed" class="publish-form" #recipeForm="ngForm" (ngSubmit)="save(recipeForm)">
        <div class="form-field">
          <label for="recipe-author">Autor</label>
          <input id="recipe-author" name="author" [(ngModel)]="draft.author" #author="ngModel" required minlength="2">
          <small *ngIf="author.invalid && author.touched">Escribe al menos 2 caracteres y evita un nombre vacío.</small>
        </div>
        <div class="form-field">
          <label for="recipe-title">Título de la receta</label>
          <input id="recipe-title" maxlength="120" name="title" [(ngModel)]="draft.title" #title="ngModel" required minlength="3">
          <small *ngIf="title.invalid && title.touched">Escribe al menos 3 caracteres.</small>
        </div>
        <div class="form-field">
          <label for="recipe-description">Descripción</label>
          <textarea id="recipe-description" name="description" [(ngModel)]="draft.description" #description="ngModel" required minlength="10" rows="3"></textarea>
          <small *ngIf="description.invalid && description.touched">Escribe al menos 10 caracteres.</small>
        </div>
        <div class="form-field">
          <label for="recipe-image">Dirección de imagen (opcional)</label>
          <input id="recipe-image" name="imageUrl" [(ngModel)]="imageUrl" #image="ngModel" pattern="https?://.+" placeholder="https://...">
          <small *ngIf="image.invalid && image.touched">Usa una dirección que comience por http:// o https://.</small>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label for="recipe-category">Categoría</label>
            <select id="recipe-category" name="category" [(ngModel)]="draft.category" #category="ngModel" required>
              <option value="">Selecciona una categoría</option>
              <option value="Desayuno">Desayuno</option>
              <option value="Comida">Comida</option>
              <option value="Vegetariana">Vegetariana</option>
              <option value="Cena">Cena</option>
              <option value="Postre">Postre</option>
            </select>
            <small *ngIf="category.invalid && category.touched">Selecciona una categoría.</small>
          </div>
          <div class="form-field">
            <label for="recipe-minutes">Tiempo de preparación (minutos)</label>
            <input id="recipe-minutes" type="number" name="prepMinutes" [(ngModel)]="draft.prepMinutes" #minutes="ngModel" required min="1" max="1440" step="1" pattern="[0-9]+">
            <small *ngIf="minutes.invalid && minutes.touched">Indica un número entero entre 1 y 1440.</small>
          </div>
        </div>
        <div class="form-field">
          <label for="recipe-ingredients">Ingredientes (uno por línea)</label>
          <textarea id="recipe-ingredients" name="ingredients" [(ngModel)]="draft.ingredients" #ingredients="ngModel" required rows="5"></textarea>
          <small *ngIf="ingredients.invalid && ingredients.touched">Agrega los ingredientes.</small>
        </div>
        <div class="form-field">
          <label for="recipe-steps">Preparación (un paso por línea)</label>
          <textarea id="recipe-steps" name="steps" [(ngModel)]="draft.steps" #steps="ngModel" required rows="5"></textarea>
          <small *ngIf="steps.invalid && steps.touched">Agrega los pasos.</small>
        </div>
        <button class="button button-dark" type="submit" [disabled]="recipeForm.invalid || saving">{{ saving ? 'Guardando…' : (id ? 'Guardar cambios' : 'Publicar receta') }}</button>
        <a class="back-link" routerLink="/comunidad">Volver a Comunidad</a>
      </form>

    </section>
  `,
})
export class PublishComponent implements OnInit {
  draft = { title: '', description: '', author: '', category: '', prepMinutes: 1, ingredients: '', steps: '' };
  id = '';
  imageUrl = '';
  loading = false;
  loadFailed = false;
  saving = false;
  error = '';

  constructor(private readonly service: RecipeService, private readonly route: ActivatedRoute, private readonly router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (!this.id) return;
    this.loading = true;
    this.service.getById(this.id).subscribe({
      next: recipe => {
        this.imageUrl = recipe.imageUrl;
        this.draft = { ...recipe, ingredients: recipe.ingredients.join('\n'), steps: recipe.steps.join('\n') };
        this.loading = false;
      },
      error: () => { this.error = 'No se pudo cargar la receta para editar.'; this.loading = false; this.loadFailed = true; },
    });
  }

  save(form: NgForm): void {
    if (form.invalid || this.saving) return;
    const recipe = {
      ...this.draft, imageUrl: this.imageUrl,
      ingredients: this.draft.ingredients.split('\n').map(line => line.trim()).filter(line => line.length > 0),
      steps: this.draft.steps.split('\n').map(line => line.trim()).filter(line => line.length > 0),
    };
    this.error = '';
    this.saving = true;
    const request = this.id ? this.service.update(this.id, recipe) : this.service.create(recipe);
    request.subscribe({
      next: saved => { this.saving = false; this.router.navigate(['/recipes', saved.id]); },
      error: response => {
        this.saving = false;
        this.error = response.status === 400 ? 'Revisa los textos: no deben estar vacíos; agrega ingredientes y pasos válidos.' : 'No se pudo guardar. Comprueba que la API esté encendida y vuelve a intentar.';
      },
    });
  }
}
