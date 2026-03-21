"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Image as ImageIcon,
    Home,
    LogOut,
    Menu,
    X,
    Users
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLogin from '@/components/AdminLogin';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk mobile menu
    const pathname = usePathname();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black bg-white text-black">Authenticating...</div>;

    if (!session) return <AdminLogin />;

    // Komponen Navigasi agar tidak duplikat kode
    const NavLinks = () => (
        <nav className="space-y-2 flex-1">
            {[
                { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
                { name: 'Manage Products', href: '/admin/products', icon: Package },
                { name: 'Manage Hero', href: '/admin/hero', icon: ImageIcon },
                { name: 'Manage Members', href: '/admin/members', icon: Users },
            ].map((item) => (
                <Link
                    key={item.name}
                    href={item.icon === Home ? '/' : item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${pathname === item.href
                        ? "bg-white text-black shadow-md"
                        : "hover:bg-white/10 text-gray-400"
                        }`}
                >
                    <item.icon size={20} />
                    {item.name}
                </Link>
            ))}

            <hr className="border-white/10 my-6" />

            <Link href="/" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white transition font-bold text-sm">
                <Home size={20} /> Back to Store
            </Link>
        </nav>
    );

    return (
        <div className="flex min-h-screen bg-white text-black">

            {/* --- SIDEBAR DESKTOP (Selalu Muncul di Layar Besar) --- */}
            <aside className="w-72 bg-black text-white p-6 hidden lg:flex flex-col sticky top-0 h-screen">
                <NavLinks />
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-500/10 rounded-xl transition mt-auto text-sm"
                >
                    <LogOut size={20} /> Sign Out
                </button>
            </aside>

            {/* --- MOBILE HEADER (Hanya Muncul di HP) --- */}
            <div className="lg:hidden fixed top-0 left-0 w-full bg-black text-white p-4 flex justify-between items-center z-[200]">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/10 rounded-lg">
                    <Menu size={24} />
                </button>
            </div>

            {/* --- SIDEBAR MOBILE (Drawer Overlay) --- */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[210] lg:hidden"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-[80%] max-w-sm h-full bg-black text-white z-[220] p-6 flex flex-col lg:hidden shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/10 rounded-lg">
                                    <X size={24} />
                                </button>
                            </div>
                            <NavLinks />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 p-4 text-red-500 font-bold mt-auto border-t border-white/10 pt-6"
                            >
                                <LogOut size={20} /> Sign Out
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 p-6 lg:p-10 pt-24 lg:pt-10 overflow-x-hidden min-h-screen">
                {children}
            </main>
        </div>
    );
}