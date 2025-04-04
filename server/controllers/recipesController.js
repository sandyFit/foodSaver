import InventoryItem from '../models/inventory.js';
import Recipe from '../models/recipes.js';
import mongoose from 'mongoose'; // Import mongoose

export const suggestRecipe = async (req, res) => {
    const t = req.t;
    try {
        // Extract userId from query parameters
        const { userId } = req.query;
        const t = req.t;

        if (!userId) {
            return res.status(400).json({
                error: t('recipes.errors.userIdRequired'),
                details: t('recipes.messages.userIdRequired'),
            });
        }

        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 7); // 7 days to expiration

        // Find soon-to-expire ingredients for this specific user
        // Ensure userId is a valid ObjectId if your schema defines it as such
        const objectIdUserId = new mongoose.Types.ObjectId(userId);

        const ingredients = await InventoryItem.find({
            user: objectIdUserId, // Use the converted ObjectId
            expirationDate: { $lte: threshold }
        }).select('name quantity expirationDate category');

        if (ingredients.length === 0) {
            return res.status(200).json({
                success: true,
                name: t('recipes.errors.noExpiringIngredients'),
                message: t("recipes.messages.noExpiringIngredients"),
            });
        }

        // Match ingredients with recipes
        const recipes = await Recipe.find({
            'ingredients.name': { $in: ingredients.map(item => item.name) }
        });

        if (recipes.length > 0) {
            // If there are recipes that can be made with the expiring ingredients
            return res.status(200).json({
                success: true,
                name: t('recipes.messages.suggestedRecipeFound'),
                ingredients: ingredients.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    expirationDate: item.expirationDate,
                    category: item.category,
                })),
                recipes: recipes.map(recipe => recipe.name),
            });
        } else {
            // No suitable recipes found
            return res.status(200).json({
                success: true,
                name: t('recipes.errors.suggestedNotFound'),
                ingredients: ingredients.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    expirationDate: item.expirationDate,
                    category: item.category,
                })),
                message: t("recipes.messages.suggestedRecipeNotFound"),
            });
        }
    } catch (error) {
        console.error('Recipe suggestion error:', error);
        res.status(400).json({
            error: t('recipes.errors.suggestedFailed'),
            details: error.message
        });
    }
};

export const getAllRecipes = async (req, res) => {
    const t = req.t;
    try {
        const recipes = await Recipe.find();

        // If no recipes, return appropriate message
        if (!recipes || recipes.length === 0) {
            return res.status(404).json({
                message: t('recipes.messages.noRecipesFound')
            });
        }

        res.status(200).json(recipes);
    } catch (error) {
        console.error('Get all recipes error:', error);
        res.status(400).json({
            error: t('recipes.errors.fetchFailed'),
            details: error.message
        });
    }
};

export const getRecipeById = async (req, res) => {
    const { id } = req.params;

    // First check if ID exists
    if (!id) {
        return res.status(400).json({
            error: t('recipes.errors.missingId'),
            details: t('recipes.messages.userIdRequired'),
        });
    }

    // Then check if it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: t('recipes.errors.invalidId'),
            details: t(`recipes.mesages.userIdInvalid`)
        });
    }

    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({
                message: t('recipes.messages.recipeNotFound')
            });
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.error('Get recipe by ID error:', error);
        res.status(500).json({
            error: t('recipes.errors.fetchRecipeFailed'),
            details: error.message
        });
    }
};

export const getSuggestedRecipes = async (req, res) => {
    const { id } = req.params;
    const t = req.t;

    try {
        let objectIdId;
        try {
            objectIdId = mongoose.Types.ObjectId(id);
        } catch (error) {
            return res.status(400).json({
                error: t('recipes.errors.invalidId'),
                details: t('recipes.messages.userIdInvalid'),
            });
        }

        // Find the recipe to get its ingredients
        const recipe = await Recipe.findById(objectIdId);
        if (!recipe) {
            return res.status(404).json({
                message: t('recipes.messages.recipeNotFound')
            });
        }

        // Find recipes with similar ingredients
        const suggestedRecipes = await Recipe.find({
            _id: { $ne: objectIdId }, // Exclude the current recipe
            'ingredients.name': { $in: recipe.ingredients.map(item => item.name) }
        }).limit(3);

        res.status(200).json(suggestedRecipes);
    } catch (error) {
        console.error('Get suggested recipes error:', error);
        res.status(400).json({
            error: t('recipes.errors.suggestedFailed'),
            details: error.message
        });
    }
};

export const getExpiringMeals = async (req, res) => {
    const t = req.t;
    try {
        // Extract userId from query parameters
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                error: t('recipes.errors.userIdRequired'),
                details: t('recipes.messages.userIdRequired'),
            });
        }

        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 7); // 7 days to expiration

        // Find soon-to-expire ingredients for this specific user
        //  Ensure userId is a valid ObjectId
        const objectIdUserId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId; //changed order
        const expiringItems = await InventoryItem.find({
            user: objectIdUserId, // Use objectIdUserId
            expirationDate: { $lte: threshold }
        }).select('name quantity expirationDate category');

        if (expiringItems.length === 0) {
            return res.status(200).json({
                expiringItems: [],
                message: t('recipes.messages.noExpiringItems')
            });
        }

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
            error: t('recipes.errors.noExpitringItems'),
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
