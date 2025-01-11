import express from 'express';
import {
    registerUser,
    login,
    getAllUsers,
    getUserInfo,
    updateUser,
    deleteUser,
    updateInventory,
    triggerNotifications
} from '../controllers/userController.js';
import { validateRegisterUser, validateLogin } from '../validators/userValidator.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

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
router.get('/users-getAll', getAllUsers);

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
router.post('/users-getUserInfo/:id', authenticateUser, getUserInfo);

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
router.put('/users-update/:id', updateUser);

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
router.delete('/users-delete/:id', deleteUser);


/**
 * @swagger
 * /api/users/{id}/inventory:
 *   post:
 *     summary: Update a user's inventory
 *     description: Updates the inventory for a user identified by their unique ID.
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user whose inventory is to be updated.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *       - in: body
 *         name: inventory
 *         required: true
 *         description: The updated inventory data for the user.
 *         schema:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 type: string
 *               description: List of item names in the inventory.
 *               example: ["item1", "item2", "item3"]
 *             quantity:
 *               type: object
 *               additionalProperties:
 *                 type: integer
 *               description: Quantity of each item in the inventory.
 *               example: {"item1": 10, "item2": 5}
 *     responses:
 *       200:
 *         description: Successfully updated the user's inventory.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inventory updated successfully."
 *       400:
 *         description: Bad request. This response is returned if the input data is invalid or incomplete.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data."
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
router.post('/api/users/:id/inventory', updateInventory);

/**
 * @swagger
 * /api/users/{id}/notifications:
 *   get:
 *     summary: Trigger notifications for a user
 *     description: Retrieves and triggers notifications for a user, including notifications about expiring items and low stock levels.
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user for whom the notifications are being triggered.
 *         example: "61d2f8f5f4d4b1e0c3a5a789"
 *     responses:
 *       200:
 *         description: Successfully triggered notifications for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unseenNotifications:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of notifications the user has not seen yet.
 *                   example: 
 *                     - "The item 'Milk' is expiring in 3 day(s)."
 *                     - "The item 'Eggs' is running low on stock (only 2 left)."
 *       400:
 *         description: Bad request. This response is returned if the user ID is invalid or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid user ID."
 *       404:
 *         description: User not found. This response is returned if the user ID does not exist in the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error. This response is returned if something goes wrong on the server side.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later."
 */

router.get('/api/users/:id/notifications', triggerNotifications);

export default router;
