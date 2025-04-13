import React, { useState } from 'react';
import { Link } from 'react-scroll';
import Logo from '../components/ui/Logo';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import AuthModal from '../components/modals/AuthModal';
import MenuBtn from '../components/buttons/MenuBtn';
import MenuDropdown from '../components/ui/MenuDropdown';

const Navbar = () => {
    const { t } = useTranslation();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        console.log("Current state:", isMenuOpen);
        setIsMenuOpen(prevState => !prevState);
    };

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
        <nav className='w-full h-16 lg:h-24 bg-tahiti-700 absolute'>
            <div className="flex justify-between items-center px-4 lg:px-16 relative">
                <div className="flex justify-center items-center bg-stone-900 w-32 h-16 lg:w-60 lg:h-24
                    px-3">
                    <a href="/" className="h-6 lg:h-10 bg-stone-900 z-20 inline-block">
                        <img src="/img/FoodSaver_lignt.png" alt="FoodSaver Logo" />
                    </a>
                </div>

                <div className='hidden lg:flex justify-center items-center border-2 rounded-lg 
                    border-white'>
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
                    

                    <div className="hidden lg:block">
                        <button
                            className='full-btn rounded-r-lg px-4 py-2.5 ml-2'
                            onClick={openLoginModal}
                        >
                            {t('landing.navbar.accessHere')}
                        </button>
                    </div>
                </div>

                <div className="block lg:hidden">
                    <MenuBtn onClick={toggleMenu} isOpen={isMenuOpen} />
                </div>
                {isMenuOpen && (
                    <MenuDropdown/>
                )}
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
