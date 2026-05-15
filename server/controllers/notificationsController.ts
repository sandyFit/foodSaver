import Notifications from '../models/notifications.js';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import {
    GetNotificationsResponse,
    MarkAsReadResponse,
    MessageResponse
} from '../models/notifications.js';


/**
 * Notifications Module
 * -----------------------------------------------------------------------------
 * Handles user expiration alerts and inventory-related notifications.
 *
 * Current implementation is fully request-driven:
 * - No background jobs
 * - No cron tasks
 * - No queue workers
 * - No real-time push system
 *
 * Notifications are retrieved and updated directly through authenticated
 * API requests using MongoDB + Mongoose.
 *
 * Supported operations:
 * - Fetch notifications
 * - Mark notifications as read
 * - Delete notifications
 *
 * All notification actions are ownership-protected to ensure users can only
 * access their own notification data.
 */


/**
 * Fetch all notifications for the authenticated user.
 *
 * This endpoint performs a direct MongoDB query at request time.
 * No caching layer or background synchronization job is involved yet.
 *
 * Notifications are sorted by newest first and populated
 * with related item and user data.
 */
export const getNotifications = async (
    req: AuthRequest,
    res: Response<GetNotificationsResponse>,
    next: NextFunction) => {
    try {
        const notifications = await Notifications.find({ user: req.user.id })
            .sort('-createdAt')
            .populate('item', 'itemName category')  
            .populate('user', 'fullName email');

        res.json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mark a single notification as read.
 *
 * This is an immediate database update triggered directly
 * by the client request. No queued/background processing occurs.
 */
export const markAsRead = async (
    req: AuthRequest,
    res: Response<MarkAsReadResponse>,
    next: NextFunction) => {
    try {
        const notification = await Notifications.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            notification
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a notification belonging to the authenticated user.
 *
 * Deletion occurs immediately during the request lifecycle.
 * No deferred cleanup job or soft-delete worker is used.
 */
export const deleteNotification = async (
    req: AuthRequest,
    res: Response<MessageResponse>,
    next: NextFunction) => {
    try {
        const notification = await Notifications.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!notification) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'Notification not found'
                });
        }

        res.json({
            success: true,
            message: 'Notification removed'
        });
    } catch (error) {
        next(error);
    }
};
