"use client";
import React, { useState } from 'react';
import { Mail, Instagram } from 'lucide-react';
import Footer from '@/components/Footer';
import toast, { Toaster } from 'react-hot-toast';

export default function ContactPage() {
    // 1. Tambahkan state untuk menampung input user
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    // 2. Fungsi Kirim Pesan ke API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Message sent! We'll be in touch.", {
                });
                // Reset form setelah berhasil
                setFormData({ name: '', email: '', message: '' });
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-black">
            <div className="max-w-[1000px] mx-auto px-6 pt-40 pb-20 grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter mb-6">Contact Us</h1>
                    <p className="mb-10 text-gray-500 font-bold tracking-widest text-xs uppercase">Get in touch with the team</p>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4 group">
                            <div className="p-4 bg-black text-white rounded-full transition group-hover:scale-110"><Mail size={24} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                <p className="font-bold">support@stinqworld.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-4 bg-black text-white rounded-full transition group-hover:scale-110"><Instagram size={24} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Official Instagram</p>
                                <p className="font-bold">@stinq.visuals</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FORM (Sudah Dihubungkan) */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            required
                            type="text"
                            placeholder="YOUR NAME"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border-b-2 border-gray-100 py-4 outline-none focus:border-black transition font-bold uppercase text-sm"
                        />
                    </div>
                    <div>
                        <input
                            required
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border-b-2 border-gray-100 py-4 outline-none focus:border-black transition font-bold uppercase text-sm"
                        />
                    </div>
                    <div>
                        <textarea
                            required
                            placeholder="HOW CAN WE HELP?"
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full border-b-2 border-gray-100 py-4 outline-none focus:border-black transition font-bold uppercase text-sm resize-none"
                        ></textarea>
                    </div>
                    <button
                        disabled={loading}
                        className="bg-black text-white w-full py-5 rounded-full font-black tracking-widest text-sm hover:opacity-75 transition active:scale-95 disabled:opacity-75"
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
            <Footer />
        </main>
    );
}