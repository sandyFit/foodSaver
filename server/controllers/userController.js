import User from '../models/User.js';
import InventoryItem from '../models/InventoryItem.js';
import Notification from '../models/Notification.js';
import crypto from 'crypto';

export const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }

        const user = await User.create({ fullName, email, password });
        const token = user.getJwtToken();

        res.status(201).json({
            success: true,
            message: 'Cuenta registrada correctamente',
            token: token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error interno en el servidor',
            details: error.message || error,
        });
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        };      

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        const token = user.getJwtToken();

        // Configurar la cookiee con el token
        res.cookie("token", token, {
            httpOnly: true, // Solo accesible por el servidor
            secure: process.env.NODE_ENV === "production", // HTTPS en producción
            sameSite: "strict", // Refuerza seguridad en navegadores modernos
        });

        res.json({
            success: true,
            message: 'Login Correcto',
            token: token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error interno en el servidor',
            details: error.message || error,
        });
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('inventory notifications')
            .select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error interno en el servidor',
            details: error.message || error,
        });
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const updates = {
            fullName: req.body.fullName,
            email: req.body.email,
            avatar: req.body.avatar
        };

        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true
        }).select('-password');

        res.json({
            success: true,
            user
        });

    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {
        res.status(400).json({
            error: 'Error al obtener la lista de usuarios',
            details: error.message
        })
    }
};

export const getUserInfo = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
    try {
        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({
                error: 'El usuario no se encuentra en la basse de datos',
            });
        }
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: 'Error interno en el servidor',
            details: error.message || error,
        });
    };
};


export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);

        // Cleanup related data
        await InventoryItem.deleteMany({ user: user._id });
        await Notification.deleteMany({ user: user._id });

        res.json({
            success: true,
            message: 'Cuenta eliminada'
        });
    } catch (error) {
        next(error);
    }
};

// Delete user Admin
export const deleteUserAdmin = async (req, res) => {
    // Example check in getUserInfo
    if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Cleanup related data
        await InventoryItem.deleteMany({ user: user._id });
        await Notification.deleteMany({ user: user._id });

        res.json({
            success: true,
            message: 'Cuenta eliminada por el admin'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error interno en el servidor',
            details: error.message
        });
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Send email with reset URL
        const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();

        console.log(`Password reset token: ${resetToken}`);

        res.json({
            success: true,
            message: 'Hemos reestablecido tu contraseña. Revisa tu correo electrónico para crear una nueva.'
        });
    } catch (error) {
        next(error);
    }
};
 

export const resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'El token no es válido o ha expirado'
            });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        const token = user.getJwtToken();

        res.json({
            success: true,
            token,
            message: 'Tu contraseña se ha actualizado correctamente. ¡Ya puedes acceder a tu cuenta!'
        });
    } catch (error) {
        next(error);
    }
};

export default {
    registerUser,
    loginUser,
    getUserProfile,
    updateProfile,
    getAllUsers,
    getUserInfo,
    deleteUser,
    requestPasswordReset,
    resetPassword,

};

