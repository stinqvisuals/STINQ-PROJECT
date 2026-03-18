"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Users, DollarSign, Package } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            // Ambil data pesanan
            const { data: orders } = await supabase.from('orders').select('total_amount');
            // Ambil jumlah produk
            const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

            if (orders) {
                const revenue = orders.reduce((acc, curr) => acc + curr.total_amount, 0);
                setStats({
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    totalProducts: productCount || 0
                });
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="text-black pb-80">
            <h1 className="text-3xl font-black tracking-tighter mb-8">
                Admin Dashboard
            </h1>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Revenue</p>
                        <p className="text-2xl font-black">Rp {stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Orders</p>
                        <p className="text-2xl font-black">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Products</p>
                        <p className="text-2xl font-black">{stats.totalProducts}</p>
                    </div>
                </div>
            </div>

            <div className="mt-10 p-8 bg-black text-white rounded-3xl">
                <h2 className="text-xl font-bold mb-2">Welcome back, Admin! 🚀</h2>
                <p className="text-gray-400">Manage Your Web Page.</p>
            </div>
        </div>
    );
}