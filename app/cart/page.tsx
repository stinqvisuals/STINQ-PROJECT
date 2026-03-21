"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '@/lib/store';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CartPage = () => {
    // Ambil fungsi yang sudah kita update di store.ts
    const { items, removeItem, updateQuantity, getTotalPrice } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-[1100px] mx-auto px-4 md:px-12 pt-32 pb-40">
                <h1 className="text-3xl font-black mb-10 tracking-tighter text-black">
                    Your Bag ({items.length})
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* 1. DAFTAR BARANG (Sisi Kiri) */}
                    <div className="lg:col-span-2 space-y-8">
                        {items.length === 0 ? (
                            <div className="py-10 border-t border-b border-gray-100">
                                <p className="text-gray-400 mb-6 font-bold tracking-widest text-sm">Your cart is currently empty.</p>
                                <Link href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase hover:opacity-75 transition text-sm">
                                    Start Shopping Now
                                </Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                // KEY: Menggunakan gabungan ID dan SIZE agar unik
                                <div key={`${item.id}-${item.size}`} className="flex gap-6 border-b border-gray-100 pb-8 group">

                                    {/* Gambar Produk */}
                                    <div className="relative h-32 w-32 md:h-44 md:w-44 bg-[#f6f6f6] rounded-sm overflow-hidden flex-shrink-0">
                                        <Image
                                            // Handle jika image_url string atau array
                                            src={Array.isArray(item.image_url)
                                                ? (item.image_url[0].startsWith('http') ? item.image_url[0] : `/${item.image_url[0]}`)
                                                : (item.image_url.startsWith('http') ? item.image_url : `/${item.image_url}`)
                                            }
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>

                                    {/* Info & Kontrol */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm md:text-lg font-black text-black uppercase leading-tight tracking-tighter">{item.name}</h3>
                                                <p className="font-black text-black text-sm md:text-base">Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">{item.category}</p>

                                            {/* DISPLAY SIZE BARU */}
                                            <div className="mt-2 text-gray-600 inline-block bg-gray-100 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                                                Size: <span className="text-black">{item.size}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex items-center border border-gray-100 rounded-full px-4 py-1.5 gap-6 shadow-sm">
                                                <button
                                                    // UPDATE: Kirim parameter SIZE
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                    className="hover:text-gray-400 transition"
                                                >
                                                    <Minus className="h-3 w-3 text-black" />
                                                </button>
                                                <span className="font-black text-black text-xs">{item.quantity}</span>
                                                <button
                                                    // UPDATE: Kirim parameter SIZE
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                    className="hover:text-gray-400 transition"
                                                >
                                                    <Plus className="h-3 w-3 text-black" />
                                                </button>
                                            </div>
                                            <button
                                                // UPDATE: Kirim parameter SIZE
                                                onClick={() => removeItem(item.id, item.size)}
                                                className="text-gray-300 hover:text-red-600 transition p-2"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 2. SUMMARY (Sisi Kanan) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white border border-gray-100 p-8 w-90 rounded-3xl shadow-sm">
                            <h2 className="text-2xl font-black mb-8 text-black tracking-tighter">Summary</h2>
                            <div className="space-y-4 text-black">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-black">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <hr className="my-6 border-gray-100" />
                                <div className="flex justify-between font-black text-2xl pt-2 tracking-tighter">
                                    <span>Total</span>
                                    <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <Link href={items.length > 0 ? "/checkout" : "#"} className="block mt-10">
                                <button
                                    disabled={items.length === 0}
                                    className="w-full bg-black text-white py-6 rounded-full font-black hover:opacity-80 transition active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[11px] shadow-xl"
                                >
                                    Checkout
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>

                            <div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-30">
                                <Image src="/Untitled-3.svg" alt="STINQ" width={40} height={20} />
                                <span className="text-[8px] text-black font-bold uppercase tracking-[0.3em]">Official Store</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CartPage;