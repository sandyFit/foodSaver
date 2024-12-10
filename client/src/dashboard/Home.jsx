import React, { useEffect, useState } from 'react';
import MealCard from '../components/MealCard';
import axios from 'axios';
import RecipeCardHome from '../components/RecipeCardHome';

const Home = () => {

    const [expiringMeals, setExpiringMeals] = useState([]);
    const [suggestedRecipes, setSuggestedRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/expiring-foodItems`);
            setExpiringMeals(response.data);
        } catch (err) {
            console.error('Error al obtener los productos.', err);
            setError('No se pudieron obtener los productos. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const getSuggestedRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/recipes-suggest`);
            console.log(response.data);  // Verifica los datos que recibes
            setSuggestedRecipes(response.data);
        } catch (err) {
            console.error('Error al obtener las recetas.', err);
            setError('No se pudieron obtener las recetas. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getExpiringMeals();
        getSuggestedRecipes();
    }, []);

    return (
        <section className='mt-5'>
            <div className="grid grid-cols-2">
                <div className="flex flex-col gap-2">
                    <h4 className='mb-4'>Productos próximos a caducar</h4>
                    <ul className='list-none flex flex-col gap-2'>
                        {expiringMeals.map((meal, index) => (
                            <li key={meal.id}>
                                <MealCard
                                    itemName={meal.itemName}
                                    expirationDate={meal.expirationDate}
                                    category={meal.category}
                                    bgColor={bgColors[index % bgColors.length]}
                                />
                            </li>
                        ))}                
                    </ul>
                </div>
                <div className="flex flex-col b gap-4">
                    <h4>Recetas sugeridas</h4>
                    {/* <ul className="grid grid-cols-1 gap-6">
                        {suggestedRecipes.map((recipe, index) => {
                            return (  
                                <li key={recipe.id}>
                                    <RecipeCardHome
                                        name={recipe.name}
                                        image_url={recipe.image_url}
                                        description={recipe.description}
                                        bgColor={bgColors[index % bgColors.length]}
                                    />
                                </li>
                            );
                        })}
                    </ul> */}


                </div>
            </div>
        </section>

    )
}

export default Home;
