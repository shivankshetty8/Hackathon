'use client';

import React from 'react';
import { Upload, FileCheck, DownloadCloud, ArrowRight, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Upload your document',
    time: '~2 minutes',
    desc: 'Upload a clear phone photo, flatbed scan, or PDF. Our intake system checks resolution, orientation, and legibility before assignment.',
    icon: Upload,
  },
  {
    num: '02',
    title: 'We translate & certify',
    time: '14–48 hours',
    desc: 'A verified native speaker with jurisdictional expertise translates every line item, official stamp, and handwritten notation according to 8 CFR § 103.2(b)(3).',
    icon: FileCheck,
  },
  {
    num: '03',
    title: 'Download your USCIS-ready file',
    time: 'Instant digital delivery',
    desc: 'Receive a single, signed PDF bundle formatted to match standard immigration law firm submissions, complete with translator statement and credentials.',
    icon: DownloadCloud,
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-16 sm:py-24 bg-[#F4EFE6] border-y border-[#E4DBD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4DBD0] text-[11px] font-mono text-[#C2410C] uppercase tracking-wider">
            <span>03 Steps · ~5 Min to Quote</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#121214] tracking-tight">
            A process you can hand to USCIS without rereading the rules.
          </h2>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            Upload, we translate, you submit. Every step is bounded by a real deadline and a named reviewer who signs the Certificate of Accuracy.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white border border-[#E4DBD0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between card-shadow-hover relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif font-bold text-2xl text-[#C2410C]">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#E4DBD0] flex items-center justify-center text-[#121214] group-hover:text-[#C2410C] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#121214] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#FAF6F0] flex items-center justify-between text-[11px] font-mono text-charcoal-500">
                  <span>Typical timeline</span>
                  <span className="font-semibold text-[#121214]">{step.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Reassurance Banner */}
        <div className="mt-10 p-5 bg-white border border-[#E4DBD0] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FFEDD5] text-[#C2410C]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#121214]">
                Need your translation faster for an upcoming filing deadline or RFE?
              </p>
              <p className="text-[11px] text-charcoal-500">
                Our 14-hour Rush service operates 24 hours a day, 7 days a week, including holidays.
              </p>
            </div>
          </div>
          <a
            href="#quote"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121214] hover:bg-black text-white text-xs font-medium whitespace-nowrap"
          >
            <span>Select Rush Turnaround</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

