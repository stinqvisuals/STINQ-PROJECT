"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error("Access Denied: " + error.message);
        } else {
            toast.success("Welcome back!");
            window.location.reload(); // Refresh untuk memicu pengecekan session
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <Toaster />
            <div className="max-w-md w-full border border-gray-100 p-10 rounded-3xl shadow-xl">
                <h2 className="text-4xl text-black font-black tracking-tighter mb-10">Stinq Admin</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-600">Email Address</label>
                        <input
                            type="email"
                            className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition-all text-black"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition-all text-black"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-full font-bold tracking-widest hover:opacity-75 transition active:scale-95 disabled:bg-gray-300"
                    >
                        {loading ? "Verifying..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}