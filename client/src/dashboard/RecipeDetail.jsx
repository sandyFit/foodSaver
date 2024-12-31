import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const RecipeDetail = () => {
    
    const [recipe, setRecipe] = useState({
        name: '',
        image_url: '',
        description: '',
        ingredients: [],
        steps: [],
        prep_time: 0,
        cook_time: 0,
        total_time: 0,
        servings: 0,
        category: '',
        tags: []
    });

    const [loading, setLoading] = useState('')
    const { id } = useParams();
    // console.log('ID recibido:', id);

    const BASE_URL = 'http://localhost:5555/api';

    const getRecipeById = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${BASE_URL}/recipes/${id}`);
            setRecipe(response.data)
        } catch (error) {
            // console.error('Error al obtener la receta.', error);
            setError('No se pudo obtener la receta. Inténtalo nuevamente.');
        } finally {
            // console.error('Error en la petición');
            setLoading(false);
            toast.error('Error en la petición:');
        }
    }

    useEffect(() => {
        getRecipeById();
    }, [id]);

    if (loading) {
        return <p className="text-center text-lg font-semibold">Cargando receta...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4">
                {recipe.name}
            </h1>

            <div className="flex gap-4">
                <img
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="w-1/2 object-cover rounded-lg mb-6"
                />

                <div className="flex flex-col justify-end">
                    <div className="mb-6">
                        <p>
                            <strong>Tiempo de preparación:</strong> {recipe.prep_time} minutos
                        </p>
                        <p>
                            <strong>Tiempo de cocción:</strong> {recipe.cook_time} minutos
                        </p>
                        <p>
                            <strong>Tiempo total:</strong> {recipe.total_time} minutos
                        </p>
                        <p>
                            <strong>Porciones:</strong> {recipe.servings}
                        </p>
                    </div>
                    <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Ingredientes</h2>
                {recipe.ingredients.length > 0 ? (
                    <ul className="list-disc pl-5 text-gray-700">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-lg">
                                <strong>{ingredient.name}:</strong> {ingredient.quantity}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No hay ingredientes disponibles.</p>
                )}
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Instrucciones</h2>
                {recipe.steps.length > 0 ? (
                    <ol className="list-decimal pl-5 text-gray-700">
                        {recipe.steps.map((step, index) => (
                            <li key={index} className="text-lg">
                                {step}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-gray-500">No hay instrucciones disponibles.</p>
                )}
            </div>

            <div className="mb-6">
                <p>
                    <strong>Categoría:</strong> {recipe.category}
                </p>
                <p>
                    <strong>Etiquetas:</strong> {recipe.tags.join(", ")}
                </p>
            </div>
        </div>
    );
};

export default RecipeDetail;
