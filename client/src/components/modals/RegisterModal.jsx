import React, { useState, useCallback, memo, useContext } from 'react';
import { createPortal } from 'react-dom';
import { ContextGlobal } from '../../utils/globalContext';
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useTranslation } from 'react-i18next';

// Render counter for debugging
let renderCount = 0;

// Create a modal backdrop component
const ModalBackdrop = memo(({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            onClick={onClose}>
            <div className="bg-zinc-100 py-8 px-12 rounded-lg shadow-xl w-[40vw]  border-2 
                border-white"
                onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
});

ModalBackdrop.displayName = 'ModalBackdrop';

// Main modal component for registration
const RegisterModal = memo(({ onClose, onSwitchToLogin }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Track renders for debugging
    renderCount++;
    if (renderCount % 10 === 0) {
        console.log('🔄 RegisterModal render count:', renderCount);
    }

    // Use global context
    const { registerUser, loading } = useContext(ContextGlobal);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPass: '',
        role: 'user'
    });

    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    // Handle form submission
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        // Validate password match
        if (formData.password !== formData.confirmPass) {
            toast.error(t('validations.passwordMismatch'));
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            toast.error(t('validations.minLength', { count: 6 }));
            return;
        }

        try {
            await registerUser(formData);

            // Clear the form
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPass: '',
                role: 'user'
            });

            // Close the modal
            onClose();

            // Switch to login modal or navigate to login page
            if (onSwitchToLogin) {
                onSwitchToLogin();
            } else {
                navigate('/login');
            }

            toast.success(t('notifications.registerSuccess'));
        } catch (error) {
            console.error('Error registrando el usuario:', error);
            toast.error(t('notifications.registerError', { message: error.message || 'Error desconocido' }));
        }
    }, [formData, registerUser, navigate, onClose, onSwitchToLogin, t]);

    // Create a portal to render outside the main component tree
    return createPortal(
        <ModalBackdrop onClose={onClose}>
            <div className='flex flex-col justify-center relative'>
                <button
                    onClick={onClose}
                    className='absolute top-0 right-0 text-black'
                >
                    <IoCloseCircleOutline className='text-xl' />
                </button>

                <h2 className='text-zinc-700 text-center text-xl font-bold py-8'>
                    {t('auth.registerTitle', '¡Únete y Aprende a Ahorrar Mientras Cuidas el Planeta!')}
                </h2>

                <form onSubmit={handleSubmit} className="flex w-full flex-col space-y-4 mb-6">
                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder={t('auth.fullName')}
                            className="border p-2 rounded shadow-none"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('auth.email')}
                            className="border p-2 rounded shadow-none"
                            required
                        />
                    </div>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-1">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={t('auth.password')}
                                className="w-full border p-2 rounded shadow-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <input
                                type="password"
                                name="confirmPass"
                                value={formData.confirmPass}
                                onChange={handleChange}
                                placeholder={t('auth.confirmPassword')}
                                className="w-full border p-2 rounded shadow-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex space-x-4 mb-4 md:mb-0">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="userRole"
                                    name="role"
                                    value="user"
                                    checked={formData.role === 'user'}
                                    onChange={handleChange}
                                    className="shadow-none"
                                />
                                <label htmlFor="userRole" className="text-black">
                                    {t('auth.userRole', 'Usuario')}
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="adminRole"
                                    name="role"
                                    value="admin"
                                    checked={formData.role === 'admin'}
                                    onChange={handleChange}
                                    className="shadow-none"
                                />
                                <label htmlFor="adminRole" className="text-black">
                                    {t('auth.adminRole', 'Admin')}
                                </label>
                            </div>
                        </div>

                        <p className='text-right text-black'>
                            {t('auth.haveAccount', '¿Ya tienes una cuenta?')}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}                               
                            >
                                <span className='text-tahiti-700 hover:text-blue-700 underline 
                                    underline-offset-4 ml-2'>
                                    {t('auth.loginHere', 'Accede aquí')}
                                </span>
                            </button>
                        </p>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="shadow-btn px-8 py-2 bg-purple-200 rounded"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-tahiti-700 rounded-full animate-spin"></div>
                                    <span className="ml-2">{t('auth.registering', 'Registrando...')}</span>
                                </div>
                            ) : (
                                t('auth.registerButton', 'CREA tu Cuenta')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ModalBackdrop>,
        document.body // Mount directly to body
    );
});

RegisterModal.displayName = 'RegisterModal';

export default RegisterModal; 
