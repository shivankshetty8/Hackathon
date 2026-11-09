'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    q: 'What does "USCIS-certified translation" actually mean?',
    a: 'USCIS requires that any non-English document submitted with an immigration filing be accompanied by a full English translation and a statement signed by the translator. The statement must certify that the translation is complete and accurate, and that the translator is competent to translate from the foreign language into English (per 8 CFR § 103.2(b)(3)). Verdacert attaches that exact signed statement to every delivered translation.',
  },
  {
    q: 'Does USCIS require notarization?',
    a: 'No. USCIS explicitly removed the general notarization requirement years ago. Today, federal immigration regulations only require a Certificate of Accuracy signed by a competent translator. However, if your document is also being used in state probate court, divorce proceedings, or before certain foreign consulates, you can easily add our state-notarized certificate at checkout.',
  },
  {
    q: 'How long does the translation take?',
    a: 'Our Standard tier delivers within 48 hours. Express delivers in 24 hours (including weekends). Our Rush service delivers in 14 hours around the clock. Over 94% of our standard documents are delivered well before the deadline.',
  },
  {
    q: 'What happens if USCIS rejects my translation?',
    a: 'We offer an unconditional 100% acceptance guarantee. If USCIS, a US court, or university rejects your translation due to an error or formatting issue, we will either retranslate it immediately free of charge or refund your order in full.',
  },
  {
    q: 'What languages and document types do you support?',
    a: 'We support over 103 languages, with specialized native-speaker reviewers across the Middle East, South Asia, Latin America, and Eastern Europe. Common documents include birth certificates, marriage licenses, divorce decrees, police clearance certificates, academic transcripts, diplomas, and medical records.',
  },
  {
    q: 'How do I submit phone photos or scans?',
    a: 'You can upload standard camera photos (JPG, PNG, HEIC) directly from your smartphone or camera, or upload flatbed PDF scans. As long as all text, stamps, and handwritten seals are clearly readable, our reviewers can process the document.',
  },
  {
    q: 'How do I know my personal documents are secure?',
    a: 'All files are transmitted using 256-bit TLS encryption and stored in secure, encrypted environments adhering to strict attorney-client privacy standards. Your documents are only accessible to the assigned native reviewer and quality coordinator.',
  },
  {
    q: 'What if I need a typographical or name spelling revision?',
    a: 'We provide 90 days of free minor revisions. If you notice a name transliteration preference (for example, matching a specific spelling on an existing US visa or passport), simply let us know and we will update and re-certify the document immediately.',
  },
  {
    q: 'Do longer or handwritten documents cost more?',
    a: 'We price strictly by the standard page (defined as up to 250 words per page). Most birth, marriage, and death certificates are 1 page. If a document contains dense handwritten text spanning multiple standard pages, our intake team will confirm the transparent page count before processing.',
  },
  {
    q: 'What is the difference between a certified translation and an apostille?',
    a: 'A certified translation is a complete English translation of a foreign document accompanied by a signed Certificate of Accuracy. An apostille is a specialized state or federal authentication of the official who signed the original foreign public record. Verdacert provides certified translations that can be submitted to USCIS or apostilled for international use.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#FAF6F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4DBD0] text-[11px] font-mono text-[#C2410C] uppercase tracking-wider">
            <span>FAQ · Pre-Purchase Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#121214] tracking-tight">
            Everything you&#39;d ask if we were on the phone.
          </h2>
          <p className="text-sm text-charcoal-600 max-w-xl mx-auto leading-relaxed">
            If your question isn&#39;t answered here, our support team replies within an hour, every day of the week.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="divide-y divide-[#E4DBD0] bg-white border border-[#E4DBD0] rounded-3xl p-6 sm:p-8 shadow-sm">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left py-1 text-sm font-serif font-bold text-[#121214] hover:text-[#C2410C] transition-colors gap-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-charcoal-400 font-normal">
                      Q. {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span>{item.q}</span>
                  </span>
                  <div
                    className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform',
                      isOpen ? 'bg-[#FFF7ED] text-[#C2410C]' : 'bg-[#FAF6F0] text-charcoal-500'
                    )}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-3 pl-8 pr-4 text-xs font-sans text-charcoal-600 leading-relaxed space-y-2">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Card */}
        <div className="mt-8 p-5 bg-[#F4EFE6] border border-[#E4DBD0] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-[#E4DBD0] text-[#C2410C]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#121214]">Have a question about a rare document format or dialect?</p>
              <p className="text-[11px] text-charcoal-500 font-mono">Our legal translation coordinators reply within 30 minutes.</p>
            </div>
          </div>
          <a
            href="mailto:support@verdacert.com"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E4DBD0] hover:bg-[#FAF6F0] text-xs font-semibold text-[#121214] font-mono whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>support@verdacert.com</span>
          </a>
        </div>
      </div>
    </section>
  );
}
