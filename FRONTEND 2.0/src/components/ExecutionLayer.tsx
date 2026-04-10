import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Rocket, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Layout, 
  ArrowRight, 
  Play, 
  Clock, 
  BarChart3, 
  Target,
  Zap,
  Wrench
} from "lucide-react";
import { cn } from "../lib/utils";
import { Layer } from "../types";
import { useIdea } from "../context/IdeaContext";

interface RoadmapStep {
  title: string;
  description: string;
  estimatedTime: string;
  priority: string;
  completed?: boolean;
}

export function ExecutionLayer({ onLayerChange }: { onLayerChange: (layer: Layer) => void }) {
  const { activeIdea } = useIdea();
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);

  useEffect(() => {
    if (activeIdea) {
      const savedRoadmap = localStorage.getItem(`moneyforge_roadmap_${activeIdea.id}`);
      if (savedRoadmap) {
        setRoadmap(JSON.parse(savedRoadmap));
      } else {
        setRoadmap([]);
      }
    } else {
      setRoadmap([]);
    }
  }, [activeIdea]);

  const toggleTask = (index: number) => {
    if (!activeIdea) return;
    const newRoadmap = [...roadmap];
    newRoadmap[index].completed = !newRoadmap[index].completed;
    setRoadmap(newRoadmap);
    localStorage.setItem(`moneyforge_roadmap_${activeIdea.id}`, JSON.stringify(newRoadmap));
  };

  const analytics = useMemo(() => {
    const total = roadmap.length;
    const completed = roadmap.filter(t => t.completed).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    // Time tracking logic
    const totalMinutes = roadmap.reduce((acc, step) => {
      const time = step.estimatedTime.toLowerCase();
      if (time.includes("day")) return acc + (parseInt(time) * 8 * 60);
      if (time.includes("week")) return acc + (parseInt(time) * 40 * 60);
      if (time.includes("hour")) return acc + (parseInt(time) * 60);
      return acc + 30; // default 30 mins
    }, 0);

    const completedMinutes = roadmap.filter(t => t.completed).reduce((acc, step) => {
      const time = step.estimatedTime.toLowerCase();
      if (time.includes("day")) return acc + (parseInt(time) * 8 * 60);
      if (time.includes("week")) return acc + (parseInt(time) * 40 * 60);
      if (time.includes("hour")) return acc + (parseInt(time) * 60);
      return acc + 30;
    }, 0);

    return {
      total,
      completed,
      progress,
      totalHours: (totalMinutes / 60).toFixed(1),
      completedHours: (completedMinutes / 60).toFixed(1)
    };
  }, [roadmap]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Execution Layer</h2>
          <p className="text-neutral-500 mt-1">
            {activeIdea ? `Launching: ${activeIdea.title}` : "From blueprint to reality. Launch your business in 24 hours."}
          </p>
        </div>
        {activeIdea && (
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">
            <Rocket className="w-4 h-4" />
            Live Execution
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-neutral-500">Progress</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-neutral-900">{analytics.progress.toFixed(0)}%</span>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Completion</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
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
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-neutral-500">Tasks Completed</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">{analytics.completed}</span>
            <span className="text-sm font-medium text-neutral-400">/ {analytics.total}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-neutral-500">Time Tracking</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">{analytics.completedHours}h</span>
            <span className="text-sm font-medium text-neutral-400">of {analytics.totalHours}h est.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              Execution Roadmap
            </h3>

            <div className="space-y-4">
              {roadmap.length > 0 ? (
                roadmap.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => toggleTask(index)}
                    className={cn(
                      "w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group",
                      item.completed 
                        ? "bg-neutral-50 border-neutral-100 text-neutral-400" 
                        : "bg-white border-neutral-100 hover:border-indigo-200 shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      item.completed 
                        ? "bg-emerald-500 border-emerald-500" 
                        : "border-neutral-200 group-hover:border-indigo-500"
                    )}>
                      {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Step {index + 1}</div>
                        <div className="text-[10px] font-bold text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.estimatedTime}
                        </div>
                      </div>
                      <div className={cn("text-sm font-bold text-neutral-900", item.completed && "line-through text-neutral-400")}>
                        {item.title}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{item.description}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-8 h-8 text-neutral-200" />
                  </div>
                  <p className="text-sm text-neutral-500">No active roadmap. Forge an idea to begin execution.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layout className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Forge Tools</h3>
              <p className="text-neutral-400 text-sm mb-6 max-w-xs">
                Access AI generators for landing pages, logos, and ad copy.
              </p>
              <button 
                onClick={() => onLayerChange("tools")}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold flex items-center gap-2 transition-all"
              >
                <Wrench className="w-4 h-4" />
                Open Forge Tools
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Launch Checklist
            </h3>
            <div className="space-y-4">
              {[
                { label: "Domain registered", done: false },
                { label: "Payment gateway connected", done: false },
                { label: "First product/service listed", done: false },
                { label: "Email list set up", done: false }
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-neutral-600">
                  <div className="w-5 h-5 rounded-lg border border-neutral-200 flex items-center justify-center">
                    {check.done && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </div>
                  {check.label}
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-neutral-50 text-neutral-900 rounded-2xl text-sm font-bold hover:bg-neutral-100 transition-all flex items-center justify-center gap-2">
              Complete All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
