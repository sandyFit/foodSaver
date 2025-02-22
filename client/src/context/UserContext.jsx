import React, { useReducer, useEffect } from 'react';

import {
    reducer,
    SET_LOADING,
    SET_ALL_USERS,
    SET_USER,
    SET_ERROR
} from "../utils/reducer";

export const initialState = {
    allUsers: [],
    user: null,
    error: null,
    loading: false,
}

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { allUsers, loading, error } = state;

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
