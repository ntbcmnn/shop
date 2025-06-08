import { create } from "zustand";
import {axiosApi} from "@/globalConstants";

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
}

export interface Order {
    id: number;
    user_id: number;
    order_date: string;
    total_amount: number;
    status: "pending" | "processing" | "completed" | "cancelled";
    items?: OrderItem[];
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
}

interface OrderStore {
    orders: Order[];
    selectedOrder: Order | null;
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    fetchOrderById: (id: number) => Promise<void>;
    createOrder: (order: {
        user_id: number;
        total_amount: number;
        first_name: string;
        last_name: string;
        phone: string;
        address: string;
        items: Omit<OrderItem, "id" | "order_id">[];
    }) => Promise<void>;
    updateOrderStatus: (id: number, status: Order["status"]) => Promise<void>;
    deleteOrder: (id: number) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    selectedOrder: null,
    isLoading: false,
    error: null,

    fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosApi.get<Order[]>("/orders");
            set({ orders: res.data });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchOrderById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosApi.get<Order>(`/orders/${id}`);
            set({ selectedOrder: res.data });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    createOrder: async (order) => {
        set({ isLoading: true, error: null });
        try {
            await axiosApi.post("/orders", order);
            await useOrderStore.getState().fetchOrders();
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateOrderStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            await axiosApi.patch(`/orders/${id}/status`, { status });
            await useOrderStore.getState().fetchOrders();
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteOrder: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosApi.delete(`/orders/${id}`);
            await useOrderStore.getState().fetchOrders();
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));
