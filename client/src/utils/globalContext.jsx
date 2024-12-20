import { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';

import {
    reducer,
    SET_LOADING,
    SET_ALL_FOODITEMS,
    SET_ALL_USERS,
    SET_ERROR,
} from "../utils/reducer";


export const initialState = {
    allFoodItems: [],
    foodItem: {},
    allRecipes: [],
    recipe: {},
    suggestedRecipes: [],
    // allUsers: [],
    user: {},
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
            const data = await apiRequest('register-user', 'POST', formData);
            if (data.message === 'Cuenta registrada correctamente') {
                toast.success('Tu cuenta ha sido registrada correctamente. ¡Inicia sesión para comenzar!');
                // getAllUsers(); 
            } else {
                toast.error(`Error al registrar el usuario: ${data.message}`);
            }
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const login = async (formData) => {
    // console.log('FormData enviado:', formData);
    dispatch({ type: SET_LOADING, payload: true });
    try {
        const data = await apiRequest('login', 'POST', formData);
        // console.log('Login response data:', data);  // Log to inspect the data

        if (data.message === 'Login Correcto') {
            toast.success('Bienvenido al dashboard. Haz iniciado sesión');
            return data;  // Return the entire response object with message, token, user, etc.
        } else {
            toast.error('Error al iniciar sesión:', data.message);
            return null;  // Return null if login fails
        }
    } finally {
        dispatch({ type: SET_LOADING, payload: false });
    }
};



    // const getAllUsers = async () => {
    //     dispatch({ type: SET_LOADING, payload: true });
    //     try {
    //         const data = await apiRequest('get-users');
    //         dispatch({ type: SET_ALL_USERS, payload: data });
    //     } finally {
    //         dispatch({ type: SET_LOADING, payload: false });
    //     }
    // }


    // Fetch data on load
    useEffect(() => {
        getAllMeals();
        // getAllUsers();
    }, []);

    // Context value
    const contextValue = {
        allFoodItems,
        getAllMeals,
        addFoodItem,
        updateMeal,
        deleteMeal,
        registerUser,
        login,
        // getAllUsers,
        loading,
        error,
    };

    return (
        <ContextGlobal.Provider value={contextValue}>
            {children}
        </ContextGlobal.Provider>
    );
};
