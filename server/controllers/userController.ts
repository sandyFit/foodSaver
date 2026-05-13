import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/users.js';
import InventoryItem from '../models/inventory.js';
import Notification from '../models/notifications.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

import { asyncHandler } from '../middleware/asyncHandler.js';

import logger from '../utils/logger.js';

// Email service
const sendSecurityEmail = async (email: string, type: string, data: any) => {
    // Implement with nodemailer, SendGrid, etc.
    logger.info(`[EMAIL] Sending ${type} email to ${email}`);
    // Not implemented yet
};

/**
 * Public Route
 * Registers a new user account.
 *
 * Does not require authentication.
 */
export const registerUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const { fullName, email, password } = req.body;

        // Basic Validations
        if (!fullName || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'Email already registered',
            });
            return;
        }

        const user = await User.create({
            fullName,
            email,
            password,
        });

        const token = user.getJwtToken();

        res.status(201).json({
            success: true,
            message: 'Account successfully registered',
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
);

/**
 *  Public Route
 *  Authenticates a user and returns a JWT token.
 * 
 *  Accessible without authenticateUser middleware.
 */
export const loginUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
            return;
        }

        const user = await User.findOne({ email })
            .select('+password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        }

        const isMatch = await user.comparePass(password);

        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        }

        const token = user.getJwtToken();

        // Opcional: Establecer cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
);

/**
 * Protected Route
 * Retrieves the currently authenticated user's profile.
 *
 * Requires authenticateUser middleware.
 */
export const getUserProfile = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {

        const user = await User.findById(req.user.id)
            .select('-password');

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    }
);

/**
 * Protected Route
 * Updates the currently authenticated user's profile.
 *
 * Requires authenticateUser middleware.
 */
export const updateProfile = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {

        const allowedUpdates = ['fullName', 'email', 'avatar'];
        const updates: any = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            res.status(400).json({
                success: false,
                message: 'No valid fields to update',
            });
            return;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        ).select('-password');

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    }
);

/**
 * Protected Admin Route
 * Returns a list of all users in the system.
 *
 * Requires authenticated admin privileges.
 */
export const getAllUsers = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {

        // Agregar paginación
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .select('-password')
                .skip(skip)
                .limit(limit)
                .sort('-createdAt'),
            User.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
);

/**
 * Protected Admin Route
 * Retrieves detailed information for a specific user.
 *
 * Requires authenticated admin privileges.
 */
export const getUserInfo = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {

        const { id } = req.params;

        if (req.user.role !== 'admin' && id !== req.user.id) {
            res.status(403).json({
                success: false,
                message: 'Unauthorized access',
            });
            return;
        }

        const user = await User.findById(id)
            .select('-password');

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    }
);

/**
 * Protected Route
 * Permanently deletes the authenticated user's account.
 *
 * Requires authenticateUser middleware.
 * Cascades deletion of user-related data (inventory, notifications).
 * Clears authentication cookie upon success.
 */
export const deleteUser = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {

        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        // Eliminar datos relacionados en paralelo
        await Promise.all([
            InventoryItem.deleteMany({ user: user._id }),
            Notification.deleteMany({ user: user._id })
        ]);

        // Clean cookie
        res.clearCookie('token');

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully',
        });
    }
);

/**
 * Protected Admin Route
 * Permanently deletes an admin account by ID.
 *
 * Requires authenticated admin privileges.
 *
 * Deletes the admin record only. Admins do not have associated inventory,
 * so no related data cleanup is required.
 */
export const deleteUserAdmin = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        await Promise.all([
            InventoryItem.deleteMany({ user: user._id }),
            Notification.deleteMany({ user: user._id })
        ]);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    }
);


/**
 * Public Route
 * Initiates the password reset process for a user account.
 *
 * Generates a password reset token and sends a reset link to the user's email.
 * The token is time-limited and must be used before expiration.
 *
 * Does not require authentication.
 */
