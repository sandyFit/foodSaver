import React from 'react';
import Navbar from '../layouts/Navbar';
import HeroCard from '../components/cards/HeroCard';


const Landing = () => {



    return (
        <section>
            <Navbar />
            <main className='w-full h-screen bg-tahiti-700 flex px-44'>
                <div className="w-full flex flex-col justify-center items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className='text-pink-200 text-[8rem] font-extrabold mt-10 uppercase 
                            tracking-tight leading-[120px] text-center'>
                            Dile Adiós al Desperdicio de Comida En Casa
                        </h1>
                    </div>
                    <p className="w-2/3 text-xl text-[#fff] text-center">
                        FoodSaver es la herramienta definitiva para gestionar el inventario de alimentos
                        de tu hogar, reducir el desperdicio y ahorrar dinero.
                    </p>

                    <div className="w-full flex justify-center gap-5">
                        <a href="/register" n className='shadow-btn bg-blue-100 px-16 py-3 text-center block'>
                            ÚNETE y Empieza a Ahorrar
                        </a>
                        <a href="/login" className='shadow-btn bg-yellow-100 px-32 py-3 text-center block'>
                            Accede AQUÍ
                        </a>
                    </div>
                </div>
               
                
            </main>
        </section>
    )
}

export default Landing;
