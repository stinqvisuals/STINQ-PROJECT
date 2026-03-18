"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useWishlist } from '@/lib/wish-list-store';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image_url: string[];
    tag?: string;
    description?: string;
    slug?: string;
}

const ProductGrid = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Ambil data wishlist dari store
    const { favorites, toggleFavorite } = useWishlist();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) throw error;
            if (data) setProducts(data);
        } catch (error: any) {
            console.error('Error fetching products:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center text-gray-600 py-20 font-bold">Collecting...</div>;

    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-12 py-16">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl text-black font-bold tracking-tight">Latest & Greatest</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-4">
                {products.map((product) => {
                    // CEK FAVORIT DI SINI (Di dalam map agar spesifik ke produk ini)
                    const isFav = favorites.some((item) => item.id === product.id);

                    const handleFavorite = (e: React.MouseEvent) => {
                        e.preventDefault(); // Mencegah pindah halaman saat klik hati
                        e.stopPropagation(); // Mencegah event "nge-link" ke detail produk
                        toggleFavorite(product);
                    };

                    return (
                        <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer relative">
                            <div className="relative aspect-[5/5] bg-[#f6f6f6] overflow-hidden mb-4">
                                <Image
                                    src={
                                        product.image_url[0].startsWith('http')
                                            ? product.image_url[0]
                                            : product.image_url[0].startsWith('/')
                                                ? product.image_url[0]
                                                : `/${product.image_url[0]}`
                                    }
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    unoptimized
                                />

                                {/* TOMBOL FAVORIT (HEART) */}
                                <button
                                    onClick={handleFavorite}
                                    className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all md:opacity-0 md:group-hover:opacity-100"
                                >
                                    <Heart
                                        className={`h-5 w-5 transition-colors ${isFav ? "fill-red-600 text-red-600" : "text-black"
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-medium text-black">{product.name}</h3>
                                <p className="text-gray-500 text-sm">{product.category}</p>
                                <p className="font-bold text-black pt-2">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default ProductGrid;