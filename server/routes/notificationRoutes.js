import express from 'express';
import {
    getNotifications,
    markAsRead,
    deleteNotification
} from '../controllers/notificationsController.js';
import { authenticateUser } from '../middleware/authMiddleware.js'; 

const router = express.Router();
router.use(authenticateUser);

router.route('/notifications')
    .get(getNotifications);

router.route('/notifications/:id')
    .put(markAsRead)
    .delete(deleteNotification);

export default router;


