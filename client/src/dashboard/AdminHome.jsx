import React from 'react';
import { useContext } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import HomeCard from '../components/cards/HomeCard';
import { PiNotebookLight } from 'react-icons/pi';
import { CiViewList } from 'react-icons/ci';
import { TbUsers } from 'react-icons/tb';

const AdminHome = () => {
    const { allUsers, allFoodItems, allRecipes } = useContext(ContextGlobal);

    const bgColors = [
        'bg-red-100',
        'bg-yellow-100',
        'bg-blue-100',
        'bg-green-100',
        'bg-purple-100',
        'bg-pink-100',
    ];

    const stats = [
        {
            title: "Usuarios Registrados",
            count: allUsers?.length || 0,
            icon: <TbUsers />,
        },
        {
            title: "Productos Disponibles",
            count: allFoodItems?.length || 0,
            icon: <CiViewList />,
        },
        {
            title: "Recetas Creadas",
            count: allRecipes?.length || 0,
            icon: <PiNotebookLight />,
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 list-none">
                {stats.map((stat, index) => (
                    <li key={index}>
                        <HomeCard
                            bgColor={bgColors[index % bgColors.length]}
                            icon={stat.icon}
                            title={stat.title}
                            count={stat.count}
                        />
                    </li>

                ))}
            </div>

            {/* Recent Activity */}
            <div className="w-full p-6 border-2 border-stone-900 rounded-lg custom-shadow">
                <h2 className="text-xl font-semibold mb-4">Última Actividad</h2>
                <p className="text-gray-600 text-sm">Mantente al tanto de las acciones recientes en tu sistema.</p>
                <div className="space-y-4 mt-4">
                    {/* Add recent users/items/recipes here */}
                    <p className="text-gray-500 italic">No hay actividad reciente por ahora.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
