import React, { useContext, useEffect, useCallback, useState, useMemo } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import TableTest from '../components/tables/TableTest';
import UpdateForm from '../components/forms/UpdateForm';

const ListTest = React.memo(() => {
    console.log('ListTest rendering');

    const [editingItem, setEditingItem] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        editingItem: null,
        itemName: '',
        category: '',
        expirationDate: '',
        quantity: 1
    });

    const {
        allInventoryItems,
        getAllInventoryItems,
        updateInventoryItem,
        deleteInventoryItem,
        loading
    } = useContext(ContextGlobal);

    // Create a stable reference for the handlers
    const handlers = useMemo(() => ({
        handleEditBtn: (item) => {
            setEditingItem(item);
            setUpdatedData({
                itemName: item.itemName,
                expirationDate: item.expirationDate,
                category: item.category,
                quantity: item.quantity,
            });
        },
        handleDeleteBtn: (itemId) => {
            if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                try {
                    deleteInventoryItem(itemId);
                    toast.success('Producto eliminado');
                } catch (error) {
                    console.error('Error eliminando el producto:', error);
                    toast.error('Error al eliminar el producto.');
                }
            }
        }
    }), [deleteInventoryItem]);

    const handleUpdateChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            updatedData: {
                ...prev.updatedData,
                [name]: name === 'quantity' ? parseInt(value, 10) : value,
            },
        }));
    }, []);

    const handleClose = useCallback(() => {
        setFormState((prev) => ({ ...prev, editingItem: null }));
    }, []);

    const handleSubmitUpdate = useCallback(async (e) => {
        e.preventDefault();
        if (!updatedData.itemName || !updatedData.category || !updatedData.expirationDate) {
            toast.error('Por favor, complete todos los campos.');
            return;
        };
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
    )

    // Fetch data only once on mount
    useEffect(() => {
        console.log('ListTest useEffect running');
        if (allInventoryItems.length === 0) { // Only fetch if data is empty
            getAllInventoryItems();
        }
    }, [getAllInventoryItems, allInventoryItems.length]); // Add allInventoryItems.length as a dependency

    // Create stable reference for table props
    const tableProps = useMemo(() => ({
        items: allInventoryItems || [],
        loading,
        onDeleteBtn: handlers.handleDeleteBtn,
        onEditBtn: handlers.handleEditBtn
    }), [allInventoryItems, loading, handlers]);

    console.log('ListTest tableProps:', tableProps);

    return (
        <section>

            <div className="w-full col-span-12 flex flex-col items-center mt-6">
                <h4 className="text-lg font-bold mb-2">Tu Lista de Productos</h4>
                <TableTest {...tableProps} />
            </div>

            {/* Formulario de edición */ }
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
        </section>
    );
});


export default ListTest;
