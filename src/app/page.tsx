'use client';

import React from 'react';
import Navbar from '@/components/verdacert/Navbar';
import Hero from '@/components/verdacert/Hero';
import QuoteCalculator from '@/components/verdacert/QuoteCalculator';
import HowItWorks from '@/components/verdacert/HowItWorks';
import DeliverableSample from '@/components/verdacert/DeliverableSample';
import LanguagesGrid from '@/components/verdacert/LanguagesGrid';
import WhyUs from '@/components/verdacert/WhyUs';
import Pricing from '@/components/verdacert/Pricing';
import UseCases from '@/components/verdacert/UseCases';
import LawFirms from '@/components/verdacert/LawFirms';
import FAQ from '@/components/verdacert/FAQ';
import Footer from '@/components/verdacert/Footer';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#121214] font-sans antialiased selection:bg-[#FED7AA] selection:text-[#7C2D12]">
      {/* Top Navigation */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Interactive Instant Quote Calculator & Document Upload */}
        <QuoteCalculator />

        {/* 03-Step How It Works Section */}
        <HowItWorks />

        {/* Interactive What You Receive Deliverable Comparison */}
        <DeliverableSample />

        {/* 103 Languages Catalog & Live Filter */}
        <LanguagesGrid />

        {/* Six Reasons Why Verdacert */}
        <WhyUs />

        {/* Transparent Per-Page Pricing */}
        <Pricing />

        {/* Six Common Use Cases (Courts, USCIS, Universities, etc.) */}
        <UseCases />

        {/* Immigration Law Firms & Enterprise Section */}
        <LawFirms />

        {/* Frequently Asked Questions Accordion */}
        <FAQ />

        {/* Final Conversion Call-To-Action Banner */}
        <section className="py-20 bg-[#121214] text-[#FAF6F0] relative overflow-hidden border-t border-charcoal-800">
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#FAF6F0_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-800 border border-charcoal-700 text-[11px] font-mono text-burnt-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Ready to Submit to USCIS?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Ready to start? Upload your document for an{' '}
              <span className="italic font-normal text-[#EA580C]">instant quote.</span>
            </h2>

            <p className="text-sm sm:text-base text-charcoal-300 max-w-xl mx-auto leading-relaxed">
              Every document certified by a native speaker with our 100% USCIS acceptance guarantee. Delivered in 14–48 hours.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#quote"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-sm font-semibold uppercase tracking-wider font-mono shadow-lg shadow-[#C2410C]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Upload Document &amp; See Price</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 text-white text-sm font-semibold"
              >
                <span>View Full Rate Card</span>
              </a>
            </div>

            <div className="pt-6 flex items-center justify-center gap-6 text-xs font-mono text-charcoal-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
                100% Acceptance Guarantee
              </span>
              <span>•</span>
              <span>8 CFR § 103.2(b)(3) Format</span>
              <span>•</span>
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </section>
      </main>

      {/* Complete Footer */}
      <Footer />
    </div>
  );
}
