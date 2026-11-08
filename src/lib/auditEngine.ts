import { AuditResult, LineItem, ParsedDocument } from '@/types/invoice';

function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function runDocumentAudit(
  doc: Omit<ParsedDocument, 'audit'>
): AuditResult {
  const flags: string[] = [];

  // Line-Level Check
  const auditedLineItems: LineItem[] = doc.lineItems.map((item, index) => {
    const calculatedAmount = roundToTwo(item.quantity * item.unitPrice);
    const hasLineDiscrepancy =
      Math.abs(item.extractedAmount - calculatedAmount) > 0.01;

    if (hasLineDiscrepancy) {
      const diff = roundToTwo(item.extractedAmount - calculatedAmount);
      const sign = diff > 0 ? '+' : '';
      flags.push(
        `Line ${index + 1}: Qty (${item.quantity}) × Unit Price ($${item.unitPrice.toFixed(2)}) = $${calculatedAmount.toFixed(2)}, but printed line total is $${item.extractedAmount.toFixed(2)} (${sign}$${diff.toFixed(2)} difference)`
      );
    }

    return {
      ...item,
      calculatedAmount,
      hasLineDiscrepancy,
    };
  });

  // Subtotal Check
  const calculatedSubtotal = roundToTwo(
    auditedLineItems.reduce((sum, item) => sum + item.calculatedAmount, 0)
  );
  const subtotalDiscrepancy = roundToTwo(
    doc.extractedSubtotal - calculatedSubtotal
  );

  if (Math.abs(subtotalDiscrepancy) > 0.02) {
    const sign = subtotalDiscrepancy > 0 ? '+' : '';
    flags.push(
      `Subtotal mismatch: Calculated subtotal is $${calculatedSubtotal.toFixed(2)}, but document shows $${doc.extractedSubtotal.toFixed(2)} (${sign}$${subtotalDiscrepancy.toFixed(2)} difference)`
    );
  }

  // Grand Total Check
  const calculatedGrandTotal = roundToTwo(
    calculatedSubtotal +
      doc.extractedTax +
      doc.extractedShipping -
      doc.extractedDiscount
  );
  const grandTotalDiscrepancy = roundToTwo(
    doc.extractedGrandTotal - calculatedGrandTotal
  );

  if (Math.abs(grandTotalDiscrepancy) > 0.02) {
    const sign = grandTotalDiscrepancy > 0 ? '+' : '';
    flags.push(
      `Grand Total mismatch: Calculated grand total is $${calculatedGrandTotal.toFixed(2)} (Subtotal $${calculatedSubtotal.toFixed(2)} + Tax $${doc.extractedTax.toFixed(2)} + Shipping $${doc.extractedShipping.toFixed(2)} - Discount $${doc.extractedDiscount.toFixed(2)}), but document shows $${doc.extractedGrandTotal.toFixed(2)} (${sign}$${grandTotalDiscrepancy.toFixed(2)} difference)`
    );
  }

  // Tax Sanity Check
  const effectiveTaxRate =
    calculatedSubtotal > 0
      ? roundToTwo((doc.extractedTax / calculatedSubtotal) * 100)
      : 0;

  if (doc.extractedTax < 0) {
    flags.push(
      `Tax anomaly: Negative tax amount ($${doc.extractedTax.toFixed(2)}) detected`
    );
  }

  if (effectiveTaxRate > 30) {
    flags.push(
      `Tax anomaly: Effective tax rate of ${effectiveTaxRate.toFixed(1)}% is unusually high (> 30%)`
    );
  }

  if (doc.extractedTax !== 0 && calculatedSubtotal === 0) {
    flags.push(
      `Tax anomaly: Tax of $${doc.extractedTax.toFixed(2)} applied to a zero subtotal`
    );
  }

  // Check for missing metadata
  const metadataWarnings: string[] = [];
  if (!doc.invoiceDate || doc.invoiceDate.trim() === '') {
    metadataWarnings.push('Invoice date is missing');
  }
  if (!doc.invoiceNumber || doc.invoiceNumber.trim() === '') {
    metadataWarnings.push('Invoice number is missing');
  }
  if (!doc.vendorName || doc.vendorName.trim() === '') {
    metadataWarnings.push('Vendor name is missing');
  }

  if (metadataWarnings.length > 0) {
    flags.push(`Missing metadata: ${metadataWarnings.join(', ')}`);
  }

  // Status Badge Assignment
  const hasLineDiscrepancies = auditedLineItems.some(
    (item) => item.hasLineDiscrepancy
  );
  const hasSubtotalDiscrepancy = Math.abs(subtotalDiscrepancy) > 0.02;
  const hasGrandTotalDiscrepancy = Math.abs(grandTotalDiscrepancy) > 0.02;

  let status: AuditResult['status'];

  if (hasLineDiscrepancies || hasSubtotalDiscrepancy || hasGrandTotalDiscrepancy) {
    status = 'DISCREPANCY';
  } else if (effectiveTaxRate > 30 || effectiveTaxRate < 0 || metadataWarnings.length > 0) {
    status = 'WARNING';
  } else {
    status = 'MATCH';
  }

  return {
    calculatedSubtotal,
    subtotalDiscrepancy,
    calculatedGrandTotal,
    grandTotalDiscrepancy,
    effectiveTaxRate,
    status,
    flags,
  };
}

export function recalculateLineItem(item: LineItem): LineItem {
  const calculatedAmount = roundToTwo(item.quantity * item.unitPrice);
  const hasLineDiscrepancy =
    Math.abs(item.extractedAmount - calculatedAmount) > 0.01;
  return {
    ...item,
    calculatedAmount,
    hasLineDiscrepancy,
  };
}

export function autoFixPrintedTotals(doc: ParsedDocument): ParsedDocument {
  const fixedLineItems = doc.lineItems.map((item) => {
    const calculatedAmount = roundToTwo(item.quantity * item.unitPrice);
    return {
      ...item,
      extractedAmount: calculatedAmount,
      calculatedAmount,
      hasLineDiscrepancy: false,
    };
  });

  const newSubtotal = roundToTwo(
    fixedLineItems.reduce((sum, item) => sum + item.calculatedAmount, 0)
  );
  const newGrandTotal = roundToTwo(
    newSubtotal + doc.extractedTax + doc.extractedShipping - doc.extractedDiscount
  );

  const updatedDoc: Omit<ParsedDocument, 'audit'> = {
    ...doc,
    lineItems: fixedLineItems,
    extractedSubtotal: newSubtotal,
    extractedGrandTotal: newGrandTotal,
  };

  return {
    ...updatedDoc,
    audit: runDocumentAudit(updatedDoc),
  };
}

