"use client";
import React, { useEffect, useState } from 'react';
import { Trash2, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

type Member = {
    id: string;
    email: string;
    created_at: string;
};

export default function ManageMembers() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin-members');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            const safeData = (data || []).filter((m: any) => m?.id);
            setMembers(safeData);
        } catch (err: any) {
            console.error("Fetch members error:", err);
            toast.error("Failed to load members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const deleteMember = async (id?: string) => {
        if (!id || id === "undefined") {
            toast.error("Invalid member ID ❌");
            return;
        }
        if (!confirm("Remove this member permanently?")) return;
        const toastId = toast.loading("Deleting...");
        try {
            const res = await fetch(`/api/admin-members/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success("Member deleted!", { id: toastId });
            setMembers(prev => prev.filter(m => m.id !== id));
        } catch (error: any) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete: " + error.message, { id: toastId });
        }
    };

    return (
        <div className="text-black pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black tracking-tighter">Manage Members</h1>
                <div className="text-[10px] font-black bg-black text-white px-4 py-2 rounded-full uppercase tracking-widest">
                    {members.length} Members
                </div>
            </div>

            {/* CONTAINER TABEL DENGAN SCROLL HORIZONTAL */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <th className="p-6">Email Address</th>
                                <th className="p-6">Joined Date</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="p-10 text-center font-bold animate-pulse">Loading members...</td>
                                </tr>
                            ) : members.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-10 text-center font-bold text-gray-400">No members found.</td>
                                </tr>
                            ) : (
                                members.map((member) => {
                                    if (!member?.id) return null;
                                    return (
                                        <tr key={member.id} className="group hover:bg-gray-50 transition">
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-black text-white rounded-lg">
                                                        <Mail size={14} />
                                                    </div>
                                                    <span className="font-bold text-sm">{member.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                                {member.created_at ? new Date(member.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : "-"}
                                            </td>
                                            <td className="p-6 text-right">
                                                <button
                                                    disabled={deletingId === member.id}
                                                    onClick={() => deleteMember(member.id)}
                                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}