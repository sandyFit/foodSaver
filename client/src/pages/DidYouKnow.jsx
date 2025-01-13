import React from 'react';
import StatsCard from '../components/cards/StatsCard';

const DidYouKnow = () => {
    const stats = [
        {
            bgColor: 'bg-red-100',
            percentage: '30%',
            text: 'de los alimentos producidos a nivel mundial se desperdician.'
        },
        {
            bgColor: 'bg-teal-100',
            percentage: '+60%',
            text: 'del desperdicio de alimentos ocurre en los hogares.'
        },
        {
            bgColor: 'bg-blue-100',
            percentage: '1Billón',
            text: 'de dólares se pierden anualmente debido al desperdicio de alimentos.'
        },
        {
            bgColor: 'bg-purple-100',
            percentage: '',
            text: `Frutas, verduras, pan, lácteos y carnes son los alimentos 
                   que más se desperdician en los hogares.`
        }
    ];

    return (
        <section id="did-you-know" className="bg-yellow-100 w-full h-screen px-24">
            <header className="flex flex-col text-stone-900">
                <h2 className="text-3xl font-semibold mt-16">Sabías que...</h2>
                <h1 className="text-5xl font-bold mt-8">
                    Si el desperdicio de alimentos fuera un país,
                    ¡sería el tercer mayor emisor de gases de efecto invernadero!
                </h1>
                <h2 className="text-3xl font-semibold mt-8">Además...</h2>
            </header>
            <div className="flex flex-wrap justify-around mt-8 gap-4">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        bgColor={stat.bgColor}
                        percentage={stat.percentage}
                        text={stat.text}
                    />
                ))}
            </div>
        </section>
    );
};

export default DidYouKnow;
