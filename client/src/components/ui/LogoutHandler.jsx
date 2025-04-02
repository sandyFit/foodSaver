import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from "react-icons/ai";
import { confirmToast } from './ConfirmToast';
import { useTranslation } from 'react-i18next';

const LogoutHandler = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    const handleLogout = () => {
        confirmToast({
            title: t('auth.handleLogout.title'),
            message: t('auth.handleLogout.message'),
            icon: 'warning',
            onConfirm: () => navigate('/'),
        });
    };

    return (
        <button
            onClick={handleLogout}
            className="px-2 py-2 text-yellow-100 sidebar-text rounded-lg flex flex-col items-center gap-1"
        >
            <AiOutlineLogout className="text-[1.2rem] mr-2 whitespace-nowrap" />
            <span className="text-[0.7rem]">{t('auth.logout')}</span>
        </button>
    );
};

export default LogoutHandler;
