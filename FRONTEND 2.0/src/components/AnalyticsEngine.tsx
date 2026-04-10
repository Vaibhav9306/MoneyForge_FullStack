import React, { useMemo } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Zap,
  BarChart3,
  AlertCircle,
  Target,
  Clock,
  CheckCircle2
} from "lucide-react";
import { cn } from "../lib/utils";

// INPUT DATA (Deterministic Source)
const BUSINESS_METRICS = {
  revenue: 27000,
  costs: {
    fixed: 10000,
    variable: 5500,
  },
  profit: 11500,
  burnRate: 15500,
  cac: 72.94,
  ltv: 427.35,
  growthRate: {
    mom: 15.4,
    qoq: 42.8,
  },
  cashRunway: 33.0, // Months
};

interface Insight {
  type: "CRITICAL" | "HEALTHY" | "WARNING" | "INFO";
  metric: string;
  value: string;
  conclusion: string;
  logic: string;
  action: string;
  tools: string[];
}

export function AnalyticsEngine() {
  const insights = useMemo(() => {
    const results: Insight[] = [];

    // 1. Profitability & Burn Analysis
    const totalCosts = BUSINESS_METRICS.costs.fixed + BUSINESS_METRICS.costs.variable;
    const netMargin = (BUSINESS_METRICS.profit / BUSINESS_METRICS.revenue) * 100;

    if (BUSINESS_METRICS.profit < 0) {
      results.push({
        type: "CRITICAL",
        metric: "Net Profit",
        value: `₹${BUSINESS_METRICS.profit.toLocaleString()}`,
        conclusion: "Negative net profit indicates unsustainable operations.",
        logic: "Profit < 0 threshold.",
        action: "Immediate audit of variable costs and pricing model adjustment.",
        tools: ["QuickBooks", "Xero"]
      });
    } else if (netMargin < 20) {
      results.push({
        type: "WARNING",
        metric: "Net Margin",
        value: `${netMargin.toFixed(1)}%`,
        conclusion: "Low net margin limits reinvestment capacity.",
        logic: "Margin < 20% benchmark.",
        action: "Optimize fixed costs and explore high-margin upsells.",
        tools: ["Ramp", "Brex"]
      });
    } else {
      results.push({
        type: "HEALTHY",
        metric: "Net Margin",
        value: `${netMargin.toFixed(1)}%`,
        conclusion: "Healthy margins support sustainable scaling.",
        logic: "Margin > 20% benchmark.",
        action: "Maintain cost discipline while scaling revenue.",
        tools: ["Gusto", "Deel"]
      });
    }

    // 2. Unit Economics (LTV/CAC)
    const ltvCac = BUSINESS_METRICS.ltv / BUSINESS_METRICS.cac;
    if (ltvCac < 3) {
      results.push({
        type: "WARNING",
        metric: "LTV/CAC Ratio",
        value: `${ltvCac.toFixed(1)}x`,
        conclusion: "Marketing efficiency is sub-optimal. CAC reduction required.",
        logic: "LTV/CAC < 3.0 benchmark.",
        action: "Optimize ad spend and improve conversion rate funnel.",
        tools: ["Google Ads", "Mixpanel", "Optimizely"]
      });
    } else {
      results.push({
        type: "HEALTHY",
        metric: "LTV/CAC Ratio",
        value: `${ltvCac.toFixed(1)}x`,
        conclusion: "Unit economics support aggressive scaling of S&M spend.",
        logic: "LTV/CAC > 3.0 benchmark.",
        action: "Increase marketing budget to capture more market share.",
        tools: ["HubSpot", "Salesforce"]
      });
    }

    // 3. Growth Velocity
    if (BUSINESS_METRICS.growthRate.mom < 10) {
      results.push({
        type: "WARNING",
        metric: "MoM Growth",
        value: `${BUSINESS_METRICS.growthRate.mom}%`,
        conclusion: "Growth velocity is below the 10% target for high-scale startups.",
        logic: "MoM Growth < 10% threshold.",
        action: "Analyze customer acquisition channels for bottlenecks.",
        tools: ["Amplitude", "Segment"]
      });
    }

    // 4. Runway Security
    if (BUSINESS_METRICS.cashRunway < 12) {
      results.push({
        type: "CRITICAL",
        metric: "Cash Runway",
        value: `${BUSINESS_METRICS.cashRunway} Months`,
        conclusion: "Runway below 12 months requires immediate fundraising focus.",
        logic: "Runway < 12 months threshold.",
        action: "Prepare Series A pitch deck and initiate investor outreach.",
        tools: ["PitchDeck", "DocSend"]
      });
    }

    // 5. Execution Analytics (Dynamic)
    const savedIdea = localStorage.getItem("moneyforge_active_idea");
    if (savedIdea) {
      const idea = JSON.parse(savedIdea);
      const savedRoadmap = localStorage.getItem(`moneyforge_roadmap_${idea.id}`);
      
      if (savedRoadmap) {
        const roadmap = JSON.parse(savedRoadmap);
        
        // EXECUTION DATA (Derived)
        const executionData = {
          totalTasks: roadmap.length,
          completedTasks: 0, // In a real app, this would track status
          timeSpent: "0h",
          estimatedTime: roadmap.reduce((acc: number, step: any) => {
            const time = step.estimatedTime.toLowerCase();
            if (time.includes("day")) return acc + (parseInt(time) * 8);
            if (time.includes("week")) return acc + (parseInt(time) * 40);
            return acc;
          }, 0) + "h"
        };

        const progress = (executionData.completedTasks / executionData.totalTasks) * 100;

        results.push({
          type: "INFO",
          metric: "Execution Velocity",
          value: `${progress.toFixed(0)}%`,
          conclusion: `Project "${idea.title}" roadmap is initialized with ${executionData.totalTasks} steps.`,
          logic: "Completed Tasks / Total Tasks.",
          action: `Begin execution of Step 1: ${roadmap[0].title}`,
          tools: ["Linear", "Notion", "Slack"]
        });
      }
    }

    return results;
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
            Deterministic Analytics Engine
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Logic Active</span>
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {insights.map((insight, i) => (
          <div key={i} className="p-6 hover:bg-neutral-50 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  insight.type === "CRITICAL" ? "bg-rose-50 text-rose-600" :
                  insight.type === "HEALTHY" ? "bg-emerald-50 text-emerald-600" :
                  insight.type === "WARNING" ? "bg-amber-50 text-amber-600" :
                  "bg-blue-50 text-blue-600"
                )}>
                  {insight.type === "CRITICAL" ? <ShieldAlert className="w-4 h-4" /> :
                   insight.type === "HEALTHY" ? <ShieldCheck className="w-4 h-4" /> :
                   <Activity className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                    {insight.metric}
                  </span>
                  <span className="text-lg font-bold text-neutral-900">{insight.value}</span>
                </div>
              </div>
              <div className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                insight.type === "CRITICAL" ? "bg-rose-100 text-rose-700" :
                insight.type === "HEALTHY" ? "bg-emerald-100 text-emerald-700" :
                insight.type === "INFO" ? "bg-blue-100 text-blue-700" :
                "bg-amber-100 text-amber-700"
              )}>
                {insight.type}
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-neutral-700 font-medium leading-relaxed">
                {insight.conclusion}
              </p>
              
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-2">
                <div className="flex items-start gap-2">
                  <Target className="w-3 h-3 text-indigo-500 mt-0.5" />
                  <p className="text-xs text-neutral-600 font-medium">
                    <span className="text-neutral-900 font-bold">Action:</span> {insight.action}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Tools:</span>
                  {insight.tools.map((tool, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-[10px] font-bold text-neutral-600">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-4">
              <BarChart3 className="w-3 h-3" />
              Logic: {insight.logic}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-neutral-50 border-t border-neutral-100">
        <p className="text-[10px] text-neutral-400 leading-relaxed text-center italic">
          Conclusions derived strictly from current financial, growth, and execution datasets using deterministic logic gates.
        </p>
      </div>
    </div>
  );
}
