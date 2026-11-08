export type ExpenseCategory =
  | 'Software & SaaS'
  | 'Utilities'
  | 'Office Supplies'
  | 'Travel & Meals'
  | 'Hardware & Equipment'
  | 'Professional Services'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Software & SaaS',
  'Utilities',
  'Office Supplies',
  'Travel & Meals',
  'Hardware & Equipment',
  'Professional Services',
  'Other',
];

export interface LineItem {
  id: string;
  description: string;
  category: ExpenseCategory;
  quantity: number;
  unitPrice: number;
  extractedAmount: number;
  calculatedAmount: number;
  hasLineDiscrepancy: boolean;
}

export interface AuditResult {
  calculatedSubtotal: number;
  subtotalDiscrepancy: number;
  calculatedGrandTotal: number;
  grandTotalDiscrepancy: number;
  effectiveTaxRate: number;
  status: 'MATCH' | 'DISCREPANCY' | 'WARNING';
  flags: string[];
}

export interface ParsedDocument {
  id: string;
  fileName: string;
  fileType: string;
  filePreviewUrl: string;
  processedAt: string;
  vendorName: string;
  vendorAddress?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  currency: string;
  currencySymbol: string;
  lineItems: LineItem[];
  extractedSubtotal: number;
  extractedTax: number;
  extractedDiscount: number;
  extractedShipping: number;
  extractedGrandTotal: number;
  audit: AuditResult;
  modelUsed?: string;
}

export interface GeminiExtractedData {
  vendorName: string;
  vendorAddress?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  currency: string;
  currencySymbol: string;
  lineItems: {
    description: string;
    category: ExpenseCategory;
    quantity: number;
    unitPrice: number;
    extractedAmount: number;
  }[];
  extractedSubtotal: number;
  extractedTax: number;
  extractedDiscount: number;
  extractedShipping: number;
  extractedGrandTotal: number;
}

