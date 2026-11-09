'use client';

import React from 'react';
import { Landmark, Scale, GraduationCap, Stethoscope, Building2, Stamp } from 'lucide-react';

const USE_CASES = [
  {
    num: '01',
    title: 'USCIS Immigration Filings',
    desc: 'For petitions including Form I-130, I-485 Adjustment of Status, N-400 Naturalization, and I-589 Asylum. Complies with 8 CFR § 103.2(b)(3).',
    icon: Landmark,
    badge: 'Primary Standard',
  },
  {
    num: '02',
    title: 'US Court Proceedings',
    desc: 'Foreign divorce decrees, adoption judgments, civil affidavits, and probate testaments formatted for county and federal court admissibility.',
    icon: Scale,
    badge: 'Legal / Judicial',
  },
  {
    num: '03',
    title: 'University & WES Evaluations',
    desc: 'Academic grade transcripts, bachelor/master diplomas, and degree supplements prepared for college admissions and credential evaluators.',
    icon: GraduationCap,
    badge: 'Academic',
  },
  {
    num: '04',
    title: 'Medical Records & Clearances',
    desc: 'Immunization histories, hospital discharge notes, surgical reports, and physician letters translated with pharmacological precision.',
    icon: Stethoscope,
    badge: 'Medical',
  },
  {
    num: '05',
    title: 'US Embassy & Consulate Filings',
    desc: 'Police clearance certificates, identity books, and civil registrations prepared for consular interviews across US embassies worldwide.',
    icon: Building2,
    badge: 'Consular',
  },
  {
    num: '06',
    title: 'Apostilled & Notarized Documents',
    desc: 'Foreign legal documents accompanied by state apostille seals, ready for domestic use before banking institutions and title companies.',
    icon: Stamp,
    badge: 'Apostille',
  },
];

export default function UseCases() {
  return (
    <section id="usecases" className="py-16 sm:py-24 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4DBD0] text-[11px] font-mono text-[#C2410C] uppercase tracking-wider">
            <span>Use Cases · 06 Situations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#121214] tracking-tight">
            Whatever you&#39;re filing, the certification language is the same.
          </h2>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            Verdacert translations are accepted by USCIS, state and federal courts, US universities, and medical boards nationwide.
          </p>
        </div>

        {/* 6 Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.num}
                className="bg-white border border-[#E4DBD0] rounded-2xl p-6 sm:p-7 flex flex-col justify-between card-shadow-hover relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-charcoal-600 border border-[#E4DBD0] font-semibold">
                      {uc.badge}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] border border-[#E4DBD0] flex items-center justify-center text-[#121214] group-hover:text-[#C2410C] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#121214] mb-2 leading-snug">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {uc.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#FAF6F0] text-[11px] font-mono text-[#C2410C] flex items-center justify-between">
                  <span>Guaranteed Acceptance</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
