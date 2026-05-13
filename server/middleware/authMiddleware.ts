import { Response, NextFunction } from 'express';
import { Request, ParamsDictionary } from 'express-serve-static-core';
import { IUser } from '../models/users.js';
import User from '../models/users.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TFunction } from 'i18next';

// Extend the Express Request to recognize the user property with the full IUser type
export interface AuthRequest<P = ParamsDictionary>
    extends Request<P> {
    user: IUser;
    t: TFunction;
}

/**
 * Middleware: authenticateUser
 *
 * Verifies JWT authentication from:
 * - secure cookie token (preferred)
 * - Authorization: Bearer <token> header
 *
 * Attaches the authenticated user document to req.user.
 * Returns 401 if authentication fails.
 */
export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const cookieToken = req.cookies?.token;

        const authHeader = req.headers.authorization;

        const bearerToken =
            authHeader?.startsWith('Bearer ')
                ? authHeader.split(' ')[1]
                : null;

        const token = cookieToken ?? bearerToken;

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



