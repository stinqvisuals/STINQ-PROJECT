import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
    favorites: any[];
    toggleFavorite: (product: any) => void;
    isFavorite: (id: number) => boolean;
}

export const useWishlist = create<WishlistState>()(
    persist(
        (set, get) => ({
            favorites: [],
            toggleFavorite: (product) => {
                const isFav = get().favorites.some((item) => item.id === product.id);
                if (isFav) {
                    set({ favorites: get().favorites.filter((item) => item.id !== product.id) });
                } else {
                    set({ favorites: [...get().favorites, product] });
                }
            },
            isFavorite: (id) => get().favorites.some((item) => item.id === id),
        }),
        { name: 'wishlist-storage' }
    )
);