"use client";
import React from 'react';
import Footer from '@/components/Footer';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white text-black">
            <div className="max-w-[800px] mx-auto px-6 pt-40 pb-20">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 text-center">
                    About STINQ
                </h1>
                <div className="space-y-6 text-lg leading-relaxed">
                    <p className="font-bold">BRINGING THE FUTURE OF STREETWEAR TO YOUR DOORSTEP.</p>
                    <p>
                        STINQ was founded in 2024 with one simple mission: To combine premium quality with bold design.
                        We believe that every product is a statement of itself.
                    </p>
                    <p>
                        Fashion is more than just fabric and thread;
                        it is a way of storytelling without speaking. It is the first chapter of your story that the world sees. STINQ was born for those who dare to stand out through the power of simplicity.
                        We believe that true, unshakable confidence begins with what you wear closest to your skin—the foundation of your daily armor. The name STINQ represents a character that is both bold and unforgettable.
                        We don't just create apparel; we build a distinct identity for the modern individual who values the beauty in fine details and demands uncompromising comfort.
                        In a world full of temporary trends, we choose to focus on the essentials that leave a lasting impression. Our philosophy is rooted in the belief that quality should never be a luxury, but a standard.
                        From the precision of our stitching to the premium feel of our fabrics, every piece in our collection is a testament to our commitment to excellence. We curate our casual wear for those who move through life with purpose, providing a canvas for you to express your authentic self without saying a word.
                        invite you to redefine your wardrobe and make every day more meaningful. With STINQ, you aren't just wearing a brand; you are wearing a statement of character, quality, and timeless style.
                    </p>
                    <p>
                        Every collection we release goes through a strict curation process, ensuring only the best material
                        that touches your skin. We don't just sell clothes; we build a community for those who dare to be different.
                    </p>
                    <div className="pt-10 border-t border-gray-100">
                        <h2 className="text-2xl font-black mb-4 underline">Our Vision</h2>
                        <p>To become a mecca for modern fashion that prioritizes innovation, sustainability and unlimited expression.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}