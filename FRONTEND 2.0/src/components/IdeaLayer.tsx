import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lightbulb, 
  Search, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  Sparkles,
  Users,
  Target,
  DollarSign,
  BarChart3,
  AlertCircle,
  TrendingUp,
  X,
  Bookmark,
  BookmarkCheck,
  Rocket,
  Globe,
  Plus,
  ArrowRight
} from "lucide-react";
import { generateText } from "../services/geminiService";
import { cn } from "../lib/utils";
import { Layer } from "../types";
import { useIdea } from "../context/IdeaContext";
import api from "../services/api";

interface IdeaResult {
  id: string;
  title: string;
  description: string;
  problem: string;
  targetAudience: string;
  monetizationModel: string;
  demandScore: number;
  competition: "low" | "medium" | "high";
  revenuePotential: string;
  mvpFeatures: string[];
  gtmStrategy: string;
}

export function IdeaLayer({ onLayerChange }: { onLayerChange: (layer: Layer) => void }) {
  const { activeIdea, setActiveIdea, executedIdeaIds, setExecutedIdeaIds } = useIdea();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IdeaResult[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<IdeaResult[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<IdeaResult | null>(null);
  const [activeTab, setActiveTab] = useState<"forge" | "my-ideas">("forge");
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const { data } = await api.get("/api/ideas");
        const mappedIdeas = data.ideas.map((dbIdea: any) => {
          let details = {};
          try {
            if (dbIdea.marketValidation) {
              details = JSON.parse(dbIdea.marketValidation);
            }
          } catch (e) {
            console.error("Failed to parse idea details", e);
          }
          return {
            id: dbIdea._id,
            title: dbIdea.title,
            description: dbIdea.description,
            ...details
          };
        });
        setSavedIdeas(mappedIdeas);
      } catch (error) {
        console.error("Failed to fetch saved ideas:", error);
      }
    };
    fetchIdeas();
  }, []);

  const handleStartExecution = async (idea: IdeaResult) => {
    if (executedIdeaIds.includes(idea.id)) {
      setActiveIdea(idea);
      onLayerChange("execution");
      return;
    }

    setIsExecuting(true);
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
        const generatedRoadmap = (parsed.roadmap || []).map((step: any) => ({
          ...step,
          completed: false
        }));
        
        localStorage.setItem(`moneyforge_roadmap_${idea.id}`, JSON.stringify(generatedRoadmap));
        setExecutedIdeaIds(prev => [...prev, idea.id]);
        setActiveIdea(idea);
        
        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        onLayerChange("execution");
      }
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const prompt = `
        As an AI Startup Idea Agent, generate 3 high-potential business ideas based on: "${input}".
        Provide the response in the following JSON format:
        {
          "ideas": [
            {
              "title": "Short catchy name",
              "description": "One sentence elevator pitch",
              "problem": "The specific pain point being solved",
              "targetAudience": "Who is this for?",
              "monetizationModel": "How will it make money?",
              "demandScore": 8,
              "competition": "low/medium/high",
              "revenuePotential": "$1M+ ARR",
              "mvpFeatures": ["Feature 1", "Feature 2", "Feature 3"],
              "gtmStrategy": "A brief 2-sentence go-to-market strategy"
            }
          ]
        }
        Return ONLY the JSON.
      `;
      const text = await generateText(prompt);
      if (text) {
        const cleaned = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const ideasWithIds = (parsed.ideas || []).map((idea: any) => ({
          ...idea,
          id: Math.random().toString(36).substr(2, 9)
        }));
        setResults(ideasWithIds);
      }
    } catch (error) {
      console.error("Failed to generate ideas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaveIdea = async (idea: IdeaResult) => {
    const isSaved = savedIdeas.find(i => i.id === idea.id || i.title === idea.title);
    if (isSaved) {
      // delete
      try {
        await api.delete(`/api/ideas/${isSaved.id}`);
        setSavedIdeas(savedIdeas.filter(i => i.id !== isSaved.id));
      } catch (err) {
        console.error("Failed to delete idea:", err);
      }
    } else {
      // save
      try {
        const payload = {
          title: idea.title,
          description: idea.description,
          marketValidation: JSON.stringify({
            problem: idea.problem,
            targetAudience: idea.targetAudience,
            monetizationModel: idea.monetizationModel,
            demandScore: idea.demandScore,
            competition: idea.competition,
            revenuePotential: idea.revenuePotential,
            mvpFeatures: idea.mvpFeatures,
            gtmStrategy: idea.gtmStrategy
          })
        };
        const { data } = await api.post("/api/ideas", payload);
        const newIdea = { ...idea, id: data.idea._id };
        setSavedIdeas([...savedIdeas, newIdea]);
      } catch (err) {
        console.error("Failed to save idea:", err);
      }
    }
  };

  const isIdeaSaved = (id: string) => savedIdeas.some(i => i.id === id);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Idea Layer</h2>
          <p className="text-neutral-500 mt-1">Generate and forge your next big venture.</p>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("forge")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === "forge" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            Forge
          </button>
          <button
            onClick={() => setActiveTab("my-ideas")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "my-ideas" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            My Ideas
            {savedIdeas.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {savedIdeas.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {activeTab === "forge" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Idea Generator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    What interests you?
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., sustainable fashion, AI for pets, space tourism..."
                    className="w-full min-h-[100px] p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !input.trim()}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  Forge Idea
                </button>
              </div>
            </div>

            <div className="bg-neutral-900 p-6 rounded-2xl text-white shadow-xl">
              <h4 className="font-bold mb-2">Pro Tip</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Focus on solving a specific pain point rather than just a cool technology. The best ideas are born from frustration.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {results.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedIdea(idea)}
                    className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6 group hover:border-amber-200 transition-all cursor-pointer relative"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                        <Lightbulb className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-neutral-900">{idea.title}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveIdea(idea);
                            }}
                            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                          >
                            {isIdeaSaved(idea.id) ? (
                              <BookmarkCheck className="w-5 h-5 text-amber-500" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-neutral-400" />
                            )}
                          </button>
                        </div>
                        <p className="text-neutral-600 mt-1 text-lg leading-relaxed">{idea.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-neutral-100">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          <AlertCircle className="w-3 h-3 text-rose-500" />
                          The Problem
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed font-medium">{idea.problem}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          <Users className="w-3 h-3 text-blue-500" />
                          Target Audience
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed font-medium">{idea.targetAudience}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          <DollarSign className="w-3 h-3 text-emerald-500" />
                          Monetization
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed font-medium">{idea.monetizationModel}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Demand</div>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold text-neutral-900">{idea.demandScore}/10</span>
                        </div>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Competition</div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-amber-500" />
                          <span className={cn(
                            "font-bold capitalize",
                            idea.competition === "low" ? "text-emerald-600" :
                            idea.competition === "medium" ? "text-amber-600" : "text-rose-600"
                          )}>
                            {idea.competition}
                          </span>
                        </div>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Potential</div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold text-neutral-900">{idea.revenuePotential}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartExecution(idea);
                      }}
                      disabled={isExecuting}
                      className={cn(
                        "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                        executedIdeaIds.includes(idea.id)
                          ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-100"
                      )}
                    >
                      {isExecuting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Forging Execution Plan...
                        </>
                      ) : executedIdeaIds.includes(idea.id) ? (
                        <>
                          <Rocket className="w-5 h-5" />
                          View Execution
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 text-amber-400" />
                          Execute Idea
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center text-neutral-400 p-8 text-center">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-neutral-600">No Idea Forged Yet</h3>
                <p className="text-sm max-w-xs mt-2">
                  Enter your interests on the left to let the AI Idea Agent craft your next venture.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {savedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedIdea(idea)}
                  className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:border-amber-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveIdea(idea);
                      }}
                      className="text-rose-500 hover:text-rose-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                    {idea.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-3 h-3 text-indigo-500" />
                      <span className="text-xs font-bold text-neutral-700">{idea.demandScore}/10</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartExecution(idea);
                      }}
                      disabled={isExecuting}
                      className={cn(
                        "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                        executedIdeaIds.includes(idea.id)
                          ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          : "bg-neutral-900 text-white hover:bg-neutral-800"
                      )}
                    >
                      {isExecuting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : executedIdeaIds.includes(idea.id) ? (
                        <Rocket className="w-3 h-3" />
                      ) : (
                        <Zap className="w-3 h-3 text-amber-400" />
                      )}
                      {executedIdeaIds.includes(idea.id) ? "View" : "Execute"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="min-h-[400px] bg-white border border-neutral-200 rounded-3xl flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-neutral-300" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">No Saved Ideas</h3>
              <p className="text-neutral-500 mt-2 max-w-sm">
                Go back to the Forge and save some startup concepts to see them here.
              </p>
              <button
                onClick={() => setActiveTab("forge")}
                className="mt-6 px-6 py-2 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all"
              >
                Go to Forge
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detailed View Modal */}
      <AnimatePresence>
        {selectedIdea && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdea(null)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-neutral-100 flex items-start justify-between bg-neutral-50">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-2xl">
                    <Lightbulb className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-neutral-900">{selectedIdea.title}</h3>
                    <p className="text-neutral-500 mt-1 text-lg">{selectedIdea.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIdea(null)}
                  className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-indigo-500" />
                      MVP Features
                    </h4>
                    <ul className="space-y-3">
                      {selectedIdea.mvpFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-neutral-700">
                          <div className="w-5 h-5 bg-indigo-50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Plus className="w-3 h-3 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-500" />
                      Go-To-Market Strategy
                    </h4>
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <p className="text-sm text-emerald-900 leading-relaxed font-medium italic">
                        "{selectedIdea.gtmStrategy}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Market Snapshot</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Demand</span>
                      <span className="text-xl font-bold text-neutral-900">{selectedIdea.demandScore}/10</span>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Competition</span>
                      <span className="text-xl font-bold text-neutral-900 capitalize">{selectedIdea.competition}</span>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Potential</span>
                      <span className="text-xl font-bold text-neutral-900">{selectedIdea.revenuePotential}</span>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Monetization</span>
                      <span className="text-sm font-bold text-neutral-900">{selectedIdea.monetizationModel}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 border-t border-neutral-100 bg-neutral-50 flex gap-4">
                <button
                  onClick={() => toggleSaveIdea(selectedIdea)}
                  className={cn(
                    "flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                    isIdeaSaved(selectedIdea.id) 
                      ? "bg-amber-100 text-amber-700 border border-amber-200" 
                      : "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-100"
                  )}
                >
                  {isIdeaSaved(selectedIdea.id) ? (
                    <>
                      <BookmarkCheck className="w-5 h-5" />
                      Saved to My Ideas
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-5 h-5" />
                      Save Idea
                    </>
                  )}
                </button>
                <button 
                  onClick={() => handleStartExecution(selectedIdea)}
                  disabled={isExecuting}
                  className={cn(
                    "flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                    executedIdeaIds.includes(selectedIdea.id)
                      ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-100"
                  )}
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Forging...
                    </>
                  ) : executedIdeaIds.includes(selectedIdea.id) ? (
                    <>
                      <Rocket className="w-5 h-5" />
                      View Execution
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-amber-400" />
                      Execute Idea
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
