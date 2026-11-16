import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecipeService } from '../../services/recipe.service';
import { Subscription } from 'rxjs';
import { Recipe } from '../../models/recipe.interface';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
@Component({
  selector: 'app-profile', standalone: true, imports: [NgIf, NgFor, FormsModule, RouterLink, RecipeCardComponent],
  template: `
    <section class="simple-page">
      <span class="eyebrow">TU ESPACIO</span><h1>Perfil<em>.</em></h1>
      <p role="alert" class="form-error" *ngIf="error">{{ error }}</p>
      <ng-container *ngIf="user; else access">
        <h2>{{ user.name }}</h2><p>{{ user.email }}</p>
        <div class="recipe-actions">
          <a class="button button-dark" routerLink="/publicar">Publicar receta</a>
          <a class="button" routerLink="/admin" *ngIf="user.role === 'admin'">Administración</a>
          <button class="button" type="button" [disabled]="busy" (click)="logout()">Cerrar sesión</button>
        </div>
        <h2 class="profile-heading">Mis recetas</h2>
        <button class="button" type="button" (click)="loadRecipes()">Actualizar lista</button>
        <div class="recipe-grid"><app-recipe-card *ngFor="let recipe of recipes" [recipe]="recipe" /></div>
        <p *ngIf="!recipes.length">Todavía no has publicado recetas.</p>
      </ng-container>
      <ng-template #access>
        <h2>{{ registering ? 'Crear cuenta' : 'Iniciar sesión' }}</h2>
        <form class="publish-form" #form="ngForm" (ngSubmit)="submit(form)">
          <div class="form-field" *ngIf="registering"><label for="account-name">Nombre</label><input id="account-name" name="name" [(ngModel)]="name" required minlength="2" maxlength="80" autocomplete="name"></div>
          <div class="form-field"><label for="account-email">Correo electrónico</label><input id="account-email" type="email" name="email" [(ngModel)]="email" #mail="ngModel" required email maxlength="254" autocomplete="email"><small *ngIf="mail.invalid && mail.touched">Escribe un correo válido.</small></div>
          <div class="form-field"><label for="account-password">Contraseña</label><input id="account-password" type="password" name="password" [(ngModel)]="password" #pass="ngModel" required minlength="8" maxlength="128" [attr.autocomplete]="registering ? 'new-password' : 'current-password'"><small *ngIf="pass.invalid && pass.touched">Usa de 8 a 128 caracteres.</small></div>
          <button class="button button-dark" [disabled]="form.invalid || busy">{{ busy ? 'Procesando…' : (registering ? 'Registrarme' : 'Entrar') }}</button>
        </form>
        <button type="button" class="button" (click)="registering = !registering; error = ''">{{ registering ? 'Ya tengo cuenta' : 'Crear una cuenta' }}</button>
      </ng-template>
    </section>
  `,
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  name = ''; email = ''; password = ''; registering = false; busy = false; error = ''; recipes: Recipe[] = [];
  constructor(private readonly auth: AuthService, private readonly service: RecipeService) {}
  get user() { return this.auth.user; }
  ngOnInit() { this.subscription = this.auth.changes.subscribe(() => this.loadRecipes()); }
  ngOnDestroy() { this.subscription?.unsubscribe(); }
  loadRecipes() {
    if (!this.user) { this.recipes = []; return; }
    this.service.getAll().subscribe({ next: recipes => this.recipes = recipes.filter(r => r.owner === this.user?.id), error: () => this.error = 'No se pudieron cargar las recetas' });
  }
  submit(form: NgForm) {
    if (form.invalid || this.busy) return;
    this.busy = true; this.error = '';
    const request = this.registering ? this.auth.register(this.name, this.email, this.password) : this.auth.login(this.email, this.password);
    request.subscribe({ next: () => { this.busy = false; this.password = ''; this.loadRecipes(); }, error: response => { this.busy = false; this.error = response.error?.error || 'No se pudo conectar con el servidor'; } });
  }
  logout() {
    this.busy = true;
    this.auth.logout().subscribe({ next: () => { this.busy = false; this.recipes = []; }, error: () => { this.busy = false; this.error = 'No se pudo cerrar la sesión. Vuelve a intentar.'; } });
  }
}
