'use client';

import React, { useMemo } from 'react';
import { ParsedDocument, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types/invoice';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  AlertTriangle,
  Percent,
  FileCheck,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpendingAnalyticsProps {
  documents: ParsedDocument[];
}

// Sophisticated Cream, Orange & Black Palette
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Software & SaaS': '#ea580c',        // Bold Orange
  'Utilities': '#f97316',              // Warm Orange
  'Office Supplies': '#0a0a0a',        // Solid Black
  'Travel & Meals': '#78716c',         // Stone
  'Hardware & Equipment': '#fb923c',   // Soft Orange
  'Professional Services': '#d97706',  // Amber
  'Other': '#27272a',                  // Deep Charcoal
};

const PIE_COLORS = Object.values(CATEGORY_COLORS);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      percentage: number;
    };
  }>;
}

function PieTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0];
  return (
    <div className="bg-white border border-[#EAE4D8] rounded-xl px-3.5 py-2.5 shadow-xl font-sans">
      <p className="text-xs font-bold text-black">{data.payload.name}</p>
      <p className="text-xs text-orange-600 font-mono font-bold tabular-nums mt-0.5">
        ${data.payload.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p className="text-[10px] text-stone-500 font-mono">
        {data.payload.percentage.toFixed(1)}% of total spend
      </p>
    </div>
  );
}

interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

