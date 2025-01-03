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

    const { login, loading } = useContext(ContextGlobal);
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

            <main className="flex flex-col pt-48 justify-center items-center gap-12">
                <h2 className='text-tahiti-700'>
                    Accede Ahora y Gestiona tu Despensa de Manera Inteligente
                </h2>
                <form onSubmit={handleSubmit}
                    className="w-[40%] flex flex-col mt-6 gap-6">

                    <input
                        type="email"
                        name='email'
                        id='email'
                        autoComplete="email"
                        placeholder='Tu correo electrónico'
                        className='shadow-none'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="password"
                        name='password'
                        id='password'
                        placeholder='Tu contraseña'
                        autoComplete="new-password"
                        className='shadow-none'
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />

                    <p className='text-right text-tahiti-700'>
                        No tienes cuenta?
                        <a href="/register" className='underline underline-offset-4 ml-2'>
                            Registrate aquí
                        </a>
                    </p>

                    <button
                        type="submit"
                        className='shadow-btn bg-blue-100 py-2.5'
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-t-2 border-tahiti-700 rounded-full animate-spin"></div>
                                <span className="ml-2">Accediendo...</span>
                            </div>
                        ) : (
                            'Gestiona tu Despensa'
                        )}
                    </button>
                </form>
            </main>
        </section>
    )
}

export default Login;
