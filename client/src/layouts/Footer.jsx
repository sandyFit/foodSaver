import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import MotionText from '../components/ui/MotionText';
import Logo from '../components/ui/Logo';
import { useTranslation } from 'react-i18next';
import AuthModal from '../components/modals/AuthModal';

const Footer = () => {

    const { t } = useTranslation();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');
    
        const openLoginModal = () => {
            setAuthModalMode('login');
            setAuthModalOpen(true);
        };
    
        const closeAuthModal = () => {
            setAuthModalOpen(false);
        };

    return (
        <footer id='contact'
            className='w-full min-h-screen bg-tahiti-700 flex flex-col justify-center items-center'>
            <MotionText/>
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-6 px-4 sm:px-10
                md:px-12 lg:px-16 place-content-center pt-6 lg:pt-10 xl:pt-12 2xl:pt-16">
                <section className="w-full flex flex-col h-full lg:col-span-4 lg:col-start-1 lg:col-end-4 
                    lg:row-span-6 row-start-1 row-end-7 border-2 border-black custom-shadow px-6 pb-6 
                    justify-between items-center text-white">
                    <Logo/> 
                    <div className='p-1 lg:pb-6'>
                        <h4>
                            {t('landing.footer.contactTitle')}
                        </h4>
                        <p className='text-xs xl:text-sm'>
                            {t('landing.footer.contactMessage')} <br/>
                            <a href='mailto:foodsaver@gmail.com'
                                className='text-yellow-100 hover:text-yellow-200'>
                                help@foodsaver.com🡭
                            </a>
                        </p>
                    </div>
                </section>

                <div className="flex flex-col border-2 border-black custom-shadow lg:col-span-9 
                    lg:col-start-4 lg:col-end-13 lg:row-span-3 lg:row-start-1 lg:row-end-7">
                    <section className="w-full flex lg:col-span-9 lg:col-start-4 lg:col-end-13 lg:row-span-3 
                        lg:row-start-1 lg:row-end-4 justify-between items-center p-3 md:p-10 lg:p-6 xl:py-12 lg:px-2 text-white">
                        <div className="w-full flex flex-col lg:flex-row justify-between items-center px-3 
                            sm:px-6 md:px-8">
                            <div className="flex flex-col gap-2 lg:gap-0">
                                <h4>
                                    {t('landing.footer.subscribe')}
                                </h4>
                                <p className='text-xs xl:text-base lg:w-[90%] pb-4 lg:pb-0'>
                                    {t('landing.footer.subcribeDescription')}
                                </p>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <input type="text"
                                    className='w-full lg:w-64 xl:w-80 h-10 lg:h-12 border-2 border-black 
                                        rounded-lg'
                                    placeholder={t('landing.footer.inputPlaceholder')}

                                />
                                <button className='full-btn rounded-lg py-2 lg:py-3 border-2 border-black'>
                                    {t('landing.footer.SubscribeBtn')}
                                </button>
                                <p className='text-xs xl:text-sm text-center'>
                                    {t('landing.footer.unsubscribeText')}
                                </p>
                            </div>
                            
                        </div>
                    </section>

                <hr className='border-t-2 border-black'/>
                    <div className="flex flex-col lg:flex-row lg:col-span-6 lg:col-start-4 lg:col-end-13  
                        lg:row-span-3 lg:row-start-4 lg:row-end-7 ">
                        <section className="w-full flex flex-col lg:flex-row py-4 lg:py-10 lg:pl-10 ">
                            <div className="w-full lg:w-[90%] flex ">
                                <nav className='w-full flex justify-between text-xs xl:text-sm px-4 sm:px-6 md:px-8
                                    lg:px-0'>
                                    <div className="flex flex-col text-white">
                                        <h4 className='text-sm xl:text-base'>
                                            {t('landing.footer.product')}
                                        </h4>
                                        <ul className='flex flex-col gap-2 mt-2 '>
                                            <li>
                                                <Link to="stats" className='text-white hover:text-gray-300'>
                                                    {t('landing.navbar.globalImpact')}🡭
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="about" className='text-white hover:text-gray-300'>
                                                    {t('landing.navbar.about')}🡭
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="features" className='text-white hover:text-gray-300'>
                                                    {t('landing.navbar.features')}🡭
                                                </Link>
                                            </li>
                                            <li>
                                                <a href="#" className='text-white hover:text-gray-300'>
                                                    Blog🡭
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex flex-col text-white">
                                        <h4 className='text-sm xl:text-base'>
                                            {t('landing.footer.more')}
                                        </h4>
                                        <ul className='flex flex-col gap-2 mt-2'>                                                                     
                                            <li>
                                                <a href="#" className='text-white hover:text-gray-300'>
                                                    {t('landing.footer.roadmap')}🡭
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className='text-white hover:text-gray-300'>
                                                    {t('landing.footer.terms')}🡭
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className='text-white hover:text-gray-300'>
                                                    {t('landing.footer.privacy')}🡭
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className='text-white hover:text-gray-300'>
                                                    {t('landing.footer.details')}🡭
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex flex-col text-white ">
                                        <h4 className='text-sm xl:text-base'>                    
                                            <a target="_blank" href="https://icons8.com"
                                                className='text-white hover:text-gray-300 '>
                                                {t('landing.footer.iconsCredits')}🡭
                                            </a>
                                        </h4>
                                        <ul className='flex flex-col gap-2 mt-2'>                                                                     
                                            <li>
                                                <a a target="_blank" href="https://icons8.com/icon/zYsNNDB6wPLn/control-panel"
                                                    className='text-white hover:text-gray-300'>
                                                    {t('landing.footer.iconsDashboard')}🡭
                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="https://icons8.com/icon/eKMVFfo5995u/tear-off-calendar"
                                                    className='text-white hover:text-gray-300'>
                                                    {t('landing.footer.iconsCalendar')}🡭
                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="https://icons8.com/icon/GoWNy1UtqIH5/stirr"
                                                    className='text-white hover:text-gray-300'>
                                                    {t('landing.footer.iconsStir')}🡭
                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="https://icons8.com/icon/nZR92qjTp6O0/restaurant-menu"
                                                    className='text-white hover:text-gray-300'>
                                                    {t('landing.footer.iconsMenu')}🡭
                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="https://icons8.com/icon/6MKd3X4iBhzi/combo-chart"
                                                    className='text-white hover:text-gray-300'>
                                                    {t('landing.footer.iconsChart')}🡭
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>

                        </section>

                        <section className="flex flex-col lg:col-span-3 lg:col-start-10 lg:col-end-13 
                            lg:row-span-3 lg:row-start-4 :lgrow-end-7 lg:place-content-between
                            place-items-center px-4 lg:px-0 lg:pr-12 lg:pt-8 gap-4 lg:gap-0">
                            <div className="flex gap-4 text-white">
                                <a href='http://instagram.com' target='_blank'
                                    className="flex col-span-2 col-start-10 col-end-12 row-span-1 row-start-4 
                                    row-end-5 p-3 border-2 border-white hover:border-black rounded-full 
                                    hover:text-black">
                                    <FaInstagram className='text-[2rem]'/>
                                </a>
                                <a href='http://youtube.com' target='_blank'
                                    className="flex col-span-1 col-start-11 col-end-12 row-span-1 row-start-4 
                                    row-end-5 p-3 border-2 border-white hover:border-black rounded-full 
                                    hover:text-black">
                                    <CiYoutube className='text-[2rem]' />
                                </a>
                                <a href='http://tiktok.com' target='_blank'
                                    className="flex col-span-1 col-start-12 col-end-13 row-span-1 row-start-4 
                                    row-end-5 p-3 px-4 border-2 border-white hover:border-black rounded-full 
                                    hover:text-black">
                                    <FaTiktok className='text-[1.6rem]' />
                                </a>
                            </div>
                            <button
                                className='border-2 border-white hover:border-black rounded-lg w-[80%] sm:w-[50%] 
                                    lg:w-full py-2.5 mb-8 
                                    text-white hover:text-black font-medium'
                                onClick={openLoginModal}
                                onClose={closeAuthModal}
                            >
                                {t('landing.navbar.accessHere')}
                            </button>
                        </section>
                        <AuthModal
                            isOpen={authModalOpen}
                            onClose={closeAuthModal}
                            initialMode={authModalMode}
                        />
                    </div>
                </div>
            </div>

            <aside className="flex flex-col lg:flex-row w-full lg-28 lg:h-16 bg-black justify-between 
                items-center mt-auto px-4 lg:px-16 py-2 lg:py-0">
                <p className='text-xs lg:text-sm xl:text-base text-white'>
                    © {new Date().getFullYear()} FoodSaver
                </p>
                <p className='text-xs lg:text-sm xl:text-base text-white'>
                    {t('landing.footer.credits')}
                    <a href="https://www.trishramos.com"
                        className='ml-2 underline underline-offset-4 hover:text-gray-300'
                    >
                        Trish Ramos
                    </a>
                </p>
                <Link to='hero' className='text-xs lg:text-sm xl:text-base text-white underline underline-offset-4 hover:text-gray-300'>
                    {t('landing.footer.backToTop')}🡭
                </Link>
            </aside>
        </footer>
    )
}

export default Footer
