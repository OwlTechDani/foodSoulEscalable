const { Router } = require("express");
const { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } = require("../controllers/recipes");
const router = Router();
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);
module.exports = router;
