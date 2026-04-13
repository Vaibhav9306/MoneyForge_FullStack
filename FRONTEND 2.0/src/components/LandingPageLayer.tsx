import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layout, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  Edit3, 
  Download, 
  Check, 
  X,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Code,
  Zap,
  Star,
  Shield,
  Clock,
  ArrowRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { useIdea } from "../context/IdeaContext";
import { LandingPageContent } from "../types";
import { chatWithAI } from "../services/geminiService";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_CONTENT: LandingPageContent = {
  hero: {
    headline: "Build Your Future with AI",
    subheadline: "The ultimate platform for founders to forge their global empire in 24 hours.",
    cta: "Get Started for Free"
  },
  features: [
    { title: "AI Orchestrator", description: "Let AI handle the heavy lifting of business planning.", icon: "Zap" },
    { title: "Global Scale", description: "Deploy your business to a global audience instantly.", icon: "Globe" },
    { title: "Smart Finance", description: "Real-time tracking of every dollar earned and spent.", icon: "Wallet" }
  ],
  benefits: [
    { title: "Speed to Market", description: "Go from idea to launch in record time." },
    { title: "Cost Efficiency", description: "Save thousands on design and development." }
  ],
  testimonials: [
    { quote: "MoneyForge changed how I launch startups. It's like having a co-founder in my pocket.", author: "Sarah J.", role: "Serial Entrepreneur" }
  ],
  pricing: [
    { plan: "Starter", price: "$0", features: ["1 Active Project", "Basic AI Tools", "Community Support"] },
    { plan: "Pro", price: "$49", features: ["Unlimited Projects", "Advanced AI Agents", "Priority Support"] }
  ],
  footer: {
    headline: "Ready to Forge Your Empire?",
    subheadline: "Join 10,000+ founders building the future.",
    buttonText: "Launch Now"
  }
};

