'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userThunk } from '@/stores/users/usersThunk';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const login = userThunk((state) => state.login);
    const loading = userThunk((state) => state.loading);
    const error = userThunk((state) => state.error);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await login(email, password);
            setSubmitted(true);
            router.push('/');
        } catch {
            setSubmitted(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-8 border border-gray-300 rounded-lg shadow-sm bg-white text-black">
            <h2 className="text-2xl font-semibold mb-6">Вход в аккаунт</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block mb-1 font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block mb-1 font-medium">
                        Пароль
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {submitted && !error && (
                    <p className="text-green-600 text-sm">Вход выполнен успешно!</p>
                )}

                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'} transition`}
                    disabled={loading}
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </div>
    );
}
