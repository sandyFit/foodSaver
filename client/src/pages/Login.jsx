import React, { useContext, useState } from 'react';
import { ContextGlobal } from '../utils/globalContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../components/ui/Logo';

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
                // Clear the form
                setFormData({
                    email: '',
                    password: ''
                });

                // Store the token in localStorage
                localStorage.setItem('token', data.token);
                console.log("Token guardado:", localStorage.getItem('token'));  // Debugging

                // Navigate to the dashboard
                navigate('/dashboard');  
            } else {
                toast.error('Error: no se pudo obtener el token.');
            }

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            toast.error('Error al iniciar sesión. Por favor, intenta nuevamente.');
        }
    };


    return (
        <section className='w-full min-h-screen bg-tahiti-700'>
            <div className="w-full flex flex-col items-center">
               <Logo/>

                <main className="w-full flex flex-col pt-20 justify-center items-center gap-12 ">
                    <h2 className='text-yellow-100 text-center'>
                        Accede Ahora y
                        <span className='text-white mx-3'>Gestiona</span>
                        tu Despensa <br />
                        de Manera Inteligente
                    </h2>
                    <form onSubmit={handleSubmit}
                        className="w-[40%] flex flex-col mt-1 gap-6">

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

                        <p className='text-right text-white'>
                            No tienes cuenta?
                            <a href="/register"
                                className='underline underline-offset-4 ml-2 hover:text-yellow-100'>
                                Registrate aquí
                            </a>
                        </p>

                        <button
                            type="submit"
                            className='shadow-btn bg-blue-200 py-2.5'
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-tahiti-700 rounded-full animate-spin"></div>
                                    <span className="ml-2">Accediendo...</span>
                                </div>
                            ) : (
                                'ACCEDE Ahora'
                            )}
                        </button>
                    </form>
                </main>
            </div>
        </section>
    )
}

export default Login;
