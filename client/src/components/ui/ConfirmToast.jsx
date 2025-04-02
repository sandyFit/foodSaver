import React from 'react';
import { toast } from 'react-hot-toast';
import { IoCloseCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export const ConfirmToastContent = ({ toastInstance, title, message, onConfirm }) => {
    const { t } = useTranslation();

    return (
        <div
            className={`${toastInstance.visible ? 'animate-enter' : 'animate-leave'} 
        fixed inset-0 top-16 bg-black bg-opacity-50 z-40 flex items-center justify-center`}
            onClick={() => toast.dismiss(toastInstance.id)}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => toast.dismiss(toastInstance.id)}
                    className="absolute top-2 right-2"
                >
                    <IoCloseCircleOutline className="text-xl" />
                </button>

                <div className="flex flex-col justify-center">
                    <h4 className="text-lg font-bold my-2">{title}</h4>
                    <p className="text-sm text-gray-500 mb-6">{message}</p>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 rounded mr-2"
                            onClick={() => toast.dismiss(toastInstance.id)}
                        >
                            <span>{t('auth.cancel')}</span>
                        </button>
                        <button
                            type="button"
                            className="shadow-btn px-8 py-2 bg-red-100 hover:bg-red-200 border-red-600 text-red-600 rounded"
                            onClick={() => {
                                toast.dismiss(toastInstance.id);
                                onConfirm();
                            }}
                        >
                            <span>{t('auth.confirm')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const confirmToast = ({ title, message, onConfirm }) => {
    return toast.custom(
        (t) => (
            <ConfirmToastContent
                toastInstance={t}
                title={title}
                message={message}
                onConfirm={onConfirm}
            />
        ),
        {
            duration: Infinity,
            id: 'confirm-toast',
        }
    );
};
