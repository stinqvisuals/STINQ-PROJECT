"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/store';
import { useWishlist } from '@/lib/wish-list-store'; // 1. IMPORT WISHLIST STORE
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image_url: string[]; // 2. UBAH KE ARRAY agar tidak error saat akses [0]
    description?: string;
}

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const { addItem } = useCart();
    // 3. AMBIL FUNGSI DARI WISHLIST
    const { toggleFavorite, favorites } = useWishlist();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addItem(product);
            toast.success(`${product.name} Added to Cart!`, {
                position: "bottom-center"
            });
        }
    };

    // 4. PERBAIKI FUNGSI FAVORITE
    const handleFavorite = () => {
        if (product) {
            toggleFavorite(product); // Panggil fungsi wishlist, bukan addItem cart

            // Cek apakah sekarang jadi favorit atau dihapus
            const isNowFav = favorites.some(item => item.id === product.id);

            if (!isNowFav) {
                toast.success(`Added to Favorite!`, { icon: '❤️', position: "bottom-center" });
            } else {
                toast.success(`Removed from Favorite`, { position: "bottom-center" });
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not Found.</div>;

    // Cek status favorit untuk pewarnaan icon
    const isFav = favorites.some((item) => item.id === product.id);

    return (
        <main className="min-h-screen bg-white text-black">
            <Toaster />

            <div className="max-w-[1200px] mx-auto px-4 md:px-12 pt-32 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* BAGIAN KIRI: GAMBAR */}
                    <div className="relative aspect-square bg-[#f6f6f6] rounded-sm overflow-hidden">
                        <Image
                            src={product.image_url[0].startsWith('http') || product.image_url[0].startsWith('/')
                                ? product.image_url[0]
                                : `/${product.image_url[0]}`}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* BAGIAN KANAN: INFO */}
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-black tracking-tighter mb-2">
                            {product.name}
                        </h1>
                        <p className="text-lg font-medium text-gray-600 mb-6">
                            {product.category}
                        </p>
                        <p className="text-2xl font-bold mb-10">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                        </p>

                        <div className="mb-10 text-gray-700 leading-relaxed">
                            <p>
                                {product.description || "High-quality product designed for maximum comfort and performance every day."}
                            </p>
                        </div>

                        {/* TOMBOL AKSI */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-70 transition active:scale-95"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                Add To Cart
                            </button>

                            <button
                                onClick={handleFavorite}
                                className={`w-full border py-4 rounded-full font-bold flex items-center justify-center gap-2 transition active:scale-95 ${isFav
                                    ? "border-red-600 text-red-600"
                                    : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
                                    }`}
                            >
                                <Heart className={`h-5 w-5 ${isFav ? "fill-red-600" : ""}`} />
                                {isFav ? "In Favorites" : "Favorite"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-20 text-center border-t border-gray-100 text-gray-400 text-sm">
                © 2026 STINQ - All Rights Reserved
            </footer>
        </main>
    );
};

export default ProductDetail;