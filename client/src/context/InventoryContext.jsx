import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { apiClient } from '../utils/ApiClient';
import { toast } from 'react-hot-toast';
import {
    SET_LOADING,
    SET_ERROR,
    SET_ALL_INVENTORY_ITEMS,
    ADD_INVENTORY_ITEM,
    SET_INVENTORY_ITEM,
    reducer
} from '../utils/reducer';

const initialState = {
    allInventoryItems: [],
    inventoryItem: null,  
    loading: false,
    error: null
};

// Create context
export const InventoryContext = createContext(undefined);

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};
// Inventory provider component
export const InventoryProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Get all inventory items
    const getAllInventoryItems = useCallback(async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request('inventory');
            const items = Array.isArray(response) ? response : response.items || [];
            dispatch({ type: SET_ALL_INVENTORY_ITEMS, payload: items });
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error('Error fetching inventory items');
        }
    }, []);

    const createInventoryItem = useCallback(async (formData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const data = await apiClient.request('inventory', 'POST', formData);
            if (data.success && data.item) {
                dispatch({ type: ADD_INVENTORY_ITEM, payload: data.item });
                return data;
            }
            throw new Error(data?.message || 'Error creating item');
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error('Error creating inventory item');
            throw error;
        }
    }, []);


    const updateInventoryItem = useCallback(async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const data = await apiClient.request(`inventory/${id}`, 'PUT', updatedData);
            const updatedItem = data.item || data.updatedItem || data;
            dispatch({ type: SET_INVENTORY_ITEM, payload: updatedItem });
            await getAllInventoryItems(); // Refresh list after update
            return data;
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error('Error updating inventory item');
            throw error;
        }
    }, [getAllInventoryItems]);


    const deleteInventoryItem = useCallback(async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            await apiClient.request(`inventory/${id}`, 'DELETE');
            await getAllInventoryItems(); // Refresh list after delete
            toast.success('Item deleted successfully');
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error('Error deleting inventory item');
            throw error;
        }
    }, [getAllInventoryItems]);

    const value = useMemo(() => ({
        // State
        allInventoryItems: state.allInventoryItems,
        inventoryItem: state.inventoryItem,
        loading: state.loading,
        error: state.error,

        // Functions
        getAllInventoryItems,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
    }), [
        state.allInventoryItems,
        state.inventoryItem,
        state.loading,
        state.error,
        getAllInventoryItems,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
    ]);

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};
