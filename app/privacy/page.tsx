"use client";
import React from 'react';
import Footer from '@/components/Footer';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white text-black">
            <div className="max-w-[800px] mx-auto px-6 pt-30 pb-20">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 text-center">
                    Privacy Policy
                </h1>
                <div className="space-y-6 text-lg leading-relaxed">
                    <p className="font-bold">Last Updated: 21 December 2025</p>

                    <ul className="space-y-6 list-decimal pl-5">

                        <li>
                            <span className="font-bold">Information We Collect</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, shipping and billing address.</li>
                                <li><strong>Payment Details:</strong> Processed securely via third-party providers. We do not store full payment data.</li>
                                <li><strong>Device Information:</strong> IP address, browser type, time zone, and cookies.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">How We Use Your Information</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>To process and fulfill your orders.</li>
                                <li>To communicate updates, promotions, and customer support.</li>
                                <li>To detect and prevent fraud or risks.</li>
                                <li>To improve website performance and user experience.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Sharing Your Information</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>We do not sell your personal data.</li>
                                <li><strong>Service Providers:</strong> Shipping partners and payment processors.</li>
                                <li><strong>Analytics:</strong> Tools like Google Analytics.</li>
                                <li><strong>Legal:</strong> When required by law or to protect rights.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Data Security</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>We use SSL encryption to protect sensitive data.</li>
                                <li>We apply industry-standard security practices.</li>
                                <li>No system is 100% secure, but we take strong precautions.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Cookies</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>Used to enhance user experience.</li>
                                <li>Help remember cart items and preferences.</li>
                                <li>Allow us to analyze website usage.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Your Rights</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>Access your personal data.</li>
                                <li>Request updates or deletion of your data.</li>
                                <li>Opt-out of marketing emails anytime.</li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-bold">Changes to This Policy</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                <li>This policy may be updated periodically.</li>
                                <li>Changes will be posted on this page.</li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
            <Footer />
        </main>
    );
}