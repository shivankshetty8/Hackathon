'use client';

import React, { useState } from 'react';
import { FileCheck, ShieldCheck, Download, Award, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DeliverableSample() {
  const [activeTab, setActiveTab] = useState<'english' | 'original' | 'certificate'>('english');

  return (
    <section id="sample" className="py-16 sm:py-24 bg-[#FAF6F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4DBD0] text-[11px] font-mono text-[#C2410C] uppercase tracking-wider">
            <span>What You Receive · Sample Deliverable</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#121214] tracking-tight">
            A single PDF, indistinguishable from documents prepared by an immigration attorney.
          </h2>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            A certified English translation followed by a reproduction of the original source document, with faithful transliterations and a signed certification statement that meets the federal regulation USCIS reviewers cite when rejecting translations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#E4DBD0] pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('english')}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap',
              activeTab === 'english'
                ? 'bg-[#121214] text-white shadow-xs'
                : 'text-charcoal-600 hover:text-[#121214] hover:bg-[#F4EFE6]'
            )}
          >
            <span>Certified Translation (EN · USCIS-ready)</span>
          </button>

          <button
            onClick={() => setActiveTab('original')}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap',
              activeTab === 'original'
                ? 'bg-[#121214] text-white shadow-xs'
                : 'text-charcoal-600 hover:text-[#121214] hover:bg-[#F4EFE6]'
            )}
          >
            <span>Original Source (AR · Egyptian Birth Certificate)</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap',
              activeTab === 'certificate'
                ? 'bg-[#121214] text-white shadow-xs'
                : 'text-charcoal-600 hover:text-[#121214] hover:bg-[#F4EFE6]'
            )}
          >
            <span>Signed Certificate of Accuracy (8 CFR § 103.2(b)(3))</span>
          </button>
        </div>

        {/* Document Facsimile Container */}
        <div className="bg-white border border-[#E4DBD0] rounded-3xl p-6 sm:p-10 shadow-lg relative max-w-4xl mx-auto">
          {/* Top Document Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#E4DBD0] text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-[#FAF6F0] border border-[#E4DBD0] rounded-lg font-bold text-[#121214]">
                {activeTab === 'english'
                  ? 'DELIVERABLE PAGE 1 OF 3'
                  : activeTab === 'original'
                  ? 'SOURCE DOCUMENT ATTACHMENT'
                  : 'CERTIFICATE OF TRANSLATOR COMPETENCE'}
              </span>
              <span className="text-[#C2410C] font-semibold hidden sm:inline">
                VERDACERT BUNDLE #VC-89412
              </span>
            </div>
            <div className="flex items-center gap-2 text-charcoal-500">
              <ShieldCheck className="w-4 h-4 text-[#C2410C]" />
              <span>USCIS Compliant Format</span>
            </div>
          </div>

          {/* Tab 1: English Certified Translation */}
          {activeTab === 'english' && (
            <div className="pt-8 space-y-6 font-serif max-w-2xl mx-auto">
              <div className="text-center space-y-1 pb-4 border-b border-[#FAF6F0]">
                <p className="text-[11px] font-mono uppercase tracking-widest text-charcoal-400">
                  Certified English Translation from Arabic
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-[#121214]">
                  BIRTH CERTIFICATE
                </h3>
                <p className="text-xs text-charcoal-500 font-sans italic">
                  Arab Republic of Egypt — Ministry of Health and Population
                </p>
              </div>

              {/* Table of Fields */}
              <div className="divide-y divide-[#FAF6F0] font-sans text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">Full Name</span>
                  <span className="font-medium text-[#121214] font-serif text-sm">
                    Youssef Abdel Rahman Khalil
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">Gender / Sex</span>
                  <span className="font-medium text-[#121214]">Male</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">Date of Birth</span>
                  <span className="font-medium text-[#121214] font-mono">12 March 1987</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">Place of Birth</span>
                  <span className="font-medium text-[#121214]">Zamalek, Cairo, Egypt</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">Father&#39;s Full Name</span>
                  <span className="font-medium text-[#121214]">Abdel Rahman Khalil Sayed</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">Mother&#39;s Full Name</span>
                  <span className="font-medium text-[#121214]">Samia Mahmoud Hassan</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">Civil Registry Office</span>
                  <span className="font-medium text-[#121214]">Qasr El Nil Health Bureau</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">National ID Number</span>
                  <span className="font-medium text-[#121214] font-mono">28703120109845</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="font-semibold text-charcoal-500">Official Embossed Seal</span>
                  <span className="px-2 py-0.5 rounded bg-[#FFF7ED] text-[#C2410C] font-mono text-[10px] font-semibold border border-[#FFEDD5]">
                    [SEAL: Arab Republic of Egypt — Civil Registration Authority]
                  </span>
                </div>
              </div>

              {/* Translation Seal Stamp */}
              <div className="pt-6 border-t border-[#E4DBD0] flex items-center justify-between text-[11px] font-mono text-charcoal-500">
                <div className="space-y-0.5">
                  <p className="font-bold text-[#121214]">Verdacert Certified Translation</p>
                  <p>Certified Native Arabic-English Reviewer: T-48210</p>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#C2410C] flex flex-col items-center justify-center text-[8px] text-[#C2410C] uppercase font-bold text-center leading-tight p-1">
                  <span>CERTIFIED</span>
                  <span>VERDACERT</span>
                  <span>USCIS 2026</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Original Source Document */}
          {activeTab === 'original' && (
            <div className="pt-8 space-y-6 max-w-2xl mx-auto text-right" dir="rtl">
              <div className="text-center space-y-1 pb-4 border-b border-[#FAF6F0]" dir="ltr">
                <p className="text-[11px] font-mono uppercase tracking-widest text-charcoal-400">
                  Original Source Document Reproduction
                </p>
                <h3 className="text-2xl font-serif font-bold tracking-tight text-[#121214]">
                  شهادة ميلاد رسمية
                </h3>
                <p className="text-xs text-charcoal-500 font-sans">
                  جمهورية مصر العربية — وزارة الصحة والسكان — قطاع الشئون الصحية
                </p>
              </div>

              <div className="divide-y divide-[#FAF6F0] font-sans text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">الاسم الكامل:</span>
                  <span className="font-medium text-[#121214] font-serif text-sm">
                    يوسف عبد الرحمن خليل
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">النوع:</span>
                  <span className="font-medium text-[#121214]">ذكر</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">تاريخ الميلاد:</span>
                  <span className="font-medium text-[#121214] font-mono">١٢ / ٠٣ / ١٩٨٧</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">محل الميلاد:</span>
                  <span className="font-medium text-[#121214]">الزمالك، القاهرة</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">اسم الوالد:</span>
                  <span className="font-medium text-[#121214]">عبد الرحمن خليل سيد</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">اسم الوالدة:</span>
                  <span className="font-medium text-[#121214]">سامية محمود حسن</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">مكتب الصحة المسجل به:</span>
                  <span className="font-medium text-[#121214]">مكتب صحة قصر النيل</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-charcoal-500">الرقم القومي:</span>
                  <span className="font-medium text-[#121214] font-mono">٢٨٧٠٣١٢٠١٠٩٨٤٥</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E4DBD0] text-center" dir="ltr">
                <p className="text-[11px] text-charcoal-500 font-mono">
                  [Verified High-Resolution Scan Embedded in Final PDF Bundle]
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Certificate of Accuracy */}
          {activeTab === 'certificate' && (
            <div className="pt-8 space-y-6 font-serif max-w-2xl mx-auto">
              <div className="text-center space-y-1 pb-4 border-b border-[#FAF6F0]">
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#C2410C]">
                  Official Certification of Translator Competence
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-[#121214]">
                  CERTIFICATE OF ACCURACY
                </h3>
                <p className="text-xs text-charcoal-500 font-sans italic">
                  Prepared in Accordance with 8 CFR § 103.2(b)(3)
                </p>
              </div>

              <div className="bg-[#FAF6F0] border border-[#E4DBD0] rounded-2xl p-5 text-xs text-charcoal-700 leading-relaxed font-sans space-y-3">
                <p>
                  <strong>I, Tarek M. El-Sayed,</strong> hereby certify that I am fluent in both the <strong>Arabic</strong> and <strong>English</strong> languages, and that I am competent to perform certified translations between them.
                </p>
                <p>
                  I further certify that the attached English translation of the <strong>Egyptian Birth Certificate (National ID: 28703120109845)</strong> is a true, complete, and accurate representation of the original foreign-language document presented to me.
                </p>
                <p className="font-mono text-[11px] text-charcoal-500">
                  Executed under penalty of perjury under the laws of the United States of America.
                </p>
              </div>

              {/* Signature Block */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 bg-white border border-[#E4DBD0] rounded-xl space-y-1">
                  <p className="text-[10px] font-mono text-charcoal-400 uppercase">Translator Signature</p>
                  <p className="font-serif italic font-bold text-base text-[#121214] pt-1">
                    Tarek M. El-Sayed
                  </p>
                  <p className="text-[11px] text-charcoal-500">Senior Arabic Legal Translator</p>
                  <p className="text-[10px] font-mono text-[#C2410C]">Verdacert Reviewer ID: #AR-4821</p>
                </div>

                <div className="p-4 bg-white border border-[#E4DBD0] rounded-xl space-y-1">
                  <p className="text-[10px] font-mono text-charcoal-400 uppercase">Verification &amp; Date</p>
                  <p className="font-mono text-xs font-semibold text-[#121214] pt-1">
                    Date: November 9, 2026
                  </p>
                  <p className="text-[11px] text-charcoal-500">Corporate Entity: Verdacert LLC</p>
                  <p className="text-[10px] font-mono text-emerald-600 font-semibold">
                    USCIS Regulatory Compliance Verified ✓
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="mt-8 pt-6 border-t border-[#E4DBD0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-charcoal-600 font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Formatted to match legal requirements for USCIS, federal courts, and universities.</span>
            </div>
            <a
              href="#quote"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold shadow-xs"
            >
              <span>Get Your Certified PDF</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
