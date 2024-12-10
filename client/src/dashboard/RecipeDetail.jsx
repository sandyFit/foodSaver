import React from 'react';

const RecipeDetail = () => {
    const recipe = {
        name: 'Salteado Colorido de Verduras',
        image_url: '/Recetas/salteado-colorido-de-verduras.jpg', // Ajusta la ruta de la imagen según sea necesario
        description: 'Este salteado colorido de verduras es una mezcla vibrante y saludable que combina pimientos, cebolla, zanahoria y arvejas, todo salteado al dente y aderezado con un toque de limón. Perfecto como acompañamiento o plato principal ligero.',
        ingredients: [
            { name: 'Pimientos rojos', quantity: '2, cortados en tiras' },
            { name: 'Pimiento amarillo', quantity: '1, cortado en tiras' },
            { name: 'Cebolla mediana', quantity: '1, cortada en plumas' },
            { name: 'Zanahorias', quantity: '2, peladas y cortadas en rodajas finas' },
            { name: 'Arvejas verdes', quantity: '1 taza' },
            { name: 'Aceite de oliva', quantity: '2 cucharadas' },
            { name: 'Ajo', quantity: '1 diente, picado' },
            { name: 'Jugo de 1 limón', quantity: 'Al gusto' },
            { name: 'Sal', quantity: 'Al gusto' },
            { name: 'Pimienta negra', quantity: 'Al gusto' },
            { name: 'Perejil fresco', quantity: 'Picado para decorar' },
        ],
        steps: [
            'Calienta el aceite de oliva en una sartén grande a fuego medio.',
            'Agrega el ajo picado y sofríe durante 1 minuto hasta que esté fragante.',
            'Incorpora la cebolla y cocina por 2-3 minutos hasta que esté transparente.',
            'Añade los pimientos y las zanahorias, y saltea durante 5 minutos, removiendo ocasionalmente.',
            'Agrega las arvejas y cocina por 2-3 minutos más, hasta que todas las verduras estén al dente.',
            'Exprime el jugo de limón sobre las verduras y mezcla bien.',
            'Sazona con sal y pimienta al gusto.',
            'Retira del fuego y decora con perejil fresco picado antes de servir.',
        ],
        prep_time: 10, // Tiempo de preparación en minutos
        cook_time: 15, // Tiempo de cocción en minutos
        total_time: 25, // Tiempo total en minutos
        servings: 4,
        tags: ['verduras', 'salteado', 'saludable', 'vegetariano', 'acompañamiento'],
        category: 'Verduras',
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4">{recipe.name}</h1>

            <img src={recipe.image_url} alt={recipe.name} className="w-full h-64 object-cover rounded-lg mb-6" />

            <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Ingredientes</h2>
                <ul className="list-disc pl-5 text-gray-700">
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-lg">
                            <strong>{ingredient.name}:</strong> {ingredient.quantity}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Instrucciones</h2>
                <ol className="list-decimal pl-5 text-gray-700">
                    {recipe.steps.map((step, index) => (
                        <li key={index} className="text-lg">{step}</li>
                    ))}
                </ol>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Detalles</h2>
                <p><strong>Tiempo de preparación:</strong> {recipe.prep_time} minutos</p>
                <p><strong>Tiempo de cocción:</strong> {recipe.cook_time} minutos</p>
                <p><strong>Tiempo total:</strong> {recipe.total_time} minutos</p>
                <p><strong>Porciones:</strong> {recipe.servings}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Categoría y Etiquetas</h2>
                <p><strong>Categoría:</strong> {recipe.category}</p>
                <p><strong>Etiquetas:</strong> {recipe.tags.join(', ')}</p>
            </div>
        </div>
    );
};

export default RecipeDetail;
