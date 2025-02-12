import FoodItem from '../models/foodItem.js';


// This layer encapsulates the logic for interacting with the MongoDB database

export const addFoodItem = async ({ itemName, quantity, imagePath, expirationDate, category }) => {
    try {
        // Create a new instance of the FoodItem model
        const foodItem = new FoodItem({
            itemName,
            quantity,
            imagePath,
            expirationDate,
            category
        });

        // Save the new food item to the database
        await foodItem.save();
        console.log('Saved Food Item:', foodItem);

        return foodItem; // Return the saved food item
    } catch (error) {
        throw new Error('Error adding food item: ' + error.message); // Throw error if something goes wrong
    }
};


export const getAllFoodItems = async () => {
    try {
        return await FoodItem.find(); 
    } catch (error) {
        throw new Error('Error fetching food items: ' + error.message);
    }
};


export const getFoodItemById = async (id) => {
    try {
        const foodItem = await FoodItem.findById(id); 
        if (!foodItem) {
            throw new Error('Food item not found', 404);
        }
        return foodItem;
    } catch (error) {
        throw new Error('Error fetching food item: ' + error.message);
    }
};


const updateFoodItem = async (id, updateData) => {
    try {
        const updatedFoodItem = await FoodItem.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true } // Devuelve el objeto actualizado
        );
        if (!updatedFoodItem) {
            throw new Error('Producto no encontrado', 404);
        }
        return updatedFoodItem;
    } catch (error) {
        throw new Error('Error al actualizar el producto: ' + error.message);
    }
};


export const deleteFoodItem = async (id) => {
    try {
        const foodItem = await FoodItem.findByIdAndDelete(id); 
        if (!foodItem) {
            throw new Error('Food item not found');
        }
        return foodItem;
    } catch (error) {
        throw new Error('Error deleting food item: ' + error.message);
    }
};

export const getExpiringItem = async () => {
    try {
        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 8); // Próximos 8 días

        // Buscar alimentos con fecha de vencimiento en el rango
        const expiringItems = await FoodItem.find({
            expirationDate: { $lte: threshold }
        });

        return expiringItems; // Devuelve los elementos encontrados
    } catch (error) {
        throw new Error('Error fetching expiring food items: ' + error.message);
    }
};


export default {
    addFoodItem,
    getAllFoodItems,
    getFoodItemById,
    updateFoodItem,
    deleteFoodItem,
    getExpiringItem

};
