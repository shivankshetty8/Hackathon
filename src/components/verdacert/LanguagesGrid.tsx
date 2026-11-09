'use client';

import React, { useState, useMemo } from 'react';
import { Search, Globe, ArrowRight, Check } from 'lucide-react';
import { LANGUAGES } from './QuoteCalculator';

const FEATURED_DETAILS = [
  {
    name: 'Arabic',
    script: 'العربية',
    jurisdiction: 'Egypt, Levant, Gulf & North Africa',
    docs: 'Birth certificates, marriage contracts (Aqad Zawaj), family books, military discharge papers.',
    highlight: 'Deep MENA Expertise',
  },
  {
    name: 'Farsi (Persian)',
    script: 'فارسی',
    jurisdiction: 'Iran & Persian Diaspora',
    docs: 'Shenasnameh (Birth Booklet), Kart-e-Melli, Sanad-e-Ezdevaj, judicial divorce rulings.',
    highlight: 'Tehran & Provincial Documents',
  },
  {
    name: 'Urdu',
    script: 'اردو',
    jurisdiction: 'Pakistan & South Asia',
    docs: 'NADRA birth & marriage certificates, Nikahnama (Form 2), police character certificates.',
    highlight: 'NADRA Format Certified',
  },
  {
    name: 'Spanish',
    script: 'Español',
    jurisdiction: 'Latin America & Spain',
    docs: 'Actas de nacimiento, actas de matrimonio, antecedentes penales, títulos universitarios.',
    highlight: 'All LatAm Consular Formats',
  },
  {
    name: 'Ukrainian',
    script: 'Українська',
    jurisdiction: 'Ukraine Civil Status',
    docs: 'Свідоцтво про народження (Birth certificate), шлюб (marriage), diplomas, internal passports.',
    highlight: 'TPS & Humanitarian Parole',
  },
  {
    name: 'Russian',
    script: 'Русский',
    jurisdiction: 'Post-Soviet Jurisdictions',
    docs: 'Свидетельство о рождении, ZAGS civil act certificates, work books (Трудовая книжка).',
    highlight: 'Apostille Verified',
  },
  {
    name: 'French',
    script: 'Français',
    jurisdiction: 'Haiti, West Africa & France',
    docs: 'Extrait d&#39;acte de naissance, casier judiciaire, livrets de famille, relevés de notes.',
    highlight: 'African & Caribbean French',
  },
  {
    name: 'Chinese (Simplified)',
    script: '简体中文',
    jurisdiction: 'PRC & Global Chinese',
    docs: 'Hukou (Household register), Notarial Certificates (Gong Zheng Shu), police clearance.',
    highlight: 'Gong Zheng Shu Certified',
  },
  {
    name: 'Dari & Pashto',
    script: 'دری / پښتو',
    jurisdiction: 'Afghanistan',
    docs: 'Tazkira (National Identity Card), electronic Tazkira, educational certificates.',
    highlight: 'SIV & Asylum Specialist',
  },
];

export default function LanguagesGrid() {
  const [search, setSearch] = useState('');

  const filteredLanguages = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return LANGUAGES.filter(
      (l) => l.name.toLowerCase().includes(q) || l.script.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <section id="languages" className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#E4DBD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4DBD0] text-[11px] font-mono text-[#C2410C] uppercase tracking-wider">
              <span>06 Featured · 97+ More Worldwide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#121214] tracking-tight">
              More than 100 languages, each reviewed by a native speaker.
            </h2>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Every reviewer is a native speaker who knows the documents of their home jurisdiction — the regional dialects, the stamp formats, and how local authorities record vital statistics.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 103 languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E4DBD0] rounded-xl text-xs font-medium text-[#121214] placeholder-charcoal-400 focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
            />
          </div>
        </div>

        {/* Dynamic Search Results (If searching) */}
        {search.trim() !== '' ? (
          <div className="bg-white border border-[#E4DBD0] rounded-2xl p-6 mb-10 shadow-sm">
            <h3 className="text-xs font-mono uppercase text-charcoal-500 mb-3 font-bold">
              Search Results ({filteredLanguages.length})
            </h3>
            {filteredLanguages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredLanguages.map((l) => (
                  <a
                    key={l.code}
                    href="#quote"
                    className="p-3 bg-[#FAF6F0] border border-[#E4DBD0] rounded-xl hover:border-[#C2410C] hover:bg-[#FFF7ED] transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#121214] group-hover:text-[#C2410C]">
                        {l.name}
                      </p>
                      <p className="text-xs font-serif text-[#C2410C] mt-0.5">{l.script}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-[#C2410C] transition-colors" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-500">
                No matching languages found for &quot;{search}&quot;. Contact support for rare dialects.
              </p>
            )}
          </div>
        ) : null}

        {/* Featured Language Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_DETAILS.map((item) => (
            <div
              key={item.name}
              className="bg-white border border-[#E4DBD0] rounded-2xl p-6 flex flex-col justify-between card-shadow-hover relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5] font-semibold">
                    {item.highlight}
                  </span>
                  <span className="text-base font-serif text-[#C2410C] font-semibold">
                    {item.script}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#121214] mb-1">
                  {item.name}
                </h3>
                <p className="text-[11px] font-mono text-charcoal-500 mb-3">
                  {item.jurisdiction}
                </p>

                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {item.docs}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-[#FAF6F0] flex items-center justify-between">
                <span className="text-[11px] font-mono text-charcoal-500 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  USCIS Guaranteed
                </span>
                <a
                  href="#quote"
                  className="text-xs font-semibold text-[#121214] group-hover:text-[#C2410C] transition-colors inline-flex items-center gap-1 font-mono"
                >
                  <span>Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* All 103 Languages Footer Pill Bar */}
        <div className="mt-10 p-5 bg-white border border-[#E4DBD0] rounded-2xl text-center space-y-3">
          <p className="text-xs font-mono uppercase text-charcoal-500 tracking-wider">
            Also Translating Across All 103 Global Jurisdictions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {LANGUAGES.slice(10, 32).map((l) => (
              <span
                key={l.code}
                className="px-2.5 py-1 bg-[#FAF6F0] border border-[#E4DBD0] rounded-lg text-charcoal-700 font-medium"
              >
                {l.name} ({l.script})
              </span>
            ))}
            <span className="px-2.5 py-1 bg-[#FFF7ED] text-[#C2410C] font-semibold border border-[#FFEDD5] rounded-lg">
              +71 more
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