export function LandingPageLayer() {
  const { activeIdea } = useIdea();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm your AI Landing Page Builder. Tell me what kind of landing page you want to create today. You can describe your product, target audience, and any specific sections you'd like to include." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<LandingPageContent>(INITIAL_CONTENT);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"builder" | "preview" | "code">("builder");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chatWithAI(userMessage, { 
        activeIdea, 
        currentContent: content,
        mode: "landing_page_builder" 
      });

      setMessages(prev => [...prev, { role: "assistant", content: result.reply }]);
      if (result.content) {
        setContent(result.content);
      }
    } catch (error) {
      console.error("AI Builder Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I encountered an error while processing your request. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => {
    const SectionWrapper = ({ children, sectionName }: { children: React.ReactNode, sectionName: string }) => (
      <div className="relative group/section">
        {children}
        <div className="absolute top-4 right-4 opacity-0 group-hover/section:opacity-100 transition-all flex gap-2 z-10">
          <button 
            onClick={() => {
              setInput(`Edit the ${sectionName} section: `);
              setActiveTab("builder");
            }}
            className="p-2 bg-white/90 backdrop-blur shadow-lg rounded-lg text-neutral-900 hover:bg-white transition-all"
            title="Edit with AI"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setInput(`Regenerate the ${sectionName} section`);
              handleSend();
            }}
            className="p-2 bg-white/90 backdrop-blur shadow-lg rounded-lg text-neutral-900 hover:bg-white transition-all"
            title="Regenerate"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    return (
      <div className={cn(
        "bg-white shadow-2xl mx-auto transition-all duration-500 overflow-y-auto h-full",
        viewMode === "desktop" ? "w-full" : viewMode === "tablet" ? "w-[768px]" : "w-[375px]"
      )}>
        {/* Hero */}
        <SectionWrapper sectionName="hero">
          <section className="py-20 px-8 text-center bg-gradient-to-b from-neutral-50 to-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-neutral-900 mb-6 tracking-tight"
            >
              {content.hero.headline}
            </motion.h1>
            <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {content.hero.subheadline}
            </p>
            <button className="px-8 py-4 bg-neutral-900 text-white rounded-full font-bold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl active:scale-95">
              {content.hero.cta}
            </button>
          </section>
        </SectionWrapper>

        {/* Features */}
        <SectionWrapper sectionName="features">
          <section className="py-20 px-8 bg-white">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.features.map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl border border-neutral-100 hover:border-neutral-200 transition-all group">
                  <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-neutral-900 transition-all">
                    <Zap className="w-6 h-6 text-neutral-900 group-hover:text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>

        {/* Benefits */}
        <SectionWrapper sectionName="benefits">
          <section className="py-20 px-8 bg-neutral-50">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why Choose Us?</h2>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              {content.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{benefit.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>

        {/* Testimonials */}
        <SectionWrapper sectionName="testimonials">
          <section className="py-20 px-8 bg-white border-y border-neutral-100">
            <div className="max-w-3xl mx-auto text-center italic text-2xl text-neutral-700 font-serif">
              "{content.testimonials[0].quote}"
            </div>
            <div className="mt-8 text-center">
              <p className="font-bold text-neutral-900">{content.testimonials[0].author}</p>
              <p className="text-sm text-neutral-500">{content.testimonials[0].role}</p>
            </div>
          </section>
        </SectionWrapper>

        {/* Pricing */}
        <SectionWrapper sectionName="pricing">
          <section className="py-20 px-8 bg-neutral-50">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.pricing.map((plan, i) => (
                <div key={i} className={cn(
                  "p-10 rounded-3xl border bg-white transition-all",
                  i === 1 ? "border-neutral-900 shadow-2xl scale-105" : "border-neutral-200"
                )}>
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">{plan.plan}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                    <span className="text-neutral-400 text-sm">/month</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-neutral-600">
                        <Check className="w-4 h-4 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={cn(
                    "w-full py-4 rounded-xl font-bold transition-all",
                    i === 1 ? "bg-neutral-900 text-white hover:bg-neutral-800" : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                  )}>
                    Choose {plan.plan}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>

        {/* Footer CTA */}
        <SectionWrapper sectionName="footer">
          <section className="py-24 px-8 bg-neutral-900 text-white text-center">
            <h2 className="text-4xl font-bold mb-6">{content.footer.headline}</h2>
            <p className="text-neutral-400 mb-10 text-lg max-w-xl mx-auto">{content.footer.subheadline}</p>
            <button className="px-10 py-4 bg-white text-neutral-900 rounded-full font-bold hover:bg-neutral-100 transition-all flex items-center gap-2 mx-auto">
              {content.footer.buttonText} <ArrowRight className="w-5 h-5" />
            </button>
          </section>
        </SectionWrapper>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">AI Landing Builder</h2>
          <p className="text-neutral-500 mt-1">Create high-converting landing pages through conversation.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
          <button 
            onClick={() => setActiveTab("builder")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "builder" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Builder
          </button>
          <button 
            onClick={() => setActiveTab("preview")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "preview" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button 
            onClick={() => setActiveTab("code")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "code" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Chat Interface */}
        <div className={cn(
          "flex flex-col bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden transition-all duration-300",
          activeTab === "builder" ? "w-1/3" : "w-0 opacity-0 pointer-events-none"
        )}>
          <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest">AI Designer</span>
            </div>
            <button className="p-2 hover:bg-neutral-200 rounded-lg transition-all">
              <RefreshCw className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex flex-col max-w-[85%]",
                msg.role === "user" ? "ml-auto items-end" : "items-start"
              )}>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === "user" 
                    ? "bg-neutral-900 text-white rounded-tr-none" 
                    : "bg-neutral-50 text-neutral-700 border border-neutral-100 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2 px-1">
                  {msg.role === "user" ? "You" : "MoneyForge AI"}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 text-neutral-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-medium italic">Thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-neutral-50 border-t border-neutral-100">
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                "Generate Full Page",
                "Make it Premium",
                "Add Urgency",
                "Improve Conversion"
              ].map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setInput(action);
                  }}
                  className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[10px] font-bold text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-all uppercase tracking-wider"
                >
                  {action}
                </button>
              ))}
            </div>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe your landing page..."
                className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 pr-12 resize-none h-24"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-3 bottom-3 p-2 bg-neutral-900 text-white rounded-xl disabled:opacity-50 hover:bg-neutral-800 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview / Code View */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-neutral-900 rounded-t-3xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="bg-neutral-800 px-4 py-1.5 rounded-lg text-xs font-mono text-neutral-400 border border-neutral-700">
                preview.moneyforge.app
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-neutral-800 rounded-lg mr-4">
                <button 
                  onClick={() => setViewMode("desktop")}
                  className={cn("p-1.5 rounded-md transition-all", viewMode === "desktop" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-neutral-400")}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode("tablet")}
                  className={cn("p-1.5 rounded-md transition-all", viewMode === "tablet" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-neutral-400")}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode("mobile")}
                  className={cn("p-1.5 rounded-md transition-all", viewMode === "mobile" ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-neutral-400")}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
              <button className="p-2 text-neutral-400 hover:text-white transition-all">
                <Download className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-white text-neutral-900 rounded-xl text-xs font-bold hover:bg-neutral-100 transition-all">
                Publish Page
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-neutral-200 rounded-b-3xl overflow-hidden relative">
            {activeTab === "code" ? (
              <div className="h-full bg-neutral-900 p-8 font-mono text-sm text-emerald-400 overflow-auto">
                <pre>{JSON.stringify(content, null, 2)}</pre>
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                {renderPreview()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
