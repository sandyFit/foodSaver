import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RecipeCard = ({ bgColor, id, name, image_url, description }) => {

    const { t } = useTranslation(['common', 'recipes']);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 580);

    return (
        <article className='w-full '>
            <div className="flex flex-col gap-2 p-4 md:p-6 border-2 border-stone-700 text-xs md:text-sm 
                rounded-lg relative">
                <h4 className='font-condensed uppercase text-center'>{ name}</h4>
                <img src={image_url} alt={name} width={'320px'} />
                <p >
                    {isMobile ? description.slice(0, 90)+ '...' : description}
                </p>
                    
                <Link to={`/dashboard/recipes/${id}`}
                    className={`shadow-btn ${bgColor} text-center py-2 mt-3`}>
                    {t('dashboard.recipeCard.btn')}
                </Link>
                    
            </div>
        </article>
    )
}

export default RecipeCard;
