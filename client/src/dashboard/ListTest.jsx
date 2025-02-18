import React, { useContext, useEffect, useCallback, useState, useMemo } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import MealsTable from '../components/tables/MealsTable';
import TableTest from '../components/tables/TableTest';

const ListTest = React.memo(() => {
    console.log('ListTest rendering');

    const {
        allInventoryItems,
        getAllInventoryItems,
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
                deleteInventoryItem(itemId)
                    .then(() => toast.success('Producto eliminado'))
                    .catch((error) => {
                        console.error('Error eliminando el producto:', error);
                        toast.error('Error al eliminar el producto.');
                    });
            }
        }
    }), [deleteInventoryItem]);

    // Fetch data only once on mount
    useEffect(() => {
        console.log('ListTest useEffect running');
        getAllInventoryItems();
    }, []);  // Remove getAllInventoryItems from deps

    // Create stable reference for table props
    const tableProps = useMemo(() => ({
        items: allInventoryItems || [],
        loading,
        onDeleteBtn: handlers.handleDeleteBtn,
        onEditBtn: handlers.handleEditBtn
    }), [allInventoryItems, loading, handlers]);

    console.log('ListTest tableProps:', tableProps);

    return (
        <div className="w-full col-span-12 flex flex-col items-center mt-6">
            <h4 className="text-lg font-bold mb-2">Tu Lista de Productos</h4>
            <TableTest {...tableProps} />
        </div>
    );
});


export default ListTest;
