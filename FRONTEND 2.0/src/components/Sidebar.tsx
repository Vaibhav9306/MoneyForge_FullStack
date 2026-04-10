import { 
  Lightbulb, 
  Rocket, 
  Wallet, 
  TrendingUp, 
  Coins, 
  LayoutDashboard,
  Layout,
  ChevronRight,
  PieChart,
  Wrench
} from "lucide-react";
import { cn } from "../lib/utils";
import { Layer } from "../types";
import { useIdea } from "../context/IdeaContext";
import { Zap } from "lucide-react";

interface SidebarProps {
  activeLayer: Layer;
  onLayerChange: (layer: Layer) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "idea", label: "Idea Layer", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "execution", label: "Execution", icon: Rocket, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "tools", label: "Forge Tools", icon: Wrench, color: "text-rose-500", bg: "bg-rose-50" },
  { id: "landing", label: "Landing Page", icon: Layout, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "finance", label: "Finance", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "budget", label: "Budgeting", icon: PieChart, color: "text-rose-500", bg: "bg-rose-50" },
  { id: "growth", label: "Growth", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "wealth", label: "Wealth", icon: Coins, color: "text-indigo-500", bg: "bg-indigo-50" },
] as const;

export function Sidebar({ activeLayer, onLayerChange }: SidebarProps) {
  const { activeIdea } = useIdea();

  return (
    <aside className="w-64 border-r border-neutral-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20V4l8 8 8-8v16" />
              <path d="M12 12h8" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#3730A3]">MoneyForge</h1>
        </div>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2">
          Wealth OS v1.0
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onLayerChange(item.id as Layer)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
              activeLayer === item.id 
                ? cn(item.bg, "shadow-sm") 
                : "hover:bg-neutral-50"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                activeLayer === item.id ? item.color : "text-neutral-400 group-hover:text-neutral-600"
              )} />
              <span className={cn(
                "text-sm font-medium transition-colors",
                activeLayer === item.id ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-700"
              )}>
                {item.label}
              </span>
            </div>
            {activeLayer === item.id && (
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-100 space-y-4">
        {activeIdea && (
          <div className="bg-neutral-900 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Active Context
              </span>
            </div>
            <p className="text-xs font-bold truncate">{activeIdea.title}</p>
          </div>
        )}

        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              AI Orchestrator Online
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Ready to forge your global empire.
          </p>
        </div>
      </div>
    </aside>
  );
}
