'use client';

import React, { useCallback, useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ParsedDocument, GeminiExtractedData } from '@/types/invoice';
import { runDocumentAudit } from '@/lib/auditEngine';
import { v4 as uuidv4 } from 'uuid';

interface UploadZoneProps {
  onDocumentsProcessed: (docs: ParsedDocument[]) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

interface QueueItem {
  id: string;
  file: File;
  status: 'queued' | 'processing' | 'done' | 'error';
  error?: string;
  progress: number;
}

const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
];

export default function UploadZone({
  onDocumentsProcessed,
  isProcessing,
  setIsProcessing,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File): Promise<ParsedDocument | null> => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to process document');
      }

      const result = await response.json();
      const extractedData: GeminiExtractedData = result.data;
      const modelUsed: string | undefined = result.modelUsed;

      let previewUrl = '';
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        previewUrl = URL.createObjectURL(file);
      }

      const lineItems = extractedData.lineItems.map((item) => {
        const calculatedAmount =
          Math.round((item.quantity * item.unitPrice + Number.EPSILON) * 100) / 100;
        return {
          id: uuidv4(),
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          extractedAmount: item.extractedAmount,
          calculatedAmount,
          hasLineDiscrepancy:
            Math.abs(item.extractedAmount - calculatedAmount) > 0.01,
        };
      });

      const docBase: Omit<ParsedDocument, 'audit'> = {
        id: uuidv4(),
        fileName: file.name,
        fileType: file.type,
        filePreviewUrl: previewUrl,
        processedAt: new Date().toISOString(),
        vendorName: extractedData.vendorName,
        vendorAddress: extractedData.vendorAddress,
        invoiceNumber: extractedData.invoiceNumber,
        invoiceDate: extractedData.invoiceDate,
        dueDate: extractedData.dueDate,
        currency: extractedData.currency,
        currencySymbol: extractedData.currencySymbol,
        lineItems,
        extractedSubtotal: extractedData.extractedSubtotal,
        extractedTax: extractedData.extractedTax,
        extractedDiscount: extractedData.extractedDiscount,
        extractedShipping: extractedData.extractedShipping,
        extractedGrandTotal: extractedData.extractedGrandTotal,
        modelUsed,
      };

      return {
        ...docBase,
        audit: runDocumentAudit(docBase),
      };
    },
    []
  );

  const processQueue = useCallback(
    async (files: File[]) => {
      setIsProcessing(true);
      const newQueue: QueueItem[] = files.map((file) => ({
        id: uuidv4(),
        file,
        status: 'queued' as const,
        progress: 0,
      }));
      setQueue(newQueue);

      const results: ParsedDocument[] = [];

      for (let i = 0; i < newQueue.length; i++) {
        const item = newQueue[i];
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: 'processing', progress: 30 } : q
          )
        );

        try {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, progress: 65 } : q
            )
          );

          const doc = await processFile(item.file);

          if (doc) {
            results.push(doc);
            setQueue((prev) =>
              prev.map((q) =>
                q.id === item.id
                  ? { ...q, status: 'done', progress: 100 }
                  : q
              )
            );
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Processing failed';
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? { ...q, status: 'error', error: message, progress: 100 }
                : q
            )
          );
        }
      }

      if (results.length > 0) {
        onDocumentsProcessed(results);
      }

      setIsProcessing(false);

      setTimeout(() => {
        setQueue((prev) => prev.filter((q) => q.status === 'processing'));
      }, 4000);
    },
    [processFile, onDocumentsProcessed, setIsProcessing]
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const validFiles = Array.from(fileList).filter((f) =>
        ACCEPTED_TYPES.includes(f.type)
      );
      if (validFiles.length > 0) {
        processQueue(validFiles);
      }
    },
    [processQueue]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeQueueItem = useCallback((id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  }, []);

  return (
    <div className="space-y-3">
      {/* Sleek Professional Cream & Orange Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all duration-200 group',
          isDragOver
            ? 'border-orange-500 bg-orange-50/70 shadow-lg shadow-orange-500/10 scale-[1.01]'
            : 'border-[#DDD2BD] bg-white hover:border-orange-500 hover:bg-orange-50/20 shadow-sm'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'p-3.5 rounded-xl border transition-all duration-200',
              isDragOver
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-orange-50 border-orange-200 text-orange-600 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600'
            )}
          >
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs font-bold text-black tracking-tight">
              Drop invoices or receipts here
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              or click to browse from device
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-stone-600 pt-2 border-t border-[#EAE4D8] w-full justify-center">
            <span className="flex items-center gap-1 font-mono font-medium text-black">
              <FileText className="w-3 h-3 text-orange-600" /> PDF
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono font-medium text-black">
              <ImageIcon className="w-3 h-3 text-orange-600" /> PNG / JPEG / WEBP
            </span>
          </div>
        </div>
      </div>

      {/* Batch Processing Queue */}
      {queue.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {queue.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#EAE4D8] rounded-xl p-3 flex items-center gap-3 shadow-sm"
            >
              <div className="flex-shrink-0">
                {item.status === 'processing' && (
                  <Loader2 className="w-4 h-4 text-orange-600 animate-spin" />
                )}
                {item.status === 'done' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                {item.status === 'error' && (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
                {item.status === 'queued' && (
                  <div className="w-4 h-4 rounded-full border-2 border-stone-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-black truncate font-mono">
                  {item.file.name}
                </p>
                {item.error && (
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">{item.error}</p>
                )}
                {(item.status === 'processing' || item.status === 'queued') && (
                  <div className="mt-1.5 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {(item.status === 'done' || item.status === 'error') && (
                <button
                  onClick={() => removeQueueItem(item.id)}
                  className="p-1 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-black transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
