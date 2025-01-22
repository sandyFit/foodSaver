import React from 'react'
import '../assets/transitions.css'

const Features = () => {
    return (
        <div id='features'
            className='bg-blue-100 w-full min-h-screen px-24'>

           
            <section className="first">
                <div className="outer">
                    <div className="inner">
                        <div className="bg one">
                            <h2 className="section-heading">Controlar lo que tienes:</h2>
                            <p className="text-xl mt-8">
                                Gestiona fácilmente tu inventario y mantente al tanto de las fechas de caducidad.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="second">
                <div className="outer">
                    <div className="inner">
                        <div className="bg">
                            <h2 className="section-heading">Optimizar ingredientes:</h2>
                            <p className="text-xl mt-8">
                                Usa primero lo que está a punto de caducar con sugerencias
                                de recetas generadas por IA, adaptadas a tu despensa.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="third">
                <div className="outer">
                    <div className="inner">
                        <div className="bg">
                            <h2 className="section-heading">Reducir desperdicios y ahorrar dinero:</h2>
                            <p className="text-xl mt-8">
                                Deja de tirar comida y dinero; transforma los sobrantes en deliciosas comidas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Features
