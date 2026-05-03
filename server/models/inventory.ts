import mongoose, { Document, Model, Schema, Types } from 'mongoose';

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
    user: Types.ObjectId;
    itemName: string;
    expirationDate: Date;
    location: Location;
    addedDate: Date;
    version: number;
    lastModifiedBy?: Types.ObjectId;
    lastAction: InventoryAction;

    checkExpiration(): number | null;
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
): number | null {
    const diff =
        this.expirationDate.getTime() - Date.now();

    const daysToExpire = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return daysToExpire <= 7 ? daysToExpire : null;
};

/* ------------------------
   Model
------------------------ */

const InventoryItem: Model<IInventoryItem> =
    mongoose.models.InventoryItem ||
    mongoose.model<IInventoryItem>('InventoryItem', inventoryItemSchema);

export default InventoryItem;
