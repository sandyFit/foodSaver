import React from 'react'
import Navbar from '../layouts/Navbar'

const Hero = () => {
    return (
        <section id='hero'>
            <Navbar className="fixed top-0 left-0 w-full z-20" />
            <main className='w-full h-screen bg-tahiti-700 flex px-16 pt-32'>
                <div className="w-full flex flex-col gap-6">
                    <div className="w-full h-full flex flex-col relative">
                        <div className="w-28 h-28 absolute top-16 left-10 rounded-full bg-blue-100 flex 
                            justify-center items-center">
                            <img src="/img/strawberry.png" alt="strawberry" className="w-24 h-24" />
                        </div>
                        <div className="w-28 h-28 absolute top-16 left-36 rounded-full bg-red-600 flex 
                            justify-center items-center">
                            <img src="/img/bananas.png" alt="bananas" className="w-24 h-24" />
                        </div>
                        <h1 className='w-full text-yellow-100 text-[8rem] font-medium mt-10
                            tracking-tight leading-[150px] text-center'>                            
                            <span className='-ml-52'>
                                Despídete <br /> del 
                            </span>
                            <span className='ml-6 pr-[28rem] text-white'>
                                desperdicio<br />
                            </span>
                            <span className='ml-[28rem]'>de &nbsp;&nbsp;&nbsp; alimentos</span>
                        </h1>
                        <div className="w-28 h-28 absolute bottom-32 right-[40rem] rounded-full bg-blue-100 flex 
                            justify-center items-center">
                            <img src="/img/watermelon.png" alt="watermelon" className="w-24 h-24" />
                        </div>
                    </div>
                    <div className="w-[28vw] flex items-end custom-border pt-12 pb-6 px-10 rounded-lg
                        bg-white absolute bottom-28 left-16">
                        <div className="absolute inset-0 w-full h-8 bg-purple-200 rounded-t-lg border-b-2 border-stone-900"></div>
                        <p className="font-[500] text-sm text-black text-justify">
                            Optimiza tus compras,
                            prolonga la vida útil de tus alimentos y contribuye al cuidado del planeta,
                            todo desde una sola aplicación.
                        </p>
                    </div>

                    <div className="w-[28vw] h-64 flex items-end custom-border pt-12 pb-6 px-10 rounded-lg
                        absolute top-48 right-16 bg-white">

                    </div>
                </div>


            </main>
        </section>
    )
}

export default Hero
