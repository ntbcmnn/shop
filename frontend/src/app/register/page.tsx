'use client';
import {useState} from 'react';
import {useRouter} from "next/navigation";
import {usersStore} from '@/stores/users/usersStore';

export default function Register() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const phonePattern = /^\+996-\d{3}-\d{2}-\d{2}-\d{2}$/;


    const register = usersStore((state) => state.register);
    const loading = usersStore((state) => state.loading);
    const error = usersStore((state) => state.error);

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !firstName || !lastName || !password) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        if (phone && !phonePattern.test(phone)) {
            alert('Введите номер телефона в формате +996-XXX-XX-XX');
            return;
        }

        try {
            await register({email, password, first_name: firstName, last_name: lastName, phone});
            const {role} = usersStore.getState().user || {};

            if (role === 'USER') {
                router.push('/');
            } else {
                router.push('/admin');
            }

        } catch {
            setSubmitted(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-8 border border-gray-300 rounded-lg shadow-sm bg-white text-black">
            <h2 className="text-2xl font-semibold mb-6">Регистрация</h2>
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
                    <label htmlFor="firstName" className="block mb-1 font-medium">
                        Имя
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="lastName" className="block mb-1 font-medium">
                        Фамилия
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block mb-1 font-medium">
                        Телефон
                    </label>
                    <input
                        id="phone"
                        type="text"
                        placeholder="+996-555-12-34"
                        className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                    <p className="text-green-600 text-sm">Регистрация прошла успешно!</p>
                )}

                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'} transition`}
                    disabled={loading}
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>
        </div>
    );
}
