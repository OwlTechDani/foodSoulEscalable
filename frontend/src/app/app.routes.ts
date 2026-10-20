import { Routes } from '@angular/router';
import { RecipeListComponent } from './pages/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './pages/recipe-detail/recipe-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CommunityComponent } from './pages/community/community.component';
import { PublishComponent } from './pages/publish/publish.component';
import { AiComponent } from './pages/ai/ai.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: RecipeListComponent, title: 'Inicio | Food For My Soul' },
  { path: 'recipes', redirectTo: '', pathMatch: 'full' },
  { path: 'comunidad', component: CommunityComponent, title: 'Comunidad | Food For My Soul' },
  { path: 'publicar', component: PublishComponent, title: 'Publicar | Food For My Soul' },
  { path: 'ia', component: AiComponent, title: 'IA | Food For My Soul' },
  { path: 'perfil', component: ProfileComponent, title: 'Perfil | Food For My Soul' },
  { path: 'recipes/:id', component: RecipeDetailComponent, title: 'Detalle | Food For My Soul' },
  { path: '**', component: NotFoundComponent, title: 'Página no encontrada' },
];
