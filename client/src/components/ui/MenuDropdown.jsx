import React from 'react';
import { Link } from 'react-scroll';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const MenuDropdown = ({ onOpenLogin }) => {
    const { t } = useTranslation();
    

    return (
        <article className="absolute top-16 left-0 w-full bg-stone-900 z-50 border-t-2 border-stone-700">
            <nav className="px-4 py-2 space-y-2">
                <Link 
                    to="stats" 
                    className="block w-full text-center rounded-md px-3 py-2 text-sm 
                        font-medium text-white hover:bg-tahiti-800 cursor-pointer"
                    smooth={true}
                    duration={500}
                >
                    {t('landing.navbar.globalImpact')}
                </Link>
                <Link 
                    to="how"
                    className="block w-full text-center rounded-md px-3 py-2 text-sm 
                        font-medium text-white hover:bg-tahiti-800 cursor-pointer"
                    smooth={true}
                    duration={500}
                >
                    {t('landing.navbar.about')}
                </Link>
                
                <Link 
                    to="contact"
                    className="block w-full text-center rounded-md px-3 py-2 text-sm 
                        font-medium text-white hover:bg-tahiti-800 cursor-pointer"
                    smooth={true}
                    duration={500}
                >
                    {t('landing.navbar.contact')}
                </Link>
                
                <button
                    onClick={onOpenLogin}
                    className="w-full rounded-md px-3 py-2 text-sm font-medium 
                        bg-stone-900 text-white hover:bg-stone-800"
                >
                    {t('landing.navbar.accessHere')}
                </button>
                
                <div className="flex justify-center py-2">
                    <LanguageSwitcher />
                </div>
            </nav>
            
        </article>
    );
};

export default MenuDropdown;
