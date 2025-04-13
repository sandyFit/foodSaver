import React, { useState, useCallback, memo, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useUser } from '../../context/UserContext';
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Render counter for debugging
let renderCount = 0;

// Create a modal backdrop component
const ModalBackdrop = memo(({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            onClick={onClose}>
            <div className="w-11/12 max-w-2xl bg-zinc-100 py-8 px-12 rounded-lg shadow-xl border-2 
                border-white"
                onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
});

ModalBackdrop.displayName = 'ModalBackdrop';

// Main modal component for registration
// ...existing imports...

const RegisterModal = memo(({ onClose, onSwitchToLogin }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { registerUser, loading } = useUser();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPass: '',
        role: 'user' // Default to user role
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const validateForm = useCallback(() => {
        // Check for empty fields
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPass) {
            toast.error(t('validations.allFieldsRequired'));
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error(t('validations.invalidEmail'));
            return false;
        }

        // Validate password length
        if (formData.password.length < 6) {
            toast.error(t('validations.passwordLength'));
            return false;
        }

        // Check password match
        if (formData.password !== formData.confirmPass) {
            toast.error(t('validations.passwordMismatch'));
            return false;
        }

        return true;
    }, [formData, t]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Prepare registration data without confirmPass
            const { confirmPass, ...registrationData } = formData;

            console.log('Sending registration data:', registrationData);

            const response = await registerUser(registrationData);
            console.log('Registration response:', response);

            if (response && response.success) {
                toast.success(t('notifications.registerSuccess'));
                setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPass: '',
                    role: 'user'
                });
                onSwitchToLogin();
            } else {
                throw new Error(response?.message || t('errors.unknown'));
            }
        } catch (error) {
            console.error('Registration error:', error);

            // Handle specific errors
            const errorMessage = error.message?.toLowerCase() || '';
            if (errorMessage.includes('already exists') || errorMessage.includes('ya existe')) {
                toast.error(t('notifications.emailExists'));
            } else if (errorMessage.includes('unauthorized')) {
                // This shouldn't happen during registration
                console.error('Unexpected auth error during registration');
                toast.error(t('notifications.registerError'));
            } else {
                toast.error(t('notifications.registerError', {
                    message: error.message || t('errors.unknown')
                }));
            }
        }
    }, [formData, registerUser, validateForm, onSwitchToLogin, t]);


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
                    {t('auth.registerTitle')}
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
                                    {t('auth.userRole')}
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
                                    {t('auth.adminRole')}
                                </label>
                            </div>
                        </div>

                        <p className='text-sm lg:text-base text-right text-black'>
                            {t('auth.haveAccount')}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}                               
                            >
                                <span className='text-sm lg:text-base text-tahiti-700 hover:text-blue-700 underline 
                                    underline-offset-4 ml-2'>
                                    {t('auth.loginHere')}
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
                                    <span className="ml-2">{t('auth.registering')}</span>
                                </div>
                            ) : (
                                t('auth.registerButton')
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
