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
    size: string; // Menyimpan ukuran yang dipilih
}

interface CartState {
    items: CartItem[];
    // Menyesuaikan parameter agar menerima product lengkap (termasuk size)
    addItem: (product: any) => void;
    // Menyesuaikan remove & update agar tahu size mana yang diutak-atik
    removeItem: (id: number, size: string) => void;
    updateQuantity: (id: number, size: string, quantity: number) => void;
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

                // LOGIC: Cari apakah ID dan SIZE-nya sama persis
                const existingItem = currentItems.find(
                    (item) => item.id === product.id && item.size === product.size
                );

                if (existingItem) {
                    // Jika ID & SIZE sama, tambah quantity
                    set({
                        items: currentItems.map((item) =>
                            item.id === product.id && item.size === product.size
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    // Jika barang baru (atau ukuran baru), masukkan ke array
                    // Pastikan image_url yang disimpan adalah string tunggal untuk thumbnail
                    const thumbUrl = Array.isArray(product.image_url)
                        ? product.image_url[0]
                        : product.image_url;

                    set({
                        items: [...currentItems, { ...product, image_url: thumbUrl, quantity: 1 }]
                    });
                }
            },

            // Menghapus berdasarkan ID dan Size agar tidak menghapus produk yang sama dengan size berbeda
            removeItem: (id, size) => {
                set({
                    items: get().items.filter((item) => !(item.id === id && item.size === size))
                });
            },

            // Update jumlah berdasarkan ID dan Size
            updateQuantity: (id, size, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item.id === id && item.size === size
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
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