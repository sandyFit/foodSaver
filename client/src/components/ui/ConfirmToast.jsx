import { toast } from "react-hot-toast";
import { IoCloseCircleOutline } from "react-icons/io5";

export const confirmToast = ({ title, message, onConfirm }) => {
    return toast.custom(
        (t) => (
            // Outer container with dark overlay for modal effect - matches ModalBackdrop
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center`}
                onClick={() => toast.dismiss(t.id)}
            >
                {/* Modal container - matches the div inside ModalBackdrop */}
                <div
                    className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => toast.dismiss(t.id)}
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
                                onClick={() => toast.dismiss(t.id)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="shadow-btn px-8 py-2 bg-red-100 hover:bg-red-200 border-red-600 text-red-600 rounded"
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    onConfirm();
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            duration: Infinity,
            id: 'confirm-toast',
        }
    );
};
