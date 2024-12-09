import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces
        minlength: 3 // Ensures the name isn't empty
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Prevents negative or zero quantities
    },
    imagePath: {
        type: String,
        
    },
    expirationDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > new Date(); // Ensures the date is in the future
            },
            message: 'Expiration date must be in the future.'
        }
    }
});

// Creating and exporting the model based on the schema
export default mongoose.model('FoodItem', foodItemSchema);
