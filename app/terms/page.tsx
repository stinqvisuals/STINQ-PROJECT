"use client";
import React from 'react';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white text-black">
            <div className="max-w-[800px] mx-auto px-6 pt-30 pb-20">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 text-center">
                    Terms Of Sale
                </h1>
                <div className="space-y-6 text-lg leading-relaxed">
                    <p className="font-bold">Last Updated: 21 December 2025</p>

                    <ul className="space-y-6 list-decimal pl-5">

                        <li>
                            <span className="font-bold">General Overview</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>This website is operated by STINQ.</li>
                                <li>The terms “we”, “us”, and “our” refer to STINQ.</li>
                                <li>By using this website, you agree to all terms and conditions.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Online Store Terms</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>You must be at least the age of majority in your region.</li>
                                <li>You may not use our products for illegal purposes.</li>
                                <li>You must not violate any applicable laws.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Products & Pricing</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>Product colors may vary depending on your screen.</li>
                                <li>Prices are subject to change without notice.</li>
                                <li>We reserve the right to limit sales by region or individual.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Billing & Account Information</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>You must provide accurate and complete purchase information.</li>
                                <li>You are responsible for updating your account details.</li>
                                <li>Email and payment information must be valid.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Shipping & Delivery</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>Shipping costs and estimated delivery times are shown at checkout.</li>
                                <li>STINQ is not responsible for delays caused by shipping carriers.</li>
                                <li>Risk of loss transfers to the buyer upon shipment.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Returns, Exchanges & Refunds</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>Only applicable for manufacturing defects or incorrect items.</li>
                                <li>Items must be unworn and in original condition with tags.</li>
                                <li>Refer to the Return Policy for full details.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Intellectual Property</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>All content belongs to STINQ.</li>
                                <li>Protected by copyright and trademark laws.</li>
                                <li>Unauthorized use is strictly prohibited.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Prohibited Uses</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>Do not use for unlawful purposes.</li>
                                <li>Do not violate intellectual property rights.</li>
                                <li>Do not encourage illegal activities.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Limitation of Liability</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>STINQ is not liable for any direct or indirect damages.</li>
                                <li>This includes damages from use of products or services.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Governing Law</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>These terms are governed by the laws of Indonesia.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Changes to Terms</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>Terms may be updated at any time.</li>
                                <li>Updates will be posted on this page.</li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
            <Footer />
        </main>
    );
}