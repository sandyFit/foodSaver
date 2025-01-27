import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true,
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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    { timestamps: true }
);

export default mongoose.model('Inventory', inventorySchema);
