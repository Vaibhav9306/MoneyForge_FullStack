"use client"

import { motion } from "motion/react"
import { Sparkles, Rocket, Crown } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Sparkles,
    title: "Get AI-Powered Ideas",
    description: "Tell us your interests and skills. Our AI analyzes market opportunities and generates validated business ideas tailored for you."
  },
  {
    number: "02",
    icon: Rocket,
    title: "Launch in 24 Hours",
    description: "Use our no-code tools to build your product, set up payments, and go live. No technical skills required."
  },
  {
    number: "03",
    icon: Crown,
    title: "Scale & Build Wealth",
    description: "Grow your revenue with AI marketing, manage finances smartly, and systematically build your wealth portfolio."
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
}

export function HowItWorksSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
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
            <span className="text-sm text-gold font-medium">Simple Process</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            How{" "}
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              MoneyForge
            </span>
            {" "}Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Three simple steps to transform your ambition into a thriving business empire.
          </p>
        </motion.div>
        
        {/* Steps */}
        <div className="relative">
          {/* Animated connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-transparent via-gold/50 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="relative cursor-hover"
              >
                <motion.div 
                  className="p-8 rounded-2xl bg-card border border-border/50 text-center relative overflow-hidden"
                  whileHover={{ 
                    y: -5,
                    borderColor: "rgba(212,175,55,0.4)",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.1)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step number badge */}
                  <motion.div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gold flex items-center justify-center z-10"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.2, type: "spring", stiffness: 400 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <span className="text-xs font-bold text-primary-foreground">{step.number}</span>
                  </motion.div>
                  
                  {/* Icon with hover animation */}
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6 mt-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <step.icon className="w-8 h-8 text-gold" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  
                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-gold/5 to-transparent" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
