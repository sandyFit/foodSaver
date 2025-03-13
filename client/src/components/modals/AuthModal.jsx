import React, { useState, memo } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useTranslation } from 'react-i18next';

// Main component to manage authentication modals
const AuthModal = memo(({ isOpen, onClose, initialMode = 'login' }) => {
    const { t } = useTranslation();
    const [mode, setMode] = useState(initialMode);

    if (!isOpen) return null;

    const handleSwitchToLogin = () => {
        setMode('login');
    };

    const handleSwitchToRegister = () => {
        setMode('register');
    };

    return (
        <>
            {mode === 'login' && (
                <LoginModal
                    onClose={onClose}
                    onSwitchToRegister={handleSwitchToRegister}
                />
            )}

            {mode === 'register' && (
                <RegisterModal
                    onClose={onClose}
                    onSwitchToLogin={handleSwitchToLogin}
                />
            )}
        </>
    );
});

AuthModal.displayName = 'AuthModal';

export default AuthModal; 
