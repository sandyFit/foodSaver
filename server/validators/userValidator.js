import Joi from 'joi';

// Register validation schema
const registerSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPass: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Las contraseñas no coinciden',
    }),
    role: Joi.string().default('user'),
});

// Register validation middleware
export const validateRegisterUser = (req, res, next) => {
    console.log("Request body:", req.body);
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

// Login validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

