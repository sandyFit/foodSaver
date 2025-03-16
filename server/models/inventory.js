import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        itemName: {
            type: String,
            required: [true, 'models.inventory.validation.itemNameRequired'],
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        expirationDate: {
            type: Date,
            required: true
        },
        category: {
            type: String,
            enum: ['diary', 'meat', 'vegetables', 'fruits', 'grains', 'other'],
            default: 'other'
        },
        addedDate: {
            type: Date,
            default: Date.now
        },
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
