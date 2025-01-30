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


router.route('/inventory')
    .post(authenticateUser, createItem) 
    .get(authenticateUser, getItems);

router.route('/inventory/:id')
    .get(authenticateUser, getItem)
    .put(authenticateUser, updateItem)
    .delete(authenticateUser, deleteItem);


//router.get('/recipes', authenticateUser, getRecipeSuggestions);


export default router;
