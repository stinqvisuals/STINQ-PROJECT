"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Heart, ShoppingBag, ChevronRight, ChevronLeft } from 'lucide-react';
import { useCart } from '@/lib/store';
import { useWishlist } from '@/lib/wish-list-store';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image_url: string[]; // Pastikan ini Array sesuai di Supabase kamu
    description?: string;
}

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>("");

    const { addItem } = useCart();
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
                // Set gambar pertama sebagai gambar utama saat pertama load
                if (data && data.image_url.length > 0) {
                    setActiveImage(data.image_url[0]);
                }
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
            toast.success(`${product.name} Added to Cart!`, { position: "bottom-center" });
        }
    };

    const handleFavorite = () => {
        if (product) {
            toggleFavorite(product);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold animate-pulse">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not Found.</div>;

    const isFav = favorites.some((item) => item.id === product.id);

    return (
        <main className="min-h-screen bg-white text-black pb-20">
            <Toaster />

            <div className="max-w-[1300px] mx-auto px-4 md:px-12 pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* --- BAGIAN KIRI: GALERI GAMBAR (Nike Style) --- */}
                    <div className="lg:col-span-8 flex flex-col-reverse md:flex-row gap-4">

                        {/* 1. List Thumbnail (Desktop: Samping, Mobile: Bawah) */}
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-visible no-scrollbar pb-4 md:pb-0">
                            {product.image_url.map((img, index) => (
                                <div
                                    key={index}
                                    onMouseEnter={() => setActiveImage(img)} // Ganti saat hover (Nike Style)
                                    onClick={() => setActiveImage(img)}      // Ganti saat klik (Mobile)
                                    className={`relative h-16 w-16 md:h-20 md:w-20 bg-[#f6f6f6] rounded-md overflow-hidden cursor-pointer transition-all duration-300 flex-shrink-0 ${activeImage === img ? "opacity-100" : "opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={img.startsWith('http') || img.startsWith('/') ? img : `/${img}`}
                                        alt={`thumb-${index}`}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 2. Main Image Display */}
                        <div className="relative aspect-square md:aspect-auto md:flex-1 bg-[#f6f6f6] overflow-hidden group">
                            <Image
                                src={activeImage.startsWith('http') || activeImage.startsWith('/') ? activeImage : `/${activeImage}`}
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-700 ease-in-out"
                                priority
                                unoptimized
                            />

                            {/* Tombol Navigasi Cepat (Optional) */}
                            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-white/80 rounded-full hover:bg-white"><ChevronLeft size={24} /></button>
                                <button className="p-2 bg-white/80 rounded-full hover:bg-white"><ChevronRight size={24} /></button>
                            </div>
                        </div>
                    </div>

                    {/* --- BAGIAN KANAN: INFO PRODUK --- */}
                    <div className="lg:col-span-4 flex flex-col space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-2">
                                {product.name}
                            </h1>
                            <p className="text-lg font-bold text-gray-800">{product.category}</p>
                            <p className="text-xl font-bold mt-4">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                            </p>
                        </div>

                        {/* DESKRIPSI */}
                        <div className="pt-6 border-t">
                            <h4 className="font-bold uppercase text-sm mb-4">Product Description</h4>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                {product.description || "Designed for maximum performance and everyday style. Built with high-quality materials to ensure durability and comfort."}
                            </p>
                        </div>

                        {/* TOMBOL AKSI */}
                        <div className="pt-8 space-y-4">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black text-white py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:opacity-80 transition active:scale-95 uppercase tracking-widest text-sm"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                Add to Cart
                            </button>

                            <button
                                onClick={handleFavorite}
                                className={`w-full border py-5 rounded-full font-bold flex items-center justify-center gap-3 transition active:scale-95 uppercase tracking-widest text-sm ${isFav ? "border-red-600 text-red-600" : "border-gray-200 text-black hover:border-black"
                                    }`}
                            >
                                <Heart className={`h-5 w-5 ${isFav ? "fill-red-600" : ""}`} />
                                {isFav ? "Favorite Added" : "Favorite"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer sederhana */}
            <footer className="py-20 text-center border-t border-gray-100 text-gray-400 text-sm mt-40">
                © 2026 STINQ - All Rigths Reserved
            </footer>
        </main>
    );
};

export default ProductDetail;