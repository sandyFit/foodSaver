import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/users.js';
import User from '../models/users.js';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extend the Express Request to recognize the user property with the full IUser type
interface AuthRequest extends Request {
    user : IUser;
}

/**
 * Middleware: authenticateUser
 * Verifies the JWT from cookies or headers and attaches the user to the request.
 */
export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Must login to continue',
            });
        }

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({
                message: 'User not found, please login again'
            });
        }

        // Attach the full user object to the request
        req.user = user;
        next();

    } catch (error: any) {
        console.error('Error autheticating user:', error.message);
        return res.status(401).json({
            message: 'Invalid or expired token. Please login again',
        });
    }
};

/**
 * Middleware: authorize
 * Restricts access based on the user's role.
 * Use this AFTER authenticateUser.
 */
export const authorize = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
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
