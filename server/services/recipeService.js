import InventoryItem from '../models/inventory.js';
import Recipe from '../models/recipes.js';
import {useTranslation} from 'react-i18next';

const { t } = useTranslation();
export const suggestRecipe = async () => {
    try {
        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 7); // 7 days to expiration

        // Find soon-to-expire ingredients
        const ingredients = await InventoryItem.find({
            expirationDate: { $lte: threshold }
        }).select('name quantity'); // get only name and quantity

        // Match ingredients with recipes
        const recipes = await Recipe.find({
            'ingredients.name': { $in: ingredients.map(item => item.name) }
        });

        if (recipes.length > 0) {
            // If there are recipes that can be made with the expiring ingredients
            return {
                name: `recipes.messages.suggestedRecipeFound`,
                ingredients: ingredients.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                })),
                recipes: recipes.map(recipe => recipe.name), 
            };
        } else {
            // Suggest another recipe
            return {
                name: `recipes.suggestedRecipes`,
                ingredients: ingredients.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                })),
                message: "recipes.messages.suggestOtherRecipe",
            };
        }
    } catch (error) {
        throw new Error(t('recipes.errors.suggestedFailed') + error.message);
    }
};

export const getAllRecipes = async () => {
    try {
        return await Recipe.find();
    } catch (error) {
        throw new Error(t('recipes.errors.fetchFailed') + error.message);
    }
}

export const getRecipeById = async (id) => {
    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            throw new Error(t('recipes.messages.noRecipeFound'), 404);
        }
        return recipe;
    } catch (error) {
        throw new Error(t('recipes.errors.fetchRecipeFailed') + error.message);
    }
};


export default {
    suggestRecipe,
    getAllRecipes,
    getRecipeById

};
