import mongoose, { Document, Schema, Model } from 'mongoose';

/* -----------------------
   Ingredient Type
------------------------ */
export interface IIngredient {
    ingredientId?: string;
    name: string;
    quantity: string;
}

/* -----------------------
   Recipe Type
------------------------ */
export interface IRecipe extends Document {
    recipeId?: string;
    name: string;
    description: string;
    category: string;
    ingredients: IIngredient[];
    steps: string[];
    prep_time: number;
    cook_time: number;
    total_time: number;
    servings: number;
    tags: string[];
    image_url?: string;
    ratings: number;
}



/* -----------------------
   Ingredient Schema
------------------------ */
const ingredientSchema = new Schema<IIngredient>({
    ingredientId: {
        type: String,
        required: false,
        default: function (this: IIngredient) {
            return this.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        },
    },
    name: { type: String, required: true },
    quantity: { type: String, required: true },
});

/* -----------------------
   Recipe Schema
------------------------ */
const recipeSchema = new Schema<IRecipe>(
    {
        recipeId: {
            type: String,
            required: false,
            unique: true,
            default: function (this: IRecipe) {
                return this.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
            },
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

        tags: [{ type: String }],

        image_url: { type: String },

        ratings: { type: Number, default: 0 },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

/* -----------------------
   Model Export
------------------------ */
const Recipe =
    (mongoose.models.Recipe as Model<IRecipe>) ||
    mongoose.model<IRecipe>('Recipe', recipeSchema);

export default Recipe;
