import userService from '../services/userService.js';

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPass, avatar, role } = req.body;

        // El esquema Joi ya verifica si las contraseñas coinciden
        const { user, token } = await userService.registerUser({
            fullName,
            email,
            password,
            avatar,
            role,
        });

        res.status(201).json({
            message: 'Cuenta registrada correctamente',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        // console.error(error);

        if (error.message === 'El correo electrónico ya está registrado' || error.code === 11000) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        res.status(500).json({
            message: 'Error interno en el servidor',
            details: error.message || error,
        });
    }
};


export const login = async (req, res) => {
    try {
       const { email, password } = req.body;

        // console.log("Datos recibidos en login:", req.body);

        // Servicio se encarga de manejar validaciones y lógica
        const { user, token } = await userService.login({ email, password });

        res.status(200).json({
            message: 'Login Correcto',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        // console.error(error);

        if (error.message === 'Credenciales incorrectas') {
            return res.status(401).json({
                message: 'Credenciales incorrectas'
            });
        }

        res.status(500).json({
            message: 'Error interno en el servidor',
            details: error.message || error,
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);

    } catch (error) {
        res.status(400).json({
            error: 'Error al obtener la lista de usuarios',
            details: error.message
        })
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(id);
        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({
            error: 'Error al obtener el usuario',
            details: error.message
        });
    };
};

export const updateUser = async (req, res) => {
    const { id } = req.params; // Get the ID from the URL
    const updateData = req.body; // Get the data to update from the body

    try {
        console.log("Attempting to update user with ID:", id); // Log the ID to verify it's correct

        const updatedUser = await userService.updateUser(id, updateData);
        res.status(200).json({
            message: 'Usuario actualizado exitosamente',
            updatedUser
        });
    } catch (error) {
        res.status(400).json({
            error: 'Error al actualizar el usuario',
            details: error.message
        });
    }
};


export default {
    registerUser,
    login,
    getAllUsers,
    getUserById,
    updateUser
};
