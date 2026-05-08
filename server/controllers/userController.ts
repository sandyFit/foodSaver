import { Request, Response } from 'express';
import crypto from 'crypto';

import User from '../models/users.js';
import InventoryItem from '../models/inventory.js';
import Notification from '../models/notifications.js';

import { asyncHandler } from '../middleware/assyncHandler.js';

/**
 * =========================================================
 * Register User
 * =========================================================
 */

export const registerUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const { fullName, email, password } = req.body;

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
 * =========================================================
 * Login User
 * =========================================================
 */

export const loginUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const { email, password } = req.body;

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
 * =========================================================
 * Get User Profile
 * =========================================================
 */

export const getUserProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const user = await User.findById(req.user.id)
            .populate('inventory notifications')
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
 * =========================================================
 * Update Profile
 * =========================================================
 */

export const updateProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const updates = {
            fullName: req.body.fullName,
            email: req.body.email,
            avatar: req.body.avatar,
        };

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
 * =========================================================
 * Get All Users
 * =========================================================
 */

export const getAllUsers = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {

        const users = await User.find()
            .select('-password');

        res.status(200).json({
            success: true,
            data: users,
        });
    }
);

/**
 * =========================================================
 * Get User Info
 * =========================================================
 */

export const getUserInfo = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const { id } = req.params;

        if (
            req.user.role !== 'admin' &&
            id !== req.user.id
        ) {
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
 * =========================================================
 * Delete Current User
 * =========================================================
 */

export const deleteUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });

            return;
        }

        await InventoryItem.deleteMany({
            user: user._id,
        });

        await Notification.deleteMany({
            user: user._id,
        });

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully',
        });
    }
);

/**
 * =========================================================
 * Delete User Admin
 * =========================================================
 */

export const deleteUserAdmin = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        if (req.user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Unauthorized access',
            });

            return;
        }

        const user = await User.findByIdAndDelete(
            req.params.id
        );

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });

            return;
        }

        await InventoryItem.deleteMany({
            user: user._id,
        });

        await Notification.deleteMany({
            user: user._id,
        });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    }
);

/**
 * =========================================================
 * Request Password Reset
 * =========================================================
 */

export const requestPasswordReset = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

        const user = await User.findOne({
            email: req.body.email,
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });

            return;
        }

        const resetToken =
            user.getResetPasswordToken();

        await user.save({
            validateBeforeSave: false,
        });

        const resetURL =
            `${req.protocol}://${req.get('host')}` +
            `/reset-password/${resetToken}`;

        // await new Email(user, resetURL)
        //     .sendPasswordReset();

        if (process.env.NODE_ENV === 'development') {
            console.log(
                `Password reset token: ${resetToken}`
            );
        }

        res.status(200).json({
            success: true,
            message:
                'Password reset email sent successfully',
            data: {
                resetURL,
            },
        });
    }
);

/**
 * =========================================================
 * Reset Password
 * =========================================================
 */

export const resetPassword = asyncHandler(
    async (
        req: Request<{ token: string }>,
        res: Response
    ): Promise<void> => {

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {
                $gt: Date.now(),
            },
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Token is invalid or expired',
            });

            return;
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        const token = user.getJwtToken();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            data: {
                token,
            },
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
};
