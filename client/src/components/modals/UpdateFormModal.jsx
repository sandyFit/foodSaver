import React, { useState, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { useInventory } from '../../utils/inventoryContext'; // Use the custom hook
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from 'react-hot-toast';

// Render counter for debugging
let renderCount = 0;

// Create a modal backdrop component
const ModalBackdrop = memo(({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-2xl"
                onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
});

ModalBackdrop.displayName = 'ModalBackdrop';

// Isolated Modal Form
const UpdateFormModal = memo(({ itemToEdit, onClose }) => {
    // Track renders for debugging
    renderCount++;
    if (renderCount % 10 === 0) {
        console.log('🔄 UpdateFormModal render count:', renderCount);
    }

    const { loading, updateInventoryItem } = useInventory();

    // Create local state for the form instead of using parent state
    const [formData, setFormData] = useState({
        itemName: itemToEdit?.itemName || '',
        expirationDate: itemToEdit?.expirationDate || '',
        category: itemToEdit?.category || 'Refrigerados',
        quantity: itemToEdit?.quantity || 1
    });

    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value,
        }));
    }, []);

    // Handle form submission
    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (!formData.itemName || !formData.category || !formData.expirationDate) {
            toast.error('Por favor, complete todos los campos.');
            return;
        }

        updateInventoryItem(itemToEdit._id, formData)
            .then(() => {
                toast.success('Producto actualizado correctamente');
                onClose();
            })
            .catch((error) => {
                console.error('Error actualizando el producto:', error);
                toast.error('Error al actualizar el producto.');
            });
    }, [formData, itemToEdit?._id, updateInventoryItem, onClose]);

    // Return null if no item to edit
    if (!itemToEdit) return null;

    // Create a portal to render outside the main component tree
    return createPortal(
        <ModalBackdrop onClose={onClose}>
            <div className='flex flex-col justify-center relative'>
                <button
                    onClick={onClose}
                    className='absolute top-2 right-0'>
                    <IoCloseCircleOutline className='text-xl' />
                </button>

                <h4 className="text-lg font-bold my-2">Edita tu Producto</h4>
                <form onSubmit={handleSubmit} className="flex w-full flex-col space-y-4 mb-6">
                    <div className="flex space-x-4">
                        <div className="flex flex-col flex-1">
                            <label htmlFor="itemName" className="text-sm font-medium mb-1">Nombre del Producto</label>
                            <input
                                id="itemName"
                                type="text"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                required
                            />
                        </div>

                        <div className="flex flex-col flex-1">
                            <label htmlFor="expirationDate" className="text-sm font-medium mb-1">Fecha de Expiración</label>
                            <input
                                id="expirationDate"
                                type="date"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex flex-col flex-1">
                            <label htmlFor="category" className="text-sm font-medium mb-1">Categoría</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                required
                            >
                                <option value="Refrigerados">Refrigerados</option>
                                <option value="Congelados">Congelados</option>
                                <option value="Frescos">Frescos</option>
                                <option value="Alacena">Alacena</option>
                            </select>
                        </div>

                        <div className="flex flex-col w-1/4">
                            <label htmlFor="quantity" className="text-sm font-medium mb-1">Cantidad</label>
                            <input
                                id="quantity"
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                className="border p-2 rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded mr-2"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="shadow-btn px-8 py-2 bg-purple-100 rounded"
                        >
                            {loading ? 'Actualizando...' : 'Actualizar'}
                        </button>
                    </div>
                </form>
            </div>
        </ModalBackdrop>,
        document.body // Mount directly to body
    );
});

UpdateFormModal.displayName = 'UpdateFormModal';

export default UpdateFormModal; 
