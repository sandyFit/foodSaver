import React, { forwardRef } from 'react';

const StatsCard = forwardRef(({ bgColor, percentage, suffix, text }, ref) => {
    return (
        <article className={`${bgColor} w-[42vw] h-36 border-2 border-stone-900 rounded-lg p-6`}>
            <div className="w-full flex justify-between items-center h-full gap-6">
                <p className="text-6xl font-bold">
                    {percentage !== undefined ? (
                        <span ref={ref}>{0}</span>
                    ) : (
                        ''
                    )}
                    {suffix}
                </p>
                <p className="text-xl font-semibold">{text}</p>
            </div>
        </article>
    );
});

export default StatsCard;
