import InventoryItem from '../models/inventory.js';
import User from '../models/users.js';
import Notification from '../models/notifications.js';
import { isValidObjectId } from '../validators/inventoryValidator.js';

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

// Helper function to sanitize inventory items
const sanitizeItem = (item) => {
    const itemObj = item.toObject ? item.toObject() : item;
    const { user, __v, _id, ...rest } = itemObj;
    return {
        ...rest,
        id: _id // Convert _id to id
    };
};


export const createItem = async (req, res, next) => {
    try {
        // Validate that we have a user
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'auth.errors.unauthorized'
            });
        }

        // Validate required fields
        const { itemName, expirationDate, location } = req.body;
        if (!itemName || !expirationDate || !location) {
            return res.status(400).json({
                success: false,
                message: 'validations.required'
            });
        }

        // Create the item
        const item = await InventoryItem.create({
            ...req.body,
            user: req.user.id
        });

        // Add item to user's inventory
        const user = await User.findById(req.user.id);
        if (!user) {
            await InventoryItem.findByIdAndDelete(item._id);
            return res.status(404).json({
                success: false,
                message: 'auth.errors.userNotFound'
            });
        }

        await User.findByIdAndUpdate(req.user.id, {
            $push: { inventory: item._id }
        });

        // Trigger checks
        await checkExpiringItems(req.user.id);
        await checkLowStock(req.user.id);

        res.status(201).json({
            success: true,
            item: sanitizeItem(item)
        });
    } catch (error) {
        console.error('Error creating inventory item:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages[0]
            });
        }

        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'inventory.errors.createFailed'
        });
    }
};

export const getItems = async (req, res, next) => {
    try {
        const items = await InventoryItem.find({ user: req.user.id })
            .sort('-addedDate')
            .populate('user', 'fullName email');

        res.json({
            success: true,
            count: items.length,
            items: items.map(sanitizeItem) 
        });
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
        // Validate ID parameter
        if (!req.params.id || !isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid item ID'
            });
        }

        // Validate request body
        const { itemName, expirationDate, location } = req.body;
        if (!itemName || !expirationDate || !location) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const item = await InventoryItem.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            {
                itemName,
                expirationDate: new Date(expirationDate),
                location
            },
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

        res.json({ 
            success: true, 
            item: sanitizeItem(item) 
        });
    } catch (error) {
        console.error('Update error:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'inventory.errors.updateFailed'
        });
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

