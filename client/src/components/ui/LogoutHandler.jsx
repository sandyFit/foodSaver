import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from "react-icons/ai";
import { confirmToast } from './ConfirmToast';

const LogoutHandler = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        confirmToast({
            title: '¿Estás seguro de que quieres cerrar la sesión?',
            message: `Al cerrar sesión, tus datos personales estarán protegidos y ocultos temporalmente. 
                      Para acceder a ellos nuevamente, solo inicia sesión.`,
            onConfirm: () => navigate('/login'),
        });
    };

    return (
        <button
            onClick={handleLogout}
            className="px-2 py-2 text-red-300 sidebar-text rounded-lg flex flex-col items-center gap-1"
        >
            <AiOutlineLogout className="text-[1.2rem] mr-2 whitespace-nowrap" />
            Cerrar sesión
        </button>
    );
};

export default LogoutHandler;
