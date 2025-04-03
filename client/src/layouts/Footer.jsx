import React, {useState} from 'react';
import { Link } from 'react-scroll';
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import MotionText from '../components/ui/MotionText';
import Logo from '../components/ui/Logo';
import { useTranslation } from 'react-i18next';

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
            <div className="w-full grid grid-cols-12 grid-rows-6 gap-6 px-16 pt-[4rem]">
                <section className="w-full flex flex-col h-full col-span-4 col-start-1 col-end-4 row-span-6 
                    row-start-1 row-end-7 border-2 border-black custom-shadow px-6 pb-6 justify-between
                    items-center text-white">
                    <Logo/> 
                    <div className='p-1 pb-6'>
                        <h4>
                            {t('landing.footer.contactTitle')}
                        </h4>
                        <p className='text-sm'>
                            {t('landing.footer.contactMessage')} <br/>
                            <a href='mailto:foodsaver@gmail.com'
                                className='text-yellow-100 hover:text-yellow-200'>
                                help@foodsaver.com🡭
                            </a>
                        </p>
                    </div>
                </section>

                <div className="flex flex-col border-2 border-black custom-shadow col-span-9 col-start-4 col-end-13 row-span-3 
                    row-start-1 row-end-7">
                    <section className="w-full flex col-span-9 col-start-4 col-end-13 row-span-3 
                        row-start-1 row-end-4 p-12 text-white">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex flex-col">
                                <h4>
                                    {t('landing.footer.subscribe')}
                                </h4>
                                <p className='w-[90%]'>
                                    {t('landing.footer.subcribeDescription')}
                                </p>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <input type="text"
                                    className='w-80 h-12 border-2 border-black rounded-lg'
                                    placeholder={t('landing.footer.inputPlaceholder')}

                                />
                                <button className='full-btn rounded-lg py-3 border-2 border-black'>
                                    {t('landing.footer.SubscribeBtn')}
                                </button>
                                <p className='text-sm text-center'>
                                    {t('landing.footer.unsubscribeText')}
                                </p>
                            </div>
                            
                        </div>
                    </section>

                <hr className='border-t-2 border-black'/>
                    <div className="flex col-span-6 col-start-4 col-end-13 row-span-3 row-start-4 row-end-7 ">
                        <section className="w-full flex py-10 pl-10 ">
                            <div className="w-[90%] flex ">
                                <nav className='w-full flex justify-between text-sm'>
                                    <div className="flex flex-col text-white">
                                        <h4>
                                            {t('landing.footer.product')}
                                        </h4>
                                        <ul className='flex flex-col gap-2 mt-2'>
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
                                        <h4>
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

                                    <div className="flex flex-col text-white">
                                        <h4>                    
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

                        <section className="flex flex-col col-span-3 col-start-10 col-end-13 row-span-3 
                            row-start-4 row-end-7 place-content-between pr-12 pt-8">
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
                                className='border-2 border-white hover:border-black rounded-lg w-full px-4 py-2.5 mb-8 
                                    text-white hover:text-black font-medium'
                                onClick={openLoginModal}
                                onClose={closeAuthModal}
                            >
                                {t('landing.navbar.accessHere')}
                            </button>
                        </section>
                    </div>
                </div>
            </div>

            <aside className="flex w-full h-16 bg-black justify-between items-center mt-auto px-16">
                <p className='text-white'>
                    © {new Date().getFullYear()} FoodSaver
                </p>
                <p className='text-white'>
                    {t('landing.footer.credits')}
                    <a href="https://www.trishramos.com"
                        className='ml-2 underline underline-offset-4 hover:text-gray-300'
                    >
                        Trish Ramos
                    </a>
                </p>
                <Link to='hero' className='text-white underline underline-offset-4 hover:text-gray-300'>
                    {t('landing.footer.backToTop')}🡭
                </Link>
            </aside>
        </footer>
    )
}

export default Footer
