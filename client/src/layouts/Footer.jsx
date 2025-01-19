import React from 'react';
import { Link } from 'react-scroll';
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import MotionText from '../components/ui/MotionText';

const Footer = () => {
    return (
        <footer id='contact'
            className='w-full min-h-screen bg-tahiti-700 flex flex-col justify-center items-center'>
            <MotionText/>
            <div className="w-full grid grid-cols-12 grid-rows-6 gap-6 px-16 pt-12">
                <div className="w-full flex flex-col h-full col-span-4 col-start-1 col-end-4 row-span-6 
                    row-start-1 row-end-7 border-2 border-black rounded-lg px-6 pb-6 justify-between
                    items-center bg-red-100">
                    <div className="flex justify-center items-center bg-stone-900 w-60 h-24">
                        <a href="/" className="h-10 bg-stone-900 z-20 inline-block">
                            <img src="/img/FoodSaver_lignt.png" alt="FoodSaver Logo" />
                        </a>
                    </div>  
                    <div className='p-1 pb-6'>
                        <h4>Contacto</h4>
                        <p className='text-sm'>
                            Si tienes dudas o preguntas, escríbenos a
                            <a href='mailto:foodsaver@gmail.com' className='text-blue-600 hover:text-blue-800 ml-1'>
                                ayuda@foodsaver.com🡭
                            </a>
                        </p>
                    </div>
                </div>
                <div className="w-full flex h-full col-span-9 col-start-4 col-end-13 row-span-3 row-start-1 
                    row-end-4 border-2 border-black rounded-lg p-12 bg-yellow-100">
                    <div className="w-full flex justify-between items-center">
                        <p className='w-[60%]'>
                            ¿Quieres reducir el desperdicio de alimentos en casa? Descubre consejos prácticos
                            de cocina, almacenamiento inteligente y deliciosas recetas. ¡Suscríbete a nuestra
                            newsletter y transforma tu forma de aprovechar los alimentos!
                        </p>

                        <div className="flex flex-col gap-6">
                            <input type="text"
                                className='w-80 h-12 border-2 border-black rounded-lg'
                                placeholder='Ingresa tu correo'
                            />
                            <button className='full-btn rounded-lg py-3'>
                                Suscríbete
                            </button>
                        </div>
                        
                    </div>
                </div>
                <div className="w-full flex h-full col-span-6 col-start-4 col-end-10 row-span-3 row-start-4 
                    row-end-7 border-2 border-black rounded-lg p-12 bg-blue-100">
                    <div className="w-full flex">
                        <nav className='w-full flex justify-between font-medium'>
                            <ul className='flex flex-col gap-3'>
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
                                    <Link to="contact" className='text-black hover:text-gray-500'> 
                                        Contacto🡭
                                    </Link>
                                </li>
                            </ul>

                            <ul className='flex flex-col gap-3'>                                 
                               <li>
                                    <a href="#" className='text-black hover:text-gray-500'>
                                        Blog🡭
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
                        </nav>
                    </div>

                </div>

                <div className="flex flex-col col-span-3 col-start-10 col-end-13 row-span-3 row-start-4 row-end-7
                    gap-y-6">
                    <div className="flex gap-4">
                        <a href='http://instagram.com' target='_blank'
                            className="flex col-span-2 col-start-10 col-end-12 row-span-1 row-start-4 row-end-5
                            p-6 border-2 border-black rounded-lg bg-purple-100 hover:bg-purple-500">
                            <FaInstagram className='text-[3rem]'/>
                        </a>
                        <a href='http://youtube.com' target='_blank'
                            className="flex col-span-1 col-start-11 col-end-12 row-span-1 row-start-4 row-end-5
                            p-6 border-2 border-black rounded-lg bg-purple-100 hover:bg-purple-500">
                            <CiYoutube className='text-[3rem]' />
                        </a>
                        <a href='http://tiktok.com' target='_blank'
                            className="flex col-span-1 col-start-12 col-end-13 row-span-1 row-start-4 row-end-5
                            p-6 border-2 border-black rounded-lg bg-purple-100 hover:bg-purple-500">
                            <FaTiktok className='text-[3rem]' />
                        </a>
                    </div>
                    <div className="flex gap-6 font-medium">
                        <a href='/login' className='flex col-span-1 col-start-10 col-end-12 row-span-2 row-start-5 row-end-7
                            p-10 border-2 border-black rounded-lg bg-yellow-100 hover:bg-yellow-300'>
                            Accede
                        </a>
                        <a href='/register' className='flex col-span-1 col-start-12 col-end-13 row-span-2 row-start-5 row-end-7
                            p-10 border-2 border-black rounded-lg bg-yellow-100 hover:bg-yellow-300'>
                            Regístrate
                        </a>
                    </div>
                </div>


            </div>

            <aside className="flex w-full h-20 bg-black justify-between items-center mt-auto px-16">
                <p className='text-white'>
                    © {new Date().getFullYear()} FoodSaver
                </p>
                <p className='text-white'>
                    Diseño y desarrollo por Trish Ramos
                </p>
                <Link to='hero' className='text-white'>
                    Volver Arriba🡭
                </Link>
            </aside>
        </footer>
    )
}

export default Footer
