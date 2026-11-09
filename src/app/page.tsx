'use client';

import React, { useState, useCallback } from 'react';
import {
  FileText,
  Download,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  BarChart3,
  Table,
  Layers,
  UploadCloud,
  FileSpreadsheet,
  Calculator,
  ScanLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ParsedDocument } from '@/types/invoice';
import UploadZone from '@/components/UploadZone';
import AuditWorkbench from '@/components/AuditWorkbench';
import SpendingAnalytics from '@/components/SpendingAnalytics';
import { exportToCSV, exportToXLSX } from '@/lib/exportUtils';

type Tab = 'workbench' | 'analytics';

export default function Home() {
  const [documents, setDocuments] = useState<ParsedDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('workbench');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || null;

  const handleDocumentsProcessed = useCallback(
    (newDocs: ParsedDocument[]) => {
      setDocuments((prev) => {
        const existingIds = new Set(prev.map((d) => d.id));
        const filteredNew = newDocs.filter((d) => !existingIds.has(d.id));
        return [...prev, ...filteredNew];
      });
      if (newDocs.length > 0) {
        setSelectedDocId(newDocs[0].id);
        setActiveTab('workbench');
      }
    },
    []
  );

  const handleDocumentUpdate = useCallback(
    (updatedDoc: ParsedDocument) => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
      );
    },
    []
  );

  const handleExportCSV = useCallback(() => {
    if (documents.length === 0) return;
    exportToCSV(documents, 'reconciled-invoices-report');
  }, [documents]);

  const handleExportXLSX = useCallback(() => {
    if (documents.length === 0) return;
    exportToXLSX(documents, 'financial-audit-workbook');
  }, [documents]);

  const handleExportActiveCSV = useCallback(() => {
    if (!selectedDoc) return;
    exportToCSV([selectedDoc], `audit-${selectedDoc.invoiceNumber}`);
  }, [selectedDoc]);

  const handleExportActiveXLSX = useCallback(() => {
    if (!selectedDoc) return;
    exportToXLSX([selectedDoc], `audit-${selectedDoc.invoiceNumber}`);
  }, [selectedDoc]);

  const statusBadge = (status: ParsedDocument['audit']['status']) => {
    switch (status) {
      case 'MATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold rounded">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> MATCH
          </span>
        );
      case 'DISCREPANCY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 border border-rose-300 text-rose-800 text-[10px] font-bold rounded">
            <ShieldAlert className="w-2.5 h-2.5 text-rose-600" /> ERR
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-300 text-orange-800 text-[10px] font-bold rounded">
            <ShieldQuestion className="w-2.5 h-2.5 text-orange-600" /> WARN
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] flex flex-col text-[#0A0A0A] font-sans antialiased">
      {/* Top Professional Navbar */}
      <header className="sticky top-0 z-40 bg-[#FBF8F3]/90 backdrop-blur-xl border-b border-[#EAE4D8] shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 border border-orange-200 rounded-xl shadow-inner flex items-center justify-center">
              <Layers className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-black tracking-tight">
                  Invoice Intelligence Hub
                </h1>
                <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  Auto-Fallback Engine
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                AI Multimodal Financial Document &amp; Math Discrepancy Auditor
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Global Export Buttons */}
            {documents.length > 0 && (
              <div className="flex items-center bg-white border border-[#EAE4D8] rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-black hover:bg-orange-50 hover:text-orange-600 transition-colors font-mono"
                  title="Export all to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-black" />
                  <span>CSV</span>
                </button>
                <div className="w-px h-5 bg-[#EAE4D8]" />
                <button
                  onClick={handleExportXLSX}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-black hover:bg-orange-50 hover:text-orange-600 transition-colors font-mono"
                  title="Export 3-Sheet Reconciled Excel Workbook (.xlsx)"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" />
                  <span>XLSX</span>
                </button>
              </div>
            )}

            {/* AI Engine Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#EAE4D8] bg-white text-xs font-medium text-black shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="hidden md:inline font-mono text-[11px] text-stone-700">
                Gemini Vision AI Ready
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Left Sidebar: Upload Zone & Document Queue */}
          <aside className="space-y-4">
            <UploadZone
              onDocumentsProcessed={handleDocumentsProcessed}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />

            {/* Document Queue Sidebar */}
            {documents.length > 0 && (
              <div className="bg-white border border-[#EAE4D8] rounded-2xl p-3.5 shadow-sm space-y-2">
                <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-[#EAE4D8]">
                  <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                    Audited Queue ({documents.length})
                  </h3>
                  <button
                    onClick={() => {
                      setDocuments([]);
                      setSelectedDocId(null);
                    }}
                    className="text-[10px] text-stone-500 hover:text-rose-600 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setActiveTab('workbench');
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
                        selectedDocId === doc.id && activeTab === 'workbench'
                          ? 'bg-orange-50/90 border-2 border-orange-500 shadow-sm'
                          : 'bg-[#FAF8F5] border border-[#EAE4D8] hover:bg-orange-50/40 hover:border-orange-300'
                      )}
                    >
                      <div
                        className={cn(
                          'p-1.5 rounded-lg flex-shrink-0',
                          selectedDocId === doc.id && activeTab === 'workbench'
                            ? 'bg-orange-600 text-white'
                            : 'bg-stone-200 text-black'
                        )}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-black truncate">
                          {doc.vendorName}
                        </p>
                        <p className="text-[10px] text-stone-600 font-mono truncate">
                          {doc.invoiceNumber} • {doc.currencySymbol}
                          {doc.extractedGrandTotal.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        {statusBadge(doc.audit.status)}
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Display Area */}
          <div className="space-y-4">
            {/* View Switcher Tabs & Active Document Actions */}
            {documents.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center bg-[#F3EFE6] border border-[#EAE4D8] rounded-xl p-1 shadow-inner">
                  <button
                    onClick={() => setActiveTab('workbench')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all',
                      activeTab === 'workbench'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-stone-700 hover:text-black'
                    )}
                  >
                    <Table className="w-3.5 h-3.5 text-orange-500" />
                    Audit Workbench
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all',
                      activeTab === 'analytics'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-stone-700 hover:text-black'
                    )}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-orange-500" />
                    Spending Analytics
                  </button>
                </div>

                {/* Active Document Export Buttons */}
                {activeTab === 'workbench' && selectedDoc && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportActiveCSV}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-black hover:text-orange-600 bg-white border border-[#EAE4D8] hover:border-orange-300 rounded-xl transition-colors shadow-sm font-mono"
                      title="Export active invoice to CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-black" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={handleExportActiveXLSX}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-black hover:text-orange-600 bg-white border border-[#EAE4D8] hover:border-orange-300 rounded-xl transition-colors shadow-sm font-mono"
                      title="Export active invoice to XLSX"
                    >
                      <Download className="w-3.5 h-3.5 text-orange-600" />
                      <span>XLSX</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Content Area */}
            {documents.length === 0 ? (
              /* Professional Modern Clean Empty State (Cream Background + Black Text + Orange Accents) */
              <div className="bg-white border border-[#EAE4D8] rounded-3xl p-8 sm:p-14 text-center shadow-sm space-y-10">
                <div className="max-w-xl mx-auto space-y-4">
                  {/* Subtle Orange Accent Icon */}
                  <div className="w-16 h-16 mx-auto bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-center shadow-sm">
                    <Layers className="w-8 h-8 text-orange-600" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                      Multimodal Document &amp; Invoice Intelligence
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      Production-ready financial auditor powered by Gemini Vision AI with multi-model fallback cascade.
                      Upload real receipts, invoices, or utility bills to extract structured line items, verify mathematical accuracy deterministically, and reconcile financial data.
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] border border-[#EAE4D8] rounded-full text-xs font-semibold text-black shadow-sm">
                      <UploadCloud className="w-4 h-4 text-orange-600" />
                      <span>Drop your invoices or receipts in the sidebar to begin</span>
                    </span>
                  </div>
                </div>

                {/* 4 Architectural Pipeline Highlights */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-2 border-t border-[#EAE4D8]">
                  <div className="bg-[#FAF8F5] border border-[#EAE4D8] rounded-2xl p-4 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                      <ScanLine className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-black">
                      Multimodal Extraction
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Gemini Vision reads raw PDFs and images, extracting vendor, dates, line items, and printed totals verbatim.
                    </p>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EAE4D8] rounded-2xl p-4 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-black">
                      Deterministic Math
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Recalculates Qty × Price line-by-line in pure JavaScript. Catches vendor addition and multiplication errors.
                    </p>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EAE4D8] rounded-2xl p-4 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-black">
                      Tax Sanity Audit
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Audits subtotal, shipping, discount, and effective tax rates, flagging anomalies exceeding 30%.
                    </p>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EAE4D8] rounded-2xl p-4 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-black">
                      One-Click Export
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Export reconciled items to CSV or a formatted 3-sheet Excel workbook (Items, Taxes, Discrepancies).
                    </p>
                  </div>
                </div>
              </div>
            ) : activeTab === 'workbench' ? (
              selectedDoc ? (
                <AuditWorkbench
                  document={selectedDoc}
                  onDocumentUpdate={handleDocumentUpdate}
                />
              ) : (
                <div className="bg-white border border-[#EAE4D8] rounded-2xl p-12 text-center text-stone-500 shadow-sm">
                  Select a document from the sidebar queue to inspect and reconcile.
                </div>
              )
            ) : (
              <SpendingAnalytics documents={documents} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
