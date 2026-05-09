import express from 'express';
import {
    getItems,
    createItem,
    updateItem,
    deleteItem
} from '../controllers/inventoryController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItemInput:
 *       type: object
 *       required:
 *         - itemName
 *         - expirationDate
 *         - location
 *       properties:
 *         itemName:
 *           type: string
 *           example: "Organic Milk"
 *           minLength: 2
 *           maxLength: 100
 *         expirationDate:
 *           type: string
 *           format: date-time
 *           example: "2023-12-31"
 *         location:
 *           type: string
 *           enum: [refrigerator, freezer, pantry, cabinet, other]
 *           example: "refrigerator"
 * 
 *     InventoryItemResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *           readOnly: true
 *         itemName:
 *           type: string
 *           example: "Organic Milk"
 *         expirationDate:
 *           type: string
 *           format: date-time
 *           example: "2025-04-30T00:00:00.000Z"
 *         location:
 *           type: string
 *           example: "refrigerator"
 *         addedDate:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           example: "2025-04-30T00:00:00.000Z"
 *         status:
 *           type: string
 *           enum: [in_stock, low_stock, out_of_stock]
 *           example: "in_stock"
 *           readOnly: true
 */

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management endpoints
 */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items (filtered to current user)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           enum: [refrigerator, freezer, pantry, cabinet, other]
 *         description: Filter by storage location
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [in_stock, low_stock, out_of_stock]
 *         description: Filter by expiration status
 *     responses:
 *       200:
 *         description: List of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItemResponse'
 *       401:
 *         description: Unauthorized
 * 
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItemInput'
 *           examples:
 *             milk:
 *               value:
 *                 itemName: "Organic Milk"
 *                 expirationDate: "2025-04-30"
 *                 location: "refrigerator"
 *             eggs:
 *               value:
 *                 itemName: "Free-range Eggs"
 *                 expirationDate: "2025-04-30"
 *                 location: "refrigerator"
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItemResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItemInput'
 *     responses:
 *       200:
 *         description: Item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItemResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 * 
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Item deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */

router.route('/')
    .get(authenticateUser, getItems)
    .post(authenticateUser, createItem);

router.route('/:id')
    .put(authenticateUser, updateItem)
    .delete(authenticateUser, deleteItem);

export default router;
