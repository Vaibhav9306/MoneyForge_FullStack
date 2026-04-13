"use client"

import { motion } from "motion/react"
import { Flame, Trophy, Zap, Target, Calendar, Award } from "lucide-react"

const features = [
  {
    icon: Flame,
    title: "Daily Streaks",
    description: "Build unstoppable momentum with daily action tracking"
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description: "Unlock badges as you hit financial milestones"
  },
  {
    icon: Zap,
    title: "Power Moves",
    description: "AI-suggested high-impact actions for rapid growth"
  },
  {
    icon: Target,
    title: "Goal Accountability",
    description: "Public commitments that keep you on track"
  },
  {
    icon: Calendar,
    title: "Weekly Reviews",
    description: "Structured reflection for continuous improvement"
  },
  {
    icon: Award,
    title: "Leaderboards",
    description: "Compete with peers building their empires"
  }
]

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

export function PsychologySection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto">
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
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-4 h-4 text-gold" />
            </motion.div>
            <span className="text-sm text-gold font-medium">Built for Execution</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            We Don&apos;t Just Give Tools.{" "}
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              We Make You Execute.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Psychology-backed systems that turn procrastinators into empire builders through gamification, streaks, and accountability.
          </p>
        </motion.div>
        
        {/* Features grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="cursor-hover"
            >
              <motion.div
                className="group p-6 rounded-2xl bg-card border border-border/50 h-full"
                whileHover={{ 
                  y: -5,
                  borderColor: "rgba(212,175,55,0.4)",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.1)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <feature.icon className="w-6 h-6 text-gold" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <motion.div 
            className="inline-block p-8 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 cursor-hover"
            whileHover={{ 
              scale: 1.02,
              borderColor: "rgba(212,175,55,0.4)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 40px rgba(212,175,55,0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xl sm:text-2xl font-medium text-foreground italic">
              &quot;Discipline beats motivation. Systems beat goals. MoneyForge gives you both.&quot;
            </p>
            <p className="mt-4 text-gold font-medium">— The MoneyForge Philosophy</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
