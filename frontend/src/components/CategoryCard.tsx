'use client';

import { apiUrl } from "@/globalConstants";
import { Category } from "@/stores/categories/categoriesStore";
import { useRouter } from 'next/navigation';

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/catalog?categoryId=${category.id}`);
    };

    console.log(category.photo)

    return (
        <div
            className="max-w-xs rounded-lg overflow-hidden shadow-md bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={handleClick}
        >
            {category.photo ? (
                <img
                    src={`${apiUrl}/${category.photo}`}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500 text-lg font-semibold">
                    Нет изображения
                </div>
            )}

            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
            </div>
        </div>
    );
}