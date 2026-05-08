import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt, { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { boolean } from 'joi';
import logger from '../utils/logger.js';

/* -----------------------------
   Subtypes
----------------------------- */

export interface IAvatar {
    public_id: string;
    url: string;
}

export interface IInventoryItem {
    _id?: mongoose.Types.ObjectId;
    itemName: string;
    expirationDate: Date;
    quantity: number;
}

/* -----------------------------
   User Interface (Document)
----------------------------- */
export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    avatar: IAvatar;
    role: "user" | "admin";
    inventory: IInventoryItem[];
    notifications: mongoose.Types.ObjectId[];
    unseenNotifications: string[];
    createdAt: Date;
    registrationDate: Date;
    resetPasswordToken?: String,
    resetPasswordExpire?: Date,


    // Methods
    comparePass(passData: string): Promise<boolean>;
    addInventoryItem(item: IInventoryItem): Promise<IUser>;
    updateInventoryItem(itemId: string, updates: Partial<IInventoryItem>): Promise<IUser>;
    removeInventoryItem(itemId: string): Promise<IUser>;
    getJwtToken(): string;
    getResetPasswordToken(): string;
    notifyExpiringMeals(): Promise<IUser>;
    notifyLowInventory(): Promise<IUser>;
}



/* -----------------------------
   Schema
----------------------------- */    
const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: [true, 'models.users.validation.fullNameRequired'],
            trim: true,
            minlength: 3,
            maxlength: [80, 'models.users.validation.fullNameLength'],
        },
        email: {
            type: String,
            required: [true, 'models.users.validation.emailRequired'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'models.users.validation.emailValid'],
        },
        password: {
            type: String,
            required: [true, 'models.users.validation.passwordRequired'],
            minlength: [6, 'models.users.validation.passwordLength'],
            select: false, // Ensures password isn't returned by default
        },

        avatar: {
            public_id: {
                type: String,
                default: "default_avatar",
            },
            url: {
                type: String,
                default: "/avatar.png",
            },
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        inventory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InventoryItem'
        }],

        notifications: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification'
        }],

        unseenNotifications: {
            type: [String],
            dafault: []
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        registrationDate: {
            type: Date,
            default: Date.now,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },

    { timestamps: true }
);

/* -----------------------------
   Middleware — Encrypt password before saving
----------------------------- */
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/* -----------------------------
   Methods
----------------------------- */
// Compare passwords
userSchema.methods.comparePass = async function (
    this: IUser,
    passData: string,
): Promise<boolean> {
    return await bcrypt.compare(passData, this.password);
};

logger.info(`JWT_EXPIRE_TIME: ${process.env.JWT_EXPIRE_TIME}`);

// In User.js
userSchema.methods.addInventoryItem = function (item: IInventoryItem) {
    this.inventory.push(item);
    return this.save();
};

userSchema.methods.updateInventoryItem = function (
    itemId: string,
    updates: Partial<IInventoryItem>
) {
    const item = this.inventory.id(itemId as any);
    if (!item) throw new Error('Item not found');
    item.set(updates);
    return this.save();
};

userSchema.methods.removeInventoryItem = function (itemId: string) {
    this.inventory.pull(itemId);
    return this.save();
};

// Return a JWT token
userSchema.methods.getJwtToken = function (this: IUser) {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET as string,
        { expiresIn: (process.env.JWT_EXPIRE_TIME || '1d') as jwt.SignOptions['expiresIn'] }
    );
};

// Generate a reset password token
userSchema.methods.getResetPasswordToken = function (this: IUser) {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // Token lasts 30 minutes
    return resetToken;
};

userSchema.methods.notifyExpiringMeals = function (this: IUser) {
    const expiringMeals = this.inventory.filter((item: IInventoryItem) => {
        const daysToExpire = Math.ceil(
            (item.expirationDate.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        );
        return daysToExpire > 0 && daysToExpire <= 8;
    });

    expiringMeals.forEach((meal: IInventoryItem) => {
        const days = Math.ceil(
            (meal.expirationDate.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        );
        this.unseenNotifications.push(
            `The item "${meal.itemName}" is expiring in ${days} day(s).`
        );
    });

    return this.save();
};

userSchema.methods.notifyLowInventory = function (this: IUser) {
    const lowStockItems = this.inventory.filter((item: IInventoryItem) => item.quantity <= 2);

    lowStockItems.forEach((item: IInventoryItem) => {
        this.unseenNotifications.push(
            `The item "${item.itemName}" is running low on stock (only ${item.quantity} left).`
        );
    });

    return this.save();
};



/* -----------------------------
   Model Export
----------------------------- */

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
