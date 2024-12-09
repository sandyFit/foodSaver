import itemService from '../services/itemService.js';

// This layer handles HTTP requests

export const addFoodItem = async (req, res) => {
    try {
        const { itemName, quantity, imagePath, expirationDate } = req.body;
        const foodItem = await itemService.addFoodItem({ itemName, quantity, imagePath, expirationDate });
        res.status(201).json({
            message: 'Alimento agregado exitosamente',
            foodItem
        });
    } catch (error) {
        if (error instanceof SomeServerErrorType) {
            return res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }

        res.status(400).json({
            error: 'Error al agregar el alimento',
            details: error.message
        })
    }
};

export const getAllFoodItems = async (req, res) => {
    try {
        const foodItems = await itemService.getAllFoodItems();
        res.status(200).json(foodItems);
    } catch (error) {
        if (error instanceof SomeServerErrorType) {
            return res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }
        res.status(400).json({
            error: 'Error al obtener la lista de alimentos',
            details: error.message
        })
    }
};

export const getFoodItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const foodItem = await itemService.getFoodItemById(id);
        res.status(200).json(foodItem);
    } catch (error) {
        if (error instanceof SomeServerErrorType) {
            return res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }
        res.status(400).json({
            error: 'Error al obtener el alimento',
            details: error.message
        })
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
        if (error instanceof SomeServerErrorType) {
            return res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }
        res.status(400).json({
            error: 'Error al actualizar el alimento',
            details: error.message
        })
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

        // Código 204: Respuesta exitosa sin contenido poorque ya se eliminó
        res.status(204).send(); // No se debe incluir un cuerpo en 204
    } catch (error) {
        // Si el error es del servidor
        if (error instanceof SomeServerErrorType) {
            return res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }
        res.status(400).json({
            error: 'Error al eliminar el alimento',
            details: error.message
        });
    }
};

