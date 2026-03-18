"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '@/lib/store';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CartPage = () => {
    const { items, removeItem, updateQuantity, getTotalPrice } = useCart();
    const [mounted, setMounted] = useState(false);

    // Mencegah Hydration Error (Sinkronisasi Server-Client)
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-white">

            <div className="max-w-[1100px] mx-auto px-4 md:px-12 pt-32 pb-40"> {/* Tambah pb-40 agar lega ke bawah */}
                <h1 className="text-2xl font-bold mb-10 tracking-tighter text-black">
                    Your Bag ({items.length})
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* 1. DAFTAR BARANG (Sisi Kiri) */}
                    <div className="lg:col-span-2 space-y-8">
                        {items.length === 0 ? (
                            <div className="py-10 border-t border-b border-gray-100">
                                <p className="text-gray-500 mb-4 text-lg">Your cart is currently empty.</p>
                                <Link href="/" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:opacity-70 transition uppercase text-sm">
                                    Start Shopping Now
                                </Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-8 group">
                                    {/* Gambar Produk */}
                                    <div className="relative h-32 w-32 md:h-44 md:w-44 bg-[#f6f6f6] rounded-sm overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image_url[0].startsWith('http') || item.image_url[0].startsWith('/') ? item.image_url[0] : `/${item.image_url[0]}`}
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
                                                <h3 className="text-lg font-bold text-black uppercase leading-tight">{item.name}</h3>
                                                <p className="font-bold text-black">Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <p className="text-gray-500 text-sm mt-1">{item.category}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex items-center border border-gray-200 rounded-full px-4 py-1.5 gap-6">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="hover:text-gray-400 transition"
                                                >
                                                    <Minus className="h-4 w-4 text-black" />
                                                </button>
                                                <span className="font-bold text-black text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="hover:text-gray-400 transition"
                                                >
                                                    <Plus className="h-4 w-4 text-black" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-600 transition"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 2. RINGKASAN HARGA (Sisi Kanan - Summary) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white"> {/* Summary akan tetap terlihat saat scroll */}
                            <h2 className="text-xl font-bold mb-8 text-black tracking-tighter">Summary</h2>
                            <div className="space-y-4 text-black">
                                <div className="flex justify-between font-medium">
                                    <span>Subtotal</span>
                                    <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Estimated Delivery & Handling</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <hr className="my-6 border-gray-100" />
                                <div className="flex justify-between font-black text-xl pt-2">
                                    <span>Total</span>
                                    <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            {/* TOMBOL CHECKOUT YANG SUDAH DIPERBAIKI */}
                            <Link href={items.length > 0 ? "/checkout" : "#"} className="block mt-10">
                                <button
                                    disabled={items.length === 0}
                                    className="w-full bg-black text-white py-5 rounded-full font-bold hover:opacity-70 transition active:scale-95 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Checkout
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </Link>

                            <p className="text-[11px] text-gray-400 mt-6 text-center leading-relaxed">
                                By clicking Checkout, you agree to our Terms of Use and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CartPage;