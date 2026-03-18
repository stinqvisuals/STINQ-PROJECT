import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definisi tipe data produk di keranjang
interface CartItem {
    id: number;
    name: string;
    price: number;
    image_url: string;
    category: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: any) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === product.id);

                if (existingItem) {
                    // Jika barang sudah ada, tambah jumlahnya saja
                    set({
                        items: currentItems.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    // Jika barang belum ada, masukkan sebagai barang baru
                    set({ items: [...currentItems, { ...product, quantity: 1 }] });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage', // Nama kunci di LocalStorage
        }
    )
);