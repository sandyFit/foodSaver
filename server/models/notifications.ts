import mongoose, { Document, Model, Schema, Types } from 'mongoose';

/* ------------------------
   Interface (Document)
------------------------ */
export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    type: 'expired' | 'lowStock' | 'system';
    message: string;
    item: mongoose.Types.ObjectId;
    read: boolean;
    
    markAsRead(): Promise<INotification>;
}

/* ------------------------
   Schema
------------------------ */
const notificationSchema = new Schema<INotification>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['expired', 'lowStock', 'system'],
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

/* ------------------------
   Methods
------------------------ */
notificationSchema.methods.markAsRead = function () {
    this.read = true;
    return this.save();
};

/* ------------------------
   Model Export
------------------------ */
const Notification: Model<INotification> =
    mongoose.models.Notification ||
    mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
