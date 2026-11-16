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
  let data = await Recipe.find(filter).sort({ createdAt: -1 }).select('-comments');
  if (typeof req.query.q === 'string') data = data.filter(item => item.title.toLowerCase().includes(req.query.q.trim().toLowerCase()));
  res.json({ data });
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
module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, addComment, updateComment, deleteComment };
