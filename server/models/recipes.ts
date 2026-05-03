import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
    ingredientId: {
        type: String,
        required: false,
        default: function () {
            return this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
    },
    name: { type: String, required: true },
    quantity: { type: String, required: true }
});

const recipeSchema = new mongoose.Schema({
    recipeId: {
        type: String,
        required: false,
        unique: true,  // Keep ONLY this one (remove the schema.index() below)
        default: function () {
            return this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    ingredients: [ingredientSchema],
    steps: [{ type: String, required: true }],
    prep_time: { type: Number, required: true },
    cook_time: { type: Number, required: true },
    total_time: { type: Number, required: true },
    servings: { type: Number, required: true },
    tags: [String],
    image_url: { type: String },
    ratings: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});


export default mongoose.model('Recipe', recipeSchema);
