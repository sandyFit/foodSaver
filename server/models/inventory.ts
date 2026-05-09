import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { EXPIRING_DAYS_THRESHOLD } from '../constants/constants.js';

/* ------------------------
   Types
------------------------ */

export type Location =
    | 'refrigerator'
    | 'freezer'
    | 'pantry'
    | 'cabinet'
    | 'other';

export type InventoryAction =
    | 'added'
    | 'updated'
    | 'status_changed'
    | 'location_changed'
    | 'deleted';

/* ------------------------
   Interface
------------------------ */

export interface IInventoryItem extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    itemName: string;
    expirationDate: Date;
    quantity: number;
    location: Location;
    addedDate: Date;
    version: number;
    lastModifiedBy?: Types.ObjectId;
    lastAction: InventoryAction;

    checkExpiration(): number | null;
}

export interface IInventoryItemModel extends Model<IInventoryItem> {
    getExpiringItems(userId: string): Promise<IInventoryItem[]>;
}

export interface InventoryFilter {
    user: string;
    location?: {
        $regex: string;
        $options: string;
    };
    expirationDate?: {
        $lt: Date;
    };
    quantity?: {
        $lte: number;
    };
}

export interface GetItemsQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    location?: string;
    expired?: string;
    lowStock?: string;
}

export interface GetItemParams {
    id: string;
}

export interface UpdateItemParams {
    id: string;
}

export interface UpdateInventoryData {
    itemName?: string;
    expirationDate?: Date;
    location?: string;
    quantity?: number;
    description?: string;
    updatedDate?: Date;
}


/* ------------------------
   Schema
------------------------ */

const inventoryItemSchema = new Schema<IInventoryItem>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'models.inventory.validation.userRequired'],
        },

        itemName: {
            type: String,
            required: [true, 'models.inventory.validation.itemNameRequired'],
            trim: true,
        },

        expirationDate: {
            type: Date,
            required: [true, 'models.inventory.validation.expirationDateRequired'],
        },

        quantity: {
            type: Number,
            default: 1,
            min: [0, 'models.inventory.validation.quantityMin']
        },

        location: {
            type: String,
            enum: ['refrigerator', 'freezer', 'pantry', 'cabinet', 'other'],
            default: 'refrigerator',
            required: true,
        },

        addedDate: {
            type: Date,
            default: Date.now,
        },

        version: {
            type: Number,
            default: 1,
        },

        lastModifiedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        lastAction: {
            type: String,
            enum: [
                'added',
                'updated',
                'status_changed',
                'location_changed',
                'deleted',
            ],
            default: 'added',
        },
    },
    { timestamps: true }
);

/* ------------------------
   Methods
------------------------ */

inventoryItemSchema.methods.checkExpiration = function (
    this: IInventoryItem
): number {
    const diff =
        this.expirationDate.getTime() - Date.now();

    const daysToExpire = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return daysToExpire;
};

inventoryItemSchema.statics.getExpiringItems = async function (
    userId: string,
    daysThreshold = EXPIRING_DAYS_THRESHOLD
): Promise<IInventoryItem[]> {
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysThreshold);

    return this.find({
        user: userId,
        expirationDate: { $gte: now, $lte: threshold }
    });
};
/* ------------------------
   Model
------------------------ */

const InventoryItem =
    (mongoose.models.InventoryItem as IInventoryItemModel) ||
    mongoose.model<IInventoryItem, IInventoryItemModel>(
        'InventoryItem',
        inventoryItemSchema
    );

export default InventoryItem;
