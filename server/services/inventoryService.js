import Inventory from '../models/inventory.js';
import User from '../models/users.js';

/**
 * Agrega o actualiza un producto en el inventario de un usuario.
 * @param {string} userId - ID del usuario.
 * @param {Object} inventoryItem -Objeto con los datos del producto 
 *                                  (itemName, quantity, expirationDate, category, user)
 * @param {Array} - Inventario actualizado del usuario.
 */

export const updateInventory = async (userId, inventoryItem) => {
    try {
        // Buscar Usuario
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        };

        // Inicializar el inventario si no existe
        if (!user.inventory) {
            user.inventory = [];
        };

        // Buscar el producto en el inventario
        const existingItemIndex = user.inventory.findIndex(
            (item) => item.itemName.toLowerCase() === inventoryItem.itemName.toLowerCase()
        );

        if (existingItemIndex !== -1) {
            // Actualizar producto existente
            user.inventory[existingItemIndex].quantity += inventoryItem.quantity;
            user.inventory[existingItemIndex].expirationDate += inventoryItem.expirationDate;
            user.inventory[existingItemIndex].category += inventoryItem.category;
        } else {
            // Agregar nuevo producto
            user.inventory.push(inventoryItem);
        }

        // Guardar cambios
        await user.save();
        return user.inventory;
        
    } catch (error) {
        throw new Error('Error al actualizar el inventario' + error.message);
    }
};

/**
 * Obtiene el inventario de un usuario por su ID.
 * @param {string} userId -ID del usuario.
 * @param {Array} -Inventario del usuario.
 */

export const getInventory = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        };

        return user.inventory || [];
        
    } catch (error) {
        throw new Error('Error al obtener el inventario' + error.message);
    }
};

/**
 * Elimina un producto del inventario de un usuario.
 * @param {string} userId - ID del usuario.
 * @param {string} itemName -Nombre del producto a eliminar.
 * @returns {Array} -Inventario actualizado del usuario.
 */
export const deleteInventoryItem = async (userId, itemName) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        };

        // Filtrar producto a eliminar
        user.inventory = user.inventory.filter(
            item => item.itemName.toLowerCase() === itemName.toLowerCase()
        );

        await user.save();
        return user.inventory;
        
    } catch (error) {
        throw new Error('Error al eliminar el producto:' + error.message);
    }
};

export default {
    updateInventory,
    getInventory,
    deleteInventoryItem
};

