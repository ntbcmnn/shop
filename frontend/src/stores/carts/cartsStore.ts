import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosApi } from "@/globalConstants";
import { usersStore } from "@/stores/users/usersStore";

interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    price: number;
    quantity: number;
    product_name: string;
    product_price: number;
}

interface Cart {
    id: number;
    user_id: number;
    created_at: string;
    items?: CartItem[];
}

interface CartState {
    cart: Cart | null;
    items: CartItem[];
    loading: boolean;
    error: string | null;
    total: number;
    fetchUserCart: (userId: number) => Promise<void>;
    createCart: (userId: number) => Promise<void>;
    addItemToCart: (productId: number, quantity?: number) => Promise<void>;
    updateCartItem: (itemId: number, quantity: number) => Promise<void>;
    removeCartItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    calculateTotal: () => Promise<void>;
    resetCart: () => void;
    userId?: number;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;

}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: null,
            items: [],
            loading: false,
            error: null,
            total: 0,

            fetchUserCart: async (userId: number) => {
                set({ loading: true, error: null });
                try {
                    const response = await axiosApi.get(`/carts/user/${userId}`);
                    set({
                        cart: response.data.cart,
                        items: response.data.items,
                        loading: false,
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch cart',
                        loading: false,
                    });
                }
            },

            createCart: async (userId: number) => {
                set({ loading: true, error: null });
                try {
                    const response = await axiosApi.post('/carts', { user_id: userId });
                    set({
                        cart: {
                            id: response.data.cart_id,
                            user_id: userId,
                            created_at: new Date().toISOString()
                        },
                        items: [],
                        loading: false,
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to create cart',
                        loading: false,
                    });
                }
            },

            addItemToCart: async (productId: number, quantity: number = 1) => {
                set({ loading: true, error: null });
                try {
                    const currentUser = usersStore.getState().user;
                    if (!currentUser) {
                        throw new Error('Authorization required');
                    }

                    let { cart } = get();
                    if (!cart) {
                        await get().createCart(currentUser.id);
                        cart = get().cart;
                    }

                    await axiosApi.post(`/carts/${cart?.id}/items`, {
                        product_id: productId,
                        quantity,
                    });

                    await get().fetchUserCart(currentUser.id);
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to add item to cart',
                        loading: false,
                    });
                    throw error;
                }
            },

            updateCartItem: async (itemId: number, quantity: number) => {
                set({ loading: true, error: null });
                try {
                    const currentUser = usersStore.getState().user;
                    if (!currentUser) {
                        throw new Error('Authorization required');
                    }

                    await axiosApi.put(`/carts/items/${itemId}`, { quantity });
                    await get().fetchUserCart(currentUser.id);
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update cart item',
                        loading: false,
                    });
                }
            },

            removeCartItem: async (itemId: number) => {
                set({ loading: true, error: null });
                try {
                    const currentUser = usersStore.getState().user;
                    if (!currentUser) {
                        throw new Error('Authorization required');
                    }

                    await axiosApi.delete(`/carts/items/${itemId}`);
                    await get().fetchUserCart(currentUser.id);
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to remove cart item',
                        loading: false,
                    });
                }
            },

            clearCart: async () => {
                set({ loading: true, error: null });
                try {
                    const { cart } = get();
                    if (cart) {
                        await axiosApi.delete(`/carts/${cart.id}`);
                    }
                    get().resetCart();
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to clear cart',
                        loading: false,
                    });
                    get().resetCart();
                }
            },

            increaseQuantity: (id: number) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                })),
            decreaseQuantity: (id: number) =>
                set((state) => ({
                    items: state.items
                        .map((item) =>
                            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                        )
                        .filter((item) => item.quantity > 0),
                })),

            calculateTotal: async () => {
                set({ loading: true, error: null });
                try {
                    const { cart } = get();
                    if (!cart) {
                        throw new Error('Cart not found');
                    }

                    const response = await axiosApi.get(`/carts/${cart.id}/total`);
                    set({
                        total: parseFloat(response.data.total),
                        loading: false,
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to calculate total',
                        loading: false,
                    });
                }
            },

            resetCart: () => {
                set({
                    cart: null,
                    items: [],
                    total: 0,
                    loading: false,
                });
            }
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                // Сохраняем только ID пользователя для проверки при гидрации
                userId: state.cart?.user_id || null,
            }),
            onRehydrateStorage: () => (state) => {
                if (!state) return;

                const currentUser = usersStore.getState().user;
                if (!currentUser || state.userId !== currentUser.id) {
                    // Очищаем если пользователь не совпадает или вышел
                    localStorage.removeItem('cart-storage');
                    state.resetCart();
                }
            }
        }
    )
);