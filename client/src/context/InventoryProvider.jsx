import { createContext, useContext, useMemo } from 'react';
import createResourceContext from '../hooks/CreateResourceContext';

const initialState = {
    items: [],
    loading: false,
    error: null
};

// Create the inventory context
const InventoryContext = createContext(undefined);

// Get the base provider and hook
const { ResourceProvider, useResource } = createResourceContext('inventory', initialState);

// Create a single provider that combines both contexts
export const InventoryProvider = ({ children }) => {
    // Get the base context value directly from the hook
    const baseContext = useResource();

    // Memoize the inventory-specific context value
    const inventoryContext = useMemo(() => ({
        loading: baseContext.loading,
        error: baseContext.error,
        allInventoryItems: baseContext.items,
        getAllInventoryItems: baseContext.getAll,
        createInventoryItem: baseContext.create,
        updateInventoryItem: baseContext.update,
        deleteInventoryItem: baseContext.remove
    }), [baseContext]);

    return (
        <ResourceProvider>
            <InventoryContext.Provider value={inventoryContext}>
                {children}
            </InventoryContext.Provider>
        </ResourceProvider>
    );
};

// Export the specialized hook
export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};
