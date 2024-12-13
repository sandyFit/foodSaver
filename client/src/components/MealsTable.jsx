import React, { useState, useEffect, useContext } from 'react';
import UpdateForm from './UpdateForm';
import { ContextGlobal } from '../utils/globalContext';
import { formatDate } from '../utils/functions';


const MealsTable = ({ meals, onDeleteMeal }) => {
    const { allFoodItems, updateMeal } = useContext(ContextGlobal); // Usar el updateMeal desde el contexto
    const mealsToDisplay = meals || allFoodItems;
    const [editingMeal, setEditingMeal] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        itemName: '',
        category: '',
        expirationDate: '',
        quantity: 1,
    });

    const handleEditClick = (meal) => {
        setEditingMeal(meal);
        setUpdatedData({
            itemName: meal.itemName,
            category: meal.category,
            expirationDate: meal.expirationDate
                ? formatDate(new Date(meal.expirationDate), 'yyyy-MM-dd')
                : '',
            quantity: meal.quantity,
        });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: name === 'quantity' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        if (!updatedData.itemName || !updatedData.category) {
            alert('Por favor, complete todos los campos');
            return;
        }
        if (editingMeal) {
            updateMeal(editingMeal._id, updatedData); // Usar el updateMeal del ContextGlobal
            setEditingMeal(null); // Cierra el formulario de edición
        }
    };

    // Verifica si el estado de allFoodItems cambia, y vuelve a renderizar la tabla
    useEffect(() => {
        console.log('Tabla actualizada:', allFoodItems); // Verifica si el estado cambia
    }, [allFoodItems]); // Vuelve a renderizar cuando allFoodItems cambia

    return (
        <article className="w-full flex flex-col justify-center items-center">
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
                    {mealsToDisplay.length > 0 ? (
                        mealsToDisplay.map((meal) => (
                            <tr key={meal._id || meal.id}>
                                <td className="table-td">{meal.itemName}</td>
                                <td className="table-td">{formatDate(meal.expirationDate)}</td>
                                <td className="table-td">{meal.category}</td>
                                <td className="table-td">{meal.quantity}</td>
                                <td className="table-td space-x-2">
                                    <button
                                        aria-label={`Edit ${meal.itemName}`}
                                        onClick={() => handleEditClick(meal)}
                                        className="table-btn bg-yellow-100 hover:bg-yellow-200 border-yellow-600 text-yellow-600"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        aria-label={`Delete ${meal.itemName}`}
                                        onClick={() => onDeleteMeal(meal._id || meal.id || meal._idFallback)}
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
                <UpdateForm
                    updatedData={updatedData}
                    onHandleUpdateChange={handleUpdateChange}
                    onHandleSubmitUpdate={handleSubmitUpdate}
                />
            )}
        </article>
    );
};

export default MealsTable;
