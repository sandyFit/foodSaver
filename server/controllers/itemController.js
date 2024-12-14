import itemService from '../services/itemService.js';

// This layer handles HTTP requests

export const addFoodItem = async (req, res) => {
    try {
        const { itemName, quantity, imagePath, expirationDate, category } = req.body;

        // Validar que la categoría sea válida
        const validCategories = ['Refrigerados', 'Congelados', 'Alacena', 'Frescos'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Categoría inválida' });
        }

        const foodItem = await itemService.addFoodItem({
            itemName,
            quantity,
            imagePath,
            expirationDate,
            category
        });
        res.status(201).json({
            message: 'Alimento agregado exitosamente',
            foodItem
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al agregar el alimento',
            details: error.message
        });
    }
};


export const getAllFoodItems = async (req, res) => {
    try {
        const foodItems = await itemService.getAllFoodItems();
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(400).json({
            error: 'Error al obtener la lista de alimentos',
            details: error.message
        });
    }
};

export const getFoodItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const foodItem = await itemService.getFoodItemById(id);
        res.status(200).json(foodItem);
    } catch (error) {
        res.status(400).json({
            error: 'Error al obtener el alimento',
            details: error.message
        });
    }
};

export const updateFoodItem = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedFoodItem = await itemService.updateFoodItem(id, updateData);
        res.status(200).json({
            message: 'Alimento actualizado exitosamente',
            updatedFoodItem
        });
    } catch (error) {
        res.status(400).json({
            error: 'Error al actualizar el alimento',
            details: error.message
        });
    }
};

export const deleteFoodItem = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedFoodItem = await itemService.deleteFoodItem(id);

        if (!deletedFoodItem) {
            return res.status(404).json({
                error: 'El alimento no fue encontrado'
            });
        }

        res.status(204).send(); // Respuesta exitosa sin contenido
    } catch (error) {
        res.status(400).json({
            error: 'Error al eliminar el alimento',
            details: error.message
        });
    }
};

export const getExpiringItems = async (req, res) => {
    try {
        const expiringItems = await itemService.getExpiringItem();
        res.status(200).json(expiringItems);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener alimentos próximos a vencer',
            details: error.message
        });
    }
};

