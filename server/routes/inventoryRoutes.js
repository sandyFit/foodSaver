import express from 'express';
import {
    getItems,
    createItem,
    getItem,
    updateItem,
    deleteItem

} from '../controllers/inventoryController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management endpoints
 */

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Create a new inventory item
 *     description: Adds a new item to the inventory.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the inventory item.
 *                 example: "Widget A"
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the item in stock.
 *                 example: 100
 *               price:
 *                 type: number
 *                 description: Price of the item.
 *                 example: 19.99
 *     responses:
 *       201:
 *         description: Item created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item created successfully."
 *       400:
 *         description: Bad Request. Invalid input format.
 *       401:
 *         description: Unauthorized. Authentication failed.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all inventory items
 *     description: Retrieves a list of all inventory items.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inventory items retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "61d2f8f5f4d4b1e0c3a5a789"
 *                   name:
 *                     type: string
 *                     example: "Widget A"
 *                   quantity:
 *                     type: integer
 *                     example: 100
 *                   price:
 *                     type: number
 *                     example: 19.99
 *       401:
 *         description: Unauthorized. Authentication failed.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/')
    .post(authenticateUser, createItem)
    .get(authenticateUser, getItems);

/**
 * @swagger
 * //{id}:
 *   get:
 *     summary: Get a specific inventory item
 *     description: Retrieves details of a specific inventory item by its ID.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the inventory item.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     responses:
 *       200:
 *         description: Item details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "61d2f8f5f4d4b1e0c3a5a789"
 *                 name:
 *                   type: string
 *                   example: "Widget A"
 *                 quantity:
 *                   type: integer
 *                   example: 100
 *                 price:
 *                   type: number
 *                   example: 19.99
 *       401:
 *         description: Unauthorized. Authentication failed.
 *       404:
 *         description: Item not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update an inventory item
 *     description: Updates the details of an existing inventory item by its ID.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the inventory item to update.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the item.
 *                 example: "Widget B"
 *               quantity:
 *                 type: integer
 *                 description: Updated quantity of the item.
 *                 example: 150
 *               price:
 *                 type: number
 *                 description: Updated price of the item.
 *                 example: 24.99
 *     responses:
 *       200:
 *         description: Item updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item updated successfully."
 *       400:
 *         description: Bad Request. Invalid input format.
 *       401:
 *         description: Unauthorized. Authentication failed.
 *       404:
 *         description: Item not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     description: Deletes an inventory item by its ID.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the inventory item to delete.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     responses:
 *       200:
 *         description: Item deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item deleted successfully."
 *       401:
 *         description: Unauthorized. Authentication failed.
 *       404:
 *         description: Item not found.
 *       500:
 *         description: Internal Server Error.
 */


router.route('/:id')
    .get(authenticateUser, getItem)
    .put(authenticateUser, updateItem)
    .delete(authenticateUser, deleteItem);


//router.get('/recipes', authenticateUser, getRecipeSuggestions);


export default router;
