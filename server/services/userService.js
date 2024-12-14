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
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKZwmqodcPdQUDRt6E5cPERZDWaqy6ITohlQ&usqp=CAU"
            },
            role, 
        });

        // Generar token JWT
        const token = user.getJwtToken();

        // Retornar el usuario y el token
        return { user, token };

    } catch (error) {
        console.error(error);
        throw error; // Propagar el error para que sea capturado por el controlador
    }
};


export default {
    registerUser
}
