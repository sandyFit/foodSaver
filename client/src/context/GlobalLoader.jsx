import React from 'react';
import LoaderComponent from './LoaderComponent';
import { useInventory } from './InventoryContext';
import { useRecipes } from './RecipesContext';
import { useUser } from './UserContext';

const GlobalLoader = () => {
    // Access loading states from all contexts
    const { loading: inventoryLoading } = useInventory();
    const { loading: recipesLoading } = useRecipes();
    const { loading: userLoading } = useUser();

    // Show loader if any context is in loading state
    const isLoading = inventoryLoading ||  userLoading || recipesLoading;

    return <LoaderComponent isLoading={isLoading} />;
};

export default GlobalLoader;
