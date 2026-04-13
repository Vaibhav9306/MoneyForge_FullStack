"use client"

import { motion } from "motion/react"
import { Users, Target, TrendingUp } from "lucide-react"
import { useCountUp } from "@/src/hooks/use-animations"

const stats = [
  {
    icon: Users,
    value: 10,
    suffix: "M+",
    label: "Future Entrepreneurs",
    description: "Building their empires"
  },
  {
    icon: Target,
    value: 1,
    prefix: "₹",
    suffix: "Cr",
    label: "Wealth Goal",
    description: "Average user target"
  },
  {
    icon: TrendingUp,
    value: 85,
    suffix: "%",
    label: "Retention Rate",
    description: "Users stay & grow"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
}

function StatCard({ stat, index }: { stat: typeof stats[0], index: number }) {
  const { count, ref } = useCountUp(stat.value, 2)
  
  return (
    <motion.div
      variants={itemVariants}
      className="relative group cursor-hover"
    >
      <motion.div 
        ref={ref}
        className="p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm relative overflow-hidden"
        whileHover={{ 
          y: -5,
          borderColor: "rgba(212,175,55,0.4)",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.1)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Glassmorphism overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        
        {/* Glowing border effect */}
        <motion.div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 50%, rgba(212,175,55,0.05) 100%)",
          }}
        />
        
        {/* Icon */}
        <motion.div 
          className="relative w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <stat.icon className="w-7 h-7 text-gold" />
        </motion.div>
        
        {/* Value with counter animation */}
        <div className="relative mb-2">
          <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            {stat.prefix}{count}{stat.suffix}
          </span>
        </div>
        
        {/* Label */}
        <p className="relative text-lg font-semibold text-foreground mb-1">{stat.label}</p>
        <p className="relative text-sm text-muted-foreground">{stat.description}</p>
        
        {/* Decorative glow element */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gold/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
