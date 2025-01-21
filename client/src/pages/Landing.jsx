import React from 'react';
import Navbar from '../layouts/Navbar';
import Hero from './Hero.jsx';
import Stats from './Stats.jsx';
import Features from './Features.jsx';
import Footer from '../layouts/Footer.jsx';
import How from './How.jsx';


const Landing = () => {
    return (
        <section >
            <Navbar />
            <Hero />
            <Stats />
            <Features />
            <How/>
            <Footer/>
        </section>
    );
   
};

export default Landing;
