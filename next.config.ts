/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Mengizinkan semua domain dari supabase
      },
      // Jika kamu ambil gambar dari Unsplash atau tempat lain, tambahkan di sini:
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;