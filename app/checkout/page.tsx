"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

declare global {
    interface Window {
        snap: any;
    }
}

const CheckoutPage = () => {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCart();

    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        setMounted(true);
        // Proteksi: Jika keranjang kosong saat masuk halaman ini
        if (mounted && items.length === 0) {
            router.push('/cart');
        }
    }, [mounted, items, router]);

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Simpan pesanan ke Supabase
            const { data, error } = await supabase
                .from('orders')
                .insert([{
                    full_name: formData.full_name,
                    phone: formData.phone,
                    address: formData.address,
                    total_amount: getTotalPrice(),
                    items: items,
                    status: 'pending'
                }])
                .select()
                .single();

            if (error) throw error;

            // 2. Minta Snap Token dari Backend API kita
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: `ORDER-${data.id}-${Date.now()}`,
                    totalAmount: getTotalPrice(),
                    customerDetails: formData,
                    items: items
                })
            });

            const result = await response.json();

            // Cek jika API mengembalikan error
            if (!response.ok) {
                throw new Error(result.error || "Token Payment Failed");
            }

            const token = result.token;

            // 3. Munculkan Pop-up Midtrans
            window.snap.pay(token, {
                onSuccess: function (result: any) {
                    toast.success("Payment Success!");
                    clearCart();
                    router.push('/');
                },
                onPending: function (result: any) {
                    toast("Waiting Your Payment...");
                    clearCart();
                    router.push('/');
                },
                onError: function (result: any) {
                    toast.error("Payment Failed!");
                },
                onClose: function () {
                    toast.error("Payment Window Closed.");
                }
            });

        } catch (err: any) {
            toast.error("Error: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted || items.length === 0) return null;

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-[1000px] mx-auto px-4 pt-32 pb-20 text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* FORM PENGIRIMAN */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 tracking-tighter">Delivery Information</h2>
                        <form onSubmit={handlePay} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.full_name} // Tambahkan value
                                    placeholder="Your Name"
                                    className="w-full border p-3 rounded-lg mt-1 outline-none focus:border-black transition"
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone} // Tambahkan value
                                    placeholder="Example: 08123456789"
                                    className="w-full border p-3 rounded-lg mt-1 outline-none focus:border-black transition"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Shipping Address</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.address} // Tambahkan value
                                    placeholder="Your Address"
                                    className="w-full border p-3 rounded-lg mt-1 outline-none focus:border-black transition"
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-full font-bold mt-4 hover:opacity-80 transition disabled:bg-gray-400 active:scale-95"
                            >
                                {loading ? "Processing..." : "Place Order & Pay"}
                            </button>
                        </form>
                    </div>

                    {/* RINGKASAN PESANAN */}
                    <div>
                        <h2 className="text-xl font-bold mb-6 tracking-tighter">Order Summary</h2>
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between py-3 text-sm border-b border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{item.name}</span>
                                        <span className="text-gray-500">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold text-lg pt-6 mt-2">
                                <span>Total Amount</span>
                                <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default CheckoutPage;