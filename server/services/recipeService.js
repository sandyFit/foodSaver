import FoodItem from '../models/foodItem.js';
import Recipe from '../models/recipes.js';

export const suggestRecipe = async () => {
    try {
        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 3); // Alimentos cercanos a vencer

        // Buscar alimentos que están por vencer
        const ingredients = await FoodItem.find({
            expirationDate: { $lte: threshold }
        }).select('name quantity'); // Obtener nombre y cantidad

        // Si tienes recetas que usan esos ingredientes, puedes buscar coincidencias
        const recipes = await Recipe.find({
            'ingredients.name': { $in: ingredients.map(item => item.name) }
        });

        if (recipes.length > 0) {
            // Si existen recetas que usan esos ingredientes cercanos a vencer
            return {
                name: `Receta sugerida basada en lo que tienes`,
                ingredients: ingredients.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                })),
                recipes: recipes.map(recipe => recipe.name), // Recetas disponibles que usan estos ingredientes
            };
        } else {
            // Si no hay recetas previas, puedes sugerir una receta básica
            return {
                name: `Receta sugerida`,
                ingredients: ingredients.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                })),
                message: "No hay recetas disponibles, pero puedes usar estos ingredientes.",
            };
        }
    } catch (error) {
        throw new Error('Error al sugerir receta: ' + error.message);
    }
};

export const getAllRecipes = async () => {
    try {
        return await Recipe.find();
    } catch (error) {
        throw new Error('Error encontrando recetas: ' + error.message);
    }
}

export const getRecipeById = async (id) => {
    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            throw new Error('Receta no encontradad', 404);
        }
        return recipe;
    } catch (error) {
        throw new Error('Error encontrando receta: ' + error.message);
    }
};


export default {
    suggestRecipe,
    getAllRecipes,
    getRecipeById

 };
