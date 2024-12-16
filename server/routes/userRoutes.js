import express from 'express';
import { registerUser } from '../controllers/userController.js';

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
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *                 example: Doe
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
router.post('/register-user', registerUser);

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

//router.post('/login', usersController.login);


export default router;
