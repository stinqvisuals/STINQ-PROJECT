"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, Image as ImageIcon, Home, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLogin from '@/components/AdminLogin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ambil session saat ini
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Dengarkan perubahan auth (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black">Checking Credentials...</div>;

    // JIKA BELUM LOGIN, TAMPILKAN HALAMAN LOGIN
    if (!session) {
        return <AdminLogin />;
    }

    // JIKA SUDAH LOGIN, TAMPILKAN DASHBOARD DENGAN SIDEBAR
    return (
        <div className="flex min-h-screen bg-gray-50 text-black">
            {/* SIDEBAR */}
            <aside className="w-64 bg-black text-white p-6 hidden md:flex flex-col">
                <nav className="space-y-4 flex-1">
                    <Link href="/admin" className="flex items-center gap-3 hover:text-gray-400 transition"><LayoutDashboard size={20} /> Dashboard</Link>
                    <Link href="/admin/products" className="flex items-center gap-3 hover:text-gray-400 transition"><Package size={20} /> Manage Products</Link>
                    <Link href="/admin/hero" className="flex items-center gap-3 hover:text-gray-400 transition"><ImageIcon size={20} /> Manage Hero</Link>
                    <hr className="border-gray-800 my-6" />
                    <Link href="/" className="flex items-center gap-3 hover:text-gray-400 transition"><Home size={20} /> Back to Store</Link>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-500 font-bold hover:text-red-400 transition mt-auto"
                >
                    <LogOut size={20} /> Log Out
                </button>
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}