import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { GoHome } from "react-icons/go";
import { PiNotebookLight } from "react-icons/pi";
import { CiViewList } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { TbUsers } from "react-icons/tb";

const Dashboard = () => {

    const userItems = [
        { to: '/dashboard', icon: <GoHome className='text-[1.3rem]'/>, label: 'Inicio' },
        { to: '/dashboard/meals', icon: <CiViewList className='text-[1.3rem]'/>, label: 'Productos' },
        { to: '/dashboard/recipes', icon: <PiNotebookLight className='text-[1.3rem]' />, label: 'Recetas' },
        { to: '/dashboard/users', icon: <TbUsers className='text-[1.3rem]' />, label: 'Usuarios' },

    ]

    const renderMenuItem = ({ to, icon, label }) => (
        <Link to={to} key={label}
            className='flex flex-col items-center text-teal-50 hover:text-teal-300 '>
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
                    rounded-s-2xl border-r-2 border-stone-700 pb-56 transition-all duration-300
                    ease-in-out flex flex-col justify-center items-center relative'>
                    <div className="w-full h-10 absolute top-10 bg-stone-900 "></div>
                    <div className="w-20 z-20 mt-1">
                        <a href="/" className="inline-block">
                            <img src="/img/FoodSaver_lignt.png" alt="FoodSaver Logo" />
                        </a>
                    </div>
                    <ul className={`w-full `}>
                        <span className='gap-12 mt-24 flex flex-col justify-center items-center
                        text-center'>
                            {userItems.map(renderMenuItem)}
                        </span>
                    </ul>
                </aside>

                    {/* header */}
                <header className='w-full h-20 flex justify-between bg-tahiti-200 items-center col-span-11 col-start-2 
                    border-b-2 border-stone-700 rounded-tr-2xl'>
                    {/* Search Bar */}
                    <div className="flex ml-8 relative">
                        <IoMdSearch className='text-2xl absolute top-2 left-2'/>
                        <input type="text"
                            placeholder="Buscar..."
                            className='w-64 pl-10 p-2 border-2 border-stone-700 outline-6 outline-stone-500
                                rounded-lg'/>
                    </div>

                    <div className="flex">
                        <h4>Welcome User!</h4>
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
                            <div className="w-12 h-12 border-2 border-stone-700 rounded-full"></div>
                            <div className="flex flex-col">
                                <h3 className="text-[.9rem]">User</h3>                               
                            </div>
                        </div>
                    </div>
                </header>

                {/* main content */}
                <main className='overflow-y-auto max-h-[72vh] col-span-11 col-start-2 row-span-5 px-20'>
                    <Outlet/>
                </main>
            </div>
        </section>
    )
}

export default Dashboard;

