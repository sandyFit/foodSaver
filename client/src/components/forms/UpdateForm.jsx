import React, { useContext } from 'react';
import { ContextGlobal } from '../../utils/globalContext';
import { IoCloseCircleOutline } from "react-icons/io5";

const UpdateForm = ({ updatedData, onHandleUpdateChange, onHandleSubmitUpdate, onClose }) => {

    const {loading} = useContext(ContextGlobal);
    return (
        <section className="w-full ">
            <div className='flex flex-col justify-center border-t-2 border-stone-900 mt-6 relative'>
                <button
                    onClick={onClose}
                    className='absolute top-2 right-0'>
                    <IoCloseCircleOutline className='text-xl' />
                </button>
                
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
                    <button type="submit"
                        disabled={loading}
                        className="shadow-btn px-8 bg-purple-100">
                        {loading ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default UpdateForm;
