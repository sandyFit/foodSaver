import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    ingredients: [
        {
            name: { type: String, required: true },
            quantity: { type: String, required: true },
        },
    ],
    steps: [{ type: String, required: true }],
    prep_time: { type: Number, required: true }, // en minutos
    cook_time: { type: Number, required: true }, // en minutos
    total_time: { type: Number, required: true },
    servings: { type: Number, required: true },
    tags: [String],
    image_url: { type: String },
    ratings: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export default mongoose.model('Recipe', recipeSchema);
