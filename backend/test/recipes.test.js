const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID, randomBytes } = require('node:crypto');
const mongoose = require('mongoose');
const connect = require('../src/database/config');
const User = require('../src/models/user');
const Server = require('../src/models/server');

test('MongoDB: registro, JWT, persistencia, permisos, comentarios y administración', async () => {
  process.env.JWT_SECRET = randomBytes(32).toString('hex');
  const database = 'food_soul_test_' + randomUUID().replaceAll('-', '');
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27018/' + database;
  await connect();
  const app = new Server(); app.port = 0;
  const server = app.listen();
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://localhost:${server.address().port}/api`;
  const send = (path, method = 'GET', body, token = '') => fetch(base + path, { method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: body === undefined ? undefined : JSON.stringify(body) });
  const recipe = { title: 'Pan con tomate', description: 'Una preparación sencilla', category: 'Cena', recipeType: 'Plato principal', tags: ['Fácil'], prepMinutes: 5, ingredients: ['Pan'], steps: ['Servir'], imageUrl: '' };
  const register = async email => {
    const response = await send('/auth/register', 'POST', { name: 'Cocina', email, password: 'Password-test-123!', role: 'admin' });
    assert.equal(response.status, 201); return response.json();
  };
  try {
    assert.ok(['127.0.0.1', '::1'].includes(server.address().address));
    const owner = await register('owner@example.com');
    const other = await register('other@example.com');
    const admin = await register('admin@example.com');
    assert.equal(owner.user.role, 'user');
    await User.updateOne({ _id: admin.user.id }, { role: 'admin' });
    assert.equal((await send('/auth/register', 'POST', { name: 'Cocina', email: 'owner@example.com', password: 'Password-test-123!' })).status, 409);
    assert.equal((await send('/auth/login', 'POST', { email: 'owner@example.com', password: 'wrong' })).status, 401);
    const logged = await send('/auth/login', 'POST', { email: 'owner@example.com', password: 'Password-test-123!' });
    assert.equal(logged.status, 200);
    const stored = await User.findById(owner.user.id).select('+password');
    assert.notEqual(stored.password, 'Password-test-123!');
    assert.equal((await send('/recipes', 'POST', recipe)).status, 401);
    for (const input of [{...recipe, imageUrl:'http://'}, {...recipe, category:'Bebidas'}, {...recipe, steps:[]}, {...recipe, tags:['No existe']}, {...recipe, prepMinutes:1.5}]) {
      assert.equal((await send('/recipes', 'POST', input, owner.token)).status, 400);
    }
    const created = await send('/recipes', 'POST', {...recipe, owner: other.user.id, author:'Falso'}, owner.token);
    assert.equal(created.status, 201);
    const saved = (await created.json()).data;
    assert.equal(saved.owner, owner.user.id); assert.equal(saved.author, owner.user.name);
    assert.equal((await send('/recipes/' + saved.id, 'PUT', recipe, other.token)).status, 403);
    assert.equal((await send('/recipes/' + saved.id, 'DELETE', undefined, other.token)).status, 403);
    assert.equal((await send('/recipes/' + saved.id, 'PUT', {...recipe,title:'Receta editada'}, owner.token)).status, 200);
    const commentResponse = await send('/recipes/' + saved.id + '/comments', 'POST', {text:'Buen sabor'}, other.token);
    assert.equal(commentResponse.status, 201);
    const comment = (await commentResponse.json()).data[0];
    const commentPath = '/recipes/' + saved.id + '/comments/' + comment.id;
    assert.equal((await send(commentPath, 'PUT', {text:'No autorizado'}, owner.token)).status, 403);
    assert.equal((await send(commentPath, 'PUT', {text:'Comentario editado'}, other.token)).status, 204);
    assert.equal((await send('/admin/users', 'GET', undefined, other.token)).status, 403);
    assert.equal((await send('/admin/users', 'GET', undefined, admin.token)).status, 200);
    const categories = (await (await send('/admin/catalog')).json()).data;
    const cena = categories.find(item => item.kind === 'category' && item.name === 'Cena');
    assert.equal((await send('/admin/catalog/' + cena.id, 'DELETE', undefined, admin.token)).status, 409);
    const newTag = await send('/admin/catalog', 'POST', {kind:'tag',name:'Nueva etiqueta'}, admin.token);
    assert.equal(newTag.status, 201);
    const tag = (await newTag.json()).data;
    assert.equal((await send('/admin/catalog/' + tag.id, 'PUT', {kind:'tag',name:'Etiqueta editada'}, admin.token)).status, 200);
    assert.equal((await send('/admin/catalog/' + tag.id, 'DELETE', undefined, admin.token)).status, 204);
    await mongoose.disconnect(); await connect();
    assert.equal((await send('/recipes/' + saved.id)).status, 200);
    assert.equal((await send(commentPath, 'DELETE', undefined, admin.token)).status, 204);
    assert.equal((await send('/auth/logout', 'POST', {}, owner.token)).status, 204);
    assert.equal((await send('/auth/me', 'GET', undefined, owner.token)).status, 401);
    assert.equal((await send('/admin/users/' + other.user.id, 'PUT', {active:false,role:'user'}, admin.token)).status, 200);
    assert.equal((await send('/auth/me', 'GET', undefined, other.token)).status, 401);
    assert.equal((await send('/recipes/' + saved.id, 'DELETE', undefined, admin.token)).status, 204);
    assert.equal((await send('/recipes/' + saved.id)).status, 404);
    let limited;
    for (let i = 0; i < 31; i++) limited = await send('/auth/login', 'POST', {});
    assert.equal(limited.status, 429);
  } finally {
    await new Promise(resolve => server.close(resolve));
    assert.equal(mongoose.connection.name, database);
    await mongoose.connection.dropDatabase(); await mongoose.disconnect();
  }
});
