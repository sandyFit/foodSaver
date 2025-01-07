import React, { useState, useContext, useEffect } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import MealsTable from '../components/tables/MealsTable';
import UpdateForm from '../components/forms/UpdateForm'; 
import toast from 'react-hot-toast';

const MealsList = () => {
    const {
        addFoodItem,
        updateMeal,
        deleteMeal,
        allFoodItems,
        loading,
    } = useContext(ContextGlobal);

    const [formData, setFormData] = useState(() => ({
        itemName: '',
        expirationDate: '',
        category: '',
        quantity: 1,
    }));

    const [editingMeal, setEditingMeal] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        itemName: '',
        expirationDate: '',
        category: '',
        quantity: 1,
    });

    const [isClosed, setIsClosed] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'quantity' ? parseInt(value, 10) : value,
        }));
    };

    const handleEditClick = (meal) => {
        setEditingMeal(meal);
        setUpdatedData({
            itemName: meal.itemName,
            expirationDate: meal.expirationDate,
            category: meal.category,
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


    const handleClose = () => {
        setEditingMeal(null);
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();

        if (!updatedData.itemName || !updatedData.category || !updatedData.expirationDate) {
            toast.error('Por favor, complete todos los campos.');
            return;
        }

        try {
            await updateMeal(editingMeal._id, updatedData);
            handleClose(); // Cierra el formulario de edición
        } catch (error) {
            console.error('Error actualizando el producto:', error);
            toast.error('Error al actualizar el producto.');
        }
    };


    const handleDeleteMeal = (mealId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            deleteMeal(mealId);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.itemName || !formData.expirationDate || !formData.category) {
            toast.error('Todos los campos son obligatorios.');
            return;
        }

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
            toast.error('Error agregando el producto.');
        }
    };

    useEffect(() => {
        console.log('Tabla actualizada:', allFoodItems); // Verifica si el estado cambia
    }, [allFoodItems]);

    return (
        <section className="w-full grid grid-cols-12">
            <div className="col-span-12 flex flex-col justify-center items-center">
                {/* Header */}
                <header className="w-[90%] col-span-12 flex flex-col justify-between border-b-2 border-stone-900">
                    <h4 className="text-lg font-bold mb-2">Agrega tus Productos</h4>
                    <form
                        onSubmit={handleSubmit}
                        className="flex w-full justify-between mb-8"
                    >
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
                <div className="w-full col-span-12 flex flex-col items-center mt-6">
                    <h4 className="text-lg font-bold mb-2">Tu Lista de Productos</h4>
                    <MealsTable
                        meals={allFoodItems}
                        onHandleDeleteMeal={handleDeleteMeal}
                        onHandleEditClick={handleEditClick}
                    />
                </div>

                {/* Formulario de edición */}
                <div className="w-[90%] col-span-12 mt-6">
                    {editingMeal && (
                        <UpdateForm
                            updatedData={updatedData}
                            onHandleUpdateChange={handleUpdateChange}
                            onHandleSubmitUpdate={handleSubmitUpdate}
                            onClose={handleClose}
                        />
                    )}
                </div>
                
            </div>
        </section>
    );
};

export default MealsList;
