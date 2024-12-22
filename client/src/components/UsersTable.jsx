import React, { useContext, useState } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import toast from 'react-hot-toast';
import UpdateUsersForm from './UpdateUsersForm';

const UsersTable = ({ users, onDeleteUser }) => {

    const { allUsers, updateUser } = useContext(ContextGlobal);
    const usersToDisplay = users || allUsers;
    const [editingUser, setEditingUser] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        fullName: '',
        email: '',
        role: ''
    });

    const handleEditClick = (user) => {
        setEditingUser(user);
        setUpdatedData({
            fullName: user.fullName,
            email: user.email,
            role: user.role
        });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        if (!updatedData.fullName || !updatedData.email || !updatedData.role) {
            toast.error('Por favor, complete todos los campos');
            return;
        }

        if (editingUser) {
            updateUser(editingUser._id, updatedData); // Usar el updateUser del ContextGlobal
            setEditingUser(null); // Cierra el formulario de edición
        }
    };

    return (
        <article className="w-full flex flex-col justify-center items-center">
            <table border="1">
                <thead className="bg-blue-100">
                    <tr>
                        <th className="table-th">Nombre</th>
                        <th className="table-th">Correo Electrónico</th>
                        <th className="table-th">Rol</th>
                        <th className="table-th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usersToDisplay.length > 0 ? (
                        usersToDisplay.map((user) => (
                            <tr key={user._id || user.id}>
                                <td className="table-td">{user.fullName}</td>
                                <td className="table-td">{ user.email}</td>
                                <td className="table-td">{user.role}</td>
                                <td className="table-td space-x-2">
                                    <button
                                        aria-label
                                        onClick={() => handleEditClick(user)}
                                        className="table-btn bg-yellow-100 hover:bg-yellow-200 border-yellow-600 text-yellow-600"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        aria-label={`Delete ${user.itemName}`}
                                        onClick={() => onDeleteUser(user._id || user.id || user._idFallback)}
                                        className="table-btn bg-red-100 hover:bg-red-200 border-red-600 text-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="table-td text-center">
                                No hay usuarios registrados
                            </td>
                        </tr>
                    )} 
                </tbody>
            </table>

            {/* Formulario de edición */}
            {editingUser && (
                <UpdateUsersForm
                    updatedData={updatedData}
                    onHandleUpdateChange={handleUpdateChange}
                    onHandleSubmitUpdate={handleSubmitUpdate}
                />
            )}
        </article>
    )
}

export default UsersTable;
