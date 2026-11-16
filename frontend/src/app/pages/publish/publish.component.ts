import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CatalogService, CatalogItem } from '../../services/catalog.service';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  template: `
    <section class="simple-page">
      <span class="eyebrow">COMPARTE TU COCINA</span>
      <h1>{{ id ? "Editar receta" : "Publicar" }}<em>.</em></h1>
      <p *ngIf="!user">Para compartir una receta, <a routerLink="/perfil">inicia sesión o crea una cuenta</a>.</p>

      <p role="alert" class="form-error" *ngIf="error">{{ error }}</p>
      <p *ngIf="loading">Cargando receta…</p>
      <form *ngIf="user && !loading && !loadFailed" class="publish-form" #recipeForm="ngForm" (ngSubmit)="save(recipeForm)">
        <div class="form-field">
          <label for="recipe-title">Título de la receta</label>
          <input id="recipe-title" maxlength="120" name="title" [(ngModel)]="draft.title" #title="ngModel" required minlength="3">
          <small *ngIf="title.invalid && title.touched">Escribe al menos 3 caracteres.</small>
        <small role="alert" *ngIf="fieldErrors['title']">{{ fieldErrors['title'] }}</small>
        </div>
        <div class="form-field">
          <label for="recipe-description">Descripción</label>
          <textarea id="recipe-description" name="description" [(ngModel)]="draft.description" #description="ngModel" required minlength="10" rows="3"></textarea>
          <small *ngIf="description.invalid && description.touched">Escribe al menos 10 caracteres.</small>
        <small role="alert" *ngIf="fieldErrors['description']">{{ fieldErrors['description'] }}</small>
        </div>
        <div class="form-field">
          <label for="recipe-image">Dirección de imagen (opcional)</label>
          <input id="recipe-image" name="imageUrl" [(ngModel)]="imageUrl" #image="ngModel" pattern="https?://.+" placeholder="https://...">
          <small *ngIf="image.invalid && image.touched">Usa una dirección que comience por http:// o https://.</small>
        <small role="alert" *ngIf="fieldErrors['imageUrl']">{{ fieldErrors['imageUrl'] }}</small>
        </div>
        <div class="form-field"><label for="recipe-type">Tipo de receta</label><select id="recipe-type" name="recipeType" [(ngModel)]="draft.recipeType" required><option value="">Selecciona un tipo</option><option *ngFor="let item of types" [value]="item.name">{{ item.name }}</option></select><small *ngIf="fieldErrors['recipeType']">{{ fieldErrors['recipeType'] }}</small></div>
        <fieldset class="tag-options"><legend>Etiquetas</legend><label *ngFor="let item of tags"><input type="checkbox" [checked]="draft.tags.includes(item.name)" (change)="toggleTag(item.name)"> {{ item.name }}</label><small *ngIf="fieldErrors['tags']">{{ fieldErrors['tags'] }}</small></fieldset>
        <div class="form-row">
          <div class="form-field">
            <label for="recipe-category">Categoría</label>
            <select id="recipe-category" name="category" [(ngModel)]="draft.category" #category="ngModel" required>
              <option value="">Selecciona una categoría</option>
              <option *ngFor="let item of categories" [value]="item.name">{{ item.name }}</option>
            </select>
            <small *ngIf="category.invalid && category.touched">Selecciona una categoría.</small>
          <small role="alert" *ngIf="fieldErrors['category']">{{ fieldErrors['category'] }}</small>
        </div>
          <div class="form-field">
            <label for="recipe-minutes">Tiempo de preparación (minutos)</label>
            <input id="recipe-minutes" type="number" name="prepMinutes" [(ngModel)]="draft.prepMinutes" #minutes="ngModel" required min="1" max="1440" step="1" pattern="[0-9]+">
            <small *ngIf="minutes.invalid && minutes.touched">Indica un número entero entre 1 y 1440.</small>
          <small role="alert" *ngIf="fieldErrors['prepMinutes']">{{ fieldErrors['prepMinutes'] }}</small>
        </div>
        </div>
        <div class="form-field">
          <label for="recipe-ingredients">Ingredientes (uno por línea)</label>
          <textarea id="recipe-ingredients" name="ingredients" [(ngModel)]="draft.ingredients" #ingredients="ngModel" required rows="5"></textarea>
          <small *ngIf="ingredients.invalid && ingredients.touched">Agrega los ingredientes.</small>
        <small role="alert" *ngIf="fieldErrors['ingredients']">{{ fieldErrors['ingredients'] }}</small>
        </div>
        <div class="form-field">
          <label for="recipe-steps">Preparación (un paso por línea)</label>
          <textarea id="recipe-steps" name="steps" [(ngModel)]="draft.steps" #steps="ngModel" required rows="5"></textarea>
          <small *ngIf="steps.invalid && steps.touched">Agrega los pasos.</small>
        <small role="alert" *ngIf="fieldErrors['steps']">{{ fieldErrors['steps'] }}</small>
        </div>
        <button class="button button-dark" type="submit" [disabled]="recipeForm.invalid || saving">{{ saving ? 'Guardando…' : (id ? 'Guardar cambios' : 'Publicar receta') }}</button>
        <a class="back-link" routerLink="/comunidad">Volver a Comunidad</a>
      </form>

    </section>
  `,
})
export class PublishComponent implements OnInit {
  draft = { title: '', description: '', recipeType: '', tags: [] as string[], category: '', prepMinutes: 1, ingredients: '', steps: '' };
  categories: CatalogItem[] = []; types: CatalogItem[] = []; tags: CatalogItem[] = [];
  get user() { return this.auth.user; }
  toggleTag(name: string) { this.draft.tags = this.draft.tags.includes(name) ? this.draft.tags.filter(tag => tag !== name) : [...this.draft.tags, name]; }
  id = '';
  imageUrl = '';
  loading = false;
  loadFailed = false;
  saving = false;
  error = '';
  fieldErrors: Record<string, string> = {};

  constructor(private readonly service: RecipeService, private readonly route: ActivatedRoute, private readonly router: Router, private readonly auth: AuthService, private readonly catalog: CatalogService) {}

  ngOnInit(): void {
    this.catalog.getAll().subscribe({ next: items => { this.categories = items.filter(i => i.kind === 'category'); this.types = items.filter(i => i.kind === 'type'); this.tags = items.filter(i => i.kind === 'tag'); }, error: () => this.error = 'No se pudieron cargar los catálogos' });
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
    if (!this.user || form.invalid || this.saving) return;
    const recipe = {
      ...this.draft, imageUrl: this.imageUrl,
      ingredients: this.draft.ingredients.split('\n').map(line => line.trim()).filter(line => line.length > 0),
      steps: this.draft.steps.split('\n').map(line => line.trim()).filter(line => line.length > 0),
    };
    this.error = '';
    this.fieldErrors = {};
    this.saving = true;
    const request = this.id ? this.service.update(this.id, recipe) : this.service.create(recipe);
    request.subscribe({
      next: saved => { this.saving = false; this.router.navigate(['/recipes', saved.id]); },
      error: response => {
        this.saving = false;
        this.fieldErrors = response.error?.errors || {};
        this.error = response.status === 400 ? 'Revisa los campos indicados.' : (response.error?.error || 'No se pudo guardar. Comprueba la conexión y vuelve a intentar.');
      },
    });
  }
}
