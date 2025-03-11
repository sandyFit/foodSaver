import React from 'react'
import Navbar from '../layouts/Navbar'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <section id='hero'>
            <Navbar className="fixed top-0 left-0 w-full z-20" />
            <main className='flex w-full h-screen bg-tahiti-700 px-16 pt-36'>
                <div className="w-full flex flex-col">
                    <div className="w-full h-full flex flex-col">
                        <div className="w-full flex items-center justify-center border-2 border-zinc-700 
                            px-10 py-10 custom-shadow">
                            <h1 className='text-yellow-100 text-center'>
                                {t('landing.hero.title1')}
                            </h1>
                        </div>
                    </div>
                    <div className="flex justify-between mt-[-16rem]">
                        <div className="w-[28vw] flex items-end border-2 border-zinc-700 p-8
                            custom-shadow ">

                            <p className="font-[500] text-sm text-white">
                                {t('landing.hero.description1')}
                            </p>
                        </div>

                        <div className="w-[28vw] flex items-end border-2 border-zinc-700 p-8
                            custom-shadow">

                            <p className="font-[500] text-sm text-white">
                                {t('landing.hero.description2')}
                            </p>
                        </div>
                        <div className="w-[28vw] flex items-end border-2 border-zinc-700 p-8
                            custom-shadow">

                            <p className="font-[500] text-sm text-white">
                                {t('landing.hero.description3')}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center w-full mt-12 space-x-6">                       
                        <a href="/register"
                            className='shadow-btn px-6 py-2.5 bg-red-100'
                        >
                            {t('landing.hero.button1')}
                        </a>

                        <Link href="/stats"
                            className='shadow-btn px-20 py-2.5 bg-purple-100'
                        >
                            {t('landing.hero.button2')}
                        </Link>
                    </div>
                </div>
            </main>
        </section>
    )
}

export default Hero
