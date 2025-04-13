import React from 'react';

const MenuBtn = ({onClick, isOpen}) => {
    return (
        <button 
            onClick={onClick}
            type="button"
            className="relative inline-flex items-center justify-center rounded-md p-2 
                text-white border-2 border-white hover:bg-stone-900 hover:text-stone-400 
                focus:ring-2 focus:ring-stone-400 focus:outline-hidden focus:ring-inset
                transition-all duration-300 ease-in-out"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}>
            <span className="absolute -inset-0.5"></span>
            <span className="sr-only">Open main menu</span>

            <div className="relative w-6 h-6">
                {/* Hamburger icon */}
                <svg 
                    className={`absolute inset-0 transform transition-transform duration-300 ease-in-out
                        ${isOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden={isOpen}>
                    <path 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
                    />
                </svg>
                      
                {/* Close icon */}
                <svg
                    className={`absolute inset-0 transform transition-transform duration-300 ease-in-out
                        ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden={!isOpen}>
                    <path 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12" 
                    />
                </svg>
            </div>
        </button>
    );
};

export default MenuBtn;
