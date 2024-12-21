import React from 'react'

const UpdateUsersForm = ({ updatedData, onHandleUpdateChange, onHandleSubmitUpdate }) => {
    return (
        <section className="col-span-12 flex flex-col justify-between border-t-2 border-stone-900 mt-6">
            <h4 className="text-lg font-bold my-2">Edita tu Producto</h4>
            <form onSubmit={onHandleSubmitUpdate} className="flex w-full justify-between mb-6" >
                <input
                    type="text"
                    name="fullName"
                    value={updatedData.fullName}
                    onChange={onHandleUpdateChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={updatedData.email}
                    onChange={onHandleUpdateChange}
                    required
                />
                <div className="w-[14vw] flex justify-between">
                    <div className="flex gap-2">
                        <label htmlFor='userRole'>Usuario</label>
                        <input
                            type='radio'
                            id='userRole'
                            name='role'
                            value="user"
                            checked={updatedData.role === 'user'}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex gap-2">
                        <label htmlFor='adminRole'>Admin</label>
                        <input
                            type='radio'
                            id='adminRole'
                            name='role'
                            value="admin"
                            checked={updatedData.role === 'admin'}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <button type="submit" className="shadow-btn px-8 bg-purple-100">
                    Actualizar
                </button>
            </form>
        </section>
    );
};


export default UpdateUsersForm;
