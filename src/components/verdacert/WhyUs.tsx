'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Compass, Zap, Lock, Award } from 'lucide-react';

const REASONS = [
  {
    num: '01',
    title: 'Native-speaker review on every translation',
    desc: 'Every document is reviewed by a fluent native speaker with regional document expertise before release. No exceptions, no machine-only shortcuts.',
    icon: UserCheck,
  },
  {
    num: '02',
    title: 'USCIS-accepted guarantee',
    desc: 'If USCIS or another government recipient rejects a translation for a translation error, we retranslate immediately at no cost or refund the full order.',
    icon: ShieldCheck,
  },
  {
    num: '03',
    title: 'Deep MENA & global expertise',
    desc: 'Our reviewers handle Egyptian birth certificates, Iranian marriage records, Afghan Tazkira, and Pakistani NADRA files with practiced jurisdictional accuracy.',
    icon: Compass,
  },
  {
    num: '04',
    title: '48-hour standard turnaround',
    desc: 'Most standard orders deliver well inside 48 hours. When filing deadlines loom, Express delivers in 24 hours and Rush delivers in 14 hours — 24/7/365.',
    icon: Zap,
  },
  {
    num: '05',
    title: 'Encrypted & confidential',
    desc: 'Your vital records, financial affidavits, and identification documents are protected with 256-bit TLS encryption and strict attorney-client privacy standards.',
    icon: Lock,
  },
  {
    num: '06',
    title: 'Real humans, real accountability',
    desc: 'Every certified translation is signed under penalty of perjury by an identifiable human translator who meets federal competence standards.',
    icon: Award,
  },
];

export default function WhyUs() {
  return (
    <section id="why" className="py-16 sm:py-24 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4DBD0] text-[11px] font-mono text-[#C2410C] uppercase tracking-wider">
            <span>Why Verdacert · Six Reasons</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#121214] tracking-tight">
            Built for the standard USCIS reviewers actually apply.
          </h2>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            The same native-speaker review, signed certification, and refund guarantee in every language we certify — not just the common ones.
          </p>
        </div>

        {/* 6 Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.num}
                className="bg-white border border-[#E4DBD0] rounded-2xl p-6 sm:p-7 flex flex-col justify-between card-shadow-hover relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#C2410C]">
                      {reason.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] border border-[#E4DBD0] flex items-center justify-center text-[#121214] group-hover:text-[#C2410C] group-hover:border-[#C2410C] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#121214] mb-2 leading-snug">
                    {reason.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {reason.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#FAF6F0] text-[11px] font-mono text-charcoal-400">
                  <span>8 CFR § 103.2(b)(3) Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
