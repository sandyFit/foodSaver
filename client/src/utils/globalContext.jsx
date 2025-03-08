import { createContext, useReducer, useEffect, useCallback, useMemo } from "react";
import axios from "./axios.config";
import { toast } from 'react-hot-toast';

import {
    reducer,
    SET_LOADING,
    SET_ALL_INVENTORY_ITEMS,
    SET_ALL_USERS,
    SET_USER,
} from "../utils/reducer";


export const initialState = {
    allInventoryItems: [],
    inventoryItem: {},
    allRecipes: [],
    recipe: {},
    suggestedRecipes: [],
    allUsers: [],
    user: null,
    error: null,
    loading: false,
}

export const ContextGlobal = createContext(undefined);

const BASE_URL = 'http://localhost:5555/api';

export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { allInventoryItems, allUsers, loading, error } = state;


    // Helper function for API requests
    const apiRequest = async (url, method = 'GET', data = null) => {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            // Only add token for protected routes
            if (url.includes('dashboard') || url.includes('user')) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
            }
            const config = {
                method,
                url: `${BASE_URL}/${url}`,
                headers,
                withCredentials: true // For cookies if used
            };

            if (data) config.data = data;

            console.log('Sending API request with config:', config); // Debugging
            const response = await axios(config);
            console.log('API response:', response); // Debugging

            return response.data;
        } catch (error) {
            // Only show auth errors for protected routes
            if (error.response?.status === 401 &&
                (window.location.pathname.includes('dashboard') ||
                    window.location.pathname.includes('user'))) {
                toast.error('No autorizado. Por favor inicia sesión.');
            }
            throw error;
        }
    };

    // Fetch all inventory items
    // Update the getAllInventoryItems function to handle the correct response structure

    const getAllInventoryItems = useCallback(async () => {
        console.log('getAllInventoryItems called');

        // Always set loading state to true, but don't wait to set it back to false
        // if there's already data in the cache
        const shouldShowLoading = allInventoryItems.length === 0;

        if (shouldShowLoading) {
            dispatch({ type: SET_LOADING, payload: true });
        }

        try {
            // Remove conditional check for dashboard path that causes dependency issues
            // and rely on component to decide when to call this function

            console.log('Fetching inventory data from API...');
            const response = await apiRequest('inventory');
            console.log('Inventory API response:', response);

            // Extract the items array from the response object
            let items = [];

            if (response && response.items && Array.isArray(response.items)) {
                items = response.items;
            } else if (Array.isArray(response)) {
                items = response;
            } else {
                console.error('Could not extract items array from API response:', response);
            }

            console.log('Extracted items array:', items);
            dispatch({ type: SET_ALL_INVENTORY_ITEMS, payload: items });
            console.log('Updated inventory state with', items.length, 'items');
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        } finally {
            if (shouldShowLoading) {
                dispatch({ type: SET_LOADING, payload: false });
            }
        }
    }, [dispatch]);

    // Also update the updateInventoryItem function
    const updateInventoryItem = useCallback(async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiRequest(`inventory/${id}`, 'PUT', updatedData);
            console.log('Update response:', response);

            // Handle different response formats
            let updatedItem = null;
            if (response.item) {
                updatedItem = response.item;
            } else if (response.updatedItem) {
                updatedItem = response.updatedItem;
            } else {
                updatedItem = response;
            }

            // Update the item locally instead of fetching all items
            const updatedItems = allInventoryItems.map(item =>
                item._id === id ? { ...item, ...updatedItem } : item
            );

            dispatch({ type: SET_ALL_INVENTORY_ITEMS, payload: updatedItems });
            return updatedItem;
        } catch (error) {
            console.error('Error updating inventory item:', error);
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [dispatch, allInventoryItems]);

    // Similarly update deleteInventoryItem
    const deleteInventoryItem = useCallback(async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiRequest(`inventory/${id}`, 'DELETE');
            console.log('Delete response:', response);

            // Update items locally by filtering out the deleted item
            const filteredItems = allInventoryItems.filter(item => item._id !== id);
            dispatch({ type: SET_ALL_INVENTORY_ITEMS, payload: filteredItems });

            return response;
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [dispatch, allInventoryItems]);

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
    // const updateInventoryItem = useCallback(async (id, updatedData) => {
    //     dispatch({ type: SET_LOADING, payload: true });
    //     try {
    //         const response = await apiRequest(`inventory/${id}`, 'PUT', updatedData);
    //         const updatedItem = response.item || response; // Handle different API response formats

    //         // Directly update the state with the correct format
    //         const updatedItems = allInventoryItems.map((item) =>
    //             item._id === id ? { ...item, ...updatedItem } : item
    //         );

    //         dispatch({
    //             type: SET_ALL_INVENTORY_ITEMS,
    //             payload: updatedItems,
    //         });

    //         return updatedItem;
    //     } catch (error) {
    //         console.error('Error updating inventory item:', error);
    //         throw error; // Rethrow to handle in component
    //     } finally {
    //         dispatch({ type: SET_LOADING, payload: false });
    //     }
    // }, [allInventoryItems, dispatch]);


    // // Delete an inventory item
    // const deleteInventoryItem = async (id) => {
    //     dispatch({ type: SET_LOADING, payload: true });
    //     try {
    //         await apiRequest(`inventory/${id}`, 'DELETE');
    //         const filteredItems = allInventoryItems.filter((item) => item._id !== id);
    //         dispatch({ type: SET_ALL_INVENTORY_ITEMS, payload: filteredItems });
    //         toast.success('Producto eliminado.');
    //     } finally {
    //         dispatch({ type: SET_LOADING, payload: false });
    //     }
    // };

    // === USERS ===
    // globalContext.jsx
    const registerUser = async (formData) => {
        // console.log('FormData enviado:', formData);
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const data = await apiRequest('users-register', 'POST', formData);
            if (data.message === 'Cuenta registrada correctamente') {
                toast.success('Tu cuenta ha sido registrada correctamente. ¡Inicia sesión para comenzar!');
                await getAllUsers();
            } else {
                toast.error(`Error al registrar el usuario: ${data.message}`);
            }
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const login = async (formData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            console.log('Sending login request with data:', formData); // Debugging
            const response = await apiRequest('users-login', 'POST', formData);
            console.log('Login response:', response); // Debugging

            if (response && response.message === 'Login Correcto' && response.token) {
                // Store token and user data in localStorage
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Update global state
                dispatch({ type: SET_USER, payload: response.user });

                // Show success message
                toast.success(`Bienvenid@, ${response.user.fullName}!`, { duration: 4000 });

                // Return the response for the component to use
                return response;
            } else {
                toast.error('Error al iniciar sesión: ' + (response?.message || 'Respuesta inesperada del servidor'));
                return null;
            }
        } catch (error) {
            console.error('Login failed:', error); // Debugging
            toast.error('Login failed: ' + (error.message || 'Error desconocido'));
            return null;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const getAllUsers = async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.role !== 'admin') {
                throw new Error('Unauthorized access');
            }
            const data = await apiRequest('users-getAll');
            dispatch({ type: SET_ALL_USERS, payload: data });
        } catch (error) {
            toast.error(error.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const getUserInfo = async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            // Fix token retrieval
            const data = await apiRequest(`users-getUserInfo/${id}`);

            if (data.success) { // Match your actual response structure
                dispatch({ type: SET_USER, payload: data.user });
            } else {
                toast.error(data.message || 'Error al obtener el usuario');
            }
        } catch (error) {
            // Handle error
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };


    const updateUserProfile = async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const updatedUser = await apiRequest(`users-updateProfile/${id}`, 'PUT', updatedData);
            dispatch({
                type: SET_ALL_USERS,
                payload: allUsers.map((user) =>
                    user._id === id ? { ...user, ...updatedUser } : user
                ),
            });

            getAllUsers();
            toast.success('Usuario actualizado correctamente.');
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const deleteUser = async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            await apiRequest(`users-delete/${id}`, 'DELETE');
            const filteredUsers = allUsers.filter((user) => user._id !== id);
            dispatch({ type: SET_ALL_USERS, payload: filteredUsers });
            toast.success('Usuario eliminado.');
            getAllUsers();
        } catch (error) {
            toast.error(error.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };


    // Fetch data on load
    useEffect(() => {
        if (window.location.pathname.includes('dashboard')) {
            console.log("Ejecutando useEffect en ContextGlobal...");
            getAllInventoryItems();
            getAllUsers();
        }
    }, []);

    // Fetch the user from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log('Stored user:', storedUser);
        if (storedUser) {
            dispatch({ type: SET_USER, payload: JSON.parse(storedUser) });
        }
    }, []);


    const contextValue = useMemo(() => ({
        // Base state spread
        ...state,

        // UI States
        loading,
        error,
        dispatch,

        // Inventory Operations
        allInventoryItems,
        getAllInventoryItems,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,

        // Auth & User Operations
        registerUser,
        login,
        allUsers,
        getAllUsers,
        getUserInfo,
        updateUserProfile,
        deleteUser,
    }), [state, loading, error, allInventoryItems, allUsers]);

    return (
        <ContextGlobal.Provider value={contextValue}>
            {children}
        </ContextGlobal.Provider>
    );
};

