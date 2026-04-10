import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coins, TrendingUp, Shield, Target, ArrowRight, BarChart3, PieChart, Landmark, CheckCircle2, Plus, X, Loader2 } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import api from "../services/api";
import { cn } from "../lib/utils";

const assetData = [
  { name: "Stocks", value: 45000, color: "#6366f1" },
  { name: "Crypto", value: 12000, color: "#f59e0b" },
  { name: "Real Estate", value: 120000, color: "#10b981" },
  { name: "Cash", value: 15000, color: "#3b82f6" },
];

export function WealthLayer() {
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({ title: "", targetAmount: "", deadline: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalNetWorth = assetData.reduce((acc, curr) => acc + curr.value, 0);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/goals");
      setGoals(data.goals);
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/api/goals", {
        title: goalForm.title,
        targetAmount: Number(goalForm.targetAmount),
        deadline: goalForm.deadline || undefined,
        category: "wealth"
      });
      setGoalForm({ title: "", targetAmount: "", deadline: "" });
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      console.error("Failed to create goal:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleGoalStatus = async (goal: any) => {
    try {
      const newStatus = goal.status === "completed" ? "pending" : "completed";
      await api.put(`/api/goals/${goal._id}`, { status: newStatus });
      fetchGoals();
    } catch (err) {
      console.error("Failed to update goal:", err);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await api.delete(`/api/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Wealth Layer</h2>
          <p className="text-neutral-500 mt-1">Forge your legacy. Track net worth and build long-term wealth.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Set New Goal
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-neutral-900 p-8 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Landmark className="w-64 h-64" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-neutral-400 text-sm font-bold uppercase tracking-widest mb-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Current Net Worth
              </div>
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-bold tracking-tighter">₹{totalNetWorth.toLocaleString()}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4" /> +18.4%
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-neutral-800">
                {assetData.map((asset, i) => (
                  <div key={i}>
                    <div className="text-xs text-neutral-500 mb-1">{asset.name}</div>
                    <div className="text-lg font-bold">₹{asset.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Asset Allocation
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#404040' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              Financial Goals
            </h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : goals.length > 0 ? (
                goals.slice(0, 3).map((goal) => (
                  <div key={goal._id} className="p-4 bg-neutral-50 rounded-2xl group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs font-bold text-neutral-900">{goal.title}</div>
                      <button 
                        onClick={() => deleteGoal(goal._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                        className={cn(
                          "h-full",
                          goal.status === "completed" ? "bg-emerald-500" : "bg-indigo-500"
                        )}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] text-neutral-500">₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</span>
                      <span className={cn(
                        "text-[10px] font-bold",
                        goal.status === "completed" ? "text-emerald-600" : "text-indigo-600"
                      )}>
                        {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-400 text-center py-4 italic">No active goals found.</p>
              )}
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              Millionaire Roadmap
            </h3>
            <div className="space-y-4">
              <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6">
                {goals.length > 0 ? (
                  goals.map((goal, idx) => (
                    <div key={goal._id} className="relative">
                      <div className={cn(
                        "absolute -left-[33px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm",
                        goal.status === "completed" ? "bg-emerald-600" : "bg-indigo-600"
                      )} />
                      <div className="text-xs font-bold text-indigo-900">{goal.title}</div>
                      <p className="text-[11px] text-indigo-700 leading-relaxed truncate">{goal.description || `Target: ₹${goal.targetAmount.toLocaleString()}`}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="relative">
                      <div className="absolute -left-[33px] top-0 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-sm" />
                      <div className="text-xs font-bold text-indigo-900">Phase 1: Foundation</div>
                      <p className="text-[11px] text-indigo-700 leading-relaxed">Clear all high-interest debt and build 6-month emergency fund.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[33px] top-0 w-4 h-4 bg-indigo-200 rounded-full border-4 border-white shadow-sm" />
                      <div className="text-xs font-bold text-neutral-500">Phase 2: Acceleration</div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">Invest 20% of income into diversified index funds and growth assets.</p>
                    </div>
                  </>
                )}
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                Track Progress <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-neutral-200 p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-neutral-900">Forge Your Goal</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Goal Title</label>
                  <input
                    type="text"
                    required
                    value={goalForm.title}
                    onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                    placeholder="e.g., Tesla Fund"
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={goalForm.targetAmount}
                    onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                    placeholder="1000000"
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={goalForm.deadline}
                    onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Forge Goal"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
