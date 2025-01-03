import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { ContextGlobal } from '../utils/globalContext';

// Icons
import { GoHome } from "react-icons/go";
import { PiNotebookLight } from "react-icons/pi";
import { CiViewList } from "react-icons/ci";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { TbUsers } from "react-icons/tb";
import { AiOutlineLogout } from "react-icons/ai";

const Dashboard = () => {

    const navigate = useNavigate();
    const { user, loading } = useContext(ContextGlobal);

    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem('user');
            console.log('Stored user:', storedUser);
            if (!storedUser) {
                navigate('/login');
            }
        }
    }, [user, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please log in to access dashboard</div>;
    }

    const handleLogout = () => { 
        localStorage.removeItem('user');
        navigate('/login');
    }

    const userItems = user.role === 'user' ? [
        { to: '/dashboard', icon: <GoHome className='text-[1.3rem]' />, label: 'Inicio' },
        { to: '/dashboard/meals-users', icon: <CiViewList className='text-[1.3rem]' />, label: 'Productos' },
        { to: '/dashboard/recipes', icon: <PiNotebookLight className='text-[1.3rem]' />, label: 'Recetas' },
        { to: '/dashboard/config-users', icon: <IoSettingsOutline className='text-[1.3rem]' />, label: 'Configuración' },
        
    ] : [
        { to: '/dashboard', icon: <GoHome className='text-[1.3rem]' />, label: 'Inicio' },
        { to: '/dashboard/meals-users', icon: <CiViewList className='text-[1.3rem]' />, label: 'Productos' },
        { to: '/dashboard/recipes', icon: <PiNotebookLight className='text-[1.3rem]' />, label: 'Recetas' },
        { to: '/dashboard/users', icon: <TbUsers className='text-[1.3rem]' />, label: 'Usuarios' },
        { to: '/dashboard/config-admin', icon: <IoSettingsOutline className='text-[1.3rem]' />, label: 'Configuración' },

    ];

    // const menuToBeRendered = user?.user.role === 'admin' ? adminItems : userItems;

    const renderMenuItem = ({ to, icon, label }) => (
        <Link to={to} key={label}
            className='flex flex-col items-center gap-1 sidebar-text'>
            <span>{icon}</span>
            <span >{label}</span>
        </Link>
    );

    return (
        <section className="w-full h-screen flex justify-center items-center p-8 bg-stone-200">
            <div className="w-full h-full grid grid-cols-12 grid-rows-6 rounded-2xl bg-stone-50 
                border-2 border-stone-700 ">
                {/* Sidebar */}
                <aside className='col-span-1 col-start-1 bg-tahiti-700 row-span-6 row-start-1 
                    rounded-s-2xl border-r-2 border-stone-700 transition-all duration-300
                    ease-in-out flex flex-col justify-between items-center relative w-full'>
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
                            <span className='gap-8 mt-36 flex flex-col justify-center items-center text-center'>
                                {userItems.map(renderMenuItem)}
                            </span>
                        </ul>
                    </div>
                    {/* Logout */}
                    <div className="flex flex-col items-center gap-1 mb-8 cursor-pointer"
                        onClick={handleLogout}>
                        <AiOutlineLogout className='text-[1.3rem] text-teal-50 hover:text-teal-300' />
                        <span className='sidebar-text'>Cerrar Sesión</span>
                    </div>
                </aside>

                {/* header */}
                <header className='w-full h-20 flex justify-between bg-tahiti-200 items-center col-span-11 col-start-2 
                    border-b-2 border-stone-700 rounded-tr-2xl'>
                    {/* Search Bar */}
                    <div className="flex ml-8 relative">
                        <IoMdSearch className='text-2xl absolute top-2 left-2' />
                        <input type="text"
                            placeholder="Buscar..."
                            className='w-64 pl-10 shadow-none'/>
                    </div>
                    
                    <div className="flex justify-center items-center gap-6 relative pr-8">
                        {/* Notifications */}
                        <div className="frame relative bg-stone-50 w-12 h-12 flex justify-center items-center
                            rounded-full border-2 border-stone-700">
                            <div className="absolute bottom-7 left-7 h-6 w-6 bg-red-500 rounded-full flex 
                                justify-center items-center text-zinc-100">
                                3
                            </div>
                            <IoNotificationsOutline className="text-[1.6rem] text-stone-700" />
                        </div>

                        {/* User Info */}
                        <div className="flex gap-2 items-center">
                            <div className="w-12 h-12 border-2 border-stone-700 rounded-full">
                                {user?.avatar?.url ? (
                                    <img
                                        src={user.avatar.url}
                                        alt="User avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src="/avatar.png"
                                        alt="Default avatar"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[.9rem]">{user?.fullName}</h3>
                                <p className='text-[.65rem] uppercase -mt-2'>{ user?.role }</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* main content */}
                <main className='overflow-y-auto max-h-[72vh] col-span-11 col-start-2 row-span-5 px-20'>
                    <Outlet />
                </main>
            </div>
        </section>
    )
}

export default Dashboard;
