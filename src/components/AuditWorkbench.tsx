'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Wand2,
  ChevronDown,
  Info,
  Building2,
  FileText,
  Calendar,
  CreditCard,
  Move,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ParsedDocument, LineItem, EXPENSE_CATEGORIES, ExpenseCategory } from '@/types/invoice';
import { runDocumentAudit, autoFixPrintedTotals } from '@/lib/auditEngine';
import { v4 as uuidv4 } from 'uuid';

interface AuditWorkbenchProps {
  document: ParsedDocument;
  onDocumentUpdate: (doc: ParsedDocument) => void;
}

export default function AuditWorkbench({ document: doc, onDocumentUpdate }: AuditWorkbenchProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fixNotification, setFixNotification] = useState<string | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(Math.round((z + 0.25) * 100) / 100, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(Math.round((z - 0.25) * 100) / 100, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleResetView = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const reaudit = useCallback(
    (updatedDoc: Omit<ParsedDocument, 'audit'>) => {
      const audit = runDocumentAudit(updatedDoc);
      onDocumentUpdate({ ...updatedDoc, audit });
    },
    [onDocumentUpdate]
  );

  const updateLineItem = useCallback(
    (itemId: string, field: keyof LineItem, value: string | number) => {
      const updatedItems = doc.lineItems.map((item) => {
        if (item.id !== itemId) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.calculatedAmount =
            Math.round((updated.quantity * updated.unitPrice + Number.EPSILON) * 100) / 100;
          updated.hasLineDiscrepancy =
            Math.abs(updated.extractedAmount - updated.calculatedAmount) > 0.01;
        }
        if (field === 'extractedAmount') {
          updated.hasLineDiscrepancy =
            Math.abs(Number(value) - updated.calculatedAmount) > 0.01;
        }
        return updated;
      });
      reaudit({ ...doc, lineItems: updatedItems });
    },
    [doc, reaudit]
  );

  const deleteLineItem = useCallback(
    (itemId: string) => {
      const updatedItems = doc.lineItems.filter((item) => item.id !== itemId);
      reaudit({ ...doc, lineItems: updatedItems });
    },
    [doc, reaudit]
  );

  const addLineItem = useCallback(() => {
    const newItem: LineItem = {
      id: uuidv4(),
      description: 'New Expense Item',
      category: 'Office Supplies',
      quantity: 1,
      unitPrice: 10.00,
      extractedAmount: 10.00,
      calculatedAmount: 10.00,
      hasLineDiscrepancy: false,
    };
    reaudit({ ...doc, lineItems: [...doc.lineItems, newItem] });
  }, [doc, reaudit]);

  const handleAutoFix = useCallback(() => {
    const fixed = autoFixPrintedTotals(doc);
    onDocumentUpdate(fixed);
    setFixNotification('Printed totals successfully reconciled to deterministic calculations.');
    setTimeout(() => setFixNotification(null), 4000);
  }, [doc, onDocumentUpdate]);

  const updateField = useCallback(
    (
      field:
        | 'extractedSubtotal'
        | 'extractedTax'
        | 'extractedDiscount'
        | 'extractedShipping'
        | 'extractedGrandTotal',
      value: number
    ) => {
      reaudit({ ...doc, [field]: value });
    },
    [doc, reaudit]
  );

  const statusConfig = useMemo(() => {
    switch (doc.audit.status) {
      case 'MATCH':
        return {
          bg: 'bg-emerald-50/80',
          border: 'border-emerald-300',
          text: 'text-emerald-950',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          label: 'Verified Match',
          headline: 'Verified Match — All line items, taxes, and totals reconcile to the cent.',
          description: 'Deterministic math checks confirmed zero calculations or tax variance.',
        };
      case 'DISCREPANCY':
        const grandVar = doc.audit.grandTotalDiscrepancy;
        const subVar = doc.audit.subtotalDiscrepancy;
        const mainDelta = Math.abs(grandVar) > 0.02 ? grandVar : subVar;
        const deltaText =
          mainDelta > 0
            ? `Overcharged by ${doc.currencySymbol}${mainDelta.toFixed(2)}`
            : `Undercharged by ${doc.currencySymbol}${Math.abs(mainDelta).toFixed(2)}`;

        return {
          bg: 'bg-rose-50/90',
          border: 'border-rose-300',
          text: 'text-rose-950',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: XCircle,
          label: 'Discrepancy Detected',
          headline: `Discrepancy Detected — ${deltaText}. Expanding audit flags below.`,
          description: 'Calculated mathematical sums do not match the printed values on the document.',
        };
      case 'WARNING':
        return {
          bg: 'bg-orange-50/90',
          border: 'border-orange-300',
          text: 'text-orange-950',
          badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: AlertTriangle,
          label: 'Audit Warning',
          headline: 'Audit Warning — Calculation requires accounting review.',
          description:
            doc.audit.effectiveTaxRate > 30
              ? `Effective tax rate of ${doc.audit.effectiveTaxRate.toFixed(1)}% exceeds normal threshold (> 30%).`
              : 'Math adds up, but tax anomalies or missing metadata require review.',
        };
    }
  }, [doc.audit, doc.currencySymbol]);

  const StatusIcon = statusConfig.icon;
  const isImage = doc.fileType.startsWith('image/') || doc.filePreviewUrl.endsWith('.svg');
  const isPdf = doc.fileType === 'application/pdf';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
      {/* Left Pane: Document Viewer (5 cols) */}
      <div className="xl:col-span-5 bg-white border border-[#EAE4D8] rounded-2xl overflow-hidden flex flex-col shadow-sm">
        {/* Metadata Badges Bar */}
        <div className="p-3.5 border-b border-[#EAE4D8] bg-[#FAF8F5]">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <MetaBadge icon={Building2} label="Vendor" value={doc.vendorName} />
            <MetaBadge icon={FileText} label="Doc #" value={doc.invoiceNumber} />
            <MetaBadge icon={Calendar} label="Date" value={doc.invoiceDate} />
            <MetaBadge icon={CreditCard} label="Curr" value={`${doc.currencySymbol} ${doc.currency}`} />
            <MetaBadge
              icon={Cpu}
              label="Engine"
              value={doc.modelUsed || 'gemini-3.5-flash'}
              highlight
            />
          </div>
          {doc.vendorAddress && (
            <p className="text-[11px] text-stone-600 mt-2 px-1 truncate font-mono">
              <span className="text-black font-semibold font-sans">Address:</span> {doc.vendorAddress}
            </p>
          )}
        </div>

        {/* Viewer Controls */}
        <div className="px-4 py-2 border-b border-[#EAE4D8] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-stone-200 rounded-lg text-black transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-stone-200 rounded-lg text-black transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 hover:bg-stone-200 rounded-lg text-black transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 hover:bg-stone-200 rounded-lg text-black transition-colors"
              title="Reset"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-semibold text-black ml-2">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {zoom > 1 && (
              <span className="flex items-center gap-1 text-[10px] text-orange-700 bg-orange-100 border border-orange-300 px-2 py-0.5 rounded font-mono font-semibold">
                <Move className="w-2.5 h-2.5 text-orange-600" /> Pan Active
              </span>
            )}
            <span className="bg-white border border-[#EAE4D8] px-2 py-0.5 rounded text-[11px] text-black font-mono font-medium truncate max-w-[140px] shadow-sm">
              {doc.fileName}
            </span>
          </div>
        </div>

        {/* Document View Canvas */}
        <div
          ref={viewerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={cn(
            'relative overflow-hidden p-5 min-h-[500px] max-h-[660px] flex items-center justify-center bg-[#F5EFE1] select-none',
            zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          )}
        >
          {isImage && doc.filePreviewUrl ? (
            <div
              className="transition-transform duration-100 ease-out max-w-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={doc.filePreviewUrl}
                alt={doc.fileName}
                className="max-w-full max-h-[620px] rounded-lg shadow-xl object-contain pointer-events-none border border-[#EAE4D8] bg-white"
              />
            </div>
          ) : isPdf && doc.filePreviewUrl ? (
            <div
              className="w-full h-[600px] transition-transform duration-100 ease-out"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <iframe
                src={`${doc.filePreviewUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full rounded-lg shadow-xl border border-[#EAE4D8] bg-white"
                title="PDF Preview"
              />
            </div>
          ) : (
            /* Executive Financial Document Facsimile (Clean White/Cream Table) */
            <div className="w-full max-w-md">
              <DocumentFacsimile doc={doc} statusConfig={statusConfig} />
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Editable Table & Reconciliation Workbench (7 cols) */}
      <div className="xl:col-span-7 bg-white border border-[#EAE4D8] rounded-2xl overflow-hidden flex flex-col shadow-sm">
        {/* Audit Status Banner */}
        <div className={cn('p-4 border-b', statusConfig.bg, statusConfig.border)}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-current shadow-sm mt-0.5">
                <StatusIcon className="w-5 h-5 text-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={cn('text-sm font-bold tracking-tight', statusConfig.text)}>
                    {statusConfig.headline}
                  </h3>
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono tracking-wider shadow-sm',
                      statusConfig.badgeBg
                    )}
                  >
                    {statusConfig.label}
                  </span>
                </div>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  {statusConfig.description}
                </p>
              </div>
            </div>
          </div>

          {/* Audit Flags Details */}
          {doc.audit.flags.length > 0 && (
            <div className="mt-3 pt-3 border-t border-black/10 space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-black">
                Forensic Audit Findings ({doc.audit.flags.length})
              </p>
              <div className="space-y-1">
                {doc.audit.flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-mono px-2.5 py-1.5 rounded-lg bg-white/80 border border-current shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600 flex-shrink-0" />
                    <span className="text-stone-900 font-medium">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auto-Fix Toast Notification */}
          {fixNotification && (
            <div className="mt-2.5 p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">{fixNotification}</span>
            </div>
          )}
        </div>

        {/* Workbench Action Toolbar */}
        <div className="px-4 py-2.5 border-b border-[#EAE4D8] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={addLineItem}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-black hover:bg-stone-800 text-white rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-orange-400" />
              Add Line Item
            </button>

            {doc.audit.status === 'DISCREPANCY' && (
              <button
                onClick={handleAutoFix}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all shadow-md shadow-orange-600/20"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Auto-Fix Printed Totals
              </button>
            )}
          </div>

          <div className="text-xs text-stone-600 font-mono">
            <span className="text-black font-bold">{doc.lineItems.length}</span> items
          </div>
        </div>

        {/* Interactive Editable Data Table */}
        <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-[#FAF8F5] border-b border-[#EAE4D8] text-stone-700 font-bold tracking-wider uppercase text-[10px]">
              <tr>
                <th className="px-3 py-2.5 w-8 text-center text-stone-500">#</th>
                <th className="px-3 py-2.5 min-w-[160px]">Description</th>
                <th className="px-3 py-2.5 min-w-[150px]">Category</th>
                <th className="px-3 py-2.5 w-16 text-right">Qty</th>
                <th className="px-3 py-2.5 w-24 text-right">Unit Price</th>
                <th className="px-3 py-2.5 w-28 text-right">Printed Total</th>
                <th className="px-3 py-2.5 w-28 text-right">Audited Total</th>
                <th className="px-3 py-2.5 w-20 text-center">Status</th>
                <th className="px-3 py-2.5 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8] font-mono">
              {doc.lineItems.map((item, index) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  currencySymbol={doc.currencySymbol}
                  onUpdate={updateLineItem}
                  onDelete={deleteLineItem}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Comparison Footer */}
        <div className="border-t border-[#EAE4D8] p-4 bg-[#FAF8F5] space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">
              Reconciliation Summary
            </h4>
            <span className="text-[10px] text-stone-600 font-mono">
              Audited vs. Printed
            </span>
          </div>

          {/* Column Headers for Summary */}
          <div className="grid grid-cols-[1fr,110px,110px,100px] gap-2 px-2 text-[10px] uppercase tracking-wider text-stone-700 font-bold">
            <span>Metric</span>
            <span className="text-right">Printed</span>
            <span className="text-right">Audited</span>
            <span className="text-right">Variance</span>
          </div>

          <div className="space-y-1 font-mono">
            <SummaryRow
              label="Subtotal"
              printed={doc.extractedSubtotal}
              audited={doc.audit.calculatedSubtotal}
              symbol={doc.currencySymbol}
              onPrintedChange={(v) => updateField('extractedSubtotal', v)}
            />
            <SummaryRow
              label={`Tax (${doc.audit.effectiveTaxRate.toFixed(1)}%)`}
              printed={doc.extractedTax}
              audited={doc.extractedTax}
              symbol={doc.currencySymbol}
              onPrintedChange={(v) => updateField('extractedTax', v)}
            />
            <SummaryRow
              label="Discount"
              printed={doc.extractedDiscount}
              audited={doc.extractedDiscount}
              symbol={doc.currencySymbol}
              onPrintedChange={(v) => updateField('extractedDiscount', v)}
              isNegative
            />
            <SummaryRow
              label="Shipping"
              printed={doc.extractedShipping}
              audited={doc.extractedShipping}
              symbol={doc.currencySymbol}
              onPrintedChange={(v) => updateField('extractedShipping', v)}
            />

            <div className="pt-2 border-t border-[#EAE4D8]">
              <SummaryRow
                label="Grand Total"
                printed={doc.extractedGrandTotal}
                audited={doc.audit.calculatedGrandTotal}
                symbol={doc.currencySymbol}
                onPrintedChange={(v) => updateField('extractedGrandTotal', v)}
                isBold
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function MetaBadge({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'border rounded-xl p-2.5 transition-colors shadow-sm',
        highlight
          ? 'bg-orange-50 border-orange-300 text-orange-900'
          : 'bg-white border-[#EAE4D8]'
      )}
    >
      <div className="flex items-center gap-1.5 text-stone-600 text-[10px] uppercase font-bold tracking-wider">
        <Icon className={cn('w-3 h-3', highlight ? 'text-orange-600' : 'text-stone-700')} />
        <span>{label}</span>
      </div>
      <p
        className={cn(
          'text-xs font-bold truncate mt-1',
          highlight ? 'text-orange-700 font-mono' : 'text-black'
        )}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

interface LineItemRowProps {
  item: LineItem;
  index: number;
  currencySymbol: string;
  onUpdate: (id: string, field: keyof LineItem, value: string | number) => void;
  onDelete: (id: string) => void;
}

function LineItemRow({
  item,
  index,
  currencySymbol,
  onUpdate,
  onDelete,
}: LineItemRowProps) {
  const diff = Math.round((item.extractedAmount - item.calculatedAmount) * 100) / 100;

  return (
    <tr
      className={cn(
        'group transition-colors',
        item.hasLineDiscrepancy ? 'bg-rose-50/70 hover:bg-rose-50' : 'hover:bg-orange-50/25'
      )}
    >
      <td className="px-3 py-2 text-center text-stone-500 text-xs">
        {index + 1}
      </td>

      {/* Description */}
      <td className="px-3 py-2 font-sans">
        <input
          type="text"
          value={item.description}
          onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
          className="w-full bg-transparent text-black text-xs font-medium border border-transparent hover:border-stone-300 focus:border-orange-500 focus:bg-white rounded-lg px-2 py-1 outline-none transition-colors"
        />
      </td>

      {/* Category Dropdown */}
      <td className="px-3 py-2 font-sans">
        <div className="relative">
          <select
            value={item.category}
            onChange={(e) =>
              onUpdate(item.id, 'category', e.target.value as ExpenseCategory)
            }
            className="w-full bg-white text-black text-[11px] font-medium border border-[#EAE4D8] rounded-lg px-2 py-1 appearance-none cursor-pointer focus:border-orange-500 outline-none pr-6 truncate shadow-sm"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-stone-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </td>

      {/* Qty */}
      <td className="px-3 py-2 text-right">
        <input
          type="number"
          value={item.quantity}
          min={0}
          step={1}
          onChange={(e) => onUpdate(item.id, 'quantity', parseFloat(e.target.value) || 0)}
          className="w-14 bg-transparent text-black text-xs font-semibold text-right border border-transparent hover:border-stone-300 focus:border-orange-500 focus:bg-white rounded-lg px-1.5 py-1 outline-none transition-colors"
        />
      </td>

      {/* Unit Price */}
      <td className="px-3 py-2 text-right">
        <input
          type="number"
          value={item.unitPrice}
          min={0}
          step={0.01}
          onChange={(e) => onUpdate(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
          className="w-20 bg-transparent text-black text-xs font-semibold text-right border border-transparent hover:border-stone-300 focus:border-orange-500 focus:bg-white rounded-lg px-1.5 py-1 outline-none transition-colors"
        />
      </td>

      {/* Printed Total */}
      <td className="px-3 py-2 text-right">
        <input
          type="number"
          value={item.extractedAmount}
          min={0}
          step={0.01}
          onChange={(e) =>
            onUpdate(item.id, 'extractedAmount', parseFloat(e.target.value) || 0)
          }
          className={cn(
            'w-24 bg-transparent text-xs text-right font-bold border rounded-lg px-1.5 py-1 outline-none transition-colors',
            item.hasLineDiscrepancy
              ? 'border-rose-400 text-rose-700 bg-rose-100/60 focus:border-rose-500'
              : 'border-transparent hover:border-stone-300 focus:border-orange-500 focus:bg-white text-black'
          )}
        />
      </td>

      {/* Audited Total */}
      <td className="px-3 py-2 text-right font-bold text-black">
        {currencySymbol}
        {item.calculatedAmount.toFixed(2)}
      </td>

      {/* Status Badge */}
      <td className="px-3 py-2 text-center">
        {item.hasLineDiscrepancy ? (
          <div className="relative group/tip inline-flex">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold rounded cursor-help shadow-sm">
              <XCircle className="w-3 h-3 text-rose-600" />
              ERR
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex flex-col z-30 bg-white border border-rose-300 rounded-xl p-3 shadow-xl text-[11px] whitespace-nowrap min-w-[210px] text-left">
              <div className="text-rose-700 font-bold mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Math Discrepancy
              </div>
              <div className="text-stone-700">
                Qty ({item.quantity}) × Rate (${item.unitPrice.toFixed(2)})
              </div>
              <div className="text-emerald-700 font-bold">
                Calculated: ${item.calculatedAmount.toFixed(2)}
              </div>
              <div className="text-rose-700 font-medium">
                Printed: ${item.extractedAmount.toFixed(2)}
              </div>
              <div className="text-orange-700 font-bold pt-1 border-t border-[#EAE4D8] mt-1">
                Delta: {diff > 0 ? '+' : ''}${diff.toFixed(2)}
              </div>
            </div>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-600" title="Calculations Match">
            <CheckCircle2 className="w-4 h-4 mx-auto" />
          </span>
        )}
      </td>

      {/* Delete Action */}
      <td className="px-3 py-2 text-center">
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Delete row"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

interface SummaryRowProps {
  label: string;
  printed: number;
  audited: number;
  symbol: string;
  onPrintedChange: (v: number) => void;
  isBold?: boolean;
  isNegative?: boolean;
}

function SummaryRow({
  label,
  printed,
  audited,
  symbol,
  onPrintedChange,
  isBold,
  isNegative,
}: SummaryRowProps) {
  const delta = Math.round((printed - audited) * 100) / 100;
  const hasMismatch = Math.abs(delta) > 0.02;

  return (
    <div
      className={cn(
        'grid grid-cols-[1fr,110px,110px,100px] gap-2 items-center px-2 py-1 rounded-lg transition-colors',
        hasMismatch ? 'bg-rose-50 border border-rose-300' : 'hover:bg-orange-50/20'
      )}
    >
      <span
        className={cn(
          'text-xs font-sans',
          isBold ? 'font-bold text-black text-sm' : 'text-stone-700 font-medium'
        )}
      >
        {label}
      </span>

      {/* Editable Printed Value */}
      <div className="text-right">
        <input
          type="number"
          value={printed}
          step={0.01}
          onChange={(e) => onPrintedChange(parseFloat(e.target.value) || 0)}
          className={cn(
            'w-full bg-transparent text-right border rounded px-1.5 py-0.5 outline-none transition-colors text-xs font-mono',
            hasMismatch
              ? 'border-rose-400 text-rose-700 font-bold bg-white'
              : isBold
              ? 'border-transparent font-bold text-black'
              : 'border-transparent text-black hover:border-stone-300 focus:border-orange-500 focus:bg-white'
          )}
        />
      </div>

      {/* Audited Calculation */}
      <span
        className={cn(
          'text-right font-mono text-xs',
          isBold ? 'font-bold text-emerald-700 text-sm' : 'text-black font-semibold'
        )}
      >
        {isNegative ? '-' : ''}
        {symbol}
        {audited.toFixed(2)}
      </span>

      {/* Delta / Status */}
      <div className="text-right font-mono text-xs font-bold">
        {hasMismatch ? (
          <span
            className={cn(
              'inline-block px-1.5 py-0.5 rounded text-[11px] shadow-sm font-bold',
              delta > 0
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-orange-100 text-orange-800 border border-orange-300'
            )}
          >
            {delta > 0 ? '+' : ''}
            {symbol}
            {delta.toFixed(2)}
          </span>
        ) : (
          <span className="text-emerald-700 font-bold inline-flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> MATCH
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------- Professional Executive Financial Document Card ---------- */

function DocumentFacsimile({
  doc,
}: {
  doc: ParsedDocument;
  statusConfig: {
    bg: string;
    border: string;
    text: string;
    label: string;
  };
}) {
  return (
    <div className="bg-white border border-[#EAE4D8] rounded-2xl p-6 shadow-md text-stone-800 font-sans text-xs space-y-4 relative">
      {/* Document Header */}
      <div className="border-b border-[#EAE4D8] pb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-black tracking-tight">
              {doc.vendorName}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-800 font-bold">
              {doc.invoiceNumber}
            </span>
          </div>
          {doc.vendorAddress && (
            <p className="text-[11px] text-stone-600 mt-0.5 font-mono">{doc.vendorAddress}</p>
          )}
        </div>

        <div className="text-right font-mono text-[11px] text-stone-700">
          <div>Date: <span className="text-black font-bold">{doc.invoiceDate}</span></div>
          {doc.dueDate && <div>Due: <span className="text-stone-700">{doc.dueDate}</span></div>}
        </div>
      </div>

      {/* Itemized Line Items Table */}
      <div className="border border-[#EAE4D8] rounded-xl overflow-hidden font-mono text-[11px]">
        <table className="w-full text-left">
          <thead className="bg-[#FAF8F5] text-stone-700 font-bold uppercase text-[10px] border-b border-[#EAE4D8]">
            <tr>
              <th className="p-2.5">Item</th>
              <th className="p-2.5 text-right">Qty</th>
              <th className="p-2.5 text-right">Rate</th>
              <th className="p-2.5 text-right">Printed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4D8]">
            {doc.lineItems.map((item, idx) => (
              <tr
                key={idx}
                className={cn(
                  item.hasLineDiscrepancy ? 'bg-rose-50 text-rose-800 font-bold' : 'text-black'
                )}
              >
                <td className="p-2.5 truncate max-w-[170px]">{item.description}</td>
                <td className="p-2.5 text-right">{item.quantity}</td>
                <td className="p-2.5 text-right">${item.unitPrice.toFixed(2)}</td>
                <td className="p-2.5 text-right font-bold">
                  ${item.extractedAmount.toFixed(2)}
                  {item.hasLineDiscrepancy && ' *'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="space-y-1.5 text-right text-xs font-mono pt-1">
        <div className="flex justify-between text-stone-700">
          <span>Printed Subtotal:</span>
          <span className="text-black font-semibold">${doc.extractedSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-stone-700">
          <span>Printed Tax:</span>
          <span className="text-black font-semibold">${doc.extractedTax.toFixed(2)}</span>
        </div>
        {doc.extractedDiscount > 0 && (
          <div className="flex justify-between text-stone-700">
            <span>Discount:</span>
            <span className="text-emerald-700 font-semibold">-${doc.extractedDiscount.toFixed(2)}</span>
          </div>
        )}
        {doc.extractedShipping > 0 && (
          <div className="flex justify-between text-stone-700">
            <span>Shipping:</span>
            <span className="text-black font-semibold">+${doc.extractedShipping.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-black font-bold text-sm pt-2 border-t border-[#EAE4D8]">
          <span>Grand Total Due:</span>
          <span className="text-orange-600 font-bold">${doc.extractedGrandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
