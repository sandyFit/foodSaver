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
                url: "/avatar.png",
            },
            role,
        });

        // Generar token JWT
        const token = user.getJwtToken();

        // Retornar el usuario y el token
        return { user, token };
    } catch (error) {
        // console.error(error.message);
        throw new Error(error.message); // Propagar el error con mensaje limpio
    }
};

export const login = async ({ email, password }) => {
    try {
        // Buscar usuario por correo
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.comparePass(password))) {
            throw new Error("Credenciales incorrectas");
        }


        // Generar token JWT
        const token = user.getJwtToken();

        // Retornar usuario y token
        return { user, token };
    } catch (error) {
        // console.error(error.message);
        throw new Error(error.message); // Propagar el error con mensaje limpio
    }
};

export const getAllUsers = async () => {
    try {
        return await User.find();
    } catch (error) {
        throw new Error('Error obteniendo la lista de usuarios: ' + error.message);
    }
};

export const getUserInfo = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('El usuario no se encuentra en la basse de datos');
        }
        return user;

    } catch (error) {
        throw new Error('Error obteniendo el usuario: ' + error.message);
    }
}

export const updateUser = async (id, updateData) => {
    try {
        console.log("Attempting to update user with ID:", id); // Log the ID being used
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true }
        );
        console.log(updatedUser);
        if (!updatedUser) {
            throw new Error('Usuario no encontrado');
        }
        return updatedUser;
    } catch (error) {
        throw new Error('Error al actualizar el usuario: ' + error.message);
    }
};

export const deleteUser = async (id) => {
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    } catch (error) {
        throw new Error('Error eliminando el usuario' + error.message);
    }
    
};

export const updateInventory = async (userId, inventoryItem) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Find the item in inventory
        const existingItem = user.inventory.find((item) => item.itemName === inventoryItem.itemName);

        if (existingItem) {
            // Update existing item
            existingItem.quantity = inventoryItem.quantity;
            existingItem.expirationDate = inventoryItem.expirationDate;
        } else {
            // Add new item
            user.inventory.push(inventoryItem);
        }

        await user.save();
        return user;
    } catch (error) {
        throw new Error('Error updating inventory: ' + error.message);
    }
};

export const triggerNotifications = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Generate notifications
        await user.notifyExpiringMeals();
        await user.notifyLowInventory();

        return user.unseenNotifications;
    } catch (error) {
        throw new Error('Error triggering notifications: ' + error.message);
    }
};


export default {
    registerUser,
    login,
    getAllUsers,
    getUserInfo,
    updateUser,
    deleteUser,
    updateInventory,
    triggerNotifications
};
