const { test } = require('node:test');
const assert = require('node:assert/strict');
const Server = require('../src/models/server');

test('API: validación, CRUD, filtros y errores sin modificar recetas iniciales', async () => {
  const server = new Server().app.listen(0);
  const base = `http://localhost:${server.address().port}/api/recipes`;
  const data = { title: 'Receta de prueba', description: 'Descripción de prueba', author: 'Prueba', category: 'Cena', prepMinutes: 10, ingredients: ['Pan'], steps: ['Servir'] };
  const send = (url, method, body) => fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    assert.equal((await send(base, 'POST', {})).status, 400);
    assert.equal((await send(base, 'POST', {...data, title: '   ', prepMinutes: 1.5})).status, 400);
    assert.equal((await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
    const created = await send(base, 'POST', data);
    assert.equal(created.status, 201);
    const recipe = (await created.json()).data;
    assert.equal((await fetch(`${base}/${recipe.id}`)).status, 200);
    const filtered = await (await fetch(`${base}?q=prueba&category=Cena`)).json();
    assert.ok(filtered.data.some(item => item.id === recipe.id));
    assert.equal((await send(`${base}/${recipe.id}`, 'PUT', {...data, steps: []})).status, 400);
    const updated = await send(`${base}/${recipe.id}`, 'PUT', {...data, title: 'Receta editada'});
    assert.equal((await updated.json()).data.title, 'Receta editada');
    assert.equal((await fetch(`${base}/${recipe.id}`, {method: 'DELETE'})).status, 204);
    assert.equal((await fetch(`${base}/${recipe.id}`)).status, 404);
    assert.equal((await send(`${base}/${recipe.id}`, 'PUT', data)).status, 404);
    assert.equal((await fetch(`${base}/${recipe.id}`, {method: 'DELETE'})).status, 404);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
