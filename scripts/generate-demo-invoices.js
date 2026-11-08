const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outDirs = [
  path.join(__dirname, '..', '..', 'demo-invoices'),
  path.join(__dirname, '..', 'public', 'demo-invoices'),
];

outDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper to save PDF to multiple locations
function buildPdf(generatorFn, filename) {
  outDirs.forEach((dir) => {
    const filePath = path.join(dir, filename);
    const stream = fs.createWriteStream(filePath);
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(stream);
    generatorFn(doc);
    doc.end();
  });
}

// 1. CloudScale AWS Hosting Invoice (MATCH - 100% clean math)
buildPdf((doc) => {
  // Brand Header
  doc.rect(40, 40, doc.page.width - 80, 6).fill('#ea580c');

  doc.fontSize(22).font('Helvetica-Bold').fillColor('#0f172a').text('CloudScale AWS Services', 40, 60);
  doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('Premier Cloud Infrastructure & Managed Hosting Solutions', 40, 88);
  doc.text('410 Terry Ave North, Seattle, WA 98109 • billing@cloudscale-aws.io', 40, 102);

  // Meta box
  doc.rect(doc.page.width - 240, 60, 200, 65).fillAndStroke('#f8fafc', '#e2e8f0');
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#ea580c').text('TAX INVOICE', doc.page.width - 225, 72);
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#0f172a').text('Invoice #: ', doc.page.width - 225, 92);
  doc.font('Helvetica').text('INV-CS-2024-0847', doc.page.width - 165, 92);
  doc.font('Helvetica-Bold').text('Date: ', doc.page.width - 225, 106);
  doc.font('Helvetica').text('2024-11-01', doc.page.width - 190, 106);

  // Billed To
  doc.moveDown(3);
  const startY = 145;
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#64748b').text('BILLED TO:', 40, startY);
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('Acme Financial Technologies Inc.', 40, startY + 14);
  doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('100 Montgomery St, Suite 1400, San Francisco, CA 94104', 40, startY + 28);
  doc.text('Attn: DevOps & Infrastructure Accounts Payable', 40, startY + 40);

  doc.fontSize(9).font('Helvetica-Bold').fillColor('#64748b').text('PAYMENT TERMS:', doc.page.width - 240, startY);
  doc.fontSize(9).font('Helvetica').fillColor('#0f172a').text('Due Date: 2024-11-30 (Net 30)', doc.page.width - 240, startY + 14);
  doc.text('Currency: USD ($)', doc.page.width - 240, startY + 28);

  // Table Header
  const tableY = 220;
  doc.rect(40, tableY, doc.page.width - 80, 24).fill('#0f172a');
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
  doc.text('#', 50, tableY + 7);
  doc.text('DESCRIPTION', 75, tableY + 7);
  doc.text('QTY', 340, tableY + 7, { width: 40, align: 'center' });
  doc.text('UNIT PRICE', 400, tableY + 7, { width: 70, align: 'right' });
  doc.text('AMOUNT ($)', 485, tableY + 7, { width: 70, align: 'right' });

  // Rows
  const items = [
    { num: '1', desc: 'EC2 Instance (m5.xlarge) - Monthly', qty: 1, rate: 245.00, amount: 245.00 },
    { num: '2', desc: 'S3 Storage - 500GB Standard', qty: 1, rate: 23.00, amount: 23.00 },
    { num: '3', desc: 'CloudFront CDN - 1TB Outbound Transfer', qty: 1, rate: 85.00, amount: 85.00 },
    { num: '4', desc: 'RDS PostgreSQL (db.r5.large) Multi-AZ', qty: 1, rate: 192.50, amount: 192.50 },
    { num: '5', desc: 'Route 53 DNS Queries (1M Hosted)', qty: 1, rate: 0.50, amount: 0.50 },
    { num: '6', desc: 'AWS Support Plan - Business Tier', qty: 1, rate: 100.00, amount: 100.00 },
  ];

  let currentY = tableY + 24;
  items.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.rect(40, currentY, doc.page.width - 80, 24).fill('#f8fafc');
    }
    doc.fontSize(9).font('Helvetica').fillColor('#0f172a');
    doc.text(item.num, 50, currentY + 7);
    doc.text(item.desc, 75, currentY + 7);
    doc.text(item.qty.toString(), 340, currentY + 7, { width: 40, align: 'center' });
    doc.text(`$${item.rate.toFixed(2)}`, 400, currentY + 7, { width: 70, align: 'right' });
    doc.font('Helvetica-Bold').text(`$${item.amount.toFixed(2)}`, 485, currentY + 7, { width: 70, align: 'right' });
    currentY += 24;
  });

  // Totals Box
  const totalsY = currentY + 20;
  doc.rect(340, totalsY, doc.page.width - 380, 110).fillAndStroke('#f8fafc', '#e2e8f0');

  doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Subtotal:', 355, totalsY + 12);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$646.00', 485, totalsY + 12, { width: 70, align: 'right' });

  doc.font('Helvetica').fillColor('#64748b').text('Estimated Tax (9.0%):', 355, totalsY + 30);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$58.14', 485, totalsY + 30, { width: 70, align: 'right' });

  doc.font('Helvetica').fillColor('#64748b').text('Discount:', 355, totalsY + 48);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$0.00', 485, totalsY + 48, { width: 70, align: 'right' });

  doc.font('Helvetica').fillColor('#64748b').text('Shipping & Delivery:', 355, totalsY + 66);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$0.00', 485, totalsY + 66, { width: 70, align: 'right' });

  doc.rect(355, totalsY + 84, doc.page.width - 410, 1).fill('#cbd5e1');

  doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('Total Due (USD):', 355, totalsY + 92);
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#ea580c').text('$704.14', 485, totalsY + 92, { width: 70, align: 'right' });

  // Footer
  doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text('All calculations verified. Thank you for choosing CloudScale AWS Services.', 40, doc.page.height - 50, { align: 'center' });
}, 'CloudScale_AWS_Hosting_Invoice.pdf');

