"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/lib/wish-list-store';
import Footer from '@/components/Footer';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image_url: string[];
    tag?: string;
}

const SearchContent = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    // Gunakan satu state saja untuk menampung data
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { favorites, toggleFavorite } = useWishlist();

    useEffect(() => {
        const fetchSearch = async () => {
            setLoading(true);
            if (!query) return;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .ilike('name', `%${query}%`);

            if (!error && data) {
                // SIMPAN KE STATE products
                setProducts(data as Product[]);
            }
            setLoading(false);
        };

        fetchSearch();
    }, [query]);

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-bold uppercase animate-pulse">Searching for "{query}"...</div>;

    return (
        <main className="bg-white min-h-screen">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-32 pb-20 bg-white text-black">
                <h1 className="text-3xl font-black tracking-tighter mb-10">
                    Results for: "{query}" ({products.length})
                </h1>

                {products.length === 0 ? (
                    <div className="py-20 text-center border-t border-gray-100 bg-white">
                        <p className="text-gray-400 mb-6">We couldn't find anything matching your search.</p>
                        <Link href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase hover:opacity-75 transition text-sm">
                            Start Shopping Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 bg-white">
                        {products.map((product) => {
                            // Cek apakah item ini favorit
                            const isFav = favorites.some(f => f.id === product.id);

                            return (
                                <div key={product.id} className="group relative bg-white">
                                    <Link href={`/product/${product.id}`} className="block cursor-pointer">
                                        <div className="relative aspect-square bg-[#f6f6f6] overflow-hidden mb-4">
                                            <Image
                                                src={product.image_url && product.image_url[0]
                                                    ? (product.image_url[0].startsWith('http') || product.image_url[0].startsWith('/')
                                                        ? product.image_url[0] : `/${product.image_url[0]}`)
                                                    : '/placeholder.png'
                                                }
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-sm md:text-base tracking-tight leading-tight">{product.name}</h3>
                                            <p className="text-gray-400 text-xs md:text-sm font-medium">{product.category}</p>
                                            <p className="font-bold pt-2 text-black">
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </Link>

                                    {/* Tombol Favorit yang berfungsi */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleFavorite(product);
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm z-10 hover:bg-white transition-all active:scale-90"
                                    >
                                        <Heart
                                            className={`h-5 w-5 transition-colors ${isFav ? "fill-red-600 text-red-600" : "text-black"
                                                }`}
                                        />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
};

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-bold italic">LOADING...</div>}>
            <SearchContent />
        </Suspense>
    );
}