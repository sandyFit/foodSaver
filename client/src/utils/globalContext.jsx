import { createContext, useReducer, useEffect } from "react";
import {
    reducer,
    SET_LOADING,
    SET_ALL_FOODITEMS,
    SET_ERROR,
} from "../utils/reducer";


import axios from "axios";
import { toast } from 'react-hot-toast';

export const initialState = {
    allFoodItems: [],
    foodItem: {},
    allRecipes: [],
    recipe: {},
    suggestedRecipes: [],
    error: null,
    loading: false,
}

export const ContextGlobal = createContext(undefined);

const BASE_URL = 'http://localhost:5555/api';

export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { allFoodItems, loading, error } = state;

    // Helper function for API requests
    const apiRequest = async (url, method = 'GET', data = null) => {
        try {
            const config = {
                method,
                url: `${BASE_URL}/${url}`,
                headers: { 'Content-Type': 'application/json' },
            };

            // Solo incluye `data` si no es null
            if (data !== null) {
                config.data = data;
            }

            const response = await axios(config);
            return response.data;
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
        console.log('FormData enviado:', formData);
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


    // Fetch data on load
    useEffect(() => {
        getAllMeals();
    }, []);

    // Context value
    const contextValue = {
        allFoodItems,
        getAllMeals,
        addFoodItem,
        updateMeal,
        deleteMeal,
        loading,
        error,
    };

    return (
        <ContextGlobal.Provider value={contextValue}>
            {children}
        </ContextGlobal.Provider>
    );
};
