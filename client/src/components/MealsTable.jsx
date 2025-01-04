import React, { useState, useEffect, useContext } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import { formatDate } from '../utils/functions';

const MealsTable = ({ onHandleEditClick, onHandleDeleteMeal }) => {
    const { allFoodItems, loading } = useContext(ContextGlobal);     
    

    return (
        <article className="min-w-full flex flex-col justify-center items-center">
            <table border="1">
                <thead className="bg-blue-100">
                    <tr>
                        <th className="table-th">Producto</th>
                        <th className="table-th">Expira en</th>
                        <th className="table-th">Categoría</th>
                        <th className="table-th">Cantidad</th>
                        <th className="table-th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {allFoodItems.length > 0 ? (
                        allFoodItems.map((meal) => (
                            <tr key={meal._id || meal.id}>
                                <td className="table-td">{meal.itemName}</td>
                                <td className="table-td">{formatDate(meal.expirationDate)}</td>
                                <td className="table-td">{meal.category}</td>
                                <td className="table-td">{meal.quantity}</td>
                                <td className="table-td space-x-2">
                                    <button
                                        aria-label={`Edit ${meal.itemName}`}
                                        onClick={() => onHandleEditClick(meal)}
                                        className={`table-btn bg-yellow-100 hover:bg-yellow-200 border-yellow-600 
                                            text-yellow-600 ${loading ? 'opacity-40' : ''}`}
                                    >
                                        {loading ? 'Cargando...' : 'Editar'}
                                    </button>
                                    <button
                                        aria-label={`Delete ${meal.itemName}`}
                                        onClick={() => onHandleDeleteMeal(meal._id)}
                                        className={`table-btn bg-red-100 hover:bg-red-200 border-red-600 
                                            text-red-600 ${loading ? 'opacity-40' : ''}`}
                                    >
                                        { loading ? 'Eliminando...' : 'Eliminar' }
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="table-td text-center">
                                No hay productos disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
        </article>
    );
};

export default MealsTable;
