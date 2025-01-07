import React, { useContext, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { ContextGlobal } from '../utils/globalContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPass: '',
        role: 'user'
    });

    const { registerUser, loading } = useContext(ContextGlobal);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que las contraseñas coinciden
        if (formData.password !== formData.confirmPass) {
            toast.error("Las contraseñas no coinciden. Intenta nuevamente.");
            return;
        }

        // Validar la longitud de la contraseña
        if (formData.password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            await registerUser(formData);
            // console.log('Usuario registrado:', formData);
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPass: '',
                role: 'user'
            });
            navigate('/login');
        } catch (error) {
            // console.error('Error registrando el usuario:', error);
            toast.error('Error registrando el usuario. Por favor, intenta nuevamente.');
        }
    };

    return (
        <section className='w-full min-h-screen bg-tahiti-700'>
            <Navbar />
            <main className="flex flex-col pt-48 justify-center items-center gap-12">
                <h2 className='text-blue-200'>
                    ¡Únete y Aprende a Ahorrar Mientras Cuidas el Planeta!
                </h2>
                <form onSubmit={handleSubmit} className="w-[42%] flex flex-col gap-6">                  
                    <input
                        type="text"
                        name='fullName'
                        id='fullName'
                        placeholder='Tu nombre completo'
                        autoComplete="fullName"
                        className='shadow-none'
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="email"
                        name='email'
                        id='email'
                        placeholder='Tu correo electrónico'
                        autoComplete="email"
                        className='shadow-none'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />

                    <div className="flex w-full justify-between">

                        <input
                            type="password"
                            name='password'
                            id='password'
                            placeholder='Tu contraseña'
                            className='w-[20vw] shadow-none'
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />

                        <input
                            type="password"
                            name='confirmPass'
                            id='confirmPassword'
                            placeholder='Confirma tu contraseña'
                            className='w-[20vw] shadow-none'
                            autoComplete="new-password"
                            value={formData.confirmPass}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="w-full flex justify-between">
                        <div className="w-[14vw] flex justify-between">
                            <div className="flex gap-2">
                                <label
                                    htmlFor='userRole'
                                    className='text-white'
                                >
                                    Usuario
                                </label>
                                <input
                                    type='radio'
                                    id='userRole'
                                    name='role'
                                    className='shadow-none bg-blue-200'
                                    value="user"
                                    checked={formData.role === 'user'}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex gap-2">
                                <label
                                    htmlFor='adminRole'
                                    className='text-white'
                                >
                                    Admin
                                </label>
                                <input
                                    type='radio'
                                    id='adminRole'
                                    name='role'
                                    className='shadow-none bg-blue-200'
                                    value="admin"
                                    checked={formData.role === 'admin'}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <p className='w-full text-right text-white'>
                            Ya tienes una cuenta?
                            <a href="/login" className='underline underline-offset-4 ml-2'>
                                Accede aquí
                            </a>
                        </p>
                    </div>

                    <button
                        type="submit"
                        className='shadow-btn bg-red-200 py-2.5'
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-t-2 border-tahiti-700 rounded-full animate-spin"></div>
                                <span className="ml-2">Registrando...</span>
                            </div>
                        ) : (
                            'CREA tu Cuenta'
                        )}
                    </button>
                </form>
            </main>
        </section>
    );
};

export default Register;
