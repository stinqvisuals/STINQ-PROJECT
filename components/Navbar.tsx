"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/lib/wish-list-store';

// --- 1. VARIABEL ANIMASI ---
const menuVariants: Variants = {
    closed: {
        y: "-100%",
        transition: { duration: 0.5, ease: [0.6, 0.05, -0.01, 0.9] }
    },
    open: {
        y: 0,
        transition: { duration: 0.5, ease: [0.6, 0.05, -0.01, 0.9] }
    }
};

const linkVariants: Variants = {
    closed: { opacity: 0, y: -20 },
    open: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.2 + (i * 0.1),
            duration: 0.4
        }
    })
};

const Navbar = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const items = useCart((state) => state.items);
    const favorites = useWishlist((state) => state.favorites);
    const [mounted, setMounted] = useState(false);

    // --- FUNGSI SEARCH (DIPERBAIKI) ---
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Mengarahkan ke halaman search dengan query
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false); // Tutup bar setelah mencari
            setSearchQuery("");      // Reset input
        }
    };

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartCount = mounted ? items.reduce((total, item) => total + item.quantity, 0) : 0;
    const favCount = mounted ? favorites.length : 0;

    return (
        <nav className={`w-full z-[100] transition-all duration-300 ${isScrolled ? "fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-sm py-2" : "relative bg-white"}`}>
            <div className="relative max-w-[1440px] mx-auto px-4 md:px-12 flex justify-between items-center h-[60px] md:h-[70px]">

                {/* LOGO */}
                <Link href="/" className="z-[160] flex-shrink-0 hover:opacity-50 transition">
                    <Image src="/Untitled-3.svg" alt="Logo" width={60} height={30} className="object-contain" priority />
                </Link>

                {/* DESKTOP NAVIGATION */}
                <div className="hidden md:flex items-center gap-8 font-bold text-sm text-black absolute left-1/2 -translate-x-1/2 tracking-tighter">
                    <Link href="/category/new" className="hover:opacity-50 transition">New Arrival</Link>
                    <Link href="/category/men" className="hover:opacity-50 transition">Men</Link>
                    <Link href="/category/women" className="hover:opacity-50 transition">Women</Link>
                    <Link href="/category/kids" className="hover:opacity-50 transition">Kids</Link>
                    <Link href="/category/sale" className="hover:opacity-50 transition">Sale</Link>
                </div>

                {/* RIGHT ICONS */}
                <div className="flex items-center gap-1 md:gap-4 z-[160]">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setIsSearchOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
                    >
                        <Search className="h-6 w-6 text-black" />
                    </button>

                    <Link href="/favorites" className="p-2 hover:bg-gray-100 rounded-full transition relative">
                        <Heart className={`h-6 w-6 ${favCount > 0 ? "fill-transparent text-black" : "text-black"}`} />
                        {favCount > 0 && (
                            <span className="absolute top-2 right-2 bg-red-600 w-2 h-2 rounded-full border border-white"></span>
                        )}
                    </Link>

                    <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
                        <ShoppingBag className="h-6 w-6 text-black" />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button
                        className="md:hidden p-2 text-black transition-transform active:scale-90"
                        onClick={() => {
                            setIsSearchOpen(false);
                            setIsOpen(!isOpen);
                        }}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* --- MOBILE MENU & SEARCH OVERLAY --- */}
            <AnimatePresence mode="wait">

                {/* ================= SEARCH OVERLAY (DIPERBAIKI) ================= */}
                {isSearchOpen && (
                    <>
                        <motion.div
                            key="search-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[140]"
                        />

                        <motion.div
                            key="search"
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed top-0 left-0 w-full bg-white z-[150] shadow-2xl p-6 md:p-10"
                        >
                            <form onSubmit={handleSearchSubmit} className="flex items-center gap-4 text-black py-8 max-w-[1440px] mx-auto">
                                <Search size={28} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full border-b border-black outline-none text-2xl md:text-1xl font-medium tracking-tighter py-2 placeholder:text-gray-600"
                                />

                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition"
                                >
                                    <X size={32} />
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}

                {/* ================= HAMBURGER MENU ================= */}
                {isOpen && (
                    <>
                        <motion.div
                            key="menu-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[140] md:hidden"
                        />

                        <motion.div
                            key="menu"
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed top-0 left-0 w-full bg-white z-[150] shadow-2xl p-8 pt-24 md:hidden"
                        >
                            <div className="flex flex-col gap-6 mb-8">
                                {['New Arrival', 'Men', 'Women', 'Kids', 'Sale'].map((item, i) => (
                                    <motion.div
                                        key={item}
                                        custom={i}
                                        variants={linkVariants}
                                    >
                                        <Link
                                            href={item === 'Sale'
                                                ? '/category/sale'
                                                : `/category/${item.toLowerCase().replace(' arrival', '')}`}
                                            onClick={() => setIsOpen(false)}
                                            className={`text-2xl font-bold tracking-tighter block ${item === 'Sale' ? 'text-black' : 'text-black'}`}
                                        >
                                            {item}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;