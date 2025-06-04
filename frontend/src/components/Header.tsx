'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const mockCart = [
        { id: 1, title: 'Платье летнее', price: 2499 },
        { id: 2, title: 'Топ белый', price: 1299 },
    ];

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    return (
        <header className="bg-white text-black border-b border-gray-200 shadow-sm relative">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-semibold tracking-tight">
                    K-shop
                </Link>

                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/" className="hover:underline">
                        Главная
                    </Link>
                    <Link href="/catalog" className="hover:underline">
                        Каталог
                    </Link>
                    <Link href="/about" className="hover:underline">
                        О нас
                    </Link>
                </nav>

                <div className="flex items-center space-x-4 text-sm relative">
                    <Link href="/login" className="hover:underline">
                        Войти
                    </Link>
                    <Link
                        href="/register"
                        className="border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition"
                    >
                        Зарегистрироваться
                    </Link>

                    {/* Иконка корзины */}
                    <button
                        onClick={toggleCart}
                        className="relative p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ShoppingCart size={20} />
                        {mockCart.length > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black rounded-full">
                                {mockCart.length}
                            </span>
                        )}
                    </button>

                    {/* Выпадашка */}
                    <div
                        className={`absolute right-0 top-full mt-2 w-72 bg-white border border-gray-300 shadow-lg rounded-lg z-50 transition-opacity duration-300 ease-in-out ${
                            isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                    >
                        <div className="p-4">
                            <h4 className="text-sm font-semibold mb-2">Корзина</h4>
                            {mockCart.length > 0 ? (
                                <>
                                    <ul className="space-y-2 text-sm">
                                        {mockCart.map(item => (
                                            <li key={item.id} className="flex justify-between">
                                                <span>{item.title}</span>
                                                <span>{item.price} ₽</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/checkout"
                                        className="mt-4 block text-center bg-black text-white py-2 px-4 rounded hover:bg-gray-900 transition"
                                    >
                                        Оформить заказ
                                    </Link>
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm">Корзина пуста</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
