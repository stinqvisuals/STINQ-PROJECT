"use client";
import React, { useEffect, useState } from 'react';
import { useWishlist } from '@/lib/wish-list-store';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
    const { favorites, toggleFavorite } = useWishlist();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-32 pb-80 text-black">
                <h1 className="text-2xl font-bold mb-8 tracking-tighter">
                    Favorites ({favorites.length})
                </h1>

                {favorites.length === 0 ? (
                    <div className="py-20 text-center border-t">
                        <p className="text-gray-500 mb-6">Items added to your Favorites will be saved here.</p>
                        <Link href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-sm">
                            Find Something to Love
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {favorites.map((product) => (
                            <div key={product.id} className="group relative">
                                <Link href={`/product/${product.id}`}>
                                    <div className="relative aspect-[5/5] bg-[#f6f6f6] overflow-hidden mb-4">
                                        <Image
                                            src={product.image_url[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold">{product.name}</h3>
                                        <p className="text-gray-500 text-sm">{product.category}</p>
                                        <p className="font-bold pt-2">Rp {product.price.toLocaleString()}</p>
                                    </div>
                                </Link>
                                {/* Tombol Hapus dari Favorit */}
                                <button
                                    onClick={() => toggleFavorite(product)}
                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md"
                                >
                                    <Heart className="h-5 w-5 fill-red-600 text-red-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <footer className="py-20 text-center border-t border-gray-100 text-gray-400 text-sm">
                © 2026 STINQ - All Rights Reserved
            </footer>
        </main>
    );
};

export default FavoritesPage;