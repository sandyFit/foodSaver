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
            toast.error(t('inventory.errors.fecthFailed'));
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
            toast.error(t('inventory.errors.createFailed'));
            throw error;
        }
    }, []);


    const updateInventoryItem = useCallback(async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const data = await apiClient.request(`inventory/${id}`, 'PUT', updatedData);
            const updatedItem = data.item || data.updatedItem || data;
            dispatch({ type: SET_INVENTORY_ITEM, payload: updatedItem });
            await getAllInventoryItems(); 
            return data;
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error(t('inventory.errors.updateFailed'));
            throw error;
        }
    }, [getAllInventoryItems]);


    const deleteInventoryItem = useCallback(async (id) => {
        console.log('🗑️ Deleting item:', id);
        dispatch({ type: SET_LOADING, payload: true });

        try {
            // console.log('Current token:', localStorage.getItem('token')); 
            const response = await apiClient.request(`inventory/${id}`, 'DELETE');
            // console.log('Delete response:', response);

            if (response.success) {
                // Optimistic update instead of refetching
                dispatch({
                    type: SET_ALL_INVENTORY_ITEMS,
                    payload: state.allInventoryItems.filter(item => item._id !== id)
                });
                return true;
            }
            throw new Error(response.message || t('inventory.errors.deleteFailed'));
        } catch (error) {
            /* console.error('❌ Detailed delete error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            }); */
            dispatch({
                type: SET_ERROR,
                payload: error.response?.data?.message || error.message || t('inventory.errors.deleteFailed')
            });            
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [state.allInventoryItems]);


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
