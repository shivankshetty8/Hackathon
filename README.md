# Multimodal Smart Document & Invoice Intelligence Hub

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Vision_AI-orange?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

An AI-powered financial document auditor that ingests raw receipts, invoices, and utility bills (images and PDFs), extracts structured line-item data via Gemini Vision, automatically audits the calculations for arithmetic and tax discrepancies, provides an interactive reconciliation workbench, visualizes spending across categories, and exports clean audit data to CSV and multi-sheet XLSX.

---

## 🚀 Live Deployment

The live application is deployed and accessible at:
> **Live URL:** [Visit Live Application](https://github.com/shivankshetty8/Hackathon) *(Set via Repository Homepage & Deployments)*

---

## 🎯 Problem Statement & Forensic Philosophy

Traditional OCR and naive LLM wrappers blindly trust printed numbers or allow generative AI models to hallucinate invoice addition. 

**Invoice Intelligence Hub** solves this through a hybrid architecture:
1. **Multimodal LLMs for Vision Extraction:** Gemini Vision extracts printed numbers with exact fidelity without attempting to fix errors on the document.
2. **Deterministic JavaScript for Financial Auditing:** Every calculation ($Quantity \times Unit Price$, Subtotal sums, Tax rates, Shipping, and Grand Totals) is audited line-by-line using deterministic arithmetic in pure TypeScript.

---

## ⚡ Core Features

### 1. Multimodal Document Parsing & Fallback Cascade
* Ingests **PDF**, **PNG**, **JPG**, and **WEBP** documents.
* Built using the official `@google/genai` SDK with strict `responseSchema` JSON generation.
* **Intelligent Multi-Model Fallback Cascade:**
  ```
  gemini-3.5-flash ➔ gemini-3.8-flash ➔ gemini-flash-latest ➔ gemini-2.5-pro ➔ gemini-3.7-flash ➔ gemini-3-flash-preview ➔ gemini-2.5-flash-lite ➔ gemini-2.5-flash
  ```
  Automatically shifts down to available models if rate limits (429), quota limits, or transient outages occur.

### 2. Deterministic Math & Tax Audit Engine
* **Line-Level Verification:** Computes `quantity × unitPrice` and flags any discrepancies against printed values exceeding $0.01.
* **Subtotal Audit:** Sums all verified line items and compares against printed subtotal (flags differences > $0.02).
* **Tax Sanity Check:** Computes effective tax rate `(tax / subtotal) * 100` and flags warnings if tax rate exceeds 30% or is anomalous.
* **Grand Total Verification:** Validates `calculatedSubtotal + tax + shipping - discount` against the printed total.
* **Audit Badges:**
  * 🟢 **MATCH:** 100% calculation and tax match.
  * 🔴 **DISCREPANCY:** Vendor math mismatch or calculation error detected.
  * 🟠 **WARNING:** Tax rate anomaly or missing document metadata.

### 3. Interactive Split-Pane Reconciliation Workbench
* **Document Viewer:** Zoom (up to 300%), rotate (90° increments), and pan preview.
* **Editable Reconciliation Table:** Edit quantities, prices, descriptions, and categories with real-time recalculation on every keystroke.
* **"Auto-Fix Printed Totals" Button:** One-click snap to correct calculated values.
* **Comparison Summary:** Side-by-side comparison of printed figures versus audited calculations with delta indicators.

### 4. Spending & Tax Analytics
* **Donut Chart:** Breakdown of expenditure across 7 core expense categories (*Software & SaaS, Utilities, Office Supplies, Travel & Meals, Hardware, Professional Services, Other*).
* **Stacked Bar Chart:** Vendor spend comparison showing Subtotal vs. Tax vs. Discrepancy gap.
* **Executive KPI Cards:** Total audited spend, total vendor overcharges caught, and average effective tax rate.

### 5. Multi-Format Export Engine
* **CSV Export:** Flattened line items with document metadata.
* **Multi-Sheet Excel (.xlsx) Workbook:**
  * Sheet 1: *Summary & Audit Status*
  * Sheet 2: *Line Items Breakdown*
  * Sheet 3: *Tax & Discrepancy Log*

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router, React 19)
* **Language:** TypeScript 5
* **Styling:** Tailwind CSS (Dark obsidian `#09090b` with warm orange `#f97316` accents)
* **Typography:** Poppins (UI body) & JetBrains Mono (Financial numerals & tabular figures)
* **Icons:** `lucide-react`
* **Charts:** `recharts`
* **Spreadsheet Export:** `xlsx` (SheetJS)
* **AI Model:** Google Gen AI SDK (`@google/genai`)

---

## 📦 Getting Started Locally

### Prerequisites
* Node.js 18+ installed
* Google Gemini API Key ([Get a free key from Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shivankshetty8/Hackathon.git
   cd Hackathon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚢 Deployment on Vercel

1. Push your repository to GitHub (`https://github.com/shivankshetty8/Hackathon.git`).
2. Go to [Vercel](https://vercel.com/new) and import the repository.
3. Add the environment variable:
   * `GEMINI_API_KEY`: Your Google Gemini API key.
4. Click **Deploy**. Vercel will build and assign your production URL.

---

## 📄 License
MIT License. Built for the Hackathon.
