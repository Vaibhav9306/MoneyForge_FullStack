import React, { useState, useMemo, useEffect } from "react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  Trash2, 
  Edit2, 
  X,
  Search,
  Filter,
  Zap,
  Clock,
  AlertTriangle,
  Link as LinkIcon,
  FileText,
  CreditCard,
  Repeat,
  ArrowRightLeft,
  Undo2,
  Banknote,
  Users,
  BarChart3,
  Copy,
  Check,
  MoreVertical,
  ChevronRight,
  Sparkles,
  QrCode,
  Smartphone,
  Building2,
  Wallet as WalletIcon
} from "lucide-react";
import { cn } from "../lib/utils";
import { FinanceRecord, TransactionCategory, PaymentLink, Invoice, SubscriptionPlan, Payout } from "../types";
import { useIdea } from "../context/IdeaContext";
import api from "../services/api";

const INITIAL_TRANSACTIONS: FinanceRecord[] = [
  { id: "1", date: "2026-04-01", amount: 12000, category: "sales", type: "income", description: "Client Project A", status: "completed" },
  { id: "2", date: "2026-04-02", amount: 2500, category: "tools", type: "expense", description: "SaaS Subscriptions", status: "completed" },
  { id: "3", date: "2026-04-05", amount: 8000, category: "marketing", type: "expense", description: "Meta Ads", status: "completed" },
  { id: "4", date: "2026-04-07", amount: 15000, category: "sales", type: "income", description: "Product Sales", status: "completed" },
  { id: "5", date: "2026-04-08", amount: 5000, category: "salary", type: "expense", description: "Freelance Designer", status: "completed" },
];

const INITIAL_LINKS: PaymentLink[] = [
  { id: "pl_1", amount: 5000, description: "Consulting Session", purpose: "Service", url: "https://forge.pay/l/consulting-1", createdAt: "2026-04-01", status: "active" },
];

const INITIAL_INVOICES: Invoice[] = [
  { id: "INV-001", customerName: "Acme Corp", customerEmail: "billing@acme.com", amount: 25000, dueDate: "2026-04-15", status: "pending", items: [{ description: "Platform Setup", quantity: 1, price: 25000 }], createdAt: "2026-04-01" },
];

const INITIAL_PLANS: SubscriptionPlan[] = [
  { id: "plan_pro", name: "Pro Plan", price: 4999, interval: "monthly", activeSubscribers: 12, createdAt: "2026-03-15" },
];

const INITIAL_PAYOUTS: Payout[] = [
  { id: "po_1", amount: 45000, status: "settled", bankAccount: "**** 4567", createdAt: "2026-04-05" },
];

