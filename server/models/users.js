import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs'; // Fixed typo
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Ingrese nombre y apellido'],
            trim: true,
            minlength: 3,
            maxlength: [80, 'Maximum length of characters allowed is 80'],
        },
        email: {
            type: String,
            required: [true, 'Ej: username@mail.com'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Ingrese un correo electrónico válido'], 
        },
        password: {
            type: String,
            required: [true, 'Ingrese su contraseña'],
            minlength: [6, 'La contraseña debe contener al menos 6 caracteres'],
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

        inventory: [inventoryItemSchema],
        notifications: [notificationSchema],
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

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords
userSchema.methods.comparePass = async function (passData) {
    return await bcrypt.compare(passData, this.password);
};

console.log('JWT_EXPIRE_TIME:', process.env.JWT_EXPIRE_TIME);

// Return a JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE_TIME || '1d' }
    );
};

// Generate a reset password token
userSchema.methods.genResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Token lasts 30 minutes
    return resetToken;
};

userSchema.methods.notifyExpiringMeals = function () {
    const expiringMeals = this.inventory.filter((item) => {
        const daysToExpire = Math.ceil((item.expirationDate - Date.now()) / (1000 * 60 * 60 * 24));
        return daysToExpire > 0 && daysToExpire <= 8; 
    });

    expiringMeals.forEach((meal) => {
        this.unseenNotifications.push(`The item "${meal.itemName}" is expiring in ${Math.ceil((meal.expirationDate - Date.now()) / (1000 * 60 * 60 * 24))} day(s).`);
    });

    return this.save();
};

userSchema.methods.notifyLowInventory = function () {
    const lowStockItems = this.inventory.filter((item) => item.quantity <= 2); // Notify when quantity <= 2

    lowStockItems.forEach((item) => {
        this.unseenNotifications.push(`The item "${item.itemName}" is running low on stock (only ${item.quantity} left).`);
    });

    return this.save();
};


// Create and export the User model
export default mongoose.model('User', userSchema);
