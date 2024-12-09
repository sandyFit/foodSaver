import React from 'react';
import Navbar from '../layouts/Navbar';

const Login = () => {
    return (
        <section>
            <Navbar />

            <main className="flex flex-col pt-44 justify-center items-center gap-12">
                <h2 className='text-tahiti-700'>
                    Log In to Simplify Your Food Management
                </h2>
                <form className="w-[40%] flex flex-col gap-6">
                    <label htmlFor='email'
                        className="flex flex-col"
                    >
                        Email
                        <input
                            type="email"
                            name='email'
                            id='email'
                            autoComplete="email"
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
