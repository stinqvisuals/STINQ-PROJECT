"use client";
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import './globals.css';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  // Logika: Jika alamat URL dimulai dengan '/admin', jangan munculkan Navbar
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body className="antialiased bg-white">
        {/* Notifikasi Global (Wajib hanya ada satu di sini) */}
        <Toaster
          position="top-center"
          containerStyle={{
            zIndex: 99999, // Pastikan di atas Navbar dan Modal
          }}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              background: '#252525',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'default',
              letterSpacing: '0.1em',
              padding: '16px 24px',
              minWidth: '250px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#fff',
                secondary: '#252525',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff2626',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Navbar hanya muncul jika BUKAN halaman admin */}
        {!isAdminPage && <Navbar />}

        <main>
          {children}
        </main>

        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}