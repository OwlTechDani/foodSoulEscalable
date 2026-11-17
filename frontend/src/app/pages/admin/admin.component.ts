import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { CatalogService, CatalogItem } from '../../services/catalog.service';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.interface';
@Component({
  selector: 'app-admin', standalone: true, imports: [NgIf, NgFor, FormsModule, RouterLink],
  template: `
    <section class="simple-page">
      <h1>Administración</h1>
      <p *ngIf="!allowed">Esta sección requiere una cuenta de administrador. <a routerLink="/perfil">Ir al perfil</a></p>
      <p role="alert" class="form-error" *ngIf="error">{{ error }}</p>
      <ng-container *ngIf="allowed">
        <h2>Catálogos</h2>
        <form class="filter-form" #form="ngForm" (ngSubmit)="save(form)">
          <label for="catalog-kind">Catálogo</label><select id="catalog-kind" name="kind" [(ngModel)]="kind"><option value="category">Categorías</option><option value="type">Tipos</option><option value="tag">Etiquetas</option></select>
          <label for="catalog-name">Nombre</label><input id="catalog-name" name="name" [(ngModel)]="name" required minlength="2" maxlength="60">
          <button class="button button-dark" [disabled]="form.invalid || busy">{{ editing ? 'Guardar cambios' : 'Agregar' }}</button>
          <button *ngIf="editing" class="button" type="button" (click)="editing = ''; name = ''">Cancelar edición</button>
        </form>
        <ul class="admin-list"><li *ngFor="let item of items"><span>{{ label(item.kind) }}: {{ item.name }}</span><button class="button" type="button" (click)="editing = item.id; kind = item.kind; name = item.name">Editar</button><button class="button" type="button" (click)="deleting = item.id">Eliminar</button><span *ngIf="deleting === item.id">¿Confirmar?<button class="button" type="button" [disabled]="busy" (click)="remove(item.id)">Sí, eliminar</button><button class="button" type="button" (click)="deleting = ''">Cancelar</button></span></li></ul>
        <h2>Usuarios</h2>
        <ul class="admin-list"><li *ngFor="let user of users"><span>{{ user.name }} · {{ user.email }}</span><label>Rol <select [(ngModel)]="user.role"><option value="user">Usuario</option><option value="admin">Administrador</option></select></label><label><input type="checkbox" [(ngModel)]="user.active"> Activo</label><button class="button" type="button" [disabled]="busy || user.id === currentId" (click)="saveUser(user)">Guardar usuario</button></li></ul>
        <h2>Recetas y moderación</h2>
        <p>Abre una receta para editar su contenido o moderar sus comentarios.</p>
        <ul class="admin-list"><li *ngFor="let recipe of recipes"><a [routerLink]="['/recipes', recipe.id]">{{ recipe.title }} · {{ recipe.author }}</a></li></ul>
      </ng-container>
    </section>
  `,
})
export class AdminComponent implements OnInit {
  items: CatalogItem[] = []; users: User[] = []; recipes: Recipe[] = [];
  kind = 'category'; name = ''; editing = ''; deleting = ''; busy = false; error = '';
  constructor(private readonly catalog: CatalogService, private readonly auth: AuthService, private readonly service: RecipeService) {}
  get allowed() { return this.auth.user?.role === 'admin'; }
  get currentId() { return this.auth.user?.id; }
  label(kind: string) { return kind === 'category' ? 'Categoría' : kind === 'tag' ? 'Etiqueta' : 'Tipo'; }
  ngOnInit() { this.load(); }
  load() {
    this.catalog.getAll().subscribe({ next: items => this.items = items, error: () => this.error = 'No se pudo cargar el catálogo' });
    this.catalog.users().subscribe({ next: users => this.users = users, error: response => this.error = response.error?.error || 'No se pudieron cargar los usuarios' });
    this.service.getAll().subscribe({ next: recipes => this.recipes = recipes, error: () => this.error = 'No se pudieron cargar las recetas' });
  }
  save(form: NgForm) {
    if (form.invalid || this.busy) return;
    this.busy = true; this.error = '';
    this.catalog.save({ kind: this.kind, name: this.name }, this.editing).subscribe({ next: () => { this.busy = false; this.editing = ''; this.name = ''; this.load(); }, error: response => { this.busy = false; this.error = response.error?.error || 'No se pudo guardar'; } });
  }
  remove(id: string) {
    this.busy = true; this.error = '';
    this.catalog.delete(id).subscribe({ next: () => { this.busy = false; this.deleting = ''; this.load(); }, error: response => { this.busy = false; this.error = response.error?.error || 'No se pudo eliminar'; } });
  }
  saveUser(user: User) {
    this.busy = true; this.error = '';
    this.catalog.updateUser(user).subscribe({ next: () => { this.busy = false; this.load(); }, error: response => { this.busy = false; this.error = response.error?.error || 'No se pudo actualizar el usuario'; } });
  }
}
