'use client';

import React from 'react';
import { Briefcase, Shield, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LawFirms() {
  return (
    <section className="py-16 sm:py-24 bg-[#121214] text-[#FAF6F0] relative overflow-hidden">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#FAF6F0_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Value Prop (6 Cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-800 border border-charcoal-700 text-[11px] font-mono text-burnt-400 uppercase tracking-wider">
              <span>For Immigration Law Firms &amp; Corporate Legal</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              Built for firms with recurring volume and{' '}
              <span className="italic font-normal text-[#EA580C]">zero margin for error.</span>
            </h2>

            <p className="text-sm text-charcoal-300 leading-relaxed">
              Consolidated monthly invoicing, a designated lead reviewer on request, permissioned attorney portals, and strict SOC 2-aligned confidentiality protocols.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="#quote"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold uppercase tracking-wider font-mono shadow-md transition-all"
              >
                <span>Request Firm Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 text-white text-xs font-semibold"
              >
                <span>Billing Details</span>
              </a>
            </div>
          </div>

          {/* Right Column: 4 Firm Pillars Grid (6 Cols) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#1A1A1E] border border-charcoal-800 space-y-2">
              <Briefcase className="w-5 h-5 text-[#EA580C]" />
              <h3 className="font-serif font-bold text-base text-white">
                Monthly Consolidated Invoicing
              </h3>
              <p className="text-xs text-charcoal-400 leading-relaxed">
                Single monthly statement itemized by client matter number for simple paralegal cost pass-through.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1A1A1E] border border-charcoal-800 space-y-2">
              <Users className="w-5 h-5 text-[#EA580C]" />
              <h3 className="font-serif font-bold text-base text-white">
                Dedicated Lead Reviewer
              </h3>
              <p className="text-xs text-charcoal-400 leading-relaxed">
                Consistency across related filings, family petitions, and specialized regional dialects.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1A1A1E] border border-charcoal-800 space-y-2">
              <Clock className="w-5 h-5 text-[#EA580C]" />
              <h3 className="font-serif font-bold text-base text-white">
                Guaranteed RFE Turnarounds
              </h3>
              <p className="text-xs text-charcoal-400 leading-relaxed">
                Same-day 14-hour delivery commitments for urgent court dates and Request for Evidence deadlines.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1A1A1E] border border-charcoal-800 space-y-2">
              <Shield className="w-5 h-5 text-[#EA580C]" />
              <h3 className="font-serif font-bold text-base text-white">
                Privilege &amp; Confidentiality
              </h3>
              <p className="text-xs text-charcoal-400 leading-relaxed">
                Custom non-disclosure agreements, data purge upon completion, and encrypted client repositories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
