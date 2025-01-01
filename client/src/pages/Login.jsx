import React, { useContext, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { ContextGlobal } from '../utils/globalContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login } = useContext(ContextGlobal);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await login(formData);  // Get the response data from login
            // console.log('Datos de Acceso:', data);

            if (data && data.token) {  // Ensure data and token exist before proceeding
                setFormData({
                    email: '',
                    password: ''
                });

                localStorage.setItem('token', data.token);
                console.log("Token guardado:", localStorage.getItem('token'));  // Verifica que el token esté guardado

                navigate('/dashboard');  // Navigate to the dashboard
            } else {
                toast.error('Error: no se pudo obtener el token.');
            }

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            toast.error('Error al iniciar sesión. Por favor, intenta nuevamente.');
        }
    };


    return (
        <section>
            <Navbar />

            <main className="flex flex-col pt-44 justify-center items-center gap-12">
                <h2 className='text-tahiti-700'>
                    Log In to Simplify Your Food Management
                </h2>
                <form onSubmit={handleSubmit}
                    className="w-[40%] flex flex-col gap-6">
                    <label htmlFor='email'
                        className="flex flex-col"
                    >
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
                    <label htmlFor='password'
                        className="flex flex-col"
                    >
                        Password
                        <input
                            type="password"
                            name='password'
                            id='password'
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <p className='text-right text-tahiti-700'>
                        Need an account?
                        <a href="/register" className='underline underline-offset-4 ml-2'>
                            Register here
                        </a>
                    </p>

                    <button
                        type="submit"
                        className='shadow-btn bg-blue-100 py-2.5'
                    >
                        Login
                    </button>
                </form>
            </main>
        </section>
    )
}

export default Login;
