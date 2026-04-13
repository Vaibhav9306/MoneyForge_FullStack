"use client"

import { motion } from "motion/react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import { ComponentProps, ReactNode } from "react"

interface ShineButtonProps extends ComponentProps<typeof Button> {
  children: ReactNode
  className?: string
  glowColor?: string
}

export function ShineButton({ 
  children, 
  className,
  glowColor = "rgba(212,175,55,0.4)",
  ...props 
}: ShineButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="relative group"
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{ background: glowColor }}
      />
      
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-gold via-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      
      <Button
        className={cn(
          "relative overflow-hidden",
          "bg-gold hover:bg-gold-light text-primary-foreground font-semibold",
          "shadow-lg shadow-gold/25 hover:shadow-gold/40",
          "transition-all duration-300",
          className
        )}
        {...props}
      >
        {/* Shine effect */}
        <span className="absolute inset-0 overflow-hidden rounded-lg">
          <span 
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
          />
        </span>
        
        {/* Button content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Button>
    </motion.div>
  )
}

// Outline variant with animated gradient border
export function ShineButtonOutline({ 
  children, 
  className,
  ...props 
}: ShineButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="relative group"
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-gold/50 via-gold to-gold/50 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      
      <Button
        variant="outline"
        className={cn(
          "relative overflow-hidden",
          "border-transparent bg-background hover:bg-surface-elevated",
          "transition-all duration-300",
          className
        )}
        {...props}
      >
        {/* Shine effect */}
        <span className="absolute inset-0 overflow-hidden rounded-lg">
          <span 
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)",
            }}
          />
        </span>
        
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Button>
    </motion.div>
  )
}
