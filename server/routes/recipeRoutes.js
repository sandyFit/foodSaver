import express from 'express';
import {
    suggestRecipe,
    getAllRecipes,
    getRecipeById
} from '../controllers/recipesController.js';

const router = express.Router();

// Ruta para obtener todas las recetas (usamos simplemente "/recipes")
router.get('/recipes', getAllRecipes);

// Ruta para obtener una receta específica por ID
router.get('/recipes/:id', getRecipeById);

// Ruta para obtener una receta sugerida (más clara sin "get-" al principio)
router.get('/recipes-suggest', suggestRecipe);

export default router;
