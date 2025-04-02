import Recipe from '../models/recipes.js';
import InventoryItem from '../models/inventory.js';

export const suggestRecipe = async (req, res) => {
    try {
        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 7); // 7 days to expiration

        // Find soon-to-expire ingredients
        const ingredients = await InventoryItem.find({
            expirationDate: { $lte: threshold }
        }).select('name quantity');

        // Match ingredients with recipes
        const recipes = await Recipe.find({
            'ingredients.name': { $in: ingredients.map(item => item.name) }
        });

        if (recipes.length > 0) {
            // If there are recipes that can be made with the expiring ingredients
            return res.status(200).json({
                name: 'recipes.messages.suggestedRecipeFound',
                ingredients: ingredients.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                })),
                recipes: recipes.map(recipe => recipe.name),
            });
        } else {
            // No suitable recipes found
            return res.status(200).json({
                name: 'recipes.noSuggestedRecipes',
                ingredients: ingredients.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                })),
                message: "recipes.messages.noSuggestedRecipes",
            });
        }
    } catch (error) {
        console.error('Recipe suggestion error:', error);
        res.status(400).json({
            error: 'recipes.errors.suggestedFailed',
            details: error.message
        });
    }
};

export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();

        // If no recipes, return appropriate message
        if (!recipes || recipes.length === 0) {
            return res.status(404).json({
                message: 'recipes.messages.noRecipesFound'
            });
        }

        res.status(200).json(recipes);
    } catch (error) {
        console.error('Get all recipes error:', error);
        res.status(400).json({
            error: 'recipes.errors.fetchFailed',
            details: error.message
        });
    }
};

export const getRecipeById = async (req, res) => {
    const { id } = req.params;

    // Verify if the provided ID is valid
    if (!id) {
        return res.status(400).json({
            error: 'recipes.errors.invalidId',
        });
    }

    try {
        const recipe = await Recipe.findById(id);

        // If recipe not found with the provided ID
        if (!recipe) {
            return res.status(404).json({
                message: 'recipes.messages.recipeNotFound'
            });
        }

        res.status(200).json(recipe);
    } catch (error) {
        console.error('Get recipe by ID error:', error);
        res.status(400).json({
            error: 'recipes.errors.fetchRecipeFailed',
            details: error.message
        });
    }
};

export const getSuggestedRecipes = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the recipe to get its ingredients
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({
                message: 'recipes.messages.recipeNotFound'
            });
        }

        // Find recipes with similar ingredients
        const suggestedRecipes = await Recipe.find({
            _id: { $ne: id }, // Exclude the current recipe
            'ingredients.name': { $in: recipe.ingredients.map(item => item.name) }
        }).limit(3);

        res.status(200).json(suggestedRecipes);
    } catch (error) {
        console.error('Get suggested recipes error:', error);
        res.status(400).json({
            error: 'recipes.errors.suggestedFailed',
            details: error.message
        });
    }
};

export const getExpiringMeals = async (req, res) => {
    try {
        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 7); // 7 days to expiration

        // Find soon-to-expire ingredients
        const expiringItems = await InventoryItem.find({
            expirationDate: { $lte: threshold }
        }).select('name quantity expirationDate');

        // Find recipes using these ingredients
        const recipes = await Recipe.find({
            'ingredients.name': { $in: expiringItems.map(item => item.name) }
        });

        res.status(200).json({
            expiringItems,
            recipes
        });
    } catch (error) {
        console.error('Get expiring meals error:', error);
        res.status(400).json({
            error: 'inventory.errors.fetchExpiredFailed',
            details: error.message
        });
    }
};

export default {
    suggestRecipe,
    getAllRecipes,
    getRecipeById,
    getSuggestedRecipes,
    getExpiringMeals
};
