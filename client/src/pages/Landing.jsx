import React from 'react';
import Navbar from '../layouts/Navbar';
import HeroCard from '../components/HeroCard';


const Landing = () => {



    return (
        <section>
            <Navbar />
            <main className='w-full h-screen bg-tahiti-200 flex flex-col'>
                <div className="flex flex-col justify-center items-center gap-8">
                    <h1 className='text-tahiti-700 mt-40'>
                        Say Goodbye to Food Waste at Home
                    </h1>
                    <p className="w-[60%] text-2xl">
                        FoodSaver is your ultimate tool for managing your household food inventory,
                        making smarter meal choices, and reducing waste. Our platform helps you:
                    </p>
                </div>
                <div className="flex px-32 gap-8 mt-12">
                    <HeroCard
                        imgSrc={'./img/monitoring.jpg'}
                        title={'Track What You Have'}
                        description={'Easily manage your food inventory and stay on top of expiration dates.'}
                        bgColor="bg-emerald-100"
                    />
                    <HeroCard
                        imgSrc={'./img/organize.jpg'}
                        title={'Optimize Ingredients'}
                        description={"Use what's about to expire first with AI-generated recipe suggestions tailored to your pantry."}
                        bgColor="bg-yellow-100"
                    />
                    <HeroCard
                        imgSrc={'./img/recipes.jpg'}
                        title={'Reduce Waste, Save Money'}
                        description={'Stop throwing food and money away—turn leftovers into delicious meals.'}
                        bgColor="bg-orange-100"
                    />
                </div>
            </main>
        </section>
    )
}

export default Landing;
