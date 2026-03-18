"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

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
    const [form, setForm] = useState({
        name: '', price: '', category: '', tag: '', images: '', description: ''
    });

    // Fetch daftar produk untuk ditampilkan di tabel
    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else if (data) {
            setProducts(data as Product[]);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const imagesArray = form.images.split(',').map(img => img.trim()); // Ubah string jadi array

        const { error } = await supabase.from('products').insert([{
            name: form.name,
            price: parseInt(form.price),
            category: form.category.toLowerCase(),
            tag: form.tag,
            image_url: imagesArray, // Simpan sebagai text[]
            description: form.description,
            slug: form.name.toLowerCase().replace(/ /g, '-')
        }]);

        if (error) {
            toast.error("Failed: " + error.message);
        } else {
            toast.success("Product Added!");
            setForm({ name: '', price: '', category: '', tag: '', images: '', description: '' });
            fetchProducts();
        }
    };

    return (
        <div>
            <Toaster />
            <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

            {/* FORM TAMBAH PRODUK */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-gray-200">
                <h2 className="font-bold mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Product Name" className="border p-2 rounded" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    <input placeholder="Price (Numbers Only)" type="number" className="border p-2 rounded" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    <input placeholder="Category (men, women, kids)" className="border p-2 rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
                    <input placeholder="Tag (SALE, New, etc)" className="border p-2 rounded" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
                    <textarea placeholder="Description" className="border p-2 rounded md:col-span-2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <textarea
                        placeholder="Image URLs (Separated by comma. Example: /p1.jpg, /p2.jpg)"
                        className="border p-2 rounded md:col-span-2"
                        value={form.images}
                        onChange={e => setForm({ ...form, images: e.target.value })}
                        required
                    />
                    <button className="bg-black text-white py-2 rounded font-bold hover:opacity-75 transition md:col-span-2">Upload Product</button>
                </form>
            </div>

            {/* TABEL DAFTAR PRODUK */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 uppercase font-bold">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p: any) => (
                            <tr key={p.id} className="border-t border-gray-100">
                                <td className="p-4 font-bold">{p.name}</td>
                                <td className="p-4 uppercase">{p.category}</td>
                                <td className="p-4">Rp {p.price.toLocaleString()}</td>
                                <td className="p-4">
                                    <button onClick={async () => {
                                        await supabase.from('products').delete().eq('id', p.id);
                                        fetchProducts();
                                    }} className="text-red-600 font-bold hover:opacity-75 transition cursor-pointer">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}