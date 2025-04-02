import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
// Import i18n config - this needs to be imported before any components that use translations
import './utils/i18n';

import ProtectedHome from './dashboard/ProtectedHome.jsx';
import Landing from './pages/Landing.jsx';
import Recipes from './dashboard/Recipes.jsx';
import Dashboard from './dashboard/Layout.jsx';
import RecipeDetail from './dashboard/RecipeDetail.jsx';
import { Toaster } from 'react-hot-toast';
import { InventoryProvider } from './context/InventoryContext.jsx';
import { RecipesProvider } from './context/RecipesContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import Users from './dashboard/Users.jsx';
import PrivateRoute from './dashboard/PrivateRoute.jsx';
import ItemsList from './dashboard/ItemsList.jsx';
import GlobalLoader from './context/GlobalLoader.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <UserProvider>
        <InventoryProvider>
          <RecipesProvider>
            <Toaster containerClassName='toast-container-custom' position="top-center" reverseOrder={false} />
            <GlobalLoader />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }>
                <Route index element={<ProtectedHome />} />
                <Route path="meals-users" element={<ItemsList />} />
                <Route path="recipes" element={<Recipes />} />
                <Route path="recipes/:id" element={<RecipeDetail />} />
                <Route path="users" element={<Users />} />
              </Route>
            </Routes>
          </RecipesProvider>
        </InventoryProvider>
      </UserProvider>
    </Router>
  </StrictMode>
);
