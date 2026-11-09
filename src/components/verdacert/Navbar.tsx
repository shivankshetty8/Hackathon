'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Menu, X, ArrowRight, FileText, Globe } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E4DBD0]">
      {/* Top Trust Notice Strip */}
      <div className="bg-[#121214] text-[#FAF6F0] px-4 py-2 text-[11px] font-mono tracking-wider text-center uppercase">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-burnt-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
            100% USCIS Acceptance Guaranteed
          </span>
          <span className="text-charcoal-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-charcoal-300">
            8 CFR § 103.2(b)(3) Compliant
          </span>
          <span className="text-charcoal-600 hidden md:inline">•</span>
          <span className="hidden md:inline text-charcoal-300">
            Native-Speaker Certified Review
          </span>
          <span className="text-charcoal-600 hidden lg:inline">•</span>
          <span className="hidden lg:inline text-charcoal-300">
            14–48h Turnaround
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#121214] border border-[#232328] flex items-center justify-center text-[#FAF6F0] shadow-sm group-hover:border-[#C2410C] transition-colors">
            <span className="font-serif italic font-bold text-lg text-[#EA580C]">V</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-tight text-[#121214]">
              Verdacert
            </span>
            <span className="text-[10px] font-mono text-charcoal-500 uppercase tracking-widest -mt-1">
              Certified Translations
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-charcoal-700 tracking-wide">
          <a
            href="#how"
            className="hover:text-[#C2410C] transition-colors py-1"
          >
            How it works
          </a>
          <a
            href="#languages"
            className="hover:text-[#C2410C] transition-colors py-1"
          >
            Languages (103)
          </a>
          <a
            href="#sample"
            className="hover:text-[#C2410C] transition-colors py-1"
          >
            Sample deliverable
          </a>
          <a
            href="#pricing"
            className="hover:text-[#C2410C] transition-colors py-1"
          >
            Pricing
          </a>
          <a
            href="#why"
            className="hover:text-[#C2410C] transition-colors py-1"
          >
            Why Verdacert
          </a>
          <a
            href="#faq"
            className="hover:text-[#C2410C] transition-colors py-1"
          >
            FAQ
          </a>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#pricing"
            className="px-3.5 py-2 text-xs font-medium text-charcoal-700 hover:text-[#121214] hover:bg-[#F4EFE6] rounded-xl transition-colors font-mono"
          >
            Rates
          </a>
          <a
            href="#quote"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold shadow-sm transition-all transform active:scale-95"
          >
            <span>Upload document</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-charcoal-800 hover:bg-[#F4EFE6] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E4DBD0] bg-[#FAF6F0] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-charcoal-800">
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F4EFE6]"
            >
              How it works
            </a>
            <a
              href="#languages"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F4EFE6]"
            >
              Languages (103)
            </a>
            <a
              href="#sample"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F4EFE6]"
            >
              Sample deliverable
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F4EFE6]"
            >
              Pricing
            </a>
            <a
              href="#why"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F4EFE6]"
            >
              Why Verdacert
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#F4EFE6]"
            >
              FAQ
            </a>
          </div>
          <div className="pt-3 border-t border-[#E4DBD0]">
            <a
              href="#quote"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#C2410C] text-white text-xs font-semibold rounded-xl shadow-sm"
            >
              <span>Upload document for instant quote</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

