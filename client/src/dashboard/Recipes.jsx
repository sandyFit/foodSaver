import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/cards/RecipeCard';
import { useRecipes } from '../context/RecipesContext';
import LoaderComponent from '../components/ui/LoaderComponent';
import { useTranslation } from 'react-i18next';

const Recipes = () => {

    const { allRecipes, getAllRecipes, loading, error } = useRecipes();
    const { t } = useTranslation(['common', 'recipes']);

    const bgColors = [
        'bg-red-100',
        'bg-yellow-100',
        'bg-blue-100',
        'bg-green-100',
        'bg-purple-100',
        'bg-pink-100',
    ];

    // Obtener todas las recetas
    useEffect(() => {
        getAllRecipes().catch(error => {
            console.error('Error fetching inventory:', error);
            toast.error(t('notifications.fetchError'));
        });
    }, []);


    return (
        <section className='w-full pb-6'>
            <LoaderComponent isLoading={loading} />

            <div className="flex flex-col items-center gap-4">
                <h4 className="w-full text-center text-xl font-semibold">
                    {t('recipes.title')}
                </h4>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allRecipes.map((recipe, index) => (
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
        </section>
    );
};

export default Recipes;
