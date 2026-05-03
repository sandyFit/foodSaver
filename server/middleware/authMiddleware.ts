import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/users.js';
import User from '../models/users.js';
import jwt, { JwtPayload } from 'jsonwebtoken';

type Role = IUser['role'];
// Middleware para verificar autenticación
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Verificar si el token existe en las cookies
        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Debe iniciar sesión para continuar',
            });
        }

        // Verificar y decodificar el token
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

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

    } catch (error: any) {
        console.error('Error al autenticar usuario:', error.message);
        return res.status(401).json({
            message: 'Token inválido o expirado. Por favor inicie sesión nuevamente.',
        });
    }
};

// Middleware para verificar roles
export const authorizeRoles = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Ensure the role is available
            if (!req.user?.role) {
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
        } catch (error: any) {
            console.error('Error al autorizar roles:', error.message);
            return res.status(500).json({
                message: 'Error interno del servidor',
            });
        }
    };
};

export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - no user found'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden - Requires ${allowedRoles.join(' or ')} privileges`
            });
        }

        next();
    };
};

