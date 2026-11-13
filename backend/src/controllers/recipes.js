const recipes = require("../data/recipes");
const { randomUUID } = require("node:crypto");

// La API usa datos de demostración en memoria hasta incorporar MongoDB.
function validateRecipe(body) {
  const errors = {};
  for (const [field, min] of [["title", 3], ["description", 10], ["author", 2], ["category", 2]]) {
    if (typeof body[field] !== "string" || body[field].trim().length < min) {
      errors[field] = `Escribe al menos ${min} caracteres.`;
    }
  }
  if (!Number.isInteger(body.prepMinutes) || body.prepMinutes < 1 || body.prepMinutes > 1440) {
    errors.prepMinutes = "Indica un número entero entre 1 y 1440.";
  }
  for (const field of ["ingredients", "steps"]) {
    if (!Array.isArray(body[field]) || !body[field].length || body[field].some(item => typeof item !== "string" || !item.trim())) {
      errors[field] = "Agrega al menos una línea de texto válida.";
    }
  }
  if (body.imageUrl !== undefined && (typeof body.imageUrl !== "string" || (body.imageUrl && !/^https?:\/\//i.test(body.imageUrl)))) {
    errors.imageUrl = "Usa una dirección http o https.";
  }
  return errors;
}

function recipeData(body) {
  return {
    title: body.title.trim(), description: body.description.trim(),
    author: body.author.trim(), category: body.category.trim(),
    prepMinutes: body.prepMinutes, imageUrl: (body.imageUrl || "").trim(),
    ingredients: body.ingredients.map(item => item.trim()),
    steps: body.steps.map(item => item.trim()),
  };
}

function getRecipes(req, res) {
  const text = String(req.query.q || "").trim().toLowerCase();
  const category = String(req.query.category || "");
  const data = recipes.filter(recipe => recipe.title.toLowerCase().includes(text) && (!category || recipe.category === category));
  res.status(200).json({ data });
}

function getRecipeById(req, res) {
  const recipe = recipes.find(item => item.id === req.params.id);
  if (!recipe) return res.status(404).json({ error: "No se encontró la receta" });
  res.status(200).json({ data: recipe });
}

function createRecipe(req, res) {
  const body = req.body || {};
  const errors = validateRecipe(body);
  if (Object.keys(errors).length) return res.status(400).json({ error: "Revisa los campos de la receta", errors });
  const recipe = { id: randomUUID(), ...recipeData(body) };
  recipes.push(recipe);
  res.status(201).json({ data: recipe });
}

function updateRecipe(req, res) {
  const index = recipes.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "No se encontró la receta" });
  const body = req.body || {};
  const errors = validateRecipe(body);
  if (Object.keys(errors).length) return res.status(400).json({ error: "Revisa los campos de la receta", errors });
  recipes[index] = { id: req.params.id, ...recipeData(body) };
  res.status(200).json({ data: recipes[index] });
}

function deleteRecipe(req, res) {
  const index = recipes.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "No se encontró la receta" });
  recipes.splice(index, 1);
  res.status(204).send();
}

module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe };
