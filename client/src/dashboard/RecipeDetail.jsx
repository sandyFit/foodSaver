import React, { useEffect } from 'react';
import { useRecipes } from '../context/RecipesContext';
import { useParams } from 'react-router-dom';
import LoaderComponent from '../components/ui/LoaderComponent';
import { useTranslation } from 'react-i18next';

const RecipeDetail = () => {
    const { id } = useParams();
    const { getRecipeById, loading, recipe } = useRecipes();
    const { t } = useTranslation(['recipes', 'common']);

    useEffect(() => {
        if (id) getRecipeById(id);
    }, [id, getRecipeById]);

    if (!recipe) return <LoaderComponent isLoading={loading} />;

    // Simplified and fixed translation helper
    const translate = (key, fallback) => {
        return t(key, { defaultValue: fallback });
    };

    // Helper for recipe fields
    const translateRecipe = (field, fallback) => {
        return translate(`recipes.${recipe.recipeId}.${field}`, fallback);
    };

    // Helper for recipe steps (note: steps are 1-indexed in your JSON)
    const translateStep = (index, fallback) => {
        return translate(`recipes.${recipe.recipeId}.steps.${index + 1}`, fallback);
    };

    return (
        <div className="md:max-w-4xl mx-auto pt-2 md:p-6 overflow-y-auto">
            <h2 className="md:text-center text-gray-800 uppercase font-condensed mb-4">
                {translateRecipe('name', recipe.name)}
            </h2>

            <div className="flex flex-col md:flex-row gap-0 md:gap-4">
                <img
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="md:w-1/2 object-cover rounded-lg mb-6"
                />

                <div className="flex flex-col justify-end text-sm md:text-lg">
                    <div className="mb-6">
                        <p className='flex gap-2'>
                            <strong>{translate('recipes.ui.prep_time', 'Prep Time')}:</strong>
                            {recipe.prep_time} {translate('recipes.ui.minutes', 'minutes')}
                        </p>
                        <p className='flex gap-2'>
                            <strong>{translate('recipes.ui.cook_time', 'Cook Time')}:</strong>
                            {recipe.cook_time} {translate('recipes.ui.minutes', 'minutes')}
                        </p>
                        <p className='flex gap-2'>
                            <strong>{translate('recipes.ui.total_time', 'Total Time')}:</strong>
                            {recipe.total_time} {translate('recipes.ui.minutes', 'minutes')}
                        </p>
                        <p className='flex gap-2'>
                            <strong>{translate('recipes.ui.servings', 'Servings')}:</strong>
                            {recipe.servings}
                        </p>
                    </div>
                    <p className=" text-gray-600 mb-6">
                        {translateRecipe('description', recipe.description)}
                    </p>
                </div>
            </div>

            <div className="mb-6 text-sm md:text-lg">
                <h3 className="uppercase font-condensed text-gray-800">
                    {translate('recipes.ui.ingredients', 'Ingredients')}
                </h3>
                {recipe.ingredients?.length > 0 ? (
                    <ul className="list-disc pl-5 text-gray-700">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                <strong>
                                    {translate(
                                        `recipes.${recipe.recipeId}.ingredients.${ingredient.ingredientId}`,
                                        ingredient.name
                                    )}:
                                </strong> {ingredient.quantity}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">
                        {translate('recipes.noIngredients', 'No ingredients available')}
                    </p>
                )}
            </div>

            <div className="mb-6 text-sm md:text-lg">
                <h3 className="uppercase font-condensed text-gray-800">
                    {translate('recipes.ui.steps', 'Steps')}
                </h3>
                {recipe.steps?.length > 0 ? (
                    <ol className="list-decimal pl-5 text-gray-700">
                        {recipe.steps.map((step, index) => (
                            <li key={index}>
                                {translateStep(index, step)}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-gray-500">
                        {translate('recipes.noSteps', 'No steps available')}
                    </p>
                )}
            </div>

            <div className="text-xs md:text-sm mb-6">
                <p className='flex gap-2'>
                    <strong>{translate('recipes.ui.category', 'Category')}:</strong>
                    {recipe.category}
                </p>
                <p className='flex gap-2'>
                    <strong>{translate('recipes.ui.tags', 'Tags')}:</strong>
                    {recipe.tags?.join(", ")}
                </p>
            </div>
        </div>
    );
};

export default RecipeDetail;
