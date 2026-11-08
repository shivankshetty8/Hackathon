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
          bg: 'bg-emerald-500/5',
          border: 'border-emerald-500/20',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
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
          bg: 'bg-rose-500/5',
          border: 'border-rose-500/20',
          text: 'text-rose-400',
          badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: XCircle,
          label: 'Discrepancy Detected',
          headline: `Discrepancy Detected — ${deltaText}. Expanding audit flags below.`,
          description: 'Calculated mathematical sums do not match the printed values on the document.',
        };
      case 'WARNING':
        return {
          bg: 'bg-orange-500/5',
          border: 'border-orange-500/20',
          text: 'text-orange-400',
          badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
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
      <div className="xl:col-span-5 bg-[#121215] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
        {/* Metadata Badges Bar */}
        <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-950/60">
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
            <p className="text-[11px] text-zinc-500 mt-2 px-1 truncate font-mono">
              <span className="text-zinc-400 font-sans">Address:</span> {doc.vendorAddress}
            </p>
          )}
        </div>

        {/* Viewer Controls */}
        <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Reset"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-zinc-400 ml-2">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {zoom > 1 && (
              <span className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded font-mono">
                <Move className="w-2.5 h-2.5" /> Pan Active
              </span>
            )}
            <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px] text-zinc-300 font-mono truncate max-w-[140px]">
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
            'relative overflow-hidden p-5 min-h-[500px] max-h-[660px] flex items-center justify-center bg-black select-none',
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
                className="max-w-full max-h-[620px] rounded-lg shadow-2xl object-contain pointer-events-none border border-zinc-800"
              />
            </div>
          ) : isPdf && doc.filePreviewUrl ? (
            <div
              className="w-full h-[580px] rounded-lg overflow-hidden border border-zinc-800 shadow-2xl"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <iframe
                src={doc.filePreviewUrl}
                title={doc.fileName}
                className="w-full h-full border-0 rounded-lg"
              />
            </div>
          ) : (
            /* Executive Financial Document Facsimile (When file-less demo or text-only) */
            <div
              className="transition-transform duration-100 ease-out w-full max-w-[440px]"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <DocumentFacsimile doc={doc} statusConfig={statusConfig} />
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Editable Table & Reconciliation Card (7 cols) */}
      <div className="xl:col-span-7 bg-[#121215] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
        {/* Modern Audit Status Banner */}
        <div className={cn('p-4 border-b transition-colors', statusConfig.bg, statusConfig.border)}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-md bg-black/40 border border-zinc-800">
                <StatusIcon className={cn('w-4 h-4 flex-shrink-0', statusConfig.text)} />
              </div>
              <div>
                <h3 className={cn('font-semibold text-xs tracking-tight', statusConfig.text)}>
                  {statusConfig.headline}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  {statusConfig.description}
                </p>
              </div>
            </div>
            <span
              className={cn(
                'px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border font-mono',
                statusConfig.badgeBg
              )}
            >
              {doc.audit.status}
            </span>
          </div>

          {/* Audit Flags List */}
          {doc.audit.flags.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Audit Discrepancy Findings ({doc.audit.flags.length}):
              </p>
              {doc.audit.flags.map((flag, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 bg-black/60 rounded-lg p-2 text-xs border border-zinc-800/80"
                >
                  <Info className={cn('w-3.5 h-3.5 mt-0.5 flex-shrink-0', statusConfig.text)} />
                  <span className="font-mono text-zinc-300 text-[11px] leading-relaxed">{flag}</span>
                </div>
              ))}
            </div>
          )}

          {/* Auto-fix Notification Toast */}
          {fixNotification && (
            <div className="mt-2.5 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{fixNotification}</span>
            </div>
          )}
        </div>

        {/* Workbench Action Toolbar */}
        <div className="px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={addLineItem}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-zinc-600 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-orange-400" />
              Add Line Item
            </button>

            {doc.audit.status === 'DISCREPANCY' && (
              <button
                onClick={handleAutoFix}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all shadow-md shadow-orange-600/25"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Auto-Fix Printed Totals
              </button>
            )}
          </div>

          <div className="text-xs text-zinc-400 font-mono">
            <span className="text-white font-semibold">{doc.lineItems.length}</span> items
          </div>
        </div>

        {/* Interactive Editable Data Table */}
        <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-semibold tracking-wider uppercase text-[10px]">
              <tr>
                <th className="px-3 py-2.5 w-8 text-center text-zinc-500">#</th>
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
            <tbody className="divide-y divide-zinc-800/60 font-mono">
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
        <div className="border-t border-zinc-800 p-4 bg-zinc-950/70 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Reconciliation Summary
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">
              Audited vs. Printed
            </span>
          </div>

          {/* Column Headers for Summary */}
          <div className="grid grid-cols-[1fr,110px,110px,100px] gap-2 px-2 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
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

            <div className="pt-2 border-t border-zinc-800/80">
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
        'border rounded-xl p-2.5 transition-colors',
        highlight
          ? 'bg-orange-500/10 border-orange-500/30 text-orange-300'
          : 'bg-[#121215] border-zinc-800'
      )}
    >
      <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] uppercase font-semibold tracking-wider">
        <Icon className={cn('w-3 h-3', highlight ? 'text-orange-400' : 'text-zinc-400')} />
        <span>{label}</span>
      </div>
      <p
        className={cn(
          'text-xs font-semibold truncate mt-1',
          highlight ? 'text-orange-300 font-mono' : 'text-white'
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
        item.hasLineDiscrepancy ? 'bg-rose-500/5 hover:bg-rose-500/10' : 'hover:bg-zinc-900/40'
      )}
    >
      <td className="px-3 py-2 text-center text-zinc-500 text-xs">
        {index + 1}
      </td>

      {/* Description */}
      <td className="px-3 py-2 font-sans">
        <input
          type="text"
          value={item.description}
          onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
          className="w-full bg-transparent text-white text-xs border border-transparent hover:border-zinc-700 focus:border-orange-500 focus:bg-zinc-950 rounded-lg px-2 py-1 outline-none transition-colors"
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
            className="w-full bg-zinc-900 text-zinc-200 text-[11px] border border-zinc-800 rounded-lg px-2 py-1 appearance-none cursor-pointer focus:border-orange-500 outline-none pr-6 truncate"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
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
          className="w-14 bg-transparent text-white text-xs text-right border border-transparent hover:border-zinc-700 focus:border-orange-500 focus:bg-zinc-950 rounded-lg px-1.5 py-1 outline-none transition-colors"
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
          className="w-20 bg-transparent text-white text-xs text-right border border-transparent hover:border-zinc-700 focus:border-orange-500 focus:bg-zinc-950 rounded-lg px-1.5 py-1 outline-none transition-colors"
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
              ? 'border-rose-500/50 text-rose-400 bg-rose-500/10 focus:border-rose-400'
              : 'border-transparent hover:border-zinc-700 focus:border-orange-500 focus:bg-zinc-950 text-white'
          )}
        />
      </td>

      {/* Audited Total */}
      <td className="px-3 py-2 text-right font-bold text-zinc-200">
        {currencySymbol}
        {item.calculatedAmount.toFixed(2)}
      </td>

      {/* Status Badge */}
      <td className="px-3 py-2 text-center">
        {item.hasLineDiscrepancy ? (
          <div className="relative group/tip inline-flex">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold rounded cursor-help">
              <XCircle className="w-3 h-3 text-rose-400" />
              ERR
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex flex-col z-30 bg-zinc-950 border border-rose-500/40 rounded-xl p-2.5 shadow-2xl text-[11px] whitespace-nowrap min-w-[200px] text-left">
              <div className="text-rose-400 font-bold mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Math Discrepancy
              </div>
              <div className="text-zinc-300">
                Qty ({item.quantity}) × Rate (${item.unitPrice.toFixed(2)})
              </div>
              <div className="text-emerald-400 font-bold">
                Calculated: ${item.calculatedAmount.toFixed(2)}
              </div>
              <div className="text-rose-400">
                Printed: ${item.extractedAmount.toFixed(2)}
              </div>
              <div className="text-orange-400 font-semibold pt-1 border-t border-zinc-800 mt-1">
                Delta: {diff > 0 ? '+' : ''}${diff.toFixed(2)}
              </div>
            </div>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-400" title="Calculations Match">
            <CheckCircle2 className="w-4 h-4 mx-auto" />
          </span>
        )}
      </td>

      {/* Delete Action */}
      <td className="px-3 py-2 text-center">
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
        hasMismatch ? 'bg-rose-500/10 border border-rose-500/25' : 'hover:bg-zinc-900/60'
      )}
    >
      <span
        className={cn(
          'text-xs font-sans',
          isBold ? 'font-bold text-white text-sm' : 'text-zinc-400'
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
              ? 'border-rose-500/40 text-rose-400 font-bold bg-rose-500/10'
              : isBold
              ? 'border-transparent font-bold text-white'
              : 'border-transparent text-zinc-300 hover:border-zinc-700'
          )}
        />
      </div>

      {/* Audited Calculation */}
      <span
        className={cn(
          'text-right font-mono text-xs',
          isBold ? 'font-bold text-emerald-400 text-sm' : 'text-zinc-300'
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
              'inline-block px-1.5 py-0.5 rounded text-[11px]',
              delta > 0
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
            )}
          >
            {delta > 0 ? '+' : ''}
            {symbol}
            {delta.toFixed(2)}
          </span>
        ) : (
          <span className="text-emerald-400 inline-flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" /> MATCH
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
    <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl text-zinc-300 font-sans text-xs space-y-4 relative">
      {/* Document Header */}
      <div className="border-b border-zinc-800 pb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">
              {doc.vendorName}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              {doc.invoiceNumber}
            </span>
          </div>
          {doc.vendorAddress && (
            <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">{doc.vendorAddress}</p>
          )}
        </div>

        <div className="text-right font-mono text-[11px] text-zinc-400">
          <div>Date: <span className="text-white font-semibold">{doc.invoiceDate}</span></div>
          {doc.dueDate && <div>Due: <span className="text-zinc-300">{doc.dueDate}</span></div>}
        </div>
      </div>

      {/* Itemized Line Items Table */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden font-mono text-[11px]">
        <table className="w-full text-left">
          <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="p-2.5">Item</th>
              <th className="p-2.5 text-right">Qty</th>
              <th className="p-2.5 text-right">Rate</th>
              <th className="p-2.5 text-right">Printed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {doc.lineItems.map((item, idx) => (
              <tr
                key={idx}
                className={cn(
                  item.hasLineDiscrepancy ? 'bg-rose-500/10 text-rose-300 font-semibold' : 'text-zinc-300'
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
        <div className="flex justify-between text-zinc-400">
          <span>Printed Subtotal:</span>
          <span className="text-zinc-200">${doc.extractedSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Printed Tax:</span>
          <span className="text-zinc-200">${doc.extractedTax.toFixed(2)}</span>
        </div>
        {doc.extractedDiscount > 0 && (
          <div className="flex justify-between text-zinc-400">
            <span>Discount:</span>
            <span className="text-emerald-400">-${doc.extractedDiscount.toFixed(2)}</span>
          </div>
        )}
        {doc.extractedShipping > 0 && (
          <div className="flex justify-between text-zinc-400">
            <span>Shipping:</span>
            <span className="text-zinc-200">+${doc.extractedShipping.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-zinc-800">
          <span>Grand Total Due:</span>
          <span className="text-orange-400">${doc.extractedGrandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
