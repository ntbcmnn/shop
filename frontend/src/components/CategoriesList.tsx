'use client';

import {FormEvent, useEffect, useState} from 'react';
import type {Category, CategoryMutation} from '@/stores/categories/categoriesStore';
import {deleteCategory, fetchCategories, updateCategory,} from '@/stores/categories/categoriesStore';
import {apiUrl} from '@/globalConstants';
import {toast} from 'sonner';
import CreateCategory from './CreateCategory';
import {PencilLine, Plus, Trash} from 'lucide-react';

export default function CategoriesList() {
    const [items, setItems] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const [editing, setEditing] = useState<Category | null>(null);
    const [editName, setEditName] = useState('');
    const [editFile, setEditFile] = useState<File | undefined>();


    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await fetchCategories();
                if (!cancelled) setItems(data);
            } catch (e) {
                if (!cancelled) setError((e as Error).message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleDelete = (id: number) => {
        toast('Вы уверены, что хотите удалить категорию?', {
            action: {
                label: 'Удалить',
                onClick: async () => {
                    try {
                        await deleteCategory(id);
                        setItems(prev => prev.filter(c => c.id !== id));
                        toast.success('Категория удалена');
                    } catch (e) {
                        toast.error(`Ошибка удаления: ${(e as Error).message}`);
                    }
                },
            },
            cancel: {
                label: 'Отмена',
                onClick: () => toast('Удаление отменено'),
            },
        });
    };


    const openEdit = (cat: Category) => {
        setEditing(cat);
        setEditName(cat.name);
        setEditFile(undefined);
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!editing) return;

        const payload: Partial<CategoryMutation> = {name: editName};
        try {
            const updated = await updateCategory(editing.id, payload, editFile);
            setItems((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c)),
            );
            setEditing(null);
        } catch (err) {
            alert(`Ошибка сохранения: ${(err as Error).message}`);
        }
    };

    if (loading) return <p className="p-4 text-gray-500">Загрузка…</p>;
    if (error)
        return (
            <p className="rounded bg-red-100 px-4 py-2 text-red-700">
                Ошибка: {error}
            </p>
        );

    return (
        <>
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => setCreating(true)}
                    className="inline-flex gap-2 rounded bg-black px-4 py-2 text-sm text-white hover:bg-white hover:text-black border"
                >
                    <Plus className="h-5 w-5" /> Создать категорию
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                <table className="min-w-[1100px] divide-y divide-gray-200 ">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="rounded-tl-lg px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Название
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Фото
                        </th>
                        <th className="rounded-tr-lg px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Действия
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200  border border-gray-200 rounded-b-lg">
                    {items.map((cat, index) => (
                        <tr key={cat.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                {cat.name}
                            </td>
                            <td className="px-4 py-2">
                                {cat.photo ? (
                                    <img
                                        src={`${apiUrl}/${cat.photo}`}
                                        alt={cat.name}
                                        className="h-20 w-20 rounded border border-gray-300 object-cover"
                                    />
                                ) : (
                                    <img src="/no-img.jpg" alt="Нет фото"
                                         className="h-20 w-20 rounded border border-gray-300 object-cover"/>
                                )}
                            </td>
                            <td className="px-4 py-2 space-x-3">
                                <button
                                    onClick={() => openEdit(cat)}
                                    className="text-sm  hover:underline"
                                >
                                    <PencilLine className="h-6 w-6"/>
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="text-sm  hover:underline"
                                >
                                    <Trash className="h-6 w-6"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>

            {editing && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    onClick={() => setEditing(null)}
                >
                    <form
                        onSubmit={handleSave}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-xl rounded-xl bg-white p-8 shadow-lg"
                    >
                        <h1 className="mb-6 text-center text-2xl font-semibold text-black">
                            Редактировать категорию
                        </h1>

                        <label className="mb-4 block">
                            <span className="mb-1 block text-sm font-medium text-black">Название</span>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                required
                                className="w-full rounded-md border border-black bg-white p-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </label>

                        <label className="mb-4 block">
                            <span className="mb-1 block text-sm font-medium text-black">Фото (опц.)</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditFile(e.target.files?.[0])}
                                className="w-full cursor-pointer text-black file:mr-4 file:rounded-md file:border-none file:bg-black file:px-4 file:py-2 file:text-white hover:file:bg-gray-800"
                            />
                        </label>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setEditing(null)}
                                className="w-full rounded-md bg-white py-2 border-1 text-center text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300"

                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="w-full rounded-md bg-black py-2 text-center text-white transition hover:bg-white hover:text-black hover:border-1 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                Сохранить
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {creating && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    onClick={() => setCreating(false)}

                >
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl">
                    <CreateCategory
                        onClose={() => setCreating(false)}
                        onCreated={(newCategory) => {
                            setItems(prev => [...prev, newCategory]);
                            setCreating(false);
                            toast.success('Категория создана');
                        }}
                    />
                    </div>
                </div>
            )}

        </>
    );
}
