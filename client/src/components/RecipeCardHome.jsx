import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCardHome = ({ bgColor, id, name, image_url, description }) => {
    console.log('ID de la receta desde RecipeCardHome:', id);

    return (
        <article className='w-[40vw] py-2'>
            <div className="flex flex-col p-6 border-2 border-stone-700 text-sm rounded-lg
                relative">
                    <h4 className='font-[600] text-center'>{name}</h4>
                <div className="flex f gap-4 items-end">
                    <img src={image_url} alt={name} width={'180px'} />

                    <div className="flex flex-col">
                        <p className='text-[.8rem]'>
                            {description}
                        </p>
                        <Link to={`/dashboard/recipes/${id}`}
                            className={`shadow-btn ${bgColor} text-center py-2 mt-3`}>
                            Ver Receta
                        </Link>
                    </div>
                </div>
                
                
                
            </div>
        </article>
    )
}

export default RecipeCardHome;
