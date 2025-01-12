import React from 'react'

const Hero = () => {
    return (
        <section>
            <main className='w-full h-screen bg-tahiti-700 flex px-44'>
                <div className="w-full flex flex-col justify-center items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className='text-yellow-100 text-[8rem] font-extrabold mt-10 uppercase 
                            tracking-tight leading-[120px] text-center'>
                            Despídete del Desperdicio de Alimentos
                        </h1>
                    </div>
                    <p className="w-2/3 text-xl text-[#fff] text-center">
                        FoodSaver es la herramienta definitiva para gestionar el inventario de alimentos
                        de tu hogar, reducir el desperdicio y ahorrar dinero.
                    </p>

                    <div className="w-2/3 flex justify-center gap-5">
                        <a href="/register" n className='w-1/2 shadow-btn bg-blue-100 py-3 text-center block'>
                            ÚNETE y Empieza a Ahorrar
                        </a>
                        <a href="/login" className='w-1/2 shadow-btn bg-red-100 py-3 text-center block'>
                            Conoce Más AQUÍ
                        </a>
                    </div>
                </div>


            </main>
        </section>
    )
}

export default Hero
