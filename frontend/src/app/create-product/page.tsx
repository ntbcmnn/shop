'use client';

import { useState } from 'react';

// Категории и подкатегории
const categoryOptions: {[key: string]: string[]} = {
    'Женская одежда': ['Платья', 'Топы', 'Брюки', 'Юбки'],
    'Аксессуары': ['Сумки', 'Очки', 'Украшения'],
    'Обувь': ['Кроссовки', 'Босоножки', 'Туфли'],
};

export default function ProductForm() {
    const [formData, setFormData] = useState({
        image: '',
        title: '',
        category: '',
        subCategory: '',
        price: '',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'category' ? { subCategory: '' } : {}), // сброс подкатегории
        }));
    };

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
            setFormData(prev => ({
                ...prev,
                image: imageUrl,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { image, title, category, subCategory, price } = formData;

        if (!image || !title || !category || !subCategory || !price) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        if (isNaN(Number(price))) {
            setError('Цена должна быть числом');
            return;
        }

        setError('');
        setSubmitted(true);

        const newProduct = {
            ...formData,
            price: Number(price),
        };

        console.log('Создан товар:', newProduct);
    };

    const subCategories = categoryOptions[formData.category] || [];

    return (
        <div className="max-w-4xl mx-auto mt-12 p-8 border border-gray-300 rounded-lg shadow-sm bg-white text-black">
            <h2 className="text-2xl font-semibold mb-6">Создание товара</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Поля */}
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Изображение товара</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full"
                        />
                    </div>

                    <InputField
                        label="Название товара"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                    {/* Селект Категория */}
                    <div>
                        <label htmlFor="category" className="block mb-1 font-medium">
                            Категория
                        </label>
                        <select
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        >
                            <option value="">Выберите категорию</option>
                            {Object.keys(categoryOptions).map(cat => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Селект Подкатегория */}
                    <div>
                        <label htmlFor="subCategory" className="block mb-1 font-medium">
                            Подкатегория
                        </label>
                        <select
                            name="subCategory"
                            id="subCategory"
                            value={formData.subCategory}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black 
    ${!formData.category ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-black cursor-pointer'}`}
                            required
                            disabled={!formData.category}
                        >
                            <option value="">Выберите подкатегорию</option>
                            {subCategories.map(sub => (
                                <option key={sub} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                    </div>

                    <InputField
                        label="Цена (₽)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                    />

                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    {submitted && !error && (
                        <p className="text-green-600 text-sm">Товар успешно создан!</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
                    >
                        Создать товар
                    </button>
                </div>

                {/* Превью */}
                <div className="flex items-start justify-center">
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Предпросмотр"
                            className="w-full max-w-sm rounded-lg shadow-md object-cover"
                        />
                    ) : (
                        <div className="w-full max-w-sm h-64 flex items-center justify-center border border-dashed border-gray-400 rounded text-gray-400 text-sm">
                            Предпросмотр изображения
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

// Вспомогательный компонент input
function InputField({
                        label,
                        name,
                        value,
                        onChange,
                        type = 'text',
                    }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type?: string;
}) {
    return (
        <div>
            <label htmlFor={name} className="block mb-1 font-medium">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                required
            />
        </div>
    );
}
