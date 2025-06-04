'use client';

import { useState } from 'react';

interface ProductCardProps {
    image: string;
    title: string;
    category: string;
    subCategory: string;
    price: number;
}

export default function ProductCard({
                                        image,
                                        title,
                                        category,
                                        subCategory,
                                        price,
                                    }: ProductCardProps) {
    const [inCart, setInCart] = useState(false);

    const handleAddToCart = () => {
        setInCart(true);
        console.log(`${title} добавлен в корзину`);
    };

    return (
        <div className="max-w-xs rounded-lg border border-gray-300 shadow-lg bg-white overflow-hidden">
            <img src={image} alt={title} className="w-full h-64 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-black">{title}</h3>
                <p className="text-sm text-gray-500">{category} / {subCategory}</p>
                <p className="text-xl font-bold text-black mt-2">{price} ₽</p>
                <button
                    onClick={handleAddToCart}
                    className={`w-full py-2 mt-4 rounded-md text-white ${
                        inCart ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
                    }`}
                    disabled={inCart}
                >
                    {inCart ? 'Товар в корзине' : 'Добавить в корзину'}
                </button>
            </div>
        </div>
    );
}
