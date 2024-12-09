import express from 'express';
import {
    addFoodItem,
    getAllFoodItems,
    getFoodItemById,
    updateFoodItem,
    deleteFoodItem
} from '../controllers/itemController.js';

const router = express.Router();

/**
 * @swagger
 * /foodItems/add-foodItem:
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
 *         description: Food item added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */

router.post('/add-foodItem', addFoodItem);
router.get('/get-foodItems', getAllFoodItems);
router.get('/get-foodItem/:id', getFoodItemById);
router.put('/update-foodItem/:id', updateFoodItem);
router.delete('/delete-foodItem/:id', deleteFoodItem);

export default router;
