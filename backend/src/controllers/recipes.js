const recipes = require("../data/recipes");

function getRecipes(_req, res) {
  res.status(200).json({ data: recipes });
}

function getRecipeById(req, res) {
  const recipe = recipes.find((item) => item.id === req.params.id);

  if (!recipe) {
    return res.status(404).json({ error: "No se encontró la receta" });
  }

  return res.status(200).json({ data: recipe });
}

module.exports = { getRecipes, getRecipeById };
