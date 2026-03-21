"use client"; // Kita butuh ini untuk membaca URL saat ini
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import './globals.css'; // Pastikan CSS tetap ada
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  // Logika: Jika alamat URL dimulai dengan '/admin', jangan munculkan Navbar
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className="antialiased bg-white">
        {/* Navbar hanya muncul jika BUKAN halaman admin */}
        {!isAdminPage && <Navbar />}
        <main>
          <Toaster position="bottom-center" // Atau "top-center" sesuai selera
            toastOptions={{
              // Gaya Default untuk semua jenis toast
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase', // Agar senada dengan STINQ Style
                letterSpacing: '0.1em',
                padding: '16px 24px',
              },
              // Custom gaya untuk sukses jika ingin ikon hijau tetap terlihat
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#fff',
                  secondary: '#333',
                },
              },
              // Custom gaya untuk error
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ff4b4b',
                  secondary: '#fff',
                },
              },
            }}
          />
          {children}
        </main>
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          // Ganti dengan Client Key Sandbox kamu atau gunakan env
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}