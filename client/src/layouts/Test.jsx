import React from 'react';
import { Link } from 'react-scroll';
import Logo from '../components/ui/Logo';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';

const Navbar = () => {
    const { t } = useTranslation();

    return (
        <nav className='w-full h-24 bg-tahiti-700 absolute'>
            <div className="flex justify-between items-center px-16 relative">
                <Logo />

                <div className='flex justify-center items-center gap-6'>
                    {/* Language switcher in navbar */}
                    <div className="">
                        <LanguageSwitcher />
                    </div>
                    {/* <button className='full-btn py-2.5 border-2 rounded-lg border-white'>
                        <a href="/register">
                            {t('landing.navbar.registerAccount')}
                        </a>
                    </button> */}
                    <button className='shadow-btn px-6 bg-blue-200 py-2.5 border-2 rounded-lg border-white'>
                        <a href="/login">
                            {t('landing.navbar.accessHere')}
                        </a>
                    </button>

                </div>
            </div>

        </nav>
    )
}

export default Navbar;
