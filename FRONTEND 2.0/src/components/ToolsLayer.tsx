import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Wrench, 
  Layout, 
  Palette, 
  Mail, 
  Megaphone, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check,
  Download,
  ExternalLink,
  Zap,
  Send,
  UserPlus,
  Calendar as CalendarIcon,
  MessageSquare,
  Target,
  BarChart3,
  Globe,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  PieChart as PieChartIcon,
  Activity,
  AlertCircle,
  Type,
  Image as ImageIcon,
  PenTool,
  Smartphone
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { generateText, generateEmailIntent, EmailIntent, generateAdCampaign, AdCampaign, generateLogoConcepts, LogoConcept } from "../services/geminiService";
import { cn } from "../lib/utils";
import { useIdea } from "../context/IdeaContext";
import { useEffect } from "react";

type ToolType = "landing" | "logo" | "email" | "adcopy";

interface ToolConfig {
  id: ToolType;
  label: string;
  icon: any;
  description: string;
  prompt: string;
  color: string;
}

const TOOLS: ToolConfig[] = [
  {
    id: "landing",
    label: "Landing Page",
    icon: Layout,
    description: "Generate high-converting landing page structure and copy.",
    prompt: "Generate a high-converting landing page structure and copy for a startup called {name}. \nContext: {description}\nProblem being solved: {problem}\nCore MVP Features: {features}\nTarget Audience: {description}\n\nInclude a hero section with a compelling headline, sub-headline, a 'How it works' section, key features, and a strong CTA.",
    color: "text-blue-500"
  },
  {
    id: "logo",
    label: "Logo Concept",
    icon: Palette,
    description: "Generate and customize logos directly with Canva.",
    prompt: "Generate 3 logo concepts and a professional color palette for a startup called {name}.\nContext: {description}\nNiche & Positioning: {description}\n\nFocus on visual metaphors, brand personality, and typography suggestions that align with the startup's core mission.",
    color: "text-purple-500"
  },
  {
    id: "email",
    label: "Email Sequence",
    icon: Mail,
    description: "Generate cold outreach or welcome email sequences.",
    prompt: "Generate a 3-step welcome email sequence for new users of {name}.\nContext: {description}\nValue Proposition: {description}\n\nFocus on delivering immediate value, setting expectations, and driving the user towards their first 'aha' moment with the product.",
    color: "text-emerald-500"
  },
  {
    id: "adcopy",
    label: "Ad Copy",
    icon: Megaphone,
    description: "Generate high-performing ad copy for social media.",
    prompt: "Generate 5 variations of high-performing ad copy (Facebook/Instagram/LinkedIn) for {name}.\nContext: {description}\nProblem: {problem}\nSolution: {description}\n\nInclude attention-grabbing hooks, benefit-driven body copy, and clear CTAs tailored for each platform.",
    color: "text-amber-500"
  }
];

