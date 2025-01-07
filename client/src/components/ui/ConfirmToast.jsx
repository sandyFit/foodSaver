import { toast } from "react-hot-toast";

export const confirmToast = ({ title, message, onConfirm }) => {
    toast.custom((t) => (
        <div
            className={`${t.visible ? "animate-enter" : "animate-leave"
                } fixed top-28 flex items-center justify-center z-50 pointer-events-auto`}
        >
            <div
                className={`max-w-lg w-full bg-white shadow-lg rounded-lg flex flex-col
                    border-2 border-stone-700 relative`}
            >
                <div className="absolute w-full h-8 bg-blue-100 border-b-2 border-stone-700 rounded-t-lg"></div>
                <div className="p-4 mt-10">
                    <h3 className="text-lg font-semibold">{ title }</h3>
                    <p className="text-sm text-gray-700">{ message }</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            onClick={() => toast.dismiss(t.id)} // Dismiss without action
                            className="px-4 py-2 text-sm bg-yellow-100 rounded-lg border-2 
                                border-stone-700"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                // Handle confirmation logic
                                console.log("Confirmado");
                                toast.dismiss(t.id);
                                onConfirm();
                            }}
                            className="px-4 py-2 text-sm text-white bg-tahiti-700 border-2 
                                border-stone-700 rounded-lg"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ));
};
