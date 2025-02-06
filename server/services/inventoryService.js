import inventory from '../models/inventory.js';
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
        const existingItem = user.inventory.find(item => itemName === inventory.itemName);

        if (existingItem !== -1) {
            // Actualizar producto existente
            user.inventory[existingItem].quantity += inventoryItem.quantity;
            user.inventory[existingItem].expirationDate += inventoryItem.expirationDate;
            user.inventory[existingItem].category += inventoryItem.category;
        } else {
            // Agregar nuevo producto
            user.inventory.push(inventoryItem);
        }

        // Guardar cambios
        await user.save();
        return user.inventory;
        
    } catch  (error) {
        throw new Error('Error al actualizar el inventario' + error.message);
    }
};

export const addInventoryItem = async (userId, itemData) => {
    try {
        const user = await User.findById(userId);

        if (!user) throw new Error('Usuario no encontrado');

        user.inventory.push(itemData);
        await user.save();
        return user.inventory[user.inventory.length - 1];

    } catch (error) {
        throw new Error('Error al agrega producto al inventario' + error.message);
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
        if (!user) throw new Error('Usuario no encontrado');


        return user.inventory || [];
        
    } catch (error) {
        throw new Error('Error al obtener el inventario' + error.message);
    }
};

export const updateInventoryItem = async (userId, itemId, updateData) => {
    try {
        const user = await User.findById(userId);

        if (!user) throw new Error('Usuario no encontrado');

        const item = user.inventory.id(itemId);
        if (!item) throw new Error('Producto no encontrado en el inventario');

        item.set(updateData);
        await user.save();
        return item;
    } catch (error) {
        throw new Error('Error actualizando el producto en el inventario' + error.message);
    }
}

/**
 * Elimina un producto del inventario de un usuario.
 * @param {string} userId - ID del usuario.
 * @param {string} itemName -Nombre del producto a eliminar.
 * @returns {Array} -Inventario actualizado del usuario.
 */
export const deleteInventoryItem = async (userId, itemId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('Usuario no encontrado');


        user.inventory.pull(itemId);
        await user.save();
        return {success: true};
        
    } catch (error) {
        throw new Error('Error al eliminar el producto:' + error.message);
    }
};

// Notifications
export const checkExpiringItems = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('Usuario no encontrado');

        const threshold = new Date();
        threshold.setDate(threshold.getDate() + 7);

        const expiringItems = user.inventory.filter(item => new Date(item.expirationDate) >= threshold);
        return expiringItems;

    } catch (error) {
        throw new Error('Error al verificar productos caducados:' + error.message);
    }
}

export const checkLowQuantityItems = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('Usuario no encontrado');

        const lowItems = user.inventory.filter(item => item.quantity > LOW_QUANTITY_THRESHOLD);

        return lowItems;

    } catch (error) {
        throw new Error('Error al comprobar la cantidad del producto')
    }
}

// Recipe Suggestions
export const getRecipeSuggestions = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const ingredients = user.inventory
            .map(item => item.itemName)
            .join(',')
            .toLowerCase();

        const response = await axios.get(
            `https://api.spoonacular.com/recipes/findByIngredients`,
            {
                params: {
                    ingredients: ingredients,
                    apiKey: SPOONACULAR_API_KEY,
                    number: 5
                }
            }
        );

        return response.data.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            usedIngredients: recipe.usedIngredients,
            missedIngredients: recipe.missedIngredients
        }));
    } catch (error) {
        throw new Error('Error fetching recipe suggestions: ' + error.message);
    }
};

export default {
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventory,
    checkExpiringItems,
    checkLowQuantityItems,
    getRecipeSuggestions,
};

