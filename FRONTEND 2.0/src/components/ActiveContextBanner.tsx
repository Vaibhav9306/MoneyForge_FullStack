import { motion } from "motion/react";
import { Zap, Rocket, ArrowRight } from "lucide-react";
import { useIdea } from "../context/IdeaContext";
import { cn } from "../lib/utils";

export function ActiveContextBanner({ onLayerChange }: { onLayerChange?: (layer: any) => void }) {
  const { activeIdea } = useIdea();

  if (!activeIdea) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 bg-neutral-900 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Zap className="w-16 h-16" />
      </div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6 text-neutral-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Active Context</span>
              <span className="w-1 h-1 bg-neutral-700 rounded-full" />
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Executing</span>
            </div>
            <h3 className="text-lg font-bold leading-tight">{activeIdea.title}</h3>
          </div>
        </div>
        
        {onLayerChange && (
          <button 
            onClick={() => onLayerChange("execution")}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/10"
          >
            <Rocket className="w-3 h-3" />
            View Roadmap
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
