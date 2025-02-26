// Complete rewrite of ListTest with proper memoization
import React, { useContext, useEffect, useCallback, useState, useMemo } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import TableTest from '../components/tables/TableTest';
import UpdateForm from '../components/forms/UpdateForm';
import { toast } from 'react-hot-toast'; // Add this import 

const ListTest = () => {
    console.log('ListTest rendering');

    // Use a single state object
    const [state, setState] = useState({
        editingItem: null,
        updatedData: {
            itemName: '',
            category: '',
            expirationDate: '',
            quantity: 1
        }
    });

    // Get context values - destructure only what's needed
    const context = useContext(ContextGlobal);
    const { loading } = context;

    // Memoize the inventory items to prevent unnecessary re-renders
    const allInventoryItems = useMemo(() =>
        context.allInventoryItems || [],
        [context.allInventoryItems]
    );

    // Memoize functions from context to prevent them from causing re-renders
    const getAllInventoryItems = useCallback(() => {
        if (context.getAllInventoryItems) {
            context.getAllInventoryItems();
        }
    }, [context.getAllInventoryItems]);

    const updateInventoryItem = useCallback((id, data) => {
        if (context.updateInventoryItem) {
            return context.updateInventoryItem(id, data);
        }
    }, [context.updateInventoryItem]);

    const deleteInventoryItem = useCallback((id) => {
        if (context.deleteInventoryItem) {
            return context.deleteInventoryItem(id);
        }
    }, [context.deleteInventoryItem]);

    // Handler functions with proper dependencies
    const handleEditBtn = useCallback((item) => {
        setState({
            editingItem: item,
            updatedData: {
                itemName: item.itemName,
                expirationDate: item.expirationDate,
                category: item.category,
                quantity: item.quantity,
            }
        });
    }, []);

    const handleDeleteBtn = useCallback((itemId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                deleteInventoryItem(itemId);
                toast.success('Producto eliminado');
            } catch (error) {
                console.error('Error eliminando el producto:', error);
                toast.error('Error al eliminar el producto.');
            }
        }
    }, [deleteInventoryItem]);

    const handleUpdateChange = useCallback((e) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            updatedData: {
                ...prev.updatedData,
                [name]: name === 'quantity' ? parseInt(value, 10) : value,
            }
        }));
    }, []);

    const handleClose = useCallback(() => {
        setState(prev => ({
            ...prev,
            editingItem: null
        }));
    }, []);

    const handleSubmitUpdate = useCallback(async (e) => {
        e.preventDefault();
        const { editingItem, updatedData } = state;

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
    }, [state, updateInventoryItem, handleClose]);

    // Fetch data only once on mount
    useEffect(() => {
        console.log('ListTest useEffect running');
        if (allInventoryItems.length === 0 && !loading) {
            getAllInventoryItems();
        }
    }, [getAllInventoryItems, allInventoryItems.length, loading]);

    // Memoize props for child components
    const tableProps = useMemo(() => ({
        items: allInventoryItems,
        loading,
        onDeleteBtn: handleDeleteBtn,
        onEditBtn: handleEditBtn
    }), [allInventoryItems, loading, handleDeleteBtn, handleEditBtn]);

    return (
        <section>
            <div className="w-full col-span-12 flex flex-col items-center mt-6">
                <h4 className="text-lg font-bold mb-2">Tu Lista de Productos</h4>
                <TableTest {...tableProps} />
            </div>

            <div className="w-[90%] col-span-12 mt-6">
                {state.editingItem && (
                    <UpdateForm
                        updatedData={state.updatedData}
                        onHandleUpdateChange={handleUpdateChange}
                        onHandleSubmitUpdate={handleSubmitUpdate}
                        onClose={handleClose}
                    />
                )}
            </div>
        </section>
    );
};

export default React.memo(ListTest);
