import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { Recipe, RecipeInput, RecipeComment } from '../models/recipe.interface';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly apiUrl = 'http://localhost:3000/api/recipes';
  constructor(private readonly http: HttpClient, private readonly auth: AuthService) {}

  getAll(type = ''): Observable<Recipe[]> {
    return this.http.get<{ data: Recipe[] }>(this.apiUrl, { params: { type } }).pipe(map(response => response.data));
  }
  getPage(page: number, q = '', category = '', type = '', tag = '') {
    return this.http.get<{ data: Recipe[]; page: number; total: number; totalPages: number }>(this.apiUrl, { params: { page, limit: 6, q, category, type, tag } });
  }
  getById(id: string): Observable<Recipe> {
    return this.http.get<{ data: Recipe }>(`${this.apiUrl}/${encodeURIComponent(id)}`).pipe(map(response => response.data));
  }
  create(recipe: RecipeInput): Observable<Recipe> {
    return this.http.post<{ data: Recipe }>(this.apiUrl, recipe, this.auth.options).pipe(map(response => response.data));
  }
  update(id: string, recipe: RecipeInput): Observable<Recipe> {
    return this.http.put<{ data: Recipe }>(`${this.apiUrl}/${encodeURIComponent(id)}`, recipe, this.auth.options).pipe(map(response => response.data));
  }
  addComment(id: string, text: string) { return this.http.post<{data: RecipeComment[]}>(`${this.apiUrl}/${id}/comments`, { text }, this.auth.options).pipe(map(r => r.data)); }
  updateComment(id: string, commentId: string, text: string) { return this.http.put(`${this.apiUrl}/${id}/comments/${commentId}`, { text }, this.auth.options); }
  deleteComment(id: string, commentId: string) { return this.http.delete(`${this.apiUrl}/${id}/comments/${commentId}`, this.auth.options); }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(id)}`, this.auth.options);
  }
}
