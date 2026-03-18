"use client"; // Kita butuh ini untuk membaca URL saat ini
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import './globals.css'; // Pastikan CSS tetap ada

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
      <body className="antialiased">
        {/* Navbar hanya muncul jika BUKAN halaman admin */}
        {!isAdminPage && <Navbar />}


        <main>
          {children}
        </main>
      </body>
    </html>
  );
}