import { Routes } from '@angular/router';
import { RecipeListComponent } from './pages/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './pages/recipe-detail/recipe-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipeListComponent, title: 'Recetas | Food For My Soul' },
  { path: 'recipes/:id', component: RecipeDetailComponent, title: 'Detalle | Food For My Soul' },
  { path: '**', component: NotFoundComponent, title: 'Página no encontrada' },
];
