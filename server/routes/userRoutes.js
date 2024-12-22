import express from 'express';
import {
    registerUser,
    login,
    getAllUsers,
    getUserById,
    updateUser
} from '../controllers/userController.js';
import { validateRegisterUser, validateLogin } from '../validators/userValidator.js';

const router = express.Router();

/**
 * @swagger
 * /register-user:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user by providing their first name, last name, email, and password.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: User's full name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *                 example: john@doe.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: aBd-5%_A
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration successful"
 *       400:
 *         description: Bad Request. This may occur if the input validation fails, such as missing email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid inputs format."
 *       500:
 *         description: Internal Server Error. This response is returned if something goes wrong on the server side.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later."
 */
router.post('/users-register', validateRegisterUser, registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Allows a user to log in by providing their email and password. If the credentials are valid, the user is authenticated and a success message is returned.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address associated with the user account.
 *                 example: john@doe.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password associated with the user account. The password must be at least 6 characters long.
 *                 example: aBd-5%_A
 *     responses:
 *       201:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated session, used for future requests.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *       400:
 *         description: Bad Request. This may occur if the input validation fails, such as missing email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password format."
 *       401:
 *         description: Unauthorized. This response is returned if the login credentials are incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password."
 *       500:
 *         description: Internal Server Error. This response is returned if something goes wrong on the server side.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later."
 */

router.post('/users-login', validateLogin, login);

router.get('/users-getAll', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users-update/:id', updateUser);


export default router;
