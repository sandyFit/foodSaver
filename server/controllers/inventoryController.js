import User from '../models/user.js';
import axios from 'axios';

const LOW_STOCK_THRESHOLD = 3;
const EXPIRATION_DAYS = 7;

export const getInventory = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    return user.inventory;
};

export const addItem = async (userId, itemData) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const newItem = await user.addInventoryItem(itemData);
    user.checkExpirations();
    user.checkLowStock();
    return newItem;
};

export const updateItem = async (userId, itemId, updates) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const updatedItem = await user.updateInventoryItem(itemId, updates);
    user.checkExpirations();
    user.checkLowStock();
    return updatedItem;
};

export const removeItem = async (userId, itemId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    return user.removeInventoryItem(itemId);
};

export const getRecipes = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const ingredients = user.inventory
        .map(item => item.itemName.toLowerCase())
        .join(',');

    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
            params: {
                ingredients,
                apiKey: process.env.SPOONACULAR_API_KEY,
                number: 5
            }
        });

        return response.data.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            usedIngredients: recipe.usedIngredients,
            missingIngredients: recipe.missedIngredients
        }));
    } catch (error) {
        throw new Error('Failed to fetch recipes: ' + error.message);
    }
};

export const getNotifications = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    return user.notifications.filter(n => !n.read);
};

export const markNotificationRead = async (userId, notificationId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const notification = user.notifications.id(notificationId);
    if (!notification) throw new Error('Notification not found');

    notification.read = true;
    await user.save();
    return notification;
};
