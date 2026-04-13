import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { motion, AnimatePresence } from "motion/react"
import { Header } from "@/src/components/landing/header"
import { HeroSection } from "@/src/components/landing/hero-section"
import { StatsSection } from "@/src/components/landing/stats-section"
import { FeaturesSection } from "@/src/components/landing/features-section"
import { HowItWorksSection } from "@/src/components/landing/how-it-works-section"
import { ProductShowcaseSection } from "@/src/components/landing/product-showcase-section"
import { ComparisonSection } from "@/src/components/landing/comparison-section"
import { PsychologySection } from "@/src/components/landing/psychology-section"
import { CTASection } from "@/src/components/landing/cta-section"
import { Footer } from "@/src/components/landing/footer"
import { useSmoothScroll } from "@/src/hooks/use-animations"

export function LandingPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Enable smooth scrolling
  useSmoothScroll()
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-background text-foreground overflow-x-hidden"
        >
          <Header />
          <HeroSection />
          <StatsSection />
          <section id="features">
            <FeaturesSection />
          </section>
          <section id="how-it-works">
            <HowItWorksSection />
          </section>
          <ProductShowcaseSection />
          <ComparisonSection />
          <PsychologySection />
          <CTASection />
          <Footer />
        </motion.main>
      )}
    </AnimatePresence>
  )
}
