'use client';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PencilLine, Plus, Trash } from 'lucide-react';
import {
    deleteProduct,
    fetchProducts,
    Product,
    ProductMutation,
    updateProduct,
} from '@/stores/products/productStore';
import { fetchSubCategories, SubCategory } from '@/stores/subcategories/subcategoryStore';
import CreateProducts from './CreateProducts';
import {apiUrl} from "@/globalConstants";

export default function ProductTable() {
    const [items, setItems] = useState<Product[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const [editing, setEditing] = useState<Product | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editPrice, setEditPrice] = useState<number | ''>('');
    const [editSubCategoryId, setEditSubCategoryId] = useState<string>('');
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editPromoKey, setEditPromoKey] = useState(0);
    const [editInStock, setEditInStock] = useState(false);

    const reloadProducts = async () => {
        try {
            setLoading(true);
            const [products, subs] = await Promise.all([
                fetchProducts(),
                fetchSubCategories(),
            ]);
            setItems(products);
            setSubCategories(subs);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reloadProducts();
    }, []);

    const handleDelete = (id: number) => {
        toast('Вы уверены, что хотите удалить товар?', {
            action: {
                label: 'Удалить',
                onClick: async () => {
                    try {
                        await deleteProduct(id);
                        setItems((prev) => prev.filter((c) => c.id !== id));
                        toast.success('Товар удален');
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


    const openEdit = (product: Product) => {
        setEditing(product);
        setEditName(product.name);
        setEditDescription(product.description);
        setEditPrice(product.price);
        setEditSubCategoryId(product.subcategory_id.toString());
        setEditImageFile(null);

        setEditPromoKey(product.discount);
        setEditInStock(product.stock ?? false);
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!editing) return;

        if (!editSubCategoryId) {
            toast.error('Пожалуйста, выберите подкатегорию');
            return;
        }

        const payload: Partial<ProductMutation> = {
            name: editName,
            description: editDescription,
            price: typeof editPrice === 'number' ? editPrice : 0,
            subcategory_id: Number(editSubCategoryId),
            image_url: '',
            discount: editPromoKey,
            stock: editInStock,
        };

        try {
            const updated = await updateProduct(editing.id, payload, editImageFile || undefined);
            const subCategory = subCategories.find((sc) => sc.id === updated.subcategory_id);

            const updatedWithSubCategory: Product = {
                ...updated,
                subCategory: subCategory || null,
            };

            setItems((prev) =>
                prev.map((p) => (p.id === updated.id ? updatedWithSubCategory : p))
            );
            setEditing(null);
            toast.success('Товар обновлен');
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
                    className="inline-flex gap-2 rounded bg-black px-4 py-2 text-sm text-white hover:bg-white hover:text-black border"
                >
                    <Plus className="h-5 w-5" /> Создать товар
                </button>
            </div>
            <div className="overflow-x-auto rounded border border-gray-200">
                <table className="min-w-[1250px] divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="rounded-tl-lg px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Название
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Описание
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Цена
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Подкатегория
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Акция
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Наличие
                        </th>
                        <th className="rounded-tr-lg px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                           Изображение
                        </th>
                        <th className="rounded-tr-lg px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                            Действие
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                    {items.map((product) => (
                        <tr key={product.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{product.id}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{product.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{product.description}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{product.price} ₽</td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                                {product.subCategory?.name ?? '—'}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                                {product.discount > 0 ? `${Math.round(product.discount)}%` : '—'}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                                {product.stock ? (
                                    <span className="text-green-600 font-semibold">В наличии</span>
                                ) : (
                                    <span className="text-red-600 font-semibold">Нет в наличии</span>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {product.image_url ? (
                                    <img
                                        src={`${apiUrl}/${product.image_url}`}
                                        alt={product.name}
                                        className="h-15 w-15 rounded border border-gray-300 object-cover"
                                    />
                                ) : (
                                    <img src="/no-img.jpg" alt="Нет фото"
                                         className="h-15 w-15 rounded border border-gray-300 object-cover"/>
                                )}
                            </td>
                            <td className="px-4 py-2 space-x-3">
                                <button
                                    onClick={() => openEdit(product)}
                                    className="text-sm hover:underline"
                                >
                                    <PencilLine className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-sm hover:underline"
                                >
                                    <Trash className="h-6 w-6" />
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
                        <h1 className="mb-6 text-center text-2xl font-semibold text-black">Редактировать товар</h1>

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
                            <span className="mb-1 block text-sm font-medium text-black">Описание</span>
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                required
                                className="w-full rounded-md border border-black bg-white p-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </label>

                        <label className="mb-4 block">
                            <span className="mb-1 block text-sm font-medium text-black">Цена</span>
                            <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                required
                                className="w-full rounded-md border border-black bg-white p-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </label>

                        <label className="mb-4 block">
                            <span className="mb-1 block text-sm font-medium text-black">Подкатегория</span>
                            <select
                                value={editSubCategoryId}
                                onChange={(e) => setEditSubCategoryId(e.target.value)}
                                required
                                className="w-full rounded-md border border-black bg-white p-2 text-black focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="" disabled>
                                    Выберите подкатегорию
                                </option>
                                {subCategories
                                    .filter((sc) => sc.id != null)
                                    .map((sc) => (
                                        <option key={sc.id} value={sc.id.toString()}>
                                            {sc.name}
                                        </option>
                                    ))}
                            </select>
                        </label>
                        <label className="mb-4 block">
                            <span className="mb-1 block text-sm font-medium text-black">Скидка (%)</span>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={editing.discount ?? 0}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setEditing((prev) => prev ? { ...prev, discount: val } : prev);
                                }}
                                className="w-full rounded-md border border-black bg-white p-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </label>


                        <label className="mb-6 flex items-center gap-2 text-sm font-medium text-black">
                            <input
                                type="checkbox"
                                checked={editInStock}
                                onChange={(e) => setEditInStock(e.target.checked)}
                                className="h-4 w-4 rounded border border-black bg-white"
                            />
                            В наличии
                        </label>

                        <label className="mb-6 block">
              <span className="mb-1 block text-sm font-medium text-black">
                Фото (оставьте пустым, чтобы не менять)
              </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                                className="w-full text-black"
                            />
                        </label>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setEditing(null)}
                                className="w-full rounded-md bg-white py-2 border border-black text-center text-black transition hover:bg-black hover:text-white"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="w-full rounded-md bg-black py-2 text-center text-white transition hover:bg-white hover:text-black hover:border"
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
                        <CreateProducts
                            onClose={() => setCreating(false)}
                            onCreated={async () => {
                                setCreating(false);
                                await reloadProducts();
                                toast.success('Товар создан');
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
