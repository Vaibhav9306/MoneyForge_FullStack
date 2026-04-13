

import React, { useState, useCallback, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { motion, AnimatePresence } from "motion/react"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Check,
  X,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/src/lib/utils"

type AuthMode = "login" | "signup"

interface FormData {
  email: string
  password: string
  name: string
  confirmPassword: string
  rememberMe: boolean
}

interface ValidationErrors {
  email?: string
  password?: string
  name?: string
  confirmPassword?: string
}

// Password strength calculation
function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500" }
  if (score <= 4) return { score: 2, label: "Medium", color: "bg-amber-500" }
  return { score: 3, label: "Strong", color: "bg-emerald-500" }
}

// Email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Floating Label Input Component
function FloatingInput({
  id,
  type = "text",
  value,
  onChange,
  label,
  icon: Icon,
  error,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
}: {
  id: string
  type?: string
  value: string
  onChange: (value: string) => void
  label: string
  icon: React.ElementType
  error?: string
  showPasswordToggle?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
}) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0
  const isActive = isFocused || hasValue

  return (
    <div className="relative">
      <div className="relative group">
        {/* Icon */}
        <div
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10",
            isActive ? "text-gold" : "text-muted-foreground",
            error && "text-destructive"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          id={id}
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full h-14 pl-12 pr-12 pt-4 pb-2 bg-secondary/50 dark:bg-secondary/30",
            "border-2 rounded-xl outline-none transition-all duration-300",
            "text-foreground placeholder-transparent",
            "focus:bg-background dark:focus:bg-card",
            error
              ? "border-destructive focus:border-destructive"
              : "border-transparent focus:border-gold/50 hover:border-border",
            "focus:shadow-[0_0_20px_rgba(217,165,32,0.15)]"
          )}
          placeholder={label}
        />

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={cn(
            "absolute left-12 transition-all duration-200 pointer-events-none",
            isActive
              ? "top-2 text-xs font-medium text-gold"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
            error && "text-destructive"
          )}
        >
          {label}
        </label>

        {/* Password Toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="text-sm text-destructive mt-1.5 pl-1 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// Password Strength Indicator
function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = useMemo(() => getPasswordStrength(password), [password])

  if (!password) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-2"
    >
      <div className="flex gap-1.5">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              level <= strength.score ? strength.color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          "text-xs font-medium",
          strength.score === 1 && "text-red-500",
          strength.score === 2 && "text-amber-500",
          strength.score === 3 && "text-emerald-500"
        )}
      >
        Password strength: {strength.label}
      </p>
    </motion.div>
  )
}

// Social Login Button
function SocialButton({
  provider,
  icon,
  onClick,
}: {
  provider: string
  icon: React.ReactNode
  onClick?: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex-1 flex items-center justify-center gap-3 h-12 px-4",
        "bg-secondary/50 dark:bg-secondary/30 hover:bg-secondary",
        "border border-border hover:border-gold/30",
        "rounded-xl transition-all duration-300",
        "hover:shadow-[0_4px_20px_rgba(217,165,32,0.1)]"
      )}
    >
      {icon}
      <span className="text-sm font-medium text-foreground">{provider}</span>
    </motion.button>
  )
}

// Main Auth Page Component
export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup, user, isLoading: isAuthLoading } = useAuth()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate("/dashboard")
    }
  }, [user, isAuthLoading, navigate])

  const initialMode: AuthMode = location.pathname === "/signup" ? "signup" : "login"
  const [serverError, setServerError] = useState("")

  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [shakeError, setShakeError] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const updateField = useCallback(
    (field: keyof FormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setTouched((prev) => ({ ...prev, [field]: true }))
    },
    []
  )

  // Validation
  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (mode === "signup") {
      if (!formData.name) {
        newErrors.name = "Name is required"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, mode])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      setShakeError(true)
      setTimeout(() => setShakeError(false), 500)
      return
    }

    setIsLoading(true)

    setServerError("")

    try {
      if (mode === "login") {
        await login(formData.email, formData.password)
      } else {
        await signup(formData.email, formData.password, formData.name)
      }
      setShowSuccess(true)
      setTimeout(() => {
        navigate("/dashboard")
      }, 1000)
    } catch (error: any) {
      const message = error?.message || error?.response?.data?.msg || "An error occurred. Please try again."
      setServerError(message)
      setShakeError(true)
      setTimeout(() => setShakeError(false), 500)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"))
    setErrors({})
    setServerError("")
    setTouched({})
    setFormData({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
      rememberMe: false,
    })
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Background Gradient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-gold/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-gold/5 via-transparent to-transparent blur-3xl" />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-30 dark:opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3QgZmlsdGVyPSJ1cmwoI2EpIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+PC9zdmc=')]" />
      </div>

      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              MoneyForge
            </span>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            animate={shakeError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={cn(
              "relative backdrop-blur-xl rounded-2xl p-8",
              "bg-card/80 dark:bg-card/60",
              "border border-border/50",
              "shadow-xl shadow-black/5 dark:shadow-black/20"
            )}
          >
            {/* Success Overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-card rounded-2xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-lg font-semibold text-foreground"
                  >
                    {mode === "login"
                      ? "Welcome back!"
                      : "Account created!"}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Tabs */}
            <div className="relative flex bg-secondary/50 dark:bg-secondary/30 p-1 rounded-xl mb-8">
              <motion.div
                className="absolute inset-y-1 w-1/2 bg-card dark:bg-card rounded-lg shadow-sm"
                animate={{ x: mode === "login" ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                type="button"
                onClick={() => mode !== "login" && toggleMode()}
                className={cn(
                  "relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors rounded-lg",
                  mode === "login"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => mode !== "signup" && toggleMode()}
                className={cn(
                  "relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors rounded-lg",
                  mode === "signup"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence>
                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      x: shakeError ? [-10, 10, -10, 10, 0] : 0,
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: shakeError ? 0.5 : 0.3 }}
                    className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2 mb-4"
                  >
                    <X className="w-4 h-4" />
                    {serverError}
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Name Field (Signup only) */}
                  {mode === "signup" && (
                    <FloatingInput
                      id="name"
                      value={formData.name}
                      onChange={(v) => updateField("name", v)}
                      label="Full Name"
                      icon={User}
                      error={touched.name ? errors.name : undefined}
                    />
                  )}

                  {/* Email Field */}
                  <FloatingInput
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(v) => updateField("email", v)}
                    label="Email Address"
                    icon={Mail}
                    error={touched.email ? errors.email : undefined}
                  />

                  {/* Password Field */}
                  <div className="space-y-2">
                    <FloatingInput
                      id="password"
                      value={formData.password}
                      onChange={(v) => updateField("password", v)}
                      label="Password"
                      icon={Lock}
                      error={touched.password ? errors.password : undefined}
                      showPasswordToggle
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword((p) => !p)}
                    />
                    {mode === "signup" && (
                      <PasswordStrengthIndicator password={formData.password} />
                    )}
                  </div>

                  {/* Confirm Password (Signup only) */}
                  {mode === "signup" && (
                    <FloatingInput
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(v) => updateField("confirmPassword", v)}
                      label="Confirm Password"
                      icon={Lock}
                      error={
                        touched.confirmPassword
                          ? errors.confirmPassword
                          : undefined
                      }
                      showPasswordToggle
                      showPassword={showConfirmPassword}
                      onTogglePassword={() =>
                        setShowConfirmPassword((p) => !p)
                      }
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Remember Me & Forgot Password */}
              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) =>
                          updateField("rememberMe", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md border-2 transition-all duration-200",
                          "peer-checked:bg-gold peer-checked:border-gold",
                          "border-border group-hover:border-gold/50"
                        )}
                      />
                      <Check
                        className={cn(
                          "absolute top-0.5 left-0.5 w-4 h-4 text-background transition-opacity",
                          formData.rememberMe ? "opacity-100" : "opacity-0"
                        )}
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-gold hover:text-gold-dark transition-colors font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full h-12 rounded-xl font-semibold text-background",
                  "bg-gradient-to-r from-gold to-gold-dark",
                  "shadow-lg shadow-gold/25",
                  "transition-all duration-300",
                  "hover:shadow-xl hover:shadow-gold/30",
                  "disabled:opacity-70 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Log In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-4 text-sm text-muted-foreground">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="flex gap-4">
                <SocialButton
                  provider="Google"
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  }
                />
                <SocialButton
                  provider="GitHub"
                  icon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  }
                />
              </div>

              {/* Terms & Privacy */}
              {mode === "signup" && (
                <p className="text-center text-xs text-muted-foreground mt-6">
                  By creating an account, you agree to our{" "}
                  <a
                    href="#"
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    Privacy Policy
                  </a>
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Panel - Illustration/Gradient */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-amber-900/30" />

        {/* Animated Circles */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gold-light/20 blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Logo Mark */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-gold-dark mb-8 shadow-2xl shadow-gold/30 shadow-[0_0_80px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-10 h-10 text-foreground" />
            </div>

            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Forge your financial future with AI
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Harness the power of artificial intelligence to make smarter
              financial decisions, track your wealth, and build your legacy.
            </p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap gap-3 justify-center mt-8"
            >
              {["AI-Powered Insights", "Smart Budgeting", "Wealth Tracking"].map(
                (feature, i) => (
                  <span
                    key={feature}
                    className="px-4 py-2 rounded-full bg-white/10 text-black/90 text-sm font-medium backdrop-blur-sm border border-white/20"
                  >
                    {feature}
                  </span>
                )
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
