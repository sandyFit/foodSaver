import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { toast } from 'react-hot-toast';

const MealsList = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingMeal, setEditingMeal] = useState(null);
    const [formData, setFormData] = useState({
        itemName: '',
        category: 'Refrigerados',
        expirationDate: '',
        quantity: 1,
    });

    const BASE_URL = 'http://localhost:5555/api';

    // Obtener todos los alimentos
    const getAllMeals = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/get-foodItems`);
            setMeals(response.data);
        } catch (err) {
            console.error('Error al obtener los productos.', err);
            toast.error('No se pudieron obtener los productos.');
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'quantity' ? parseInt(value, 10) : value,
        }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingMeal) {
                // Actualizar producto
                const response = await axios.put(`${BASE_URL}/update-foodItem/${editingMeal._id}`, formData);
                setMeals((prevMeals) =>
                    prevMeals.map((meal) =>
                        meal._id === editingMeal._id ? { ...meal, ...response.data } : meal
                    )
                );
                toast.success('Producto actualizado');
            } else {
                // Agregar nuevo producto
                const response = await axios.post(`${BASE_URL}/add-foodItem`, formData);
                setMeals((prevMeals) => [...prevMeals, response.data]);
                toast.success('Producto agregado');
            }
        } catch (err) {
            console.error('Error al guardar el producto.', err);
            toast.error('No se pudo guardar el producto.');
        } finally {
            setLoading(false);
            setFormData({
                itemName: '',
                category: 'Refrigerados',
                expirationDate: '',
                quantity: 1,
            });
            setEditingMeal(null);
        }
    };

    // Editar un producto
    const handleEditClick = (meal) => {
        setEditingMeal(meal);
        setFormData({
            itemName: meal.itemName,
            category: meal.category,
            expirationDate: meal.expirationDate,
            quantity: meal.quantity,
        });
    };

    // Eliminar un producto
    const handleDeleteClick = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${BASE_URL}/delete-foodItem/${id}`);
            setMeals((prevMeals) => prevMeals.filter((meal) => meal._id !== id));
            toast.success('Producto eliminado');
        } catch (err) {
            console.error('Error al eliminar el producto.', err);
            toast.error('No se pudo eliminar el producto.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllMeals();
    }, []);

    return (
        <section className="w-full">
            {/* Formulario reutilizable */}
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    placeholder="Nombre del producto"
                    required
                />
                <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    required
                />
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
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
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                />
                <button type="submit" className="bg-green-100 hover:bg-green-200">
                    {editingMeal ? 'Actualizar Producto' : 'Agregar Producto'}
                </button>
            </form>

            {/* Tabla de productos */}
            <Table
                meals={meals}
                onEditMeal={handleEditClick}
                onDeleteMeal={handleDeleteClick}
            />
        </section>
    );
};

export default MealsList;
