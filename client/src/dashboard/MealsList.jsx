import React, { useState, useContext } from 'react';
import MealsTable from '../components/MealsTable';
import { ContextGlobal } from '../utils/globalContext';
import toast from 'react-hot-toast';

const MealsList = () => {
    const {
        addFoodItem,
        loading,
        error,
    } = useContext(ContextGlobal);

    const [formData, setFormData] = useState({
        itemName: '',
        expirationDate: '',
        category: '',
        quantity: 1,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'quantity' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addFoodItem(formData);
            setFormData({
                itemName: '',
                expirationDate: '',
                category: '',
                quantity: 1,
            });
        } catch (error) {
            console.error('Error adding food item:', error);
            toast.error('Error Agregando el producto');
        }
    };

    return (
        <section className="w-full grid grid-cols-12">
            <div className="col-span-12 flex flex-col justify-center items-center">
                {/* Header */}
                <header className="col-span-12 flex flex-col justify-between border-b-2 border-stone-900">
                    <h4 className="text-lg font-bold mb-2">Agrega tus Productos</h4>
                    <form
                        onSubmit={handleSubmit}
                        className="flex w-full justify-between mb-8" >
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
                            {loading ? 'Agregando...' : 'Agregar'}
                        </button>
                    </form>
                </header>
                {/* Table */}
                <div className="col-span-12 flex flex-col items-center mt-12">
                    <h4 className="text-lg font-bold mb-2">Tu Lista de Productos</h4>
                    <div className="col-span-12 max-w-full">
                        <div className="rounded-md">
                            <MealsTable />                                                  
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MealsList;
