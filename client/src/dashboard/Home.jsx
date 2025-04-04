import React, { useEffect, useState } from 'react';
import MealCard from '../components/cards/MealCard';
import { useRecipes } from '../context/RecipesContext';
import RecipeCardHome from '../components/cards/RecipeCardHome';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const {
        suggestedRecipes,
        getSuggestedRecipes,
        getExpiringMeals,
        expiringMeals = [],
        loading,
        error
    } = useRecipes();

    const { t } = useTranslation();
    const [fetchError, setFetchError] = useState(null);

    // Colores predefinidos para los fondos
    const bgColors = [
        'bg-red-100',
        'bg-yellow-100',
        'bg-blue-100',
        'bg-green-100',
        'bg-purple-100',
        'bg-pink-100',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetchError(null);
                const userStr = localStorage.getItem('user');

                if (!userStr) {
                    throw new Error(t('errors.userNotFound'));
                }

                const user = JSON.parse(userStr);

                // Try both id formats and verify user data
                if (!user || (!user.id && !user._id)) {
                    console.error('Invalid user data:', user);
                    throw new Error(t('errors.userNotFound'));
                }

                // Use the first available ID
                const userId = user.id || user._id;
                console.log('Fetching data with userId:', userId); // Debug log

                // Sequential fetching instead of Promise.all to better handle errors
                await getExpiringMeals(userId); // Await here
                await getSuggestedRecipes(userId); // Await here

            } catch (error) {
                console.error('Data fetch error:', error);
                setFetchError(error.message || t('errors.fetchFailed'));
            }
        };

        fetchData();
    }, [getExpiringMeals, getSuggestedRecipes, t]);

    // Function to render recipe content based on the structure of suggestedRecipes
    const renderRecipeContent = () => {
        if (fetchError) {
            return (
                <div className="text-red-600 p-4 bg-red-100 rounded">
                    {fetchError}
                </div>
            );
        }

        if (!suggestedRecipes) {
            return (
                <RecipeCardHome
                    name={t('dashboard.recipeCard.noContent')}
                    bgColor="bg-gray-100"
                />
            );
        }

        // If suggestedRecipes has recipes array (from the backend response)
        if (suggestedRecipes.recipes && Array.isArray(suggestedRecipes.recipes)) {
            return (
                <div>
                    <div className="mb-4">
                        <ul className="list-disc pl-5">
                            {suggestedRecipes.recipes.map((recipe, idx) => (
                                <li key={idx}>{recipe}</li>
                            ))}
                        </ul>
                    </div>

                    {suggestedRecipes.message && (
                        <p className="italic text-gray-700">{t(suggestedRecipes.message)}</p>
                    )}
                </div>
            );
        }

        // If suggestedRecipes is an array of recipe objects
        if (Array.isArray(suggestedRecipes)) {
            return (
                <ul className="grid grid-cols-1">
                    {suggestedRecipes.map((recipe, index) => (
                        <li key={recipe._id || index}>
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
            );
        }

        // Fallback for other structures
        return (
            <div className="text-gray-600 p-4 bg-gray-100 rounded">
                {t('dashboard.recipeCard.noContent')}
            </div>
        );
    };

    const renderExpiringItems = () => {
        if (fetchError) {
            return (
                <div className="text-red-600 p-4 bg-red-100 rounded">
                    {t('inventory.errors.fetchExpiredFailed')}
                </div>
            );
        }

        if (!expiringMeals || !expiringMeals.expiringItems || expiringMeals.expiringItems.length === 0) {
            return (
                <div className="text-gray-600 p-4 bg-gray-100 rounded">
                    {t('inventory.messages.noExpiringItems')}
                </div>
            );
        }

        return (
            <ul className='list-none flex flex-col gap-2'>
                {expiringMeals.expiringItems.map((item, index) => (
                    <li key={item._id || index}>
                        <MealCard
                            itemName={item.name}
                            expirationDate={item.expirationDate}
                            category={item.category || 'General'}
                            bgColor={bgColors[index % bgColors.length]}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <section className=''>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <h4 className='font-bold text-lg'>
                        {t('dashboard.expiringProducts')}
                    </h4>
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4
                                        rounded-full" role="status">
                                <span className="sr-only">{t('common.loading')}</span>
                            </div>
                        </div>
                    ) : (
                        renderExpiringItems()
                    )}
                </div>
                <div className="flex flex-col">
                    <h4 className='mb-2 font-bold text-lg'>
                        {t('dashboard.suggestedRecipes')}
                    </h4>
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4
                                        rounded-full" role="status">
                                <span className="sr-only">{t('common.loading')}</span>
                            </div>
                        </div>
                    ) : (
                        renderRecipeContent()
                    )}
                </div>
            </div>
        </section>
    );
};

export default Home;
