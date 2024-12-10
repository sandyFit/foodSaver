import mongoose from 'mongoose';
import Recipe from '../models/recipes.js';

// Conectar a la base de datos de MongoDB
mongoose.connect('mongodb://localhost:27017/foodSaver', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Conectado a la base de datos');
    })
    .catch((err) => {
        console.log('Error al conectar a la base de datos:', err);
    });


const newRecipe = new Recipe({
    name: 'Ensalada Verde de Manzana y Yogurt',
    image_url: '/Recetas/ensalada verde.jpg', 
    description: 'Una ensalada vibrante y refrescante que deleita tus sentidos. La acidez crujiente de la manzana verde se une a la frescura del pepino y la suavidad del yogur, creando una combinación armoniosa y ligera. Perfecta como entrada, acompañamiento o en cualquier momento. 🥗🍏',
    ingredients: [
        { name: 'Manzanas verdes', quantity: '2, cortadas en cubos' },
        { name: 'Pepino grande', quantity: '1, pelado y cortado en rodajas finas' },
        { name: 'Yogurt natural', quantity: '1 taza' },
        { name: 'Jugo de limón', quantity: '2 cucharadas' },
        { name: 'Miel', quantity: '1 cucharada' },
        { name: 'Nueces picadas', quantity: '¼ taza' },
        { name: 'Pasas', quantity: '¼ taza' },
        { name: 'Hojas de lechuga fresca', quantity: 'Al gusto' },
        { name: 'Sal', quantity: 'Al gusto' },
        { name: 'Pimienta', quantity: 'Al gusto' }
    ],
    steps: [
        'Lava bien las manzanas y el pepino. Pela el pepino y córtalo en rodajas finas. Corta las manzanas en cubos, dejando la cáscara si lo prefieres.',
        'En un tazón grande, mezcla el yogurt natural con el jugo de limón y la miel. Revuelve bien hasta que todos los ingredientes estén bien integrados.',
        'Agrega las manzanas y el pepino al tazón con la mezcla de yogurt. Remueve suavemente para que las frutas queden bien cubiertas con el aderezo.',
        'Añade las nueces picadas y las pasas a la ensalada. Mezcla nuevamente para distribuir uniformemente los ingredientes.',
        'Lava las hojas de lechuga y sécalas bien. Coloca una cama de lechuga en un plato grande o en platos individuales.',
        'Sirve la ensalada de manzana y pepino sobre la cama de lechuga. Espolvorea con sal y pimienta al gusto antes de servir.',
        'Refrigera la ensalada durante al menos 15 minutos antes de servir para que los sabores se mezclen bien y la ensalada esté fresca.'
    ],
    prep_time: 10, // Tiempo de preparación en minutos
    cook_time: 0,  // Tiempo de cocción en minutos
    total_time: 25, // Tiempo total en minutos
    servings: 4,
    tags: ['ensalada', 'fresca', 'saludable', 'manzana', 'yogurt'],
    category: 'Ensaladas',
});


// Guardar la receta en la base de datos
newRecipe.save()
    .then(() => {
        console.log('Receta guardada correctamente');
        mongoose.connection.close(); // Cerrar la conexión
    })
    .catch((err) => {
        console.log('Error al guardar la receta:', err);
    });
