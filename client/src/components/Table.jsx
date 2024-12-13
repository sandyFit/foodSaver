import React from 'react';
import { format } from 'date-fns';

const MealsTable = ({ meals, onEditMeal, onDeleteMeal, editingMeal }) => {
    // Now you can use editingMeal here
    return (
        <article className="w-full">
            {/* Table rendering */}
            <table border="1">
                {/* Table header */}
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
                    {meals.length > 0 ? (
                        meals.map((meal) => (
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
                                        onClick={() => onEditMeal(meal)}
                                        className="table-btn bg-yellow-100 hover:bg-yellow-200 border-yellow-600 text-yellow-600"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDeleteMeal(meal._id || meal.id)}
                                        className="table-btn bg-red-100 hover:bg-red-200 border-red-600 text-red-600"
                                    >
                                        Eliminar
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

            {/* Formulario de edición */}
            {editingMeal && (
                <form onSubmit={handleSubmitUpdate} className="mt-4">
                    <input
                        type="text"
                        name="itemName"
                        value={updatedData.itemName}
                        onChange={handleUpdateChange}
                        required
                    />
                    <input
                        type="date"
                        name="expirationDate"
                        value={updatedData.expirationDate}
                        onChange={handleUpdateChange}
                        required
                    />
                    <select
                        name="category"
                        value={updatedData.category}
                        onChange={handleUpdateChange}
                        required
                    >
                        <option value="Refrigerados">Refrigerados</option>
                        <option value="Congelados">Congelados</option>
                        <option value="Frescos">Frescos</option>
                        <option value="Alacena">Alacena</option>
                    </select>
                    <input
                        type="number"
                        name="quantity"
                        value={updatedData.quantity}
                        onChange={handleUpdateChange}
                        min="1"
                        required
                    />
                    <button type="submit" className="bg-green-100 hover:bg-green-200">
                        Actualizar
                    </button>
                </form>
            )}
        </article>
    );
};


export default MealsTable;
