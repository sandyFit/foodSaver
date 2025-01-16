import React from 'react';
import Navbar from '../layouts/Navbar';
import Hero from './Hero.jsx';
import Stats from './Stats.jsx';
import Features from './Features.jsx';

const Landing = () => {
    return (
        <section >
            <Navbar />
            <Hero />
            <Stats />
            <Features />
        </section>
    );
   
};

export default Landing;
