"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/lib/store';
import { useWishlist } from '@/lib/wish-list-store';
import toast, { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from '@/components/Footer';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image_url: string[];
    description?: string;
}

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>("");
    const [showSizeChart, setShowSizeChart] = useState(false);

    // STATE BARU: Untuk menyimpan ukuran yang dipilih
    const [selectedSize, setSelectedSize] = useState<string>("");

    const { addItem } = useCart();
    const { toggleFavorite, favorites } = useWishlist();

    const availableSizes = ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'];

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
            // VALIDASI: Cek apakah user sudah pilih ukuran
            if (!selectedSize) {
                toast.error("Please select a size!", {
                });
                return;
            }

            // Tambahkan ke cart dengan menyertakan size
            addItem({
                ...product,
                size: selectedSize
            });

            toast.success(`${product.name} (${selectedSize}) Added to bag`, {
            });
        }
    };

    const handleFavorite = () => {
        if (product) {
            toggleFavorite(product);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold animate-pulse text-xs uppercase tracking-widest">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center font-bold">Product not Found.</div>;

    const isFav = favorites.some((item) => item.id === product.id);

    return (
        <main className="min-h-screen bg-white text-black">
            <Toaster />
            <div className="max-w-[1300px] mx-auto px-4 md:px-12 pb-40 pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* --- BAGIAN KIRI: GALERI GAMBAR --- */}
                    <div className="lg:col-span-8 flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-visible no-scrollbar pb-4 md:pb-0">
                            {product.image_url.map((img, index) => (
                                <div
                                    key={index}
                                    onMouseEnter={() => setActiveImage(img)}
                                    onClick={() => setActiveImage(img)}
                                    className={`relative h-16 w-16 md:h-20 md:w-20 bg-[#f6f6f6] rounded-md overflow-hidden cursor-pointer transition-all duration-300 flex-shrink-0 ${activeImage === img ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
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

                        <div className="relative aspect-square md:flex-1 bg-[#f6f6f6] overflow-hidden">
                            <Image
                                src={activeImage.startsWith('http') || activeImage.startsWith('/') ? activeImage : `/${activeImage}`}
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-700 ease-in-out"
                                priority
                                unoptimized
                            />
                        </div>
                    </div>

                    {/* --- BAGIAN KANAN: INFO PRODUK --- */}
                    <div className="lg:col-span-4 flex flex-col space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-2">
                                {product.name}
                            </h1>
                            <p className="text-sm font-bold text-gray-400 tracking-widest">{product.category}</p>
                            <p className="text-xl font-black mt-4 tracking-tighter">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <h4 className="font-bold uppercase text-[10px] tracking-widest text-gray-400 mb-4">Product Description</h4>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {product.description || "Designed for maximum performance and everyday style. Built with high-quality materials to ensure durability and comfort."}
                            </p>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium uppercase text-[10px] tracking-widest">Select Size</span>
                            <button
                                onClick={() => setShowSizeChart(true)}
                                className="text-[10px] font-black underline uppercase tracking-widest hover:text-gray-400 transition"
                            >
                                Size Guide
                            </button>
                        </div>

                        {/* GRID SIZE DENGAN FEEDBACK VISUAL */}
                        <div className="grid grid-cols-3 gap-2">
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-4 text-xs font-bold border transition-all duration-200 rounded-md uppercase tracking-tighter
                                        ${selectedSize === size
                                            ? "border-black bg-black text-white shadow-lg scale-[1.02]"
                                            : "border-gray-100 text-black hover:border-black"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        {/* TOMBOL AKSI UTAMA */}
                        <div className="pt-8 space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black text-white py-6 rounded-full font-black flex items-center justify-center gap-3 hover:opacity-90 transition active:scale-95 uppercase tracking-[0.2em] text-[11px]"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Add to Bag
                            </button>

                            <button
                                onClick={handleFavorite}
                                className={`w-full border py-6 rounded-full font-black flex items-center justify-center gap-3 transition active:scale-95 uppercase tracking-[0.2em] text-[11px] ${isFav
                                    ? "border-red-600 text-red-600 bg-red-50/50"
                                    : "border-gray-600 text-black hover:border-gray-200"
                                    }`}
                            >
                                <Heart className={`h-4 w-4 ${isFav ? "fill-red-600" : ""}`} />
                                {isFav ? "In Wishlist" : "Favorite"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL SIZE CHART (Ditingkatkan) */}
            <AnimatePresence>
                {showSizeChart && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6"
                        onClick={() => setShowSizeChart(false)}
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                            className="bg-white p-10 max-w-xl w-full rounded-3xl text-black shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowSizeChart(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Size Guide</h2>
                                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Find your perfect fit</p>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-gray-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-black text-white text-[10px] uppercase font-black tracking-widest">
                                            <th className="p-4">EU</th><th className="p-4">US</th><th className="p-4">UK</th><th className="p-4">CM</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs font-bold">
                                        <tr className="border-b border-gray-50 hover:bg-gray-50"><td className="p-4">40</td><td className="p-4">7</td><td className="p-4">6</td><td className="p-4">25</td></tr>
                                        <tr className="border-b border-gray-50 hover:bg-gray-50"><td className="p-4">41</td><td className="p-4">8</td><td className="p-4">7</td><td className="p-4">26</td></tr>
                                        <tr className="border-b border-gray-50 hover:bg-gray-50"><td className="p-4">42</td><td className="p-4">9</td><td className="p-4">8</td><td className="p-4">27</td></tr>
                                        <tr className="border-b border-gray-50 hover:bg-gray-50"><td className="p-4">43</td><td className="p-4">10</td><td className="p-4">9</td><td className="p-4">28</td></tr>
                                        <tr className="border-b border-gray-50 hover:bg-gray-50"><td className="p-4">44</td><td className="p-4">11</td><td className="p-4">10</td><td className="p-4">29</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <p className="mt-6 text-[9px] font-bold text-gray-400 uppercase leading-relaxed text-center italic">
                                *Measurements are approximate. If you are between sizes, we recommend sizing up.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
};

export default ProductDetail;