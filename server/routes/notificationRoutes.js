import express from 'express';
import {
    getNotifications,
    markAsRead,
    deleteNotification
} from '../controllers/notificationsController.js';
import { authenticateUser } from '../middleware/authMiddleware.js'; 

const router = express.Router();
router.use(authenticateUser);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications
 *     description: Retrieves a list of notifications for the authenticated user.
 *     tags:
 *       - Notifications
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "61d2f8f5f4d4b1e0c3a5a789"
 *                   message:
 *                     type: string
 *                     example: "You have a new message."
 *                   isRead:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-30T12:34:56Z"
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/notifications')
    .get(getNotifications);


/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Mark a notification as read
 *     description: Updates a notification's status to mark it as read.
 *     tags:
 *       - Notifications
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the notification.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     responses:
 *       200:
 *         description: Notification marked as read.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification marked as read."
 *       400:
 *         description: Bad request. Invalid ID format.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/notifications/:id')
    .put(markAsRead)
    .delete(deleteNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     description: Deletes a specific notification by its ID.
 *     tags:
 *       - Notifications
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the notification to delete.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     responses:
 *       204:
 *         description: Notification deleted successfully. No content is returned.
 *       400:
 *         description: Bad request. Invalid ID format.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal Server Error.
 */


export default router;


