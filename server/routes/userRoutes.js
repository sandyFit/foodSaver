import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers,
    getUserInfo,
    updateProfile,
    deleteUser,
    deleteUserAdmin,
    requestPasswordReset,
    resetPassword,
} from '../controllers/userController.js';
import { validateRegisterUser, validateLogin } from '../validators/userValidator.js';
import { authenticateUser, authorize } from '../middleware/authMiddleware.js';

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
router.route('/users-register')
    .post(validateRegisterUser, registerUser);

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

router.route('/users-login')
    .post(validateLogin, loginUser);

/**
 * @swagger
 * /users-getProfile/{id}:
 *   get:
 *     summary: Retrieve user profile
 *     description: Fetches the profile details of a specific user by their unique ID. The user must be authenticated.
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user whose profile is being retrieved.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "61d2f8f5f4d4b1e0c3a5a789"
 *                 fullName:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@doe.com
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/users-getProfile/:id')
    .get(authenticateUser, getUserProfile);

/**
 * @swagger
 * /users-getAll:
 *   get:
 *     summary: Retrieve all users
 *     description: Fetches a list of all registered users in the system.
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: A list of users is returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier for the user.
 *                     example: "61d2f8f5f4d4b1e0c3a5a789"
 *                   fullName:
 *                     type: string
 *                     description: Full name of the user.
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     description: Email address of the user.
 *                     example: john@doe.com
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
// Get all users (Admin only)
router.route('/users-getAll')
    .get(authenticateUser, authorize('admin'), getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Fetches the details of a specific user by their unique ID.
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user to retrieve.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier for the user.
 *                   example: "61d2f8f5f4d4b1e0c3a5a789"
 *                 fullName:
 *                   type: string
 *                   description: Full name of the user.
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   description: Email address of the user.
 *                   example: john@doe.com
 *       404:
 *         description: User not found. This response is returned if the user ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
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
router.route('/users-getUserInfo/:id')
    .post(authenticateUser, authorize('admin'), getUserInfo);

/**
 * @swagger
 * /users-update/{id}:
 *   put:
 *     summary: Update user details
 *     description: Updates the details of an existing user by their unique ID.
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user to update.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Updated full name of the user.
 *                 example: John Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Updated email address of the user.
 *                 example: john.smith@doe.com
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully."
 *       400:
 *         description: Bad Request. This may occur if the input validation fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input format."
 *       404:
 *         description: User not found. This response is returned if the user ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
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
router.route('/users-updateProfile/:id')
    .put(authenticateUser, updateProfile);

/**
 * @swagger
 * /users-delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user from the system by their unique ID.
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user to delete.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     responses:
 *       204:
 *         description: User deleted successfully. No content is returned.
 *       404:
 *         description: User not found. This response is returned if the user ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
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

router.route('/users-delete/:id')
    .delete(authenticateUser, deleteUser);

/**
 * @swagger
 * /users-deleteAdmin/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     description: Deletes a user from the system by their unique ID. Only admins can perform this action.
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user to delete.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     responses:
 *       204:
 *         description: User deleted successfully. No content is returned.
 *       401:
 *         description: Unauthorized. Only admins can perform this action.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */

router.route('/users/admin/:id')
    .delete(authenticateUser, authorize('admin'), deleteUserAdmin);


/**
 * @swagger
 * /users-requestPasswordReset:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's registered email address.
 *                 example: john@doe.com
 *     responses:
 *       200:
 *         description: Password reset request successful. Check your email for reset instructions.
 *       400:
 *         description: Bad request. Invalid email format or missing email.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */

// Password reset request (no auth needed)
router.post('/forgot-password', requestPasswordReset);


/**
 * @swagger
 * /users-resetPassword:
 *   post:
 *     summary: Reset password
 *     description: Allows users to reset their password using a valid reset token.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token received via email.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password to set.
 *                 example: "NewSecurePass!123"
 *     responses:
 *       200:
 *         description: Password reset successful.
 *       400:
 *         description: Bad request. Invalid token or weak password.
 *       401:
 *         description: Unauthorized. Invalid or expired token.
 *       500:
 *         description: Internal Server Error.
 */

// Password reset execution (no auth needed)
router.put('/reset-password/:resetToken', resetPassword);



export default router;
