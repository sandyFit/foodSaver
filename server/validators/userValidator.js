import Joi from 'joi';

// Register validation schema
const registerSchema = Joi.object({
    fullName: Joi.string().required().messages({
        'any.required': 'models.users.validation.fullNameRequired',
        'string.empty': 'models.users.validation.fullNameRequired'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'models.users.validation.emailRequired',
        'string.empty': 'models.users.validation.emailRequired',
        'string.email': 'models.users.validation.emailValid'
    }),
    password: Joi.string().min(6).required().messages({
        'any.required': 'models.users.validation.passwordRequired',
        'string.empty': 'models.users.validation.passwordRequired',
        'string.min': 'models.users.validation.passwordLength'
    }),
    confirmPass: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'validations.passwordMismatch',
        'any.required': 'validations.required',
        'string.empty': 'validations.required'
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
    email: Joi.string().email().required().messages({
        'any.required': 'models.users.validation.emailRequired',
        'string.empty': 'models.users.validation.emailRequired',
        'string.email': 'models.users.validation.emailValid'
    }),
    password: Joi.string().min(6).required().messages({
        'any.required': 'models.users.validation.passwordRequired',
        'string.empty': 'models.users.validation.passwordRequired',
        'string.min': 'models.users.validation.passwordLength'
    }),
});

export const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

