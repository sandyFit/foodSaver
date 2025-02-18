import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const AddMealForm = React.memo(({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        itemName: '',
        expirationDate: '',
        category: '',
        quantity: 1,
    });

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, []);

    const handleSubmitData = useCallback(
        async (e) => {
            e.preventDefault();
            if (!formData.itemName || !formData.expirationDate || !formData.category) {
                toast.error('Todos los campos son obligatorios.');
                return;
            }
            try {
                await onSubmit(formData);
                setFormData({
                    itemName: '',
                    expirationDate: '',
                    category: '',
                    quantity: 1,
                });
            } catch (error) {
                console.error('Error agregando el producto:', error);
                toast.error('Error agregando el producto.');
            }
        },
        [formData, onSubmit]
    );

    return (
        <header className="w-[90%] col-span-12 flex flex-col justify-between border-b-2 border-stone-900">
            <h4 className="text-lg font-bold mb-2">Agrega tus Productos</h4>
            <form onSubmit={handleSubmitData} className="flex w-full justify-between mb-8">
                <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    placeholder="Ingrese el producto"
                    required
                />
                <input
                    type="date"
                    id="expirationDate"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    required
                />
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                >
                    <option disabled value="">
                        Seleccione la categoría
                    </option>
                    <option value="lacteos">Lácteos</option>
                    <option value="carnes">Carnes</option>
                    <option value="vegetales">Vegetales</option>
                    <option value="frutas">Frutas</option>
                    <option value="granos">Granos</option>
                    <option value="otros">Otros</option>
                </select>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    className="w-1/12"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                />
                <button
                    type="submit"
                    className="shadow-btn px-12 py-2 bg-purple-100 rounded-md"
                    disabled={loading}
                >
                    {loading ? 'Agregando...' : 'Agregar'}
                </button>
            </form>
        </header>
    );
});

export default AddMealForm;
