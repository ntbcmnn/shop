// components/CategoryTable.tsx

import { FC } from 'react';
import ProductTable from "@/components/ProductTable";

interface Category {
    id: number;
    name: string;
    subCategories: string[];
}

export default function CategoriesPage () {
    const categories: Category[] = [
        { id: 1, name: 'Одежда', subCategories: ['Платья', 'Топы', 'Штаны'] },
        { id: 2, name: 'Обувь', subCategories: ['Кроссовки', 'Туфли'] },
    ];

    return (
        <div className="ml-10">
            <h1 className="text-3xl font-semibold mb-10 mt-10">Категории</h1>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-6">
                <table className="max-w-full table-auto">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-left">Название категории</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-left">Подкатегории</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                        <tr key={category.id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{category.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <ul className="space-y-2">
                                    {category.subCategories.map((subCategory, index) => (
                                        <li key={index} className="text-sm text-gray-700">{subCategory}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <button className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200 mr-3">
                                    Редактировать
                                </button>
                                <button className="text-red-600 hover:text-red-800 font-semibold transition duration-200">
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>


    );
};
