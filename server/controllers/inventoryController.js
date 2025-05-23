import InventoryItem from '../models/inventory.js';
import User from '../models/users.js';
import Notification from '../models/notifications.js';
import { isValidObjectId } from '../validators/inventoryValidator.js';

const checkExpiringItems = async (userId) => {
    try {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() + 7);

        const expiringItems = await InventoryItem.find({
            user: userId,
            expirationDate: { $lte: threshold }
        });

        // Create notifications in batch to improve performance
        const notificationPromises = expiringItems.map(async (item) => {
            const daysToExpire = Math.ceil(
                (item.expirationDate - Date.now()) / (1000 * 60 * 60 * 24)
            );

            // Check if notification already exists to avoid duplicates
            const existingNotification = await Notification.findOne({
                user: userId,
                type: 'expired',
                relatedItem: item._id,
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
            });

            if (!existingNotification) {
                return Notification.create({
                    user: userId,
                    type: 'expired',
                    message: `notifications.expiring.message|${item.itemName}|${daysToExpire}`,
                    relatedItem: item._id
                });
            }
            return null;
        });

        await Promise.allSettled(notificationPromises);
    } catch (error) {
        console.error('Error checking expiring items:', error);
        // Don't throw - this is a background check that shouldn't break main operations
    }
};

const checkLowStock = async (userId, threshold = 3) => {
    try {
        const lowStockItems = await InventoryItem.find({
            user: userId,
            quantity: { $lte: threshold }
        });

        // Create notifications in batch
        const notificationPromises = lowStockItems.map(async (item) => {
            // Check if notification already exists to avoid duplicates
            const existingNotification = await Notification.findOne({
                user: userId,
                type: 'lowStock',
                relatedItem: item._id,
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
            });

            if (!existingNotification) {
                return Notification.create({
                    user: userId,
                    type: 'lowStock',
                    message: `notifications.lowStock.message|${item.itemName}|${item.quantity}`,
                    relatedItem: item._id
                });
            }
            return null;
        });

        await Promise.allSettled(notificationPromises);
    } catch (error) {
        console.error('Error checking low stock items:', error);
        // Don't throw - this is a background check that shouldn't break main operations
    }
};

// Helper function to sanitize inventory items
const sanitizeItem = (item) => {
    if (!item) return null;
    const itemObj = item.toObject ? item.toObject() : item;
    const { user, __v, _id, ...rest } = itemObj;
    return {
        ...rest,
        id: _id // Convert _id to id
    };
};

// Helper function to validate required fields
const validateRequiredFields = (body, requiredFields) => {
    const missing = requiredFields.filter(field => !body[field]);
    return missing.length === 0 ? null : missing;
};

export const createItem = async (req, res, next) => {
    try {
        // Validate authentication
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'auth.errors.unauthorized'
            });
        }

        // Validate required fields
        const requiredFields = ['itemName', 'expirationDate', 'location'];
        const missingFields = validateRequiredFields(req.body, requiredFields);
        if (missingFields) {
            return res.status(400).json({
                success: false,
                message: 'validations.required',
                missingFields
            });
        }

        // Validate expiration date
        const expirationDate = new Date(req.body.expirationDate);
        if (isNaN(expirationDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'validations.invalidDate'
            });
        }

        // Check if user exists before creating item
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'auth.errors.userNotFound'
            });
        }

        // Create the item with validated data
        const itemData = {
            ...req.body,
            user: req.user.id,
            expirationDate,
            quantity: req.body.quantity || 1, // Default quantity
            addedDate: new Date()
        };

        const item = await InventoryItem.create(itemData);

        // Add item to user's inventory
        await User.findByIdAndUpdate(req.user.id, {
            $push: { inventory: item._id }
        });

        // Trigger background checks (don't await to avoid blocking response)
        setImmediate(() => {
            checkExpiringItems(req.user.id);
            checkLowStock(req.user.id);
        });

        res.status(201).json({
            success: true,
            item: sanitizeItem(item),
            message: 'inventory.messages.itemCreated'
        });
    } catch (error) {
        console.error('Error creating inventory item:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages[0],
                validationErrors: messages
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'inventory.errors.duplicateItem'
            });
        }

        res.status(500).json({
            success: false,
            message: 'inventory.errors.createFailed'
        });
    }
};

export const getItems = async (req, res, next) => {
    try {
        // Validate authentication
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'auth.errors.unauthorized'
            });
        }

        // Parse query parameters for filtering and pagination
        const {
            page = 1,
            limit = 50,
            sortBy = 'addedDate',
            sortOrder = 'desc',
            location,
            expired,
            lowStock
        } = req.query;

        // Build filter query
        const filter = { user: req.user.id };

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (expired === 'true') {
            filter.expirationDate = { $lt: new Date() };
        }

        if (lowStock === 'true') {
            filter.quantity = { $lte: 3 };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOption = {};
        sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const [items, totalCount] = await Promise.all([
            InventoryItem.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(parseInt(limit))
                .populate('user', 'fullName email'),
            InventoryItem.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: items.length,
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            items: items.map(sanitizeItem)
        });
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        res.status(500).json({
            success: false,
            message: 'inventory.errors.fetchFailed'
        });
    }
};

