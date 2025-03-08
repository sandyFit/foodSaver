import { createContext, useReducer, useEffect, useCallback, useMemo, useContext } from "react";
import axios from "./axios.config";
import { toast } from 'react-hot-toast';

// Simplified reducer actions
const SET_LOADING = 'SET_LOADING';
const SET_INVENTORY_ITEMS = 'SET_INVENTORY_ITEMS';

// Simple inventory reducer
const inventoryReducer = (state, action) => {
    switch (action.type) {
        case SET_LOADING:
            return { ...state, loading: action.payload };
        case SET_INVENTORY_ITEMS:
            return { ...state, items: action.payload };
        default:
            return state;
    }
};

// Initial state only for inventory
const initialState = {
    items: [],
    loading: false,
};

// Create context
export const InventoryContext = createContext(undefined);

// Custom hook for safely accessing inventory context
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

// Base URL for API requests
const BASE_URL = 'http://localhost:5555/api';

// Added for render tracking
let renderCount = 0;

// Inventory provider component
export const InventoryProvider = ({ children }) => {
    // Increment render counter to track re-renders
    renderCount++;
    if (renderCount % 10 === 0) {
        console.log('🔄 InventoryContext Provider render count:', renderCount);
    }

    const [state, dispatch] = useReducer(inventoryReducer, initialState);

    // Helper function for API requests - memoize it to prevent recreation
    const apiRequest = useCallback(async (url, method = 'GET', data = null) => {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            // Add token for protected routes
            if (url.includes('dashboard') || url.includes('inventory')) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
            }

            const config = {
                method,
                url: `${BASE_URL}/${url}`,
                headers,
                withCredentials: true
            };

            if (data) config.data = data;

            const response = await axios(config);
            return response.data;
        } catch (error) {
            // Handle auth errors
            if (error.response?.status === 401) {
                toast.error('No autorizado. Por favor inicia sesión.');
            }
            throw error;
        }
    }, []);

    // Get all inventory items
    const getAllInventoryItems = useCallback(async () => {
        // Always set loading to true
        dispatch({ type: SET_LOADING, payload: true });

        try {
            const response = await apiRequest('inventory');

            // Process response
            let items = [];
            if (response && response.items && Array.isArray(response.items)) {
                items = response.items;
            } else if (Array.isArray(response)) {
                items = response;
            }

            // Update state with items
            dispatch({ type: SET_INVENTORY_ITEMS, payload: items });
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [apiRequest]);

    // Update inventory item
    const updateInventoryItem = useCallback(async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });

        try {
            const response = await apiRequest(`inventory/${id}`, 'PUT', updatedData);

            // Extract updated item based on response format
            let updatedItem = null;
            if (response.item) {
                updatedItem = response.item;
            } else if (response.updatedItem) {
                updatedItem = response.updatedItem;
            } else {
                updatedItem = response;
            }

            // Update locally without refetching
            const updatedItems = state.items.map(item =>
                item._id === id ? { ...item, ...updatedItem } : item
            );

            dispatch({ type: SET_INVENTORY_ITEMS, payload: updatedItems });
            return updatedItem;
        } catch (error) {
            console.error('Error updating inventory item:', error);
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [apiRequest, state.items]);

    // Delete inventory item
    const deleteInventoryItem = useCallback(async (id) => {
        dispatch({ type: SET_LOADING, payload: true });

        try {
            await apiRequest(`inventory/${id}`, 'DELETE');

            // Update locally without refetching
            const filteredItems = state.items.filter(item => item._id !== id);
            dispatch({ type: SET_INVENTORY_ITEMS, payload: filteredItems });
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [apiRequest, state.items]);

    // Create inventory item
    const createInventoryItem = useCallback(async (formData) => {
        dispatch({ type: SET_LOADING, payload: true });

        try {
            const data = await apiRequest('inventory', 'POST', formData);

            if (data.success && data.item) {
                // Update locally without refetching
                dispatch({
                    type: SET_INVENTORY_ITEMS,
                    payload: [...state.items, data.item],
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
    }, [apiRequest, state.items]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        // State
        allInventoryItems: state.items,
        loading: state.loading,

        // Functions
        getAllInventoryItems,
        updateInventoryItem,
        deleteInventoryItem,
        createInventoryItem,
    }), [
        // State deps
        state.items,
        state.loading,

        // Function deps
        getAllInventoryItems,
        updateInventoryItem,
        deleteInventoryItem,
        createInventoryItem,
    ]);

    return (
        <InventoryContext.Provider value={contextValue}>
            {children}
        </InventoryContext.Provider>
    );
}; 
