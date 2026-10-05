import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Recipe } from '../models/recipe.interface';
import { MOCK_RECIPES } from '../data/mock-recipes';

interface ApiListResponse { data: Recipe[]; }
interface ApiRecipeResponse { data: Recipe; }

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly apiUrl = 'http://localhost:3000/api/recipes';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Recipe[]> {
    return this.http.get<ApiListResponse>(this.apiUrl).pipe(
      map((response) => response.data),
      // Fallback deliberado para facilitar la revisión visual sin iniciar el backend.
      catchError(() => of(MOCK_RECIPES)),
    );
  }

  getById(id: string): Observable<Recipe | undefined> {
    return this.http.get<ApiRecipeResponse>(`${this.apiUrl}/${encodeURIComponent(id)}`).pipe(
      map((response) => response.data),
      catchError(() => of(MOCK_RECIPES.find((recipe) => recipe.id === id))),
    );
  }
}
