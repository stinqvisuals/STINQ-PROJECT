import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"; // Import langsung dari library

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function DELETE(req: Request) {
    // 🔥 INISIALISASI DI DALAM FUNGSI (Solusi Final Error Vercel)
    // Dengan cara ini, library tidak akan protes "URL is required" saat proses build
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oeqsfqfypwmqzhexkozi.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key-untuk-build';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
        // 🔥 AMBIL ID DARI URL LANGSUNG
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        console.log("DELETE URL:", url.pathname);
        console.log("EXTRACTED ID:", id);

        if (!id || id === "undefined") {
            return NextResponse.json(
                { error: "ID tidak ditemukan" },
                { status: 400 }
            );
        }

        // Jalankan perintah hapus
        const { error } = await supabase
            .from("members")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}