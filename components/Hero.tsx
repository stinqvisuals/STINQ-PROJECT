"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface HeroSlide {
    id: number;
    description_hero: string;
    link_url: string;
    image_url: string;
}

const Hero = () => {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [transition, setTransition] = useState(true);

    // 1. Ambil data dari Supabase
    const fetchSlides = async () => {
        try {
            const { data, error } = await supabase
                .from('hero')
                .select('*')
                .order('id', { ascending: true }); // Urutkan berdasarkan ID

            if (error) throw error;
            if (data) setSlides(data);
        } catch (error) {
            console.error('Error fetching slides:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    // 2. Logic Auto-play
    useEffect(() => {
        if (slides.length === 0) return;

        const timer = setInterval(() => {
            setCurrent((prev) => prev + 1);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides]);

    useEffect(() => {
        if (current === slides.length) {
            setTimeout(() => {
                setTransition(false);
                setCurrent(0);
            }, 700);

            setTimeout(() => {
                setTransition(true);
            }, 750);
        }
    }, [current, slides.length]);

    if (loading) return <div className="w-full h-[65vh] bg-gray-100 animate-pulse" />;
    if (slides.length === 0) return null;

    return (
        <section className="w-full bg-white overflow-hidden">
            <div className="relative w-full h-[65vh] md:h-[85vh]">

                {/* CONTAINER SLIDER */}
                <div
                    className={`flex ${transition ? "transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]" : ""} h-full`}
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {[...slides, slides[0]].map((slide, index) => (
                        <div key={`${slide.id}-${index}`} className="min-w-full h-full relative">
                            <Image
                                // Gunakan logic yang sama untuk mencegah error Invalid URL
                                src={slide.image_url.startsWith('http') || slide.image_url.startsWith('/')
                                    ? slide.image_url
                                    : `/${slide.image_url}`}
                                alt={slide.description_hero}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />

                            {/* OVERLAY TEKS */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                                <div className="text-white max-w-3xl">
                                    <h2 className="text-[14px] md:text-[16px] font-bold tracking-[0.2em] mb-3">
                                        {slide.description_hero}
                                    </h2>
                                    <div className="flex gap-3">
                                        <Link href={`/category/${slide.link_url.toLowerCase()}`}>
                                            <button className="bg-white text-black px-10 py-3 rounded-full font-bold hover:opacity-75 transition ...">
                                                Shop Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* INDICATOR DOTS */}
                <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-1.5 transition-all duration-300 rounded-full ${current % slides.length === index ? "w-10 bg-white" : "w-2 bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;