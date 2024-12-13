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
                        Dile Adiós al Desperdicio de Comida En Casa
                    </h1>
                    <p className="w-[60%] text-2xl text-center">
                        FoodSaver es la herramienta definitiva para gestionar el inventario de alimentos
                        de tu hogar, reducir el desperdicio y ahorrar dinero.
                    </p>
                </div>
                <div className="flex px-32 gap-8 mt-12">
                    <HeroCard
                        imgSrc={'./img/monitoring.jpg'}
                        title={'Seguimiento a lo que tienes'}
                        description={'Administra tus alimentos y manténte al tanto de las fechas de vencimiento.'}
                        bgColor="bg-emerald-100"
                    />
                    <HeroCard
                        imgSrc={'./img/organize.jpg'}
                        title={'Optimiza Ingredientes'}
                        description={"Utiliza primero lo que esté a punto de caducar con sugerencias de recetas adaptadas a tu despensa."}
                        bgColor="bg-yellow-100"
                    />
                    <HeroCard
                        imgSrc={'./img/recipes.jpg'}
                        title={'Ahorra Dinero'}
                        description={'Deja de tirar comida y dinero: convierte las sobras en comidas deliciosas.'}
                        bgColor="bg-orange-100"
                    />
                </div>
            </main>
        </section>
    )
}

export default Landing;
