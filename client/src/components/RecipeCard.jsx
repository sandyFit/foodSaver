import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ bgColor, id, name, image_url, description }) => {

    return (
        <article className='w-[24vw]'>
            <div className="flex flex-col gap-2 p-8 border-2 border-stone-700 text-sm rounded-lg
                relative">
                <h4 className='font-[600] text-center'>{ name}</h4>
                <img src={image_url} alt={name} width={'320px'} />
                <p >
                    {description}
                </p>
                    
                <Link to={`/dashboard/recipes/${id}`}
                    className={`shadow-btn ${bgColor} text-center py-2 mt-3`}>
                    Ver Receta
                </Link>
                    
            </div>
        </article>
    )
}

export default RecipeCard;
