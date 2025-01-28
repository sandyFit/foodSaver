import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: 'User',
        required: true
    },

    type: {
        type: String,
        enum: ['caducado', 'pocas existencias', 'sistema'],
        required: true
    },

    message: {
        type: String,
        required: true
    },

    relatedItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryItem'
    },

    read: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    

},
    { timestamps: true }
);

// Notification methods
userSchema.methods.addNotification = function (type, message, itemId) {
    this.notifications.push({
        type,
        message,
        itemId,
        read: false
    });
    return this.save();
};

// Mark as read method
notificationSchema.methods.markAsRead = function () {
    this.read = true;
    return this.save();
};


export default mongoose.model('Notifications', notificationSchema);
