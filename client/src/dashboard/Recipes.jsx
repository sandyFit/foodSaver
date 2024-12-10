import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

const Recipes = () => {
    const [recipesList, setRecipesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const BASE_URL = 'http://localhost:5555/api';

    const bgColors = [
        'bg-red-100',
        'bg-yellow-100',
        'bg-blue-100',
        'bg-green-100',
        'bg-purple-100',
        'bg-pink-100',
    ];

    // Obtener todas las recetas
    const getAllRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/recipes`);
            console.log("Response Data:", response.data); // Check the structure here
            setRecipesList(response.data);
        } catch (err) {
            console.error('Error al obtener las recetas.', err);
            setError('No se pudieron obtener las recetas. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // In useEffect, log the recipesList after it's set
    useEffect(() => {
        getAllRecipes();
    }, []);

    useEffect(() => {
        console.log("Recipes List:", recipesList); // Check if the recipes are set correctly
    }, [recipesList]);


    return (
        <section className='w-full grid grid-cols-12'>
            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : recipesList.length === 0 ? (
                <p className="text-center col-span-12">No hay recetas disponibles.</p>
            ) : (
                <div className="flex col-span-12 justify-center items-center flex-wrap">
                    <h3 className="w-full text-center text-xl font-semibold mb-4">
                        Tus Mejores Recetas
                    </h3>
                    <div className="flex flex-wrap gap-4">                       
                        {recipesList.map((recipe, index) => (
                            <RecipeCard
                                key={recipe._id}
                                name={recipe.name}
                                image_url={recipe.image_url}
                                description={recipe.description}
                                bgColor={bgColors[index % bgColors.length]}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Recipes;
