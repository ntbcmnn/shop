// components/ProductTable.tsx

import { FC } from 'react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

export default function ProductTable  () {
    const products: Product[] = [
        { id: 1, name: 'Платье летнее', category: 'Одежда', price: 2499, quantity: 10 },
        { id: 2, name: 'Топ белый', category: 'Одежда', price: 1299, quantity: 15 },
    ];

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-6">
            <table className="min-w-full table-auto">
                <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700">Название</th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700">Категория</th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700">Цена</th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700">Количество</th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700">Действия</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id} className="border-b">
                        <td className="px-4 py-2 text-sm">{product.name}</td>
                        <td className="px-4 py-2 text-sm">{product.category}</td>
                        <td className="px-4 py-2 text-sm">{product.price} ₽</td>
                        <td className="px-4 py-2 text-sm">{product.quantity}</td>
                        <td className="px-4 py-2 text-sm">
                            <button className="text-blue-500 hover:text-blue-700 mr-2">Редактировать</button>
                            <button className="text-red-500 hover:text-red-700">Удалить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

