import React from 'react';
import { Link } from 'react-scroll';
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import MotionText from '../components/ui/MotionText';
import Logo from '../components/ui/Logo';

const Footer = () => {
    return (
        <footer id='contact'
            className='w-full min-h-screen bg-tahiti-700 flex flex-col justify-center items-center'>
            <MotionText/>
            <div className="w-full grid grid-cols-12 grid-rows-6 gap-6 px-16 pt-[3.6rem]">
                <section className="w-full flex flex-col h-full col-span-4 col-start-1 col-end-4 row-span-6 
                    row-start-1 row-end-7 border-2 border-black rounded-lg px-6 pb-6 justify-between
                    items-center bg-red-100">
                    <Logo/> 
                    <div className='p-1 pb-6'>
                        <h4>Contacto</h4>
                        <p className='text-sm'>
                            Si tienes dudas o preguntas, escríbenos a
                            <a href='mailto:foodsaver@gmail.com' className='text-blue-600 hover:text-blue-800 ml-1'>
                                ayuda@foodsaver.com🡭
                            </a>
                        </p>
                    </div>
                </section>

                <section className="w-full flex h-full col-span-9 col-start-4 col-end-13 row-span-3 row-start-1 
                    row-end-4 border-2 border-black rounded-lg p-12 bg-yellow-100">
                    <div className="w-full flex justify-between items-center">
                        <div className="flex flex-col">
                            <h4>Suscríbete a la Newsletter</h4>
                            <p className='w-[90%]'>
                                ¿Quieres reducir el desperdicio de alimentos en casa? Descubre consejos prácticos
                                de cocina, almacenamiento inteligente y deliciosas recetas. ¡Suscríbete a nuestra
                                newsletter y transforma tu forma de aprovechar los alimentos!
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <input type="text"
                                className='w-80 h-12 border-2 border-black rounded-lg'
                                placeholder='Ingresa tu correo'
                            />
                            <button className='full-btn rounded-lg py-3 border-2 border-black'>
                                Suscríbete
                            </button>
                            <p className='text-sm'>
                                Cancela cuando quieras, ¡sin dramas! ✌️
                            </p>
                        </div>
                        
                    </div>
                </section>

                <section className="w-full flex h-full col-span-6 col-start-4 col-end-10 row-span-3 row-start-4 
                    row-end-7 border-2 border-black rounded-lg py-10 px-12 bg-blue-100">
                    <div className="w-full flex">
                        <nav className='w-full flex justify-between text-sm'>
                            <div className="flex flex-col">
                                <h4>Producto</h4>
                                <ul className='flex flex-col gap-2 mt-2'>
                                    <li>
                                        <Link to="stats" className='text-black hover:text-gray-500'>
                                            Impacto Global🡭
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="features" className='text-black hover:text-gray-500'>
                                            Funcionalidades🡭
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="why" className='text-black hover:text-gray-500'>
                                            Por qué FoodSaver🡭
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#" className='text-black hover:text-gray-500'>
                                            Blog🡭
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col">
                                <h4>Más</h4>
                                <ul className='flex flex-col gap-2 mt-2'>                                                                     
                                    <li>
                                        <a href="#" className='text-black hover:text-gray-500'>
                                            Nuestra Hoja de Ruta🡭
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className='text-black hover:text-gray-500'>
                                            Terminos & Condiciones🡭
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className='text-black hover:text-gray-500'>
                                            Política de Tratamiento de Datos🡭
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>

                </section>

                <section className="flex flex-col col-span-3 col-start-10 col-end-13 row-span-3 row-start-4 row-end-7
                    gap-y-6">
                    <div className="flex gap-4">
                        <a href='http://instagram.com' target='_blank'
                            className="flex col-span-2 col-start-10 col-end-12 row-span-1 row-start-4 row-end-5
                            p-6 border-2 border-black rounded-lg bg-purple-200 hover:bg-purple-500">
                            <FaInstagram className='text-[3rem]'/>
                        </a>
                        <a href='http://youtube.com' target='_blank'
                            className="flex col-span-1 col-start-11 col-end-12 row-span-1 row-start-4 row-end-5
                            p-6 border-2 border-black rounded-lg bg-purple-200 hover:bg-purple-500">
                            <CiYoutube className='text-[3rem]' />
                        </a>
                        <a href='http://tiktok.com' target='_blank'
                            className="flex col-span-1 col-start-12 col-end-13 row-span-1 row-start-4 row-end-5
                            p-6 border-2 border-black rounded-lg bg-purple-200 hover:bg-purple-500">
                            <FaTiktok className='text-[2.6rem]' />
                        </a>
                    </div>
                    <div className="flex gap-6 font-medium">
                        <a href='/login' className='flex col-span-1 col-start-10 col-end-12 row-span-2 row-start-5 row-end-7
                            p-10 border-2 border-black rounded-lg bg-yellow-100 hover:bg-yellow-200'>
                            Accede
                        </a>
                        <a href='/register' className='flex col-span-1 col-start-12 col-end-13 row-span-2 row-start-5 row-end-7
                            p-10 border-2 border-black rounded-lg bg-yellow-100 hover:bg-yellow-200'>
                            Regístrate
                        </a>
                    </div>
                </section>


            </div>

            <aside className="flex w-full h-16 bg-black justify-between items-center mt-auto px-16">
                <p className='text-white'>
                    © {new Date().getFullYear()} FoodSaver
                </p>
                <p className='text-white'>
                    Diseño y desarrollo por
                    <a href="https://www.trishramos.com"
                        className='ml-2 underline underline-offset-4 hover:text-gray-500'
                    >
                        Trish Ramos
                    </a>
                </p>
                <Link to='hero' className='text-white underline underline-offset-4 hover:text-gray-500'>
                    Volver Arriba🡭
                </Link>
            </aside>
        </footer>
    )
}

export default Footer
