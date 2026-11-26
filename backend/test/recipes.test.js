const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID, randomBytes } = require('node:crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { connect } = require('../dist/database/config');
const { User } = require('../dist/models/user');
const { Server } = require('../dist/models/server');

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
    const adminLogin = await send('/auth/login', 'POST', { email: 'admin@example.com', password: 'Password-test-123!' });
    const adminToken = (await adminLogin.json()).token;
    assert.equal((await send('/auth/register', 'POST', { name: 'Cocina', email: 'owner@example.com', password: 'Password-test-123!' })).status, 409);
    assert.equal((await send('/auth/login', 'POST', { email: 'owner@example.com', password: 'wrong' })).status, 401);
    const logged = await send('/auth/login', 'POST', { email: 'owner@example.com', password: 'Password-test-123!' });
    assert.equal(logged.status, 200);
    const session = await logged.json();
    const claims = jwt.verify(session.token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    assert.equal(claims.sub, owner.user.id); assert.equal(claims.role, 'user'); assert.equal(claims.exp - claims.iat, 8 * 60 * 60);
    assert.equal((await send('/auth/me', 'GET', undefined, session.token)).status, 200);
    for (const authorization of ['', 'token ' + session.token, 'Bearer ' + session.token + ' altered']) {
      const response = await fetch(base + '/auth/me', { headers: { Authorization: authorization } });
      assert.equal(response.status, 401);
    }
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
    const { Recipe } = require('../dist/models/recipe');
    const fixtures = await Recipe.insertMany(Array.from({ length: 7 }, (_, index) => ({
      ...recipe, title: 'Página ' + index, owner: owner.user.id, author: owner.user.name,
      recipeType: index === 6 ? 'Acompañamiento' : 'Plato principal',
      likes: Array.from({ length: index }, (_, likeIndex) => 'user' + likeIndex),
    })));
    const first = await (await send('/recipes?page=1&limit=6&q=P%C3%A1gina')).json();
    const second = await (await send('/recipes?page=2&limit=6&q=P%C3%A1gina')).json();
    assert.equal(first.data.length, 6); assert.equal(second.data.length, 1);
    assert.equal(first.total, 7); assert.equal(first.totalPages, 2);
    assert.equal(new Set([...first.data, ...second.data].map(r => r.id)).size, 7);
    const popular = await (await send('/recipes?page=1&limit=6&q=P%C3%A1gina&sort=popular')).json();
    assert.deepEqual(popular.data.map(r => r.id), fixtures.slice(1).reverse().map(r => r.id));
    assert.equal((await send('/recipes?sort=unknown')).status, 400);
    const filtered = await (await send('/recipes?page=1&limit=6&q=P%C3%A1gina&type=Acompa%C3%B1amiento&category=Cena&tag=F%C3%A1cil')).json();
    assert.equal(filtered.total, 1); assert.equal(filtered.data.length, 1);
    const empty = await (await send('/recipes?page=1&q=NoExiste')).json();
    assert.equal(empty.total, 0); assert.deepEqual(empty.data, []);
    const beyond = await (await send('/recipes?page=999&q=P%C3%A1gina')).json();
    assert.deepEqual(beyond.data, []);
    for (const query of ['page=0', 'page=-1', 'page=1.5', 'page=abc', 'limit=0', 'limit=101', 'page[]=1', 'page=9007199254740992']) {
      assert.equal((await send('/recipes?' + query)).status, 400, query);
    }
    const literal = await (await send('/recipes?page=1&q=%2E%2A')).json();
    assert.equal(literal.total, 0);
    await Recipe.deleteMany({ _id: { $in: fixtures.map(r => r.id) } });
    const likePath = '/recipes/' + saved.id + '/like';
    assert.equal((await send(likePath, 'PUT', {})).status, 401);
    assert.equal((await send('/recipes/missing/like', 'PUT', {}, owner.token)).status, 404);
    assert.equal((await send('/recipes/missing/like', 'DELETE', undefined, owner.token)).status, 404);
    for (const token of [owner.token, owner.token, other.token]) {
      assert.equal((await send(likePath, 'PUT', { likes: ['forged'] }, token)).status, 200);
    }
    const liked = (await (await send('/recipes/' + saved.id)).json()).data;
    assert.deepEqual(new Set(liked.likes), new Set([owner.user.id, other.user.id]));
    assert.equal(liked.likes.length, 2);
    await send('/recipes/' + saved.id, 'PUT', {...recipe, likes: []}, owner.token);
    assert.equal((await Recipe.findById(saved.id)).likes.length, 2);
    for (let i = 0; i < 2; i++) assert.equal((await send(likePath, 'DELETE', undefined, owner.token)).status, 200);
    assert.deepEqual((await Recipe.findById(saved.id)).likes, [other.user.id]);
    const commentResponse = await send('/recipes/' + saved.id + '/comments', 'POST', {text:'Buen sabor'}, other.token);
    assert.equal(commentResponse.status, 201);
    const comment = (await commentResponse.json()).data[0];
    const commentPath = '/recipes/' + saved.id + '/comments/' + comment.id;
    assert.equal((await send(commentPath, 'PUT', {text:'No autorizado'}, owner.token)).status, 403);
    assert.equal((await send(commentPath, 'PUT', {text:'Comentario editado'}, other.token)).status, 204);
    assert.equal((await send('/admin/users', 'GET', undefined, other.token)).status, 403);
    assert.equal((await send('/admin/users', 'GET', undefined, adminToken)).status, 200);
    const categories = (await (await send('/admin/catalog')).json()).data;
    const cena = categories.find(item => item.kind === 'category' && item.name === 'Cena');
    assert.equal((await send('/admin/catalog/' + cena.id, 'DELETE', undefined, adminToken)).status, 409);
    const newTag = await send('/admin/catalog', 'POST', {kind:'tag',name:'Nueva etiqueta'}, adminToken);
    assert.equal(newTag.status, 201);
    const tag = (await newTag.json()).data;
    assert.equal((await send('/admin/catalog/' + tag.id, 'PUT', {kind:'tag',name:'Etiqueta editada'}, adminToken)).status, 200);
    assert.equal((await send('/admin/catalog/' + tag.id, 'DELETE', undefined, adminToken)).status, 204);
    await mongoose.disconnect(); await connect();
    assert.equal((await send('/recipes/' + saved.id)).status, 200);
    assert.equal((await send(commentPath, 'DELETE', undefined, adminToken)).status, 204);
    assert.equal((await send('/auth/logout', 'POST', {}, owner.token)).status, 204);
    assert.equal((await send('/auth/me', 'GET', undefined, owner.token)).status, 401);
    assert.equal((await send('/admin/users/' + other.user.id, 'PUT', {active:false,role:'user'}, adminToken)).status, 200);
    assert.equal((await send('/auth/me', 'GET', undefined, other.token)).status, 401);
    assert.equal((await send('/recipes/' + saved.id, 'DELETE', undefined, adminToken)).status, 204);
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
