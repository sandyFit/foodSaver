import User from '../models/users.js';
import jwt from 'jsonwebtoken';

// Middleware para verificar autenticación
export const authenticateUser = async (req, res, next) => {
    try {
        // Verificar si el token existe en las cookies
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                message: 'Debe iniciar sesión para continuar',
            });
        }

        // Verificar y decodificar el token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario en la base de datos
        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({
                message: 'Usuario no encontrado, por favor inicie sesión nuevamente'
            });
        }

        // Adjuntar el usuario a la solicitud
        req.user = user;

        next(); // Pasar al siguiente middleware o controlador

    } catch (error) {
        console.error('Error al autenticar usuario:', error.message);
        return res.status(401).json({
            message: 'Token inválido o expirado. Por favor inicie sesión nuevamente.',
        });
    }
};

// Middleware para verificar roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            // Ensure the role is available
            if (!req.user || !req.user.role) {
                return res.status(403).json({
                    message: 'Acceso no autorizado: rol no asignado',
                });
            }

            // Check if the user's role is authorized
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: 'Acceso no autorizado',
                });
            }

            next(); // Pass to the next middleware or controller
        } catch (error) {
            console.error('Error al autorizar roles:', error.message);
            return res.status(500).json({
                message: 'Error interno del servidor',
            });
        }
    };
};

