import { NextResponse } from 'next/server';
const midtransClient = require('midtrans-client');

// Inisialisasi Midtrans Snap
let snap = new midtransClient.Snap({
    isProduction: false, // Set ke true jika sudah mau jualan beneran
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export async function POST(request: Request) {
    try {
        const { orderId, totalAmount, customerDetails, items } = await request.json();

        // Buat parameter transaksi untuk Midtrans
        let parameter = {
            transaction_details: {
                order_id: orderId, // Gunakan ID dari Supabase
                gross_amount: totalAmount
            },
            item_details: items.map((item: any) => ({
                id: item.id,
                price: item.price,
                quantity: item.quantity,
                name: item.name
            })),
            customer_details: {
                first_name: customerDetails.full_name,
                phone: customerDetails.phone,
                billing_address: {
                    address: customerDetails.address
                }
            },
            // Kamu bisa kustomisasi warna/tema popup di sini
            callbacks: {
                finish: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`
            }
        };

        // Minta Token dari Midtrans
        const transaction = await snap.createTransaction(parameter);

        return NextResponse.json({ token: transaction.token });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}