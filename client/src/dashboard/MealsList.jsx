import React, { useState, useContext, useEffect, useCallback } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import MealsTable from '../components/tables/MealsTable';
import UpdateForm from '../components/forms/UpdateForm';
import toast from 'react-hot-toast';

const MealsList = () => {
    const {
        getAllInventoryItems,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        allInventoryItems,
        loading,
    } = useContext(ContextGlobal);

    const [formData, setFormData] = useState({
        itemName: '',
        expirationDate: '',
        category: '',
        quantity: 1,
    });

    const [editingItem, setEditingItem] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        itemName: '',
        expirationDate: '',
        category: '',
        quantity: 1,
    });

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'quantity' ? parseInt(value, 10) : value,
        }));
    }, []);

    const handleEditBtn = useCallback((item) => {
        setEditingItem(item);
        setUpdatedData({
            itemName: item.itemName,
            expirationDate: item.expirationDate,
            category: item.category,
            quantity: item.quantity,
        });
    }, []);

    const handleDeleteBtn = useCallback(async (itemId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await deleteInventoryItem(itemId);
                toast.success('Producto eliminado');
            } catch (error) {
                console.error('Error eliminando el producto:', error);
                toast.error('Error al eliminar el producto.');
            }
        }
    }, [deleteInventoryItem]);

    const handleUpdateChange = useCallback((e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: name === 'quantity' ? parseInt(value, 10) : value,
        }));
    }, []);

    const handleClose = useCallback(() => {
        setEditingItem(null);
    }, []);

    const handleSubmitUpdate = useCallback(async (e) => {
        e.preventDefault();
        if (!updatedData.itemName || !updatedData.category || !updatedData.expirationDate) {
            toast.error('Por favor, complete todos los campos.');
            return;
        }
        try {
            await updateInventoryItem(editingItem._id, updatedData);
            toast.success('Producto actualizado correctamente');
            handleClose();
        } catch (error) {
            console.error('Error actualizando el producto:', error);
            toast.error('Error al actualizar el producto.');
        }
    }, [editingItem, updatedData, updateInventoryItem, handleClose]);

    const handleSubmitData = useCallback(async (e) => {
        e.preventDefault();
        if (!formData.itemName || !formData.expirationDate || !formData.category) {
            toast.error('Todos los campos son obligatorios.');
            return;
        }
        try {
            await createInventoryItem(formData);
            toast.success('Producto agregado correctamente');
            setFormData({
                itemName: '',
                expirationDate: '',
                category: '',
                quantity: 1,
            });
        } catch (error) {
            console.error('Error agregando el producto:', error);
            toast.error('Error agregando el producto.');
        }
    }, [formData, createInventoryItem]);

    useEffect(() => {
        getAllInventoryItems();
    }, [getAllInventoryItems]);

    return (
        <section className="w-full grid grid-cols-12">
            <div className="col-span-12 flex flex-col justify-center items-center">
                {/* Header */}
                <header className="w-[90%] col-span-12 flex flex-col justify-between border-b-2 border-stone-900">
                    <h4 className="text-lg font-bold mb-2">Agrega tus Productos</h4>
                    <form onSubmit={handleSubmitData} className="flex w-full justify-between mb-8">
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
                            <option value="lacteos">Lácteos</option>
                            <option value="carnes">Carnes</option>
                            <option value="vegetales">Vegetales</option>
                            <option value="frutas">Frutas</option>
                            <option value="granos">Granos</option>
                            <option value="otros">Otros</option>
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
                        items={allInventoryItems || []}
                        loading={loading}
                        onDeleteBtn={handleDeleteBtn}
                        onEditBtn={handleEditBtn}
                    />
                </div>

                {/* Formulario de edición */}
                <div className="w-[90%] col-span-12 mt-6">
                    {editingItem && (
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

export default React.memo(MealsList);
