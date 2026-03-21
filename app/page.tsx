import Image from "next/image";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductCard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Tidak perlu padding-top besar karena kita ingin banner mepet ke navbar sesuai gaya Nike */}
      <div className="pt-0">
        <Hero />
        <ProductGrid />
      </div>

      {/* Footer sederhana */}
      <Footer />
    </main>
  );
}
