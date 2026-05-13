import InventoryItem from '../models/inventory.js';
import {
    IInventoryItem,
    InventoryFilter,
    GetItemsQuery,
    GetItemParams,
    UpdateItemParams,
    UpdateInventoryData,
} from '../models/inventory.js';
import User from '../models/users.js';
import Notification from '../models/notifications.js';
import { isValidObjectId } from '../validators/inventoryValidator.js';
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import {
    EXPIRING_DAYS_THRESHOLD,
    LOW_STOCK_THRESHOLD,
    MAX_BULK_DELETE
} from '../constants/constants.js';
import logger from '../utils/logger.js';

const checkExpiringItems = async (userId: string) => {
    try {
        const expiringItems = await InventoryItem.getExpiringItems(userId);
        if (expiringItems.length === 0) return;

        const itemIds = expiringItems.map(i => i._id);
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const existingNotifications = await Notification.find({
            user: userId,
            type: 'expiringSoon',
            item: { $in: itemIds },
            createdAt: { $gte: last24h }
        });

        const existingItemIds = new Set(
            existingNotifications.flatMap(n =>
                n.item ? [n.item.toString()] : []
            )
        );

        const newNotifications = expiringItems
            .filter(item => !existingItemIds.has(item._id.toString()))
            .map(item => ({
                user: userId,
                type: 'expiringSoon',
                message: `${item.itemName} is expiring soon`, // fallback human-readable
                translationKey: 'notifications.expiring.message',

                translationParams: {
                    itemName: item.itemName,
                    days: Math.ceil(
                        (item.expirationDate.getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )
                },

                item: item._id
            }));

        if (newNotifications.length > 0) {
            await Notification.insertMany(newNotifications);
        }
    } catch (error: any) {
        logger.error('Error checking expiring items:', error);
    }
};

const checkLowStock = async (
    userId: string,
    threshold = LOW_STOCK_THRESHOLD
) => {
    try {
        const lowStockItems = await InventoryItem.find({
            user: userId,
            quantity: { $lte: threshold }
        });

        if (lowStockItems.length === 0) return;

        const itemIds = lowStockItems.map(i => i._id);
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const existingNotifications = await Notification.find({
            user: userId,
            type: 'lowStock',
            item: { $in: itemIds },
            createdAt: { $gte: last24h }
        });

        const existingItemIds = new Set(
            existingNotifications.flatMap(n =>
                n.item ? [n.item.toString()] : []
            )
        );

        const newNotifications = lowStockItems
            .filter(item => !existingItemIds.has(item._id.toString()))
            .map(item => ({
                user: userId,
                type: 'expiringSoon',
                message: `${item.itemName} is expiring soon`, // fallback human-readable
                translationKey: 'notifications.expiring.message',
                translationParams: {
                    itemName: item.itemName,
                    days: Math.ceil((item.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                },
                item: item._id
            }));

        if (newNotifications.length > 0) {
            await Notification.insertMany(newNotifications);
        }
    } catch (error: any) {
        logger.error('Error checking low stock items:', error);
    }
};

// Helper function to sanitize inventory items
const sanitizeItem = (item: IInventoryItem | null) => {
    if (!item) return null;
    const itemObj = item.toObject ? item.toObject() : item;
    const { user, __v, _id, ...rest } = itemObj;
    return {
        ...rest,
        id: _id // Convert _id to id
    };
};

// Helper function to validate required fields
const validateRequiredFields = (
    body: Record<string, unknown>,
    requiredFields: string[]
) => {
    const missing = requiredFields.filter(field => !body[field]);
    return missing.length === 0 ? null : missing;
};

export const createItem = async (req: AuthRequest, res: Response) => {
    try {
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

  
        // Run notification checks asynchronously to avoid blocking the API response.
        // For larger-scale workloads, this should eventually move to a 
        // debounced queue or scheduled background job.
        setImmediate(() => {
            checkExpiringItems(req.user.id);
            checkLowStock(req.user.id);
        });

        res.status(201).json({
            success: true,
            item: sanitizeItem(item),
            message: 'inventory.messages.itemCreated'
        });
    } catch (error: any) {
        logger.error('Error creating inventory item:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
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


export const getItems = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const {
            page = '1',
            limit = '50',
            sortBy = 'addedDate',
            sortOrder = 'desc',
            location,
            expired,
            lowStock
        } = req.query as GetItemsQuery;

        const filter: InventoryFilter = {
            user: req.user.id
        };

        if (location) {
            filter.location = {
                $regex: location,
                $options: 'i'
            };
        }

        if (expired === 'true') {
            filter.expirationDate = {
                $lt: new Date()
            };
        }

        if (lowStock === 'true') {
            filter.quantity = {
                $lte: LOW_STOCK_THRESHOLD
            };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const sortOption: Record<string, 1 | -1> = {};

        sortOption[sortBy] =
            sortOrder === 'desc' ? -1 : 1;
 
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


    } catch (error: any) {
        logger.error('Error fetching inventory items:', error);
        res.status(500).json({
            success: false,
            message: 'inventory.errors.fetchFailed'
        });
    }
};

export const getItem = async (
    req: AuthRequest<GetItemParams>,
    res: Response
) => {
    try {
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
    } catch (error: any) {
        logger.error('Error fetching inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'inventory.errors.fetchFailed'
        });
    }
};


export const updateItem = async (
    req: AuthRequest<UpdateItemParams>,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'validations.invalidId'
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'validations.noUpdateData'
            });
        }

        const updateData: UpdateInventoryData = {};

        const allowedFields: (keyof UpdateInventoryData)[] = [
            'itemName',
            'expirationDate',
            'location',
            'quantity',
            'description'
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {

                if (field === 'expirationDate') {
                    const date = new Date(req.body[field]);

                    if (isNaN(date.getTime())) {
                        return res.status(400).json({
                            success: false,
                            message: 'validations.invalidDate'
                        });
                    }

                    updateData.expirationDate = date;

                } else if (field === 'quantity') {
                    const quantity = parseInt(req.body[field]);

                    if (isNaN(quantity) || quantity < 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'validations.invalidQuantity'
                        });
                    }

                    updateData.quantity = quantity;

                } else {
                    updateData[field] = req.body[field];
                }
            }
        };

        updateData.updatedDate = new Date();

        const item = await InventoryItem.findOneAndUpdate(
            { _id: id, user: req.user.id },
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
    } catch (error: any) {
        logger.error('Update error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map((err: any) => err.message).join(', '),
                validationErrors: Object.values(error.errors).map((err: any) => err.message)
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

export const deleteItem = async (
    req: AuthRequest<UpdateItemParams>,
    res: Response
) => {
    try {
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
                item: item._id
            })
        ]);

        res.json({
            success: true,
            message: 'inventory.messages.itemDeleted'
        });
    } catch (error: any) {
        logger.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'inventory.errors.deleteFailed'
        });
    }
};

// Bulk operations
export const bulkDelete = async (req: AuthRequest, res: Response) => {
    try {
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

        if (itemIds.length > MAX_BULK_DELETE) {
            return res.status(400).json({
                success: false,
                message: `inventory.errors.maxBulkDelete|${MAX_BULK_DELETE}`
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
                item: { $in: itemIds }
            })
        ]);

        res.json({
            success: true,
            deletedCount: result.deletedCount,
            message: 'inventory.messages.bulkDeleteCompleted'
        });
    } catch (error: any) {
        logger.error('Bulk delete error:', error);
        res.status(500).json({
            success: false,
            message: 'inventory.errors.bulkDeleteFailed'
        });
    }
};

// Get inventory statistics
export const getInventoryStats = async (req: AuthRequest, res: Response) => {
    try {
        const now = new Date();
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + EXPIRING_DAYS_THRESHOLD);

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
                quantity: { $lte: LOW_STOCK_THRESHOLD }
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
    } catch (error: any) {
        logger.error('Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'inventory.errors.statsFailed'
        });
    }
};
