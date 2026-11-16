const User = require('../models/user');
const Recipe = require('../models/recipe');
const Catalog = require('../models/catalog');
async function listUsers(req, res) { res.json({ data: await User.find().select('name email role active') }); }
async function updateUser(req, res) {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'No puedes cambiar tu propia cuenta desde administración' });
  if (typeof req.body?.active !== 'boolean' || !['user', 'admin'].includes(req.body.role)) return res.status(400).json({ error: 'Indica estado y rol válidos' });
  const user = await User.findByIdAndUpdate(req.params.id, { active: req.body.active, role: req.body.role, $inc: { sessionVersion: 1 } }, { returnDocument: 'after' });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ data: user });
}
async function listCatalog(req, res) { res.json({ data: await Catalog.find().sort({ kind: 1, name: 1 }) }); }
async function saveCatalog(req, res) {
  const { kind, name } = req.body || {};
  if (!['category', 'tag', 'type'].includes(kind) || typeof name !== 'string' || name.trim().length < 2 || name.length > 60) return res.status(400).json({ error: 'Indica tipo y nombre de 2 a 60 caracteres' });
  if (!req.params.id) return res.status(201).json({ data: await Catalog.create({ kind, name: name.trim() }) });
  const item = await Catalog.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Elemento no encontrado' });
  const field = { category: 'category', tag: 'tags', type: 'recipeType' }[item.kind];
  if (await Recipe.exists({ [field]: item.name })) return res.status(409).json({ error: 'El elemento está en uso; cambia primero las recetas que lo utilizan' });
  item.kind = kind; item.name = name.trim(); await item.save(); res.json({ data: item });
}
async function deleteCatalog(req, res) {
  const item = await Catalog.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Elemento no encontrado' });
  const field = { category: 'category', tag: 'tags', type: 'recipeType' }[item.kind];
  if (await Recipe.exists({ [field]: item.name })) return res.status(409).json({ error: 'El elemento está en uso por una receta' });
  await item.deleteOne(); res.status(204).send();
}
module.exports = { listUsers, updateUser, listCatalog, saveCatalog, deleteCatalog };
