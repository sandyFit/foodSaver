import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import logger from '../utils/logger.js';

/* -----------------------------
   Subtypes
----------------------------- */

export interface IAvatar {
    public_id: string;
    url: string;
}


/* -----------------------------
   User Interface (Document)
----------------------------- */
export interface IUser extends Document {
    id: string;
    fullName: string;
    email: string;
    password: string;
    avatar: IAvatar;
    role: 'user' | 'admin';

    inventory: mongoose.Types.ObjectId[];
    notifications: mongoose.Types.ObjectId[];
    unseenNotifications: string[];

    createdAt: Date;
    registrationDate: Date;

    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    passwordChangedAt: Date;

    comparePass(passData: string): Promise<boolean>;
    getJwtToken(): string;
    getResetPasswordToken(): string;
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
            default: []
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
        passwordChangedAt: Date,
    },

    { timestamps: true }
);

/* -----------------------------
   Middleware — Encrypt password before saving
----------------------------- */
userSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});
/* -----------------------------
   Methods
----------------------------- */
// Agregar virtual id
userSchema.virtual('id').get(function (this: IUser) {
    return this._id.toString();
});

// Configurar para incluir virtuals en JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Compare passwords
userSchema.methods.comparePass = async function (
    this: IUser,
    passData: string,
): Promise<boolean> {
    return await bcrypt.compare(passData, this.password);
};

logger.debug(`JWT_EXPIRE_TIME: ${process.env.JWT_EXPIRE_TIME}`);


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

/* -----------------------------
   Model Export
----------------------------- */

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
