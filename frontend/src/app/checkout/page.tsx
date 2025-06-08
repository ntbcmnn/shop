'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from "@/stores/carts/cartsStore";
import { useOrderStore } from "@/stores/orders/ordersStore";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function Checkout() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { items: cartItems, clearCart, increaseQuantity, decreaseQuantity } = useCartStore();
    const { createOrder, isLoading } = useOrderStore();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const total = Math.round(
        cartItems.reduce(
            (acc, item) => acc + item.product_price * item.quantity,
            0
        )
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!cartItems.length) {
            alert('Ваша корзина пуста!');
            return;
        }

        try {
            const orderData = {
                user_id: 1, // или получить из авторизации
                total_amount: total,
                address: formData.address,
                phone: formData.phone,
                first_name: formData.first_name,
                last_name: formData.last_name,
                items: cartItems.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.product_price,
                })),
            };

            await createOrder(orderData);

            toast.success('Заказ успешно оформлен!');
            router.push('/');
            clearCart();
            setFormData({
                first_name: '',
                last_name: '',
                phone: '',
                address: '',
            });
        } catch (error) {
            console.log(error);
            alert('Не удалось оформить заказ. Попробуйте еще раз.');
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 mt-10 border border-gray-300 rounded-lg shadow-sm bg-white">
            <h1 className="text-2xl font-semibold mb-6">Оформление заказа</h1>

            {cartItems.length ? (
                <>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Товары в корзине</h2>
                        <ul className="space-y-3 mt-4">
                            {cartItems.map((item) => (
                                <li key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <span>{item.product_name}</span>
                                        <div className="flex items-center space-x-1">
                                            <button
                                                type="button"
                                                onClick={() => decreaseQuantity(item.id)}
                                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => increaseQuantity(item.id)}
                                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <span>{item.product_price * item.quantity} ₽</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 text-lg font-semibold">
                            <span>Итого: </span>
                            <span>{total} ₽</span>
                        </div>
                        <hr className="my-4" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-semibold mb-1">
                                Имя
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm font-semibold mb-1">
                                Фамилия
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold mb-1">
                                Телефон
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-semibold mb-1">
                                Адрес доставки
                            </label>
                            <textarea
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                rows={4}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-900 transition disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Оформляем...' : 'Оформить заказ'}
                        </button>
                    </form>
                </>
            ) : (
                <p className="text-gray-500">Ваша корзина пуста.</p>
            )}
        </div>
    );
}
