import React, { forwardRef } from 'react';

const StatsCard = forwardRef(({ bgColor, percentage, suffix, text }, ref) => {
    return (
        <article className={`${bgColor} w-full lg:w-[42vw] xl:w-[44vw] h-20 lg:h-36 border-2 border-stone-900 
            rounded-lg px-4 lg:p-6 xl:pl-10`}>
            <div className="w-full flex items-center h-full gap-2 lg:gap-4">
                <p className="text-3xl lg:text-5xl xl:text-5xl font-bold">
                    {percentage !== undefined ? (
                        <span ref={ref}>{0}</span>
                    ) : (
                        ''
                    )}
                    {suffix}
                </p>
                <p
                    className="text-[.8rem] sm:text-base lg:text-lg 2xl:text-xl font-medium xl:font-semibold">
                    {text}
                </p>
            </div>
        </article>
    );
});

export default StatsCard;
