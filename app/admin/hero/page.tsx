"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import { Upload, X, Loader2, Plus, Image as ImageIcon } from 'lucide-react';

interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    image_url: string;
    link_url: string;
}

export default function ManageHero() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        link_url: ''
    });

    const fetchHero = async () => {
        const { data, error } = await supabase
            .from('hero')
            .select('*')
            .order('id', { ascending: true });

        if (error) console.error(error);
        else if (data) setSlides(data as HeroSlide[]);
    };

    useEffect(() => { fetchHero(); }, []);

    // Handle saat memilih gambar banner
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleAddHero = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            return toast.error("Please upload a banner image");
        }

        setUploading(true);
        const toastId = toast.loading("Uploading banner...");

        try {
            // 1. Upload ke Supabase Storage (Bucket: product-images)
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `hero-${Math.random()}.${fileExt}`;
            const filePath = `hero/${fileName}`; // Kita taruh di folder hero agar rapi

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, selectedFile);

            if (uploadError) throw uploadError;

            // 2. Ambil Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            // 3. Simpan ke Tabel Hero
            const { error: dbError } = await supabase.from('hero').insert([{
                title: form.title,
                subtitle: [form.subtitle],
                image_url: publicUrl,
                link_url: form.link_url
            }]);

            if (dbError) throw dbError;

            toast.success("New Hero Banner Added!", { id: toastId });

            // Reset Form
            setForm({ title: '', subtitle: '', link_url: '' });
            setSelectedFile(null);
            setPreview(null);
            fetchHero();

        } catch (error: any) {
            toast.error("Error: " + error.message, { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const deleteHero = async (id: number) => {
        if (!confirm("Are you sure you want to remove this banner?")) return;

        const { error } = await supabase.from('hero').delete().eq('id', id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Banner Removed");
            fetchHero();
        }
    };

    return (
        <div className="pb-40 text-black">
            <Toaster />
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-black tracking-tighter">Manage Hero Sections</h1>
                <div className="text-[10px] font-black bg-black text-white px-4 py-2 rounded-full uppercase tracking-widest">
                    {slides.length} Active Banners
                </div>
            </div>

            {/* FORM TAMBAH HERO */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-12">
                <h2 className="text-xl font-bold mb-8 tracking-tighter flex items-center gap-2">
                    <Plus size={20} /> Create New Slide
                </h2>

                <form onSubmit={handleAddHero} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Main Title</label>
                            <input
                                placeholder="e.g. Stinq World Ocean"
                                className="w-full border-b-2 border-gray-100 text-gray-500 p-3 outline-none focus:border-black transition font-bold uppercase tracking-tighter text-xl"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Subtitle</label>
                            <input
                                placeholder="e.g. Defined by Quality"
                                className="w-full border-b-2 text-gray-500 border-gray-100 p-3 outline-none focus:border-black transition font-bold"
                                value={form.subtitle}
                                onChange={e => setForm({ ...form, subtitle: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Redirect Category (Slug)</label>
                            <input
                                placeholder="e.g. men or women"
                                className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition font-bold text-gray-500"
                                value={form.link_url}
                                onChange={e => setForm({ ...form, link_url: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* UPLOAD SECTION */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Banner Image</label>
                        <div className="relative group">
                            {!preview ? (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer hover:bg-gray-50 hover:border-black transition-all">
                                    <ImageIcon className="w-10 h-10 text-gray-200 group-hover:text-black mb-3 transition" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black">Click to Upload Banner</p>
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            ) : (
                                <div className="relative w-full h-64 rounded-3xl overflow-hidden border border-gray-100">
                                    <img src={preview} className="w-full h-full object-cover" alt="preview" />
                                    <button
                                        type="button"
                                        onClick={() => { setPreview(null); setSelectedFile(null); }}
                                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        disabled={uploading}
                        className="lg:col-span-2 bg-black text-white py-6 rounded-full font-black tracking-[0.3em] uppercase text-xs hover:opacity-80 transition disabled:bg-gray-100 shadow-xl flex items-center justify-center gap-3"
                    >
                        {uploading ? <Loader2 className="animate-spin h-5 w-5" /> : "Publish to Homepage"}
                    </button>
                </form>
            </div>

            {/* LIST HERO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((s) => (
                    <div key={s.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                            <img
                                src={(() => {
                                    if (!s.image_url) return "/placeholder.png"; // Fallback jika kosong
                                    if (s.image_url.startsWith('http')) return s.image_url; // URL Supabase
                                    if (s.image_url.startsWith('/')) return s.image_url; // Sudah ada slash /Artboard.png
                                    return `/${s.image_url}`; // Belum ada slash Artboard.png -> /Artboard.png
                                })()}
                                alt="hero"
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500" />
                        </div>
                        <div className="p-6">
                            <h3 className="font-black uppercase tracking-tighter text-lg leading-none">
                                {s.title || "Untitled Banner"}
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                                {s.subtitle && Array.isArray(s.subtitle) && s.subtitle.length > 0
                                    ? s.subtitle[0]
                                    : (typeof s.subtitle === 'string' ? s.subtitle : "No Subtitle")
                                }
                            </p>

                            <div className="mt-6 flex justify-between items-center border-t border-gray-50 pt-4">
                                <span className="text-[9px] font-black bg-gray-100 px-3 py-1 rounded text-gray-500 uppercase">Link: {s.link_url}</span>
                                <button
                                    onClick={() => deleteHero(s.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}