import React, { useState, useContext, useEffect, useCallback, memo } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import MealsTable from '../components/tables/MealsTable';
import UpdateForm from '../components/forms/UpdateForm';
import toast from 'react-hot-toast';
import AddMealForm from '../components/forms/AddMealForm';

const MealsList = () => {
    const {
        getAllInventoryItems,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        allInventoryItems,
        loading,
    } = useContext(ContextGlobal);

    const [editingItem, setEditingItem] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        itemName: '',
        expirationDate: '',
        category: '',
        quantity: 1,
    });

    const handleEditBtn = useCallback((item) => {
        setEditingItem(item);
        setUpdatedData({
            itemName: item.itemName,
            expirationDate: item.expirationDate,
            category: item.category,
            quantity: item.quantity,
        });
    }, []);

    const handleDeleteBtn = useCallback(
        async (itemId) => {
            if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                try {
                    await deleteInventoryItem(itemId);
                    toast.success('Producto eliminado');
                } catch (error) {
                    console.error('Error eliminando el producto:', error);
                    toast.error('Error al eliminar el producto.');
                }
            }
        },
        [deleteInventoryItem]
    );

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

    const handleSubmitUpdate = useCallback(
        async (e) => {
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
        },
        [editingItem, updatedData, updateInventoryItem, handleClose]
    );

    const handleSubmit = useCallback(
        async (formData) => {
            try {
                await createInventoryItem(formData);
                toast.success('Producto agregado correctamente');
            } catch (error) {
                console.error('Error agregando el producto:', error);
                toast.error('Error agregando el producto.');
            }
        },
        [createInventoryItem]
    );

    useEffect(() => {
        getAllInventoryItems();
    }, []);

    return (
        <section className="w-full grid grid-cols-12">
            <div className="col-span-12 flex flex-col justify-center items-center">
                {/* Header */}
                <AddMealForm onSubmit={handleSubmit} loading={loading} />

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

export default memo(MealsList);
