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
            required: [true, 'Ingrese el nombre del producto'],
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
            enum: ['lácteos', 'Carnes', 'vegetales', 'frutas', 'granos', 'otros'],
            default: 'otros'
        },
        addedDate: {
            type: Date,
            default: Date.now
        },

    },
    { timestamps: true }
);

// Inventory methods
userSchema.methods.addInventoryItem = function (item) {
    this.inventory.push(item);
    return this.save();
};

userSchema.methods.updateInventoryItem = function (itemId, updates) {
    const item = this.inventory.id(itemId);
    if (!item) throw new Error('Item not found');
    item.set(updates);
    return this.save();
};

userSchema.methods.removeInventoryItem = function (itemId) {
    this.inventory.pull(itemId);
    return this.save();
};

// Expiration check method
inventoryItemSchema.methods.checkExpiration = function () {
    const daysToExpire = Math.ceil(
        (this.expirationDate - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysToExpire <= 7 ? daysToExpire : null;
};



export default mongoose.model('InventoryItem', inventorySchema);
