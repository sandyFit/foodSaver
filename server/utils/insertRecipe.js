import mongoose from 'mongoose';
import Recipe from '../models/recipes.js';

// Simplified connection (remove deprecated options)
mongoose.connect('mongodb://localhost:27017/foodSaver')
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Connection error:', err));

const newRecipe = new Recipe({
    recipeId: 'colorful-stir-fried-vegetables',
    name: 'Colorful Stir-Fried Vegetables',
    image_url: '/Recetas/salteado-colorido-de-verduras.jpg',
    description: "This colorful stir-fry is a vibrant and healthy mix of bell peppers, onions, carrots, and peas, all sautéed al dente and seasoned with a hint of lemon. Perfect as a side dish or as a light main dish.🥕🌶️🍋",
    ingredients: [
        {
            ingredientId: 'green-peas',
            name: 'Green peas',
            quantity: '1 cup'
        },
        {

            ingredientId: 'carrots',
            name: 'Carrots',
            quantity: '2 peeled and thinly sliced'
        },
        {
            ingredientId: 'red-pepper',
            name: 'Red bell pepper',
            quantity: '2 chopped'
        },
        {
            ingredientId: 'yellow-pepper',
            name: 'Yellow bell pepper',
            quantity: '2 chopped'
        },

        {
            ingredientId: 'onion',
            name: 'Onion',
            quantity: '1 chopped'
        },

        {
            ingredientId: 'garlic',
            name: 'Garlic',
            quantity: '2 cloves minced'
        },

        {
            ingredientId: 'parsley',
            name: 'Parsley',
            quantity: '3 tablespoons chopped'
        },

        {
            ingredientId: 'lemon-juice',
            name: 'Lemon juice',
            quantity: '¼ cup'
        },

        {
            ingredientId: 'olive-oil',
            name: 'olive oil',
            quantity: '2 tablespoons'
        },

        {
            ingredientId: 'salt',
            name: 'Salt',
            quantity: 'to taste'
        },
        {
            ingredientId: 'pepper',
            name: 'Pepper',
            quantity: 'to taste'
        },

    ],
    steps: [
        "Heat the olive oil in a large skillet over medium heat.",
        "Add the minced garlic and sauté for 1 minute until fragrant.",
        "Add the onion and cook for 2-3 minutes until translucent.",
        "Add the peppers and carrots, and sauté for 5 minutes, stirring occasionally.",
        "Add the green peas and cook for another 3-4 minutes until all vegetables are tender but still crisp.",
        "Add the lemon juice, parsley, salt, and pepper. Stir to combine.",
        "Season with salt and pepper to taste.",
        "Remove from heat and garnish with chopped fresh parsley before serving.",
        "Enjoy your colorful stir-fried vegetables!",
    ],
    prep_time: 20,
    cook_time: 30,
    total_time: 50,
    servings: 4,
    tags: ['stir-fry', 'colorful', 'fresh vegetables', 'healthy', 'quick meal'],
    category: 'Vegetarian'
});


// Save recipe to the database
newRecipe.save()
    .then(() => {
        console.log('Recipe saved successfully!');
        mongoose.connection.close(); // Cerrar la conexión
    })
    .catch((err) => {
        console.log('Error saving recipe:', err);
    });
