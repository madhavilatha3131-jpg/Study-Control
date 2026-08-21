import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, KeyRound, Lock, X, Terminal, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: any) => void;
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser.trim() || !adminPass.trim()) {
      setError("Administrative clearance credentials required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: adminUser.trim(),
          password: adminPass.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      onSuccess(data.token, data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid Administrative Clearance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#050b1d] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col gap-5 z-10 font-mono text-cyan-100"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white orbitron tracking-wider flex items-center gap-2">
                  ADMIN TERMINAL
                  <span className="text-[10px] bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
                    LVL-4
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">Restricted Administrative Authorization</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-cyan-500/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt Message */}
          <div className="bg-[#081229] border border-cyan-500/20 rounded-2xl p-3.5 flex items-start gap-3">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-cyan-200/80 leading-relaxed">
              Enter authorized master operative credentials to unlock full session control, room administration, and elevated network privileges.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-500/10 border border-pink-500/40 text-pink-300 rounded-xl p-3 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-pink-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest pl-1">
                Admin Identifier
              </label>
              <div className="relative flex items-center">
                <Shield className="absolute left-4 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="Enter administrator ID"
                  autoFocus
                  className="w-full bg-[#081229] border border-cyan-500/30 focus:border-cyan-400 py-3.5 pl-11 pr-4 rounded-2xl text-sm text-cyan-100 placeholder:text-zinc-600 transition-all outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest pl-1">
                Master Security Cipher
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-4 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="Enter master password"
                  className="w-full bg-[#081229] border border-cyan-500/30 focus:border-cyan-400 py-3.5 pl-11 pr-4 rounded-2xl text-sm tracking-widest text-cyan-100 placeholder:text-zinc-600 transition-all outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>AUTHENTICATING NODE...</span>
              ) : (
                <>
                  <span>AUTHORIZE & ACCESS ADMIN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-1 border-t border-cyan-500/10">
            <span className="text-[10px] text-zinc-500">SECURE ENCRYPTED NODE // IP VERIFIED</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
