import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
        toast.error('No autorizado. Por favor inicia sesión.');
        return <Navigate to="/login" replace />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default PrivateRoute;
