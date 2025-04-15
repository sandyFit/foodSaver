import React, { useEffect, useRef } from 'react';
import Hero from './Hero.jsx';
import Stats from './Stats.jsx';
import Footer from '../layouts/Footer.jsx';
import How from './How.jsx';

const Landing = () => {

    return (
        <main className="relative">
            <div className="overflow-hidden">
                <Hero />
                {[Stats, How, Footer].map((Section, index) => (
                    <section
                        key={index}
                        className="min-h-screen relative border-b-4 border-zinc-700"
                        
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
