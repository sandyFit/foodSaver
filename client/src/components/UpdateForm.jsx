import React from 'react';


const UpdateForm = ({ updatedData, onHandleUpdateChange, onHandleSubmitUpdate }) => {
    return (
        <section className="col-span-12 flex flex-col justify-between border-t-2 border-stone-900 mt-6">
            <h4 className="text-lg font-bold my-2">Edita tu Producto</h4>
            <form onSubmit={onHandleSubmitUpdate} className="flex w-full justify-between mb-6" >
                <input
                    type="text"
                    name="itemName"
                    value={updatedData.itemName}
                    onChange={onHandleUpdateChange}
                    required
                />
                <input
                    type="date"
                    name="expirationDate"
                    value={updatedData.expirationDate}
                    onChange={onHandleUpdateChange}
                    required
                />
                <select
                    name="category"
                    value={updatedData.category}
                    onChange={onHandleUpdateChange}
                    required
                >
                    <option value="Refrigerados">Refrigerados</option>
                    <option value="Congelados">Congelados</option>
                    <option value="Frescos">Frescos</option>
                    <option value="Alacena">Alacena</option>
                </select>
                <input
                    type="number"
                    name="quantity"
                    className='w-1/12'
                    value={updatedData.quantity}
                    onChange={onHandleUpdateChange}
                    min="1"
                    required
                />
                <button type="submit" className="shadow-btn px-8 bg-purple-100">
                    Actualizar
                </button>
            </form>
        </section>
    );
};

export default UpdateForm;
