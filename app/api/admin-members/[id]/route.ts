import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(req: Request) {
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