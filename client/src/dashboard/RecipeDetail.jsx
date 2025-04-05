import React, { useEffect } from 'react';
import { useRecipes } from '../context/RecipesContext';
import { useParams } from 'react-router-dom';
import LoaderComponent from '../components/ui/LoaderComponent';
import { useTranslation } from 'react-i18next';

const RecipeDetail = () => {
    const { id } = useParams();
    const { getRecipeById, loading, recipe } = useRecipes();
    const { t, i18n } = useTranslation(['common', 'recipes']);

    useEffect(() => {
        if (id) getRecipeById(id);
    }, [id, getRecipeById]);

    if (!recipe) return <LoaderComponent isLoading={loading} />;

    // Helper function to get translated content with fallback
    const translateRecipe = (key, fallback) => {
        return t(`recipes:${recipe.recipeId}.${key}`, { defaultValue: fallback });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4">
                {translateRecipe('name', recipe.name)}
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
                            <strong>{t('common:prep_time')}:</strong> {recipe.prep_time} {t('common:minutes')}
                        </p>
                        <p>
                            <strong>{t('common:cook_time')}:</strong> {recipe.cook_time} {t('common:minutes')}
                        </p>
                        <p>
                            <strong>{t('common:total_time')}:</strong> {recipe.total_time} {t('common:minutes')}
                        </p>
                        <p>
                            <strong>{t('common:servings')}:</strong> {recipe.servings}
                        </p>
                    </div>
                    <p className="text-lg text-gray-600 mb-6">
                        {translateRecipe('description', recipe.description)}
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {t('common:ingredients')}
                </h2>
                {recipe.ingredients?.length > 0 ? (
                    <ul className="list-disc pl-5 text-gray-700">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-lg">
                                <strong>
                                    {translateRecipe(`ingredients.${ingredient.ingredientId}`, ingredient.name)}:
                                </strong> {ingredient.quantity}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">{t('recipes:noIngredients')}</p>
                )}
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {t('common:instructions')}
                </h2>
                {recipe.steps?.length > 0 ? (
                    <ol className="list-decimal pl-5 text-gray-700">
                        {recipe.steps.map((step, index) => (
                            <li key={index} className="text-lg">
                                {translateRecipe(`steps.${index}`, step)}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-gray-500">{t('recipes:noInstructions')}</p>
                )}
            </div>

            <div className="mb-6">
                <p>
                    <strong>{t('common:category')}:</strong> {recipe.category}
                </p>
                <p>
                    <strong>{t('common:tags')}:</strong> {recipe.tags?.join(", ")}
                </p>
            </div>
        </div>
    );
};

export default RecipeDetail;
