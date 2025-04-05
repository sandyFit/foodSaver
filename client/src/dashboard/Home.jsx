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
                const userId = user.id || user._id;

                // Ensure userId is a string
                const userIdStr = userId.toString();
                console.log('Fetching data with userId:', userIdStr);

                await getExpiringMeals(userIdStr);
                await getSuggestedRecipes(userIdStr);

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

        if (loading) {
            return (
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                        <span className="sr-only">{t('common.loading')}</span>
                    </div>
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

        const recipesArray = Array.isArray(suggestedRecipes)
            ? suggestedRecipes
            : suggestedRecipes.recipes || [];

        if (recipesArray.length === 0) {
            return (
                <div className="text-gray-600 p-4 bg-gray-100 rounded">
                    {t('dashboard.recipeCard.noContent')}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-4">
                {recipesArray.map((recipe, index) => (
                    <RecipeCardHome
                        key={recipe.id || recipe._id || index}
                        id={recipe.id || recipe._id}
                        name={recipe.name}
                        image_url={recipe.image_url}
                        description={recipe.description || ''}
                        bgColor={bgColors[index % bgColors.length]}
                    />
                ))}
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
