import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import StatsCard from '../components/cards/StatsCard';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const Stats = () => {
    const statsRefs = useRef([]);
    const { t } = useTranslation();

    const stats = [
        {
            bgColor: 'bg-red-100',
            percentage: 30,
            suffix: '%',
            text: t('landing.stats.stat1')
        },
        {
            bgColor: 'bg-teal-100',
            percentage: 60,
            suffix: '%+',
            text: t('landing.stats.stat2')
        },
        {
            bgColor: 'bg-blue-100',
            percentage: 1,
            suffix: t('landing.stats.billion'),
            text: t('landing.stats.stat3')
        },
        {
            bgColor: 'bg-purple-100',
            text: t('landing.stats.stat4')
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
                <h2 className="text-3xl font-semibold mt-16">
                    {t('landing.stats.intro')}
                </h2>
                <h2 className="text-5xl font-bold mt-8 uppercase tracking-tighter">
                    {t('landing.stats.statsTitle')}
                </h2>
                <h2 className="text-3xl font-semibold mt-8">
                    {t('landing.stats.statsSubtitle')}
                </h2>
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
