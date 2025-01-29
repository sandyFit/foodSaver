import express from 'express';
import {
    getNotifications,
    markAsRead,
    deleteNotification
} from '../controllers/notificationsController.js';

const router = express.Router();

router.route('/notifications')
    .get(protect, getNotifications);

router.route('/notifications/:id')
    .put(protect, markAsRead)
    .delete(protect, deleteNotification);

export default router;


