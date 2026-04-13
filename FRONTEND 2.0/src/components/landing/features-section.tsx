"use client"

import { motion } from "motion/react"
import { Lightbulb, Blocks, Wallet, Megaphone, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Lightbulb,
    title: "AI Startup Engine",
    benefit: "Turn your ideas into validated business concepts in minutes",
    phase: "Idea",
    gradient: "from-amber-500/20 to-orange-500/20"
  },
  {
    icon: Blocks,
    title: "No-Code Builder",
    benefit: "Launch your product without writing a single line of code",
    phase: "Execution",
    gradient: "from-gold/20 to-amber-500/20"
  },
  {
    icon: Wallet,
    title: "Smart Cashflow",
    benefit: "Master your finances with AI-powered money management",
    phase: "Finance",
    gradient: "from-emerald-500/20 to-teal-500/20"
  },
  {
    icon: Megaphone,
    title: "Marketing Engine",
    benefit: "Grow your audience with AI-crafted campaigns that convert",
    phase: "Growth",
    gradient: "from-blue-500/20 to-indigo-500/20"
  },
  {
    icon: TrendingUp,
    title: "Wealth Tracker",
    benefit: "Track investments and build generational wealth systematically",
    phase: "Wealth",
    gradient: "from-gold/20 to-yellow-500/20"
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

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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
            <span className="text-sm text-gold font-medium">Complete Ecosystem</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Build Wealth
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Five integrated modules working together to transform you from dreamer to empire builder.
          </p>
        </motion.div>
        
        {/* Features grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`group relative cursor-hover ${index === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <motion.div 
                className="h-full p-6 rounded-2xl bg-card border border-border/50 relative overflow-hidden"
                whileHover={{ 
                  y: -5,
                  borderColor: "rgba(212,175,55,0.4)",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.1)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Phase badge */}
                <div className="flex items-center justify-between mb-4">
                  <motion.span 
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature.phase}
                  </motion.span>
                </div>
                
                {/* Icon with hover animation */}
                <motion.div 
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <feature.icon className="w-7 h-7 text-gold" />
                </motion.div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.benefit}</p>
                
                {/* Hover gradient overlay */}
                <motion.div 
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} pointer-events-none`}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Glowing edge effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl" style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, transparent 50%, rgba(212,175,55,0.05) 100%)",
                  }} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
