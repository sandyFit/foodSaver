import React from 'react'
import AdminHome from './AdminHome';
import Home from './Home';
import { useUser } from '../context/UserContext';

const ProtectedHome = () => {
    const { user } = useUser();
    
    return user?.role === 'admin' ? <AdminHome /> : <Home />
}

export default ProtectedHome;
