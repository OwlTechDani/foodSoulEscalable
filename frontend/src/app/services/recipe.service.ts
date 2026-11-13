import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Recipe, RecipeInput } from '../models/recipe.interface';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly apiUrl = 'http://localhost:3000/api/recipes';
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Recipe[]> {
    return this.http.get<{ data: Recipe[] }>(this.apiUrl).pipe(map(response => response.data));
  }
  getById(id: string): Observable<Recipe> {
    return this.http.get<{ data: Recipe }>(`${this.apiUrl}/${encodeURIComponent(id)}`).pipe(map(response => response.data));
  }
  create(recipe: RecipeInput): Observable<Recipe> {
    return this.http.post<{ data: Recipe }>(this.apiUrl, recipe).pipe(map(response => response.data));
  }
  update(id: string, recipe: RecipeInput): Observable<Recipe> {
    return this.http.put<{ data: Recipe }>(`${this.apiUrl}/${encodeURIComponent(id)}`, recipe).pipe(map(response => response.data));
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }
}
