import User from '../models/users.js';

export const registerUser = async ({ fullName, email, password, avatar, role = 'user' }) => {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado');
        }

        // Crear un nuevo usuario
        const user = await User.create({
            fullName,
            email,
            password,
            avatar: avatar || {
                public_id: "default_avatar",
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKZwmqodcPdQUDRt6E5cPERZDWaqy6ITohlQ&usqp=CAU",
            },
            role,
        });

        // Generar token JWT
        const token = user.getJwtToken();

        // Retornar el usuario y el token
        return { user, token };
    } catch (error) {
        console.error(error.message);
        throw new Error(error.message); // Propagar el error con mensaje limpio
    }
};

export const login = async ({ email, password }) => {
    try {
        // Buscar usuario por correo
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new Error("Credenciales incorrectas");
        }

        // Comparar contraseñas
        const passwordOK = await user.comparePass(password);
        if (!passwordOK) {
            throw new Error("La contraseña no es correcta");
        }

        // Generar token JWT
        const token = user.getJwtToken();

        // Retornar usuario y token
        return { user, token };
    } catch (error) {
        console.error(error.message);
        throw new Error(error.message); // Propagar el error con mensaje limpio
    }
};

export default {
    registerUser,
    login,
};
