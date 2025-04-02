import React, { useEffect, useCallback, useState } from 'react';
import { useInventory } from '../context/InventoryContext.jsx';
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
    const [deletingItemId, setDeletingItemId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
    const handleDeleteBtn = useCallback(async (itemId) => {
        if (window.confirm(t('inventory.deleteConfirmMessage'))) {
            try {
                setDeletingItemId(itemId);
                await deleteInventoryItem(itemId);
                toast.success(t('notifications.itemDeleted'));
                // No need to call getAllInventoryItems() here since deleteInventoryItem already updates the state
            } catch (error) {
                toast.error(error.message || t('notifications.deleteError'));
            } finally {
                setDeletingItemId(null);
            }
        }
    }, [deleteInventoryItem, t]);

    // Pagination functions
    const handlePageChange = (newPage, newItemsPerPage = itemsPerPage) => {
        setCurrentPage(newPage);
        if (newItemsPerPage !== itemsPerPage) {
            setItemsPerPage(newItemsPerPage);
        }
    };

    // Calculate paginated items (or do this in your API call)
    const paginatedItems = allInventoryItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                        items={paginatedItems || []}
                        loading={loading} // Initial table loading
                        deletingItemId={deletingItemId} // Pass the ID of the item being deleted
                        onDeleteBtn={handleDeleteBtn}
                        onEditBtn={handleEditBtn}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={allInventoryItems.length}
                        onPageChange={handlePageChange}
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
