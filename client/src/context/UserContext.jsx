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
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation(); // Add this line

    const registerUser = async (formData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            // Remove confirmPass before sending
            const { confirmPass, ...registrationData } = formData;

            console.log('Sending registration data:', registrationData);

            const response = await apiClient.request(
                'users/register',
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
            const response = await apiClient.request('users/login', 'POST', formData);
            console.log('Raw server response:', response); // Debug log

            // First level validation
            if (!response || typeof response !== 'object') {
                throw new Error(t('errors.invalidResponse'));
            }

            // Check for error in response
            if (!response.success) {
                throw new Error(response.message || t('errors.loginFailed'));
            }

            // Validate user data exists
            if (!response.user || typeof response.user !== 'object') {
                throw new Error(t('errors.noUserData'));
            }

            // Extract user data with fallbacks
            const userData = {
                id: response.user._id || response.user.id, // Try both formats
                _id: response.user._id || response.user.id, // Store both for compatibility
                fullName: response.user.fullName || response.user.email?.split('@')[0] || 'User',
                email: response.user.email,
                role: response.user.role || 'user'
            };

            // Validate token
            if (!response.token) {
                throw new Error(t('errors.noToken'));
            }

            // Log processed data
            console.log('Processed user data:', userData);

            // Store data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update state
            dispatch({ type: SET_USER, payload: userData });

            return {
                success: true,
                user: userData,
                token: response.token
            };

        } catch (error) {
            console.error('Login failed:', error);
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;
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

    const updateUser = async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const updatedUser = await apiClient.request(`users/${id}`, 'PUT', updatedData);
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

    const getUserProfile = useCallback(async (userId) => {
        if (!userId) return;

        dispatch({ type: SET_LOADING, payload: true });
        try {
            const response = await apiClient.request(`users/profile/${userId}`);
            console.log('Raw profile response:', response); // Debug log

            // Safely transform API response with null checks and defaults
            const transformedUser = {
                id: response?.data?._id || response?._id || userId,
                fullName: response?.data?.fullName || response?.fullName || 'Unknown User',
                email: response?.data?.email || response?.email || '',
                role: response?.data?.role || response?.role || 'user',
                avatar: response?.data?.avatar || response?.avatar || null,
                inventory: Array.isArray(response?.data?.inventory) ? response.data.inventory :
                    Array.isArray(response?.inventory) ? response.inventory : [],
                notifications: Array.isArray(response?.data?.notifications) ? response.data.notifications :
                    Array.isArray(response?.notifications) ? response.notifications : []
            };

            console.log('Transformed user data:', transformedUser);

            if (!transformedUser.id) {
                throw new Error('Invalid user data received');
            }

            dispatch({ type: SET_USER, payload: transformedUser });
            return transformedUser;

        } catch (error) {
            console.error('Error fetching user profile:', error);
            dispatch({ type: SET_ERROR, payload: error.message });
            throw error;
        } finally {
            dispatch({ type: SET_LOADING, payload: false });
        }
    }, []);

    const updateUserProfile = async (id, updatedData) => {
        dispatch({ type: SET_LOADING, payload: true });
        try {
            const updatedUser = await apiClient.request(`users/profile/${id}`, 'PUT', updatedData);
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
            await apiClient.request(`users/${id}`, 'DELETE');
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
            const userData = JSON.parse(storedUser);
            dispatch({ type: SET_USER, payload: userData });
            // Fetching profile data
            if (userData.id) {
                getUserProfile(userData.id);
            }
        }
    }, [getUserProfile]);

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
        updateUser,
        getUserProfile,
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
        updateUser,
        getUserProfile,
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
