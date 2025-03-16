import InventoryItem from '../models/inventory.js';
import User from '../models/users.js';
import Notification from '../models/notifications.js';

const checkExpiringItems = async (userId) => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + 7);

    const expiringItems = await InventoryItem.find({
        user: userId,
        expirationDate: { $lte: threshold }
    });

    for (const item of expiringItems) {
        const daysToExpire = Math.ceil(
            (item.expirationDate - Date.now()) / (1000 * 60 * 60 * 24)
        );

        await Notification.create({
            user: userId,
            type: 'expired',
            message: `notifications.expiring.message|${item.itemName}|${daysToExpire}`,
            relatedItem: item._id
        });
    }
};

const checkLowStock = async (userId, threshold = 3) => {
    const lowStockItems = await InventoryItem.find({
        user: userId,
        quantity: { $lte: threshold }
    });

    for (const item of lowStockItems) {
        await Notification.create({
            user: userId,
            type: 'lowStock',
            message: `notifications.lowStock.message|${item.itemName}|${item.quantity}`,
            relatedItem: item._id
        });
    }
};

export const createItem = async (req, res, next) => {
    try {
        const item = await InventoryItem.create({
            ...req.body,
            user: req.user.id
        });

        await User.findByIdAndUpdate(req.user.id, {
            $push: { inventory: item._id }
        });

        // Trigger checks
        await checkExpiringItems(req.user.id);
        await checkLowStock(req.user.id);

        res.status(201).json({
            success: true,
            item
        });
    } catch (error) {
        next(error);
    }
};

export const getItems = async (req, res, next) => {
    try {
        const items = await InventoryItem.find({ user: req.user.id })
            .sort('-addedDate')
            .populate('user', 'fullName email');

        res.json({ success: true, count: items.length, items });
    } catch (error) {
        next(error);
    }
};

export const getItem = async (req, res, next) => {
    try {
        const item = await InventoryItem.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate('user', 'fullName email');

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'inventory.errors.itemNotFound'
            });
        }

        res.json({ success: true, item });
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (req, res, next) => {
    try {
        const item = await InventoryItem.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'inventory.errors.itemNotFound'
            });
        }

        // Trigger checks
        await checkExpiringItems(req.user.id);
        await checkLowStock(req.user.id);

        res.json({ success: true, item });
    } catch (error) {
        next(error);
    }
};

export const deleteItem = async (req, res, next) => {
    try {
        const item = await InventoryItem.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'inventory.errors.itemNotFound'
            });
        }

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { inventory: item._id }
        });

        res.json({
            success: true,
            message: 'inventory.messages.itemDeleted'
        });
    } catch (error) {
        next(error);
    }
};

export const getRecipeSuggestions = async (req, res, next) => {
    try {
        const items = await InventoryItem.find({ user: req.user.id });
        const ingredients = items.map(item => item.itemName.toLowerCase()).join(',');

        const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
            params: {
                ingredients,
                number: 5,
                apiKey: process.env.SPOONACULAR_API_KEY
            }
        });

        const recipes = response.data.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            usedIngredients: recipe.usedIngredients,
            missingIngredients: recipe.missedIngredients
        }));

        res.json({
            success: true,
            count: recipes.length, recipes
        });
    } catch (error) {
        next(error);
    }
};
