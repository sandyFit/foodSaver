import express from 'express';
import {
    getItems,
    createItem,
    getItem,
    updateItem,
    deleteItem

} from '../controllers/inventoryController';

const router = express.Router();


router.route('/inventory')
    .get(protect, getItems)
    .post(protect, createItem);

router.route('/inventory/:id')
    .get(protect, getItem)
    .put(protect, updateItem)
    .delete(protect, deleteItem);

router.get('/recipes', protect, getRecipeSuggestions);


export default router;
