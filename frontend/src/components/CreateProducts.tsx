'use client';

import { FormEvent, useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
    createProduct,
    Product,
} from '@/stores/products/productStore';
import {
    fetchSubCategories,
    SubCategory,
} from '@/stores/subcategories/subcategoryStore';

interface Props {
    onClose: () => void;
    onCreated: (newProduct: Product) => void;
}

export default function CreateProduct({ onClose, onCreated }: Props) {
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | ''>('');
    const [file, setFile] = useState<File | null>(null);
    const [stock, setStock] = useState(true); // по умолчанию в наличии
    const [discount, setDiscount] = useState('0'); // скидка по умолчанию 0
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadSubCategories() {
            try {
                const subs = await fetchSubCategories();
                setSubCategories(subs);
            } catch (e) {
                console.error('Ошибка загрузки подкатегорий', e);
            }
        }
        loadSubCategories();
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedSubCategoryId) {
            setError('Пожалуйста, выберите подкатегорию');
            setLoading(false);
            return;
        }
        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            setError('Пожалуйста, введите корректную цену');
            setLoading(false);
            return;
        }
        if (isNaN(Number(discount)) || Number(discount) < 0) {
            setError('Пожалуйста, введите корректную скидку');
            setLoading(false);
            return;
        }

        try {
            const newProduct = await createProduct(
                {
                    name,
                    description,
                    price: Number(price),
                    image_url: '',
                    subcategory_id: Number(selectedSubCategoryId),
                    stock: stock,
                    discount: Number(discount),
                },
                file ?? undefined,
            );

            onCreated(newProduct);
            onClose();
            router.push('/admin/products');
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
                className="w-full max-w-xl rounded-xl bg-white p-8 shadow-lg"
            >
                <h1 className="mb-6 text-center text-2xl font-semibold text-black">
                    Создать товар
                </h1>

                <label className="mb-4 block">
                    <span className="mb-1 block text-sm font-medium text-black">Название</span>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-md border border-black bg-white p-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Введите название товара"
                    />
                </label>

                <label className="mb-4 block">
                    <span className="mb-1 block text-sm font-medium text-black">Описание</span>
                    <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-md border border-black bg-white p-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Введите описание"
                    />
                </label>

                <label className="mb-4 block">
                    <span className="mb-1 block text-sm font-medium text-black">Цена</span>
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-md border border-black bg-white p-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Введите цену"
                    />
                </label>

                <label className="mb-4 block">
                    <span className="mb-1 block text-sm font-medium text-black">Скидка (%)</span>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-full rounded-md border border-black bg-white p-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Введите размер скидки"
                    />
                </label>

                <label className="mb-4 flex items-center gap-2 text-black">
                    <input
                        type="checkbox"
                        checked={stock}
                        onChange={(e) => setStock(e.target.checked)}
                        className="h-4 w-4 rounded border border-black bg-white focus:ring-2 focus:ring-black"
                    />
                    В наличии
                </label>

                <label className="mb-4 block">
                    <span className="mb-1 block text-sm font-medium text-black">Подкатегория</span>
                    <select
                        required
                        value={selectedSubCategoryId}
                        onChange={(e) => setSelectedSubCategoryId(Number(e.target.value))}
                        className="w-full rounded-md border border-black bg-white p-2 text-black focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="">Выберите подкатегорию</option>
                        {subCategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="mb-4 block">
                    <span className="mb-1 block text-sm font-medium text-black">Фото</span>
                    <input
                        type="file"
                        accept="image/*"
                        name="image_url"
                        onChange={handleFileChange}
                        className="w-full rounded-md border border-black bg-white p-2 text-black focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </label>

                {error && (
                    <p className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>
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
