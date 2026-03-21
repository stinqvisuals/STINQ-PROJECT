"use client";
import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Youtube, Globe } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleJoin = async () => {
        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        const { error } = await supabase.from('members').insert([{ email }]);

        if (error) {
            if (error.code === '23505') {
                toast.error("This email is already joined!");
            } else {
                toast.error("Something went wrong. Try again.");
            }
        } else {
            toast.success("Welcome to the STINQ world!");
            setEmail("");
        }
        setIsSubmitting(false);
    };
    return (
        <footer className="bg-white text-black pt-20 pb-10 border-t border-gray-100">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

                    {/* KOLOM 1: BRAND */}
                    <div className="space-y-4">
                        <Image src="/Untitled-3.svg" alt="Logo" width={90} height={60} className="object-contain" priority />
                        <p className="text-[11px] font-bold text-gray-400 uppercase leading-loose tracking-widest">
                            Defined by quality.<br />Driven by visuals.<br />Made for the bold.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Instagram size={20} className="cursor-pointer hover:opacity-50 transition" />
                            <Twitter size={20} className="cursor-pointer hover:opacity-50 transition" />
                            <Facebook size={20} className="cursor-pointer hover:opacity-50 transition" />
                        </div>
                    </div>

                    {/* KOLOM 2: SHOP */}
                    <div>
                        <h4 className="font-black mb-6 tracking-tight text-sm">Shop</h4>
                        <ul className="space-y-4 text-xs font-bold text-gray-500 tracking-tighter">
                            <li><Link href="/category/new" className="hover:text-black transition">New Arrival</Link></li>
                            <li><Link href="/category/men" className="hover:text-black transition">Men</Link></li>
                            <li><Link href="/category/women" className="hover:text-black transition">Women</Link></li>
                            <li><Link href="/category/kids" className="hover:text-black transition">Kids</Link></li>
                            <li><Link href="/category/sale" className="hover:text-black transition">Sale</Link></li>
                        </ul>
                    </div>

                    {/* KOLOM 3: SUPPORT */}
                    <div>
                        <h4 className="font-black mb-6 tracking-tight text-sm">Get Help</h4>
                        <ul className="space-y-4 text-xs font-bold text-gray-500 tracking-tighter">
                            <li><Link href="/contact" className="hover:text-black transition">Contact Us</Link></li>
                            <li><Link href="/about" className="hover:text-black transition">About Us</Link></li>
                            <li><Link href="/terms" className="hover:text-black transition">Terms of Sale</Link></li>
                            <li><Link href="/privacy" className="hover:text-black transition">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* KOLOM 4: NEWSLETTER - Bagian yang diubah */}
                    <div>
                        <h4 className="font-black mb-6 tracking-tight text-sm">Join Us</h4>
                        <p className="text-[11px] text-gray-400 font-bold uppercase mb-4 leading-relaxed">
                            Subscribe to get special offers and once-in-a-lifetime deals.
                        </p>
                        <div className="flex border-b-2 border-black pb-2">
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-transparent outline-none text-[11px] font-bold w-full uppercase"
                            />
                            <button
                                onClick={handleJoin}
                                disabled={isSubmitting}
                                className="text-[11px] font-black uppercase ml-2 hover:opacity-50 transition disabled:opacity-30"
                            >
                                {isSubmitting ? "..." : "Join"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-10 gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <Globe size={14} />
                        <span>Indonesia</span>
                        <span className="ml-4">© 2026 STINQ WORLD, Inc. All Rights Reserved</span>
                    </div>

                    <div className="flex gap-6 text-[10px] font-bold uppercase text-gray-400 tracking-tighter">
                        <Link href="/terms" className="hover:text-black transition">Guides</Link>
                        <Link href="/terms" className="hover:text-black transition">Terms of Use</Link>
                        <Link href="/privacy" className="hover:text-black transition">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;