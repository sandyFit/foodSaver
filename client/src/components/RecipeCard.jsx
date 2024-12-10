import React from 'react';

const RecipeCard = ({ bgColor, name, image_url, description }) => {


    return (
        <article className='w-[24vw]'>
            <div className="flex flex-col gap-2 p-8 border-2 border-stone-700 text-sm rounded-lg
                relative">
                <h4 className='font-[600]'>{ name}</h4>
                <img src={image_url} alt={name} width={'320px'} />
                <p>
                    {description}
                </p>
                <button className={`shadow-btn ${bgColor} py-2 mt-3`}>
                    Ver Mas
                </button>
            </div>
        </article>
    )
}

export default RecipeCard;
