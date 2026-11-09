'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  Upload,
  FileText,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  Lock,
  ArrowRight,
  HelpCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const LANGUAGES = [
  { code: 'ar', name: 'Arabic', script: 'العربية' },
  { code: 'fa', name: 'Farsi (Persian)', script: 'فارسی' },
  { code: 'ur', name: 'Urdu', script: 'اردو' },
  { code: 'es', name: 'Spanish', script: 'Español' },
  { code: 'uk', name: 'Ukrainian', script: 'Українська' },
  { code: 'ru', name: 'Russian', script: 'Русский' },
  { code: 'fr', name: 'French', script: 'Français' },
  { code: 'zh', name: 'Chinese (Simplified)', script: '简体中文' },
  { code: 'zh-tw', name: 'Chinese (Traditional)', script: '繁體中文' },
  { code: 'prs', name: 'Dari', script: 'دری' },
  { code: 'ps', name: 'Pashto', script: 'پښتو' },
  { code: 'ht', name: 'Haitian Creole', script: 'Kreyòl Ayisyen' },
  { code: 'pt', name: 'Portuguese', script: 'Português' },
  { code: 'tr', name: 'Turkish', script: 'Türkçe' },
  { code: 'de', name: 'German', script: 'Deutsch' },
  { code: 'it', name: 'Italian', script: 'Italiano' },
  { code: 'vi', name: 'Vietnamese', script: 'Tiếng Việt' },
  { code: 'ko', name: 'Korean', script: '한국어' },
  { code: 'ja', name: 'Japanese', script: '日本語' },
  { code: 'pl', name: 'Polish', script: 'Polski' },
  { code: 'ro', name: 'Romanian', script: 'Română' },
  { code: 'hi', name: 'Hindi', script: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', script: 'বাংলা' },
  { code: 'tl', name: 'Tagalog (Filipino)', script: 'Tagalog' },
  { code: 'am', name: 'Amharic', script: 'አማርኛ' },
  { code: 'ti', name: 'Tigrinya', script: 'ትግርኛ' },
  { code: 'so', name: 'Somali', script: 'Soomaali' },
  { code: 'he', name: 'Hebrew', script: 'עברית' },
  { code: 'el', name: 'Greek', script: 'Ελληνικά' },
  { code: 'nl', name: 'Dutch', script: 'Nederlands' },
  { code: 'sv', name: 'Swedish', script: 'Svenska' },
  { code: 'id', name: 'Indonesian', script: 'Bahasa Indonesia' },
  { code: 'th', name: 'Thai', script: 'ไทย' },
  { code: 'ku', name: 'Kurdish', script: 'کوردی' },
  { code: 'az', name: 'Azerbaijani', script: 'Azərbaycan' },
  { code: 'hy', name: 'Armenian', script: 'Հայերեն' },
  { code: 'ka', name: 'Georgian', script: 'ქართული' },
  { code: 'sr', name: 'Serbian', script: 'Српски' },
  { code: 'hr', name: 'Croatian', script: 'Hrvatski' },
  { code: 'bs', name: 'Bosnian', script: 'Bosanski' },
  { code: 'bg', name: 'Bulgarian', script: 'Български' },
  { code: 'cs', name: 'Czech', script: 'Čeština' },
  { code: 'hu', name: 'Hungarian', script: 'Magyar' },
  { code: 'sk', name: 'Slovak', script: 'Slovenčina' },
];

type SpeedTier = 'standard' | 'express' | 'rush';

export default function QuoteCalculator() {
  const [sourceLang, setSourceLang] = useState('ar');
  const [targetLang, setTargetLang] = useState('en');
  const [pageCount, setPageCount] = useState(1);
  const [speed, setSpeed] = useState<SpeedTier>('express');
  const [notarized, setNotarized] = useState(false);
  const [hardcopy, setHardcopy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rates = {
    standard: 22.95,
    express: 23.95,
    rush: 38.99,
  };

  const deliveryHours = {
    standard: '48 hours',
    express: '24 hours',
    rush: '14 hours',
  };

  const calculateTotal = useMemo(() => {
    const ratePerPage = rates[speed];
    const translationSubtotal = ratePerPage * pageCount;
    const notarizationFee = notarized ? 19.0 : 0;
    const shippingFee = hardcopy ? 15.0 : 0;
    const total = translationSubtotal + notarizationFee + shippingFee;
    return {
      ratePerPage,
      translationSubtotal,
      notarizationFee,
      shippingFee,
      total: Math.round(total * 100) / 100,
    };
  }, [speed, pageCount, notarized, hardcopy]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setPageCount(Math.max(1, newFiles.length));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setPageCount(Math.max(1, newFiles.length));
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <section id="quote" className="py-14 sm:py-20 bg-[#FAF6F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4DBD0] text-[11px] font-mono text-[#C2410C] uppercase tracking-wider">
            <span>Instant Quote Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#121214] tracking-tight">
            Priced by the page. Quoted in seconds. Paid before we start.
          </h2>
          <p className="text-sm text-charcoal-600 max-w-xl mx-auto leading-relaxed">
            Upload your birth certificate, marriage record, or legal document to receive an exact price. Every surcharge is shown upfront with zero surprise fees.
          </p>
        </div>

        {/* Main Interactive Calculator Card */}
        <div className="max-w-5xl mx-auto bg-white border border-[#E4DBD0] rounded-3xl shadow-lg p-6 sm:p-10">
          {orderPlaced ? (
            /* Order Placed State */
            <div className="py-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#121214]">
                Translation Order Initiated
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Your document has been submitted for certified translation into English. A native-speaker reviewer has been assigned. You will receive your signed USCIS-ready PDF bundle within <strong>{deliveryHours[speed]}</strong>.
              </p>
              <div className="p-4 bg-[#FAF6F0] border border-[#E4DBD0] rounded-xl text-left text-xs space-y-1 font-mono">
                <p>Order Reference: <strong className="text-[#C2410C]">USCIS-{Math.floor(100000 + Math.random() * 900000)}</strong></p>
                <p>Language: <strong>{LANGUAGES.find((l) => l.code === sourceLang)?.name} ➔ English</strong></p>
                <p>Pages: <strong>{pageCount} page(s)</strong></p>
                <p>Total Paid: <strong>${calculateTotal.total.toFixed(2)}</strong></p>
              </div>
              <button
                onClick={() => {
                  setOrderPlaced(false);
                  setFiles([]);
                }}
                className="mt-4 px-6 py-2.5 bg-[#121214] hover:bg-black text-white text-xs font-semibold rounded-xl"
              >
                Calculate Another Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Upload & Document Details (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. File Upload Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-[#121214] uppercase tracking-wider mb-2 font-mono">
                    1. Upload Documents (PDF, JPG, PNG, Scan)
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150',
                      isDragOver
                        ? 'border-[#C2410C] bg-[#FFF7ED]'
                        : 'border-[#E4DBD0] bg-[#FAF6F0] hover:border-charcoal-400 hover:bg-[#F4EFE6]'
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-white border border-[#E4DBD0] rounded-xl shadow-2xs text-[#C2410C]">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-[#121214]">
                        Drag and drop your file here, or{' '}
                        <span className="text-[#C2410C] underline">browse files</span>
                      </p>
                      <p className="text-[11px] text-charcoal-500">
                        Birth certificates, marriage licenses, transcripts, or phone photos
                      </p>
                    </div>
                  </div>

                  {/* Uploaded File List */}
                  {files.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3 py-2 bg-[#F4EFE6] border border-[#E4DBD0] rounded-lg text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-[#C2410C] flex-shrink-0" />
                            <span className="truncate font-mono text-[#121214]">{f.name}</span>
                            <span className="text-[10px] text-charcoal-500 font-mono">
                              ({(f.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(i);
                            }}
                            className="p-1 hover:text-[#C2410C]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Language Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#121214] uppercase tracking-wider mb-1.5 font-mono">
                      Source Language
                    </label>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E4DBD0] rounded-xl text-xs font-medium text-[#121214] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.name} — {l.script}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#121214] uppercase tracking-wider mb-1.5 font-mono">
                      Target Language
                    </label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E4DBD0] rounded-xl text-xs font-medium text-[#121214] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                    >
                      <option value="en">English (USCIS Standard)</option>
                      {LANGUAGES.filter((l) => l.code !== 'en').map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.name} — {l.script}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Page Count Adjuster */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#121214] uppercase tracking-wider font-mono">
                      Number of Document Pages
                    </label>
                    <span className="text-[11px] text-charcoal-500 font-mono">
                      (Standard: 1 page = up to 250 words)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#FAF6F0] border border-[#E4DBD0] rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setPageCount(Math.max(1, pageCount - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E4DBD0] flex items-center justify-center text-charcoal-700 hover:text-[#C2410C] transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold font-mono text-[#121214]">
                        {pageCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPageCount(pageCount + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E4DBD0] flex items-center justify-center text-charcoal-700 hover:text-[#C2410C] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-charcoal-600">
                      {pageCount === 1 ? '1 physical or scanned page' : `${pageCount} physical or scanned pages`}
                    </span>
                  </div>
                </div>

                {/* 4. Speed Tiers */}
                <div>
                  <label className="block text-xs font-bold text-[#121214] uppercase tracking-wider mb-2 font-mono">
                    Select Turnaround Speed
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Standard */}
                    <button
                      type="button"
                      onClick={() => setSpeed('standard')}
                      className={cn(
                        'p-3.5 rounded-xl border text-left transition-all',
                        speed === 'standard'
                          ? 'bg-[#FFF7ED] border-[#C2410C] shadow-2xs'
                          : 'bg-[#FAF6F0] border-[#E4DBD0] hover:border-charcoal-400'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#121214]">Standard</span>
                        <Clock className="w-3 h-3 text-charcoal-500" />
                      </div>
                      <p className="text-[11px] text-charcoal-600 mt-1">48 hours</p>
                      <p className="text-xs font-mono font-bold text-[#C2410C] mt-2">
                        $22.95 <span className="text-[10px] text-charcoal-500 font-normal">/pg</span>
                      </p>
                    </button>

                    {/* Express */}
                    <button
                      type="button"
                      onClick={() => setSpeed('express')}
                      className={cn(
                        'p-3.5 rounded-xl border text-left relative transition-all',
                        speed === 'express'
                          ? 'bg-[#FFF7ED] border-[#C2410C] shadow-2xs ring-1 ring-[#C2410C]'
                          : 'bg-[#FAF6F0] border-[#E4DBD0] hover:border-charcoal-400'
                      )}
                    >
                      <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-[#C2410C] text-white text-[9px] font-bold rounded-full uppercase tracking-wider font-mono">
                        Popular
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#121214]">Express</span>
                        <Clock className="w-3 h-3 text-[#C2410C]" />
                      </div>
                      <p className="text-[11px] text-charcoal-600 mt-1">24 hours</p>
                      <p className="text-xs font-mono font-bold text-[#C2410C] mt-2">
                        $23.95 <span className="text-[10px] text-charcoal-500 font-normal">/pg</span>
                      </p>
                    </button>

                    {/* Rush */}
                    <button
                      type="button"
                      onClick={() => setSpeed('rush')}
                      className={cn(
                        'p-3.5 rounded-xl border text-left transition-all',
                        speed === 'rush'
                          ? 'bg-[#FFF7ED] border-[#C2410C] shadow-2xs'
                          : 'bg-[#FAF6F0] border-[#E4DBD0] hover:border-charcoal-400'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#121214]">Rush</span>
                        <Sparkles className="w-3 h-3 text-[#C2410C]" />
                      </div>
                      <p className="text-[11px] text-charcoal-600 mt-1">14 hours (24/7)</p>
                      <p className="text-xs font-mono font-bold text-[#C2410C] mt-2">
                        $38.99 <span className="text-[10px] text-charcoal-500 font-normal">/pg</span>
                      </p>
                    </button>
                  </div>
                </div>

                {/* 5. Optional Add-ons */}
                <div className="space-y-2 pt-1 border-t border-[#E4DBD0]">
                  <label className="block text-xs font-bold text-[#121214] uppercase tracking-wider font-mono">
                    Certification Add-ons
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#FAF6F0] border border-[#E4DBD0] rounded-xl cursor-pointer hover:bg-[#F4EFE6] transition-colors">
                    <input
                      type="checkbox"
                      checked={notarized}
                      onChange={(e) => setNotarized(e.target.checked)}
                      className="mt-0.5 rounded text-[#C2410C] focus:ring-[#C2410C]"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#121214]">
                          Notarized Certificate of Accuracy
                        </span>
                        <span className="font-mono text-[#C2410C] font-bold">+$19.00</span>
                      </div>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        Required for some courts, consulates, and universities (USCIS only requires standard certification).
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#FAF6F0] border border-[#E4DBD0] rounded-xl cursor-pointer hover:bg-[#F4EFE6] transition-colors">
                    <input
                      type="checkbox"
                      checked={hardcopy}
                      onChange={(e) => setHardcopy(e.target.checked)}
                      className="mt-0.5 rounded text-[#C2410C] focus:ring-[#C2410C]"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#121214]">
                          Hard Copy via FedEx (Wet Ink &amp; Embossed Seal)
                        </span>
                        <span className="font-mono text-[#C2410C] font-bold">+$15.00</span>
                      </div>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        Physical printed translation on official letterhead mailed to your US address.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Right Column: Order Summary & Instant Checkout (5 Cols) */}
              <div className="lg:col-span-5 bg-[#121214] text-[#FAF6F0] rounded-2xl p-6 border border-[#232328] space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                    <h3 className="font-serif font-bold text-lg text-white">Quote Summary</h3>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-charcoal-800 text-burnt-400">
                      Live Estimate
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-400 mt-2">
                    Guaranteed price for USCIS immigration translation with signed statement.
                  </p>
                </div>

                {/* Line Items Breakdown */}
                <div className="space-y-3 text-xs font-mono border-b border-charcoal-800 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-300">
                      {pageCount} page(s) × ${calculateTotal.ratePerPage.toFixed(2)} ({speed})
                    </span>
                    <span className="text-white font-bold">
                      ${calculateTotal.translationSubtotal.toFixed(2)}
                    </span>
                  </div>

                  {notarized && (
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-300">Notary Certificate</span>
                      <span className="text-white font-bold">+$19.00</span>
                    </div>
                  )}

                  {hardcopy && (
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-300">FedEx Physical Delivery</span>
                      <span className="text-white font-bold">+$15.00</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-charcoal-400 text-[11px]">
                    <span>USCIS Statement of Accuracy</span>
                    <span className="text-emerald-400 font-semibold">Included ($0)</span>
                  </div>

                  <div className="flex items-center justify-between text-charcoal-400 text-[11px]">
                    <span>90-Day Free Minor Revisions</span>
                    <span className="text-emerald-400 font-semibold">Included ($0)</span>
                  </div>
                </div>

                {/* Total Row */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase font-mono text-charcoal-400 tracking-wider">
                      Total Guaranteed Cost
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      ${calculateTotal.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-400 font-mono flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Estimated Delivery: <strong>{deliveryHours[speed]}</strong></span>
                  </p>
                </div>

                {/* Order CTA Button */}
                <button
                  type="button"
                  onClick={() => setOrderPlaced(true)}
                  className="w-full py-3.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Start Translation Order — ${calculateTotal.total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Security Guarantees */}
                <div className="pt-2 border-t border-charcoal-800/80 space-y-1.5 text-[10px] text-charcoal-400 font-mono">
                  <p className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-[#EA580C]" />
                    100% money-back guarantee if rejected by USCIS
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-charcoal-500" />
                    256-bit encrypted &amp; attorney-client privacy standard
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

