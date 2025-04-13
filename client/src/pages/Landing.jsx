import React, { useEffect, useRef } from 'react';
import Hero from './Hero.jsx';
import Stats from './Stats.jsx';
import Footer from '../layouts/Footer.jsx';
import How from './How.jsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
    // const containerRef = useRef(null);
    // const sectionRefs = useRef([]);

    // useEffect(() => {
    //     const sections = sectionRefs.current;

    //     sections.forEach((panel, i) => {
    //         ScrollTrigger.create({
    //             trigger: panel,
    //             start: 'top top',
    //             pin: true,
    //             pinSpacing: false,
    //             anticipatePin: 1 // Helps prevent janky pin behavior
    //         });
    //     });

    //     return () => {
    //         ScrollTrigger.getAll().forEach(t => t.kill());
    //     };
    // }, []);

    return (
        <main className="relative">
            <div className="overflow-hidden">
                <Hero />
                {[Stats, How, Footer].map((Section, index) => (
                    <section
                        key={index}
                        className="min-h-screen relative"
                        style={{
                            zIndex: index, // Forward z-index order - lower sections have higher z-index
                            backgroundColor: 'white',
                            position: 'relative',
                            isolation: 'isolate' // Creates a new stacking context
                        }}
                    >
                        <div className="relative z-10 h-full">
                            
                            <Section />
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
};

export default Landing;
