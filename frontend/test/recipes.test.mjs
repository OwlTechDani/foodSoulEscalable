import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import '@angular/compiler';
import { of, throwError, Subject } from 'rxjs';

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

const recipe = { id: 'test', title: 'Pan con tomate', description: 'Preparación sencilla', author: 'Prueba', owner: 'user', recipeType: 'Plato principal', tags: [], comments: [], category: 'Cena', prepMinutes: 5, imageUrl: '', ingredients: ['Pan'], steps: ['Servir'] };
const auth = { user: { id: 'user', role: 'user' }, canManage: owner => owner === 'user' };
const catalog = { getAll: () => of([]) };
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
  const form = new PublishComponent(service, route(null), router, auth, catalog);
  form.draft = { ...recipe, ingredients: 'Pan\n\nTomate', steps: 'Cortar\nServir' };
  form.save({ invalid: true });
  assert.equal(writes.length, 0);
  form.save({ invalid: false });
  assert.deepEqual(writes[0].ingredients, ['Pan', 'Tomate']);
  assert.deepEqual(navigations[0], ['/recipes', recipe.id]);
  assert.equal(routes.find(item => item.path === 'recipes/:id').component, RecipeDetailComponent);
  const edit = new PublishComponent(service, route(recipe.id), router, auth, catalog);
  edit.ngOnInit();
  assert.equal(edit.draft.title, recipe.title);
  edit.draft.title = 'Pan editado';
  edit.save({ invalid: false });
  assert.equal(writes[1].title, 'Pan editado');
  assert.deepEqual(navigations[1], ['/recipes', recipe.id]);
  const detail = new RecipeDetailComponent(route(recipe.id), {
    getById: () => of(recipe), delete: id => { assert.equal(id, recipe.id); return of(undefined); },
  }, router, auth);
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
  const form = new PublishComponent({ create: () => throwError(() => ({ status: 400, error: { errors: { imageUrl: 'Imagen inválida' } } })) }, route(null), {
    navigate: () => assert.fail('No debe navegar cuando el guardado falla'),
  }, auth, catalog);
  form.save({ invalid: false });
  assert.equal(form.saving, false);
  assert.ok(form.error);
  assert.equal(form.fieldErrors.imageUrl, 'Imagen inválida');
});

const { BotComponent } = await import('../src/app/pages/bot/bot.component.ts');
test('bot: inicio, ayuda y despedida sin conservar contexto', () => {
  const bot = new BotComponent({getAll: () => of([])}, {getAll: () => of([])});
  assert.equal(bot.started, false);
  bot.start(); assert.match(bot.message, /Hola/);
  bot.help('publish'); assert.equal(bot.destination, '/publicar');
  bot.help('search'); assert.equal(bot.destination, '/');
  bot.help('contact'); assert.match(bot.message, /contacto@example.com/);
  bot.end(); assert.equal(bot.started, false); assert.match(bot.message, /Hasta pronto/);
  bot.start(); assert.equal(bot.destination, ''); assert.equal(bot.suggestion, undefined);
  assert.equal(new BotComponent({}, {}).message, '');
});
test('bot: consulta tipos y sugiere solo una receta del tipo elegido', () => {
  const bot = new BotComponent({getAll: () => of([{kind:'type',name:'Plato principal'},{kind:'type',name:'Acompañamiento'},{kind:'category',name:'Cena'}])}, {
    getAll: type => { assert.equal(type, 'Plato principal'); return of([{...recipe,id:'a'},{...recipe,id:'b'},{...recipe,id:'c',recipeType:'Acompañamiento'}]); },
  });
  bot.start(); bot.chooseType(); assert.equal(bot.types.length, 2);
  const random = Math.random;
  try { Math.random = () => 0.99; bot.suggest('Plato principal'); assert.equal(bot.suggestion.id, 'b'); }
  finally { Math.random = random; }
  assert.equal(bot.loading, false);
});
test('bot: sin resultados, 404 y error de conexión', () => {
  const bot = new BotComponent({getAll: () => of([])}, {getAll: () => of([])});
  bot.start(); bot.chooseType(); assert.match(bot.message, /No encontré tipos/);
  bot.suggest('Plato principal'); assert.match(bot.message, /No encontré recetas/);
  for (const status of [404, 0]) {
    const failed = new BotComponent({getAll: () => throwError(() => ({status}))}, {getAll: () => throwError(() => ({status}))});
    failed.start(); failed.chooseType(); assert.equal(failed.loading, false); assert.match(failed.message, status === 404 ? /No encontré/ : /No pude/);
    failed.suggest('Plato principal'); assert.equal(failed.loading, false); assert.match(failed.message, status === 404 ? /No encontré/ : /No pude/);
  }
});
test('bot: una respuesta tardía no cambia la despedida', () => {
  const response = new Subject();
  const bot = new BotComponent({getAll: () => response}, {});
  bot.start(); bot.chooseType(); bot.end(); const farewell = bot.message;
  response.next([{kind:'type',name:'Plato principal'}]);
  assert.equal(bot.message, farewell); assert.deepEqual(bot.types, []);
});

const { RecipeListComponent } = await import('../src/app/pages/recipe-list/recipe-list.component.ts');
test('slider: cambia en ambos sentidos y vuelve al inicio', () => {
  const page = new RecipeListComponent({});
  assert.equal(page.slide, 0);
  page.changeSlide(-1); assert.equal(page.slide, 2);
  page.changeSlide(1); assert.equal(page.slide, 0);
  page.changeSlide(1); assert.equal(page.slide, 1);
  page.changeSlide(1); assert.equal(page.slide, 2);
  page.changeSlide(1); assert.equal(page.slide, 0);
});
