import React, { useEffect, useCallback, useState } from 'react';
import { useInventory } from '../utils/inventoryContext'; // Use the custom hook
import MealsTable from '../components/tables/MealsTable';
import UpdateFormModal from '../components/modals/UpdateFormModal';
import { toast } from 'react-hot-toast';
import AddItemButton from '../components/buttons/AddItemButton';
import { useTranslation } from 'react-i18next';

// Render counter for tracking re-renders
let renderCount = 0;

// Monitor children re-renders
class RenderTracker extends React.Component {
    constructor(props) {
        super(props);
        this.renders = 0;
    }

    componentDidUpdate() {
        this.renders++;
        if (this.renders % 100 === 0) {
            console.warn(`⚠️ EXCESSIVE RENDERS: ${this.props.componentName} has rendered ${this.renders} times!`);
        }
    }

    render() {
        return this.props.children;
    }
}

// Simplified ListTest component with minimal state
const ItemsList = () => {

    const { t } = useTranslation();
    const [editingItem, setEditingItem] = useState(null);

    // Use the specialized inventory hook
    const {
        loading,
        error,
        allInventoryItems,
        getAllInventoryItems,
        deleteInventoryItem
    } = useInventory();

    // Track renders in development
    if (process.env.NODE_ENV === 'development') {
        renderCount++;
        if (renderCount % 10 === 0) {
            console.log('🔄 ItemsList render count:', renderCount);
        }
    }

    // Simple function to edit an item - sets it for the modal
    const handleEditBtn = useCallback((item) => {
        setEditingItem(item);
    }, []);

    // Simple function to close the modal
    const handleCloseModal = useCallback(() => {
        setEditingItem(null);
    }, []);

    // Delete button handler
    const handleDeleteBtn = useCallback((itemId) => {
        if (window.confirm(t('inventory.deleteConfirmMessage'))) {
            deleteInventoryItem(itemId)
                .then(() => {
                    toast.success(t('notifications.itemDeleted'));
                })
                .catch((error) => {
                    console.error('Error eliminando el producto:', error);
                    toast.error(t('notifications.deleteError'));
                });
        }
    }, [deleteInventoryItem, t]);

    // Fetch data on mount only
    useEffect(() => {
        getAllInventoryItems().catch(error => {
            console.error('Error fetching inventory:', error);
            toast.error(t('notifications.fetchError'));
        });
    }, []); 
    

    return (
        <RenderTracker componentName="ItemsList">
            <section>
                <div className="w-full col-span-12 flex flex-col items-center ">
                    <AddItemButton />

                    <h4 className="text-lg font-bold mt-8 mb-3">{t('inventory.title')}</h4>

                    <MealsTable
                        items={allInventoryItems || []}
                        loading={loading}
                        onDeleteBtn={handleDeleteBtn}
                        onEditBtn={handleEditBtn}
                    />            
                </div>

                {editingItem && (
                    <UpdateFormModal
                        itemToEdit={editingItem}
                        onClose={handleCloseModal}
                    />
                )}
            </section>
        </RenderTracker>
    );
};

export default ItemsList;
