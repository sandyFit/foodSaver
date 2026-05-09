import { Response, NextFunction } from 'express';
import { Request, ParamsDictionary } from 'express-serve-static-core';
import { IUser } from '../models/users.js';
import User from '../models/users.js';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extend the Express Request to recognize the user property with the full IUser type
export interface AuthRequest<P = ParamsDictionary>
    extends Request<P> {
    user: IUser;
}

/**
 * Middleware: authenticateUser
 * Verifies the JWT from cookies or headers and attaches the user to the request.
 */
export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Must login to continue' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error: any) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

/**
 * Middleware: authorize
 * Restricts access based on the user's role.
 * Use this AFTER authenticateUser.
 */
export const authorize = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden - Requires ${allowedRoles.join(' or ')}`
            });
        }
        next();
    };
}



