import React from 'react';
import { useContext } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import { FaUsers, FaAppleAlt, FaReceipt } from 'react-icons/fa';

const AdminHome = () => {
    const { allUsers, allFoodItems, allRecipes } = useContext(ContextGlobal);

    const stats = [
        {
            title: "Usuarios Registrados",
            count: allUsers?.length || 0,
            icon: <FaUsers className="text-2xl text-tahiti-700" />,
        },
        {
            title: "Productos Disponibles",
            count: allFoodItems?.length || 0,
            icon: <FaAppleAlt className="text-2xl text-tahiti-700" />,
        },
        {
            title: "Recetas Creadas",
            count: allRecipes?.length || 0,
            icon: <FaReceipt className="text-2xl text-tahiti-700" />,
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard de Administración</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold">{stat.count}</p>
                            </div>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
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
