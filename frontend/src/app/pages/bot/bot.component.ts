import { Component, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CatalogService, CatalogItem } from '../../services/catalog.service';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.interface';

@Component({
  selector: 'app-bot', standalone: true, imports: [NgIf, NgFor, RouterLink],
  template: `
    <section class="simple-page bot-page">
      <div class="bot-heading"><img src="assets/bot.png" width="64" height="64" alt=""><h1>Bot de ayuda</h1></div>
      <p>Elige una opción para recibir ayuda o encontrar una receta.</p>
      <button *ngIf="!started" class="button button-dark" type="button" (click)="start()">{{ finished ? 'Volver a iniciar' : 'Iniciar' }}</button>
      <p class="bot-message" role="status" aria-live="polite">{{ message }}</p>
      <div *ngIf="started" class="bot-options">
        <button class="button" type="button" (click)="help('publish')">¿Cómo publico una receta?</button>
        <button class="button" type="button" (click)="help('search')">¿Cómo busco una receta por nombre?</button>
        <button class="button" type="button" (click)="help('contact')">¿Dónde reporto un problema?</button>
        <button class="button" type="button" [disabled]="loading" (click)="chooseType()">Sugerir una comida</button>
      </div>
      <a *ngIf="destination" class="back-link" [routerLink]="destination">{{ linkLabel }}</a>
      <div class="bot-options" *ngIf="showTypes && !loading">
        <button class="button button-dark" type="button" *ngFor="let type of types" (click)="suggest(type.name)">{{ type.name }}</button>
      </div>
      <div class="bot-suggestion" *ngIf="suggestion">
        <h2>{{ suggestion.title }}</h2><p>{{ suggestion.description }}</p>
        <a class="button button-dark" [routerLink]="['/recipes', suggestion.id]">Ver receta</a>
      </div>
      <button *ngIf="started" class="button bot-end" type="button" (click)="end()">No necesito más ayuda</button>
    </section>
  `,
})
export class BotComponent implements OnDestroy {
  started = false; finished = false; loading = false; showTypes = false;
  message = ''; destination = ''; linkLabel = '';
  types: CatalogItem[] = [];
  suggestion?: Recipe;
  private request?: Subscription;
  constructor(private readonly catalog: CatalogService, private readonly recipes: RecipeService) {}
  start() {
    this.clear(); this.started = true; this.finished = false;
    this.message = '¡Hola! ¿En qué puedo ayudarte?';
  }
  help(topic: 'publish' | 'search' | 'contact') {
    this.clear();
    if (topic === 'publish') {
      this.message = 'Inicia sesión en Perfil. Después entra en Publicar, completa los campos y pulsa Publicar receta.';
      this.destination = '/publicar'; this.linkLabel = 'Ir a Publicar';
    } else if (topic === 'search') {
      this.message = 'En Inicio escribe el nombre en Buscar por nombre y pulsa Buscar. En Comunidad también puedes filtrar los resultados.';
      this.destination = '/'; this.linkLabel = 'Ir a Inicio';
    } else {
      this.message = 'Puedes reportar un problema a contacto@example.com. Es el correo ficticio de contacto del proyecto.';
    }
  }
  chooseType() {
    this.clear(); this.loading = true; this.message = 'Consultando los tipos de comida…';
    this.request = this.catalog.getAll().subscribe({
      next: items => {
        this.loading = false; this.types = items.filter(item => item.kind === 'type'); this.showTypes = true;
        this.message = this.types.length ? '¿Qué tipo de comida prefieres?' : 'No encontré tipos de comida en el catálogo.';
      },
      error: response => { this.loading = false; this.message = response.status === 404 ? 'No encontré el catálogo de tipos de comida.' : 'No pude consultar el catálogo. Intenta de nuevo en unos momentos.'; },
    });
  }
  suggest(type: string) {
    this.clear(); this.loading = true; this.message = 'Buscando una receta…';
    this.request = this.recipes.getAll(type).subscribe({
      next: recipes => {
        this.loading = false;
        const matches = recipes.filter(recipe => recipe.recipeType === type);
        if (!matches.length) { this.message = 'No encontré recetas de ese tipo. Puedes elegir otro.'; return; }
        this.suggestion = matches[Math.floor(Math.random() * matches.length)];
        this.message = 'Te sugiero esta receta de ' + type.toLowerCase() + ':';
      },
      error: response => { this.loading = false; this.message = response.status === 404 ? 'No encontré recetas de ese tipo. Prueba con otro.' : 'No pude consultar las recetas. Intenta de nuevo en unos momentos.'; },
    });
  }
  end() { this.clear(); this.types = []; this.started = false; this.finished = true; this.message = '¡Gracias por visitar Food For My Soul! Hasta pronto.'; }
  private clear() { this.request?.unsubscribe(); this.loading = false; this.showTypes = false; this.suggestion = undefined; this.destination = ''; this.linkLabel = ''; }
  ngOnDestroy() { this.request?.unsubscribe(); }
}
