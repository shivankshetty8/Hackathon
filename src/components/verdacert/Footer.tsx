'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#121214] text-[#FAF6F0] pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-charcoal-800 text-xs">
          {/* Col 1 & 2: Brand & Certification Statement (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-white">
                <span className="font-serif italic font-bold text-base text-[#EA580C]">V</span>
              </div>
              <span className="font-serif font-bold text-xl text-white tracking-tight">
                Verdacert
              </span>
            </div>

            <p className="text-charcoal-400 leading-relaxed pr-6">
              Certified translation for immigration filings, judicial court proceedings, academic evaluations, and civil records. Formatted to the exact standard USCIS reviewers cite under 8 CFR § 103.2(b)(3).
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-800/80 border border-charcoal-700 text-[11px] font-mono text-burnt-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>100% USCIS Acceptance Guarantee Backed</span>
              </div>
            </div>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3 font-sans">
            <p className="font-serif font-bold text-sm text-white">Services</p>
            <ul className="space-y-2 text-charcoal-400">
              <li><a href="#quote" className="hover:text-white transition-colors">USCIS Certified Translations</a></li>
              <li><a href="#quote" className="hover:text-white transition-colors">Birth Certificate Translations</a></li>
              <li><a href="#quote" className="hover:text-white transition-colors">Marriage Certificate Translations</a></li>
              <li><a href="#quote" className="hover:text-white transition-colors">Academic Transcripts &amp; Diplomas</a></li>
              <li><a href="#quote" className="hover:text-white transition-colors">Notarized Translation Options</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Rush 14-Hour Turnaround</a></li>
            </ul>
          </div>

          {/* Col 4: Top Languages */}
          <div className="space-y-3 font-sans">
            <p className="font-serif font-bold text-sm text-white">Top Languages</p>
            <ul className="space-y-2 text-charcoal-400">
              <li><a href="#languages" className="hover:text-white transition-colors">Arabic Translation (العربية)</a></li>
              <li><a href="#languages" className="hover:text-white transition-colors">Farsi / Persian (فارسی)</a></li>
              <li><a href="#languages" className="hover:text-white transition-colors">Urdu Translation (اردو)</a></li>
              <li><a href="#languages" className="hover:text-white transition-colors">Spanish Translation (Español)</a></li>
              <li><a href="#languages" className="hover:text-white transition-colors">Ukrainian Translation (Українська)</a></li>
              <li><a href="#languages" className="hover:text-white transition-colors">All 103 Languages Catalog</a></li>
            </ul>
          </div>

          {/* Col 5: Compliance & Legal */}
          <div className="space-y-3 font-sans">
            <p className="font-serif font-bold text-sm text-white">Legal &amp; Compliance</p>
            <ul className="space-y-2 text-charcoal-400">
              <li><a href="#faq" className="hover:text-white transition-colors">8 CFR § 103.2(b)(3) Compliance</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Acceptance Guarantee Terms</a></li>
              <li><a href="#why" className="hover:text-white transition-colors">Privacy &amp; Security Standards</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-charcoal-500">
          <p>© 2026 Verdacert LLC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Prepared pursuant to 8 CFR § 103.2(b)(3)</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
