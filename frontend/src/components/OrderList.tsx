'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useOrderStore } from '@/stores/orders/ordersStore';

export default function OrderList() {
    const { orders, isLoading, error, fetchOrders, deleteOrder } = useOrderStore();
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders().catch(e => setLocalError((e as Error).message));
    }, [fetchOrders]);

    const handleDelete = (id: number) => {
        toast('Вы уверены, что хотите удалить заказ?', {
            action: {
                label: 'Удалить',
                onClick: async () => {
                    try {
                        await deleteOrder(id);
                        toast.success('Заказ удалён');
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

    if (isLoading) return <p className="p-4 text-gray-500">Загрузка заказов…</p>;
    if (error || localError)
        return (
            <p className="rounded bg-red-100 px-4 py-2 text-red-700">
                Ошибка: {error || localError}
            </p>
        );

    return (
        <div className="overflow-x-auto rounded border border-gray-200">
            <table className="min-w-[800px] divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="rounded-tl-lg px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Дата</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Клиент</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Телефон</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Сумма</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Статус</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {orders.length === 0 && (
                    <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                            Заказы не найдены
                        </td>
                    </tr>
                )}
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{order.id}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{new Date(order.order_date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{order.first_name} {order.last_name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{order.phone}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{order.total_amount} ₽</td>
                        <td className="px-4 py-2 space-x-3">
                            <button
                                onClick={() => handleDelete(order.id)}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
