'use client';

import { useState } from 'react';
import { Product } from "@/stores/products/productStore";
import { apiUrl } from "@/globalConstants";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/carts/cartsStore";
import { usersStore } from "@/stores/users/usersStore";
import {toast} from "sonner";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();
    const { addItemToCart, cart } = useCartStore();
    const { user } = usersStore();

    const isInCart = cart?.items?.some(item => item.product_id === product.id) || false;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            router.push('/login');
            return;
        }

        if (isInCart || !product.stock) return;

        if (user.role === "ADMIN") {
            toast.error("Администраторы не могут добавлять товары в корзину.");
            return;
        }

        setIsAdding(true);
        try {
            await addItemToCart(product.id);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const discountedPrice = product.discount > 0
        ? Number(product.price) * (1 - product.discount / 100)
        : Number(product.price);

    const handleClick = () => {
        router.push(`/products/${product.id}`);
    };

    return (
        <div onClick={handleClick} className="relative max-w-xs rounded-lg border border-gray-300 shadow-lg bg-white overflow-hidden cursor-pointer">
            {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                </div>
            )}

            {product.image_url ? (
                <img
                    src={`${apiUrl}/${product.image_url}`}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                />
            ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                    Нет фото
                </div>
            )}

            <div className="p-4">
                <h3 className="text-lg font-semibold text-black">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.subCategory?.name}</p>

                {product.discount > 0 ? (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-bold text-red-600">
                            {discountedPrice.toFixed(2)} ₽
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                            {Number(product.price).toFixed(2)} ₽
                        </span>
                    </div>
                ) : (
                    <p className="text-xl font-bold text-black mt-2">
                        {Number(product.price).toFixed(2)} ₽
                    </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                    {product.stock ? "В наличии" : "Нет в наличии"}
                </p>

                <button
                    onClick={handleAddToCart}
                    className={`w-full py-2 mt-4 rounded-md text-white ${
                        isInCart || !product.stock
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-black hover:bg-gray-800"
                    }`}
                    disabled={isInCart || !product.stock || isAdding}
                >
                    {isAdding
                        ? "Добавляем..."
                        : isInCart
                            ? "Товар в корзине"
                            : product.stock
                                ? "Добавить в корзину"
                                : "Нет в наличии"}
                </button>
            </div>
        </div>
    );
}