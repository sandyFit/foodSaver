import FoodItem from '../models/foodItem.js';
import Recipe from '../models/recipes.js';


const normalizeIngredientName = (ingredientName) => {
    // Normaliza el nombre del ingrediente: convierte a minúsculas y elimina unidades de medida
    return ingredientName
        .toLowerCase()
        .replace(/\s+/g, '')           // Elimina los espacios extra
        .replace(/\d+/g, '')           // Elimina los números (en este caso, los gramos, ml, etc.)
        .replace(/(gr|ml|kg|oz|tbsp|tsp|cup|l|mL|fl\s*oz)/g, '') // Elimina unidades de medida comunes
        .trim();
};

export const suggestRecipe = async () => {
    try {
        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 8); // Alimentos cercanos a vencer

        // Buscar alimentos que están por vencer
        const ingredients = await FoodItem.find({
            expirationDate: { $lte: threshold }
        }).select('itemName quantity');

        console.log('Ingredientes:', ingredients);

        // Obtener solo los nombres de los ingredientes cercanos a vencer, normalizados
        const ingredientNames = ingredients.map(item => normalizeIngredientName(item.itemName));
        console.log('Ingredientes próximos a vencer:', ingredientNames);

        // Obtener todas las recetas
        const recipes = await Recipe.find();

        // Filtrar recetas que contengan los ingredientes cercanos a vencer (comparing normalized names)
        const matchingRecipes = recipes.filter(recipe => {
            return recipe.ingredients.some(ingredient => {
                const ingredientName = ingredient.name ? normalizeIngredientName(ingredient.name) : null;

                if (!ingredientName) {
                    console.log("Ingrediente sin nombre:", ingredient);
                    return false;
                }

                console.log('Comparando ingrediente:', ingredientName);
                // Compara solo si el nombre base del ingrediente está en la lista de ingredientes cercanos a vencer
                return ingredientNames.some(nameInList =>
                    ingredientName.includes(nameInList) // Compara con los nombres de ingredientes (sin especificaciones)
                );
            });
        });

        // Si se encuentran recetas que usan esos ingredientes cercanos a vencer
        if (matchingRecipes.length > 0) {
            console.log(`Recetas encontradas: ${matchingRecipes.length}`);
            return matchingRecipes.map(recipe => ({
                id: recipe._id,
                name: recipe.name,          
                image_url: recipe.image_url,
                description: recipe.description, 
                ingredients: recipe.ingredients || [],
                steps: recipe.steps || [],
                prep_time: recipe.prep_time,
                cook_time: recipe.cook_time,
                total_time: recipe.total_time,
                servings: recipe.servings,
                category: recipe.category,
                tags: recipe.tags || []
            }));
        } else {
            // Si no hay recetas disponibles, devolver receta sugerida
            return [{
                name: 'Sin Receta',
                // Sin imagen disponible
                description: 'No hay recetas disponibles para sugerir en este momento.'
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
