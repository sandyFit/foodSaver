import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import StatsCard from '../components/cards/StatsCard';

gsap.registerPlugin(ScrollTrigger);

const Stats = () => {
    const statsRefs = useRef([]);

    const stats = [
        {
            bgColor: 'bg-red-100',
            percentage: 30,
            suffix: '%',
            text: 'de los alimentos producidos a nivel mundial se desperdician.'
        },
        {
            bgColor: 'bg-teal-100',
            percentage: 60,
            suffix: '%+',
            text: 'del desperdicio de alimentos ocurre en los hogares.'
        },
        {
            bgColor: 'bg-blue-100',
            percentage: 1,
            suffix: 'Billón',
            text: 'de dólares se pierden anualmente debido al desperdicio de alimentos.'
        },
        {
            bgColor: 'bg-purple-100',
            text: `Frutas, verduras, pan, lácteos y carnes son los alimentos 
                que más se desperdician en los hogares.` // No percentage here
        }
    ];

    useEffect(() => {
        statsRefs.current.forEach((ref, index) => {
            if (!ref || stats[index].percentage === undefined) return;  // Skip if no percentage

            gsap.to(ref, {
                textContent: stats[index].percentage,
                duration: 2,
                ease: "power1.out",
                snap: { textContent: 1 },

                scrollTrigger: {
                    trigger: ref,
                    start: 'top bottom-=100',
                    end: 'center center',
                    toggleActions: "play none none reverse",
                    once: true
                }
            });
        });
    }, []);

    return (
        <section id="stats" className="bg-yellow-100 w-full h-screen px-24">
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
                        ref={el => statsRefs.current[index] = el}
                        {...stat}
                    />
                ))}
            </div>
        </section>
    );
};

export default Stats;
