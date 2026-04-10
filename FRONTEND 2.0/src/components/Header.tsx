import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Settings, CreditCard, LogOut, ChevronDown, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { Layer } from "../types";

interface HeaderProps {
  onLayerChange: (layer: Layer) => void;
}

export function Header({ onLayerChange }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = (user?.name || user?.email || "U")
    .split(/[\s.@]+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Breadcrumb or search could go here */}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-2 hover:bg-neutral-50 rounded-xl transition-all border border-transparent hover:border-neutral-100"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-neutral-900 leading-tight">{user.name || user.email?.split('@')[0] || "User"}</div>
              <div className="text-[10px] text-neutral-400 font-medium">Free Plan</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-neutral-200 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", isDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-neutral-200 shadow-xl p-2 z-50"
              >
                <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Account</div>
                  <div className="text-sm font-bold text-neutral-900 truncate">{user.email}</div>
                </div>

                <button
                  onClick={() => {
                    onLayerChange("profile");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all">
                  <CreditCard className="w-4 h-4" />
                  Billing / Subscription
                </button>
                
                <div className="h-px bg-neutral-100 my-1"></div>
                
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
