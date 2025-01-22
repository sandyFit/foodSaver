import express from 'express';
import {
    suggestRecipe,
    getAllRecipes,
    getRecipeById
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
router.get('/recipes', getAllRecipes);

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

router.get('/recipes/:id', getRecipeById);

/**
 * @swagger
 * /recipes-suggest:
 *   get:
 *     summary: Get a suggested recipe
 *     description: Retrieves a recipe suggestion based on available food items or preferences.
 *     tags:
 *       - recipes
 *     responses:
 *       200:
 *         description: Suggested recipe
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
 *       500:
 *         description: Internal Server Error
 */
router.get('/recipes-suggest', suggestRecipe);

export default router;
