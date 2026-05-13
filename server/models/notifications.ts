import mongoose, { HydratedDocument, Model, Schema, Types } from 'mongoose';

/* ------------------------
   Interface (Document)
------------------------ */
export interface INotification {
    user: Types.ObjectId;
    type: 'expired' | 'expiringSoon' | 'lowStock' | 'system';
    message: string;
    item?: Types.ObjectId;
    read: boolean;

    markAsRead(): Promise<INotification>;
}

export interface GetNotificationsResponse {
    success: boolean;
    count: number;
    notifications: INotification[];
}

export interface MarkAsReadResponse {
    success: boolean;
    notification?: INotification;
    message?: string;
}

export interface MessageResponse {
    success: boolean;
    message: string;
}

type NotificationDocument = HydratedDocument<INotification>;

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
        enum: ['expired', 'expiringSoon', 'lowStock', 'system'],  
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
notificationSchema.methods.markAsRead = async function (
    this: NotificationDocument
) {
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
