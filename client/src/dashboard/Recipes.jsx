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
        <section className='w-full grid grid-cols-12'>
            <LoaderComponent isLoading={loading} />

            <div className="flex col-span-12 justify-center items-center flex-wrap">
                <h3 className="w-full text-center text-xl font-semibold mb-4">
                    {t('recipes.title')}
                </h3>
                <div className="flex flex-wrap gap-4">
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
