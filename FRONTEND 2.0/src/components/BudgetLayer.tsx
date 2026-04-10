import React, { useMemo } from "react";
import { 
  PieChart as LucidePieChart, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2,
  BarChart3,
  Calculator
} from "lucide-react";
import { cn } from "../lib/utils";
import { BudgetRecord, BudgetCategory } from "../types";

const MOCK_BUDGET_DATA: BudgetRecord[] = [
  { category: "Marketing", planned: 5000, actual: 5200, history: [4200, 4800, 5200] },
  { category: "Sales", planned: 3000, actual: 2800, history: [2500, 2700, 2800] },
  { category: "R&D", planned: 8000, actual: 7500, history: [6800, 7200, 7500] },
  { category: "G&A", planned: 2000, actual: 2100, history: [1900, 2000, 2100] },
  { category: "Support", planned: 1500, actual: 1400, history: [1200, 1350, 1400] },
];

function forecast(history: number[], monthsAhead: number): number {
  const n = history.length;
  if (n < 2) return history[n - 1] || 0;

  const x = Array.from({ length: n }, (_, i) => i);
  const y = history;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  return m * (n - 1 + monthsAhead) + b;
}

export function BudgetLayer() {
  const budgetSummary = useMemo(() => {
    return MOCK_BUDGET_DATA.map(item => {
      const variance = item.actual - item.planned;
      const status = variance > 0 ? "Over Budget" : "Under Budget";
      const forecasts = [1, 2, 3].map(m => forecast(item.history, m));
      
      return {
        ...item,
        variance,
        status,
        forecasts,
        forecastTotal: forecasts.reduce((a, b) => a + b, 0)
      };
    });
  }, []);

  const totalPlanned = budgetSummary.reduce((a, b) => a + b.planned, 0);
  const totalActual = budgetSummary.reduce((a, b) => a + b.actual, 0);
  const totalVariance = totalActual - totalPlanned;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Budgeting System</h2>
        <p className="text-neutral-500 mt-1">Plan your resources. Forge your financial strategy with AI forecasting.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-neutral-500">Total Planned</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900">${totalPlanned.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Calculator className="w-5 h-5 text-rose-600" />
            </div>
            <span className="text-sm font-medium text-neutral-500">Total Actual</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900">${totalActual.toLocaleString()}</div>
        </div>

        <div className={cn(
          "p-6 rounded-2xl shadow-xl text-white",
          totalVariance > 0 ? "bg-rose-600" : "bg-emerald-600"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              {totalVariance > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <span className="text-sm font-medium opacity-80">Total Variance</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${Math.abs(totalVariance).toLocaleString()}</span>
            <span className="text-xs font-bold uppercase tracking-widest">
              {totalVariance > 0 ? "Over" : "Under"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Planned vs Actual Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Current Month Performance</h3>
            <span className="text-xs font-bold text-neutral-400">April 2026</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Planned</th>
                  <th className="px-6 py-3">Actual</th>
                  <th className="px-6 py-3">Variance</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {budgetSummary.map((item, i) => (
                  <tr key={i} className="hover:bg-neutral-50 transition-all">
                    <td className="px-6 py-4 text-sm font-bold text-neutral-900">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">${item.planned.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-neutral-900 font-medium">${item.actual.toLocaleString()}</td>
                    <td className={cn(
                      "px-6 py-4 text-sm font-bold",
                      item.variance > 0 ? "text-rose-600" : "text-emerald-600"
                    )}>
                      {item.variance > 0 ? "+" : "-"}${Math.abs(item.variance).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        item.variance > 0 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      )}>
                        {item.variance > 0 ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {item.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forecast Section */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <LucidePieChart className="w-4 h-4 text-indigo-500" />
              3-Month Forecast
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {budgetSummary.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-700">{item.category}</span>
                    <span className="text-xs font-bold text-neutral-900">${item.forecastTotal.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                    {item.forecasts.map((val, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "h-full border-r border-white/20",
                          idx === 0 ? "bg-indigo-400" : idx === 1 ? "bg-indigo-500" : "bg-indigo-600"
                        )}
                        style={{ width: `${(val / item.forecastTotal) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-neutral-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Total Forecast</span>
                <span className="text-lg font-bold text-neutral-900">
                  ${budgetSummary.reduce((a, b) => a + b.forecastTotal, 0).toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed italic">
                * Forecasts are generated using linear regression based on the last 3 months of actual spending data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Forecast Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">May 2026</th>
                <th className="px-6 py-3">June 2026</th>
                <th className="px-6 py-3">July 2026</th>
                <th className="px-6 py-3 text-right">Total Forecast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {budgetSummary.map((item, i) => (
                <tr key={i} className="hover:bg-neutral-50 transition-all">
                  <td className="px-6 py-4 text-sm font-bold text-neutral-900">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">${item.forecasts[0].toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">${item.forecasts[1].toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">${item.forecasts[2].toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-neutral-900 text-right">${item.forecastTotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
