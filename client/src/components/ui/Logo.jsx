import React from 'react';

const Logo = () => {
    return (
        <article className="flex justify-center items-center bg-stone-900 w-32 h-16 lg:w-44 lg:h-20
            xl:w-60 xl:h-24 px-3">
            <a href="/" className="h-6 lg:h-10 bg-stone-900 z-20 inline-block">
                <img src="/img/FoodSaver_lignt.png" alt="FoodSaver Logo" />
            </a>
        </article>
    )
}

export default Logo;
