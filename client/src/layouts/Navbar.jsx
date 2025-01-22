import React from 'react';
import { Link } from 'react-scroll';
import Logo from '../components/ui/Logo';

const Navbar = () => {

    return (
        <nav className='w-full h-24 bg-tahiti-700 absolute'>
            <div className="flex justify-between items-center px-16 relative">
                <Logo/>         

                <div className='flex justify-center items-center border-2 rounded-lg border-white'>
                    <ul className='flex gap-6 px-8 text-sm'>
                        <li>
                            <Link to="stats" className='text-white hover:text-black'>
                                Impacto Global
                            </Link>
                        </li>
                        <li>
                            <Link to="features" className='text-white hover:text-black'>
                                Funcionalidades
                            </Link>
                        </li>
                        <li>
                            <Link to="how" className='text-white hover:text-black'>
                                Por qué FoodSaver
                            </Link>
                        </li>
                        <li>
                            <Link to="contact" className='text-white hover:text-black'> 
                                Contacto
                            </Link>
                        </li>
                    </ul>
                    <button className='full-btn py-2.5 rounded-r-lg'>
                        <a href="/login">
                            Accede Aquí
                        </a>
                    </button>
                    
                </div>
            </div>

        </nav>
    )
}

export default Navbar;
