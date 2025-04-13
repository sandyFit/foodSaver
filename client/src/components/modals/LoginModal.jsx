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
            <div className="w-11/12 max-w-2xl bg-white py-8 px-12 rounded-lg p-6 shadow-xl"
                onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
});

ModalBackdrop.displayName = 'ModalBackdrop';

// Main modal component for login
const LoginModal = memo(({ onClose, onSwitchToRegister }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Track renders for debugging
    renderCount++;
    if (renderCount % 10 === 0) {
        console.log('🔄 LoginModal render count:', renderCount);
    }

    // Use global context
    const { login, loading } = useUser();

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        try {
            const response = await login(formData);
            console.log('Login response:', response); // Debug log

            if (response?.success) {
                // Verify stored data
                const storedUser = localStorage.getItem('user');
                console.log('Stored user after login:', storedUser); // Debug log

                if (!storedUser) {
                    throw new Error(t('auth.loginDataError'));
                }

                setFormData({ email: '', password: '' });
                onClose();
                navigate('/dashboard');
                toast.success(t('auth.loginSuccess'));
            } else {
                throw new Error(response?.message || t('auth.loginFailed'));
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(t('auth.loginError', {
                message: error.message || t('auth.unknownError')
            }));
        }
    }, [formData, login, navigate, onClose, t]);

    // Create a portal to render outside the main component tree
    return createPortal(
        <ModalBackdrop onClose={onClose}>
            <div className=' flex flex-col justify-center relative'>
                <button
                    onClick={onClose}
                    className='absolute top-0 right-0 text-black'
                >
                    <IoCloseCircleOutline className='text-xl' />
                </button>

                <h2 className='text-zinc-700 text-center text-xl font-bold pt-8 mb-6'>
                    {t('auth.loginTitle')}
                </h2>

                <form onSubmit={handleSubmit} className="flex w-full flex-col space-y-4 mb-6">
                    <div className="flex flex-col flex-1">
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

                    <div className="flex flex-col">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={t('auth.password')}
                            className="border p-2 rounded shadow-none"
                            required
                        />
                    </div>

                    <p className='text-sm lg:text-base text-center text-black'>
                        {t('auth.noAccount')}
                        <button
                            type="button"
                            onClick={onSwitchToRegister}

                        >
                            <span className='text-sm lg:text-base text-tahiti-700 hover:text-blue-700 underline 
                                underline-offset-4 ml-2'>
                                {t('auth.registerHere')}
                            </span>
                        </button>
                    </p>

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="shadow-btn px-8 py-2 bg-blue-200 rounded"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-tahiti-700 rounded-full 
                                        animate-spin"></div>
                                    <span className="ml-2">{t('auth.loggingIn')}</span>
                                </div>
                            ) : (
                                t('auth.loginButton')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ModalBackdrop>,
        document.body // Mount directly to body
    );
});

LoginModal.displayName = 'LoginModal';

export default LoginModal;
