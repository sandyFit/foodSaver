import React, { useState, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { useInventory } from '../../context/InventoryContext';
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
    const [isAdding, setIsAdding] = useState(false);

    // Track renders for debugging
    // renderCount++;
    // if (renderCount % 10 === 0) {
    //     console.log('🔄 AddItemModal render count:', renderCount);
    // }

    // Use inventory context
    const { createInventoryItem } = useInventory();

    // Form state
    const [formData, setFormData] = useState({
        itemName: '',
        expirationDate: '',
        location: 'refrigerator',
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

        if (!formData.itemName || !formData.location || !formData.expirationDate) {
            toast.error(t('validations.required'));
            return;
        }

        // console.log('Sending data to server:', formData);

        try {
            await createInventoryItem(formData)
            toast.success(t('notifications.itemAdded'));
            onClose();

        } catch (error) {
            // console.error('Error adding product:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            toast.error(`${t('notifications.addError')} ${errorMessage}`);
        } finally {
            setIsAdding(false);
        }
    }, [formData, createInventoryItem, onClose, t]);

    // Create a portal to render outside the main component tree
    return createPortal(
        <ModalBackdrop onClose={onClose}>
            <div className='flex flex-col justify-center relative px-4 md:px-8'>
                <button
                    onClick={onClose}
                    className='absolute top-2 right-0'>
                    <IoCloseCircleOutline className='text-xl' />
                </button>

                <h4 className="text-lg font-bold my-2">{t('inventory.addItem')}</h4>
                <form onSubmit={handleSubmit} className="flex w-full flex-col space-y-4 mb-6">
                    <div className="flex flex-col flex-1">
                        <label htmlFor="itemName"
                            className="text-sm font-medium mb-1">{t('inventory.itemName')}</label>
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

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex ">
                            <div className="flex flex-col flex-1">
                                <label htmlFor="location"
                                    className="text-sm font-medium mb-1">{t('inventory.location')}</label>
                                <select
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="border p-2 rounded"
                                    required
                                >
                                    <option value="refrigerator">{t('inventory.locations.refrigerator')}</option>
                                    <option value="freezer">{t('inventory.locations.freezer')}</option>
                                    <option value="pantry">{t('inventory.locations.pantry')}</option>
                                    <option value="cabinet">{t('inventory.locations.cabinet')}</option>
                                    <option value="other">{t('inventory.locations.other')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <label htmlFor="expirationDate"
                                className="text-sm font-medium mb-1">
                                {t('inventory.expirationDate')}
                            </label>
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
                            disabled={isAdding}
                            className="shadow-btn px-8 py-2 bg-green-100 hover:bg-green-200 
                                border-green-600 text-green-600 rounded"
                        >
                            {isAdding ? t('inventory.addingItem') : t('common.add')}
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
