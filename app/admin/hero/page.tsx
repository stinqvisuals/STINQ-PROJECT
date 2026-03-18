"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

interface HeroSlide {
    id: number;
    title: string;
    subtitle: string[]; // Sesuaikan dengan tipe data di Supabase kamu
    image_url: string;
    link_url: string;
}

export default function ManageHero() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [form, setForm] = useState({ title: '', subtitle: '', image_url: '', link_url: '' });

    const fetchHero = async () => {
        const { data, error } = await supabase
            .from('hero')
            .select('*');

        if (error) {
            console.error(error);
        } else if (data) {
            setSlides(data as HeroSlide[]); // 3. Gunakan Type Casting 'as'
        }
    };

    useEffect(() => { fetchHero(); }, []);

    const handleAddHero = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('hero').insert([{
            title: form.title,
            subtitle: [form.subtitle], // Simpan sebagai array [ "Teks" ]
            image_url: form.image_url,
            link_url: form.link_url
        }]);

        if (!error) {
            toast.success("Hero Slide Added!");
            fetchHero();
        }
    };

    return (
        <div className="pb-60">
            <Toaster />
            <h1 className="text-2xl font-bold mb-6 text-black">Manage Hero</h1>

            <form onSubmit={handleAddHero} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 mb-10 text-black">
                <input placeholder="Main Title (Example: STINQ WORLD)" className="w-full border p-2 rounded" onChange={e => setForm({ ...form, title: e.target.value })} required />
                <input placeholder="Subtitle" className="w-full border p-2 rounded" onChange={e => setForm({ ...form, subtitle: e.target.value })} required />
                <input placeholder="Image Path (Example: /Artboard1.png)" className="w-full border p-2 rounded" onChange={e => setForm({ ...form, image_url: e.target.value })} required />
                <input placeholder="Link To Category (Example: Men)" className="w-full border p-2 rounded" onChange={e => setForm({ ...form, link_url: e.target.value })} required />
                <button className="bg-black text-white px-6 py-2 rounded font-bold hover:opacity-75 transition">Add Banner</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {slides.map((s: any) => (
                    <div key={s.id} className="border p-4 rounded bg-white relative">
                        <img src={s.image_url} alt="hero" className="w-full h-32 object-cover mb-2" />
                        <p className="font-bold text-black">{s.title}</p>
                        <button onClick={async () => {
                            await supabase.from('hero').delete().eq('id', s.id);
                            fetchHero();
                        }} className="text-red-500 text-xs font-bold mt-2 hover:opacity-75 transition cursor-pointer">Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
}