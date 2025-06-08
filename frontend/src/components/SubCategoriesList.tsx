'use client';
import {FormEvent, useEffect, useState} from 'react';
import {toast} from 'sonner';
import {PencilLine, Plus, Trash} from 'lucide-react';
import {
    deleteSubCategory,
    fetchSubCategories,
    SubCategory,
    SubCategoryMutation,
    updateSubCategory
} from "@/stores/subcategories/subcategoryStore";
import {Category, fetchCategories} from "@/stores/categories/categoriesStore";
import CreateSubCategory from "@/components/CreateSubCategories";

export default function SubCategoriesList() {
    const [items, setItems] = useState<SubCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const [editing, setEditing] = useState<SubCategory | null>(null);
    const [editName, setEditName] = useState('');
    const [editCategoryId, setEditCategoryId] = useState<string>('');

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [subCats, cats] = await Promise.all([
                    fetchSubCategories(),
                    fetchCategories(),
                ]);
                if (!cancelled) {
                    setItems(subCats);
                    console.log('categories:', cats);
                    setCategories(cats);
                }
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
        toast('Вы уверены, что хотите удалить подкатегорию?', {
            action: {
                label: 'Удалить',
                onClick: async () => {
                    try {
                        await deleteSubCategory(id);
                        setItems(prev => prev.filter(c => c.id !== id));
                        toast.success('Подкатегория удалена');
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

    const openEdit = (cat: SubCategory) => {
        setEditing(cat);
        setEditName(cat.name);
        setEditCategoryId(cat.category?.id.toString() || '');
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!editing) return;

        if (!editCategoryId) {
            toast.error('Пожалуйста, выберите категорию');
            return;
        }

        const payload: Partial<SubCategoryMutation> = {
            name: editName,
            category_id: Number(editCategoryId),
        };

        try {
            const updated = await updateSubCategory(editing.id, payload);
            setItems((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c)),
            );
            setEditing(null);
            toast.success('Подкатегория обновлена');
        } catch (err) {
            toast.error(`Ошибка сохранения: ${(err as Error).message}`);
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
                    className="inline-flex gap-2 rounded bg-black px-4 py-2 text-sm text-white hover:bg-white hover:text-black border-1"
                >
                    <Plus className="h-5 w-5"/> Создать подкатегорию
                </button>
            </div>
            <div className="overflow-x-auto rounded border border-gray-200">
                <table className="min-w-[1100px] divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="rounded-tl-lg px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Название
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Категория
                        </th>
                        <th className="rounded-tr-lg px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Действия
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                    {items.map((cat, index) => (
                        <tr key={cat.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                {cat.name}
                            </td>
                            <td className="px-4 py-2">
                                {cat.category?.name ?? '—'}
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
                                    <Trash className="h-6 w-"/>
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
                            Редактировать подкатегорию
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
                            <span className="mb-1 block text-sm font-medium text-black">Категория</span>
                            <select
                                value={editCategoryId}
                                onChange={(e) => setEditCategoryId(e.target.value)}
                                required
                                className="w-full rounded-md border border-black bg-white p-2 text-black focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="" disabled>Выберите категорию</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
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
                        <CreateSubCategory
                            onClose={() => setCreating(false)}
                            onCreated={(newCategory) => {
                                setItems(prev => [...prev, newCategory]);
                                setCreating(false);
                                toast.success('Подкатегория создана');
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}