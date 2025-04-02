import React, {
    createContext,
    useReducer,
    useEffect,
    useContext,
    useMemo,
    useCallback
} from 'react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../utils/ApiClient';

import {
    reducer,
    SET_LOADING,
    SET_ALL_USERS,
    SET_USER,
    REGISTER_USER,
    SET_ERROR
} from "../utils/reducer";

export const initialState = {
    allUsers: [],
    user: null,
    error: null,
    loading: false,
}

export const UserContext = createContext(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within an UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { allUsers, loading, error } = state;

    const registerUser = async (formData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            // Remove confirmPass before sending
            const { confirmPass, ...registrationData } = formData;

            console.log('Sending registration data:', registrationData);

            const response = await apiClient.request(
                'register',
                'POST',
                registrationData
            );

            if (response.success) {
                dispatch({ type: REGISTER_USER, payload: response.user });
                return response;
            }

            throw new Error(response.message || 'Error al registrar el usuario');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const login = async (formData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            console.log('Sending login request with data:', formData); // Debugging
            const response = await apiClient.request('login', 'POST', formData);
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
            const data = await apiClient.request('users-getAll');
            dispatch({ type: SET_ALL_USERS, payload: data });
        } catch (error) {
            toast.error(error.message);
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    };

    const getUserInfo = useCallback(async (userId) => {
        if (!userId) return;

        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request(`users/${userId}`);

            // Transform API response to match component expectations
            const transformedUser = {
                id: response._id,
                fullName: response.fullName,
                email: response.email,
                role: response.role,
                avatar: response.avatar,
                inventory: response.inventory || [],
                notifications: response.notifications || []
            };

            console.log('Transformed user data:', transformedUser);
            dispatch({ type: SET_USER, payload: transformedUser });

        } catch (error) {
            console.error('Error fetching user info:', error);
            dispatch({ type: SET_ERROR, payload: error.message });
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, []);


    const updateUserProfile = async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const updatedUser = await apiClient.request(`users-updateProfile/${id}`, 'PUT', updatedData);
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
            await apiClient.request(`users-delete/${id}`, 'DELETE');
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
    
    // Fetch the user from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log('Stored user:', storedUser);
        if (storedUser) {
            dispatch({ type: SET_USER, payload: JSON.parse(storedUser) });
        }
    }, []);

    // Fetch data on load
    useEffect(() => {
        if (window.location.pathname.includes('dashboard')) {
            console.log("Ejecutando useEffect en ContextGlobal...");
            getAllUsers();
        }
    }, []);


    const value = useMemo(() => ({
        allUsers,
        loading,
        getAllUsers,
        registerUser,
        login,
        updateUserProfile,
        getUserInfo,
        deleteUser,
        error
    }), [
        allUsers,
        loading,
        getAllUsers,
        registerUser,
        login,
        updateUserProfile,
        getUserInfo,
        deleteUser,
        error
    ]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
