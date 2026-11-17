import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RecipeComment } from '../../models/recipe.interface';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, FormsModule],
  template: `
    <p class="simple-page" *ngIf="loading">Cargando receta…</p>
    <p class="simple-page form-error" role="alert" *ngIf="error">{{ error }}</p>
    <section class="detail-page" *ngIf="recipe">
      <a class="back-link" routerLink="/recipes">← Volver a todas las recetas</a>
      <div class="detail-hero">
        <div class="detail-copy">
          <span class="recipe-meta">{{ recipe.category }} · {{ recipe.prepMinutes }} MIN</span>
          <h1>{{ recipe.title }}</h1>
          <p>{{ recipe.description }}</p>
          <span class="detail-author">Una receta de <strong>{{ recipe.author }}</strong></span>
        </div>
        <img *ngIf="recipe.imageUrl" [src]="recipe.imageUrl" [alt]="recipe.title">
      </div>
      <p>{{ recipe.recipeType }} · {{ recipe.tags.join(" · ") }}</p>
      <div class="recipe-content">
        <section><h2>Ingredientes</h2>
          <ul class="ingredient-list"><li *ngFor="let ingredient of recipe.ingredients">{{ ingredient }}</li></ul>
          <section class="comments-section">
        <h2>Comentarios</h2>
        <p *ngIf="!user">Para comentar, <a routerLink="/perfil">inicia sesión</a>.</p>
        <form class="publish-form" *ngIf="user" #commentForm="ngForm" (ngSubmit)="addComment()">
          <div class="form-field"><label for="comment-text">Tu comentario</label><textarea id="comment-text" name="text" [(ngModel)]="commentText" required maxlength="2000" rows="3"></textarea></div>
          <button class="button button-dark" [disabled]="commentForm.invalid || commentBusy">Comentar</button>
        </form>
        <p *ngIf="!recipe.comments?.length">Sé la primera persona en comentar.</p>
        <article class="comment-row" *ngFor="let comment of recipe.comments">
          <strong>{{ comment.author }}</strong><p>{{ comment.text }}</p>
          <div *ngIf="canManage(comment.owner)">
            <button class="button" type="button" (click)="editingComment = comment.id; editText = comment.text">Editar comentario</button>
            <button class="button" type="button" (click)="deletingComment = comment.id">Eliminar comentario</button>
          </div>
          <form *ngIf="editingComment === comment.id" #editForm="ngForm" (ngSubmit)="saveComment(comment)"><div class="form-field"><label [for]="'edit-' + comment.id">Editar comentario</label><textarea [id]="'edit-' + comment.id" name="editText" [(ngModel)]="editText" required maxlength="2000"></textarea></div><button class="button" [disabled]="editForm.invalid || commentBusy">Guardar comentario</button><button class="button" type="button" (click)="editingComment = ''">Cancelar</button></form>
          <div *ngIf="deletingComment === comment.id">¿Eliminar comentario?<button class="button" type="button" [disabled]="commentBusy" (click)="deleteComment(comment)">Confirmar</button><button class="button" type="button" (click)="deletingComment = ''">Cancelar</button></div>
        </article>
      </section>
    </section>
        <section><h2>Preparación</h2>
          <ol class="step-list"><li *ngFor="let step of recipe.steps; let i = index"><span>{{ i + 1 }}</span><p>{{ step }}</p></li></ol>
        </section>
      </div>
      <div class="recipe-actions" *ngIf="canManage(recipe.owner)">
        <a class="button button-dark" [routerLink]="['/recipes', recipe.id, 'editar']">Editar receta</a>
        <button class="button" type="button" (click)="confirmDelete = true">Eliminar receta</button>
      </div>
      <div class="future-note" *ngIf="confirmDelete">
        <p>¿Eliminar esta receta? Esta acción no se puede deshacer.</p>
        <button class="button" type="button" [disabled]="deleting" (click)="remove()">{{ deleting ? 'Eliminando…' : 'Confirmar eliminación' }}</button>
        <button class="button" type="button" [disabled]="deleting" (click)="confirmDelete = false">Cancelar</button>
      </div>
    </section>

  `,
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;
  commentText = ''; editText = ''; editingComment = ''; deletingComment = ''; commentBusy = false;
  get user() { return this.auth.user; }
  canManage(owner: string) { return this.auth.canManage(owner); }
  loading = true;
  error = '';
  confirmDelete = false;
  deleting = false;

  constructor(private readonly route: ActivatedRoute, private readonly recipeService: RecipeService, private readonly router: Router, private readonly auth: AuthService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.loading = false; this.error = 'Falta el identificador de la receta.'; return; }
    this.recipeService.getById(id).subscribe({
      next: recipe => { this.recipe = recipe; this.loading = false; },
      error: response => { this.loading = false; this.error = response.status === 404 ? 'No encontramos esa receta.' : 'No se pudo cargar la receta. Comprueba la conexión con la API.'; },
    });
  }

  addComment() {
    if (!this.recipe || this.commentBusy) return;
    this.commentBusy = true; this.error = '';
    this.recipeService.addComment(this.recipe.id, this.commentText).subscribe({ next: comments => { this.recipe!.comments = comments; this.commentText = ''; this.commentBusy = false; }, error: response => { this.commentBusy = false; this.error = response.error?.error || 'No se pudo comentar'; } });
  }
  saveComment(comment: RecipeComment) {
    if (!this.recipe || this.commentBusy) return;
    this.commentBusy = true; this.error = '';
    this.recipeService.updateComment(this.recipe.id, comment.id, this.editText).subscribe({ next: () => { comment.text = this.editText.trim(); this.editingComment = ''; this.commentBusy = false; }, error: response => { this.commentBusy = false; this.error = response.error?.error || 'No se pudo editar el comentario'; } });
  }
  deleteComment(comment: RecipeComment) {
    if (!this.recipe || this.commentBusy) return;
    this.commentBusy = true; this.error = '';
    this.recipeService.deleteComment(this.recipe.id, comment.id).subscribe({ next: () => { this.recipe!.comments = this.recipe!.comments!.filter(c => c.id !== comment.id); this.deletingComment = ''; this.commentBusy = false; }, error: response => { this.commentBusy = false; this.error = response.error?.error || 'No se pudo eliminar el comentario'; } });
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
