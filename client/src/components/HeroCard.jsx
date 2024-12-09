import React from 'react'

const HeroCard = ({ imgSrc, title, description, bgColor }) => {
    return (
        <article className={`w-[60%] flex justify-center items-center ${bgColor} custom-shadow`}>
            <div className="flex flex-col justify-center gap-4 px-6 py-8 border-2 
                border-stone-700 text-sm relative">
                <h2 className='text-xl font-[600]'>
                    {title}
                </h2>
                <img src={imgSrc} alt="" width={'280px'} />
                <p className=''>
                    {description}
                </p>
            </div>
        </article>
    )
}

export default HeroCard;
