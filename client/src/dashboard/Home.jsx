import React, { useEffect, useState } from 'react';
import MealCard from '../components/MealCard';
import axios from 'axios';
import RecipeCardHome from '../components/RecipeCardHome';
import { toast } from 'react-hot-toast';

const Home = () => {

    const [expiringMeals, setExpiringMeals] = useState([]);
    const [suggestedRecipes, setSuggestedRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const BASE_URL = 'http://localhost:5555/api';

    // Colores predefinidos para los fondos
    const bgColors = [
        'bg-red-100',
        'bg-yellow-100',
        'bg-blue-100',
        'bg-green-100',
        'bg-purple-100',
        'bg-pink-100',
    ];

    const getExpiringMeals = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${BASE_URL}/expiring-foodItems`);
            setExpiringMeals(response.data);
        } catch (error) {
            // console.error('Error al obtener los productos.', error);
            toast.error('No se pudieron obtener los productos. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const getSuggestedRecipes = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${BASE_URL}/recipes-suggest`);
            // console.log(`Response data from axios:`);
            // console.log(response.data)
            setSuggestedRecipes(response.data);
        } catch (error) {
            // console.error('Error al obtener las recetas.', error);
            toast.error('No se pudieron obtener las recetas. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getExpiringMeals();
        getSuggestedRecipes();
    }, []);

    useEffect(() => {
        console.log(`suggested recipes from useEffect: ${suggestedRecipes}`);
    }, [suggestedRecipes]);

    return (
        <section className=''>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <h4 className='mb-2 font-bold text-lg'>Productos próximos a caducar</h4>
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                                <span className="sr-only">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <ul className='list-none flex flex-col gap-2'>
                            {expiringMeals.map((meal, index) => (
                                <li key={meal._id}>
                                    <MealCard
                                        itemName={meal.itemName}
                                        expirationDate={meal.expirationDate}
                                        category={meal.category}
                                        bgColor={bgColors[index % bgColors.length]}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex flex-col">
                    <h4 className='mb-2 font-bold text-lg'>Recetas sugeridas</h4>
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                                <span className="sr-only">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-1">
                            {suggestedRecipes.map((recipe, index) => (
                                <li key={index}>
                                    <RecipeCardHome
                                        id={recipe.id}
                                        name={recipe.name}
                                        image_url={recipe.image_url}
                                        description={recipe.description}
                                        bgColor={bgColors[index % bgColors.length]}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
};


export default Home;