// 2. Apex Office Supplies Receipt (DISCREPANCY - Deliberate line-item multiplication error & overcharge)
buildPdf((doc) => {
  // Receipt Style Header
  doc.rect(40, 40, doc.page.width - 80, 6).fill('#dc2626');

  doc.fontSize(20).font('Helvetica-Bold').fillColor('#0f172a').text('Apex Office Supplies & Equipment', 40, 60);
  doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('Store #402 • Downtown Commerce Blvd, Suite 200, Chicago, IL 60601', 40, 88);
  doc.text('Phone: (312) 555-0199 • Tax ID: 36-9921844', 40, 102);

  // Meta box
  doc.rect(doc.page.width - 240, 60, 200, 65).fillAndStroke('#fef2f2', '#fecaca');
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#dc2626').text('STORE RECEIPT', doc.page.width - 225, 72);
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#0f172a').text('Receipt #: ', doc.page.width - 225, 92);
  doc.font('Helvetica').text('REC-APX-88921', doc.page.width - 165, 92);
  doc.font('Helvetica-Bold').text('Date: ', doc.page.width - 225, 106);
  doc.font('Helvetica').text('2024-10-15', doc.page.width - 190, 106);

  // Customer
  const startY = 145;
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#64748b').text('CUSTOMER ACCOUNT:', 40, startY);
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('Apex Corporate Business Account', 40, startY + 14);
  doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Purchased by: Admin Operations Dept.', 40, startY + 28);

  doc.fontSize(9).font('Helvetica-Bold').fillColor('#64748b').text('PAYMENT METHOD:', doc.page.width - 240, startY);
  doc.fontSize(9).font('Helvetica').fillColor('#0f172a').text('Corporate Card (Net 30)', doc.page.width - 240, startY + 14);
  doc.text('Due Date: 2024-11-14', doc.page.width - 240, startY + 28);

  // Table
  const tableY = 205;
  doc.rect(40, tableY, doc.page.width - 80, 24).fill('#0f172a');
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
  doc.text('#', 50, tableY + 7);
  doc.text('DESCRIPTION', 75, tableY + 7);
  doc.text('QTY', 340, tableY + 7, { width: 40, align: 'center' });
  doc.text('UNIT PRICE', 400, tableY + 7, { width: 70, align: 'right' });
  doc.text('LINE TOTAL', 485, tableY + 7, { width: 70, align: 'right' });

  // Line Items with the deliberate error on Line 2!
  // Qty 4 * Unit Price $12.50 = $50.00, BUT PRINTED AS $60.00!
  const items = [
    { num: '1', desc: 'Premium A4 Copy Paper (5-ream case)', qty: 3, rate: 24.99, amount: 74.97, isErr: false },
    { num: '2', desc: 'Ergonomic Gel Pens (12-pack)', qty: 4, rate: 12.50, amount: 60.00, isErr: true }, // ERROR
    { num: '3', desc: 'Heavy-Duty 3-Hole Punch', qty: 1, rate: 34.95, amount: 34.95, isErr: false },
    { num: '4', desc: 'Wireless Laser Presenter', qty: 2, rate: 29.99, amount: 59.98, isErr: false },
    { num: '5', desc: 'USB-C Hub Docking Station', qty: 1, rate: 89.99, amount: 89.99, isErr: false },
  ];

  let currentY = tableY + 24;
  items.forEach((item, idx) => {
    if (item.isErr) {
      doc.rect(40, currentY, doc.page.width - 80, 24).fill('#fee2e2');
    } else if (idx % 2 === 0) {
      doc.rect(40, currentY, doc.page.width - 80, 24).fill('#f8fafc');
    }
    doc.fontSize(9).font('Helvetica').fillColor('#0f172a');
    doc.text(item.num, 50, currentY + 7);
    doc.text(item.desc, 75, currentY + 7);
    doc.text(item.qty.toString(), 340, currentY + 7, { width: 40, align: 'center' });
    doc.text(`$${item.rate.toFixed(2)}`, 400, currentY + 7, { width: 70, align: 'right' });
    doc.font('Helvetica-Bold').fillColor(item.isErr ? '#dc2626' : '#0f172a').text(`$${item.amount.toFixed(2)}`, 485, currentY + 7, { width: 70, align: 'right' });
    currentY += 24;
  });

  // Totals Box reflecting the $10.00 overcharge
  const totalsY = currentY + 20;
  doc.rect(340, totalsY, doc.page.width - 380, 115).fillAndStroke('#fff1f2', '#fecdd3');

  doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Printed Subtotal:', 355, totalsY + 12);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$319.89', 485, totalsY + 12, { width: 70, align: 'right' });

  doc.font('Helvetica').fillColor('#64748b').text('Sales Tax (8.0%):', 355, totalsY + 30);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$25.59', 485, totalsY + 30, { width: 70, align: 'right' });

  doc.font('Helvetica').fillColor('#64748b').text('Discount:', 355, totalsY + 48);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$15.00', 485, totalsY + 48, { width: 70, align: 'right' });

  doc.font('Helvetica').fillColor('#64748b').text('Shipping:', 355, totalsY + 66);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$9.99', 485, totalsY + 66, { width: 70, align: 'right' });

  doc.rect(355, totalsY + 84, doc.page.width - 410, 1).fill('#cbd5e1');

  doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('Total Charged:', 355, totalsY + 94);
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#dc2626').text('$340.47', 485, totalsY + 94, { width: 70, align: 'right' });

  doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text('Notice: Audit discrepancy flag - 4 pens @ $12.50 = $50.00, printed as $60.00 ($10.00 overcharge).', 40, doc.page.height - 50, { align: 'center' });
}, 'Apex_Office_Supplies_Receipt.pdf');

