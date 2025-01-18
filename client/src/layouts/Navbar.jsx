import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {

    return (
        <nav className='w-full h-24 bg-tahiti-700 absolute'>
            <div className="flex justify-between items-center px-28 relative">
                <div className="flex justify-center items-center bg-stone-900 w-60 h-24">
                    <a href="/" className="h-10 bg-stone-900 z-20 inline-block">
                        <img src="/img/FoodSaver_lignt.png" alt="FoodSaver Logo" />
                    </a>
                </div>           

                <div className='flex justify-center items-center gap-6 border-2 rounded-lg border-white'>
                    <ul className='flex gap-6'>
                        <li>
                            <Link to="/about" className='text-white'>
                                Acerca de
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className='text-white'>
                                Contacto
                            </Link>
                        </li>
                    </ul>
                    <button className='full-btn'>
                        <a href="/login">
                            Accede Aquí
                        </a>
                    </button>
                    {/* <button className='full-btn px-6 py-2.5'>
                        <a href="/register" >
                            Regístrate
                        </a>
                    </button> */}
                </div>
            </div>

        </nav>
    )
}

export default Navbar;