export function ToolsLayer({ onLayerChange }: { onLayerChange: (layer: any) => void }) {
  const { activeIdea } = useIdea();
  const [activeTool, setActiveTool] = useState<ToolType>("logo");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [isCanvaConnected, setIsCanvaConnected] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState("");
  const [logoPrompt, setLogoPrompt] = useState("");
  const [emailIntent, setEmailIntent] = useState<EmailIntent | null>(null);
  const [adCampaign, setAdCampaign] = useState<AdCampaign | null>(null);
  const [logoConcepts, setLogoConcepts] = useState<LogoConcept[]>([]);
  const [adPrompt, setAdPrompt] = useState("");
  const [reviewEnabled, setReviewEnabled] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [adPlatforms, setAdPlatforms] = useState<{ id: string, name: string, connected: boolean, icon: any }[]>([
    { id: 'google_ads', name: 'Google Ads', connected: false, icon: Globe },
    { id: 'meta_ads', name: 'Meta Ads', connected: false, icon: Target },
    { id: 'tiktok_ads', name: 'TikTok Ads', connected: false, icon: Activity },
  ]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [funnelData, setFunnelData] = useState<any[]>([]);

  useEffect(() => {
    checkGmailStatus();
    checkCanvaStatus();
    checkAdPlatformsStatus();
    
    // Generate mock performance data
    const mockPerf = Array.from({ length: 7 }).map((_, i) => ({
      name: `Day ${i + 1}`,
      spend: Math.floor(Math.random() * 500) + 100,
      conversions: Math.floor(Math.random() * 20) + 5,
      leads: Math.floor(Math.random() * 50) + 10,
    }));
    setPerformanceData(mockPerf);

    setFunnelData([
      { name: 'Leads', value: 400, color: '#6366f1' },
      { name: 'Qualified', value: 300, color: '#8b5cf6' },
      { name: 'Conversions', value: 200, color: '#10b981' },
      { name: 'Drop-offs', value: 100, color: '#f43f5e' },
    ]);

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GMAIL_AUTH_SUCCESS') {
        setIsGmailConnected(true);
      }
      if (event.data?.type === 'CANVA_AUTH_SUCCESS') {
        setIsCanvaConnected(true);
      }
      if (event.data?.type === 'AD_AUTH_SUCCESS') {
        const platformId = event.data.platform;
        setAdPlatforms(prev => prev.map(p => p.id === platformId ? { ...p, connected: true } : p));
        setStatus({ type: 'success', message: `${platformId.replace('_', ' ')} connected successfully!` });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkAdPlatformsStatus = async () => {
    try {
      const res = await fetch("/api/auth/ads/status");
      const data = await res.json();
      setAdPlatforms(prev => prev.map(p => ({ ...p, connected: !!data[p.id] })));
    } catch (error) {
      console.error("Failed to check ad platforms status:", error);
    }
  };

  const handleConnectPlatform = async (platformId: string) => {
    try {
      const res = await fetch(`/api/auth/ads/${platformId}/url`);
      const { url } = await res.json();
      window.open(url, `${platformId}_auth`, 'width=600,height=700');
    } catch (error) {
      console.error(`Failed to get auth URL for ${platformId}:`, error);
      setStatus({ type: 'error', message: `Failed to connect to ${platformId.replace('_', ' ')}` });
    }
  };

  const handleDisconnectPlatform = async (platformId: string) => {
    try {
      const res = await fetch(`/api/auth/ads/${platformId}/logout`, { method: 'POST' });
      if (res.ok) {
        setAdPlatforms(prev => prev.map(p => p.id === platformId ? { ...p, connected: false } : p));
        setStatus({ type: 'success', message: `${platformId.replace('_', ' ')} disconnected.` });
      }
    } catch (error) {
      console.error(`Failed to disconnect ${platformId}:`, error);
    }
  };

  const handleAdAgentAction = async () => {
    if (!activeIdea || !adPrompt) return;
    setIsLoading(true);
    setResult("");
    setAdCampaign(null);
    setStatus(null);
    try {
      const campaign = await generateAdCampaign(adPrompt, activeIdea);
      setAdCampaign(campaign);
      setResult(JSON.stringify(campaign, null, 2));
    } catch (error) {
      console.error("Ad Agent action failed:", error);
      setStatus({ type: 'error', message: "Failed to generate ad campaign. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchCampaign = async () => {
    if (!adCampaign) return;
    
    const connectedPlatforms = adPlatforms.filter(p => p.connected);
    if (connectedPlatforms.length === 0) {
      setStatus({ type: 'error', message: "Please connect at least one ad platform before launching." });
      return;
    }

    setIsLoading(true);
    setStatus({ type: 'info', message: `Launching campaign on ${connectedPlatforms.map(p => p.name).join(', ')}...` });
    try {
      // Mocking API calls to Google/Meta/TikTok
      await new Promise(resolve => setTimeout(resolve, 3000));
      setStatus({ type: 'success', message: "Campaign Launched! Monitoring performance..." });
      
      // Save to local storage for Dashboard sync
      const existingCampaigns = JSON.parse(localStorage.getItem('ad_campaigns') || '[]');
      const newCampaign = {
        ...adCampaign,
        id: Math.random().toString(36).substr(2, 9),
        ideaId: activeIdea.id,
        status: 'Active',
        spend: '$0.00',
        roi: '0.0x',
        conversions: 0,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('ad_campaigns', JSON.stringify([...existingCampaigns, newCampaign]));
      
    } catch (error) {
      console.error("Failed to launch campaign:", error);
      setStatus({ type: 'error', message: "Failed to launch campaign. Please check platform connections." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoAgentAction = async () => {
    if (!activeIdea || !logoPrompt) return;
    setIsLoading(true);
    setResult("");
    setLogoConcepts([]);
    setStatus(null);
    try {
      setStatus({ type: 'info', message: "Designing logo concepts with Canva..." });
      const concepts = await generateLogoConcepts(logoPrompt, activeIdea);
      setLogoConcepts(concepts);
      setResult(JSON.stringify(concepts, null, 2));
      setStatus({ type: 'success', message: "Logo concepts generated successfully!" });
    } catch (error) {
      console.error("Logo Agent action failed:", error);
      setStatus({ type: 'error', message: "Failed to generate logo concepts. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const checkCanvaStatus = async () => {
    try {
      const res = await fetch("/api/auth/ads/status"); // Reusing the status endpoint
      const data = await res.json();
      setIsCanvaConnected(!!data.canva);
    } catch (error) {
      console.error("Failed to check Canva status:", error);
    }
  };

  const handleConnectCanva = async () => {
    try {
      const res = await fetch("/api/auth/ads/canva/url");
      const { url } = await res.json();
      window.open(url, 'canva_auth', 'width=600,height=700');
    } catch (error) {
      console.error("Failed to get Canva auth URL:", error);
    }
  };

  const checkGmailStatus = async () => {
    try {
      const res = await fetch("/api/auth/google/status");
      const data = await res.json();
      setIsGmailConnected(data.connected);
    } catch (error) {
      console.error("Failed to check Gmail status:", error);
    }
  };

  const handleConnectGmail = async () => {
    try {
      const res = await fetch("/api/auth/google/url");
      const { url } = await res.json();
      window.open(url, 'gmail_auth', 'width=600,height=700');
    } catch (error) {
      console.error("Failed to get auth URL:", error);
    }
  };

  const handleAgentAction = async () => {
    if (!activeIdea || !agentPrompt) return;
    setIsLoading(true);
    setResult("");
    setEmailIntent(null);
    setStatus(null);
    try {
      const intent = await generateEmailIntent(agentPrompt, activeIdea);
      setEmailIntent(intent);
      setResult(intent.body);
      
      if (!reviewEnabled) {
        await handleCreateDraft(intent);
      }
    } catch (error) {
      console.error("Agent action failed:", error);
      setStatus({ type: 'error', message: "Failed to process your request. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDraft = async (intentOverride?: EmailIntent) => {
    const intent = intentOverride || emailIntent;
    if (!intent) return;
    setIsLoading(true);
    setStatus({ type: 'info', message: "Creating Gmail drafts..." });
    try {
      if (intent.isSequence && intent.sequenceSteps) {
        const res = await fetch("/api/gmail/sequence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: intent.recipient,
            steps: intent.sequenceSteps
          })
        });
        const data = await res.json();
        if (data.success) {
          setStatus({ type: 'success', message: "Drafts created & Emails scheduled (Ready to send)" });
          setResult(`Sequence created in Gmail!\n\n${data.message}\n\nRecipient: ${intent.recipient}\n\nSteps:\n${intent.sequenceSteps.map(s => `- Day ${s.day}: ${s.subject} (${s.purpose})`).join("\n")}`);
        } else {
          throw new Error(data.error);
        }
      } else {
        const res = await fetch("/api/gmail/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: intent.recipient,
            subject: intent.subject,
            body: intent.body
          })
        });
        const data = await res.json();
        if (data.success) {
          setStatus({ type: 'success', message: "Draft created & Email scheduled (Ready to send)" });
          setResult(`Draft created in Gmail!\n\nRecipient: ${intent.recipient}\nSubject: ${intent.subject}\n\n${intent.body}`);
        } else {
          throw new Error(data.error);
        }
      }
    } catch (error) {
      console.error("Failed to create draft:", error);
      setStatus({ type: 'error', message: "Failed to create Gmail draft. Please check your connection." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!activeIdea) return;
    setIsLoading(true);
    setResult("");
    try {
      const tool = TOOLS.find(t => t.id === activeTool);
      if (!tool) return;

      const prompt = tool.prompt
        .replace("{name}", activeIdea.title)
        .replace(/{description}/g, activeIdea.description)
        .replace("{problem}", activeIdea.problem)
        .replace("{features}", activeIdea.mvpFeatures.join(", "));

      const response = await generateText(prompt);
      setResult(response || "Failed to generate content.");
    } catch (error) {
      console.error("Tool generation failed:", error);
      setResult("An error occurred during generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Forge Tools</h2>
        <p className="text-neutral-500 mt-1">AI-powered assets to accelerate your launch.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                if (tool.id === "landing") {
                  onLayerChange("landing");
                } else {
                  setActiveTool(tool.id);
                  setResult("");
                }
              }}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                activeTool === tool.id 
                  ? "bg-white border-neutral-900 shadow-xl ring-1 ring-neutral-900" 
                  : "bg-white border-neutral-100 hover:border-neutral-300 shadow-sm"
              )}
            >
              <div className={cn("p-2 rounded-lg bg-neutral-50", activeTool === tool.id && "bg-neutral-900")}>
                <tool.icon className={cn("w-5 h-5", activeTool === tool.id ? "text-white" : tool.color)} />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900">{tool.label}</div>
                <div className="text-[10px] text-neutral-400 font-medium leading-tight mt-0.5">
                  {tool.description}
                </div>
              </div>
            </button>
          ))}

          <div className="bg-neutral-900 p-6 rounded-2xl text-white mt-8">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Active Context</span>
            </div>
            {activeIdea ? (
              <>
                <p className="text-xs text-neutral-400 font-medium mb-1">Current Idea:</p>
                <p className="text-sm font-bold">{activeIdea.title}</p>
              </>
            ) : (
              <p className="text-xs text-neutral-500 italic">No active idea. Execute an idea to begin.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {!activeIdea ? (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-10 h-10 text-neutral-300" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">No Active Context</h3>
              <p className="text-neutral-500 mt-2 max-w-sm">
                You need to execute a startup idea in the **Idea Layer** before you can forge assets.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
              {activeTool === "email" && (
                <div className="p-6 border-b border-neutral-100 bg-indigo-50/30">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", isGmailConnected ? "bg-emerald-500" : "bg-rose-500")} />
                        <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                          Gmail {isGmailConnected ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                      {!isGmailConnected && (
                        <button 
                          onClick={handleConnectGmail}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                        >
                          Connect Gmail
                        </button>
                      )}
                    </div>
                    
                    {isGmailConnected ? (
                      <div className="space-y-3">
                        <div className="flex-1 relative">
                          <input 
                            type="text"
                            value={agentPrompt}
                            onChange={(e) => setAgentPrompt(e.target.value)}
                            placeholder="e.g., Write a cold outreach email to a SaaS founder about my AI product..."
                            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                            onKeyDown={(e) => e.key === 'Enter' && handleAgentAction()}
                          />
                          <button 
                            onClick={handleAgentAction}
                            disabled={isLoading || !agentPrompt}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <div className="flex gap-2">
                            <span className="text-[10px] text-neutral-400 italic">Try: "Create a 3-step follow-up sequence for a lead"</span>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Review before drafting</span>
                            <div 
                              onClick={() => setReviewEnabled(!reviewEnabled)}
                              className={cn(
                                "w-8 h-4 rounded-full relative transition-colors",
                                reviewEnabled ? "bg-indigo-600" : "bg-neutral-200"
                              )}
                            >
                              <div className={cn(
                                "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                                reviewEnabled ? "left-4.5" : "left-0.5"
                              )} />
                            </div>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-dashed border-indigo-200 rounded-2xl p-8 text-center space-y-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                          <Mail className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">Connect your Gmail</h4>
                          <p className="text-xs text-neutral-500 mt-1">Unlock the AI Email Agent to draft and schedule emails directly.</p>
                        </div>
                        <button 
                          onClick={handleConnectGmail}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          Connect Google Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTool === "logo" && (
                <div className="p-6 border-b border-neutral-100 bg-amber-50/30">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                          Canva Integration {isCanvaConnected ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                      {!isCanvaConnected && (
                        <button 
                          onClick={handleConnectCanva}
                          className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                        >
                          Connect Canva
                        </button>
                      )}
                    </div>

                    {isCanvaConnected ? (
                      <div className="space-y-3">
                        <div className="flex-1 relative">
                          <input 
                            type="text"
                            value={logoPrompt}
                            onChange={(e) => setLogoPrompt(e.target.value)}
                            placeholder="e.g., Minimalist AI logo with blue and silver accents..."
                            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                            onKeyDown={(e) => e.key === 'Enter' && handleLogoAgentAction()}
                          />
                          <button 
                            onClick={handleLogoAgentAction}
                            disabled={isLoading || !logoPrompt}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <div className="flex gap-2">
                            <span className="text-[10px] text-neutral-400 italic">Try: "Modern fintech brand with luxury feel"</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-dashed border-amber-200 rounded-2xl p-8 text-center space-y-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                          <Palette className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">Connect Canva</h4>
                          <p className="text-xs text-neutral-500 mt-1">Generate and customize logos directly inside the platform.</p>
                        </div>
                        <button 
                          onClick={handleConnectCanva}
                          className="px-6 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          Connect Canva Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTool === "adcopy" && (
                <div className="p-6 border-b border-neutral-100 bg-amber-50/30">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                          Ad Platform Connections
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {adPlatforms.map((platform) => (
                        <div key={platform.id} className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={cn("p-1.5 rounded-lg", platform.connected ? "bg-emerald-50" : "bg-neutral-50")}>
                                <platform.icon className={cn("w-4 h-4", platform.connected ? "text-emerald-600" : "text-neutral-400")} />
                              </div>
                              <span className="text-sm font-bold text-neutral-900">{platform.name}</span>
                            </div>
                            <div className={cn("w-2 h-2 rounded-full", platform.connected ? "bg-emerald-500" : "bg-neutral-300")} />
                          </div>
                          
                          {platform.connected ? (
                            <button 
                              onClick={() => handleDisconnectPlatform(platform.id)}
                              className="w-full py-2 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors uppercase tracking-widest"
                            >
                              Disconnect
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleConnectPlatform(platform.id)}
                              className="w-full py-2 text-[10px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors uppercase tracking-widest"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {adPlatforms.some(p => p.connected) ? (
                      <div className="space-y-3">
                        <div className="flex-1 relative">
                          <input 
                            type="text"
                            value={adPrompt}
                            onChange={(e) => setAdPrompt(e.target.value)}
                            placeholder="e.g., Run a lead generation campaign for my AI SaaS targeting startup founders..."
                            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                            onKeyDown={(e) => e.key === 'Enter' && handleAdAgentAction()}
                          />
                          <button 
                            onClick={handleAdAgentAction}
                            disabled={isLoading || !adPrompt}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <div className="flex gap-2">
                            <span className="text-[10px] text-neutral-400 italic">Try: "Create and launch Instagram + Google ads with ₹500/day budget"</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-dashed border-amber-200 rounded-2xl p-8 text-center space-y-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                          <Target className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">No Platforms Connected</h4>
                          <p className="text-xs text-neutral-500 mt-1">Connect at least one ad platform to build and launch campaigns.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-6 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
                    {TOOLS.find(t => t.id === activeTool)?.label} Generator
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {activeTool === "email" && emailIntent && (
                    <button
                      onClick={() => handleCreateDraft()}
                      disabled={isLoading || !isGmailConnected}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4" />
                      Create Draft
                    </button>
                  )}
                  {activeTool === "adcopy" && adCampaign && (
                    <button
                      onClick={handleLaunchCampaign}
                      disabled={isLoading || !adPlatforms.some(p => p.connected)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Target className="w-4 h-4" />
                      Launch Campaign
                    </button>
                  )}
                  <button
                    onClick={activeTool === "adcopy" ? handleAdAgentAction : activeTool === "logo" ? handleLogoAgentAction : handleGenerate}
                    disabled={isLoading || (activeTool === "email" && !isGmailConnected) || (activeTool === "adcopy" && !adPlatforms.some(p => p.connected)) || (activeTool === "logo" && !isCanvaConnected)}
                    className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {activeTool === "email" ? "Generate Sequence" : activeTool === "adcopy" ? "Build Campaign" : activeTool === "logo" ? "Generate with Canva" : "Generate"}
                  </button>
                </div>
              </div>

              {status && (
                <div className={cn(
                  "px-6 py-3 text-xs font-bold flex items-center gap-2",
                  status.type === 'success' ? "bg-emerald-50 text-emerald-700 border-b border-emerald-100" :
                  status.type === 'error' ? "bg-rose-50 text-rose-700 border-b border-rose-100" :
                  "bg-indigo-50 text-indigo-700 border-b border-indigo-100"
                )}>
                  {status.type === 'success' ? <Check className="w-3 h-3" /> : 
                   status.type === 'error' ? <Zap className="w-3 h-3" /> : 
                   <Loader2 className="w-3 h-3 animate-spin" />}
                  {status.message}
                </div>
              )}

              <div className="flex-1 p-8 relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4"
                    >
                      <Sparkles className="w-8 h-8 text-amber-500" />
                    </motion.div>
                    <p className="text-sm font-bold text-neutral-900">Forging your assets...</p>
                    <p className="text-xs text-neutral-400 mt-1">This usually takes 5-10 seconds</p>
                  </div>
                ) : result ? (
                  <div className="prose prose-sm max-w-none">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Generated Output</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopy}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500"
                          title="Copy to clipboard"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500" title="Download as PDF">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {activeTool === "email" && emailIntent && emailIntent.isSequence ? (
                      <div className="space-y-6">
                        {emailIntent.sequenceSteps?.map((step, idx) => (
                          <div key={idx} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Email {idx + 1}: {step.purpose}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400">
                                <CalendarIcon className="w-3 h-3" />
                                {step.scheduledTime}
                              </div>
                            </div>
                            <div className="p-4 space-y-3">
                              <div>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Subject</span>
                                <p className="text-sm font-bold text-neutral-900">{step.subject}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Body</span>
                                <div className="bg-neutral-50 p-4 rounded-xl text-xs text-neutral-700 whitespace-pre-wrap font-mono leading-relaxed border border-neutral-100">
                                  {step.body}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : activeTool === "logo" && logoConcepts.length > 0 ? (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {logoConcepts.map((concept) => (
                            <div key={concept.id} className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                              <div className="aspect-square bg-neutral-50 flex items-center justify-center relative overflow-hidden p-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-center space-y-4 relative z-10">
                                  <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center border border-neutral-100">
                                    <Sparkles className="w-10 h-10 text-amber-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{concept.style}</p>
                                    <p className="text-sm font-bold text-neutral-900 mt-1">{concept.name}</p>
                                  </div>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                  <button className="flex-1 bg-neutral-900 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <PenTool className="w-3 h-3" />
                                    Edit in Canva
                                  </button>
                                </div>
                              </div>
                              <div className="p-6 space-y-4">
                                <div>
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Color Palette</span>
                                  <div className="flex gap-2">
                                    {concept.colorPalette.map((color, i) => (
                                      <div key={i} className="flex flex-col items-center gap-1">
                                        <div 
                                          className="w-8 h-8 rounded-lg shadow-sm border border-neutral-100" 
                                          style={{ backgroundColor: color.hex }}
                                          title={color.name}
                                        />
                                        <span className="text-[8px] font-bold text-neutral-400">{color.hex}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Typography</span>
                                  <div className="space-y-1">
                                    <p className="text-xs font-bold text-neutral-900">{concept.fontPairing.heading}</p>
                                    <p className="text-[10px] text-neutral-500">{concept.fontPairing.body}</p>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Visual Metaphor</span>
                                  <p className="text-xs text-neutral-600 italic leading-relaxed">"{concept.visualMetaphor}"</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-neutral-900 rounded-3xl p-8 text-white">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-500 rounded-xl">
                                <Layout className="w-5 h-5 text-neutral-900" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold">Brand Mockups</h4>
                                <p className="text-xs text-neutral-400">See your new identity in action</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { label: 'Website Hero', icon: Globe },
                              { label: 'Mobile App Icon', icon: Smartphone },
                              { label: 'Social Media Post', icon: Megaphone },
                            ].map((mockup, i) => (
                              <div key={i} className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:bg-neutral-700 transition-all">
                                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <mockup.icon className="w-6 h-6 text-amber-500" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">{mockup.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : activeTool === "adcopy" && adCampaign ? (
                      <div className="space-y-8">
                        {/* Campaign Header & Strategy */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-neutral-900">{adCampaign.strategy.objective}</h3>
                            <p className="text-xs text-neutral-500 mt-1">Campaign ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100 flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              Auto-Optimizing
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Total Spend', value: '$1,240.00', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Conversions', value: '142', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'ROI', value: '3.4x', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { label: 'Leads', value: '385', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
                          ].map((stat, i) => (
                            <div key={i} className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={cn("p-2 rounded-lg", stat.bg)}>
                                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                                </div>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</span>
                              </div>
                              <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Performance Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-indigo-500" />
                                Performance Trend
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                  <ArrowUpRight className="w-3 h-3" /> +12.5%
                                </span>
                              </div>
                            </div>
                            <div className="h-[250px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                  <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                                  <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                  />
                                  <Area type="monotone" dataKey="spend" stroke="#6366f1" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} />
                                  <Area type="monotone" dataKey="conversions" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm">
                            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                              <Filter className="w-4 h-4 text-purple-500" />
                              Conversion Funnel
                            </h4>
                            <div className="h-[200px] w-full relative">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={funnelData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {funnelData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-neutral-900">72%</span>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase">Efficiency</span>
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              {funnelData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase">{item.name}</span>
                                  </div>
                                  <span className="text-xs font-bold text-neutral-900">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Strategy & Assets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <Target className="w-4 h-4 text-amber-500" />
                              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Campaign Strategy</span>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Target Audience</span>
                                <p className="text-xs font-medium text-neutral-700 leading-relaxed">{adCampaign.strategy.targetAudience}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Funnel Strategy</span>
                                <p className="text-xs font-medium text-neutral-700 leading-relaxed">{adCampaign.strategy.funnelStrategy}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {adCampaign.strategy.platforms.map(p => (
                                  <span key={p} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[10px] font-bold flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Ad Creative Assets</span>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {adCampaign.assets.copies.map((copy, idx) => (
                                <div key={idx} className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 group">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{copy.format} Format</span>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="p-1 hover:bg-white rounded transition-colors">
                                        <Copy className="w-3 h-3 text-neutral-400" />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-xs text-neutral-700 leading-relaxed italic">"{copy.text}"</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Platform Breakdown & Lost Leads */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm">
                            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                              <Globe className="w-4 h-4 text-blue-500" />
                              Platform Performance
                            </h4>
                            <div className="h-[250px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                  { name: 'Google', spend: 400, conv: 45 },
                                  { name: 'Meta', spend: 600, conv: 72 },
                                  { name: 'TikTok', spend: 240, conv: 25 },
                                ]}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                                  <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                  />
                                  <Bar dataKey="spend" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                  <Bar dataKey="conv" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm">
                            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                              Lost Leads Analysis
                            </h4>
                            <div className="space-y-4">
                              {[
                                { reason: 'Price Sensitivity', count: 42, color: 'bg-rose-500' },
                                { reason: 'Missing Features', count: 28, color: 'bg-amber-500' },
                                { reason: 'Competitor Choice', count: 15, color: 'bg-blue-500' },
                                { reason: 'Bad Timing', count: 15, color: 'bg-neutral-400' },
                              ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-neutral-500">{item.reason}</span>
                                    <span className="text-neutral-900">{item.count}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.count}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                              <p className="text-[10px] font-bold text-rose-700 uppercase mb-1">AI Insight</p>
                              <p className="text-xs text-rose-600 leading-relaxed">
                                Most leads are dropping off at the "Qualified" stage due to pricing. Consider testing a 'Starter' tier or a limited-time discount.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Optimization & Logs */}
                        <div className="bg-neutral-900 rounded-3xl p-8 text-white">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Zap className="w-5 h-5 text-indigo-400" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold uppercase tracking-widest">AI Optimization Engine</h4>
                                <p className="text-[10px] text-indigo-300 font-medium">Real-time budget reallocation active</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Live</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {[
                              "Paused low-performing creative 'Variation B' (CTR < 0.8%)",
                              "Scaled budget for 'Instagram Stories' by +15% due to high ROI",
                              "Reallocated ₹200 from Google Search to Meta Retargeting",
                              "A/B test 'Headline 3' winning with 4.2% conversion rate"
                            ].map((log, i) => (
                              <div key={i} className="flex items-center gap-3 text-xs text-neutral-400 border-l-2 border-indigo-500/30 pl-4 py-1">
                                <span className="text-[10px] font-mono text-indigo-400">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 text-neutral-800 whitespace-pre-wrap font-mono text-xs leading-relaxed">
                        {result}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-300">
                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                      <Wrench className="w-10 h-10" />
                    </div>
                    <h4 className="text-lg font-bold text-neutral-900">Ready to Forge</h4>
                    <p className="text-sm max-w-xs text-center mt-2">
                      Click the generate button to create custom assets for **{activeIdea.title}**.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
