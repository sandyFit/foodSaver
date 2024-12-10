import recipeService from '../services/recipeService.js';


export const suggestRecipe = async (req, res) => {
    try {
        const recipe = await recipeService.suggestRecipe();
        // Si no hay receta sugerida, retornar un mensaje adecuado
        if (!recipe) {
            return res.status(404).json({
                message: 'No se pudo encontrar una receta sugerida basada en los ingredientes cercanos a vencer.'
            });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(400).json({
            error: 'Error al obtener receta sugerida',
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
                message: 'No hay recetas disponibles en el sistema.'
            });
        }
        res.status(200).json(recipes);
    } catch (error) {
        res.status(400).json({
            error: 'Error al obtener la lista de recetas',
            details: error.message
        });
    }
};

export const getRecipeById = async (req, res) => {
    const { id } = req.params;

    // Verificar si el id proporcionado es válido
    if (!id) {
        return res.status(400).json({
            error: 'El parámetro id es necesario para obtener la receta.'
        });
    }

    try {
        const recipe = await recipeService.getRecipeById(id);
        // Si no se encuentra la receta con el id proporcionado
        if (!recipe) {
            return res.status(404).json({
                message: 'Receta no encontrada.'
            });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(400).json({
            error: 'Error al obtener la receta',
            details: error.message
        });
    }
};
