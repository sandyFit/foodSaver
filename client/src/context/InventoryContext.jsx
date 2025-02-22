import React, {useReducer, useEffect} from 'react';

import {
    reducer,
    SET_LOADING,
    SET_ALL_INVENTORY_ITEMS,
    SET_ERROR
} from "../utils/reducer";

export const initialState = {
    allInventoryItems: [],
    inventoryItem: {},
    error: null,
    loading: false,
}

// InventoryContext.js
export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { allInventoryItems, allUsers, loading, error } = state;

    const getAllInventoryItems = useCallback(async () => {
        if (isFetching.current) return; // Avoid redundant calls
        isFetching.current = true;

        dispatch({ type: SET_LOADING, payload: true });

        try {
            const response = await apiRequest('inventory');
            const items = Array.isArray(response) ? response : response.items || [];
            dispatch({ type: SET_ALL_INVENTORY_ITEMS, payload: items });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
            isFetching.current = false;
        }
    }, [apiRequest]);

    const createInventoryItem = useCallback(async (formData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const data = await apiRequest('inventory', 'POST', formData);
            if (data.success && data.item) {
                dispatch({
                    type: SET_ALL_INVENTORY_ITEMS,
                    payload: [...allInventoryItems, data.item],
                });
                toast.success('Producto registrado con éxito');
            } else {
                toast.error(`Error al registrar el producto: ${data.message}`);
            }
        } catch (error) {
            console.error('Error creating inventory item:', error);
            toast.error('Error agregando el producto.');
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [allInventoryItems, dispatch]);


    // Update an inventory item
    const updateInventoryItem = async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const updatedItem = await apiRequest(`inventory/${id}`, 'PUT', updatedData);
            dispatch({
                type: SET_ALL_INVENTORY_ITEMS,
                payload: allInventoryItems.map((item) =>
                    item._id === id ? { ...item, ...updatedItem } : item
                ),
            });

            getAllInventoryItems();
            toast.success('Producto actualizado correctamente.');
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };


    // Delete an inventory item
    const deleteInventoryItem = async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            await apiRequest(`inventory/${id}`, 'DELETE');
            const filteredItems = allInventoryItems.filter((item) => item._id !== id);
            dispatch({ type: SET_ALL_INVENTORY_ITEMS, payload: filteredItems });
            toast.success('Producto eliminado.');
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    // Fetch data on load
    useEffect(() => {
        if (window.location.pathname.includes('dashboard')) {
            console.log("Ejecutando useEffect en ContextGlobal...");
            getAllInventoryItems();
        }
    }, []);


    const value = useMemo(() => ({
        allInventoryItems,
        loading,
        getAllInventoryItems,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        error
    }), [
        allInventoryItems,
        loading,
        getAllInventoryItems,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        error
    ]);

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};
