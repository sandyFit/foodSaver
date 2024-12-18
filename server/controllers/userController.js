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
        console.error(error);

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

        console.log("Datos recibidos en login:", req.body);

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
        console.error(error);

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

export default {
    registerUser,
    login,
};
