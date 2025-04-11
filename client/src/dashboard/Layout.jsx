import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import LogoutHandler from '../components/ui/LogoutHandler';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import Logo from '../components/ui/Logo';
// Icons
import { GoHome } from "react-icons/go";
import { PiNotebookLight } from "react-icons/pi";
import { CiViewList } from "react-icons/ci";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { TbUsers } from "react-icons/tb";
import { is } from 'date-fns/locale';

const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, loading, getUserInfo } = useUser();
    const [isInitialized, setIsInitialized] = useState(false);
    const [localUser, setLocalUser] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const activeUser = localUser || user;
    const location = useLocation();

    useEffect(() => {
        const initDashboard = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (!token || !storedUser) {
                navigate('/', { state: { showLogin: true } });
                return;
            }

            try {
                const parsedUser = JSON.parse(storedUser);
                console.log('Stored user data:', parsedUser);
                setLocalUser(parsedUser); // Set local user immediately from storage

                if (!isInitialized) {
                    await getUserInfo(parsedUser.id); // Update context but don't wait for it
                    setIsInitialized(true);
                }
            } catch (error) {
                console.error('Dashboard initialization error:', error);
                navigate('/', { state: { showLogin: true } });
            }
        };

        initDashboard();
    }, [navigate, getUserInfo, isInitialized]);


    // Use activeUser in your render methods
    const menuItems = React.useMemo(() =>
        activeUser?.role === 'user' ? [
            { to: '/dashboard', icon: <GoHome className='text-[1.3rem]' />, label: t('common.home'), current: location.pathname === '/dashboard' },
            { to: '/dashboard/meals-users', icon: <CiViewList className='text-[1.3rem]' />, label: t('common.products'), current: location.pathname === '/dashboard/meals-users' },
            { to: '/dashboard/recipes', icon: <PiNotebookLight className='text-[1.3rem]' />, label: t('common.recipes'), current: location.pathname === '/dashboard/recipes' },
            { to: '/dashboard/config-users', icon: <IoSettingsOutline className='text-[1.3rem]' />, label: t('common.settings'), current: location.pathname === '/dashboard/config-users' },
        ] : [
            { to: '/dashboard', icon: <GoHome className='text-[1.3rem]' />, label: t('common.home'), current: location.pathname === '/dashboard' },
            { to: '/dashboard/meals-users', icon: <CiViewList className='text-[1.3rem]' />, label: t('common.products'), current: location.pathname === '/dashboard/meals-users' },
            { to: '/dashboard/recipes', icon: <PiNotebookLight className='text-[1.3rem]' />, label: t('common.recipes'), current: location.pathname === '/dashboard/recipes' },
            { to: '/dashboard/users', icon: <TbUsers className='text-[1.3rem]' />, label: t('common.users'), current: location.pathname === '/dashboard/users' },
            { to: '/dashboard/config-admin', icon: <IoSettingsOutline className='text-[1.3rem]' />, label: t('common.settings'), current: location.pathname === '/dashboard/config-admin' },
        ], [activeUser?.role, t, location.pathname]);



    // Memoize render function
    const renderMenuItem = React.useCallback(({ to, icon, label, current }) => (
        <Link to={to} key={label}
            aria-current={current ? 'page' : undefined}
            className={classNames(
                current ? 'bg-zinc-900 text-white' :
                    'text-gray-300 hover:bg-zinc-800',
                `rounded-md ${isMobile ? 'w-[3.8rem]' : 'w-[6.6rem]'} py-2 flex flex-col items-center sidebar-text `,
            )}
        >
            <span>{icon}</span>
            <span>{isMobile ? '' : label}</span>
        </Link>
    ), []);

    // Remove the second loading check - it's redundant
    if (loading || !isInitialized) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-stone-200">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-tahiti-700"></div>
            </div>
        );
    }

    // Use the activeUser variable consistently
    if (!activeUser) {
        console.log('No active user data');
        navigate('/', { state: { showLogin: true } });
        return null;
    }

    return (
        <section className="w-full h-screen flex justify-center items-center p-2 md:p-4 xl:p-8 
            bg-stone-200 md:overflow-y-hidden">
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-6 xl:grid-cols-12 
                grid-rows-[auto_1fr_auto] md:grid-rows-6 rounded-2xl bg-stone-50 border-2
                border-stone-700">
                {/* Sidebar */}
                <aside className='hidden md:flex flex-col justify-between items-center w-full relative  
                    col-span-1 col-start-1 bg-tahiti-700 row-span-6 rounded-s-2xl 
                    border-r-2 border-stone-700 transition-all duration-300 ease-in-out '>
                    <div className="flex flex-col items-center w-full">
                        <div className="w-full h-10 absolute top-10 bg-stone-900"></div>
                        <div className="w-20 absolute top-11 left-5 z-20 mt-1">
                            <a href="/" className="inline-block">
                                <img src="/img/FoodSaver_lignt.png"
                                    alt="FoodSaver Logo"
                                    className=''
                                />
                            </a>
                        </div>
                        <ul className={`w-full`}>
                            <span className='gap-8 mt-36 flex flex-col justify-center items-center 
                                text-center'>
                                {menuItems.map(renderMenuItem)}
                            </span>
                        </ul>
                    </div>
                    {/* Logout */}
                    <div className="mb-8">
                        <LogoutHandler />
                    </div>
                </aside>

                {/* header */}
                <header className='w-full h-16 md:h-20 flex flex-col md:flex-row justify-between 
                    bg-tahiti-200 items-center col-span-full md:col-start-2 z-50
                    border-b-2 border-stone-700 rounded-t-2xl md:rounded-tr-2xl'>

                    {/* Logo for mobile only - positioned absolutely */}
                    <div className="flex justify-center items-center md:hidden w-[8rem] bg-zinc-900 
                        h-12 absolute top-2 left-6">
                        <img src="/img/FoodSaver_lignt.png"
                            alt="logo"
                            className='w-[80%]'
                        />
                    </div>

                    {/* Search Bar - Left on desktop, top on mobile */}
                    <div className="w-full md:w-auto flex justify-center md:justify-start items-center 
                        p-4 md:pl-8 order-2 md:order-1">
                        <div className="relative w-full md:w-64">
                            <IoMdSearch className='text-xl md:text-2xl absolute top-2 left-2' />
                            <input type="text"
                                placeholder={t('common.search')}
                                className='w-full md:w-64 text-sm md:text-base py-2 pl-8 md:pl-10 
                                    shadow-none rounded'
                            />
                        </div>
                    </div>

                    {/* User Info and Notifications - Right aligned */}
                    <div className="w-full md:w-auto flex justify-end items-center gap-2 md:gap-6 
                        p-4 md:pr-8 order-1 md:order-2">
                        <div className="flex items-center gap-2 md:gap-8">
                            {/* Notifications */}
                            <div className="frame relative bg-stone-50 w-8 md:w-12 h-8 md:h-12 
                                flex justify-center items-center rounded-full border-2 
                                border-stone-700 ">
                                <div className="absolute -top-2 md:-top-1 -right-2 md:-right-1 h-5 w-5 
                                    bg-red-500 rounded-full flex justify-center items-center
                                    text-xs md:text-base text-zinc-100">
                                    3
                                </div>
                                <IoNotificationsOutline className="text-[1.2rem] md:text-[1.6rem] text-stone-700" />
                            </div>

                            {/* User Info */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 md:w-12 h-8 md:h-12 border-2 
                                    border-stone-700 rounded-full overflow-hidden">
                                    <img
                                        src={user?.avatar?.url || "/avatar.png"}
                                        alt={user?.avatar?.url ? "User avatar" : "Default avatar"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="hidden md:flex flex-col">
                                    <h3 className="text-[.8rem] md:text-[.9rem]">
                                        {activeUser?.fullName || 'User'}
                                    </h3>
                                    <p className='text-[.65rem] uppercase -mt-1'>
                                        {activeUser?.role || 'guest'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* main content - adjust height to account for footer */}
                <main className='col-span-full md:col-start-2 row-start-2 px-4 md:px-12 
                    pt-16 md:pt-0 overflow-y-auto h-[calc(100vh-8.6rem)] md:h-[calc(100vh-10rem)]
                    lg:h-[calc(100vh-12.5rem)]'>
                    <Outlet />
                </main>

                {/* Update footer to fit in grid */}
                <footer className='flex md:hidden justify-center items-center col-span-full 
                    row-start-3 md:row-start-auto bg-tahiti-700 border-t-2 border-stone-700
                    h-12 rounded-b-2xl'>
                    {menuItems.map(renderMenuItem)}
                    <LogoutHandler />
                </footer>
            </div>
        </section>
    )
}

export default Dashboard;
