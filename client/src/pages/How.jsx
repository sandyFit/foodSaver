import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthModal from '../components/modals/AuthModal';
import { Link } from 'react-scroll';

const How = () => {

    const [isActive, setIsActive] = useState(false);
    const { t } = useTranslation();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('register');

    const openRegisterModal = () => {
        setAuthModalMode('register');
        setAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setAuthModalOpen(false);
    };


    return (
        <section id='how' className='w-full min-h-screen bg-purple-100'>
            <div className="w-full h-full grid grid-cols-2 px-16 relative pb-12"> {/* Add relative and pb-12 */}
                <div className="col-span-1 col-start-1 col-end-2 flex flex-col justify-center gap-6">
                    <h2 className='w-[60%] uppercase text-6xl font-extrabold'>
                        {t('landing.how.heading')}
                    </h2>
                    <p className='w-full pr-12'>
                        {t('landing.how.description')}
                    </p>
                    <button
                        className='w-1/2 shadow-btn bg-tahiti-200 px-8 py-2.5 z-20'
                        onClick={openRegisterModal}
                    >
                        {t('landing.hero.button1')}
                    </button>
                </div>
                <div className="w-full h-full flex flex-col justify-center items-center col-span-1 col-start-2 
                    col-end-3 pl-12 pt-16 min-h-screen relative">

                    <div className="w-full flex flex-col gap-8 mb-16">
                        <div className={`flex flex-col gap-2 ${isActive ? 'bg-tahiti-700 p-4 ' : ''}`}>
                            <div className="flex gap-4">
                                <figure className='border-2 border-black rounded-md w-16 h-16 flex items-center justify-center flex-shrink-0'>
                                    <img
                                        src="/icons/dash.png"
                                        alt="dashboard icon"
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                </figure>

                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-semibold">
                                        1. {t('landing.how.step1')}
                                    </h3>
                                    <p className='w-full'>
                                        {t('landing.how.step1Desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-col gap-2 ${isActive ? 'bg-tahiti-700 p-4 ' : ''}`}>
                            <div className="flex gap-4">
                                <figure className='border-2 border-black rounded-md w-16 h-16 flex items-center justify-center flex-shrink-0'>
                                    <img
                                        src="/icons/cal.png"
                                        alt="calendar icon"
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                </figure>

                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-semibold">
                                        2. {t('landing.how.step2')}
                                    </h3>
                                    <p className='w-full'>
                                        {t('landing.how.step2Desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-col gap-2 ${isActive ? 'bg-tahiti-700 p-4 ' : ''}`}>
                            <div className="flex gap-4">
                                <figure className='border-2 border-black rounded-md w-16 h-16 flex items-center justify-center flex-shrink-0'>
                                    <img
                                        src="/icons/stir.png"
                                        alt="stir icon"
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                </figure>

                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-semibold">
                                        3. {t('landing.how.step3')}
                                    </h3>
                                    <p className='w-full'>
                                        {t('landing.how.step3Desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-col gap-2 ${isActive ? 'bg-tahiti-700 p-4 ' : ''}`}>
                            <div className="flex gap-4">
                                <figure className='border-2 border-black rounded-md w-16 h-16 flex items-center justify-center flex-shrink-0'>
                                    <img
                                        src="/icons/menu.png"
                                        alt="menu icon"
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                </figure>

                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-semibold">
                                        4. {t('landing.how.step4')}
                                    </h3>
                                    <p className='w-full'>
                                        {t('landing.how.step4Desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-col gap-2 ${isActive ? 'bg-tahiti-700 p-4 ' : ''}`}>
                            <div className="flex gap-4">
                                <figure className='border-2 border-black rounded-md w-16 h-16 flex items-center justify-center flex-shrink-0'>
                                    <img
                                        src="/icons/chart.png"
                                        alt="chart icon"
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                </figure>

                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-semibold">
                                        4. {t('landing.how.step5')}
                                    </h3>
                                    <p className='w-full'>
                                        {t('landing.how.step5Desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className='text-[.8rem] hover:text-gray-700 absolute bottom-8 
                            -right-12 p-4'>
                            <a target="_blank" href="https://icons8.com">
                                {t('landing.how.iconsCredits')} 🡭
                            </a>
                        </p>
                    </div>
                    
                </div>
                
            </div>
            <AuthModal
                isOpen={authModalOpen}
                onClose={closeAuthModal}
                initialMode={authModalMode}
            />
            

        </section>
    );
};

export default How;
