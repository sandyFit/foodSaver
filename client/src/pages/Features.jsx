import React from 'react'

const Features = () => {
    return (
        <section id='features'
            className='bg-blue-100 w-full min-h-screen px-24'>

            <div className="w-full grid grid-cols-2 gap-2 h-full">    

                
                <div className=" w-[68%] h-full flex flex-col">
                    <h1 className='pt-12 uppercase text-6xl font-extrabold'>
                        FoodSaver <br/> te ayuda a:
                    </h1>
                    <div className="flex flex-col justify-center mt-80">
                        <h2 className="text-3xl font-semibold">Controlar lo que tienes:</h2>
                        <p className="text-xl mt-8">
                            Gestiona fácilmente tu inventario y mantente al tanto de las fechas de caducidad.
                        </p>
                    </div>
                </div>
                <div className="flex">

                </div>
            </div>
        </section>
    )
}

export default Features
