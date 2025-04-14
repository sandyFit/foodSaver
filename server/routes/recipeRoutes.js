import express from 'express';
import {
    suggestRecipe,
    getSuggestedRecipes,
    getAllRecipes,
    getRecipeById,
    getExpiringMeals
} from '../controllers/recipesController.js';

const router = express.Router();

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get all recipes
 *     description: Retrieves a list of all recipes from the database.
 *     tags:
 *       - recipes
 *     responses:
 *       200:
 *         description: List of all recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   ingredients:
 *                     type: array
 *                     items:
 *                       type: string
 *                   instructions:
 *                     type: string
 *                   imagePath:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */
router.get('/', getAllRecipes);

/**
 * @swagger
 * /recipes/suggested:
 *   get:
 *     summary: Get suggested recipes
 *     description: Retrieves recipe suggestions based on available ingredients.
 *     tags:
 *       - recipes
 *     responses:
 *       200:
 *         description: List of suggested recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   ingredients:
 *                     type: array
 *                     items:
 *                       type: string
 *                   instructions:
 *                     type: string
 *                   image_url:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */
router.get('/suggested', suggestRecipe);

/**
 * @swagger
 * /recipes/expiring-meals:
 *   get:
 *     summary: Get expiring meals
 *     description: Retrieves a list of meals that are about to expire.
 *     tags:
 *       - recipes
 *     responses:
 *       200:
 *         description: List of expiring meals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expiringItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       itemName:
 *                         type: string
 *                       expirationDate:
 *                         type: string
 *                         format: date-time
 *                       category:
 *                         type: string
 *       500:
 *         description: Internal Server Error
 */
router.get('/expiring-meals', getExpiringMeals);

/**
 * @swagger
 * /recipes/suggested/{id}:
 *   get:
 *     summary: Get suggested recipes by user ID
 *     description: Retrieves recipe suggestions for a specific user based on their inventory.
 *     tags:
 *       - recipes
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID to get suggestions for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of suggested recipes for user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   ingredients:
 *                     type: array
 *                     items:
 *                       type: string
 *                   matchingIngredients:
 *                     type: array
 *                     items:
 *                       type: string
 *                   missingIngredients:
 *                     type: array
 *                     items:
 *                       type: string
 *                   matchPercentage:
 *                     type: number
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/suggested/:id', getSuggestedRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get a specific recipe by ID
 *     description: Retrieves a single recipe based on the provided ID.
 *     tags:
 *       - recipes
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the recipe to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recipe retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: string
 *                 instructions:
 *                   type: string
 *                 imagePath:
 *                   type: string
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getRecipeById);

export default router;
