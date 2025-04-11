import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { apiClient } from '../utils/ApiClient';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
    SET_LOADING,
    SET_ERROR,
    SET_ALL_INVENTORY_ITEMS,
    ADD_INVENTORY_ITEM,
    SET_INVENTORY_ITEM,
    UPDATE_INVENTORY_ITEM,
    DELETE_INVENTORY_ITEM,
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
    const { t } = useTranslation();

    // Fetch all inventory items
    const getAllInventoryItems = useCallback(async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request('inventory');
            const items = Array.isArray(response) ? response : response.items || [];
            dispatch({ type: SET_ALL_INVENTORY_ITEMS, payload: items });
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error(t('inventory.errors.fetchFailed'));
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [t]);

    // Get single inventory item
    const getInventoryItem = useCallback(async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const item = await apiClient.request(`inventory/${id}`);
            dispatch({ type: SET_INVENTORY_ITEM, payload: item });
            return item;
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error(t('inventory.errors.fetchItemFailed'));
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [t]);

    // Create new inventory item
    const createInventoryItem = useCallback(async (formData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request('inventory', 'POST', formData);
            if (response.success) {
                dispatch({ type: ADD_INVENTORY_ITEM, payload: response.item });
            }
            return response;
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [t]);

    // Update inventory item
    const updateInventoryItem = useCallback(async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request(`inventory/${id}`, 'PUT', updatedData);
            if (response.success) {
                dispatch({ type: UPDATE_INVENTORY_ITEM, payload: response.item });
            }
            return response;
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [t]);

    // Delete inventory item
    const deleteInventoryItem = useCallback(async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request(`inventory/${id}`, 'DELETE');
            if (response.success) {
                dispatch({ type: DELETE_INVENTORY_ITEM, payload: id });
            
            }
            return response;
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [t]);

    const value = useMemo(() => ({
        // State
        allInventoryItems: state.allInventoryItems,
        inventoryItem: state.inventoryItem,
        loading: state.loading,
        error: state.error,

        // Functions
        getAllInventoryItems,
        getInventoryItem,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
    }), [
        state.allInventoryItems,
        state.inventoryItem,
        state.loading,
        state.error,
        getAllInventoryItems,
        getInventoryItem,
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