export const getItem = async (req, res, next) => {
    try {
        // Validate authentication
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'auth.errors.unauthorized'
            });
        }

        // Validate ID parameter
        if (!req.params.id || !isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'validations.invalidId'
            });
        }

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

        res.status(200).json({
            success: true,
            item: sanitizeItem(item)
        });
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'inventory.errors.fetchFailed'
        });
    }
};

export const updateItem = async (req, res, next) => {
    try {
        // Validate authentication
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'auth.errors.unauthorized'
            });
        }

        // Validate ID parameter
        if (!req.params.id || !isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'validations.invalidId'
            });
        }

        // Validate at least one field is provided for update
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'validations.noUpdateData'
            });
        }

        // Build update object with only provided fields
        const updateData = {};
        const allowedFields = ['itemName', 'expirationDate', 'location', 'quantity', 'description'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'expirationDate') {
                    const date = new Date(req.body[field]);
                    if (isNaN(date.getTime())) {
                        return res.status(400).json({
                            success: false,
                            message: 'validations.invalidDate'
                        });
                    }
                    updateData[field] = date;
                } else if (field === 'quantity') {
                    const quantity = parseInt(req.body[field]);
                    if (isNaN(quantity) || quantity < 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'validations.invalidQuantity'
                        });
                    }
                    updateData[field] = quantity;
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        updateData.updatedDate = new Date();

        const item = await InventoryItem.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'inventory.errors.itemNotFound'
            });
        }

        // Trigger background checks
        setImmediate(() => {
            checkExpiringItems(req.user.id);
            checkLowStock(req.user.id);
        });

        res.json({
            success: true,
            item: sanitizeItem(item),
            message: 'inventory.messages.itemUpdated'
        });
    } catch (error) {
        console.error('Update error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', '),
                validationErrors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'inventory.errors.duplicateItem'
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
        // Validate authentication
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'auth.errors.unauthorized'
            });
        }

        // Validate ID parameter
        if (!req.params.id || !isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'validations.invalidId'
            });
        }

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

        // Remove item from user's inventory and clean up related notifications
        await Promise.all([
            User.findByIdAndUpdate(req.user.id, {
                $pull: { inventory: item._id }
            }),
            Notification.deleteMany({
                user: req.user.id,
                relatedItem: item._id
            })
        ]);

        res.json({
            success: true,
            message: 'inventory.messages.itemDeleted'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'inventory.errors.deleteFailed'
        });
    }
};

// Bulk operations
export const bulkDelete = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'auth.errors.unauthorized'
            });
        }

        const { itemIds } = req.body;
        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'validations.invalidItemIds'
            });
        }

        // Validate all IDs
        const invalidIds = itemIds.filter(id => !isValidObjectId(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'validations.invalidId',
                invalidIds
            });
        }

        const result = await InventoryItem.deleteMany({
            _id: { $in: itemIds },
            user: req.user.id
        });

        // Clean up user inventory and notifications
        await Promise.all([
            User.findByIdAndUpdate(req.user.id, {
                $pull: { inventory: { $in: itemIds } }
            }),
            Notification.deleteMany({
                user: req.user.id,
                relatedItem: { $in: itemIds }
            })
        ]);

        res.json({
            success: true,
            deletedCount: result.deletedCount,
            message: 'inventory.messages.bulkDeleteCompleted'
        });
    } catch (error) {
        console.error('Bulk delete error:', error);
        res.status(500).json({
            success: false,
            message: 'inventory.errors.bulkDeleteFailed'
        });
    }
};

// Get inventory statistics
export const getInventoryStats = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'auth.errors.unauthorized'
            });
        }

        const now = new Date();
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        const [
            totalItems,
            expiredItems,
            expiringItems,
            lowStockItems,
            locationStats
        ] = await Promise.all([
            InventoryItem.countDocuments({ user: req.user.id }),
            InventoryItem.countDocuments({
                user: req.user.id,
                expirationDate: { $lt: now }
            }),
            InventoryItem.countDocuments({
                user: req.user.id,
                expirationDate: { $gte: now, $lte: weekFromNow }
            }),
            InventoryItem.countDocuments({
                user: req.user.id,
                quantity: { $lte: 3 }
            }),
            InventoryItem.aggregate([
                { $match: { user: req.user.id } },
                { $group: { _id: '$location', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ])
        ]);

        res.json({
            success: true,
            stats: {
                totalItems,
                expiredItems,
                expiringItems,
                lowStockItems,
                locationBreakdown: locationStats
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'inventory.errors.statsFailed'
        });
    }
};
