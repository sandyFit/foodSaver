import React from 'react';
import { format } from 'date-fns';

const MealsTable = ({ meals, onUpdateMeal, onDeleteMeal }) => {
    
    return (
        <article className="w-full">
            {meals.length === 0 ? (
                <p>No hay comidas disponibles.</p>
            ) : (
                <table border="1" className="table-auto w-full">
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
                        {meals.map((meal) => (
                            <tr key={meal._id || meal.id}>
                                <td className="table-td">{meal.itemName}</td>
                                <td className="table-td">
                                    {meal.expirationDate
                                        ? format(new Date(meal.expirationDate), 'yyyy-MM-dd')
                                        : 'N/A'}
                                </td>
                                <td className="table-td">{meal.category}</td>
                                <td className="table-td">{meal.quantity}</td>
                                <td className="table-td space-x-2">
                                    <button
                                        onClick={() =>
                                            onUpdateMeal(meal._id || meal.id, {
                                                itemName: meal.itemName, // Pasa los datos actuales o nuevos
                                                quantity: meal.quantity,
                                                expirationDate: meal.expirationDate,
                                                category: meal.category,
                                            })
                                        }
                                        className="table-btn bg-yellow-100 hover:bg-yellow-200 
                                            border-yellow-600 text-yellow-600"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDeleteMeal(meal._id || meal.id)}
                                        className="table-btn bg-red-100 hover:bg-red-200
                                            border-red-600 text-red-600"
                                    >
                                        Remover
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </article>
    );
};

export default MealsTable;
