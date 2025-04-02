import { createContext, useContext, useReducer, useMemo, useCallback } from "react";
import { apiClient } from '../utils/ApiClient';
import {
    SET_LOADING,
    SET_ERROR,
    SET_ALL_RECIPES,
    SET_RECIPE,
    SET_SUGGESTED_RECIPES,
    SET_EXPIRING_MEALS,
    reducer
} from '../utils/reducer';


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

    const getAllRecipes = useCallback(async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request('recipes');
            dispatch({ type: SET_ALL_RECIPES, payload: response });
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, []);

    const getRecipeDetails = useCallback(async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request(`recipes/${id}`);
            dispatch({ type: SET_RECIPE, payload: response });
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, []);

    const getSuggestedRecipes = useCallback(async (id) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {                         
            const response = await apiClient.request(`recipes/suggested/${id}`);            
            dispatch({ type: SET_SUGGESTED_RECIPES, payload: response });
        } catch (error) {            
            dispatch({ type: SET_ERROR, payload: error.message });                     
        } finally {
            dispatch({ type: SET_LOADING, payload: false });                            
        }
    }, []);

    const getExpiringMeals = useCallback(async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request(`recipes/expiring-meals`);
            dispatch({ type: SET_EXPIRING_MEALS, payload: response });
        } catch (error) {
            dispatch({ type: SET_ERROR, payload: error.message });
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, []);

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
