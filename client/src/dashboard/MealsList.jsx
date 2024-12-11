import React, { useState, useEffect } from 'react';
import MealsTable from '../components/MealsTable';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MealsList = () => {
    const [formData, setFormData] = useState({
        itemName: '',
        expirationDate: '',
        category: '',
        quantity: 1,
    });
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false); 
    const BASE_URL = 'http://localhost:5555/api';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'quantity' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/add-foodItem`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data.message === 'Alimento agregado exitosamente') {
                toast.success('Producto registrado con éxito');
                setFormData({
                    itemName: '',
                    expirationDate: '',
                    category: '',
                    quantity: 1
                });
                // Actualizar lista de comidas después de agregar
                getAllMeals();
            } else {
                toast.error(`Error al registrar el producto: ${response.data.message}`);
            }
        } catch (error) {
            toast.error('Ocurrió un error en la comunicación con el servidor.');
        } finally {
            setLoading(false);
        }
    };

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
    const updateMeal = async (id, updatedData) => {
        setLoading(true);
        try {
            const response = await axios.put(`${BASE_URL}/update-foodItem/${id}`, updatedData);
            setMeals((prevMeals) =>
                prevMeals.map((meal) =>
                    meal._id === id ? { ...meal, ...response.data } : meal
                )
            );
            toast.success('Producto actualizado correctamente.');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            toast.error('No se pudo actualizar el producto.');
        } finally {
            setLoading(false);
        }
    };

    const deleteMeal = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${BASE_URL}/delete-foodItem/${id}`);
            setMeals((prevMeals) => prevMeals.filter((meal) => meal._id !== id));
            toast.success('Producto eliminado correctamente.');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            toast.error('No se pudo eliminar el producto.');
        } finally {
            setLoading(false);
        }
    };

  
    useEffect(() => {
        getAllMeals();
    }, []);

    
    return (
        <section className="w-full grid grid-cols-12">
            <div className="col-span-12 justify-center items-center">
                {/* Header */}
                <header
                    className="col-span-12 flex flex-col justify-between border-b-2 
                    border-stone-900"
                >
                    <h4 className="text-lg font-bold mb-2">Agrega tus Productos</h4>
                    <form className="flex w-full justify-between mb-8" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="itemName"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleInputChange}
                            placeholder="Ingrese el producto"
                            required
                        />
                        <input
                            type="date"
                            id="expirationDate"
                            name="expirationDate"
                            value={formData.expirationDate}
                            onChange={handleInputChange}
                            required
                        />
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option disabled value="">
                                Seleccione la categoría
                            </option>
                            <option value="Refrigerados">Refrigerados</option>
                            <option value="Congelados">Congelados</option>
                            <option value="Frescos">Frescos</option>
                            <option value="Alacena">Alacena</option>
                        </select>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            className="w-1/12"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            min="1"
                            required
                        />
                        <button
                            type="submit"
                            className="shadow-btn px-12 py-2 bg-purple-100 rounded-md"
                            disabled={loading}
                        >
                            {loading ? "Agregando..." : "Agregar"}
                        </button>
                    </form>
                </header>
                {/* Table */}
                <div className="col-span-12 flex flex-col items-center mt-12">
                    <h4 className="text-lg font-bold mb-2">Tu Lista de Productos</h4>
                    <div className="col-span-12 max-w-5xl">
                        <div className="rounded-md">
                            <MealsTable
                                meals={meals}
                                onUpdateMeal={updateMeal}
                                onDeleteMeal={deleteMeal} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default MealsList;
