import React from 'react';
import { InventoryProvider } from './utils/inventoryContext';
import ListTest from './dashboard/ListTest';

// Add render tracking for the main app
let renderCount = 0;

function App() {
    // Track renders for debugging
    renderCount++;
    if (renderCount % 10 === 0) {
        console.log('🔄 App render count:', renderCount);
    }

    return (
        <InventoryProvider>
            <div className="app">
                <header className="bg-blue-600 p-4 text-white">
                    <h1 className="text-xl font-bold">Food Saver App</h1>
                </header>
                <main className="p-4">
                    <ListTest />
                </main>
            </div>
        </InventoryProvider>
    );
}

export default App;
