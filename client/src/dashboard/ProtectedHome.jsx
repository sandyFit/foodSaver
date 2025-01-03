import React, { useContext } from 'react'
import { ContextGlobal } from '../utils/globalContext'
import AdminHome from './AdminHome';
import Home from './Home';

const ProtectedHome = () => {
    const { user } = useContext(ContextGlobal);
    
    return user?.role === 'admin' ? <AdminHome /> : <Home />
}

export default ProtectedHome;
