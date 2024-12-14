import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bycryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Ingrese nombre y apellido'],
        trim: true, 
        minlength: 3,
        maxlength: [80, "Maximum length of characters allowed is 80"]
    },
    email: {
        type: Email,
        required: [true, 'Ej: username@mail.com'],
        unique: true,
        validator: [validator.isEmail, 'Ingrese el correo electrónico']
        
    },
    password: {
        type: password,
        required: [true, 'Ingrese su contraseña'],
        minlength: [6, 'La contraseña debe contener al menos 6 caracteres'],
        select: false
    }, 
    comfirmPass: {
        type: password,
        required: true,
        minlength: 6
    },
    avatar: {
        public_id: {
            type: String,
            default: "https://i.ibb.co/4pDNDk1/avatar.png"
        },
        url: {
            type: String
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    // Token's expiration date
    resetPasswordToken: String,
    resetPasswordExpire: Date

}, { timestamps: true });


// Encrypt password before sending
userSchema.pre('save', async (next) => {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});

//Decoding passwords to compare them
userSchema.methods.comparePass = async (passData) => {
    return await bcrypt.compare(passData, this.password)
};

// Retorning a JWT token
userSchema.methods.getJwtToken = () => {
    return jwt.sign({
        id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    })
}

// Creating and exporting the model based on the schema
export default mongoose.model('FoodItem', foodItemSchema);
