import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();


    return (
        <nav className='w-full h-24 bg-tahiti-200 absolute'>
            <div className="flex justify-between items-center px-32 relative">
                <div className="flex justify-center items-center bg-stone-900 w-60 h-24">
                    <a href="/" className="h-10 bg-stone-900 z-20 inline-block">
                        <img src="/img/FoodSaver_lignt.png" alt="FoodSaver Logo" />
                    </a>
                </div>

                <div className="flex gap-10 pt-5">
                    <a href="/login" className="full-btn text-center block">
                        Login
                    </a>
                    <a href="/register" className="shadow-btn bg-yellow-100 px-12 py-3 text-center block">
                        Register
                    </a>
                </div>

            </div>

        </nav>
    )
}

export default Navbar;
