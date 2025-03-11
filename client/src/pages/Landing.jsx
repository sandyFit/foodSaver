import React, { useEffect, useRef } from 'react';
import Navbar from '../layouts/Navbar';
import Hero from './Hero.jsx';
import Stats from './Stats.jsx';
import Features from './Features.jsx';
import Footer from '../layouts/Footer.jsx';
import How from './How.jsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
    const containerRef = useRef(null);
    const sectionRefs = useRef([]);

    useEffect(() => {
        const sections = sectionRefs.current;
        const container = containerRef.current;

        sections.forEach((panel, i) => {
            ScrollTrigger.create({
                trigger: panel,
                start: 'top top',
                pin: true,
                pinSpacing: false
            });

            if (i > 0) {
                gsap.from(panel, {
                    yPercent: 100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: panel,
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                        markers: false
                    }
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <main className="relative">           
            <div ref={containerRef} className="overflow-hidden">
                {[Hero, Stats, Features, How, Footer].map((Section, index) => (
                    <section
                        key={index}
                        ref={el => sectionRefs.current[index] = el}
                        className="min-h-screen relative bg-white"
                        style={{ zIndex: index }}
                    >
                        <Section />
                    </section>
                ))}
            </div>
        </main>
    );
};

export default Landing;
