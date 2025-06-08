'use client';

import {  FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Category,
    fetchCategories,
} from '@/stores/categories/categoriesStore';
import {
    createSubCategory,
    SubCategory,
} from '@/stores/subcategories/subcategoryStore';

interface Props {
    onClose: () => void;
    onCreated: (newSubCategory: SubCategory) => void;
}

export default function CreateSubCategory({ onClose, onCreated }: Props) {
    const router = useRouter();

    const [name, setName] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null,
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                console.error('Ошибка загрузки категорий', err);
            }
        };
        loadCategories();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedCategoryId) {
            setError('Пожалуйста, выберите категорию');
            setLoading(false);
            return;
        }

        try {
            const category = categories.find((c) => c.id === selectedCategoryId)!;

            const newSubCategory = await createSubCategory({
                name,
                category_id: category.id,
            });

            onCreated(newSubCategory);
            onClose();
            router.push(`/admin/subcategories`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Неизвестная ошибка создания');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-x rounded-xl bg-white p-8 shadow-lg"
            >
                <h1 className="mb-6 text-center text-2xl font-semibold text-black">
                    Новая подкатегория
                </h1>

                <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-black">
            Название
          </span>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-md border border-black bg-white p-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Введите название"
                    />
                </label>

                <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-black">
            Категория
          </span>
                    <select
                        required
                        value={selectedCategoryId ?? ''}
                        onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                        className="w-full rounded-md border border-black bg-white p-2 text-black focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>

                {error && (
                    <p className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-black py-2 text-center text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-600"
                >
                    {loading ? 'Создание…' : 'Создать'}
                </button>
            </form>
        </div>
    );
}
