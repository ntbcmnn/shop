'use client';

import {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Category, createCategory} from '@/stores/categories/categoriesStore';

interface Props {
    onClose: () => void;
    onCreated: (newCategory: Category) => void;
}

export default function CreateCategory({onClose, onCreated}: Props) {
    const router = useRouter();

    const [name, setName] = useState('');
    const [file, setFile] = useState<File | undefined>();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        setFile(f);
        if (f) {
            const url = URL.createObjectURL(f);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newCategory = await createCategory({name, photo: ''}, file);
            onCreated(newCategory);
            onClose();
            router.push(`/admin/categories`);
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
                    Новая категория
                </h1>

                <label className="mb-4 block">
                    <span className="mb-1 block text-sm font-medium text-black">Название</span>
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
                    <span className="mb-1 block text-sm font-medium text-black">Фото (опц.)</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full cursor-pointer text-black file:mr-4 file:rounded-md file:border-none file:bg-black file:px-4 file:py-2 file:text-white hover:file:bg-gray-800"
                    />
                </label>

                {previewUrl && (
                    <div className="mb-4">
                        <img
                            src={previewUrl}
                            alt="Предпросмотр"
                            className="h-32 w-32 rounded border border-gray-300 object-cover"
                        />
                    </div>
                )}

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
