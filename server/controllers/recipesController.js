import recipes from '../models/recipes.js';
import recipeService from '../services/recipeService.js';


export const suggestRecipe = async (req, res) => {
    try {
        const recipe = await recipeService.suggestRecipe();
        // Si no hay receta sugerida, retornar un mensaje adecuado
        if (!recipe) {
            return res.status(404).json({
                message: 'recipes.messages.noSuggestedRecipes'
            });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(400).json({
            error: 'recipes.errors.suggestedFailed',
            details: error.message
        });
    }
};


export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await recipeService.getAllRecipes();
        // Si no hay recetas, retorna un mensaje adecuado
        if (!recipes || recipes.length === 0) {
            return res.status(404).json({
                message: 'recipes.messages.noRecipesFound'
            });
        }
        res.status(200).json(recipes);
    } catch (error) {
        res.status(400).json({
            error: 'recipes.errors.fetchFailed',
            details: error.message
        });
    }
};

export const getRecipeById = async (req, res) => {
    const { id } = req.params;

    // Verificar si el id proporcionado es válido
    if (!id) {
        return res.status(400).json({
            error: 'recipes.errors.invalidId'
        });
    }

    try {
        const recipe = await recipeService.getRecipeById(id);
        // Si no se encuentra la receta con el id proporcionado
        if (!recipe) {
            return res.status(404).json({
                message: 'recipes.messages.noRecipeFound'
            });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(400).json({
            error: 'recipes.errors.fetchRecipeFailed',
            details: error.message
        });
    }
};
