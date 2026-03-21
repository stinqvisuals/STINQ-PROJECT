"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import { Upload, X, Loader2 } from 'lucide-react'; // Tambahkan icon untuk UI

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image_url: string[];
    tag?: string;
    description?: string;
}

export default function ManageProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [form, setForm] = useState({
        name: '', price: '', category: '', tag: '', description: ''
    });

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error(error);
        else if (data) setProducts(data as Product[]);
    };

    useEffect(() => { fetchProducts(); }, []);

    // Handle saat user memilih file gambar
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);

            // Buat preview URL agar admin bisa melihat gambar sebelum upload
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    // Hapus gambar dari list sebelum diupload
    const removeSelectedFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            return toast.error("Please upload at least one image");
        }

        setUploading(true);
        const toastId = toast.loading("Uploading product and images...");

        try {
            const uploadedUrls: string[] = [];

            // 1. Proses Upload satu per satu ke Supabase Storage
            for (const file of selectedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Ambil Public URL gambar yang baru diupload
                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            }

            // 3. Simpan data produk ke Database dengan URL gambar asli
            const { error: dbError } = await supabase.from('products').insert([{
                name: form.name,
                price: parseInt(form.price),
                category: form.category.toLowerCase(),
                tag: form.tag,
                image_url: uploadedUrls, // Array URL Publik
                description: form.description,
                slug: form.name.toLowerCase().replace(/ /g, '-')
            }]);

            if (dbError) throw dbError;

            toast.success("Product Added Successfully!", { id: toastId });

            // Reset Form
            setForm({ name: '', price: '', category: '', tag: '', description: '' });
            setSelectedFiles([]);
            setPreviews([]);
            fetchProducts();

        } catch (error: any) {
            toast.error("Process Failed: " + error.message, { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="pb-20 text-black">
            <h1 className="text-2xl font-black mb-8 tracking-tighter">Manage Products</h1>

            {/* FORM TAMBAH PRODUK */}
            <div className="bg-white p-8 rounded-3xl shadow-sm mb-10 border border-gray-100">

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <input placeholder="Product Name" className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition font-bold" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        <input placeholder="Price (Numbers Only)" type="number" className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition font-bold" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                        <input placeholder="Category (men, women, kids)" className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition font-bold" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
                        <input placeholder="Tag (SALE, New, etc)" className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition font-bold" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
                        <textarea placeholder="Product Description..." className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-black transition font-bold text-sm h-32" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>

                    {/* BAGIAN UPLOAD GAMBAR */}
                    <div className="flex flex-col gap-4">
                        <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-gray-50 hover:border-black transition-all overflow-hidden">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 text-gray-300 group-hover:text-black transition mb-2" />
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-black">Upload Product Images</p>
                                <p className="text-[10px] text-gray-300 mt-1 uppercase">JPG, PNG, WEBP (Max 5MB)</p>
                            </div>
                            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>

                        {/* PREVIEW GAMBAR SEBELUM UPLOAD */}
                        <div className="grid grid-cols-4 gap-2">
                            {previews.map((src, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100">
                                    <img src={src} className="object-cover w-full h-full" alt="preview" />
                                    <button
                                        type="button"
                                        onClick={() => removeSelectedFile(index)}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black transition"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={uploading}
                        className="bg-black text-white py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:opacity-80 transition disabled:bg-gray-200 md:col-span-2 shadow-xl flex items-center justify-center gap-3"
                    >
                        {uploading ? <><Loader2 className="animate-spin" /> Processing...</> : "Publish Product"}
                    </button>
                </form>
            </div>

            {/* TABEL LIST (Masih sama dengan gaya STINQ Admin) */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <tr>
                            <th className="p-6">Product</th>
                            <th className="p-6">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                            <img src={p.image_url[0]} alt={p.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-bold text-sm tracking-tighter">{p.name}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-xs font-black tracking-widest text-gray-400">{p.category}</td>
                                <td className="p-4 font-bold text-sm">Rp {p.price.toLocaleString()}</td>
                                <td className="p-6 text-right">
                                    <button onClick={async () => {
                                        if (confirm("Delete this product?")) {
                                            await supabase.from('products').delete().eq('id', p.id);
                                            fetchProducts();
                                            toast.success("Product Deleted");
                                        }
                                    }} className="text-gray-300 hover:text-red-600 transition p-2">
                                        <X size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}