"use client";
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usersStore } from "@/stores/users/usersStore";
import { useCartStore } from "@/stores/carts/cartsStore";

export default function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user, logout } = usersStore();
    const { cart, items, fetchUserCart, clearCart } = useCartStore();
    const router = useRouter();

    const toggleCart = () => {
        if (user && cart) {
            fetchUserCart(cart.user_id);
        }
        setIsCartOpen(!isCartOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
            await clearCart();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const total = items.reduce((sum, item) => {
        const itemPrice = item.product_price || 0;
        return sum + (itemPrice * item.quantity);
    }, 0);

    return (
        <header className="bg-white text-black border-b border-gray-200 shadow-sm relative">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
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
                    {!user ? (
                        <>
                            <Link href="/login" className="hover:underline">
                                Войти
                            </Link>
                            <Link
                                href="/register"
                                className="border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition"
                            >
                                Зарегистрироваться
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="mr-4">Привет, {user.first_name}</span>
                            <button
                                onClick={handleLogout}
                                className="border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition"
                            >
                                Выйти
                            </button>
                        </>
                    )}

                    {user?.role === "USER" ? (
                        <button
                            onClick={toggleCart}
                            className="relative p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <ShoppingCart size={20} />
                            {items.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black rounded-full">
                                    {items.length}
                                </span>
                            )}
                        </button>
                    ):null}
                    {user ? (
                        user.role === "USER" ? (
                            <div
                                className={`absolute right-0 top-full mt-2 w-72 bg-white border border-gray-300 shadow-lg rounded-lg z-50 transition-opacity duration-300 ease-in-out ${
                                    isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                                }`}
                            >
                                <div className="p-4">
                                    <h4 className="text-sm font-semibold mb-2">Корзина</h4>
                                    {items.length > 0 ? (
                                        <>
                                            <ul className="space-y-2 text-sm">
                                                {items.map(item => (
                                                    <li key={item.id} className="flex justify-between">
                  <span>
                    {item.product_name}
                      <span className="text-gray-500 ml-1">×{item.quantity}</span>
                  </span>
                                                        <span>{(Number(item.product_price) * item.quantity).toFixed(2)} ₽</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between font-medium">
                                                <span>Итого:</span>
                                                <span>{total.toFixed(2)} ₽</span>
                                            </div>
                                            <Link
                                                href="/checkout"
                                                className="mt-4 block text-center bg-black text-white py-2 px-4 rounded hover:bg-gray-900 transition"
                                                onClick={() => setIsCartOpen(false)}
                                            >
                                                Оформить заказ
                                            </Link>
                                        </>
                                    ) : (
                                        <p className="text-gray-500 text-sm">Корзина пуста</p>
                                    )}
                                </div>
                            </div>
                        ) : user.role === "ADMIN" ? (
                            <Link
                                href="/admin/orders"
                                className="inline-block bg-black text-white px-4 py-2 rounded "
                            >
                                Админ панель
                            </Link>
                        ) : null
                    ) : null}


                </div>
            </div>
        </header>
    );
}