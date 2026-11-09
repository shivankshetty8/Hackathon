'use client';

import React from 'react';
import { ShieldCheck, Clock, CheckCircle2, FileCheck, ArrowRight, Sparkles } from 'lucide-react';

const FEATURED_LANGUAGES = [
  { name: 'Arabic', script: 'العربية', note: 'MENA Specialty' },
  { name: 'Farsi', script: 'فارسی', note: 'Iranian Documents' },
  { name: 'Urdu', script: 'اردو', note: 'Pakistani Records' },
  { name: 'Spanish', script: 'Español', note: 'LatAm & Spain' },
  { name: 'Ukrainian', script: 'Українська', note: 'Fast Turnaround' },
  { name: 'Russian', script: 'Русский', note: 'Apostille Verified' },
  { name: 'French', script: 'Français', note: 'West Africa & Europe' },
  { name: 'Chinese', script: '简体中文', note: 'Notarized Available' },
  { name: 'Dari / Pashto', script: 'دری / پښتو', note: 'Afghan Jurisdiction' },
  { name: 'Haitian Creole', script: 'Kreyòl', note: 'TPS & Asylum' },
];

export default function Hero() {
  return (
    <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 overflow-hidden bg-[#FAF6F0]">
      {/* Background Subtle Paper Texture Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#121214_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow Citation Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4EFE6] border border-[#E4DBD0] text-[11px] font-mono text-charcoal-700 tracking-wide shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
            <span className="font-semibold text-[#121214]">8 CFR § 103.2(b)(3) COMPLIANT</span>
            <span className="text-charcoal-400">•</span>
            <span>100% USCIS ACCEPTANCE GUARANTEE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#121214] tracking-tight leading-[1.12]">
            Certified translations for Arabic, Farsi, Urdu &amp; 100+ languages —{' '}
            <span className="italic font-normal text-[#C2410C]">delivered in 14–48 hours.</span>
          </h1>

          {/* Subtitle / Lede */}
          <p className="text-base sm:text-lg text-charcoal-600 font-sans max-w-2xl mx-auto leading-relaxed">
            Native-speaker review on every document. Formatted into a single, signed PDF bundle with an official Certificate of Accuracy that USCIS, federal courts, and universities accept without rereading the rules.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-sm font-semibold shadow-md shadow-[#C2410C]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Upload Document for Instant Quote</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#sample"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F4EFE6] border border-[#E4DBD0] text-[#121214] text-sm font-semibold transition-all shadow-xs"
            >
              <FileCheck className="w-4 h-4 text-[#C2410C]" />
              <span>Inspect Sample Deliverable</span>
            </a>
          </div>

          {/* Trust Guarantees Row */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-left max-w-3xl mx-auto">
            <div className="bg-white/80 border border-[#E4DBD0] rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#C2410C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#121214]">100% Acceptance</p>
                <p className="text-[11px] text-charcoal-500">Full refund if rejected</p>
              </div>
            </div>

            <div className="bg-white/80 border border-[#E4DBD0] rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
              <Clock className="w-4 h-4 text-[#C2410C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#121214]">14h–48h Delivery</p>
                <p className="text-[11px] text-charcoal-500">Rush options 24/7</p>
              </div>
            </div>

            <div className="bg-white/80 border border-[#E4DBD0] rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#C2410C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#121214]">Native Review</p>
                <p className="text-[11px] text-charcoal-500">Every single page</p>
              </div>
            </div>

            <div className="bg-white/80 border border-[#E4DBD0] rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
              <FileCheck className="w-4 h-4 text-[#C2410C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#121214]">Signed Certificate</p>
                <p className="text-[11px] text-charcoal-500">Federal format compliant</p>
              </div>
            </div>
          </div>

          {/* Language Chips Preview Strip */}
          <div className="pt-8 space-y-2.5">
            <p className="text-[11px] font-mono uppercase tracking-wider text-charcoal-500">
              Popular Certified Languages (103 Total)
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FEATURED_LANGUAGES.map((lang) => (
                <a
                  key={lang.name}
                  href="#languages"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E4DBD0] hover:border-[#C2410C] hover:bg-[#FDFBF7] text-xs transition-colors shadow-2xs group"
                >
                  <span className="font-medium text-[#121214]">{lang.name}</span>
                  <span className="text-[#C2410C] font-serif text-[11px]">{lang.script}</span>
                </a>
              ))}
              <a
                href="#languages"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F4EFE6] border border-[#E4DBD0] hover:bg-[#EBE3D5] text-xs font-semibold text-charcoal-700 transition-colors"
              >
                <span>+93 more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

