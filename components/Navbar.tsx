"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/store';
import { useWishlist } from '@/lib/wish-list-store'; // 1. IMPORT WISHLIST STORE

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // 2. AMBIL DATA DARI STORE
    const items = useCart((state) => state.items);
    const favorites = useWishlist((state) => state.favorites); // Ambil data favorit

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. HITUNG JUMLAH (Hanya jika sudah mounted di browser)
    const cartCount = mounted
        ? items.reduce((total, item) => total + item.quantity, 0)
        : 0;

    const favCount = mounted ? favorites.length : 0; // Hitung jumlah favorit

    return (
        <nav
            className={`w-full z-[100] transition-all duration-300 ${isScrolled
                ? "fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-sm py-2"
                : "relative bg-white py-0"
                }`}
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex justify-between items-center h-[60px] md:h-[70px]">

                {/* 1. LOGO */}
                <div className="flex-shrink-0 cursor-pointer">
                    <Link href="/">
                        <Image
                            src="/Untitled-3.svg"
                            alt="Logo"
                            width={60}
                            height={30}
                            className="object-contain transition-all hover:opacity-50"
                            priority
                        />
                    </Link>
                </div>

                {/* 2. NAVIGATION LINKS */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8 font-semibold text-black text-[15px]">
                    <Link href="/category/featured" className="... hover:opacity-50 transition duration-200">New & Featured</Link>
                    <Link href="/category/men" className="... hover:opacity-50 transition duration-200">Men</Link>
                    <Link href="/category/women" className="... hover:opacity-50 transition duration-200">Women</Link>
                    <Link href="/category/kids" className="... hover:opacity-50 transition duration-200">Kids</Link>
                    <Link href="/category/sale" className="... hover:opacity-50 transition duration-200">Sale</Link>
                </div>

                {/* 3. SEARCH & ICONS */}
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden md:flex relative group text-black">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-700" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-[#f5f5f5] rounded-full text-gray-600 py-2 pl-10 pr-4 w-32 focus:w-60 transition-all outline-none text-sm font-medium"
                        />
                    </div>

                    {/* --- WISHLIST ICON DENGAN BADGE --- */}
                    <Link href="/favorites" className="p-2 hover:bg-gray-100 rounded-full transition relative">
                        <Heart className="h-6 w-6 text-black" />
                        {/* 4. PERBAIKAN: Gunakan favCount yang sudah didefinisikan */}
                        {favCount > 0 && (
                            <span className="absolute top-2 right-2 bg-black w-2 h-2 rounded-full border border-white"></span>
                        )}
                    </Link>

                    {/* Cart Icon */}
                    <Link href="/cart" className="p-2 relative hover:bg-gray-100 rounded-full transition group">
                        <ShoppingBag className="h-6 w-6 text-black" />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold animate-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Hamburger Menu */}
                    <button className="md:hidden p-2 text-black" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                    </button>
                </div>
            </div>

            {/* --- MOBILE MENU --- */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 bg-white z-[150] p-6 flex flex-col animate-in slide-in-from-right duration-300 text-black">
                    <div className="flex justify-end">
                        <button onClick={() => setIsOpen(false)}>
                            <X className="h-8 w-8 text-black" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-8 mt-10 text-2xl font-bold uppercase italic tracking-tighter">
                        <Link href="#" onClick={() => setIsOpen(false)}>New & Featured</Link>
                        <Link href="#" onClick={() => setIsOpen(false)}>Men</Link>
                        <Link href="#" onClick={() => setIsOpen(false)}>Women</Link>
                        <Link href="#" onClick={() => setIsOpen(false)}>Kids</Link>
                        <Link href="#" onClick={() => setIsOpen(false)} className="text-red-600">Sale</Link>
                        {/* Tambahan Link Favorit di Mobile */}
                        <Link href="/favorites" onClick={() => setIsOpen(false)}>Favorites ({favCount})</Link>
                    </div>

                    <div className="mt-auto border-t pt-6 space-y-4">
                        <p className="text-gray-500 font-medium">Become a Member</p>
                        <button className="w-full bg-black text-white py-3 rounded-full font-bold">Sign In</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;