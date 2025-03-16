import React, { useState, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { useInventory } from '../../utils/inventoryContext';
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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

// Main modal component for adding a new inventory item
const AddItemModal = memo(({ onClose }) => {
    const { t } = useTranslation();

    // Track renders for debugging
    renderCount++;
    if (renderCount % 10 === 0) {
        console.log('🔄 AddItemModal render count:', renderCount);
    }

    // Use inventory context
    const { loading, createInventoryItem } = useInventory();

    // Form state
    const [formData, setFormData] = useState({
        itemName: '',
        expirationDate: '',
        category: 'lacteos',
        quantity: 1
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
            toast.error(t('validations.required'));
            return;
        }

        // Log the data being sent to the server
        console.log('Sending data to server:', formData);

        createInventoryItem(formData)
            .then((response) => {
                console.log('Server response:', response);
                toast.success(t('notifications.itemAdded'));
                onClose(); // Close the modal after successful submission
            })
            .catch((error) => {
                console.error('Error adding product:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                toast.error(`${t('notifications.addError')} ${errorMessage}`);
            });
    }, [formData, createInventoryItem, onClose, t]);

    // Create a portal to render outside the main component tree
    return createPortal(
        <ModalBackdrop onClose={onClose}>
            <div className='flex flex-col justify-center relative px-8'>
                <button
                    onClick={onClose}
                    className='absolute top-2 right-0'>
                    <IoCloseCircleOutline className='text-xl' />
                </button>

                <h4 className="text-lg font-bold my-2">{t('inventory.addItem')}</h4>
                <form onSubmit={handleSubmit} className="flex w-full flex-col space-y-4 mb-6">
                    <div className="flex space-x-4">
                        <div className="flex flex-col flex-1">
                            <label htmlFor="itemName" className="text-sm font-medium mb-1">{t('inventory.itemName')}</label>
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
                            <label htmlFor="expirationDate" className="text-sm font-medium mb-1">{t('inventory.expirationDate')}</label>
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
                            <label htmlFor="category" className="text-sm font-medium mb-1">{t('inventory.category')}</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                required
                            >
                                <option value="lacteos">{t('inventory.categories.diary')}</option>
                                <option value="carnes">{t('inventory.categories.meat')}</option>
                                <option value="vegetales">{t('inventory.categories.vegetables')}</option>
                                <option value="frutas">{t('inventory.categories.fruits')}</option>
                                <option value="granos">{t('inventory.categories.grains')}</option>
                                <option value="otros">{t('inventory.categories.other')}</option>
                            </select>
                        </div>

                        <div className="flex flex-col w-1/4">
                            <label htmlFor="quantity" className="text-sm font-medium mb-1">
                                {t('inventory.quantity')}
                            </label>
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
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="shadow-btn px-8 py-2 bg-green-100 hover:bg-green-200 
                                border-green-600 text-green-600 rounded"
                        >
                            {loading ? t('inventory.addingItem') : t('common.add')}
                        </button>
                    </div>
                </form>
            </div>
        </ModalBackdrop>,
        document.body // Mount directly to body
    );
});

AddItemModal.displayName = 'AddItemModal';

export default AddItemModal; 
