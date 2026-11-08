import { ParsedDocument } from '@/types/invoice';
import * as XLSX from 'xlsx';

export function exportToCSV(documents: ParsedDocument[], filename: string = 'invoice-audit-export'): void {
  const headers = [
    'Invoice #',
    'Vendor',
    'Invoice Date',
    'Category',
    'Description',
    'Qty',
    'Unit Price',
    'Printed Total',
    'Audited Total',
    'Discrepancy Amount',
    'Audit Status',
    'Currency',
  ];

  const rows: string[][] = [];

  documents.forEach((doc) => {
    doc.lineItems.forEach((item) => {
      const discrepancy = Math.round((item.extractedAmount - item.calculatedAmount) * 100) / 100;
      rows.push([
        doc.invoiceNumber,
        doc.vendorName,
        doc.invoiceDate,
        item.category,
        item.description,
        item.quantity.toString(),
        item.unitPrice.toFixed(2),
        item.extractedAmount.toFixed(2),
        item.calculatedAmount.toFixed(2),
        discrepancy.toFixed(2),
        doc.audit.status,
        doc.currency,
      ]);
    });
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportToXLSX(documents: ParsedDocument[], filename: string = 'invoice-audit-workbook'): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive Summary
  const summaryData = documents.map((doc) => ({
    'Invoice #': doc.invoiceNumber,
    'Vendor': doc.vendorName,
    'Invoice Date': doc.invoiceDate,
    'Currency': doc.currencySymbol,
    'Printed Subtotal': doc.extractedSubtotal,
    'Audited Subtotal': doc.audit.calculatedSubtotal,
    'Tax': doc.extractedTax,
    'Tax Rate (%)': doc.audit.effectiveTaxRate,
    'Discount': doc.extractedDiscount,
    'Shipping': doc.extractedShipping,
    'Printed Grand Total': doc.extractedGrandTotal,
    'Audited Grand Total': doc.audit.calculatedGrandTotal,
    'Variance': doc.audit.grandTotalDiscrepancy,
    'Audit Status': doc.audit.status,
    'Processed At': doc.processedAt,
  }));

  const ws1 = XLSX.utils.json_to_sheet(summaryData);
  ws1['!cols'] = [
    { wch: 15 }, { wch: 25 }, { wch: 14 }, { wch: 6 },
    { wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 12 },
    { wch: 10 }, { wch: 10 }, { wch: 18 }, { wch: 18 },
    { wch: 12 }, { wch: 14 }, { wch: 22 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Executive Summary');

  // Sheet 2: Itemized Line Items
  const lineItemData: Record<string, string | number>[] = [];
  documents.forEach((doc) => {
    doc.lineItems.forEach((item, idx) => {
      const discrepancy = Math.round((item.extractedAmount - item.calculatedAmount) * 100) / 100;
      lineItemData.push({
        'Invoice #': doc.invoiceNumber,
        'Vendor': doc.vendorName,
        'Invoice Date': doc.invoiceDate,
        'Line #': idx + 1,
        'Description': item.description,
        'Category': item.category,
        'Qty': item.quantity,
        'Unit Price': item.unitPrice,
        'Printed Total': item.extractedAmount,
        'Audited Total': item.calculatedAmount,
        'Discrepancy': discrepancy,
        'Has Error': item.hasLineDiscrepancy ? 'YES' : 'NO',
      });
    });
  });

  const ws2 = XLSX.utils.json_to_sheet(lineItemData);
  ws2['!cols'] = [
    { wch: 15 }, { wch: 25 }, { wch: 14 }, { wch: 8 },
    { wch: 30 }, { wch: 22 }, { wch: 6 }, { wch: 12 },
    { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'Line Items');

  // Sheet 3: Discrepancy Audit Log
  const discrepancyData: Record<string, string | number>[] = [];
  documents.forEach((doc) => {
    doc.audit.flags.forEach((flag) => {
      discrepancyData.push({
        'Invoice #': doc.invoiceNumber,
        'Vendor': doc.vendorName,
        'Invoice Date': doc.invoiceDate,
        'Audit Status': doc.audit.status,
        'Finding': flag,
        'Grand Total Variance': doc.audit.grandTotalDiscrepancy,
        'Subtotal Variance': doc.audit.subtotalDiscrepancy,
        'Effective Tax Rate (%)': doc.audit.effectiveTaxRate,
      });
    });
  });

  if (discrepancyData.length === 0) {
    discrepancyData.push({
      'Invoice #': '',
      'Vendor': '',
      'Invoice Date': '',
      'Audit Status': '',
      'Finding': 'No discrepancies found across all processed documents.',
      'Grand Total Variance': 0,
      'Subtotal Variance': 0,
      'Effective Tax Rate (%)': 0,
    });
  }

  const ws3 = XLSX.utils.json_to_sheet(discrepancyData);
  ws3['!cols'] = [
    { wch: 15 }, { wch: 25 }, { wch: 14 }, { wch: 14 },
    { wch: 80 }, { wch: 18 }, { wch: 16 }, { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, ws3, 'Discrepancy Log');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, `${filename}.xlsx`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

