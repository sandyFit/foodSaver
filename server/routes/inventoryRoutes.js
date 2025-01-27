import express from 'express';
import {
    handleUpdateInventory,
    handleGetInventory,
    handleDeleteInventoryItem
} from '../controllers/userController.js';

const router = express.Router();

router.get('/users/:id/inventory', handleGetInventory);
router.post('/users/:id/inventory', handleUpdateInventory);
router.delete('/users/:id/inventory', handleDeleteInventoryItem);

export default router;
