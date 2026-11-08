import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

// Intelligent Multi-Model Fallback Cascade
// Automatically shifts down to available models if rate limits (429), quota depletion, 
// deprecation (404), or temporary outages (503) occur.
const MODEL_FALLBACK_CHAIN = [
  'gemini-3.5-flash',       // Primary fast multimodal model
  'gemini-3.8-flash',       // Advanced vision fallback
  'gemini-flash-latest',    // Rolling latest alias
  'gemini-2.5-pro',         // High-capacity reasoning fallback
  'gemini-3.7-flash',       // Mid-tier fallback
  'gemini-3-flash-preview', // Preview tier fallback
  'gemini-2.5-flash-lite',  // Lightweight high-throughput fallback
  'gemini-2.5-flash',       // Legacy fallback
];

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    vendorName: { type: Type.STRING, description: 'The name of the vendor or company issuing the invoice' },
    vendorAddress: { type: Type.STRING, description: 'The address of the vendor', nullable: true },
    invoiceNumber: { type: Type.STRING, description: 'The invoice number or receipt number' },
    invoiceDate: { type: Type.STRING, description: 'The date of the invoice in YYYY-MM-DD format' },
    dueDate: { type: Type.STRING, description: 'The payment due date in YYYY-MM-DD format', nullable: true },
    currency: { type: Type.STRING, description: 'The 3-letter currency code (e.g., USD, EUR, GBP)' },
    currencySymbol: { type: Type.STRING, description: 'The currency symbol (e.g., $, €, £)' },
    lineItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING, description: 'Description of the line item' },
          category: {
            type: Type.STRING,
            description: 'The expense category',
            enum: [
              'Software & SaaS',
              'Utilities',
              'Office Supplies',
              'Travel & Meals',
              'Hardware & Equipment',
              'Professional Services',
              'Other',
            ],
          },
          quantity: { type: Type.NUMBER, description: 'The quantity of items' },
          unitPrice: { type: Type.NUMBER, description: 'The price per unit' },
          extractedAmount: {
            type: Type.NUMBER,
            description: 'The exact line total as printed on the document. Do NOT recalculate this — extract the literal number shown.',
          },
        },
        required: ['description', 'category', 'quantity', 'unitPrice', 'extractedAmount'],
      },
    },
    extractedSubtotal: {
      type: Type.NUMBER,
      description: 'The subtotal as printed on the document. Extract the literal number shown.',
    },
    extractedTax: {
      type: Type.NUMBER,
      description: 'The tax amount as printed on the document. Use 0 if no tax line is visible.',
    },
    extractedDiscount: {
      type: Type.NUMBER,
      description: 'The discount amount as printed on the document. Use 0 if no discount is visible.',
    },
    extractedShipping: {
      type: Type.NUMBER,
      description: 'The shipping/delivery charge as printed on the document. Use 0 if no shipping line is visible.',
    },
    extractedGrandTotal: {
      type: Type.NUMBER,
      description: 'The grand total / total amount due as printed on the document. Extract the literal number shown.',
    },
  },
  required: [
    'vendorName',
    'invoiceNumber',
    'invoiceDate',
    'currency',
    'currencySymbol',
    'lineItems',
    'extractedSubtotal',
    'extractedTax',
    'extractedDiscount',
    'extractedShipping',
    'extractedGrandTotal',
  ],
};

const SYSTEM_PROMPT = `You are a forensic financial document parser and data extractor. Your task is to extract structured data from receipts, invoices, and utility bills with extreme precision.

CRITICAL INSTRUCTIONS:
1. Extract the EXACT numbers printed on the document. Do NOT fix any math errors you find — extract what is literally printed.
2. For line item amounts, extract the printed line total, even if it does not match quantity × unit price. Our auditing engine will catch errors.
3. For subtotals, tax, discounts, shipping, and grand totals — extract the exact values shown on the document.
4. If a field is not visible on the document, use reasonable defaults (0 for monetary amounts, empty string for text).
5. Assign each line item to the most appropriate expense category based on the item description.
6. Dates should be in YYYY-MM-DD format. Convert from any format you see on the document.
7. Identify the currency from the document (symbols, text, or context clues).

You are NOT an auditor — you are a precise data extractor. Leave the math verification to our auditing engine.`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const apiKey =
      request.headers.get('x-gemini-api-key') ||
      process.env.GEMINI_API_KEY ||
      '';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'No Gemini API key provided. Please ensure GEMINI_API_KEY is configured in .env.local.' },
        { status: 401 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');

    // Cascade through fallback models until successful
    let lastError: Error | null = null;
    let succeededModel: string | null = null;
    let parsedData = null;
    const modelAttempts: { model: string; error?: string; success: boolean }[] = [];

    for (const model of MODEL_FALLBACK_CHAIN) {
      try {
        console.log(`[Document Intelligence] Attempting extraction with model: ${model}`);
        
        const response = await ai.models.generateContent({
          model: model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    data: base64String,
                    mimeType: file.type,
                  },
                },
                {
                  text: 'Extract all financial data from this document. Follow the system instructions precisely.',
                },
              ],
            },
          ],
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
          },
        });

        const text = response.text;
        if (!text) {
          throw new Error(`Empty response from model ${model}`);
        }

        parsedData = JSON.parse(text);
        succeededModel = model;
        modelAttempts.push({ model, success: true });
        console.log(`[Document Intelligence] Successfully parsed with model: ${model}`);
        break; // Exit cascade upon success
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.warn(`[Document Intelligence] Model ${model} encountered an issue: ${errorMsg}. Switching to next fallback model...`);
        modelAttempts.push({ model, error: errorMsg, success: false });
        lastError = err instanceof Error ? err : new Error(errorMsg);
      }
    }

    if (!parsedData || !succeededModel) {
      return NextResponse.json(
        {
          error: `All models in the fallback chain were unable to process the document. Last error: ${lastError?.message}`,
          modelAttempts,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      data: parsedData,
      modelUsed: succeededModel,
      fallbackHistory: modelAttempts,
    });
  } catch (error: unknown) {
    console.error('Fatal error processing document:', error);
    const message = error instanceof Error ? error.message : 'Unknown error processing document';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
