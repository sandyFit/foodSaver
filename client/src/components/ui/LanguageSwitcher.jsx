import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLanguage } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import { TfiWorld } from "react-icons/tfi";

// Language options - can be easily extended
const LANGUAGES = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    // Add more languages here in the future
    // { code: 'fr', label: 'Français' },
    // { code: 'de', label: 'Deutsch' },
];

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'es');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Debug current language
    useEffect(() => {
        console.log('Current i18n language:', i18n.language);
        console.log('Current state language:', currentLanguage);
    }, [i18n.language, currentLanguage]);

    // Update state when language changes
    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

    // Handle language change - simplified and more direct
    const changeLanguage = (lng) => {
        console.log('Changing language to:', lng);

        // Change language directly
        i18n.changeLanguage(lng);

        // Update state
        setCurrentLanguage(lng);

        // Store in localStorage
        localStorage.setItem('language', lng);

        // Close dropdown
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Find current language label
    const currentLanguageLabel = LANGUAGES.find(lang =>
        lang.code === currentLanguage)?.label || 'Language';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="flex items-center text-white">
                    {/* <IoLanguage className="mr-2" /> */}
                    <TfiWorld className="mr-1" />
                    <span className="font-[600]">{currentLanguageLabel}</span>
                </div>
                <IoIosArrowDown className={`ml-2 transition-transform text-white
                    ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {/* Dropdown menu - absolutely positioned */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-3 w-full z-50 border-2 border-white 
                    rounded-lg bg-tahiti-700 text-white">
                    <ul className="flex flex-col justify-center items-center">
                        {LANGUAGES.map((language) => (
                            <li key={language.code}>
                                <button
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:text-black
                                        ${currentLanguage === language.code ?
                                            'font-medium' : ''}`}
                                    onClick={() => changeLanguage(language.code)}
                                >
                                    {language.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher; 
