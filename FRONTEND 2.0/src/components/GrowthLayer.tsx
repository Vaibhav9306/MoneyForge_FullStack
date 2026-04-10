import React, { useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  UserPlus, 
  DollarSign, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Activity
} from "lucide-react";
import { cn } from "../lib/utils";
import { SaaSMetric } from "../types";

const MOCK_SAAS_DATA: SaaSMetric[] = [
  { month: "Oct", mrr: 12000, totalCustomers: 400, newCustomers: 45, smSpend: 3000, churnedCustomers: 8 },
  { month: "Nov", mrr: 14500, totalCustomers: 437, newCustomers: 52, smSpend: 3500, churnedCustomers: 15 },
  { month: "Dec", mrr: 18000, totalCustomers: 474, newCustomers: 60, smSpend: 4200, churnedCustomers: 23 },
  { month: "Jan", mrr: 22000, totalCustomers: 511, newCustomers: 65, smSpend: 4800, churnedCustomers: 28 },
  { month: "Feb", mrr: 28000, totalCustomers: 548, newCustomers: 75, smSpend: 5500, churnedCustomers: 38 },
  { month: "Mar", mrr: 35000, totalCustomers: 585, newCustomers: 85, smSpend: 6200, churnedCustomers: 48 },
];

export function GrowthLayer() {
  const latest = MOCK_SAAS_DATA[MOCK_SAAS_DATA.length - 1];
  
  const metrics = useMemo(() => {
    const cac = latest.smSpend / latest.newCustomers;
    const arpu = latest.mrr / latest.totalCustomers;
    const churnRate = (latest.churnedCustomers / latest.totalCustomers) * 100;
    const ltv = arpu / (churnRate / 100);
    const ltvCac = ltv / cac;

    return {
      cac,
      arpu,
      churnRate,
      ltv,
      ltvCac
    };
  }, [latest]);

  const churnData = MOCK_SAAS_DATA.map(d => ({
    month: d.month,
    churnRate: ((d.churnedCustomers / d.totalCustomers) * 100).toFixed(1)
  }));

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Growth Layer</h2>
        <p className="text-neutral-500 mt-1">Scale your SaaS. Forge your growth engine with real-time metrics.</p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">CAC</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-neutral-900">${metrics.cac.toFixed(0)}</span>
            <span className="text-[10px] text-neutral-400 font-medium">/ customer</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">ARPU</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-neutral-900">${metrics.arpu.toFixed(0)}</span>
            <span className="text-[10px] text-neutral-400 font-medium">/ mo</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Activity className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">LTV</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-neutral-900">${metrics.ltv.toFixed(0)}</span>
          </div>
        </div>

        <div className="bg-neutral-900 p-5 rounded-2xl text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-neutral-800 rounded-lg">
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">LTV / CAC</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">{metrics.ltvCac.toFixed(1)}x</span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Excellent</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Percent className="w-4 h-4 text-rose-600" />
            </div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Churn Rate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-neutral-900">{metrics.churnRate.toFixed(1)}%</span>
            <span className="text-[10px] font-bold text-rose-500 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> High
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MRR & Customers Chart */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Revenue & Scale</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">MRR</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Customers</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_SAAS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a3a3a3'}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a3a3a3'}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a3a3a3'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="mrr" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="totalCustomers" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn Rate Chart */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Monthly Churn %</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={churnData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a3a3a3'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a3a3a3'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="churnRate" radius={[6, 6, 0, 0]}>
                  {churnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Number(entry.churnRate) > 5 ? '#ef4444' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Growth History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                <th className="px-6 py-3">Month</th>
                <th className="px-6 py-3">MRR</th>
                <th className="px-6 py-3">New Customers</th>
                <th className="px-6 py-3">S&M Spend</th>
                <th className="px-6 py-3">Churned</th>
                <th className="px-6 py-3 text-right">Scale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {MOCK_SAAS_DATA.map((d, i) => (
                <tr key={i} className="hover:bg-neutral-50 transition-all">
                  <td className="px-6 py-4 text-sm font-bold text-neutral-900">{d.month}</td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-600">${d.mrr.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">+{d.newCustomers}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">${d.smSpend.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-rose-500 font-medium">{d.churnedCustomers}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600" 
                          style={{ width: `${(d.mrr / latest.mrr) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )).reverse()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
