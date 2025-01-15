import React from 'react';
import Navbar from '../layouts/Navbar';
import Hero from './Hero.jsx';
import DidYouKnow from './DidYouKnow.jsx';
import Features from './Features.jsx';

const Landing = () => {
    return (
        <section >
            <Navbar />
            <Hero />
            <DidYouKnow />
            <Features />
        </section>
    );
   
};

export default Landing;
