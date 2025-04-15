import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'models.inventory.validation.userRequired']
        },
        itemName: {
            type: String,
            required: [true, 'models.inventory.validation.itemNameRequired'],
            trim: true
        },
        
        expirationDate: {
            type: Date,
            required: [true, 'models.inventory.validation.expirationDateRequired']
        },
        location: {
            type: String,
            enum: {
                values: ['refrigerator', 'freezer', 'pantry', 'cabinet', 'other'],
                message: 'models.inventory.validation.locationInvalid'
            },
            required: [true, 'models.inventory.validation.locationRequired'],
            default: 'refrigerator'
        },
        
        addedDate: {
            type: Date,
            default: Date.now
        },
        // Version control fields
        version: { type: Number, default: 1 },
        
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
        },
        lastAction: {
            type: String,
            enum: ['added', 'updated', 'status_changed', 'location_changed', 'deleted'],
            default: 'added'
        }
    },
    { timestamps: true }
);

// Expiration check method (correctly added to inventoryItemSchema)
inventoryItemSchema.methods.checkExpiration = function () {
    const daysToExpire = Math.ceil(
        (this.expirationDate - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysToExpire <= 7 ? daysToExpire : null;
};

// The inventory management methods should be in the User model


export default mongoose.model('InventoryItem', inventoryItemSchema);
