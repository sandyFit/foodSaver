import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { toast } from 'react-hot-toast';

const Recipes = () => {
    const [recipesList, setRecipesList] = useState([]);
    const [loading, setLoading] = useState(false);
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

        try {
            const response = await axios.get(`${BASE_URL}/recipes`);
            console.log("Response Data:", response.data); 
            setRecipesList(response.data);
        } catch (error) {
            console.error('Error al obtener las recetas.', error);
            toast.error('No se pudieron obtener las recetas. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllRecipes();
    }, []);


    return (
        <section className='w-full grid grid-cols-12'>
            {loading ? (
                <p>Cargando...</p>           
            ) : (
                <div className="flex col-span-12 justify-center items-center flex-wrap">
                    <h3 className="w-full text-center text-xl font-semibold mb-4">
                        Tus Mejores Recetas
                    </h3>
                    <div className="flex flex-wrap gap-4">                       
                        {recipesList.map((recipe, index) => (
                            <RecipeCard
                                key={recipe._id}
                                id={recipe._id}
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
