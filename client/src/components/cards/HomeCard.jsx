import React from 'react';


const HomeCard = ({bgColor, icon, title, count}) => {
    return (
        <article className={`w-full max-w-lg px-6 py-3 border-2 border-stone-900 rounded-lg ${bgColor} bg-opacity-60`}>

                <div className="flex justify-between items-center">
                <div>                  
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold">{count}</p>
                </div>
                <span className='text-3xl font-extrabold text-gray-500 truncate'>{icon}</span>
                </div>
            
        </article>
    )
}

export default HomeCard
