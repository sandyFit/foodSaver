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
        }).select('itemName quantity');

        console.log('Ingredientes:', ingredients);  // Esto debería devolver un arreglo de objetos con los ingredientes

        // Obtener solo los nombres de los ingredientes cercanos a vencer
        const ingredientNames = ingredients.map(item => item.itemName.toLowerCase().trim());
        console.log('Ingredientes próximos a vencer:', ingredientNames);  // Esto debería ser un arreglo de nombres de ingredientes

        // Obtener todas las recetas
        const recipes = await Recipe.find();

        // Filtrar recetas que contengan los ingredientes cercanos a vencer
        const matchingRecipes = recipes.filter(recipe => {
            return recipe.ingredients.some(ingredient => {
                const ingredientName = ingredient.name ? ingredient.name.trim().toLowerCase() : null; // Usar ingredient.name

                if (!ingredientName) {
                    console.log("Ingrediente sin nombre:", ingredient);
                    return false;  // Saltar este ingrediente
                }

                console.log('Comparando ingrediente:', ingredientName);
                return ingredientNames.some(ingredientNameInList =>
                    ingredientName.includes(ingredientNameInList) // Comparar con los nombres de ingredientes
                );
            });
        });

        // Si se encuentran recetas que usan esos ingredientes cercanos a vencer
        if (matchingRecipes.length > 0) {
            console.log(`Recetas encontradas: ${matchingRecipes.length}`);
            return matchingRecipes.map(recipe => ({
                name: recipe.name,          // Nombre de la receta desde la DB
                image_url: recipe.image_url, // URL de la imagen de la receta
                description: recipe.description, // Descripción de la receta
            }));
        } else {
            // Si no hay recetas disponibles, devolver receta sugerida
            return [{
                name: 'Receta sugerida',
                image_url: '',  // Sin imagen disponible
                description: 'No hay recetas disponibles, pero puedes usar estos ingredientes.'
            }];
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
