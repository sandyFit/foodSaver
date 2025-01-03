import { createContext, useReducer, useEffect } from "react";
import axios from "./axios.config";
import { toast } from 'react-hot-toast';

import {
    reducer,
    SET_LOADING,
    SET_ALL_FOODITEMS,
    SET_ALL_USERS,
    SET_USER,
    SET_ERROR,
} from "../utils/reducer";


export const initialState = {
    allFoodItems: [],
    foodItem: {},
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
    const { allFoodItems, allUsers, loading, error } = state;

    // Helper function for API requests
    const apiRequest = async (url, method = 'GET', data = null) => {
        try {
            const config = {
                method,
                url: `${BASE_URL}/${url}`,
                headers: { 'Content-Type': 'application/json' },
            };

            if (data !== null) {
                config.data = data;
            }

            const response = await axios(config);
            // console.log('API Response:', response);  // Log the full response to debug
            return response.data;  // Make sure this is the expected structure
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error(error.message || 'An error occurred.');
            throw error;
        }
    };


    // Fetch all meals
    const getAllMeals = async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const data = await apiRequest('get-foodItems');
            dispatch({ type: SET_ALL_FOODITEMS, payload: data });
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    // Add a food item
    const addFoodItem = async (formData) => {
        // console.log('FormData enviado:', formData);
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const data = await apiRequest('add-foodItem', 'POST', formData);
            if (data.message === 'Alimento agregado exitosamente') {
                toast.success('Producto registrado con éxito');
                getAllMeals();
            } else {
                toast.error(`Error al registrar el producto: ${data.message}`);
            }
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    // Update a meal
    const updateMeal = async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const updatedMeal = await apiRequest(`update-foodItem/${id}`, 'PUT', updatedData);
            dispatch({
                type: SET_ALL_FOODITEMS,
                payload: allFoodItems.map((meal) =>
                    meal._id === id ? { ...meal, ...updatedMeal } : meal
                ),
            });

            getAllMeals();
            toast.success('Producto actualizado correctamente.');
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };


    // Delete a meal
    const deleteMeal = async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            await apiRequest(`delete-foodItem/${id}`, 'DELETE');
            const filteredMeals = allFoodItems.filter((meal) => meal._id !== id);
            dispatch({ type: SET_ALL_FOODITEMS, payload: filteredMeals });
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
            const data = await apiRequest('users-login',
                'POST',
                formData,
                { withCredentials: true }
            );
            console.log("Datos de la respuesta:", data); 

            if (data.message === 'Login Correcto' && data.token) {  // Ensure data and token exist before proceeding
                toast.success(`Bienvenido, ${data.user.fullName}!`,  // Show a success message using toast
                    { duration: 4000 }
                );
                console.log("User data:", data); // Log user data for debugging

                localStorage.setItem('user', JSON.stringify(data.user)); // Store user data in localStorage
                dispatch({ type: 'SET_USER', payload: data.user });

                return data;

            } else {
                toast.error('Error al iniciar sesión: ' + data.message );
                return null;
            }
        } catch (error) {
            console.error('Login failed:', error);  // This logs the error to the console
            toast.error('Login failed: ' + error.message);  // This shows an error message using toast
            return null;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const getAllUsers = async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const data = await apiRequest('users-getAll');
            dispatch({ type: SET_ALL_USERS, payload: data });
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const getUserInfo = async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const token = localStorage.getItem('token');
            console.log('Token antes de hacer la solicitud:', token);

            const data = await apiRequest(`users-getUserInfo/${id}`,
                'POST',
                null, {
                'Authorization': `Bearer ${localStorage.getItem(token)}`
            });
            
            if (data.message.success) {
                dispatch({ type: SET_USER, payload: data });
            }
            else {
                toast.error('Error al obtener el usuario');
            }
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const updateUser = async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const updatedUser = await apiRequest(`users-update/${id}`, 'PUT', updatedData);
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
            dispatch({ type: SET_ALL_FOODITEMS, payload: filteredUser });
            toast.success('Usuario eliminado.');
            getAllUsers();
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
            
        }
    }

    // Fetch data on load
    useEffect(() => {
        getAllMeals();
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


    // Context value
    const contextValue = {
        ...state,
        allFoodItems,
        getAllMeals,
        addFoodItem,
        updateMeal,
        deleteMeal,
        registerUser,
        login,
        allUsers,
        getAllUsers,
        getUserInfo,
        updateUser,
        deleteUser,
        loading,
        error,
        dispatch
    };

    return (
        <ContextGlobal.Provider value={contextValue}>
            {children}
        </ContextGlobal.Provider>
    );
};
