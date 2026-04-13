"use client"

import { motion } from "motion/react"
import { 
  Bot, 
  TrendingUp, 
  PieChart, 
  ArrowUpRight, 
  Wallet, 
  Target,
  MessageSquare,
  BarChart3
} from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
}

export function ProductShowcaseSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gold/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6"
            whileHover={{ scale: 1.05, borderColor: "rgba(212,175,55,0.5)" }}
          >
            <span className="text-sm text-gold font-medium">Product Preview</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            A Glimpse Into Your{" "}
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Command Center
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Beautiful interfaces designed to make complex decisions simple.
          </p>
        </motion.div>
        
        {/* Showcase grid - Bento style */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* AI Assistant Card - Large */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 cursor-hover"
          >
            <motion.div
              className="rounded-2xl bg-card border border-border/50 p-6 overflow-hidden h-full"
              whileHover={{ 
                borderColor: "rgba(212,175,55,0.4)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                >
                  <Bot className="w-5 h-5 text-gold" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">Your 24/7 business advisor</p>
                </div>
              </div>
              
              {/* Chat interface mockup */}
              <div className="space-y-4">
                <motion.div 
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-gold" />
                  </div>
                  <motion.div 
                    className="p-4 rounded-2xl bg-surface border border-border/50 max-w-md"
                    whileHover={{ borderColor: "rgba(212,175,55,0.3)" }}
                  >
                    <p className="text-sm text-foreground">Based on your skills in design and your interest in productivity tools, I recommend launching a Notion template business. Here&apos;s why:</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {[
                        "Low startup cost (₹0)",
                        "₹50K-2L monthly potential",
                        "Matches your creative skills"
                      ].map((item, i) => (
                        <motion.li 
                          key={item}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <ArrowUpRight className="w-3 h-3 text-gold" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="flex gap-3 justify-end"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20 max-w-sm">
                    <p className="text-sm text-foreground">How do I get started with this?</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0 text-xs font-medium text-gold">
                    Y
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 p-3 rounded-xl bg-surface border border-border/50"
                  whileHover={{ borderColor: "rgba(212,175,55,0.3)" }}
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Ask MoneyForge AI anything...</span>
                  <motion.div 
                    className="ml-auto w-2 h-4 bg-gold/50"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Financial Insights Card */}
          <motion.div
            variants={itemVariants}
            className="cursor-hover"
          >
            <motion.div
              className="rounded-2xl bg-card border border-border/50 p-6 overflow-hidden h-full"
              whileHover={{ 
                borderColor: "rgba(212,175,55,0.4)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                >
                  <PieChart className="w-5 h-5 text-emerald-400" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">Financial Insights</h3>
                  <p className="text-xs text-muted-foreground">Real-time analytics</p>
                </div>
              </div>
              
              {/* Chart mockup with animation */}
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-2 h-32">
                  {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                    <motion.div 
                      key={i} 
                      className="flex-1 flex flex-col justify-end"
                      initial={{ height: 0 }}
                      whileInView={{ height: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <motion.div 
                        className="w-full bg-gradient-to-t from-gold/60 to-gold rounded-t-sm"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                        whileHover={{ filter: "brightness(1.2)" }}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Wealth Tracker Card */}
          <motion.div
            variants={itemVariants}
            className="cursor-hover"
          >
            <motion.div
              className="rounded-2xl bg-card border border-border/50 p-6 overflow-hidden h-full"
              whileHover={{ 
                borderColor: "rgba(212,175,55,0.4)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                >
                  <Wallet className="w-5 h-5 text-gold" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">Wealth Tracker</h3>
                  <p className="text-xs text-muted-foreground">Net worth monitoring</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-foreground">₹45.2L</p>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +18.2% this year
                  </p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { label: "Stocks", value: "₹22L", width: 48, color: "bg-gold" },
                    { label: "Mutual Funds", value: "₹15L", width: 33, color: "bg-emerald-500" },
                    { label: "Savings", value: "₹8.2L", width: 19, color: "bg-blue-500" }
                  ].map((item, i) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-medium text-foreground">{item.value}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface overflow-hidden">
                        <motion.div 
                          className={`h-full ${item.color} rounded-full`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.width}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Goals Card */}
          <motion.div
            variants={itemVariants}
            className="cursor-hover"
          >
            <motion.div
              className="rounded-2xl bg-card border border-border/50 p-6 overflow-hidden h-full"
              whileHover={{ 
                borderColor: "rgba(212,175,55,0.4)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                >
                  <Target className="w-5 h-5 text-blue-400" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">Goals Progress</h3>
                  <p className="text-xs text-muted-foreground">Track your targets</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: "₹1Cr Net Worth", progress: 45, color: "bg-gold" },
                  { label: "Emergency Fund", progress: 80, color: "bg-emerald-500" },
                  { label: "Investment Portfolio", progress: 65, color: "bg-blue-500" }
                ].map((goal, i) => (
                  <div key={goal.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{goal.label}</span>
                      <span className="font-medium text-foreground">{goal.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface overflow-hidden">
                      <motion.div 
                        className={`h-full ${goal.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${goal.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Revenue Analytics */}
          <motion.div
            variants={itemVariants}
            className="cursor-hover"
          >
            <motion.div
              className="rounded-2xl bg-card border border-border/50 p-6 overflow-hidden h-full"
              whileHover={{ 
                borderColor: "rgba(212,175,55,0.4)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                >
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">Revenue Analytics</h3>
                  <p className="text-xs text-muted-foreground">Business performance</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">₹3.2L</span>
                  <span className="text-sm text-green-400">+24%</span>
                </div>
                <p className="text-sm text-muted-foreground">This month&apos;s revenue</p>
                
                <div className="pt-4 border-t border-border/50 space-y-3">
                  {[
                    { label: "Products Sold", value: "156" },
                    { label: "Avg. Order Value", value: "₹2,051" },
                    { label: "Profit Margin", value: "68%", isGreen: true }
                  ].map((item) => (
                    <motion.div 
                      key={item.label}
                      className="flex justify-between"
                      whileHover={{ x: 3 }}
                    >
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className={`text-sm font-medium ${item.isGreen ? 'text-green-400' : 'text-foreground'}`}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
