import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
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
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryItem'
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Notification methods
notificationSchema.methods.markAsRead = function () {
    this.read = true;
    return this.save();
};

export default mongoose.model('Notification', notificationSchema);
