import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `
    <section class="simple-page">
      <span class="eyebrow">COMPARTE TU COCINA</span>
      <h1>Publicar<em>.</em></h1>
      <p class="page-lead">Prepara un borrador y revisa cómo se verá. Todavía no se guarda ni se envía al servidor.</p>

      <form class="publish-form" #recipeForm="ngForm" (ngSubmit)="review(recipeForm)">
        <div class="form-field">
          <label for="recipe-title">Título de la receta</label>
          <input id="recipe-title" name="title" [(ngModel)]="draft.title" #title="ngModel" required minlength="3">
          <small *ngIf="title.invalid && title.touched">Escribe al menos 3 caracteres.</small>
        </div>
        <div class="form-field">
          <label for="recipe-description">Descripción</label>
          <textarea id="recipe-description" name="description" [(ngModel)]="draft.description" #description="ngModel" required minlength="10" rows="3"></textarea>
          <small *ngIf="description.invalid && description.touched">Escribe al menos 10 caracteres.</small>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label for="recipe-category">Categoría</label>
            <select id="recipe-category" name="category" [(ngModel)]="draft.category" #category="ngModel" required>
              <option value="">Selecciona una categoría</option>
              <option value="Desayuno">Desayuno</option>
              <option value="Comida">Comida</option>
              <option value="Cena">Cena</option>
              <option value="Postre">Postre</option>
            </select>
            <small *ngIf="category.invalid && category.touched">Selecciona una categoría.</small>
          </div>
          <div class="form-field">
            <label for="recipe-minutes">Tiempo de preparación (minutos)</label>
            <input id="recipe-minutes" type="number" name="prepMinutes" [(ngModel)]="draft.prepMinutes" #minutes="ngModel" required min="1">
            <small *ngIf="minutes.invalid && minutes.touched">Indica al menos 1 minuto.</small>
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
        <button class="button button-dark" type="submit" [disabled]="recipeForm.invalid">Revisar borrador</button>
      </form>

      <section class="draft-preview" *ngIf="showPreview" aria-live="polite">
        <span class="eyebrow">VISTA PREVIA · SIN GUARDAR</span>
        <h2>{{ draft.title }}</h2>
        <p>{{ draft.description }}</p>
        <p><strong>Categoría:</strong> {{ draft.category }} · <strong>Tiempo:</strong> {{ draft.prepMinutes }} min</p>
        <h3>Ingredientes</h3>
        <p class="draft-lines">{{ draft.ingredients }}</p>
        <h3>Preparación</h3>
        <p class="draft-lines">{{ draft.steps }}</p>
      </section>
    </section>
  `,
})
export class PublishComponent {
  draft = {
    title: '',
    description: '',
    category: '',
    prepMinutes: 1,
    ingredients: '',
    steps: '',
  };
  showPreview = false;

  review(form: NgForm): void {
    if (form.valid) {
      this.showPreview = true;
    }
  }
}
