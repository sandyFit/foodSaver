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

            // Add token for all protected routes except register and login
            if (!url.includes('register') && !url.includes('login')) {
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


    // === USERS ===
    // globalContext.jsx
    const registerUser = async (formData) => {
        // console.log('FormData enviado:', formData);
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const data = await apiRequest('register', 'POST', formData);
            if (data.message === 'Cuenta registrada correctamente') {
                toast.success('Tu cuenta ha sido registrada correctamente. ¡Inicia sesión para comenzar!');
                await getAllUsers();
            } else {
                toast.error(`Error al registrar el usuario: ${data.message}`);
            }
            return data; // Return the data for the component to use
        } catch (error) {
            console.error('Error registering user:', error);
            throw error; // Rethrow the error for the component to handle
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const login = async (formData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            console.log('Sending login request with data:', formData); // Debugging
            const response = await apiRequest('login', 'POST', formData);
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
            console.error('Error logging in:', error);
            toast.error(`Error al iniciar sesión: ${error.response?.data?.message || error.message || 'Error desconocido'}`);
            throw error; // Rethrow the error for the component to handle
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
            const data = await apiRequest('users');
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
            const data = await apiRequest(`users/${id}`);

            if (data.success) { // Match your actual response structure
                dispatch({ type: SET_USER, payload: data.user });
            } else {
                toast.error(data.message || 'Error al obtener el usuario');
            }
        } catch (error) {
            toast.error(`Error al obtener información del usuario: ${error.message || 'Error desconocido'}`);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };


    const updateUserProfile = async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const updatedUser = await apiRequest(`profile`, 'PUT', updatedData);
            dispatch({
                type: SET_ALL_USERS,
                payload: allUsers.map((user) =>
                    user._id === id ? { ...user, ...updatedUser } : user
                ),
            });

            getAllUsers();
            toast.success('Usuario actualizado correctamente.');
        } catch (error) {
            toast.error(`Error al actualizar el perfil: ${error.message || 'Error desconocido'}`);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const deleteUser = async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            if (id) {
                // Delete specific user (admin)
                await apiRequest(`users/${id}`, 'DELETE');
            } else {
                // Delete own account
                await apiRequest('users', 'DELETE');
            }

            const filteredUsers = allUsers.filter((user) => user._id !== id);
            dispatch({ type: SET_ALL_USERS, payload: filteredUsers });
            toast.success('Usuario eliminado.');
            getAllUsers();
        } catch (error) {
            toast.error(`Error al eliminar el usuario: ${error.message || 'Error desconocido'}`);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };


    // Fetch data on load
    useEffect(() => {
        if (window.location.pathname.includes('dashboard')) {
            console.log("Ejecutando useEffect en ContextGlobal...");
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

        // Auth & User Operations
        registerUser,
        login,
        allUsers,
        getAllUsers,
        getUserInfo,
        updateUserProfile,
        deleteUser,
    }), [state, loading, error, allUsers]);

    return (
        <ContextGlobal.Provider value={contextValue}>
            {children}
        </ContextGlobal.Provider>
    );
};

