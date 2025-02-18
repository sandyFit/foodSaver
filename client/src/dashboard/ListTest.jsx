import React, { useContext, useEffect, useCallback, useState } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import MealsTable from '../components/tables/MealsTable';

const ListTest = React.memo(() => {
    const {
        allInventoryItems,
        getAllInventoryItems,
        deleteInventoryItem,
        loading
    } = useContext(ContextGlobal);

    const [editingItem, setEditingItem] = useState(false);
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


    useEffect(() => {
        console.log('Fetching inventory items...');
        getAllInventoryItems();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="w-full col-span-12 flex flex-col items-center mt-6">
            <h4 className="text-lg font-bold mb-2">Tu Lista de Productos</h4>
            <MealsTable
                items={allInventoryItems || []}
                loading={loading}
                onDeleteBtn={handleDeleteBtn}
                onEditBtn={handleEditBtn}
            />
        </div>
    );
});

export default ListTest;
