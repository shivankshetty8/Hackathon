'use client';

import React from 'react';
import { Check, Clock, ShieldCheck, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIERS = [
  {
    name: 'Standard',
    speed: 'Delivered in 48 hours',
    price: '$22.95',
    unit: '/ page',
    desc: 'For planned filings, naturalization applications, and standard visa petitions.',
    highlighted: false,
    badge: null,
    features: [
      'Native-speaker translation & review',
      'Signed Certificate of Accuracy',
      'Tamper-evident digital PDF delivery',
      'Free minor revisions for 90 days',
      '100% USCIS acceptance guarantee',
    ],
  },
  {
    name: 'Express',
    speed: 'Delivered in 24 hours',
    price: '$23.95',
    unit: '/ page',
    desc: 'Our most popular tier. Weekend-ready delivery for urgent court filings and RFEs.',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Everything in Standard',
      'Priority reviewer assignment',
      '24-hour delivery, including weekends',
      'Dedicated intake coordinator',
      'Status notifications at every translation milestone',
    ],
  },
  {
    name: 'Rush',
    speed: 'Delivered in 14 hours',
    price: '$38.99',
    unit: '/ page',
    desc: 'For emergency interview submissions, next-day hearing dates, and critical deadlines.',
    highlighted: false,
    badge: 'Fastest 24/7',
    features: [
      'Everything in Express',
      'Immediate queue jump ahead of all orders',
      '14-hour guaranteed turnaround around the clock',
      'Senior legal specialist assigned',
      'Direct phone & priority SMS updates',
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-[#F4EFE6] border-y border-[#E4DBD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4DBD0] text-[11px] font-mono text-[#C2410C] uppercase tracking-wider">
            <span>Per-Page · No Hidden Fees</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#121214] tracking-tight">
            Priced by the page. Quoted in seconds. Paid before we start.
          </h2>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            Competitors hide pricing behind vague contact forms. We don&#39;t. The per-page rate below is what you will actually pay, backed by our 100% acceptance guarantee.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative',
                tier.highlighted
                  ? 'bg-white border-2 border-[#C2410C] shadow-xl'
                  : 'bg-white border border-[#E4DBD0] card-shadow-hover'
              )}
            >
              {tier.badge && (
                <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-[#C2410C] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-xl text-[#121214]">
                    {tier.name}
                  </h3>
                  <span className="text-[11px] font-mono text-charcoal-500">
                    {tier.speed}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-[#121214]">
                    {tier.price}
                  </span>
                  <span className="text-xs font-mono text-charcoal-500">
                    {tier.unit}
                  </span>
                </div>

                <p className="text-xs text-charcoal-600 leading-relaxed mb-6 pb-6 border-b border-[#FAF6F0]">
                  {tier.desc}
                </p>

                <ul className="space-y-2.5 text-xs text-charcoal-700">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#C2410C] flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href="#quote"
                  className={cn(
                    'w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all',
                    tier.highlighted
                      ? 'bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-sm'
                      : 'bg-[#121214] hover:bg-black text-white'
                  )}
                >
                  <span>Select {tier.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Non-Certified Word-Based Translation Callout */}
        <div className="mt-10 p-5 bg-[#FAF6F0] border border-[#E4DBD0] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-[#E4DBD0] text-[#121214]">
              <Sparkles className="w-5 h-5 text-[#C2410C]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#121214]">
                Need draft translations that don&#39;t require an official USCIS certification?
              </p>
              <p className="text-[11px] text-charcoal-500">
                Instant high-accuracy translation available at just $0.07 per word with immediate digital download.
              </p>
            </div>
          </div>
          <a
            href="#quote"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E4DBD0] hover:bg-[#F4EFE6] text-xs font-semibold text-[#121214] whitespace-nowrap"
          >
            <span>Learn More</span>
          </a>
        </div>
      </div>
    </section>
  );
}
