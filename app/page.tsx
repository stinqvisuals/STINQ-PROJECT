import Image from "next/image";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Tidak perlu padding-top besar karena kita ingin banner mepet ke navbar sesuai gaya Nike */}
      <div className="pt-0">
        <Hero />
        <ProductGrid />
      </div>

      {/* Footer sederhana */}
      <footer className="py-20 text-center border-t border-gray-100 text-gray-400 text-sm">
        © 2026 STINQ - All Rigths Reserved
      </footer>
    </main>
  );
}
