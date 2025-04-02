import { createContext, useContext, useReducer, useMemo } from "react";
import { apiClient } from '../utils/ApiClient';
import { toast } from 'react-hot-toast';
import {
    SET_LOADING,
    SET_ERROR,
    SET_ALL_RECIPES,
    SET_RECIPE,
    SET_SUGGESTED_RECIPES,
    SET_EXPIRING_MEALS,
    reducer
} from '../utils/reducer';
import { all } from "axios";

const initialState = {
    allRecipes: [],
    recipe: {},
    suggestedRecipes: [],
    loading: false,
    error: null
};

export const RecipesContext = createContext(undefined);

export const useRecipes = () => {
    const context = useContext(RecipesContext);
    if (context === undefined) {
        throw new Error('useRecipes must be used within an RecipesProvider');
    }
    return context;
};

export const RecipesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const getAllRecipes = async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request('recipes');
            dispatch({ type: SET_ALL_RECIPES, payload: response });
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error('Error fetching recipes');
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const getRecipeDetails = async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request(`recipes/${id}`);
            dispatch({ type: SET_RECIPE, payload: response });
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error('Error fetching recipe details');
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const getSuggestedRecipes = async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {                         
            const response = await apiClient.request(`recipes/suggested/${id}`);            
            dispatch({ type: SET_SUGGESTED_RECIPES, payload: response });
        } catch (error) {            
            dispatch({ type: SET_ERROR, payload: error.message });            
            toast.error('Error fetching suggested recipes');            
        } finally {
            dispatch({ type: SET_LOADING, payload: false });                            
        }
    };

    const getExpiringMeals = async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request(`recipes/expiring-meals`);
            dispatch({ type: SET_EXPIRING_MEALS, payload: response });
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
            toast.error('Error fetching expiring meals');
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const value = useMemo(() => ({
        allRecipes: state.allRecipes,
        recipe: state.recipe,
        suggestedRecipes: state.suggestedRecipes,
        loading: state.loading,
        error: state.error,
        getAllRecipes,
        getRecipeDetails,
        getSuggestedRecipes,
        getExpiringMeals
    }), [
        state.allRecipes,
        state.recipe,
        state.suggestedRecipes,
        state.loading,
        state.error,
        getAllRecipes,
        getRecipeDetails,
        getSuggestedRecipes,
        getExpiringMeals
    ]);

    return (
        <RecipesContext.Provider value={value}>
            {children}
        </RecipesContext.Provider>
    );

};
