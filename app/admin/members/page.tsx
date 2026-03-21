"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Trash2, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ManageMembers() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error("Failed to load members");
        } else {
            setMembers(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const deleteMember = async (id: string) => {
        if (!confirm("Are you sure you want to remove this member?")) return;

        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Member removed");
            fetchMembers(); // Refresh list
        }
    };

    return (
        <div className="text-black pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black tracking-tighter">Manage Members</h1>
                <div className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                    {members.length} Members
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <th className="p-6">Email Address</th>
                            <th className="p-6">Joined Date</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={3} className="p-10 text-center font-bold animate-pulse">Loading members...</td></tr>
                        ) : members.length === 0 ? (
                            <tr><td colSpan={3} className="p-10 text-center font-bold text-gray-400">No members found.</td></tr>
                        ) : (
                            members.map((member) => (
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
                                        {new Date(member.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit', month: 'long', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => deleteMember(member.id)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}