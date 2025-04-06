import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const RecipeCardHome = ({ bgColor, id, name, image_url, description }) => {
    const { t } = useTranslation(['common', 'recipes']);

    // Match recipe ID to translation ID
    const getTranslationKeyFromName = () => {
        // This map connects database IDs to translation keys
        const idToTranslationMap = {
            '67f0ca2b27a49323d3db189d': 'tropical-coconut-punch',
            '67f1636e35e62906f2f616e1': 'chicken-with-fresh-vegetables'
        };

        return idToTranslationMap[id] || null;
    };

    // Try to get description from translations if empty
    const getDescription = () => {
        // If description prop is not empty, use it
        if (description && description.trim() !== '') {
            return description;
        }

        // Try to find a matching translation key
        const translationKey = getTranslationKeyFromName();
        if (translationKey) {
            return t(`recipes:recipes.${translationKey}.description`, '');
        }

        // Default fallback
        return 'No description available';
    };

    return (
        <article className='w-[40vw] py-2'>
            <div className="flex flex-col p-6 border-2 border-stone-700 text-sm rounded-lg relative">
                <h4 className='font-[600] text-center'>{name}</h4>
                <div className="flex gap-4 items-end">
                    {image_url && (
                        <img
                            src={image_url}
                            alt={name}
                            className="w-[180px] h-auto object-cover"
                        />
                    )}

                    <div className="flex flex-col">
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
