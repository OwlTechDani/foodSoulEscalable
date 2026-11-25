import { Router } from 'express';
import * as recipesController from '../controllers/recipes';
import asyncRoute from '../helpers/async';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', asyncRoute(recipesController.getRecipes));
router.get('/:id', asyncRoute(recipesController.getRecipeById));
router.post('/', auth, asyncRoute(recipesController.createRecipe));
router.put('/:id', auth, asyncRoute(recipesController.updateRecipe));
router.delete('/:id', auth, asyncRoute(recipesController.deleteRecipe));
router.put('/:id/like', auth, asyncRoute(recipesController.setLike));
router.delete('/:id/like', auth, asyncRoute(recipesController.setLike));
router.post('/:id/comments', auth, asyncRoute(recipesController.addComment));
router.put('/:id/comments/:commentId', auth, asyncRoute(recipesController.updateComment));
router.delete('/:id/comments/:commentId', auth, asyncRoute(recipesController.deleteComment));

export default router;
