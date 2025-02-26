import React, { useContext, useEffect, useCallback, useState } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import TableTest from '../components/tables/TableTest';
import UpdateForm from '../components/forms/UpdateForm';
import { toast } from 'react-hot-toast';

const ListTest = () => {
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

    // Reference the context
    const {
        loading,
        allInventoryItems,
        getAllInventoryItems,
        updateInventoryItem,
        deleteInventoryItem
    } = useContext(ContextGlobal);

    // Debug information - helps track component state
    useEffect(() => {
        console.log('ListTest rendering. Items length:', allInventoryItems?.length);
        console.log('First few items:', allInventoryItems?.slice(0, 2));
    });

    // Handler functions
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
            deleteInventoryItem(itemId)
                .then(() => {
                    toast.success('Producto eliminado');
                })
                .catch((error) => {
                    console.error('Error eliminando el producto:', error);
                    toast.error('Error al eliminar el producto.');
                });
        }
    }, [deleteInventoryItem]);

    const handleUpdateChange = useCallback((e) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            updatedData: {
                ...prev.updatedData,
                [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value,
            }
        }));
    }, []);

    const handleClose = useCallback(() => {
        setState(prev => ({
            ...prev,
            editingItem: null
        }));
    }, []);

    const handleSubmitUpdate = useCallback((e) => {
        e.preventDefault();
        const { editingItem, updatedData } = state;

        if (!updatedData.itemName || !updatedData.category || !updatedData.expirationDate) {
            toast.error('Por favor, complete todos los campos.');
            return;
        }

        updateInventoryItem(editingItem._id, updatedData)
            .then(() => {
                toast.success('Producto actualizado correctamente');
                handleClose();
            })
            .catch((error) => {
                console.error('Error actualizando el producto:', error);
                toast.error('Error al actualizar el producto.');
            });
    }, [state, updateInventoryItem, handleClose]);

    // Fetch data on mount
    useEffect(() => {
        console.log('ListTest - Initial mount effect');
        getAllInventoryItems();
    }, [getAllInventoryItems]);

    return (
        <section>
            <div className="w-full col-span-12 flex flex-col items-center mt-6">
                <h4 className="text-lg font-bold mb-2">Tu Lista de Productos</h4>

                {/* Debug info */}
                <div className="text-xs text-gray-500 mb-2">
                    Items: {allInventoryItems?.length || 0} | Loading: {loading ? 'Yes' : 'No'}
                </div>

                <TableTest
                    items={allInventoryItems || []}
                    loading={loading}
                    onDeleteBtn={handleDeleteBtn}
                    onEditBtn={handleEditBtn}
                />
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

export default ListTest;
