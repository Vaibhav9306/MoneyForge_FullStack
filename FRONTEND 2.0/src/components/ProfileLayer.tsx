import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Camera, Save, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import api from "../services/api";

export function ProfileLayer() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    
    try {
      const { data } = await api.put("/api/user/profile", { name, email });
      updateUser(data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const initials = (user?.name || user?.email || "U")
    .split(/[\s.@]+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Profile Settings</h2>
        <p className="text-neutral-500 mt-1">Manage your account preferences and security.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-3xl bg-neutral-900 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-neutral-200 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white border border-neutral-200 rounded-xl shadow-lg hover:bg-neutral-50 transition-all">
                <Camera className="w-4 h-4 text-neutral-600" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-neutral-900">{user.name}</h3>
            <p className="text-sm text-neutral-500">{user.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
              <ShieldCheck className="w-3 h-3" />
              Verified Account
            </div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-3xl text-white shadow-xl">
            <h4 className="font-bold mb-2">Security Tip</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Enable two-factor authentication to add an extra layer of security to your MoneyForge account.
            </p>
            <button className="mt-4 text-xs font-bold text-amber-400 hover:underline">Setup 2FA</button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100">
              <h4 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-neutral-400" />
                Change Password
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
              <p className="text-xs text-neutral-500">
                Last updated: {new Date(user.joinedAt).toLocaleDateString()}
              </p>
              <button
                type="submit"
                disabled={isSaving}
                className={cn(
                  "px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2",
                  success 
                    ? "bg-emerald-500 text-white" 
                    : "bg-neutral-900 hover:bg-neutral-800 text-white"
                )}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : success ? (
                  "Changes Saved!"
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
