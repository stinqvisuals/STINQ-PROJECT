"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import { Upload, X, Loader2, Pencil, Trash2 } from 'lucide-react'; // Tambah icon Pencil

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

    // STATE BARU: Untuk melacak produk yang diedit
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState({
        name: '', price: '', category: '', tag: '', description: ''
    });

    const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) console.error(error);
        else if (data) setProducts(data as Product[]);
    };

    useEffect(() => { fetchProducts(); }, []);

    // FUNGSI UNTUK MEMULAI EDIT
    const startEdit = (p: Product) => {
        setEditingId(p.id);
        setForm({
            name: p.name,
            price: p.price.toString(),
            category: p.category,
            tag: p.tag || '',
            description: p.description || ''
        });
        setPreviews(p.image_url); // Tampilkan gambar yang sudah ada sebagai preview
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll otomatis ke form
    };

    // FUNGSI UNTUK BATAL EDIT
    const cancelEdit = () => {
        setEditingId(null);
        setForm({ name: '', price: '', category: '', tag: '', description: '' });
        setPreviews([]);
        setSelectedFiles([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeSelectedFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        const toastId = toast.loading(editingId ? "Updating product..." : "Publishing product...");

        try {
            let finalImageUrls = [...previews]; // Mulai dengan gambar yang sudah ada (untuk mode edit)

            // Jika ada file baru yang diupload
            if (selectedFiles.length > 0) {
                // Jika mode edit, biasanya kita ingin mengganti atau menambah. 
                // Di sini kita asumsikan jika upload baru, kita gunakan yang baru saja (atau tambahkan).
                const newUrls: string[] = [];
                for (const file of selectedFiles) {
                    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
                    const { error: upErr } = await supabase.storage.from('product-images').upload(fileName, file);
                    if (upErr) throw upErr;
                    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
                    newUrls.push(publicUrl);
                }

                // Jika sedang edit, kita bisa gabungkan atau ganti. Mari kita gabungkan:
                finalImageUrls = editingId ? [...finalImageUrls, ...newUrls] : newUrls;
            }

            const productData = {
                name: form.name,
                price: parseInt(form.price),
                category: form.category.toLowerCase(),
                tag: form.tag,
                image_url: finalImageUrls,
                description: form.description,
                slug: form.name.toLowerCase().replace(/ /g, '-')
            };

            if (editingId) {
                // MODE UPDATE
                const { error } = await supabase.from('products').update(productData).eq('id', editingId);
                if (error) throw error;
                toast.success("Product Updated!", { id: toastId });
            } else {
                // MODE TAMBAH
                const { error } = await supabase.from('products').insert([productData]);
                if (error) throw error;
                toast.success("Product Added!", { id: toastId });
            }

            cancelEdit(); // Reset form dan editingId
            fetchProducts();
        } catch (error: any) {
            toast.error("Failed: " + error.message, { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="pb-20 text-black">
            <h1 className="text-2xl font-black mb-8 tracking-tighter">
                {editingId ? "Edit Product" : "Manage Products"}
            </h1>

            <div className="bg-white p-8 rounded-3xl shadow-sm mb-10 border border-gray-100">
                {editingId && (
                    <button
                        onClick={cancelEdit}
                        className="absolute top-6 right-8 text-[10px] font-black uppercase tracking-widest text-red-500 cursor-pointer underline"
                    >
                        Cancel Editing
                    </button>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <input placeholder="Product Name" className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition font-bold" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        <input placeholder="Price" type="number" className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition font-bold" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                        <input placeholder="Category" className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition font-bold" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
                        <input placeholder="Tag" className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black transition font-bold" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
                        <textarea placeholder="Description..." className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-black transition font-bold text-sm h-32" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-500 rounded-3xl cursor-pointer hover:bg-gray-50 hover:border-black transition-all overflow-hidden text-center p-4">
                            <Upload className="w-8 h-8 text-gray-500 group-hover:text-black mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black">
                                {editingId ? "Add More Images" : "Upload Product Images"}
                            </p>
                            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>

                        <div className="grid grid-cols-4 gap-2">
                            {previews.map((src, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100">
                                    <img src={src} className="object-cover w-full h-full" alt="preview" />
                                    <button type="button" onClick={() => removeSelectedFile(index)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"><X size={10} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button disabled={uploading} className="lg:col-span-2 bg-black text-white py-6 rounded-full font-black tracking-[0.3em] uppercase text-xs hover:opacity-80 transition disabled:bg-gray-100 shadow-xl flex items-center justify-center gap-3">
                        {uploading ? <Loader2 className="animate-spin" /> : (editingId ? "Update Product" : "Publish Product")}
                    </button>
                </form>
            </div>

            {/* TABEL LIST */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <tr>
                                <th className="p-6">Product</th>
                                <th className="p-6">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-6 text-right">Actions</th>
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
                                            <span className="font-bold text-sm tracking-tighter uppercase">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">{p.category}</td>
                                    <td className="p-4 font-bold text-sm">Rp {p.price.toLocaleString()}</td>
                                    <td className="p-6 text-right space-x-2">
                                        {/* TOMBOL EDIT */}
                                        <button
                                            onClick={() => startEdit(p)}
                                            className="p-2 text-gray-500 hover:text-blue-600 transition inline-block"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        {/* TOMBOL DELETE */}
                                        <button
                                            onClick={async () => {
                                                if (confirm("Delete product?")) {
                                                    await supabase.from('products').delete().eq('id', p.id);
                                                    fetchProducts();
                                                    toast.success("Deleted");
                                                }
                                            }}
                                            className="p-2 text-gray-500 hover:text-red-500 transition inline-block"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}