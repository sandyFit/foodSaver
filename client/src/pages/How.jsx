import React, { useState } from 'react';

const How = () => {

    const [isActive, setIsActive] = useState(false);

    
    return (
        <section id='how' className='w-full min-h-screen bg-purple-100'>
            <div className="w-full h-full grid grid-cols-2 px-16">
                <div className="col-span-1 col-start-1 col-end-2 flex items-center justify-center 
                    border-r-4 border-gray-400">
                    {/* Add any additional content or images here */}
                </div>
                <div className="w-full h-full flex flex-col justify-between col-span-1 col-start-2 
                    col-end-3 pl-12 p-8 min-h-screen relative">
                    <div className="w-full">
                        <h2 className='pt-12 uppercase text-6xl font-extrabold'>
                            Cómo Funciona FoodSaver
                        </h2>
                    </div>
                    <div className="w-full flex flex-col gap-8 mb-16">
                        <div className={`flex flex-col gap-2 ${isActive ?  'bg-tahiti-700 p-4 ' : '' }`}>
                            <h3 className="text-2xl font-semibold">1. Registra tus ingredientes</h3>
                            <p className='w-full'>
                                Agrega productos a tu inventario rápidamente con nuestro sistema fácil de usar.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-semibold">2. Evita el desperdicio</h3>
                            <p className='w-full'>
                                Mantente al tanto de las fechas de caducidad con alertas oportunas.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-semibold">3. Inspírate en la cocina</h3>
                            <p className='w-full'>
                                Transforma tus ingredientes en deliciosas recetas antes de que sea tarde.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-semibold">4. Personaliza tu experiencia</h3>
                            <p className='w-full'>
                                Crea menús adaptados a tus gustos y aprovecha al máximo tu despensa.
                            </p>
                        </div>
                    </div>

                </div>
                
            </div>
        </section>
    );
};

export default How;
