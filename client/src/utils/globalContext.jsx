import { createContext, useReducer, useEffect } from "react";
import axios from "./axios.config";
import { toast } from 'react-hot-toast';

import {
    reducer,
    SET_LOADING,
    SET_ALL_INVENTORY_ITEMS,
    SET_ALL_USERS,
    SET_USER,
    SET_ERROR,
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
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            };

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
            console.error('API Request Error:', error.response?.data || error.message);
            dispatch({ type: SET_ERROR, payload: error.response?.data?.message || error.message });
            toast.error(error.response?.data?.message || 'An error occurred.');
            throw error;
        }
    };

    // Fetch all inventory items
    const getAllInventoryItems = async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const data = await apiRequest('inventory');
            dispatch({ type: SET_ALL_INVENTORY_ITEMS, payload: data });
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    // Create an inventory item
    const createInventoryItem = async (formData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            console.log('Creating inventory item with data:', formData); // Debugging
            const data = await apiRequest('inventory', 'POST', formData);
            console.log('Create item response:', data); 

            if (data.success && data.item) {
                // Update the global state with the new item
                dispatch({
                    type: SET_ALL_INVENTORY_ITEMS,
                    payload: [...allInventoryItems, data.item]
                });

                getAllInventoryItems();
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
    };

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
    // const getUserInfo = async (id) => {
    //     dispatch({ type: SET_LOADING, payload: true });
    //     try {
    //         const token = localStorage.getItem('token');
    //         console.log('Token antes de hacer la solicitud:', token);

    //         const data = await apiRequest(`users-getUserInfo/${id}`,
    //             'POST',
    //             null, {
    //             'Authorization': `Bearer ${localStorage.getItem(token)}`
    //         });
            
    //         if (data.message.success) {
    //             dispatch({ type: SET_USER, payload: data });
    //         }
    //         else {
    //             toast.error('Error al obtener el usuario');
    //         }
    //     } finally {
    //         dispatch({ type: SET_LOADING, payload: false });
    //     }
    // };

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
            const filteredUser = allUsers.filter((user) => user._id !== id);
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
        getAllInventoryItems();
        getAllUsers();
    }, []);

    // Fetch the user from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log('Stored user:', storedUser);
        if (storedUser) {
            dispatch({ type: SET_USER, payload: JSON.parse(storedUser) });
        }
    }, []);


    const contextValue = {
        // Base state spread
        ...state,  // Contains: user, token, etc.

        // UI States
        loading,   // Loading state for async operations
        error,     // Error handling state
        dispatch,  // Reducer dispatch function

        // Inventory Operations
        allInventoryItems,     // List of all inventory items
        getAllInventoryItems,  // Fetch all items
        createInventoryItem,   // Create new item
        updateInventoryItem,   // Update existing item
        deleteInventoryItem,   // Delete item

        // Auth & User Operations
        registerUser,        // New user registration
        login,              // User login
        allUsers,           // List of all users (admin only)
        getAllUsers,        // Fetch all users
        getUserInfo,        // Get single user info
        updateUserProfile,  // Update user profile
        deleteUser         // Delete user account
    };

    return (
        <ContextGlobal.Provider value={contextValue}>
            {children}
        </ContextGlobal.Provider>
    );
};
