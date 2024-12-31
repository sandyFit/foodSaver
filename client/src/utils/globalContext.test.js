import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContextProvider, initialState } from './globalContext';
import { ContextGlobal } from './globalContext';

// TestComponent: Es un componente que usa useContext para acceder al estado del ContextGlobal. 
// Esto nos permite verificar los valores en el estado inicial.
const TestComponent = () => { 
    const { allFoodItems,
        allUsers,
        loading,
        error } = React.useContext(ContextGlobal);
    return (
        <div>
            <div data-testid='food-items'>{allFoodItems.length}</div>
            <div data-testid='users'>{allUsers.length}</div>
            <div data-testid='loading'>{loading ? 'true' : 'false'}</div>
            <div data-testid='error'>{error}</div>
        </div>
    );
};

test('basic test', () => {
    expect(true).toBe(true);
});

test('should render ContextProvider without errors', () => {
    render(<ContextProvider><TestComponent /></ContextProvider>);
    // Try accessing elements here to see if the context provider is working
    expect(screen.getByTestId('food-items')).toBeTruthy();
});

describe('ContextProvider', () => { 
    test('should have the correct initial state', () => { 
        render(
            <ContextProvider>
                <TestComponent />
            </ContextProvider>
        );
        expect(screen.getByTestId('food-items').textContent).toBe(initialState.allFoodItems.length.toString());
        expect(screen.getByTestId('users').textContent).toBe(initialState.allUsers.length.toString());
        expect(screen.getByTestId('loading').textContent).toBe(initialState.loading.toString());
        expect(screen.getByTestId('error').textContent).toBe(initialState.error);
    });
});
