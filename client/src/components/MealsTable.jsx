import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const MealsTable = () => {
    const [mealList, setMealList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const BASE_URL = 'http://localhost:5555/api';

    // Obtener todos los alimentos
    const getAllMeals = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/get-foodItems`);
            setMealList(response.data);
        } catch (err) {
            console.error('Error al obtener los productos.', err);
            setError('No se pudieron obtener los productos. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // Actualizar un alimento
    const updateMeal = async (id, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${BASE_URL}/update-foodItem/${id}`, updatedData);
            setMealList((prevList) =>
                prevList.map((meal) =>
                    meal._id === id ? { ...meal, ...response.data } : meal
                )
            );
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            setError('No se pudo actualizar el producto. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // Eliminar un alimento
    const deleteMeal = async (id) => {
        setLoading(true);
        setError(null);
        if (!id) {
            setError('El ID no es válido.');
            setLoading(false);
            return;
        }
        try {
            await axios.delete(`${BASE_URL}/delete-foodItem/${id}`);
            setMealList((prevList) => prevList.filter((meal) => meal._id !== id));
        } catch (err) {
            console.error('No se pudo eliminar el producto:', err);
            setError('No se pudo eliminar el producto. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // Manejar el clic de "Editar"
    const handleUpdate = (id) => {
        const updatedData = {
            itemName: 'Updated Meal', // Aquí puedes reemplazar con datos reales
            quantity: 5,
            expirationDate: new Date(),
        };
        updateMeal(id, updatedData);
    };

    // Manejar el clic de "Eliminar"
    const handleDelete = (id) => {
        if (id) {
            if (window.confirm('Esta segur@ que desea eliminar el producto?')) {
                deleteMeal(id);
            }
        } else {
            setError('El ID no es válido.');
        }
    };

    useEffect(() => {
        getAllMeals();
    }, []);

    return (
        <article className='w-full'>
            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table border="1">
                    <thead className='bg-blue-100'>
                        <tr>
                            <th className='table-th'>Producto</th>
                            <th className='table-th'>Expira en</th>
                            <th className='table-th'>Categoría</th>
                            <th className='table-th'>Cantidad</th>
                            <th className='table-th'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mealList.length > 0 ? (
                            mealList.map((meal) => (
                                <tr key={meal._id || meal.id}>
                                    <td className='table-td'>{meal.itemName}</td>
                                    <td className='table-td'>
                                        {meal.expirationDate
                                            ? format(new Date(meal.expirationDate), 'yyyy-MM-dd')
                                            : 'N/A'}
                                    </td>
                                    <td className='table-td'>{meal.category}</td>
                                    <td className='table-td'>{meal.quantity}</td>
                                    <td className='table-td space-x-2'>
                                        <button
                                            onClick={() => handleUpdate(meal._id || meal.id)}
                                            className='table-btn bg-yellow-100 hover:bg-yellow-200 
                                                border-yellow-600 text-yellow-600'
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(meal._id || meal.id)}
                                            className='table-btn bg-red-100 hover:bg-red-200
                                            border-red-600 text-red-600'
                                        >
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className='table-td text-center'>No meals available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </article>
    );
};

export default MealsTable;
