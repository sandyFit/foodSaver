import {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from 'express';

import Joi, {
    ObjectSchema,
    ValidationOptions,
} from 'joi';

/**
 * =========================================================
 * Shared Types
 * =========================================================
 */

export interface RegisterBody {
    fullName: string;
    email: string;
    password: string;
    confirmPass: string;
    role?: 'user' | 'admin';
}

export interface LoginBody {
    email: string;
    password: string;
}

/**
 * =========================================================
 * Joi Global Options
 * =========================================================
 */

const validationOptions: ValidationOptions = {
    abortEarly: false, // return all errors
    allowUnknown: false,
    stripUnknown: true,
    convert: true,
};

/**
 * =========================================================
 * Generic Validation Middleware
 * =========================================================
 */

type ValidationSource = 'body' | 'query' | 'params';

const validate =
    <T>(schema: ObjectSchema<T>, source: ValidationSource = 'body'): RequestHandler =>
        (req: Request, res: Response, next: NextFunction): void => {

            const data = req[source];

            const { error, value } = schema.validate(
                data,
                validationOptions
            );

            if (error) {
                res.status(400).json({
                    success: false,
                    errors: error.details.map((detail) => ({
                        field: detail.path.join('.'),
                        message: detail.message,
                    })),
                });

                return;
            }

            // overwrite sanitized data
            req[source] = value;

            next();
        };

/**
 * =========================================================
 * Register Schema
 * =========================================================
 */

const registerSchema = Joi.object<RegisterBody>({
    fullName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            'any.required':
                'models.users.validation.fullNameRequired',

            'string.empty':
                'models.users.validation.fullNameRequired',

            'string.min':
                'models.users.validation.fullNameMin',

            'string.max':
                'models.users.validation.fullNameMax',
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'any.required':
                'models.users.validation.emailRequired',

            'string.empty':
                'models.users.validation.emailRequired',

            'string.email':
                'models.users.validation.emailValid',
        }),

    password: Joi.string()
        .trim()
        .min(6)
        .max(128)
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
        )
        .required()
        .messages({
            'any.required':
                'models.users.validation.passwordRequired',

            'string.empty':
                'models.users.validation.passwordRequired',

            'string.min':
                'models.users.validation.passwordLength',

            'string.pattern.base':
                'models.users.validation.passwordWeak',
        }),

    confirmPass: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only':
                'validations.passwordMismatch',

            'any.required':
                'validations.required',
        }),

    role: Joi.string()
        .valid('user', 'admin')
        .default('user')
        .messages({
            'any.only':
                'models.users.validation.invalidRole',
        }),
});

/**
 * =========================================================
 * Login Schema
 * =========================================================
 */

const loginSchema = Joi.object<LoginBody>({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'any.required':
                'models.users.validation.emailRequired',

            'string.empty':
                'models.users.validation.emailRequired',

            'string.email':
                'models.users.validation.emailValid',
        }),

    password: Joi.string()
        .trim()
        .min(6)
        .required()
        .messages({
            'any.required':
                'models.users.validation.passwordRequired',

            'string.empty':
                'models.users.validation.passwordRequired',

            'string.min':
                'models.users.validation.passwordLength',
        }),
});

/**
 * =========================================================
 * Exported Middlewares
 * =========================================================
 */

export const validateRegisterUser =
    validate<RegisterBody>(registerSchema);

export const validateLogin =
    validate<LoginBody>(loginSchema);
