const Recipe = require('../models/recipe');
const Catalog = require('../models/catalog');
async function validateRecipe(body) {
  const errors = {};
  for (const [field, min] of [["title", 3], ["description", 10]]) {
    if (typeof body[field] !== "string" || body[field].trim().length < min) {
      errors[field] = `Escribe al menos ${min} caracteres.`;
    }
  }
  if (typeof body.category !== 'string' || !await Catalog.exists({ kind: 'category', name: body.category })) {
    errors.category = "Selecciona una categoría disponible.";
  }
  if (!Number.isInteger(body.prepMinutes) || body.prepMinutes < 1 || body.prepMinutes > 1440) {
    errors.prepMinutes = "Indica un número entero entre 1 y 1440.";
  }
  for (const field of ["ingredients", "steps"]) {
    if (!Array.isArray(body[field]) || !body[field].length || body[field].some(item => typeof item !== "string" || !item.trim())) {
      errors[field] = "Agrega al menos una línea de texto válida.";
    }
  }
  if (body.imageUrl !== undefined && body.imageUrl !== "") {
    try {
      const url = new URL(body.imageUrl);
      if (typeof body.imageUrl !== "string" || !["http:", "https:"].includes(url.protocol) || !url.hostname) {
        errors.imageUrl = "Usa una dirección http o https válida.";
      }
    } catch {
      errors.imageUrl = "Usa una dirección http o https válida.";
    }
  }
  if (typeof body.recipeType !== 'string' || !await Catalog.exists({ kind: 'type', name: body.recipeType })) errors.recipeType = 'Selecciona un tipo disponible.';
  if (!Array.isArray(body.tags) || body.tags.length > 20 || body.tags.some(tag => typeof tag !== 'string')) errors.tags = 'Selecciona etiquetas disponibles.';
  else if (await Catalog.countDocuments({ kind: 'tag', name: { $in: body.tags } }) !== new Set(body.tags).size) errors.tags = 'Selecciona etiquetas disponibles.';
  if (typeof body.title === 'string' && body.title.length > 120) errors.title = 'Máximo 120 caracteres.';
  return errors;
}

function recipeData(body) {
  return {
    title: body.title.trim(), description: body.description.trim(),
    category: body.category.trim(), recipeType: body.recipeType, tags: [...new Set(body.tags)],
    prepMinutes: body.prepMinutes, imageUrl: body.imageUrl ? new URL(body.imageUrl).href : "",
    ingredients: body.ingredients.map(item => item.trim()),
    steps: body.steps.map(item => item.trim()),
  };
}

function canManage(user, owner) { return user.role === 'admin' || user.id === owner; }
async function getRecipes(req, res) {
  const filter = {};
  for (const [query, field] of [['category','category'],['type','recipeType'],['tag','tags'],['owner','owner']]) {
    if (typeof req.query[query] === 'string' && req.query[query]) filter[field] = req.query[query];
  }
  if (typeof req.query.q === 'string' && req.query.q.trim()) {
    const text = Array.from(req.query.q.trim(), char => '.*+?^${}()|[]\\'.includes(char) ? '\\' + char : char).join('');
    filter.title = { $regex: text, $options: 'i' };
  }
  const paginated = req.query.page !== undefined || req.query.limit !== undefined;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 6);
  if (paginated && ((req.query.page !== undefined && typeof req.query.page !== 'string') || (req.query.limit !== undefined && typeof req.query.limit !== 'string') || !Number.isSafeInteger(page) || !Number.isSafeInteger(limit) || page < 1 || limit < 1 || limit > 100 || !Number.isSafeInteger((page - 1) * limit))) {
    return res.status(400).json({ error: 'Página entera desde 1 y límite entero entre 1 y 100' });
  }
  const query = Recipe.find(filter).sort({ createdAt: -1, _id: -1 }).select('-comments');
  if (!paginated) return res.json({ data: await query });
  const [data, total] = await Promise.all([query.skip((page - 1) * limit).limit(limit), Recipe.countDocuments(filter)]);
  res.json({ data, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
}
async function getRecipeById(req, res) {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ error: 'No se encontró la receta' });
  res.json({ data: recipe });
}
async function createRecipe(req, res) {
  const errors = await validateRecipe(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Revisa los campos indicados', errors });
  res.status(201).json({ data: await Recipe.create({ ...recipeData(req.body), owner: req.user.id, author: req.user.name }) });
}
async function updateRecipe(req, res) {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ error: 'No se encontró la receta' });
  if (!canManage(req.user, recipe.owner)) return res.status(403).json({ error: 'Solo puedes editar tus propias recetas' });
  const errors = await validateRecipe(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Revisa los campos indicados', errors });
  Object.assign(recipe, recipeData(req.body)); await recipe.save(); res.json({ data: recipe });
}
async function deleteRecipe(req, res) {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ error: 'No se encontró la receta' });
  if (!canManage(req.user, recipe.owner)) return res.status(403).json({ error: 'Solo puedes eliminar tus propias recetas' });
  await recipe.deleteOne(); res.status(204).send();
}
async function setLike(req, res) {
  const update = req.method === 'PUT' ? { $addToSet: { likes: req.user.id } } : { $pull: { likes: req.user.id } };
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' }).select('likes');
  if (!recipe) return res.status(404).json({ error: 'No se encontró la receta' });
  res.json({ data: recipe.likes });
}
async function addComment(req, res) {
  if (typeof req.body?.text !== 'string' || !req.body.text.trim() || req.body.text.length > 2000) return res.status(400).json({ error: 'Escribe un comentario de 1 a 2000 caracteres' });
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, { $push: { comments: { owner: req.user.id, author: req.user.name, text: req.body.text.trim() } } }, { returnDocument: 'after' });
  if (!recipe) return res.status(404).json({ error: 'No se encontró la receta' });
  res.status(201).json({ data: recipe.comments });
}
async function updateComment(req, res) {
  const recipe = await Recipe.findById(req.params.id);
  const comment = recipe?.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ error: 'No se encontró el comentario' });
  if (!canManage(req.user, comment.owner)) return res.status(403).json({ error: 'Solo puedes modificar tus comentarios' });
  if (typeof req.body?.text !== 'string' || !req.body.text.trim() || req.body.text.length > 2000) return res.status(400).json({ error: 'Escribe un comentario de 1 a 2000 caracteres' });
  await Recipe.updateOne({ _id: recipe.id, 'comments._id': comment.id }, { $set: { 'comments.$.text': req.body.text.trim() } });
  res.status(204).send();
}
async function deleteComment(req, res) {
  const recipe = await Recipe.findById(req.params.id);
  const comment = recipe?.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ error: 'No se encontró el comentario' });
  if (!canManage(req.user, comment.owner)) return res.status(403).json({ error: 'Solo puedes eliminar tus comentarios' });
  await Recipe.updateOne({ _id: recipe.id }, { $pull: { comments: { _id: comment.id } } }); res.status(204).send();
}
module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, setLike, addComment, updateComment, deleteComment };