export function FinanceLayer() {
  const { activeIdea } = useIdea();
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "billing" | "analytics">("overview");
  const [transactions, setTransactions] = useState<FinanceRecord[]>(INITIAL_TRANSACTIONS);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(INITIAL_LINKS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);
  const [payouts, setPayouts] = useState<Payout[]>(INITIAL_PAYOUTS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrModalData, setQrModalData] = useState<PaymentLink | null>(null);
  const [paymentModalData, setPaymentModalData] = useState<{ amount: number; description: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Omit<FinanceRecord, "id">>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    category: "other",
    type: "expense",
    description: ""
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get("/api/finance");
        // backend records: amount, category, type, note, date (Date obj string)
        const mappedTx = data.transactions.map((tx: any) => ({
          id: tx._id,
          date: new Date(tx.date).toISOString().split("T")[0],
          amount: tx.amount,
          category: tx.category,
          type: tx.type,
          description: tx.note,
          status: "completed"
        }));
        setTransactions(mappedTx);
      } catch (err) {
        console.error("Failed to fetch finance records:", err);
      }
    };
    fetchTransactions();
  }, []);

  // Calculations
  const totals = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === "income") acc.revenue += curr.amount;
      else acc.expenses += curr.amount;
      return acc;
    }, { revenue: 0, expenses: 0 });
  }, [transactions]);

  const netProfit = totals.revenue - totals.expenses;
  
  // Runway Calculations
  const startingBalance = 500000; // Initial capital
  const currentBalance = startingBalance + netProfit;
  const monthlyBurnRate = totals.expenses; // Simplified burn rate for demo
  const runwayMonths = monthlyBurnRate > 0 ? currentBalance / monthlyBurnRate : Infinity;
  const isRunwayCritical = runwayMonths < 6;

  // Chart Data Generation
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    // For demo, we'll map current transactions to "Apr" and use static for others
    // In a real app, this would be grouped by month from the date field
    return months.map(month => {
      if (month === "Apr") {
        return { name: month, income: totals.revenue, expense: totals.expenses };
      }
      // Static placeholders for other months
      return { name: month, income: Math.random() * 5000 + 2000, expense: Math.random() * 3000 + 1000 };
    });
  }, [totals]);

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Backend doesn't support PATCH natively in finance, so we fallback to local update if unable, or delete and recreate
        // Since rules say "do not break working code", if it's editing, we'll try to delete old and create new
        await api.delete(`/api/finance/${editingId}`);
        const payload = {
          amount: formData.amount,
          category: formData.category,
          type: formData.type,
          note: formData.description,
          date: formData.date
        };
        const { data } = await api.post("/api/finance", payload);
        const newRecord = { ...formData, id: data.transaction._id, description: data.transaction.note };
        setTransactions(prev => prev.map(t => t.id === editingId ? newRecord : t));
      } else {
        const payload = {
          amount: formData.amount,
          category: formData.category,
          type: formData.type,
          note: formData.description,
          date: formData.date
        };
        const { data } = await api.post("/api/finance", payload);
        const newRecord = { ...formData, id: data.transaction._id, description: data.transaction.note };
        setTransactions(prev => [newRecord, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error("Finance API Error:", err);
    }
  };

  const openModal = (transaction?: FinanceRecord) => {
    if (transaction) {
      setEditingId(transaction.id);
      setFormData({
        date: transaction.date,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        description: transaction.description
      });
    } else {
      setEditingId(null);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        category: "other",
        type: "expense",
        description: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/api/finance/${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  const handleRefund = (id: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id && t.type === "income" && t.status !== "refunded") {
        return { ...t, status: "refunded" as const };
      }
      return t;
    }));
  };

  const handleSimulatePayment = (amount: number, description: string) => {
    setPaymentModalData({ amount, description });
  };

  const completePayment = (method: string) => {
    if (!paymentModalData) return;
    
    const newTransaction: FinanceRecord = {
      id: `sim_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split("T")[0],
      amount: paymentModalData.amount,
      category: "sales",
      type: "income",
      description: `Payment via ${method}: ${paymentModalData.description}`,
      status: "completed"
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setPaymentModalData(null);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "transactions", label: "Transactions", icon: ArrowRightLeft },
    { id: "billing", label: "Payments & Billing", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: PieChart },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Finance Layer</h2>
          <p className="text-neutral-500 mt-1">
            {activeIdea ? `Managing finances for ${activeIdea.title}` : "Master your cashflow. Forge your financial fortress."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openModal()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </header>

      <nav className="flex items-center gap-1 p-1 bg-neutral-100 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-white text-neutral-900 shadow-sm" 
                : "text-neutral-500 hover:text-neutral-700 hover:bg-white/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-neutral-500">Total Revenue</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">₹{totals.revenue.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-medium text-neutral-500">Total Expenses</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">₹{totals.expenses.toLocaleString()}</span>
            <span className="text-xs font-bold text-red-600 flex items-center">
              <ArrowDownRight className="w-3 h-3" /> +5%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-neutral-500">Burn Rate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">₹{monthlyBurnRate.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">/ mo</span>
          </div>
        </div>

        <div className={cn(
          "p-6 rounded-2xl shadow-xl transition-all",
          isRunwayCritical ? "bg-red-600 text-white" : "bg-neutral-900 text-white"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isRunwayCritical ? "bg-red-500" : "bg-neutral-800"
              )}>
                <Clock className={cn("w-5 h-5", isRunwayCritical ? "text-white" : "text-emerald-400")} />
              </div>
              <span className={cn("text-sm font-medium", isRunwayCritical ? "text-red-100" : "text-neutral-400")}>Runway</span>
            </div>
            {isRunwayCritical && (
              <AlertTriangle className="w-5 h-5 text-amber-300 animate-pulse" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {runwayMonths === Infinity ? "∞" : runwayMonths.toFixed(1)}
            </span>
            <span className={cn("text-xs font-bold", isRunwayCritical ? "text-red-100" : "text-neutral-400")}>
              Months Left
            </span>
          </div>
          {isRunwayCritical && (
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-red-200">
              Critical: Raise Capital Soon
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-neutral-800 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-neutral-400">Current Balance</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">₹{currentBalance.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-400">Liquid</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-sm font-medium text-neutral-500 block">Net Profit</span>
              <span className={cn(
                "text-xl font-bold",
                netProfit >= 0 ? "text-emerald-600" : "text-red-600"
              )}>
                ₹{netProfit.toLocaleString()}
              </span>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            netProfit >= 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
          )}>
            {netProfit >= 0 ? "Healthy" : "Deficit"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Cashflow Overview</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a3a3a3'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a3a3a3'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Recent Transactions</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-9 pr-4 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                  />
                </div>
                <button className="p-1.5 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-all">
                  <Filter className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50 transition-all">
                      <td className="px-6 py-4 text-xs text-neutral-500">{t.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900">{t.description}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {t.category}
                        </span>
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-sm font-bold",
                        t.type === "income" ? "text-emerald-600" : "text-red-600"
                      )}>
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openModal(t)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500" />
              AI Insights
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs font-bold text-amber-800 mb-1">Warning: High Burn Rate</p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Your marketing expenses increased by 40% this month without a proportional increase in revenue.
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-800 mb-1">Optimization Opportunity</p>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Switching to an annual subscription for your CRM could save you ₹12,000/year.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <h4 className="font-bold mb-2">Smart Tax Planning</h4>
            <p className="text-xs text-indigo-100 leading-relaxed mb-4">
              Our AI has identified ₹24,000 in potential tax deductions for your business structure.
            </p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-all">
              Generate Tax Report
            </button>
          </div>
        </div>
      </div>
    </>
  )}

      {activeTab === "transactions" && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">All Transactions</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  className="pl-9 pr-4 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                />
              </div>
              <button className="p-1.5 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-all">
                <Filter className="w-4 h-4 text-neutral-600" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50 transition-all">
                    <td className="px-6 py-4 text-xs text-neutral-500">{t.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {t.category}
                      </span>
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-sm font-bold",
                      t.type === "income" ? "text-emerald-600" : "text-red-600"
                    )}>
                      {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        t.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                        t.status === "refunded" ? "bg-amber-50 text-amber-600" :
                        "bg-neutral-50 text-neutral-600"
                      )}>
                        {t.status || "completed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {t.type === "income" && t.status !== "refunded" && (
                          <button 
                            onClick={() => handleRefund(t.id)}
                            className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Refund"
                          >
                            <Undo2 className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => openModal(t)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-8">
          {/* Payment Links */}
          <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <LinkIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Payment Links</h3>
                  <p className="text-[10px] text-neutral-400">Collect payments instantly via shareable links</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Plus className="w-3 h-3" />
                Create Link
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentLinks.map(link => (
                <div key={link.id} className="p-4 border border-neutral-100 rounded-xl hover:border-indigo-200 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-neutral-900">₹{link.amount.toLocaleString()}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-bold uppercase tracking-widest">
                      {link.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-neutral-600 mb-1">{link.description}</p>
                  <p className="text-[10px] text-neutral-400 mb-4">{link.purpose}</p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(link.url);
                      }}
                      className="flex-1 py-2 bg-neutral-50 text-neutral-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Link
                    </button>
                    <button 
                      onClick={() => setQrModalData(link)}
                      className="p-2 bg-neutral-50 text-neutral-600 rounded-lg hover:bg-neutral-100 transition-all"
                      title="Generate QR Code"
                    >
                      <QrCode className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleSimulatePayment(link.amount, link.description)}
                      className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all"
                      title="Simulate Payment"
                    >
                      <Zap className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Invoices */}
          <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Invoices</h3>
                  <p className="text-[10px] text-neutral-400">Manage professional billing and reminders</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2">
                <Plus className="w-3 h-3" />
                New Invoice
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    <th className="px-6 py-3">Invoice ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {invoices.map(invoice => (
                    <tr key={invoice.id} className="hover:bg-neutral-50 transition-all">
                      <td className="px-6 py-4 text-xs font-bold text-neutral-900">{invoice.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-neutral-900">{invoice.customerName}</span>
                          <span className="text-[10px] text-neutral-400">{invoice.customerEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-neutral-900">₹{invoice.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-neutral-500">{invoice.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          invoice.status === "paid" ? "bg-emerald-50 text-emerald-600" :
                          invoice.status === "pending" ? "bg-amber-50 text-amber-600" :
                          "bg-red-50 text-red-600"
                        )}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Subscriptions */}
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Repeat className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Subscription Plans</h3>
                </div>
                <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {plans.map(plan => (
                  <div key={plan.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{plan.name}</h4>
                      <p className="text-[10px] text-neutral-500">₹{plan.price}/{plan.interval}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                        <Users className="w-3 h-3" />
                        {plan.activeSubscribers}
                      </div>
                      <p className="text-[8px] text-neutral-400 uppercase font-bold">Active Users</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Payouts */}
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Banknote className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Payouts & Settlements</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {payouts.map(payout => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900">₹{payout.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-neutral-400">{payout.bankAccount}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest",
                      payout.status === "settled" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {payout.status}
                    </span>
                  </div>
                ))}
                <div className="p-4 bg-neutral-900 rounded-xl text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pending Settlement</span>
                    <Clock className="w-3 h-3 text-amber-400" />
                  </div>
                  <p className="text-lg font-bold">₹12,450.00</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Expected by tomorrow, 10:00 AM</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Revenue Growth</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a3a3a3'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a3a3a3'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Payment Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Success Rate</span>
                    <span className="text-xs font-bold text-emerald-600">98.2%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: '98.2%' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Failed Payments</span>
                    <span className="text-xs font-bold text-red-600">1.8%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Customer Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Avg. Lifetime Value</span>
                    <span className="text-xs font-bold text-neutral-900">₹14,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Top Customer</span>
                    <span className="text-xs font-bold text-indigo-600">Acme Corp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="bg-neutral-900 p-8 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-32 h-32 text-amber-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500 rounded-xl">
                  <Zap className="w-5 h-5 text-neutral-900" />
                </div>
                <h3 className="text-xl font-bold">AI Financial Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-neutral-800 rounded-2xl border border-neutral-700">
                  <p className="text-xs font-bold text-amber-400 mb-2 uppercase tracking-widest">Cashflow Alert</p>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Expected expenses for next month are ₹45,000. Your current liquid balance covers 11 months of runway.
                  </p>
                </div>
                <div className="p-4 bg-neutral-800 rounded-2xl border border-neutral-700">
                  <p className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-widest">Revenue Suggestion</p>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Your 'Pro Plan' has a 95% retention rate. Consider a 15% price increase for new signups to boost MRR.
                  </p>
                </div>
                <div className="p-4 bg-neutral-800 rounded-2xl border border-neutral-700">
                  <p className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-widest">Expense Optimization</p>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    You have 3 duplicate SaaS subscriptions. Cancelling them could save you ₹3,500 monthly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">Scan to Pay</h3>
              <button onClick={() => setQrModalData(null)} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center text-center">
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 mb-6">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrModalData.url)}`} 
                  alt="Payment QR Code"
                  className="w-48 h-48"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xl font-bold text-neutral-900 mb-1">₹{qrModalData.amount.toLocaleString()}</p>
              <p className="text-sm text-neutral-500 mb-6">{qrModalData.description}</p>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setQrModalData(null)}
                  className="flex-1 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Simulation Modal */}
      {paymentModalData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">Complete Payment</h3>
              <button onClick={() => setPaymentModalData(null)} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Payment Amount</p>
                <p className="text-2xl font-bold text-indigo-900">₹{paymentModalData.amount.toLocaleString()}</p>
                <p className="text-xs text-indigo-600 mt-1">{paymentModalData.description}</p>
              </div>
              
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 block">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: Smartphone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { id: 'card', label: 'Card', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { id: 'netbanking', label: 'Net Banking', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { id: 'wallet', label: 'Wallets', icon: WalletIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => completePayment(method.label)}
                    className="p-4 border border-neutral-100 rounded-2xl hover:border-neutral-900 transition-all text-left group"
                  >
                    <div className={cn("p-2 rounded-lg w-fit mb-3", method.bg)}>
                      <method.icon className={cn("w-5 h-5", method.color)} />
                    </div>
                    <p className="text-sm font-bold text-neutral-900">{method.label}</p>
                    <p className="text-[10px] text-neutral-500">Instant Settlement</p>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-center gap-6 opacity-50 grayscale">
                <span className="text-[10px] font-bold text-neutral-400">GPay</span>
                <span className="text-[10px] font-bold text-neutral-400">PhonePe</span>
                <span className="text-[10px] font-bold text-neutral-400">Paytm</span>
                <span className="text-[10px] font-bold text-neutral-400">UPI</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">
                {editingId ? "Edit Transaction" : "New Transaction"}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <form onSubmit={handleAddOrEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as "income" | "expense"})}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as TransactionCategory})}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="marketing">Marketing</option>
                    <option value="salary">Salary</option>
                    <option value="tools">Tools</option>
                    <option value="sales">Sales</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Description</label>
                <input 
                  type="text" 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="e.g. Monthly SaaS Subscription"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Amount (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200"
                >
                  {editingId ? "Update Transaction" : "Forge Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
