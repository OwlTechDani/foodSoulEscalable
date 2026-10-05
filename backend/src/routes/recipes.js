const { Router } = require("express");
const { getRecipes, getRecipeById } = require("../controllers/recipes");

const router = Router();

// GET /api/recipes
router.get("/", getRecipes);

// GET /api/recipes/:id
router.get("/:id", getRecipeById);

// TODO: cuando exista persistencia, agregar POST/PUT/DELETE con validaciones y autorización.
module.exports = router;
