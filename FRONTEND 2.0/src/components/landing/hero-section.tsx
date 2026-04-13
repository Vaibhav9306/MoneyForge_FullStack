"use client"

import { ArrowRight, Play, Sparkles, TrendingUp, Wallet, Bot } from "lucide-react"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ShineButton, ShineButtonOutline } from "./shine-button"
import { useMouseParallax } from "@/src/hooks/use-animations"

// Stagger animation variants
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function HeroSection() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const mouseParallax = useMouseParallax(15)

  // Scroll-based parallax for background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  const headlineWords = ["From", "Zero", "Knowledge", "to"]

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
      {/* Background gradient effects with parallax */}
      <motion.div
        className="absolute inset-0 bg-background"
        style={{ y: bgY }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          x: mouseParallax.x * 0.5,
          y: mouseParallax.y * 0.5,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          x: mouseParallax.x * -0.3,
          y: mouseParallax.y * -0.3,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl"
        style={{
          x: mouseParallax.x * 0.2,
          y: mouseParallax.y * 0.2,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <motion.div
        className="relative z-10 max-w-7xl mx-auto w-full"
        style={{ opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6 cursor-hover group"
              whileHover={{ scale: 1.05, borderColor: "rgba(212,175,55,0.5)" }}
            >
              <Sparkles className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
              <span className="text-sm text-gold font-medium">AI-Powered Wealth System</span>
            </motion.div>

            {/* Headline with word-by-word animation */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-balance">
              <span className="inline-flex flex-wrap gap-x-3">
                {headlineWords.map((word, i) => (
                  <motion.span
                    key={word}
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-foreground"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
              >
                Global Empire
              </motion.span>
            </h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty"
            >
              Your AI Co-Founder, CFO, CMO & Mentor in your pocket. Build scalable businesses while managing finance, growth, and wealth in one powerful platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <ShineButton size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/signup')}>
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </ShineButton>
              <ShineButtonOutline size="lg" className="h-12 px-8 text-base">
                <Play className="w-5 h-5 mr-2 fill-current" />
                See How It Works
              </ShineButtonOutline>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center gap-4 justify-center lg:justify-start text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="w-8 h-8 rounded-full bg-surface-elevated border-2 border-background flex items-center justify-center text-xs font-medium text-gold"
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                  >
                    {String.fromCharCode(64 + i)}
                  </motion.div>
                ))}
              </div>
              <span>Joined by 10,000+ ambitious entrepreneurs</span>
            </motion.div>
          </motion.div>

          {/* Right side - Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block cursor-hover"
            style={{
              x: mouseParallax.x * 0.5,
              y: mouseParallax.y * 0.5,
            }}
          >
            {/* Main dashboard card */}
            <motion.div
              className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6 shadow-2xl shadow-black/40"
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(212,175,55,0.3)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                  >
                    <Sparkles className="w-5 h-5 text-gold" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-foreground">MoneyForge AI</p>
                    <p className="text-xs text-muted-foreground">Wealth Dashboard</p>
                  </div>
                </div>
                <motion.div
                  className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Live
                  </span>
                </motion.div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div
                  className="p-4 rounded-xl bg-surface border border-border/50 group"
                  whileHover={{
                    y: -2,
                    borderColor: "rgba(212,175,55,0.3)",
                  }}
                >
                  <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">₹12.4L</p>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +23.5% this month
                  </p>
                </motion.div>
                <motion.div
                  className="p-4 rounded-xl bg-surface border border-border/50 group"
                  whileHover={{
                    y: -2,
                    borderColor: "rgba(212,175,55,0.3)",
                  }}
                >
                  <p className="text-xs text-muted-foreground mb-1">Net Worth</p>
                  <p className="text-2xl font-bold text-gold">₹45.2L</p>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +18.2% this year
                  </p>
                </motion.div>
              </div>

              {/* AI Assistant preview */}
              <motion.div
                className="p-4 rounded-xl bg-gold/5 border border-gold/20"
                whileHover={{ borderColor: "rgba(212,175,55,0.4)" }}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center shrink-0"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Bot className="w-4 h-4 text-gold" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-foreground font-medium mb-1">AI Insight</p>
                    <p className="text-xs text-muted-foreground">Based on your cashflow, consider investing ₹50K in mutual funds this month for optimal wealth growth.</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-4">
                {["Launch Product", "Track Expenses", "Grow Revenue"].map((action) => (
                  <motion.div
                    key={action}
                    className="px-3 py-2 rounded-lg bg-surface border border-border/50 text-xs text-muted-foreground cursor-pointer"
                    whileHover={{
                      borderColor: "rgba(212,175,55,0.5)",
                      color: "rgb(212,175,55)",
                      y: -2,
                    }}
                  >
                    {action}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating elements with enhanced animations */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
              className="absolute -top-4 -right-4 p-4 rounded-xl bg-card border border-border/50 shadow-xl backdrop-blur-sm cursor-hover"
              style={{
                x: mouseParallax.x * -0.3,
                y: mouseParallax.y * -0.3,
              }}
            >
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium text-foreground">₹1Cr Goal</span>
              </div>
              <div className="mt-2 w-32 h-2 rounded-full bg-surface overflow-hidden">
                <motion.div
                  className="h-full bg-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">45% achieved</p>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [0, -2, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-6 -left-6 p-3 rounded-xl bg-card border border-border/50 shadow-xl backdrop-blur-sm cursor-hover"
              style={{
                x: mouseParallax.x * 0.3,
                y: mouseParallax.y * 0.3,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-muted-foreground">AI analyzing market...</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Add gradient animation keyframes */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}
