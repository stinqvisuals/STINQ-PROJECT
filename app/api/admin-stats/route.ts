import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

// ⚠️ PAKAI SERVICE ROLE (WAJIB)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        // 1. Orders
        const { data: orders, error: orderErr } = await supabase
            .from("orders")
            .select("total_amount");

        // 2. Products count
        const { count: productCount, error: prodErr } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true });

        // 3. Members count
        const { count: memberCount, error: memErr } = await supabase
            .from("members")
            .select("*", { count: "exact", head: true });

        if (orderErr || prodErr || memErr) {
            console.error({ orderErr, prodErr, memErr });
            return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
        }

        const revenue =
            orders?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

        return NextResponse.json({
            totalOrders: orders?.length || 0,
            totalRevenue: revenue,
            totalProducts: productCount || 0,
            totalMembers: memberCount || 0,
        });

    } catch (err) {
        console.error("API ERROR:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}