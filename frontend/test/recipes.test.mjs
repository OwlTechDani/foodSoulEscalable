import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import '@angular/compiler';
import { of, throwError } from 'rxjs';

// Carga los componentes TypeScript reales sin crear otro proyecto de pruebas.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL?.endsWith('.ts') && specifier.startsWith('.') && !/\.(m?js|json|ts)$/.test(specifier)) specifier += '.ts';
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (!url.endsWith('.ts')) return nextLoad(url, context);
    const source = ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022, experimentalDecorators: true },
    }).outputText;
    return { format: 'module', source, shortCircuit: true };
  },
});
const { PublishComponent } = await import('../src/app/pages/publish/publish.component.ts');
const { RecipeDetailComponent } = await import('../src/app/pages/recipe-detail/recipe-detail.component.ts');
const { CommunityComponent } = await import('../src/app/pages/community/community.component.ts');
const { routes } = await import('../src/app/app.routes.ts');

const recipe = { id: 'test', title: 'Pan con tomate', description: 'Preparación sencilla', author: 'Prueba', category: 'Cena', prepMinutes: 5, imageUrl: '', ingredients: ['Pan'], steps: ['Servir'] };
const route = id => ({ snapshot: { paramMap: { get: () => id } } });

test('publicar y editar conservan el contenido y navegan al detalle correcto', () => {
  const navigations = [];
  const router = { navigate: path => navigations.push(path) };
  const writes = [];
  const service = {
    getById: id => { assert.equal(id, recipe.id); return of(recipe); },
    create: input => { writes.push(input); return of({ ...input, id: recipe.id }); },
    update: (id, input) => { assert.equal(id, recipe.id); writes.push(input); return of({ ...input, id }); },
  };
  const form = new PublishComponent(service, route(null), router);
  form.draft = { ...recipe, ingredients: 'Pan\n\nTomate', steps: 'Cortar\nServir' };
  form.save({ invalid: true });
  assert.equal(writes.length, 0);
  form.save({ invalid: false });
  assert.deepEqual(writes[0].ingredients, ['Pan', 'Tomate']);
  assert.deepEqual(navigations[0], ['/recipes', recipe.id]);
  assert.equal(routes.find(item => item.path === 'recipes/:id').component, RecipeDetailComponent);
  const edit = new PublishComponent(service, route(recipe.id), router);
  edit.ngOnInit();
  assert.equal(edit.draft.title, recipe.title);
  edit.draft.title = 'Pan editado';
  edit.save({ invalid: false });
  assert.equal(writes[1].title, 'Pan editado');
  assert.deepEqual(navigations[1], ['/recipes', recipe.id]);
  const detail = new RecipeDetailComponent(route(recipe.id), {
    getById: () => of(recipe), delete: id => { assert.equal(id, recipe.id); return of(undefined); },
  }, router);
  detail.ngOnInit();
  detail.remove();
  assert.deepEqual(navigations[2], ['/comunidad']);
});

test('filtrar desde la segunda página regresa a la primera', () => {
  const recipes = Array.from({ length: 7 }, (_, index) => ({ ...recipe, id: String(index), title: `Receta ${index}` }));
  const community = new CommunityComponent({ getAll: () => of(recipes) });
  community.ngOnInit();
  assert.equal(community.totalPages, 2);
  community.page = 2;
  assert.equal(community.visibleRecipes.length, 1);
  community.query = 'Receta 0';
  community.selectedCategory = 'Cena';
  community.filterRecipes();
  assert.equal(community.page, 1);
  assert.equal(community.totalPages, 1);
  assert.equal(community.visibleRecipes[0].id, '0');
});

test('un guardado fallido permite reintentar y no navega', () => {
  const form = new PublishComponent({ create: () => throwError(() => ({ status: 400 })) }, route(null), {
    navigate: () => assert.fail('No debe navegar cuando el guardado falla'),
  });
  form.save({ invalid: false });
  assert.equal(form.saving, false);
  assert.ok(form.error);
});
