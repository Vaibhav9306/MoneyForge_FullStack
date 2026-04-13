"use client"

import { motion } from "motion/react"
import { X, Check, Sparkles } from "lucide-react"

const traditionalTools = [
  "Scattered across 10+ apps",
  "No AI guidance",
  "Overwhelmed by options",
  "Manual tracking everywhere",
  "No execution accountability",
  "Learning from scratch"
]

const moneyForge = [
  "One unified platform",
  "AI Co-Founder always guiding you",
  "Curated, actionable insights",
  "Automated tracking & alerts",
  "Built-in discipline system",
  "Learn while you execute"
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
}

export function ComparisonSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
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
            <span className="text-sm text-gold font-medium">Why MoneyForge?</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            The{" "}
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Difference
            </span>
            {" "}is Clear
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Stop juggling fragmented tools. Start building with an integrated AI system.
          </p>
        </motion.div>
        
        {/* Comparison cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional Tools */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="cursor-hover"
          >
            <motion.div
              className="rounded-2xl bg-card/50 border border-border/50 p-8 h-full"
              whileHover={{ 
                borderColor: "rgba(239,68,68,0.3)",
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <X className="w-6 h-6 text-red-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Traditional Tools</h3>
                  <p className="text-sm text-muted-foreground">Fragmented approach</p>
                </div>
              </div>
              
              <motion.ul 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {traditionalTools.map((item) => (
                  <motion.li
                    key={item}
                    variants={itemVariants}
                    className="flex items-center gap-3 group"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0"
                      whileHover={{ scale: 1.2 }}
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </motion.div>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
          
          {/* MoneyForge */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="cursor-hover"
          >
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 p-8 relative overflow-hidden h-full"
              whileHover={{ 
                borderColor: "rgba(212,175,55,0.5)",
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated glow effect */}
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <div className="relative flex items-center gap-3 mb-8">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Sparkles className="w-6 h-6 text-gold" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">MoneyForge</h3>
                  <p className="text-sm text-gold">All-in-one AI system</p>
                </div>
              </div>
              
              <motion.ul 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative space-y-4"
              >
                {moneyForge.map((item) => (
                  <motion.li
                    key={item}
                    variants={itemVariants}
                    className="flex items-center gap-3 group"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Check className="w-3 h-3 text-gold" />
                    </motion.div>
                    <span className="text-foreground font-medium group-hover:text-gold transition-colors">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
