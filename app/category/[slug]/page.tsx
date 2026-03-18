"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/lib/wish-list-store';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image_url: string[];
    tag?: string;
}

const CategoryPage = () => {
    const { slug } = useParams(); // Mengambil 'men', 'women', dsb dari URL
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { favorites, toggleFavorite } = useWishlist();
    const decodedSlug = decodeURIComponent(slug as string);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                let query = supabase.from('products').select('*');

                // Logika Filter Spesial
                if (slug === 'sale') {
                    // Jika kategori 'sale', cari yang punya tag 'SALE' atau tidak null
                    query = query.not('tag', 'is', null).neq('tag', 'EMPTY');
                } else if (slug === 'featured') {
                    // Jika 'featured', ambil semua atau yang bertag 'featured'
                    query = query.order('created_at', { ascending: false });
                } else {
                    // Filter berdasarkan kolom category di Supabase (men, women, kids)
                    query = query.ilike('category', `%${slug}%`);
                }

                const { data, error } = await query;
                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchCategoryProducts();
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;

    return (
        <main className="min-h-screen bg-white text-black">

            <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-32 pb-80">
                {/* Judul Kategori */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black tracking-tighter">
                        {slug === 'featured'
                            ? 'New & Featured'
                            : `${decodedSlug.replace(/\./g, '')} collection`}
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm font-medium">
                        Showing {products.length} Results
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="py-20 text-center border-t">
                        <p className="text-gray-400">No products found in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-4">
                        {products.map((product) => {
                            const isFav = favorites.some(f => f.id === product.id);

                            return (
                                <div key={product.id} className="group relative">
                                    <Link href={`/product/${product.id}`}>
                                        <div className="relative aspect-[5/5] bg-[#f6f6f6] overflow-hidden mb-4">
                                            <Image
                                                src={product.image_url[0].startsWith('http') || product.image_url[0].startsWith('/')
                                                    ? product.image_url[0] : `/${product.image_url[0]}`}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-sm md:text-base tracking-tight">{product.name}</h3>
                                            <p className="text-gray-500 text-xs md:text-sm">{product.category}</p>
                                            <p className="font-bold pt-2">
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </Link>

                                    {/* Tombol Favorit */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleFavorite(product);
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow-sm z-10"
                                    >
                                        <Heart className={`h-5 w-5 ${isFav ? "fill-red-600 text-red-600" : "text-black"}`} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <footer className="py-20 text-center border-t border-gray-100 text-gray-400 text-sm">
                © 2026 STINQ - All Rights Reserved
            </footer>
        </main>
    );
};

export default CategoryPage;