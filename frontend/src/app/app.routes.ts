import { AdminComponent } from './pages/admin/admin.component';
import { Routes } from '@angular/router';
import { RecipeListComponent } from './pages/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './pages/recipe-detail/recipe-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CommunityComponent } from './pages/community/community.component';
import { PublishComponent } from './pages/publish/publish.component';
import { BotComponent } from './pages/bot/bot.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: RecipeListComponent, title: 'Inicio | Food For My Soul' },
  { path: 'comunidad', component: CommunityComponent, title: 'Comunidad | Food For My Soul' },
  { path: 'publicar', component: PublishComponent, title: 'Publicar | Food For My Soul' },
  { path: 'recipes/:id/editar', component: PublishComponent, title: 'Editar receta | Food For My Soul' },
  { path: 'admin', component: AdminComponent, title: 'Administración | Food For My Soul' },
  { path: 'bot', component: BotComponent, title: 'Bot | Food For My Soul' },
  { path: 'ia', redirectTo: 'bot', pathMatch: 'full' },
  { path: 'perfil', component: ProfileComponent, title: 'Perfil | Food For My Soul' },
  { path: 'recipes/:id', component: RecipeDetailComponent, title: 'Detalle | Food For My Soul' },
  { path: '**', component: NotFoundComponent, title: 'Página no encontrada' },
];
