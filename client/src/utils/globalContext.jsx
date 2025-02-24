import { createContext, useReducer, useEffect, useCallback, useMemo, useRef } from "react";
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
    const apiRequest = useCallback(async (url, method = 'GET', data = null) => {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };

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
                withCredentials: true
            };

            if (data) config.data = data;
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401 &&
                (window.location.pathname.includes('dashboard') ||
                    window.location.pathname.includes('user'))) {
                toast.error('No autorizado. Por favor inicia sesión.');
            }
            throw error;
        }
    }, []); 

    // Fetch all inventory items
    const getAllInventoryItems = useCallback(async () => {
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
    const updateInventoryItem = useCallback(async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const updatedItem = await apiRequest(`inventory/${id}`, 'PUT', updatedData);
            dispatch({
                type: SET_ALL_INVENTORY_ITEMS,
                payload: allInventoryItems.map((item) =>
                    item._id === id ? { ...item, ...updatedItem } : item
                ),
            });
            // Optionally refresh inventory list
            getAllInventoryItems();
            toast.success('Producto actualizado correctamente.');
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [allInventoryItems, apiRequest, getAllInventoryItems]);


    // Delete an inventory item
    const deleteInventoryItem = useCallback(async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            await apiRequest(`inventory/${id}`, 'DELETE');
            const filteredItems = allInventoryItems.filter((item) => item._id !== id);
            dispatch({ type: SET_ALL_INVENTORY_ITEMS, payload: filteredItems });
            toast.success('Producto eliminado.');
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [allInventoryItems, apiRequest]);

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
    
    // Create stable references for state values
    const stableState = useMemo(() => ({
        // Base state spread
        ...state,

        // Inventory
        allInventoryItems,

        // Users
        allUsers,

        // UI States
        loading,
        error,
        dispatch,
  
    }), [state, loading, error, allInventoryItems, allUsers]);

    // Separate callbacks object
    const callbacks = useMemo(() => ({
        // Inventory Operations
        getAllInventoryItems,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,

        // Auth & User Operations
        registerUser,
        login,
        getAllUsers,
        getUserInfo,
        updateUserProfile,
        deleteUser,
    }), [getAllInventoryItems, deleteInventoryItem]);

    // Combine stable state and callbacks
    const contextValue = useMemo(() => ({
        ...stableState,
        ...callbacks
    }), [stableState, callbacks]);

    useEffect(() => {
        console.log('Context state updated:', stableState);
    }, [stableState]);

    // Fetch data on load
    useEffect(() => {
        if (!state.allUsers.length) {
            getAllUsers();
        }
        if (location.pathname.includes("dashboard") && !state.allInventoryItems.length) {
            getAllInventoryItems();
        }
    }, [location.pathname, state.allUsers.length, state.allInventoryItems.length]);


    // Fetch the user from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log('Stored user:', storedUser);
        if (storedUser) {
            dispatch({ type: SET_USER, payload: JSON.parse(storedUser) });
        }
    }, []);


    // const contextValue = useMemo(() => ({
    //     // Base state spread
    //     ...state,

    //     // UI States
    //     loading,
    //     error,
    //     dispatch,

    //     // Inventory Operations
    //     allInventoryItems,
    //     getAllInventoryItems,
    //     createInventoryItem,
    //     updateInventoryItem,
    //     deleteInventoryItem,

    //     // Auth & User Operations
    //     registerUser,
    //     login,
    //     allUsers,
    //     getAllUsers,
    //     getUserInfo,
    //     updateUserProfile,
    //     deleteUser,
    // }), [state, loading, error, allInventoryItems, allUsers]);

    return (
        <ContextGlobal.Provider value={contextValue}>
            {children}
        </ContextGlobal.Provider>
    );
};
