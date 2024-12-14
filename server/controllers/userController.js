import userService from '../services/userService.js';

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPass, avatar, role } = req.body; 

        console.log("Datos recibidos en registerUser:", req.body);

        // Verificar contraseñas coincidentes
        if (password.trim() !== confirmPass.trim()) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        const { user, token } = await userService.registerUser({
            fullName,
            email,
            password,
            avatar,
            role
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

        if (error.message === 'El correo electrónico ya está registrado') {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        if (error.code === 11000) {
            // Código de error de duplicación de MongoDB
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Para otros errores internos del servidor
        res.status(500).json({
            message: 'Error interno en el servidor',
            details: error.message || error,
        });
    }
};
