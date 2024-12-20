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

    const { registerUser } = useContext(ContextGlobal);
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
        <section>
            <Navbar />
            <main className="flex flex-col pt-44 justify-center items-center gap-12">
                <h2 className='text-tahiti-700'>
                    Join Us Today and Reduce Food Waste Effortlessly!
                </h2>
                <form onSubmit={handleSubmit} className="w-[42%] flex flex-col gap-6">
                    <label htmlFor='fullName' className="flex flex-col">
                        Full Name
                        <input
                            type="text"
                            name='fullName'
                            id='fullName'
                            autoComplete="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label htmlFor='email' className="flex flex-col">
                        Email
                        <input
                            type="email"
                            name='email'
                            id='email'
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <div className="flex w-full justify-between">
                        <label htmlFor='password' className="flex flex-col">
                            Password
                            <input
                                type="password"
                                name='password'
                                id='password'
                                className='w-[20vw]'
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label htmlFor='confirmPassword' className="flex flex-col">
                            Confirm Password
                            <input
                                type="password"
                                name='confirmPass'
                                id='confirmPassword'
                                className='w-[20vw]'
                                autoComplete="new-password"
                                value={formData.confirmPass}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="w-full flex justify-between">
                        <div className="w-[14vw] flex justify-between">
                            <div className="flex gap-2">
                                <label htmlFor='userRole'>User</label>
                                <input
                                    type='radio'
                                    id='userRole'
                                    name='role'
                                    value="user"
                                    checked={formData.role === 'user'}
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
                                    checked={formData.role === 'admin'}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <p className='w-full text-right text-tahiti-700'>
                            Have an account?
                            <a href="/login" className='underline underline-offset-4 ml-2'>
                                Login here
                            </a>
                        </p>
                    </div>

                    <button type="submit" className='shadow-btn bg-rose-100 py-2.5'>
                        Register
                    </button>
                </form>
            </main>
        </section>
    );
};

export default Register;
