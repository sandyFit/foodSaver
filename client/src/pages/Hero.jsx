import React, {useState} from 'react'
import Navbar from '../layouts/Navbar'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';
import AuthModal from '../components/modals/AuthModal';

const Hero = () => {
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
        <section id='hero'>
            <Navbar className="fixed top-0 left-0 w-full z-20" />
            <main className='flex w-full h-screen bg-tahiti-700 px-4 sm:px-10 md:px-12 lg:px-16 pt-20 
                lg:pt-32 xl:pt-36'>
                <div className="w-full flex flex-col">
                    <div className="w-full h-full flex flex-col">
                        <div className="w-full flex items-center justify-center border-2 border-zinc-700 
                            px-10 py-6 lg:py-10 custom-shadow">
                            <h1 className='text-yellow-100 text-center'>
                                {t('landing.hero.title1')}
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
                        <div className="w-full lg:w-[28vw] flex items-center border-2 border-zinc-700 
                            p-3 xl:p-8 custom-shadow ">

                            <p className="font-[500] text-xs sm:text-sm text-white">
                                {t('landing.hero.description1')}
                            </p>
                        </div>

                        <div className="w-full lg:w-[28vw] flex items-center border-2 border-zinc-700 
                            p-3 xl:p-8 custom-shadow">

                            <p className="font-[500] text-xs sm:text-sm text-white">
                                {t('landing.hero.description2')}
                            </p>
                        </div>
                        <div className="w-full lg:w-[28vw] flex items-center border-2 border-zinc-700 
                            p-3 xl:p-8 custom-shadow">

                            <p className="font-[500] text-xs sm:text-sm text-white">
                                {t('landing.hero.description3')}
                            </p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col lg:flex-row justify-center items-center mt-4 md:mt-8 
                        lg:mt-6 xl:mt-10 space-x-6 pb-12 md:pb-8 lg:pb-10 xl:pb-20">                       
                        <button
                            className='w-full lg:w-[36%] shadow-btn bg-red-100 py-3 lg:py-2.5 mb-8 lg:mb-0'
                            onClick={openRegisterModal}
                        >
                            {t('landing.hero.button1')}
                        </button>


                        <Link to="/stats"
                            className='w-[36%] hidden lg:block shadow-btn py-2.5 bg-purple-100 text-center'
                        >
                            {t('landing.hero.button2')}
                        </Link>
                    </div>
                </div>
            </main>
            <AuthModal
                isOpen={authModalOpen}
                onClose={closeAuthModal}
                initialMode={authModalMode}
            />
        </section>
    )
}

export default Hero
