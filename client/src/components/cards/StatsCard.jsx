import React, { forwardRef } from 'react';

const StatsCard = forwardRef(({ bgColor, percentage, suffix, text }, ref) => {
    return (
        <article className={`${bgColor} w-full lg:w-[42vw] h-20 lg:h-36 border-2 border-stone-900 
            rounded-lg px-4 lg:p-6`}>
            <div className="w-full flex justify-center items-center h-full gap-2 lg:gap-6">
                <p className="text-3xl lg:text-6xl font-bold">
                    {percentage !== undefined ? (
                        <span ref={ref}>{0}</span>
                    ) : (
                        ''
                    )}
                    {suffix}
                </p>
                <p className="text-[.8rem] lg:text-xl font-medium lg:font-semibold">{text}</p>
            </div>
        </article>
    );
});

export default StatsCard;
