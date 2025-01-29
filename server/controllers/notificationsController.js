import Notifications from '../models/notifications.js';

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notifications.find({ user: req.user.id })
            .sort('-createdAt')
            .populate('relatedItem', 'itemName category')
            .populate('user', 'fullName email');

        res.json({ success: true, count: notifications.length, notifications });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notifications.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, notification });
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notifications.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, message: 'Notification removed' });
    } catch (error) {
        next(error);
    }
};
