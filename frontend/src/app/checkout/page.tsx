'use client';

import { useState, useEffect } from 'react';
export default function Checkout() {
    const [isClient, setIsClient] = useState(false);

    // Пример товаров в корзине (можно заменить на глобальное состояние, например, контекст)
    const mockCart = [
        { id: 1, title: 'Платье летнее', price: 2499, quantity: 1 },
        { id: 2, title: 'Топ белый', price: 1299, quantity: 2 },
    ];

    // Форма
    const [formData, setFormData] = useState({
        address: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsClient(true); // Устанавливаем флаг после первого рендера
    }, []);

    // Рассчитываем общую стоимость
    const total = mockCart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log(formData)
        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Рендерим компонент только на клиенте
    if (!isClient) {
        return null; // Можно вернуть спиннер или другую заглушку
    }

    return (
        <div className="max-w-7xl mx-auto px-4 p-8 mt-10 border border-gray-300 rounded-lg shadow-sm bg-white">
            <h1 className="text-2xl font-semibold mb-6">Оформление заказа</h1>

            <div className="mb-9">
                <h2 className="text-xl font-semibold">Товары в корзине</h2>
                <ul className="space-y-4 mt-4">
                    {mockCart.map((item) => (
                        <li key={item.id} className="flex justify-between items-center">
                            <span>
                                {item.title} x{item.quantity}
                            </span>
                            <span>{item.price * item.quantity} ₽</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 text-lg font-semibold">
                    <span>Итого: </span>
                    <span>{total} ₽</span>
                </div>
                <hr/>
            </div>


            <form onSubmit={handleSubmit} >
                <div>
                    <label htmlFor="address" className="block text-sm font-semibold">
                        Адрес доставки
                    </label>
                    <textarea
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                        rows={4}
                        required
                    />
                </div>

                {/* Кнопка для оформления */}
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-900 transition disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
                </button>
            </form>
        </div>
    );
}
