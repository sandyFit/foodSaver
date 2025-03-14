import React, { useState } from 'react';
import { Link } from 'react-scroll';
import Logo from '../components/ui/Logo';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import AuthModal from '../components/modals/AuthModal';

const Navbar = () => {
    const { t } = useTranslation();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');

    const openLoginModal = () => {
        setAuthModalMode('login');
        setAuthModalOpen(true);
    };

    const openRegisterModal = () => {
        setAuthModalMode('register');
        setAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setAuthModalOpen(false);
    };

    return (
        <nav className='w-full h-24 bg-tahiti-700 absolute'>
            <div className="flex justify-between items-center px-16 relative">
                <div className="flex justify-center items-center bg-stone-900 w-60 h-24">
                    <a href="/" className="h-10 bg-stone-900 z-20 inline-block">
                        <img src="/img/FoodSaver_lignt.png" alt="FoodSaver Logo" />
                    </a>
                </div>

                <div className='flex justify-center items-center border-2 rounded-lg border-white'>
                    <ul className='flex gap-6 px-8 text-sm'>
                        <li>
                            <Link to="stats" className='text-white hover:text-black'>
                                {t('landing.navbar.globalImpact')}
                            </Link>
                        </li>
                        <li>
                            <Link to="about" className='text-white hover:text-black'>
                                {t('landing.navbar.about')}
                            </Link>
                        </li>
                        <li>
                            <Link to="features" className='text-white hover:text-black'>
                                {t('landing.navbar.features')}
                            </Link>
                        </li>
                        <li>
                            <Link to="contact" className='text-white hover:text-black'>
                                {t('landing.navbar.contact')}
                            </Link>
                        </li>
                    </ul>
                    <LanguageSwitcher />

                    <div className="flex">
                        <button
                            className='full-btn rounded-r-lg px-4 py-2.5 ml-2'
                            onClick={openLoginModal}
                        >
                            {t('landing.navbar.accessHere')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={closeAuthModal}
                initialMode={authModalMode}
            />
        </nav>
    )
}

export default Navbar;
