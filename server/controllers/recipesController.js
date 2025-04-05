import InventoryItem from '../models/inventory.js';
import Recipe from '../models/recipes.js';
import mongoose from 'mongoose'; // Import mongoose

export const suggestRecipe = async (req, res) => {
    const t = req.t;
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                error: t('recipes.errors.userIdRequired'),
                details: t('recipes.messages.userIdRequired'),
            });
        }

        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 7);

        // Get expiring ingredients
        const objectIdUserId = new mongoose.Types.ObjectId(userId);
        const ingredients = await InventoryItem.find({
            user: objectIdUserId,
            expirationDate: { $lte: threshold }
        }).select('itemName quantity expirationDate category');

        if (ingredients.length === 0) {
            return res.status(200).json({
                success: true,
                name: t('recipes.errors.noExpiringIngredients'),
                message: t("recipes.messages.noExpiringIngredients"),
            });
        }

        // Get all recipes
        const allRecipes = await Recipe.find({});

        // IMPROVED MATCHING ALGORITHM
        const matchingResults = [];

        // Prepare ingredient base forms by removing descriptive words
        const preparedIngredients = ingredients.map(item => {
            const name = item.itemName.toLowerCase().trim();
            // Get base ingredient name by removing common qualifiers
            let baseIngredient = name.replace(/fresh |frozen |dried |raw |cooked |sliced |diced |chopped /g, '');

            return {
                original: item.itemName,
                name: name,
                baseForm: baseIngredient,
                words: baseIngredient.split(' ')
            };
        });

        // Process each recipe
        for (const recipe of allRecipes) {
            const recipeIngredients = recipe.ingredients.map(ing => {
                const name = ing.name.toLowerCase().trim();
                return {
                    original: ing.name,
                    name: name,
                    words: name.split(' ')
                };
            });

            let score = 0;
            const matchedIngredients = [];

            // For each inventory ingredient
            for (const inventoryItem of preparedIngredients) {
                // Try to match it with recipe ingredients
                for (const recipeIngredient of recipeIngredients) {
                    // Check for exact matches
                    if (recipeIngredient.name === inventoryItem.name ||
                        recipeIngredient.name === inventoryItem.baseForm) {
                        score += 3;
                        matchedIngredients.push(inventoryItem.original);
                        break;
                    }

                    // Check for word matches (for multi-word ingredients)
                    const matches = inventoryItem.words.filter(word =>
                        word.length > 3 && // Avoid matching small words like "the", "and", etc.
                        recipeIngredient.words.includes(word));

                    if (matches.length > 0) {
                        // Score based on how many words matched
                        score += 1 * matches.length;
                        matchedIngredients.push(inventoryItem.original);
                        break;
                    }

                    // Check if recipe ingredient contains the inventory item name
                    if (recipeIngredient.name.includes(inventoryItem.baseForm) ||
                        inventoryItem.baseForm.includes(recipeIngredient.name)) {
                        score += 2;
                        matchedIngredients.push(inventoryItem.original);
                        break;
                    }

                    // Special cases handling
                    if ((inventoryItem.name.includes('chicken') &&
                        recipeIngredient.name.includes('chicken')) ||
                        (inventoryItem.name.includes('coconut') &&
                            recipeIngredient.name.includes('coconut'))) {
                        score += 2;
                        matchedIngredients.push(inventoryItem.original);
                        break;
                    }
                }
            }

            if (score > 0) {
                matchingResults.push({
                    ...recipe.toObject(),
                    score,
                    matchedIngredients: [...new Set(matchedIngredients)]
                });
            }
        }

        // Sort by score and get top 5
        matchingResults.sort((a, b) => b.score - a.score);
        const matchedRecipes = matchingResults.slice(0, 5);

        if (matchedRecipes.length > 0) {
            return res.status(200).json({
                success: true,
                name: t('recipes.messages.suggestedRecipeFound'),
                ingredients: ingredients.map(item => ({
                    name: item.itemName,
                    quantity: item.quantity,
                    expirationDate: item.expirationDate,
                    category: item.category,
                })),
                recipes: matchedRecipes.map(recipe => ({
                    id: recipe._id,
                    name: recipe.name,
                    ingredients: recipe.ingredients,
                    matchedIngredients: recipe.matchedIngredients,
                    score: recipe.score,
                    steps: recipe.steps,
                    image_url: recipe.image_url
                })),
            });
        } else {
            return res.status(200).json({
                success: true,
                name: t('recipes.errors.suggestedNotFound'),
                ingredients: ingredients.map(item => ({
                    name: item.itemName,
                    quantity: item.quantity,
                    expirationDate: item.expirationDate,
                    category: item.category,
                })),
                message: t("recipes.messages.suggestedRecipeNotFound"),
                debug: {
                    yourIngredients: ingredients.map(i => i.itemName),
                    allIngredients: [...new Set(allRecipes.flatMap(r =>
                        r.ingredients.map(i => i.name)))]
                }
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
