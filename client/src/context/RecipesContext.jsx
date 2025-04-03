import { createContext, useContext, useReducer, useMemo, useCallback } from "react";
import { apiClient } from '../utils/ApiClient';
import { useTranslation } from 'react-i18next';
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
    expiringMeals: [],
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
    const { t } = useTranslation();

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

    const getRecipeById = useCallback(async (id) => {
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

    const getSuggestedRecipes = useCallback(async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('User data from storage:', user); // Debug log

            // Check for both id formats
            const userId = user?.id || user?._id;

            if (!userId) {
                console.error('No user ID found:', user);
                throw new Error(t('errors.userNotFound'));
            }

            console.log('Using userId:', userId); // Debug log

            const response = await apiClient.request(`recipes/suggested?userId=${userId}`);
            console.log('API response:', response); // Debug log

            if (response.success) {
                dispatch({
                    type: SET_SUGGESTED_RECIPES,
                    payload: response
                });
            } else {
                throw new Error(response.message || t('errors.fetchFailed'));
            }
        } catch (error) {
            console.error('Error fetching suggested recipes:', error);
            dispatch({
                type: SET_ERROR,
                payload: error.message
            });
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [t]);

    const getExpiringMeals = useCallback(async () => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id || user?._id;

            if (!userId) {
                console.error('No user ID found:', user);
                throw new Error(t('errors.userNotFound'));
            }

            const response = await apiClient.request(`recipes/expiring-meals?userId=${userId}`);
            dispatch({ type: SET_EXPIRING_MEALS, payload: response });
        } catch (error) {
            console.error('Error fetching expiring meals:', error);
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, [t]);

    const value = useMemo(() => ({
        allRecipes: state.allRecipes,
        recipe: state.recipe,
        suggestedRecipes: state.suggestedRecipes,
        expiringMeals: state.expiringMeals,
        loading: state.loading,
        error: state.error,
        getAllRecipes,
        getRecipeById,
        getSuggestedRecipes,
        getExpiringMeals
    }), [
        state.allRecipes,
        state.recipe,
        state.suggestedRecipes,
        state.expiringMeals,
        state.loading,
        state.error,
        getAllRecipes,
        getRecipeById,
        getSuggestedRecipes,
        getExpiringMeals
    ]);

    return (
        <RecipesContext.Provider value={value}>
            {children}
        </RecipesContext.Provider>
    );

};