function BarTooltipContent({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-[#EAE4D8] rounded-xl px-3.5 py-2.5 shadow-xl font-sans">
      <p className="text-xs font-bold text-black mb-1.5">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-xs font-mono tabular-nums font-semibold" style={{ color: entry.color }}>
          {entry.name}: ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  );
}

export default function SpendingAnalytics({ documents }: SpendingAnalyticsProps) {
  const analytics = useMemo(() => {
    const totalAuditedSpend = documents.reduce(
      (sum, doc) => sum + doc.audit.calculatedGrandTotal,
      0
    );

    const totalDiscrepancyAmount = documents.reduce((sum, doc) => {
      return sum + Math.abs(doc.audit.grandTotalDiscrepancy);
    }, 0);

    const flaggedInvoices = documents.filter(
      (doc) => doc.audit.status === 'DISCREPANCY'
    ).length;

    const avgTaxRate =
      documents.length > 0
        ? documents.reduce((sum, doc) => sum + doc.audit.effectiveTaxRate, 0) /
          documents.length
        : 0;

    const matchCount = documents.filter((d) => d.audit.status === 'MATCH').length;
    const discrepancyCount = documents.filter((d) => d.audit.status === 'DISCREPANCY').length;
    const warningCount = documents.filter((d) => d.audit.status === 'WARNING').length;

    // Category breakdown
    const categoryMap = new Map<string, number>();
    EXPENSE_CATEGORIES.forEach((cat) => categoryMap.set(cat, 0));

    documents.forEach((doc) => {
      doc.lineItems.forEach((item) => {
        const current = categoryMap.get(item.category) || 0;
        categoryMap.set(item.category, current + item.calculatedAmount);
      });
    });

    const totalCategorySpend = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);

    const categoryData = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100,
        percentage: totalCategorySpend > 0 ? (value / totalCategorySpend) * 100 : 0,
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);

    // Vendor comparison data
    const vendorData = documents.map((doc) => ({
      name: doc.vendorName.length > 18 ? doc.vendorName.substring(0, 16) + '…' : doc.vendorName,
      fullName: doc.vendorName,
      subtotal: doc.audit.calculatedSubtotal,
      tax: doc.extractedTax,
      discrepancy: Math.abs(doc.audit.grandTotalDiscrepancy),
    }));

    return {
      totalAuditedSpend,
      totalDiscrepancyAmount,
      flaggedInvoices,
      avgTaxRate,
      matchCount,
      discrepancyCount,
      warningCount,
      categoryData,
      vendorData,
    };
  }, [documents]);

  if (documents.length === 0) {
    return (
      <div className="bg-white border border-[#EAE4D8] rounded-2xl p-12 text-center shadow-sm">
        <TrendingUp className="w-10 h-10 text-stone-400 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-black mb-1">No Audited Data Yet</h3>
        <p className="text-xs text-stone-600">
          Upload or drop documents into the sidebar to visualize financial breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KPICard
          icon={DollarSign}
          label="Total Audited Spend"
          value={`$${analytics.totalAuditedSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          color="black"
        />
        <KPICard
          icon={AlertTriangle}
          label="Discrepancies Caught"
          value={`$${analytics.totalDiscrepancyAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`${analytics.flaggedInvoices} flagged document${analytics.flaggedInvoices !== 1 ? 's' : ''}`}
          color="orange"
        />
        <KPICard
          icon={Percent}
          label="Avg. Effective Tax"
          value={`${analytics.avgTaxRate.toFixed(1)}%`}
          subtitle="Tax sanity benchmark"
          color="black"
        />
        <KPICard
          icon={FileCheck}
          label="Reconciled Documents"
          value={documents.length.toString()}
          subtitle={
            <span className="flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> {analytics.matchCount}
              </span>
              <span className="flex items-center gap-1 text-rose-700 font-bold">
                <ShieldAlert className="w-3 h-3 text-rose-600" /> {analytics.discrepancyCount}
              </span>
              <span className="flex items-center gap-1 text-orange-700 font-bold">
                <ShieldQuestion className="w-3 h-3 text-orange-600" /> {analytics.warningCount}
              </span>
            </span>
          }
          color="black"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Donut Chart - Category Breakdown */}
        <div className="bg-white border border-[#EAE4D8] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              Spending by Category
            </h3>
            <span className="text-[10px] text-stone-600 font-mono font-medium">
              {analytics.categoryData.length} active categories
            </span>
          </div>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={108}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {analytics.categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[entry.name as ExpenseCategory] || PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Clean Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#EAE4D8]">
            {analytics.categoryData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[entry.name as ExpenseCategory] || '#0a0a0a' }}
                />
                <span className="text-black font-medium truncate text-[11px]">{entry.name}</span>
                <span className="text-stone-700 font-mono text-[11px] font-bold ml-auto tabular-nums">
                  {entry.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked Bar Chart - Vendor Spend & Tax Comparison */}
        <div className="bg-white border border-[#EAE4D8] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              Vendor Spend &amp; Tax Comparison
            </h3>
            <span className="text-[10px] text-stone-600 font-mono font-medium">
              Subtotal vs. Tax vs. Variance
            </span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analytics.vendorData} barCategoryGap="24%">
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE4D8" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#0a0a0a', fontSize: 10, fontFamily: 'var(--font-poppins)', fontWeight: 500 }}
                axisLine={{ stroke: '#DDD2BD' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#0a0a0a', fontSize: 10, fontFamily: 'var(--font-poppins)', fontWeight: 500 }}
                axisLine={{ stroke: '#DDD2BD' }}
                tickLine={false}
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip content={<BarTooltipContent />} cursor={{ fill: 'rgba(234, 88, 12, 0.05)' }} />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#0a0a0a', paddingTop: '10px', fontWeight: 600 }}
              />
              <Bar dataKey="subtotal" name="Subtotal" fill="#0a0a0a" stackId="spend" radius={[0, 0, 0, 0]} />
              <Bar dataKey="tax" name="Tax" fill="#ea580c" stackId="spend" radius={[0, 0, 0, 0]} />
              <Bar dataKey="discrepancy" name="Variance Gap" fill="#e11d48" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: React.ReactNode;
  color: 'black' | 'orange';
}

function KPICard({ icon: Icon, label, value, subtitle, color }: KPICardProps) {
  return (
    <div className="rounded-2xl border border-[#EAE4D8] bg-white p-4 shadow-sm transition-all hover:border-orange-300">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'p-2.5 rounded-xl border flex items-center justify-center',
            color === 'orange'
              ? 'bg-orange-50 border-orange-200 text-orange-600'
              : 'bg-stone-100 border-stone-200 text-black'
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-stone-600 uppercase font-bold tracking-wider">{label}</p>
          <p
            className={cn(
              'text-lg font-bold font-mono tabular-nums tracking-tight',
              color === 'orange' ? 'text-orange-600' : 'text-black'
            )}
          >
            {value}
          </p>
          {subtitle && (
            <div className="text-[11px] text-stone-600 mt-0.5 truncate font-medium">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