export const requestPasswordReset = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {

        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Please provide an email address',
            });
            return;
        }

        const user = await User.findOne({ email });

        // Send same message always
        const genericMessage = 'If an account exists with this email, you will receive a password reset link';

        if (!user) {
            // Log non existant email request (without sensible info)
            logger.info({
                email: email.substring(0, 3) + '***', 
                ip: req.ip
            }, 'Password reset requested for non-existent email');

            res.status(200).json({
                success: true,
                message: genericMessage,
            });
            return;
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        logger.info({
            userId: user._id,
            email: user.email,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        }, 'Password reset token generated');

        // Send real email in Prod
        if (process.env.NODE_ENV === 'production') {
            // await sendPasswordResetEmail(user.email, resetURL);
            logger.info({ userId: user._id }, 'Password reset email would be sent');
        } else {
            // Log token only in devfor debugging
            logger.debug({
                resetToken,
                resetURL,
                userId: user._id
            }, 'Password reset details (development only)');
        }

        const responseData: any = {
            success: true,
            message: genericMessage,
        };

        if (process.env.NODE_ENV === 'development') {
            responseData.data = { resetURL, resetToken };
        }

        res.status(200).json(responseData);
    }
);

/**
 * Public Route
 * Completes the password reset process.
 *
 * Validates the password reset token and updates the user's password
 * if the token is valid and not expired.
 *
 * Does not require authentication.
 */
export const resetPassword = asyncHandler(
    async (req: AuthRequest<{ token: string }>, res: Response): Promise<void> => {

        // 1. Validate input
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'Please provide password and confirmation',
            });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
            return;
        }

        // 2. Validate password is complex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({
                success: false,
                message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character',
            });
            return;
        }

        // 3. Token hash
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // 4. Find user
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            // Log failed attempt
            logger.warn({
                token: req.params.token.substring(0, 8) + '...', // only the first 8 chars for segurity
                ip: req.ip,
                userAgent: req.headers['user-agent']
            }, 'Invalid or expired password reset attempt');

            res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token',
            });
            return;
        }

        // 5. Verify new password is NOT the old one
        const isSameAsOld = await user.comparePass(password);
        if (isSameAsOld) {
            logger.warn({
                userId: user._id,
                email: user.email,
                ip: req.ip
            }, 'User attempted to reuse old password');

            res.status(400).json({
                success: false,
                message: 'New password cannot be the same as your current password',
            });
            return;
        }

        // 6. Update Password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.passwordChangedAt = new Date();

        await user.save();

        // 7. Generate new token
        const token = user.getJwtToken();

        // 8. Log successful event 
        logger.info({
            userId: user._id,
            email: user.email,
            timestamp: new Date().toISOString(),
            ip: req.ip,
            userAgent: req.headers['user-agent']
        }, 'Password reset successful');

        // 9. Send email notification (optional)
        if (process.env.NODE_ENV === 'production') {
            await sendSecurityEmail(user.email, 'password_changed', {
                timestamp: new Date(),
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
        }

        // 10. Response
        const responseData: any = {
            success: true,
            message: 'Password updated successfully',
        };

        // Show token only in dev mode for debugging
        if (process.env.NODE_ENV === 'development') {
            responseData.data = { token };
            logger.debug({ userId: user._id }, 'Reset token included in response (development mode)');
        }

        res.status(200).json(responseData);
    }
);

/**
 * Protected Route
 * Updates the password for the currently authenticated user.
 *
 * Requires authenticateUser middleware.
 * Verifies the current password before allowing the change.
 */
export const changePassword = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {

        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            res.status(400).json({
                success: false,
                message: 'New passwords do not match',
            });
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            res.status(400).json({
                success: false,
                message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character',
            });
            return;
        }

        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        const isMatch = await user.comparePass(currentPassword);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
            return;
        }

        const isSameAsOld = await user.comparePass(newPassword);
        if (isSameAsOld) {
            res.status(400).json({
                success: false,
                message: 'New password cannot be the same as current password',
            });
            return;
        }

        user.password = newPassword;
        user.passwordChangedAt = new Date();
        await user.save();

        // Invalidate current token (optional - force relogin)
        res.status(200).json({
            success: true,
            message: 'Password changed successfully. Please login again.',
        });
    }
);

export default {
    registerUser,
    loginUser,
    getUserProfile,
    updateProfile,
    getAllUsers,
    getUserInfo,
    deleteUser,
    deleteUserAdmin,
    requestPasswordReset,
    resetPassword,
    changePassword,
};
