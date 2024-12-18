import express from 'express';
import {
    addFoodItem,
    getAllFoodItems,
    getFoodItemById,
    updateFoodItem,
    deleteFoodItem,
    getExpiringItems
} from '../controllers/itemController.js';

const router = express.Router();
router.post('/add-foodItem', addFoodItem);
router.get('/get-foodItems', getAllFoodItems);
router.get('/get-foodItem/:id', getFoodItemById);
router.put('/update-foodItem/:id', updateFoodItem);
router.delete('/delete-foodItem/:id', deleteFoodItem);
router.get('/expiring-foodItems', getExpiringItems);

/**
 * @swagger
 * /add-foodItem:
 *   post:
 *     summary: Add a new food item
 *     description: Adds a new food item to the database.
 *     tags:
 *       - foodItems
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               imagePath:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: List of all food items
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /get-foodItems:
 *   get:
 *     summary: Get all food items
 *     description: Retrieves all food items from the database.
 *     tags:
 *       - foodItems
 *     responses:
 *       200:
 *         description: List of food items
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
 *                   quantity:
 *                     type: number
 *                   imagePath:
 *                     type: string
 *                   expirationDate:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /get-foodItem/{id}:
 *   get:
 *     summary: Get a specific food item by ID
 *     description: Retrieves a single food item based on the provided ID.
 *     tags:
 *       - foodItems
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the food item to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Food item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 quantity:
 *                   type: number
 *                 imagePath:
 *                   type: string
 *                 expirationDate:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Food item not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /update-foodItem/{id}:
 *   put:
 *     summary: Update an existing food item
 *     description: Updates the information of an existing food item in the database.
 *     tags:
 *       - foodItems
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the food item to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               imagePath:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Food item updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Food item not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /delete-foodItem/{id}:
 *   delete:
 *     summary: Delete a food item
 *     description: Deletes a food item from the database.
 *     tags:
 *       - foodItems
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the food item to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Food item deleted successfully
 *       404:
 *         description: Food item not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /expiring-foodItems:
 *   get:
 *     summary: Get food items that are expiring soon
 *     description: Retrieves food items that are approaching their expiration date.
 *     tags:
 *       - foodItems
 *     responses:
 *       200:
 *         description: List of expiring food items
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
 *                   quantity:
 *                     type: number
 *                   imagePath:
 *                     type: string
 *                   expirationDate:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal Server Error
 */



export default router;