// 3. Metro City Power & Electric Bill (WARNING - Anomalous 34% tax calculation)
buildPdf((doc) => {
  // Utility Style Header
  doc.rect(40, 40, doc.page.width - 80, 6).fill('#f59e0b');

  doc.fontSize(20).font('Helvetica-Bold').fillColor('#0f172a').text('Metro City Power & Electric', 40, 60);
  doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('1200 Municipal Drive, Metro City, NY 10001 • 1-800-555-METRO', 40, 88);
  doc.text('Regulated Utility Provider • Public Service Commission Account', 40, 102);

  // Meta box
  doc.rect(doc.page.width - 240, 60, 200, 65).fillAndStroke('#fffbeb', '#fde68a');
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#d97706').text('UTILITY BILL', doc.page.width - 225, 72);
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#0f172a').text('Bill #: ', doc.page.width - 225, 92);
  doc.font('Helvetica').text('UTIL-MC-2024-09-4412', doc.page.width - 190, 92);
  doc.font('Helvetica-Bold').text('Date: ', doc.page.width - 225, 106);
  doc.font('Helvetica').text('2024-09-28', doc.page.width - 190, 106);

  // Service Address
  const startY = 145;
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#64748b').text('SERVICE LOCATION:', 40, startY);
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('Commercial Facilities Division - Suite 400', 40, startY + 14);
  doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('850 Hudson Square, New York, NY 10013', 40, startY + 28);

  doc.fontSize(9).font('Helvetica-Bold').fillColor('#64748b').text('BILLING PERIOD:', doc.page.width - 240, startY);
  doc.fontSize(9).font('Helvetica').fillColor('#0f172a').text('Aug 27 – Sep 26, 2024', doc.page.width - 240, startY + 14);
  doc.text('Due Date: 2024-10-28', doc.page.width - 240, startY + 28);

  // Table
  const tableY = 205;
  doc.rect(40, tableY, doc.page.width - 80, 24).fill('#0f172a');
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
  doc.text('#', 50, tableY + 7);
  doc.text('UTILITY SERVICE DESCRIPTION', 75, tableY + 7);
  doc.text('QTY', 340, tableY + 7, { width: 40, align: 'center' });
  doc.text('RATE', 400, tableY + 7, { width: 70, align: 'right' });
  doc.text('AMOUNT ($)', 485, tableY + 7, { width: 70, align: 'right' });

  const items = [
    { num: '1', desc: 'Electricity Usage - 1,247 kWh', qty: 1, rate: 148.30, amount: 148.30 },
    { num: '2', desc: 'Natural Gas Supply - 42 therms', qty: 1, rate: 58.80, amount: 58.80 },
    { num: '3', desc: 'Water & Sewer Municipal Drainage', qty: 1, rate: 67.25, amount: 67.25 },
    { num: '4', desc: 'Environmental Compliance Surcharge', qty: 1, rate: 12.50, amount: 12.50 },
  ];

  let currentY = tableY + 24;
  items.forEach((item, idx) => {
    if (idx % 2 === 0) {
      doc.rect(40, currentY, doc.page.width - 80, 24).fill('#f8fafc');
    }
    doc.fontSize(9).font('Helvetica').fillColor('#0f172a');
    doc.text(item.num, 50, currentY + 7);
    doc.text(item.desc, 75, currentY + 7);
    doc.text(item.qty.toString(), 340, currentY + 7, { width: 40, align: 'center' });
    doc.text(`$${item.rate.toFixed(2)}`, 400, currentY + 7, { width: 70, align: 'right' });
    doc.font('Helvetica-Bold').text(`$${item.amount.toFixed(2)}`, 485, currentY + 7, { width: 70, align: 'right' });
    currentY += 24;
  });

  // Totals Box with anomalous 34% tax rate ($97.53 on $286.85)
  const totalsY = currentY + 20;
  doc.rect(340, totalsY, doc.page.width - 380, 115).fillAndStroke('#fffbeb', '#fde68a');

  doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Base Usage Subtotal:', 355, totalsY + 12);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$286.85', 485, totalsY + 12, { width: 70, align: 'right' });

  doc.font('Helvetica').fillColor('#b45309').text('Regulatory & Muni Tax (34.0%):', 355, totalsY + 30);
  doc.font('Helvetica-Bold').fillColor('#b45309').text('$97.53', 485, totalsY + 30, { width: 70, align: 'right' });

  doc.font('Helvetica').fillColor('#64748b').text('Discount:', 355, totalsY + 48);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$0.00', 485, totalsY + 48, { width: 70, align: 'right' });

  doc.font('Helvetica').fillColor('#64748b').text('Service Delivery Charge:', 355, totalsY + 66);
  doc.font('Helvetica-Bold').fillColor('#0f172a').text('$0.00', 485, totalsY + 66, { width: 70, align: 'right' });

  doc.rect(355, totalsY + 84, doc.page.width - 410, 1).fill('#cbd5e1');

  doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('Total Amount Due:', 355, totalsY + 94);
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#d97706').text('$384.38', 485, totalsY + 94, { width: 70, align: 'right' });

  doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text('Audit Warning: Effective tax rate of 34.0% exceeds normal threshold (> 30%).', 40, doc.page.height - 50, { align: 'center' });
}, 'Metro_Power_Electric_Bill.pdf');

console.log('PDF Invoices generated successfully in demo-invoices and public/demo-invoices.');

