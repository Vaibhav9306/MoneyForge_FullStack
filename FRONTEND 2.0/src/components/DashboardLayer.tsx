import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Target, 
  ArrowUpRight, 
  Zap, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  BarChart3,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Globe
} from "lucide-react";
import api from "../services/api";
import { AnalyticsEngine } from "./AnalyticsEngine";
import { generateText } from "../services/geminiService";
import { cn } from "../lib/utils";
import { useIdea } from "../context/IdeaContext";

interface RoadmapStep {
  title: string;
  description: string;
  estimatedTime: string;
  priority: "Low" | "Medium" | "High" | "Critical";
}

export function DashboardLayer() {
  const { activeIdea } = useIdea();
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  useEffect(() => {
    if (activeIdea) {
      const savedRoadmap = localStorage.getItem(`moneyforge_roadmap_${activeIdea.id}`);
      if (savedRoadmap) {
        setRoadmap(JSON.parse(savedRoadmap));
      } else {
        generateRoadmap(activeIdea);
      }

      const savedCampaigns = JSON.parse(localStorage.getItem('ad_campaigns') || '[]');
      setCampaigns(savedCampaigns.filter((c: any) => c.ideaId === activeIdea.id));
    } else {
      setRoadmap([]);
      setCampaigns([]);
    }
    fetchFinanceStats();
  }, [activeIdea]);

  const fetchFinanceStats = async () => {
    try {
      const { data } = await api.get("/api/finance");
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const revenue = data.transactions
        .filter((tx: any) => {
          const d = new Date(tx.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear && tx.type === "income";
        })
        .reduce((sum: number, tx: any) => sum + tx.amount, 0);

      setMonthlyRevenue(revenue);
    } catch (err) {
      console.error("Failed to fetch finance stats for dashboard:", err);
    }
  };

  const analytics = useMemo(() => {
    const total = roadmap.length;
    const completed = roadmap.filter(t => (t as any).completed).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      total,
      completed,
      progress
    };
  }, [roadmap]);

  const generateRoadmap = async (idea: any) => {
    setIsGeneratingRoadmap(true);
    try {
      const prompt = `
        As a Startup Execution Specialist, generate a detailed 7-14 step execution roadmap for the following startup idea:
        Title: ${idea.title}
        Description: ${idea.description}
        Problem: ${idea.problem}
        MVP Features: ${idea.mvpFeatures.join(", ")}
        
        Provide the response in the following JSON format:
        {
          "roadmap": [
            {
              "title": "Task Title",
              "description": "Brief description of what needs to be done",
              "estimatedTime": "e.g., 2 days, 1 week",
              "priority": "Low/Medium/High/Critical"
            }
          ]
        }
        Return ONLY the JSON.
      `;
      const text = await generateText(prompt);
      if (text) {
        const cleaned = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const generatedRoadmap = parsed.roadmap || [];
        setRoadmap(generatedRoadmap);
        localStorage.setItem(`moneyforge_roadmap_${idea.id}`, JSON.stringify(generatedRoadmap));
      }
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
            {activeIdea ? `Executing: ${activeIdea.title}` : "Welcome, Forge Master"}
          </h2>
          <p className="text-neutral-500 mt-1">
            {activeIdea ? activeIdea.description : 'Your global empire is currently in the "Growth" phase.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Phase 2: Growth
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-neutral-500">Execution Progress</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                analytics.progress === 0 ? "bg-neutral-100 text-neutral-500" :
                analytics.progress === 100 ? "bg-emerald-100 text-emerald-600" :
                "bg-indigo-100 text-indigo-600"
              )}>
                {analytics.progress === 0 ? "Not Started" : analytics.progress === 100 ? "Completed" : "In Progress"}
              </span>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{analytics.completed}/{analytics.total} Tasks</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-neutral-900">{analytics.progress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${analytics.progress}%` }}
                className="h-full bg-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-neutral-500">Monthly Revenue</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">₹{monthlyRevenue.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +24%
            </span>
          </div>
        </div>

        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-indigo-100">Next Milestone</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">
              {activeIdea ? "MVP Launch" : "Series A Readiness"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalyticsEngine />

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                Execution Roadmap
              </h3>
              {isGeneratingRoadmap && (
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </div>
              )}
            </div>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {roadmap.length > 0 ? (
                roadmap.map((step, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 bg-neutral-50 rounded-full flex-shrink-0 flex items-center justify-center border border-neutral-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                        <span className="text-xs font-bold text-neutral-400 group-hover:text-indigo-600">{index + 1}</span>
                      </div>
                      {index !== roadmap.length - 1 && (
                        <div className="w-0.5 flex-1 bg-neutral-100" />
                      )}
                    </div>
                    <div className="pb-6 space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-800 font-bold">
                          {step.title}
                        </p>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          step.priority === "Critical" ? "bg-rose-50 text-rose-600" :
                          step.priority === "High" ? "bg-amber-50 text-amber-600" :
                          step.priority === "Medium" ? "bg-blue-50 text-blue-600" :
                          "bg-neutral-50 text-neutral-500"
                        )}>
                          {step.priority}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold">
                          <Clock className="w-3 h-3" />
                          {step.estimatedTime}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : !isGeneratingRoadmap && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-neutral-300" />
                  </div>
                  <p className="text-sm text-neutral-500">No active roadmap. Forge an idea to begin.</p>
                </div>
              )}
            </div>
            
            {activeIdea && (
              <button 
                onClick={() => generateRoadmap(activeIdea)}
                className="w-full mt-4 py-3 text-xs font-bold text-neutral-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
              >
                Regenerate Strategy <Sparkles className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                Active Ad Campaigns
              </h3>
            </div>
            
            <div className="space-y-4">
              {campaigns.length > 0 ? (
                campaigns.map((campaign, idx) => (
                  <div key={idx} className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 hover:border-amber-200 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-neutral-100 group-hover:bg-amber-50 transition-colors">
                          <Globe className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{campaign.strategy.objective}</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{campaign.strategy.platforms.join(" + ")}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                        {campaign.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-2 rounded-xl border border-neutral-100">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-0.5">Spend</span>
                        <p className="text-xs font-bold text-neutral-900">{campaign.spend}</p>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-neutral-100">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-0.5">ROI</span>
                        <p className="text-xs font-bold text-emerald-600">{campaign.roi}</p>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-neutral-100">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-0.5">Conv.</span>
                        <p className="text-xs font-bold text-neutral-900">{campaign.conversions}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-5 h-5 text-neutral-300" />
                  </div>
                  <p className="text-xs text-neutral-500">No active campaigns. Use the Ad Agent to launch.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-neutral-900 p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Scale Your Empire</h3>
              <p className="text-neutral-400 text-sm mb-6 max-w-xs">
                Deterministic insights show your unit economics are ready for aggressive growth.
              </p>
              <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl font-semibold flex items-center gap-2 transition-all text-neutral-900">
                Scale Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
