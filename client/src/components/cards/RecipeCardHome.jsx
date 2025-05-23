import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const RecipeCardHome = ({ bgColor, id, name, image_url, description }) => {
    const { t, i18n } = useTranslation(['common', 'recipes']);
    const [translatedDescription, setTranslatedDescription] = useState('');
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth > 1300);

    useEffect(() => {
        // Function to find the English recipe key first (to be used as the translation key)
        const findRecipeKey = () => {
            // Get the English resources, which have the original recipe keys
            const enResources = i18n.getResourceBundle('en', 'recipes');
            if (!enResources || !enResources.recipes) return null;

            // First, try direct ID mapping if it exists (best case)
            if (enResources.recipes[id]) return id;

            // For each possible recipe in English resources
            for (const key in enResources.recipes) {
                const recipe = enResources.recipes[key];

                // Skip non-object entries
                if (!recipe || typeof recipe !== 'object') continue;

                // If recipe name matches our name, use this key
                if (recipe.name === name) {
                    return key;
                }
            }
            return null;
        };

        // Only try to find translation if description is empty
        if (!description || description.trim() === '') {
            const recipeKey = findRecipeKey();

            if (recipeKey) {
                // Use the found key to get description in current language
                const desc = t(`recipes:recipes.${recipeKey}.description`, '');
                setTranslatedDescription(desc);
            } else {
                setTranslatedDescription('');
            }
        }
    }, [name, description, id, t, i18n]);

    // Add window resize listener
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1300);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get the description to display with character limit for mobile only
    const getDescription = () => {
        let desc;
        if (description && description.trim() !== '') {
            desc = description;
        } else if (translatedDescription && translatedDescription.trim() !== '') {
            desc = translatedDescription;
        } else {
            desc = t('recipes:recipes.noDescription', 'No description available');
        }

        // Only limit characters on mobile screens
        if (!isDesktop) {
            return desc.length > 100 ? `${desc.substring(0, 97)}...` : desc;
        }

        // Return full description for desktop
        return desc;
    };

    const recipeName = name || t('recipes:recipes.noName', 'No name available');

    return (
        <article className='w-full  py-2'>
            <div className="flex flex-col p-6 border-2 border-stone-700 text-xs md:text-sm 
                rounded-lg relative">
                <h5 className='uppercase font-condensed mb-2'>
                    {recipeName}
                </h5>
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 items-center 
                    lg:items-end">
                    {image_url && (
                        <img
                            src={image_url}
                            alt={name}
                            className="w-[220px] lg:w-[180px] h-auto object-cover"
                        />
                    )}

                    <div className="flex flex-col gap-2">
                        <p className='text-[.8rem]'>
                            {getDescription()}
                        </p>
                        {id && (
                            <Link
                                to={`/dashboard/recipes/${id}`}
                                className={`shadow-btn ${bgColor} text-center py-2 mt-3`}
                            >
                                {t('dashboard.recipeCard.btn')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default RecipeCardHome;
