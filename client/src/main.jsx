import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import ProtectedHome from './dashboard/ProtectedHome.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Landing from './pages/Landing.jsx';
import MealsList from './dashboard/MealsList.jsx';
import Recipes from './dashboard/Recipes.jsx';
import Dashboard from './dashboard/Layout.jsx';
import RecipeDetail from './dashboard/RecipeDetail.jsx';
import { Toaster } from 'react-hot-toast';
import { ContextProvider } from './utils/globalContext.jsx';
import { InventoryProvider } from './utils/inventoryContext.jsx';
import Users from './dashboard/Users.jsx';
import Loader from './components/ui/Loader.jsx';
import PrivateRoute from './dashboard/PrivateRoute.jsx';
import ListTest from './dashboard/ListTest.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ContextProvider>
        <InventoryProvider>
          <Toaster containerClassName='toast-container-custom' position="top-center" reverseOrder={false} />
          <Loader />
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas con auth */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }>
              <Route index element={<ProtectedHome />} />
              <Route path="meals-users" element={<ListTest />} />
              <Route path="recipes" element={<Recipes />} />
              <Route path="recipes/:id" element={<RecipeDetail />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Routes>
        </InventoryProvider>
      </ContextProvider>
    </Router>
  </StrictMode>
);
