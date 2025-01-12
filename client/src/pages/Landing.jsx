import React from 'react';
import Navbar from '../layouts/Navbar';
import Hero from './Hero.jsx';
import DidYouKnow from './DidYouKnow.jsx';

const Landing = () => {
    return (
        <section >
            <Navbar />
            <Hero />
            <DidYouKnow />
        </section>
    );
   
};

export default Landing;
