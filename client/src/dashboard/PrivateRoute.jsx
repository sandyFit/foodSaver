import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ContextGlobal } from '../utils/globalContext';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    useEffect(() => {
        if (!token || !storedUser) {
            navigate('/login');
        }
    }, [navigate]);

    return token && storedUser ? children : null;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default PrivateRoute;
