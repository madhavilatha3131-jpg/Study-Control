import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { 
  Users, Trophy, MessageSquare, LogOut, Copy, Check, Play, Square,
  Volume2, ShieldAlert, Wifi, WifiOff, Paperclip, Send, Maximize2,
  Trash2, Award, Clock, HelpCircle, Lock, User as UserIcon, BookOpen, KeyRound, Cpu, X, Upload, ExternalLink, Compass, ChevronRight, FileText, Smartphone,
  Home, RefreshCw, Bell, AlertTriangle, ShieldCheck, CheckSquare, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Participant, Message, RoomConfig, User, StudyMaterial, StudyTask } from "./types";
import StatsModal from "./components/StatsModal";
import ParticipantModal from "./components/ParticipantModal";

// --- MOTIVATIONAL QUOTES ---
export const STUDY_QUOTES = [
  "Consistency is the key secret for success.",
  "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.",
  "Small daily improvements over time lead to stunning results. Stay consistent.",
  "The secret of your future is hidden in your daily routine. Show up every day.",
  "Consistency is what transforms average into excellence.",
  "Great things are not done by impulse, but by a series of small things brought together.",
  "Your focus determines your reality. Keep pushing consistently.",
  "Energy and persistence conquer all things."
];

// --- AUTH CONTEXT & PROVIDER ---
interface AuthContextType {
  user: { id: string; username: string } | null;
  token: string | null;
  login: (token: string, user: { id: string; username: string }) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("study_auth_token");
    const storedUser = localStorage.getItem("study_auth_user");

    const verifyToken = async () => {
      if (storedToken && storedUser) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            setToken(storedToken);
          } else {
            // Token expired or invalid
            localStorage.removeItem("study_auth_token");
            localStorage.removeItem("study_auth_user");
          }
        } catch (e) {
          console.error("Token verification offline", e);
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = (newToken: string, newUser: { id: string; username: string }) => {
    localStorage.setItem("study_auth_token", newToken);
    localStorage.setItem("study_auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setLocation("/session/NEXT_TOPPERS");
  };

  const logout = () => {
    localStorage.removeItem("study_auth_token");
    localStorage.removeItem("study_auth_user");
    setToken(null);
    setUser(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- SECURE ROUTE GUARD ---
function GuardedRoute({ path, component: Component }: { path: string; component: React.ComponentType<any> }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-950 border-t-[#00ffff] rounded-full spin-cw" />
          <span className="space-mono text-xs text-cyan-400 select-none tracking-widest">// DECRYPTION ENGINE LOADING...</span>
        </div>
      </div>
    );
  }

  return user ? <Component /> : null;
}

// --- PAGE 1: LOGIN (/login) ---
function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  // Login variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginPending, setLoginPending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    try {
      setLoginPending(true);
      setLoginError("");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
      } else {
        setLoginError(data.error || "Invalid user credentials");
      }
    } catch (err) {
      setLoginError("Failed to establish authentication tunnel");
    } finally {
      setLoginPending(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-gradient-to-tr from-[#080711] via-[#0e0c1b] to-[#040307] text-white font-sans">
      {/* Vivo style dynamic smooth glass blobs */}
      <div className="absolute top-[15%] left-[20%] w-[380px] h-[380px] rounded-full bg-cyan-500 opacity-10 filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#8c46ff] opacity-10 filter blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-[420px] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-[32px] p-8 shadow-[0_24px_50px_rgba(0,0,0,0.4)] flex flex-col z-10"
      >
        {/* Core Top Title Panel */}
        <div className="flex flex-col items-center justify-center pb-6">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-[#8c46ff] flex items-center justify-center shadow-lg shadow-cyan-500/25 mb-4"
          >
            <Cpu className="w-6 h-6 text-black font-bold" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-center select-none">
            STUDY<span className="text-cyan-400">CTRL</span>
          </h1>
          <p className="text-[11px] text-zinc-500 tracking-wider mt-1 select-none font-medium uppercase">
            // NEXT GENERATION WORKSPACE
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider pl-1 select-none">
              Username
            </label>
            <div className="relative flex items-center">
              <UserIcon className="absolute left-4 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-black/40 border border-white/10 focus:border-cyan-400/60 py-3.5 pl-11 pr-4 rounded-2xl text-sm placeholder:text-zinc-600 transition-all outline-none focus:ring-4 focus:ring-cyan-500/10"
                id="login-username"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider pl-1 select-none">
              Password
            </label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-4 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-black/40 border border-white/10 focus:border-cyan-400/60 py-3.5 pl-11 pr-4 rounded-2xl text-sm tracking-widest placeholder:text-zinc-600 transition-all outline-none focus:ring-4 focus:ring-cyan-500/10"
                id="login-password"
              />
            </div>
          </div>

          <div className="flex justify-end -mt-1 pl-1">
            <Link to="/forgot-password">
              <span className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer select-none">
                Forgot your password?
              </span>
            </Link>
          </div>

          {loginError && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 text-center text-xs text-red-400 font-medium"
            >
              {loginError}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!username || !password || loginPending}
            className="mt-2 text-sm font-semibold py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:opacity-95 shadow-lg shadow-cyan-500/15 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer text-center"
            id="login-submit"
          >
            {loginPending ? "Signing in..." : "Sign In"}
          </motion.button>

          <span className="text-center text-xs text-zinc-500 mt-2 select-none">
            New to StudyCtrl?{" "}
            <Link to="/register">
              <span className="text-[#8c46ff] hover:text-[#9e63ff] font-medium cursor-pointer">
                Register account
              </span>
            </Link>
          </span>

          {/* Elegant Alignment Alert & Quote banner */}
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-2.5 select-none text-left">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 text-amber-400">
              <Bell className="h-3.5 w-3.5 animate-bounce shrink-0" />
              <span className="text-[10px] font-bold tracking-wider uppercase">Study alignment: Daily 6:45 PM (18:45)</span>
            </div>
            <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3 flex gap-2.5 items-start">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-zinc-300 italic">
                "Consistency is the key secret for success. Show up daily and build your future."
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// --- PAGE 2: REGISTER (/register) ---
function RegisterPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regPending, setRegPending] = useState(false);

  const filterUsername = (val: string) => {
    return val.replace(/[^a-zA-Z0-9_]/g, "");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!username || !password || !confirmPassword) {
      setRegError("Username and password are required");
      return;
    }

    if (username.length < 3 || username.length > 20) {
      setRegError("Username must be between 3 and 20 characters");
      return;
    }

    if (password.length < 6) {
      setRegError("Password requires 6+ characters");
      return;
    }

    if (password !== confirmPassword) {
      setRegError("Passwords do not match");
      return;
    }

    try {
      setRegPending(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
      } else {
        setRegError(data.error || "Registry allocation rejected");
      }
    } catch (err) {
      setRegError("Registry communication offline");
    } finally {
      setRegPending(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-gradient-to-tr from-[#080711] via-[#0e0c1b] to-[#040307] text-white font-sans">
      {/* Vivo style dynamic smooth glass blobs */}
      <div className="absolute top-[15%] right-[20%] w-[380px] h-[380px] rounded-full bg-[#8c46ff] opacity-10 filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[15%] left-[20%] w-[400px] h-[400px] rounded-full bg-cyan-500 opacity-10 filter blur-[120px] pointer-events-none" />

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-[440px] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-[32px] p-8 shadow-[0_24px_50px_rgba(0,0,0,0.4)] flex flex-col z-10"
      >
        <div className="flex flex-col items-center justify-center pb-5">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8c46ff] to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/25 mb-4"
          >
            <Users className="w-5 h-5 text-black font-bold" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-center select-none">
            Join STUDY<span className="text-[#8c46ff]">CTRL</span>
          </h1>
          <p className="text-[11px] text-zinc-500 tracking-wider mt-1 select-none font-medium uppercase">
            // configure new focus account
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider pl-1 select-none">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(filterUsername(e.target.value))}
              maxLength={20}
              placeholder="Username Handle"
              className="w-full bg-black/40 border border-white/10 focus:border-[#8c46ff]/60 py-2.5 px-4 rounded-2xl text-sm placeholder:text-zinc-600 transition-all outline-none focus:ring-4 focus:ring-purple-500/10"
              id="reg-username"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider pl-1 select-none">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full bg-black/40 border border-white/10 focus:border-[#8c46ff]/60 py-2.5 px-4 rounded-2xl text-sm placeholder:text-zinc-600 transition-all outline-none focus:ring-4 focus:ring-purple-500/10 tracking-widest"
              id="reg-password"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider pl-1 select-none">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full bg-black/40 border border-white/10 focus:border-[#8c46ff]/60 py-2.5 px-4 rounded-2xl text-sm placeholder:text-zinc-600 transition-all outline-none focus:ring-4 focus:ring-purple-500/10 tracking-widest"
              id="reg-confirmpassword"
            />
          </div>

          {regError && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 text-center text-xs text-red-400 font-medium"
            >
              {regError}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!username || !password || !confirmPassword || regPending}
            className="mt-2 text-sm font-semibold py-3.5 rounded-2xl bg-gradient-to-r from-[#8c46ff] to-[#792cf9] text-white hover:opacity-95 shadow-lg shadow-purple-500/15 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer text-center"
            id="reg-submit"
          >
            {regPending ? "Creating account..." : "Register"}
          </motion.button>

          <span className="text-center text-xs text-zinc-500 mt-1 select-none">
            Already registered?{" "}
            <Link to="/login">
              <span className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer">
                Sign in here
              </span>
            </Link>
          </span>

          {/* Elegant Alignment Alert & Quote banner */}
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-2.5 select-none text-left">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 text-amber-400">
              <Bell className="h-3.5 w-3.5 animate-bounce shrink-0" />
              <span className="text-[10px] font-bold tracking-wider uppercase">Study alignment: Daily 6:45 PM (18:45)</span>
            </div>
            <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3 flex gap-2.5 items-start">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-zinc-300 italic">
                "Small daily improvements over time lead to stunning results. Stay consistent."
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// --- PAGE 2.5: PASSWORD RECOVERY (/forgot-password) ---
function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pending, setPending] = useState(false);
  const [debugCode, setDebugCode] = useState("");

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!username) {
      setErrorMsg("Username is required");
      return;
    }

    try {
      setPending(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || "Code dispatched.");
        if (data.debugCode) {
          setDebugCode(data.debugCode);
        }
        setStep(2);
      } else {
        setErrorMsg(data.error || "Failed to issue code");
      }
    } catch (err) {
      setErrorMsg("Server communication offline");
    } finally {
      setPending(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!code || !newPassword) {
      setErrorMsg("All parameters are required");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password requires 6+ characters");
      return;
    }

    try {
      setPending(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          code: code.trim(),
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || "Password updated successfully!");
        setTimeout(() => {
          setLocation("/login");
        }, 2000);
      } else {
        setErrorMsg(data.error || "Failed to reset password");
      }
    } catch (err) {
      setErrorMsg("Server communication offline");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-gradient-to-tr from-[#080711] via-[#0e0c1b] to-[#040307] text-white font-sans">
      {/* Vivo style dynamic smooth glass blobs */}
      <div className="absolute top-[15%] left-[20%] w-[380px] h-[380px] rounded-full bg-[#8c46ff] opacity-10 filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[20%] w-[400px] h-[400px] rounded-full bg-cyan-500 opacity-10 filter blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-[420px] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-[32px] p-8 shadow-[0_24px_50px_rgba(0,0,0,0.4)] flex flex-col z-10"
      >
        <div className="flex flex-col items-center justify-center pb-5">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8c46ff] to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/25 mb-4"
          >
            <Lock className="w-5 h-5 text-black font-bold" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-center select-none">
            Reset Password
          </h1>
          <p className="text-[11px] text-zinc-500 tracking-wider mt-1 select-none font-medium uppercase">
            // recover studyctrl login
          </p>
        </div>

        {debugCode && (
          <div className="mt-2 mb-4 p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-400">
            <span className="font-bold">// SIMULATOR INBOX NOTICE:</span>
            <p className="mt-1">Verification code sent for {username}:</p>
            <p className="text-sm font-black text-white mt-1.5 bg-black/40 border border-cyan-500/20 px-2 py-1.5 rounded-xl text-center tracking-widest">{debugCode}</p>
          </div>
        )}

        {successMsg && !debugCode && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 text-center font-medium">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center font-medium">
            {errorMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider pl-1 select-none">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="w-full bg-black/40 border border-white/10 focus:border-[#8c46ff]/60 py-2.5 px-4 rounded-2xl text-sm placeholder:text-zinc-600 transition-all outline-none focus:ring-4 focus:ring-purple-500/10"
                id="recover-username"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!username || pending}
              className="mt-1 text-sm font-semibold py-3.5 rounded-2xl bg-gradient-to-r from-[#8c46ff] to-[#792cf9] text-white hover:opacity-95 shadow-lg shadow-purple-500/15 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer text-center"
              id="recover-request-btn"
            >
              {pending ? "Sending Reset Code..." : "Send Reset Code"}
            </motion.button>

            <Link to="/login" className="text-center mt-1">
              <span className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer">
                Back to sign in
              </span>
            </Link>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider pl-1 select-none">
                Username
              </label>
              <input
                type="text"
                value={username}
                disabled
                className="w-full bg-[#121016]/80 border border-white/5 py-2.5 px-4 rounded-2xl text-sm text-white/40 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider pl-1 select-none">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full bg-black/40 border border-white/10 focus:border-[#8c46ff]/60 py-2.5 px-4 rounded-2xl text-sm placeholder:text-zinc-600 transition-all outline-none focus:ring-4 focus:ring-purple-500/10 tracking-widest text-center font-bold"
                id="recover-code"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider pl-1 select-none">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-black/40 border border-white/10 focus:border-[#8c46ff]/60 py-2.5 px-4 rounded-2xl text-sm tracking-widest placeholder:text-zinc-600 transition-all outline-none focus:ring-4 focus:ring-purple-500/10"
                id="recover-newpassword"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!code || !newPassword || pending}
              className="mt-2 text-sm font-semibold py-3.5 rounded-2xl bg-gradient-to-r from-[#8c46ff] to-[#792cf9] text-white hover:opacity-95 shadow-lg shadow-purple-500/15 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer text-center"
              id="recover-submit-btn"
            >
              {pending ? "Confirming..." : "Confirm New Password"}
            </motion.button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setDebugCode("");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-center mt-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer bg-transparent border-none outline-none"
            >
              Request new code
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// --- PAGE 3: LANDING / LOBBY (/) ---
function LobbyPage() {
  const { user, token, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState("");

  useEffect(() => {
    setLocation("/session/NEXT_TOPPERS");
  }, [setLocation]);

  const handleEnterNextToppers = async () => {
    setErrorStr("");
    setLoading(true);
    try {
      setLocation("/session/NEXT_TOPPERS");
    } catch (e) {
      setErrorStr("Failed to engage next toppers session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-tr from-[#080711] via-[#0e0c1b] to-[#040307] text-white font-sans">
      {/* Vivo style dynamic smooth glass blobs */}
      <div className="absolute top-[10%] left-[25%] w-[450px] h-[450px] rounded-full bg-cyan-500 opacity-[0.08] filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[25%] w-[450px] h-[450px] rounded-full bg-[#8c46ff] opacity-[0.08] filter blur-[120px] pointer-events-none" />

      {/* Main Core Title */}
      <div className="flex flex-col items-center text-center mb-8 z-10 select-none">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="w-14 h-14 rounded-[22px] bg-gradient-to-tr from-cyan-400 to-[#8c46ff] flex items-center justify-center shadow-2xl shadow-cyan-500/20 mb-5"
        >
          <Compass className="w-7 h-7 text-black" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          STUDY<span className="text-cyan-400">CTRL</span>
        </h1>
        <p className="text-xs font-semibold uppercase text-zinc-500 tracking-widest mt-2">
          DEEP FOCUS • SHARED PRESENCE • INTUITIVE AGILITY
        </p>
      </div>

      {/* User Badge row */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md flex justify-between items-center bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl py-3 px-5 rounded-2xl mb-4 text-xs select-none z-10 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <button 
            onClick={() => setIsStatsOpen(true)}
            className="text-zinc-300 font-semibold hover:text-cyan-400 transition-colors cursor-pointer text-left focus:outline-none"
          >
            {user?.username} <span className="text-zinc-500 font-normal text-[11px] ml-1">(View Session History)</span>
          </button>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-red-400 font-semibold transition-all cursor-pointer text-[11px] uppercase tracking-wider"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </motion.div>

      {/* Direct Session Access Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-[32px] overflow-hidden z-10 p-8 flex flex-col gap-6 shadow-[0_24px_50px_rgba(0,0,0,0.3)]"
      >
        {/* Core panel header */}
        <div className="flex flex-col gap-1.5 text-center border-b border-white/[0.06] pb-5">
          <span className="text-xl font-bold tracking-tight text-white">
            Next Toppers Space
          </span>
          <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            // LIVE COLLABORATIVE CO-WORKING
          </span>
        </div>

        <div className="flex flex-col gap-3 py-1 items-center justify-center text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Active Co-Working Zone
          </span>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mt-2">
            The study space is open now. Click below to instantly connect with peers, study in sync, and view materials inline.
          </p>
        </div>

        {errorStr && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3.5 text-center text-xs text-red-400 font-medium">
            {errorStr}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEnterNextToppers}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:opacity-95 shadow-lg shadow-cyan-500/20 text-sm font-semibold tracking-wide transition-all text-center block cursor-pointer"
        >
          {loading ? "Connecting Space..." : "Enter Study Space"}
        </motion.button>
      </motion.div>

      {user && token && (
        <StatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          token={token}
          username={user.username}
        />
      )}
    </div>
  );
}

// --- PAGE 4: SESSION ROOM (/session/:code) ---
function SessionRoomPage({ params }: { params: { code: string } }) {
  const code = params.code.toUpperCase();
  const { user, token, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Network WebSocket State
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [roomConfig, setRoomConfig] = useState<RoomConfig | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [activeSecureMaterial, setActiveSecureMaterial] = useState<StudyMaterial | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % STUDY_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeSecureMaterial) {
      setPdfBlobUrl(null);
      return;
    }

    const fileUrl = activeSecureMaterial.url;
    if (fileUrl.startsWith("data:")) {
      try {
        let pureBase64 = fileUrl;
        if (fileUrl.includes(";base64,")) {
          pureBase64 = fileUrl.split(";base64,").pop() || "";
        }
        
        const byteCharacters = atob(pureBase64);
        const byteArrays = [];
        const sliceSize = 1024;
        
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        
        const blob = new Blob(byteArrays, { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);

        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error("Failed to generate PDF blob URL:", err);
        setPdfBlobUrl(null);
      }
    } else {
      setPdfBlobUrl(fileUrl);
    }
  }, [activeSecureMaterial]);
  const [selfId, setSelfId] = useState("");
  const [lostConnection, setLostConnection] = useState(false);
  const [kickedOut, setKickedOut] = useState(false);
  const [replacedOut, setReplacedOut] = useState(false);
  const [criticalError, setCriticalError] = useState("");

  // Network health and latency states
  const [latency, setLatency] = useState<number | null>(null);
  const [showLatencyToast, setShowLatencyToast] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const imgInputRef = useRef<HTMLInputElement | null>(null);

  // Active Timer state (Ticker trigger forces local re-render every 1s)
  const [ticker, setTicker] = useState(0);

  // Sidebar controls
  const [activeTab, setActiveTab] = useState<"presence" | "leaderboard" | "chat" | "materials" | "doubt" | "tasks">("presence");
  const [unreadMsg, setUnreadMsg] = useState(0);

  // Gemini AI Doubt Solver state variables
  const [doubtPrompt, setDoubtPrompt] = useState("");
  const [doubtFile, setDoubtFile] = useState<string | null>(null);
  const [doubtFileName, setDoubtFileName] = useState<string | null>(null);
  const [doubtFileMime, setDoubtFileMime] = useState<string | null>(null);
  const [isAnalyzingDoubt, setIsAnalyzingDoubt] = useState(false);
  const [doubtError, setDoubtError] = useState("");
  const [doubtAnswer, setDoubtAnswer] = useState<string | null>(null);
  const [doubtHistory, setDoubtHistory] = useState<{ q: string; a: string; file?: string | null; fileName?: string | null }[]>([]);

  // Cinematic collaborative stream modal state
  const [isStreamOpen, setIsStreamOpen] = useState(false);
  const [leftView, setLeftView] = useState<"timer" | "stream">("timer");

  // PDF Study Materials custom upload from pc / phone state
  const [pdfUploadTitle, setPdfUploadTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("Mathematics");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [taskStatusFilter, setTaskStatusFilter] = useState<"All" | "Pending" | "Completed">("All");
  const [pdfUploadFileBase64, setPdfUploadFileBase64] = useState<string | null>(null);
  const [pdfUploadFileName, setPdfUploadFileName] = useState<string | null>(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState("");

  // Mobile Simulator State
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [hasUsageAccessPermission, setHasUsageAccessPermission] = useState(() => {
    return localStorage.getItem("studyctrl_usage_access_permission") === "granted";
  });
  const [isSimulatedAppRunning, setIsSimulatedAppRunning] = useState(false); // whether StudyCtrl app is running in the simulated device
  const [simulatedActiveApp, setSimulatedActiveApp] = useState("StudyCtrl"); // "StudyCtrl" | "VS Code" | "Wikipedia" | "YouTube" | "Instagram" | "Discord"
  const [backgroundStudyTime, setBackgroundStudyTime] = useState(0); // accumulated background study seconds in simulator
  const [simulatedAppLogs, setSimulatedAppLogs] = useState<{ id: string; timestamp: string; text: string; type: "info" | "success" | "warn" }[]>([
    { id: "1", timestamp: new Date().toLocaleTimeString(), text: "StudyOS mobile kernel initialized.", type: "info" }
  ]);

  // Stats Modal / Detail Modals
  const [viewStatsId, setViewStatsId] = useState(false);
  const [detailedParticipant, setDetailedParticipant] = useState<Participant | null>(null);
  const [showAllNamesModal, setShowAllNamesModal] = useState(false);

  // Lightbox view for bases64 image uploads
  const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);

  // Pomodoro Timer Engine client-side
  const [pomWork, setPomWork] = useState(25);
  const [pomBreak, setPomBreak] = useState(5);
  const [pomoPhase, setPomoPhase] = useState<"Work" | "Break">("Work");
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState(25 * 60);

  // Connect & Reconnect protocol
  const connect = () => {
    setConnecting(true);
    setLostConnection(false);

    try {
      if (wsRef.current) {
        wsRef.current.close();
      }

      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const socket = new WebSocket(`${wsProtocol}//${window.location.host}/?token=${token}`);
      wsRef.current = socket;

      socket.onopen = () => {
        socket.send(JSON.stringify({ type: "join", token, roomCode: code }));
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === "joined") {
            setSelfId(payload.selfId);
            setRoomConfig(payload.config);
            setParticipants(payload.participants);
            setMessages(payload.messages);
            setMaterials(payload.materials || []);
            setTasks(payload.tasks || []);
            setConnecting(false);
            setIsConnected(true);
            setLostConnection(false);

            // Seed Pomodoro settings from loaded Room configs!
            const work = payload.config.pomodoroWorkMinutes || 25;
            setPomWork(work);
            setPomBreak(payload.config.pomodoroBreakMinutes || 5);
            setPomoSecondsLeft(work * 60);
          }

          else if (payload.type === "participants_update") {
            setParticipants(payload.participants);
            // Sync current detailed participant profile if open
            if (detailedParticipant) {
              const updated = payload.participants.find((p: Participant) => p.id === detailedParticipant.id);
              if (updated) setDetailedParticipant(updated);
            }
          }

          else if (payload.type === "materials_update") {
            setMaterials(payload.materials);
          }

          else if (payload.type === "tasks_update") {
            setTasks(payload.tasks);
          }

          else if (payload.type === "chat_message_received") {
            setMessages((prev) => {
              const next = [...prev, payload.message];
              if (next.length > 150) next.shift();
              return next;
            });
            // Update unread badges
            if (activeTab !== "chat") {
              setUnreadMsg((p) => p + 1);
            }
          }

          else if (payload.type === "pong") {
            const currentLatency = Date.now() - payload.timestamp;
            setLatency(currentLatency);
            if (currentLatency > 1200) {
              setShowLatencyToast(true);
            } else {
              setShowLatencyToast(false);
            }
          };
          
          if (payload.type === "kicked") {
            setKickedOut(true);
            setIsConnected(false);
            socket.close();
          }

          if (payload.type === "replaced") {
            setReplacedOut(true);
            setIsConnected(false);
            socket.close();
          }

          if (payload.type === "error") {
            setCriticalError(payload.message);
            setConnecting(false);
          }
        } catch (e) {
          console.error("WS decode fail", e);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        // Only trigger lost connection overlay if not explicitly kicked out or replaced
        if (!kickedOut && !replacedOut) {
          setLostConnection(true);
        }
      };

      socket.onerror = () => {
        setIsConnected(false);
      };
    } catch (e) {
      setIsConnected(false);
      setLostConnection(true);
    }
  };

  useEffect(() => {
    connect();

    // Secondary local tick emitter to ensure clocks sync smoothly in real-time
    const interval = setInterval(() => {
      setTicker((t) => t + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [code]);

  // Handle network health recurring pings
  useEffect(() => {
    if (!isConnected) {
      setLatency(null);
      setShowLatencyToast(false);
      return;
    }

    const interval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
      }
    }, 4000);

    // Initial ping on join
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
    }

    return () => clearInterval(interval);
  }, [isConnected]);

  // Mobile Simulator: log app switches
  useEffect(() => {
    if (!isSimulatedAppRunning) return;
    
    const timestamp = new Date().toLocaleTimeString();
    let text = "";
    let type: "info" | "success" | "warn" = "info";

    if (simulatedActiveApp === "StudyCtrl") {
      text = "StudyCtrl opened. Foreground mode active.";
      type = "success";
    } else if (simulatedActiveApp === "VS Code") {
      text = "VS Code detected in foreground. Background study tracking engaged.";
      type = "success";
    } else if (simulatedActiveApp === "Wikipedia") {
      text = "Wikipedia opened. Background study tracking active.";
      type = "success";
    } else if (simulatedActiveApp === "YouTube") {
      text = "Distraction detected: YouTube opened. Background study timer paused.";
      type = "warn";
    } else if (simulatedActiveApp === "Instagram") {
      text = "Distraction detected: Instagram opened. Background study timer paused.";
      type = "warn";
    } else if (simulatedActiveApp === "Discord") {
      text = "Communication app Discord opened. Study tracking paused.";
      type = "warn";
    }

    if (text) {
      setSimulatedAppLogs((prev) => [
        { id: Math.random().toString(), timestamp, text, type },
        ...prev.slice(0, 49)
      ]);
    }
  }, [simulatedActiveApp, isSimulatedAppRunning]);

  // Mobile Simulator: study time accumulator tick
  useEffect(() => {
    if (!isSimulatedAppRunning || !hasUsageAccessPermission) return;

    const interval = setInterval(() => {
      const isEducational = ["StudyCtrl", "VS Code", "Wikipedia"].includes(simulatedActiveApp);
      if (isEducational) {
        setBackgroundStudyTime((t) => t + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulatedAppRunning, hasUsageAccessPermission, simulatedActiveApp]);

  // Handle active tab change
  const handleTabSelection = (tab: "presence" | "leaderboard" | "chat" | "materials" | "doubt" | "tasks") => {
    setActiveTab(tab);
    if (tab === "chat") {
      setUnreadMsg(0);
    }
  };

  const handleDoubtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setDoubtError("File size exceeds the 8MB cycle limit");
      return;
    }

    setDoubtFileMime(file.type);
    setDoubtFileName(file.name);
    setDoubtError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setDoubtFile(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSolveDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtPrompt.trim() || isAnalyzingDoubt) return;

    setIsAnalyzingDoubt(true);
    setDoubtError("");
    setDoubtAnswer(null);

    try {
      const res = await fetch("/api/gemini/doubt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: doubtPrompt,
          file: doubtFile ? {
            data: doubtFile,
            mimeType: doubtFileMime,
            name: doubtFileName
          } : null
        })
      });

      const data = await res.json();
      if (res.ok) {
        setDoubtAnswer(data.text);
        setDoubtHistory(prev => [
          ...prev,
          { q: doubtPrompt, a: data.text, file: doubtFile, fileName: doubtFileName }
        ]);
        setDoubtPrompt("");
        setDoubtFile(null);
        setDoubtFileName(null);
        setDoubtFileMime(null);
      } else {
        setDoubtError(data.error || "Doubt Solver matrix connection failed");
      }
    } catch (err) {
      setDoubtError("Doubt Solver communications channel offline.");
    } finally {
      setIsAnalyzingDoubt(false);
    }
  };

  const handlePdfUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setPdfUploadError("Only standard PDF documents are allowed");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setPdfUploadError("Document exceeds the 15MB safe threshold");
      return;
    }

    setPdfUploadFileName(file.name);
    setPdfUploadError("");
    setIsReadingPdf(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setPdfUploadFileBase64(event.target.result);
      } else {
        setPdfUploadError("Failed to parse physical PDF file");
      }
      setIsReadingPdf(false);
    };
    reader.onerror = () => {
      setPdfUploadError("Error reading the specified file");
      setIsReadingPdf(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfUploadTitle.trim()) {
      setPdfUploadError("Please provide a title");
      return;
    }
    if (!pdfUploadFileBase64) {
      setPdfUploadError("Please select a physical PDF file from your device first");
      return;
    }

    handleAddMaterial(pdfUploadTitle.trim(), pdfUploadFileBase64);
    
    // reset form fields
    setPdfUploadTitle("");
    setPdfUploadFileBase64(null);
    setPdfUploadFileName(null);
    setPdfUploadError("");
  };

  // Scroll Chat to bottom when new logs arrive
  useEffect(() => {
    if (activeTab === "chat" && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  // Pomodoro countdown loop
  useEffect(() => {
    let timer: any = null;
    if (pomoRunning && pomoSecondsLeft > 0) {
      timer = setInterval(() => {
        setPomoSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (pomoSecondsLeft === 0 && pomoRunning) {
      // Transition phase, play synth beep!
      playPomoTransBeep();

      if (pomoPhase === "Work") {
        setPomoPhase("Break");
        setPomoSecondsLeft(pomBreak * 60);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const me = participants.find((p) => p.id === selfId);
          if (me && me.isActive) {
            wsRef.current.send(JSON.stringify({ type: "stop_focus" }));
          }
        }
      } else {
        setPomoPhase("Work");
        setPomoSecondsLeft(pomWork * 60);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const me = participants.find((p) => p.id === selfId);
          if (me && !me.isActive) {
            wsRef.current.send(JSON.stringify({ type: "start_focus" }));
          }
        }
      }
    }
    return () => clearInterval(timer);
  }, [pomoSecondsLeft, pomoRunning, pomoPhase, pomWork, pomBreak, participants, selfId]);

  const handleTogglePomo = () => {
    const nextRunning = !pomoRunning;
    setPomoRunning(nextRunning);
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const me = participants.find((p) => p.id === selfId);
      if (me) {
        if (nextRunning && pomoPhase === "Work" && !me.isActive) {
          wsRef.current.send(JSON.stringify({ type: "start_focus" }));
        } else if (!nextRunning && me.isActive) {
          wsRef.current.send(JSON.stringify({ type: "stop_focus" }));
        }
      }
    }
  };

  // Synthesize beep alarm utilizing Web Audio osc interfaces
  const playPomoTransBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Standard concert A hertz tone
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.65);
    } catch (e) {
      console.error(e);
    }
  };

  // Chat message submitter
  const [chatDraft, setChatDraft] = useState("");
  const handleSendDraft = () => {
    if (!chatDraft.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "chat_message", text: chatDraft.trim() }));
    setChatDraft("");
  };

  // Client-side image compress & base64 conversion prior to broadcast
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 400; // Cyber micro resolution for efficient socket pipeline
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.5); // high compression, retro matrix style JPEG
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "chat_message", text: compressedBase64 }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // clear inputs
  };

  // Focus controllers
  const toggleFocusStatus = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const me = participants.find((p) => p.id === selfId);
    if (!me) return;

    if (me.isActive) {
      wsRef.current.send(JSON.stringify({ type: "stop_focus" }));
    } else {
      wsRef.current.send(JSON.stringify({ type: "start_focus" }));
    }
  };

  // Kick user WebSocket dispatcher
  const handleKickParticipant = (targetId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Avoid opening profile modal
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "kick", targetId }));
  };

  const handleUpdateRole = (targetId: string, role: "admin" | "co-host" | "user") => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "update_role", targetId, role }));
  };

  const handleAddMaterial = (title: string, url: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "add_material", title, url }));
  };

  const handleAddTask = (subject: string, description: string, priority: "High" | "Medium" | "Low") => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "add_task", subject, description, priority }));
  };

  const handleDeleteTask = (taskId: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "delete_task", taskId }));
  };

  const handleToggleTask = (taskId: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "toggle_task", taskId }));
  };

  const handleDeleteMaterial = (materialId: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "delete_material", materialId }));
  };

  // Helper timers calculate live local session Focus
  const getLiveFocusTime = (part: Participant) => {
    let secs = part.totalSeconds;
    if (part.isActive && part.focusStartedAt) {
      const elapsed = Math.floor((Date.now() - new Date(part.focusStartedAt).getTime()) / 1000);
      secs += Math.max(0, elapsed);
    }
    return secs;
  };

  const getLiveDailyFocusTime = (part: Participant) => {
    let secs = part.dailySeconds || 0;
    if (part.isActive && part.focusStartedAt) {
      const elapsed = Math.floor((Date.now() - new Date(part.focusStartedAt).getTime()) / 1000);
      secs += Math.max(0, elapsed);
    }
    return secs;
  };

  const formatSecondsToClock = (total: number) => {
    const hh = Math.floor(total / 3600);
    const mm = Math.floor((total % 3600) / 60);
    const ss = total % 60;
    if (hh > 0) {
      return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
    }
    return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  };

  if (kickedOut) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-6 bg-gradient-to-tr from-[#080711] via-[#0e0c1b] to-[#040307] text-white font-sans overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-rose-500 opacity-[0.05] filter blur-[100px] pointer-events-none" />
        <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-[32px] p-8 shadow-2xl text-center z-10">
          <ShieldAlert className="h-12 w-12 text-rose-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-extrabold tracking-tight text-white uppercase">Ejected from Session</h2>
          <p className="text-xs text-zinc-400 mt-3 leading-relaxed max-w-xs mx-auto">
            You were removed from this study space by the host. All live synchronization has been disconnected.
          </p>
          <Link to="/">
            <button className="mt-6 w-full py-3.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.15] text-zinc-100 text-xs font-bold rounded-2xl cursor-pointer transition-all">
              Return to Workspace
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (replacedOut) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-6 bg-gradient-to-tr from-[#080711] via-[#0e0c1b] to-[#040307] text-white font-sans overflow-hidden">
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500 opacity-[0.05] filter blur-[100px] pointer-events-none" />
        <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-[32px] p-8 shadow-2xl text-center z-10">
          <Cpu className="h-12 w-12 text-indigo-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-extrabold tracking-tight text-white uppercase">Multiple Connections</h2>
          <p className="text-xs text-zinc-400 mt-3 leading-relaxed max-w-xs mx-auto">
            A second terminal session has connected using your account credentials, causing this connection to pause.
          </p>
          <button 
            onClick={() => { setReplacedOut(false); connect(); }}
            className="mt-6 w-full py-3.5 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 text-xs font-bold rounded-2xl cursor-pointer transition-all"
          >
            Reconnect Session
          </button>
        </div>
      </div>
    );
  }

  if (connecting) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-[#080711] via-[#0e0c1b] to-[#040307] text-white font-sans overflow-hidden select-none">
        <div className="absolute top-[25%] left-[25%] w-[400px] h-[400px] rounded-full bg-cyan-500 opacity-[0.05] filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[25%] right-[25%] w-[400px] h-[400px] rounded-full bg-indigo-500 opacity-[0.05] filter blur-[120px] pointer-events-none" />
        
        <div className="relative w-16 h-16 flex items-center justify-center mb-6">
          <div className="absolute w-16 h-16 rounded-full border-2 border-white/5 border-t-cyan-400 animate-spin" />
          <div className="absolute w-10 h-10 rounded-full border-2 border-white/5 border-b-indigo-400 animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
        
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
          Connecting to
        </p>
        <p className="text-2xl font-black text-white mt-1 uppercase tracking-wider">
          {code}
        </p>
        {!isConnected && (
          <p className="text-[10px] text-zinc-500 animate-pulse mt-4 font-semibold uppercase tracking-wider">Connecting study channels...</p>
        )}
      </div>
    );
  }

  // Find Self participant object
  const mePart = participants.find((p) => p.id === selfId);
  const myLiveSeconds = mePart ? getLiveFocusTime(mePart) : 0;
  const myRole = mePart?.role || "user";
  const isHost = myRole === "admin";
  const isCoHost = myRole === "co-host";
  const isStaff = isHost || isCoHost;

  // Render sorting for presence: order active first, then passive (descending focus values)
  const sortedParticipants = [...participants].sort((a, b) => {
    const actA = a.isActive && !a.isOffline;
    const actB = b.isActive && !b.isOffline;
    if (actA && !actB) return -1;
    if (!actA && actB) return 1;
    return getLiveFocusTime(b) - getLiveFocusTime(a);
  });

  // Render sorting for leaderboard (entire list ranked live desc focus times)
  const rankedParticipants = [...participants].sort((a, b) => getLiveFocusTime(b) - getLiveFocusTime(a));
  const apexLeaderTime = rankedParticipants.length > 0 ? getLiveFocusTime(rankedParticipants[0]) : 1;

  // Active unread badges helper
  const onlineCount = participants.filter((p) => !p.isOffline).length;
  const activeFocusCount = participants.filter((p) => p.isActive && !p.isOffline).length;

  return (
    <div className="min-h-screen bg-[#07060c] text-zinc-100 flex flex-col relative overflow-hidden font-sans select-none">
      {/* Vivo style dynamic organic blurred glass blobs */}
      <div className="absolute top-[5%] left-[10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 filter blur-[100px] pointer-events-none animate-pulse duration-5000" />
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 filter blur-[120px] pointer-events-none animate-pulse duration-7000" />

      {/* Latency health toast notification */}
      <AnimatePresence>
        {showLatencyToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-16 right-6 z-50 max-w-sm bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 p-4 rounded-2xl flex gap-3 shadow-[0_12px_32px_rgba(245,158,11,0.15)] items-start"
            id="network-health-toast"
          >
            <div className="w-8 h-8 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Unstable Latency Detected</span>
              <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                Your connection to the sync server is slow (<span className="font-mono font-bold text-amber-300">{latency}ms</span>). Chat or timer synchronization might experience slight lag.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <header className="h-[56px] fixed top-0 w-full bg-zinc-950/30 backdrop-blur-3xl border-b border-white/[0.06] flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-4">
          <Link to="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-md">
                <Compass className="h-4 w-4 text-white" />
              </div>
              <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                StudyCtrl
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="bg-white/[0.04] border border-white/[0.08] text-zinc-300 font-mono text-xs px-3 py-1 rounded-full shadow-sm">
              {code}
            </span>
            {isHost && (
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                HOST
              </span>
            )}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4 text-xs font-medium">
          {/* Connection status */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] ${
            isConnected ? "text-emerald-400" : "text-rose-400 animate-pulse"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" : "bg-rose-400 shadow-[0_0_8px_#f43f5e] animate-ping"}`} />
            <span className="text-[10px] uppercase tracking-wider font-semibold">{isConnected ? "Live Channel" : "Connecting..."}</span>
          </div>

          {/* Mobile App Simulator Toggle */}
          <button
            onClick={() => setIsMobileSimulatorOpen(true)}
            className="bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 border border-cyan-500/20 text-cyan-400 text-[11px] font-extrabold py-1.5 px-4 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Open simulated mobile app"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>MOBILE APP</span>
          </button>

          {/* Share button */}
          <button
            onClick={() => {
              const url = `${window.location.origin}/session/${code}`;
              navigator.clipboard.writeText(url).then(() => {
                const btn = document.getElementById("room-copy-badge");
                if (btn) {
                  btn.innerText = "COPIED!";
                  setTimeout(() => {
                    btn.innerText = "SHARE";
                  }, 2000);
                }
              });
            }}
            className="bg-white/[0.05] hover:bg-white/[0.09] active:scale-95 border border-white/[0.08] text-zinc-200 text-[11px] font-bold py-1.5 px-4 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Copy className="h-3.5 w-3.5" />
            <span id="room-copy-badge">SHARE</span>
          </button>

          {/* Log out of session */}
          <button 
            onClick={logout}
            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-300 text-[11px] font-bold py-1.5 px-4 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE PORTAL */}
      <main className="mt-[56px] flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-56px)] min-h-0">
        
        {/* LEFT COMPARTMENT - COLUMN 8 (Bento Space Workspace) */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full overflow-y-auto pr-1 scrollbar-none">
          
          {/* STUDY ALIGNMENT NOTICE & MOTIVATIONAL CAROUSEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
            {/* Notification Widget */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/15 rounded-2xl p-4 flex gap-3.5 items-center shadow-lg backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <Bell className="h-5 w-5 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-400">STUDY ALIGNMENT NOTICE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
                <h4 className="text-xs font-bold text-white mt-0.5">Study starts at 6:45 PM</h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed mt-0.5">
                  Daily sync sessions begin promptly at <strong className="text-zinc-200">18:45 (6:45 PM)</strong>. Prepare your mind & environment.
                </p>
              </div>
            </div>

            {/* Premium Quote Carousel */}
            <div className="bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/15 rounded-2xl p-4 flex gap-3.5 items-center shadow-lg backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full filter blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                <Sparkles className="h-5 w-5 text-cyan-300 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-cyan-400">DAILY CO-WORKING MOTIVATION</span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentQuoteIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-[11px] italic text-zinc-200 mt-1 leading-relaxed line-clamp-2"
                  >
                    "{STUDY_QUOTES[currentQuoteIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* TOP BENTO: POMODORO & STUDY TIMERS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/[0.01] border border-white/[0.04] rounded-[28px] p-6 backdrop-blur-xl shadow-md">
            
            {/* Visual Circular Gauge Section (Left Col) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 border-r border-white/[0.06]">
              <div className="relative w-44 h-44 flex items-center justify-center select-none">
                {/* SVG circular concentric rings */}
                <svg className="w-full h-full -rotate-90">
                  {/* Background Circle track */}
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-white/[0.03]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Foreground progress dash fill */}
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-cyan-400 transition-all duration-1000"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={477.5}
                    strokeDashoffset={
                      477.5 - (((pomoRunning ? (pomoPhase === "Work" ? pomWork * 60 : pomBreak * 60) - pomoSecondsLeft : 0) / (pomoPhase === "Work" ? pomWork * 60 : pomBreak * 60 || 1)) * 477.5)
                    }
                    strokeLinecap="round"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(34, 211, 238, 0.45))"
                    }}
                  />
                </svg>

                {/* Clock value overlay inside circle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-400/80 mb-1">
                    {pomoRunning ? `${pomoPhase}` : mePart?.isActive ? "FOCUSING" : "IDLE"}
                  </span>
                  <span className="font-mono text-3xl font-extrabold text-white tracking-tight tabular-nums">
                    {pomoRunning ? formatSecondsToClock(pomoSecondsLeft) : formatSecondsToClock(myLiveSeconds)}
                  </span>
                  <span className="text-[9px] text-zinc-400/80 mt-1 font-medium">
                    TODAY: {formatSecondsToClock(mePart ? getLiveDailyFocusTime(mePart) : 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timers & Interactive Settings (Right Col) */}
            <div className="md:col-span-7 flex flex-col justify-between gap-4 p-2">
              <div className="flex flex-col gap-1.5">
                <h3 className="font-extrabold text-lg text-white">Focus Space</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Toggle your live study status to track attention duration. Use the Pomodoro control below to structure interval cycles.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Start Focus / Stop Focus Pill */}
                <button
                  onClick={toggleFocusStatus}
                  className={`flex-1 min-w-[150px] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    mePart?.isActive
                      ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10"
                      : "bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-extrabold shadow-cyan-400/10"
                  }`}
                >
                  {mePart?.isActive ? (
                    <>
                      <Square className="h-4 w-4 fill-current" />
                      <span>Stop Focus Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>Start Focus Session</span>
                    </>
                  )}
                </button>

                {/* Stats dialog trigger */}
                <button
                  onClick={() => setViewStatsId(true)}
                  className="px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Stats
                </button>
              </div>

              {/* Pomodoro controls line */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-3.5 flex items-center justify-between gap-4 mt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Pomodoro Timer</span>
                  <span className="text-xs text-zinc-300 font-medium mt-0.5">
                    Interval: <span className="font-semibold text-indigo-400">{pomWork}m</span> • Break: <span className="font-semibold text-emerald-400">{pomBreak}m</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePomo}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                      pomoRunning 
                        ? "border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20" 
                        : "border-indigo-500/40 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                    }`}
                  >
                    {pomoRunning ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                  </button>
                  <button
                    onClick={() => {
                      setPomoRunning(false);
                      setPomoPhase("Work");
                      setPomoSecondsLeft(pomWork * 60);
                    }}
                    className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer"
                    title="Reset Pomodoro"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM BENTO: INTEGRATED DOCUMENT WORKSPACE (Displays PDF inside the page itself) */}
          <div className="flex-1 min-h-[380px] bg-white/[0.01] border border-white/[0.04] rounded-[28px] overflow-hidden flex flex-col relative shadow-md">
            {activeSecureMaterial ? (
              /* PDF Viewer Workspace Integrated directly inside the room pane! */
              <div className="flex-1 flex flex-col h-full bg-zinc-950/40 select-text">
                {/* Navigation Bar inside the PDF widget */}
                <div className="bg-zinc-950/60 border-b border-white/[0.06] px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span className="font-bold text-xs text-white truncate max-w-[200px] md:max-w-md uppercase tracking-wide">
                      {activeSecureMaterial.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 hidden md:inline">
                      • Uploaded by {activeSecureMaterial.uploadedBy}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {pdfBlobUrl && (
                      <a
                        href={pdfBlobUrl}
                        download={`${activeSecureMaterial.title}.pdf`}
                        className="py-1 px-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-200 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                        title="Download Document"
                      >
                        <Upload className="h-3.5 w-3.5 -rotate-180" />
                        <span className="hidden sm:inline">DOWNLOAD</span>
                      </a>
                    )}
                    <button
                      onClick={() => setActiveSecureMaterial(null)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-colors cursor-pointer"
                      title="Back to Document Center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* PDF rendering frame inside the page */}
                <div className="flex-1 relative bg-[#09090f] overflow-hidden flex flex-col items-center justify-center">
                  {pdfBlobUrl ? (
                    <div className="w-full h-full relative">
                      {/* Deep backdrop instructions */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-0">
                        <FileText className="h-10 w-10 text-zinc-600 mb-3" />
                        <p className="text-zinc-500 text-xs">Loading integrated document viewer...</p>
                        <p className="text-[11px] text-zinc-600 max-w-xs mt-1.5">
                          If your browser restrains local frame displays, use the Download bar above to save your files safely.
                        </p>
                      </div>

                      {/* PDF embed element */}
                      <embed
                        src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        type="application/pdf"
                        className="w-full h-full border-none relative z-10"
                        style={{ pointerEvents: "auto" }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-20 text-zinc-500">
                      <div className="w-6 h-6 rounded-full border-2 border-cyan-400/10 border-t-cyan-400 animate-spin" />
                      <span className="text-xs uppercase tracking-wider font-mono">Preparing Secure Frame...</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Standard Study Materials Dashboard */
              <div className="flex-1 p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Workspace</span>
                    <h3 className="font-extrabold text-lg text-white">Document Library</h3>
                  </div>

                  {isStaff && (
                    <span className="text-[10px] font-semibold text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-3 py-1 rounded-full">
                      STAFF PRIVILEGES ACTIVE
                    </span>
                  )}
                </div>

                {/* Staff upload form (collapsible / beautiful) */}
                {isStaff && (
                  <form
                    onSubmit={handlePdfUploadSubmit}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-[20px] p-4 flex flex-col gap-3 mb-4 transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">
                      <Cpu className="h-3.5 w-3.5 animate-pulse" />
                      <span>Upload Reference PDF Document</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={pdfUploadTitle}
                        onChange={(e) => setPdfUploadTitle(e.target.value)}
                        placeholder="Document Title (e.g. Physics Homework)"
                        className="py-2 px-3.5 text-xs bg-black/40 border border-white/[0.06] focus:border-indigo-400/50 rounded-xl focus:outline-none focus:bg-black/60 transition-all text-white placeholder:text-zinc-600"
                      />

                      <div className="flex items-center gap-2">
                        {pdfUploadFileName ? (
                          <div className="flex-1 flex items-center justify-between bg-indigo-500/5 border border-indigo-500/15 px-3 py-1.5 rounded-xl text-zinc-300 text-xs font-mono">
                            <span className="truncate max-w-[150px] uppercase font-bold text-indigo-400">{pdfUploadFileName}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setPdfUploadFileBase64(null);
                                setPdfUploadFileName(null);
                              }}
                              className="text-rose-400 hover:text-rose-300 text-[10px] font-bold cursor-pointer transition-all"
                            >
                              Reset
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById("room-pdf-selector") as HTMLInputElement;
                              if (input) input.click();
                            }}
                            className="flex-1 py-2 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 rounded-xl text-indigo-400 text-xs font-bold uppercase transition-all cursor-pointer text-center"
                          >
                            {isReadingPdf ? "Reading..." : "Select PDF File"}
                          </button>
                        )}
                        <input
                          id="room-pdf-selector"
                          type="file"
                          accept="application/pdf"
                          onChange={handlePdfUploadFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {pdfUploadError && (
                      <div className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-xl text-center">
                        {pdfUploadError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isReadingPdf || !pdfUploadTitle || !pdfUploadFileBase64}
                      className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shadow-sm shadow-indigo-500/10"
                    >
                      Publish to Space
                    </button>
                  </form>
                )}

                {/* Grid list of PDF files */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px] scrollbar-thin">
                  {materials.length === 0 ? (
                    <div className="py-16 text-center text-zinc-500 text-xs italic">
                      No reference materials uploaded yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {materials.map((mat) => (
                        <div
                          key={mat.id}
                          className="flex flex-col justify-between p-4 bg-white/[0.02] border border-white/[0.06] hover:border-cyan-400/20 hover:bg-white/[0.04] rounded-2xl transition-all group shadow-sm"
                        >
                          <div className="flex justify-between items-start gap-2.5">
                            <div className="flex gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
                                <FileText className="h-4.5 w-4.5 text-cyan-400" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-extrabold text-white truncate uppercase tracking-wide">
                                  {mat.title}
                                </h4>
                                <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
                                  by {mat.uploadedBy} • {new Date(mat.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {isStaff && (
                              <button
                                onClick={() => handleDeleteMaterial(mat.id)}
                                className="p-1.5 rounded-lg bg-rose-500/5 border border-rose-500/15 text-rose-400/50 hover:text-rose-400 hover:border-rose-500/35 transition-colors shrink-0 cursor-pointer"
                                title="Delete Document"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.04]">
                            <button
                              onClick={() => setActiveSecureMaterial(mat)}
                              className="flex-1 py-1.5 bg-cyan-400/10 hover:bg-cyan-400 text-cyan-400 hover:text-zinc-950 border border-cyan-400/20 hover:border-cyan-400 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="h-3.5 w-3.5" /> Open PDF Inline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          </div>

        {/* RIGHT SIDEBAR PANEL - COLUMN 4 */}
        <div className="lg:col-span-4 flex flex-col border border-white/[0.06] bg-zinc-950/40 backdrop-blur-3xl rounded-[28px] h-[calc(100vh-7.5rem)] overflow-hidden shadow-2xl">
          
          {/* TAB STRIP */}
          <div className="grid grid-cols-5 bg-zinc-950/40 p-1.5 gap-1 border-b border-white/[0.04]">
            <button
              onClick={() => handleTabSelection("presence")}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "presence" 
                  ? "bg-white/[0.06] text-cyan-400 font-bold shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Users className="h-4 w-4 mb-1" />
              <span>Presence</span>
            </button>
            <button
              onClick={() => handleTabSelection("leaderboard")}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "leaderboard" 
                  ? "bg-white/[0.06] text-cyan-400 font-bold shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Trophy className="h-4 w-4 mb-1" />
              <span>Board</span>
            </button>
            <button
              onClick={() => handleTabSelection("chat")}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center text-[10px] font-extrabold uppercase tracking-wider relative transition-all cursor-pointer ${
                activeTab === "chat" 
                  ? "bg-white/[0.06] text-cyan-400 font-bold shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <MessageSquare className="h-4 w-4 mb-1" />
              <span>Chat</span>
              {unreadMsg > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-cyan-400 text-black text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                  {unreadMsg}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabSelection("materials")}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "materials" 
                  ? "bg-white/[0.06] text-cyan-400 font-bold shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <BookOpen className="h-4 w-4 mb-1" />
              <span>PDFs</span>
            </button>
            <button
              onClick={() => handleTabSelection("tasks")}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center text-[10px] font-extrabold uppercase tracking-wider relative transition-all cursor-pointer ${
                activeTab === "tasks" 
                  ? "bg-white/[0.06] text-cyan-400 font-bold shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <CheckSquare className="h-4 w-4 mb-1" />
              <span>Tasks</span>
              {tasks.filter(t => !t.completedBy?.includes(selfId)).length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-cyan-400 text-black text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                  {tasks.filter(t => !t.completedBy?.includes(selfId)).length}
                </span>
              )}
            </button>
          </div>

          {/* TAB VIEWPORTS */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col min-h-0">
            
            {/* VIEWPORT: PRESENCE LIST */}
            {activeTab === "presence" && (
              <div className="flex flex-col gap-3 flex-grow min-h-0">
                <button
                  onClick={() => setShowAllNamesModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-400/5 hover:bg-cyan-400/10 border border-cyan-400/20 hover:border-cyan-400/40 text-cyan-400 text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-sm"
                >
                  <Users className="h-4 w-4" />
                  <span>View All Users Name</span>
                </button>

                {isHost && (
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-3 flex items-center gap-2 mb-1 select-none text-[10px] text-rose-400 uppercase font-semibold">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>Click eject button to remove a participant</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 mb-1 select-none px-1">
                  <span className="uppercase tracking-wider">ENGAGED ({participants.length})</span>
                  <span className="uppercase tracking-wider text-cyan-400">{activeFocusCount} FOCUSING</span>
                </div>

                <div className="flex flex-col gap-2 flex-1 pb-16 overflow-y-auto">
                  {sortedParticipants.map((part) => {
                    const isMe = part.id === selfId;
                    const isPartAdmin = part.role === "admin";
                    const isPartCoHost = part.role === "co-host";
                    const partLiveSec = getLiveFocusTime(part);
                    const isOffline = part.isOffline;
                    
                    // Initials generator
                    const words = part.username.split(/[\s_.-]+/);
                    const init = words.length >= 2 ? (words[0][0] + words[1][0]) : part.username.substring(0, 2);

                    return (
                      <div 
                        key={part.id}
                        onClick={() => setDetailedParticipant(part)}
                        className={`flex items-center gap-3 group w-full text-left bg-white/[0.01] hover:bg-white/[0.03] rounded-2xl border p-3 cursor-pointer transition-all ${
                          isMe
                            ? "border-cyan-400/20 bg-cyan-400/[0.02]"
                            : part.isActive && !isOffline
                            ? "border-emerald-500/20 bg-emerald-500/[0.01]"
                            : "border-white/[0.04]"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-extrabold uppercase relative ${
                          isMe
                            ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
                            : part.isActive && !isOffline
                            ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                            : "border-white/10 text-zinc-400"
                        }`}>
                          {init.toUpperCase()}
                          {!isOffline && (
                            <span className={`absolute bottom-[-1px] right-[-1px] w-3 h-3 rounded-full border border-zinc-950 ${
                              part.isActive ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"
                            }`} />
                          )}
                          {isOffline && (
                            <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 bg-zinc-600 rounded-full border border-zinc-950" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <span className={`text-xs font-bold truncate flex items-center gap-1.5 ${
                            isMe ? "text-cyan-400" : isOffline ? "text-zinc-500" : "text-zinc-200"
                          }`}>
                            {part.username}
                            {isMe && <span className="text-[8px] text-cyan-400/40 font-normal uppercase font-sans">(me)</span>}
                            {isPartAdmin && <span className="text-amber-400 font-bold text-[9px]">★</span>}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 select-none">
                            {isOffline ? (
                              <span className="text-[8px] font-extrabold text-zinc-500 uppercase tracking-wider bg-zinc-800/50 px-1.5 py-0.5 rounded-md border border-zinc-700/50">OFFLINE</span>
                            ) : part.isActive ? (
                              <span className="text-[8px] font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 animate-pulse">LIVE</span>
                            ) : (
                              <span className="text-[8px] font-extrabold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-1.5 py-0.5 rounded-md border border-cyan-500/20">ONLINE</span>
                            )}
                            {isPartAdmin ? (
                              <span className="text-[8px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md uppercase">ADMIN</span>
                            ) : isPartCoHost ? (
                              <span className="text-[8px] font-extrabold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded-md uppercase font-sans">CO-HOST</span>
                            ) : (
                              <span className="text-[8px] font-medium text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 px-1.5 py-0.5 rounded-md uppercase">STUDENT</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Role Selector dropdown only if I'm Admin and they aren't me */}
                          {myRole === "admin" && !isMe && (
                            <select
                              value={part.role || "user"}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                  e.stopPropagation();
                                  handleUpdateRole(part.id, e.target.value as any);
                              }}
                              className="bg-zinc-900 text-[9px] text-cyan-400 border border-cyan-500/20 hover:border-cyan-400 rounded-xl px-2 py-1 focus:outline-none cursor-pointer"
                            >
                              <option value="user">STUDENT</option>
                              <option value="co-host">CO-HOST</option>
                              <option value="admin">ADMIN</option>
                            </select>
                          )}

                          <span className={`text-xs font-mono font-bold tracking-wide tabular-nums ${
                            part.isActive && !isOffline ? "text-cyan-400" : "text-zinc-500"
                          }`}>
                            {formatSecondsToClock(partLiveSec)}
                          </span>

                          {/* KICK UTILITY BUTTON */}
                          {isHost && !isMe && (
                            <button
                              onClick={(e) => handleKickParticipant(part.id, e)}
                              className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:border-rose-400 transition-colors cursor-pointer"
                              title="EJECT USER"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEWPORT: LEADERBOARD BOARD */}
            {activeTab === "leaderboard" && (
              <div className="flex flex-col gap-3 flex-grow min-h-0 pb-16 overflow-y-auto">
                <span className="text-[10px] text-zinc-500 uppercase block px-1 select-none font-bold tracking-wider">
                  Ranked dynamically by current study elapsed times
                </span>

                {rankedParticipants.map((part, index) => {
                  const isMe = part.id === selfId;
                  const liveSec = getLiveFocusTime(part);
                  const pct = Math.max(2, Math.min(100, Math.ceil((liveSec / apexLeaderTime) * 100)));
                  
                  const isTopMedal = index < 3;
                  const medalColors = [
                    "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]", // Gold
                    "text-zinc-300 drop-shadow-[0_0_8px_rgba(212,212,216,0.2)]", // Silver
                    "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.2)]"  // Bronze
                  ];
                  const medalLabel = ["1st", "2nd", "3rd"];

                  return (
                    <div 
                      key={part.id}
                      onClick={() => setDetailedParticipant(part)}
                      className={`flex flex-col border p-4 rounded-2xl gap-3 cursor-pointer transition-all ${
                        isMe
                          ? "border-cyan-400/20 bg-cyan-400/[0.02]"
                          : "border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-xs font-black w-8 text-center uppercase tracking-wider ${
                            isTopMedal ? medalColors[index] : "text-zinc-600"
                          }`}>
                            {isTopMedal ? medalLabel[index] : `#${index + 1}`}
                          </span>
                          <span className={`text-xs font-bold truncate ${
                            isMe ? "text-cyan-400" : part.isOffline ? "text-zinc-500" : "text-zinc-200"
                          }`}>
                            {part.username} {isMe && "(you)"}
                          </span>
                        </div>
                        <span className={`text-xs font-mono font-bold tabular-nums ${isTopMedal ? medalColors[index] : isMe ? "text-cyan-400" : "text-zinc-400"}`}>
                          {formatSecondsToClock(liveSec)}
                        </span>
                      </div>

                      {/* Glowing custom progress fill bars */}
                      <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            index === 0
                              ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                              : isMe
                              ? "bg-gradient-to-r from-cyan-500 to-cyan-400"
                              : "bg-gradient-to-r from-indigo-500 to-purple-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEWPORT: ROOM CHAT */}
            {activeTab === "chat" && (
              <div className="flex flex-col flex-1 min-h-0 h-full">
                {/* Message display log viewport */}
                <div 
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto space-y-4 pr-1 mb-3 flex flex-col pb-4"
                  style={{ maxHeight: "calc(100vh - 16rem)" }}
                >
                  {messages.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center select-none text-zinc-500 gap-2.5">
                      <MessageSquare className="h-8 w-8 text-zinc-600 opacity-60 stroke-[1.5]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Silence in the Room</span>
                      <p className="text-[10px] text-zinc-500 max-w-[180px] leading-relaxed">
                        No messages transmitted yet. Type a packet below to broadcast!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.userId === selfId;
                      const isImg = msg.text.startsWith("data:image/");
                      const timeStr = new Date(msg.timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      });

                      return (
                        <div 
                          key={msg.id} 
                          className={`flex flex-col max-w-[85%] ${
                            isOwn ? "self-end items-end ml-auto" : "self-start items-start mr-auto"
                          } animate-in fade-in slide-in-from-bottom-2 duration-150`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-zinc-500">
                            <span className={isOwn ? "text-cyan-400" : "text-purple-400"}>
                              {msg.username}
                            </span>
                            <span className="text-[8px] opacity-60 select-none font-sans font-medium">{timeStr}</span>
                          </div>

                          <div className={`p-3 rounded-2xl border text-xs leading-relaxed break-words ${
                            isOwn 
                              ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-100 rounded-tr-sm" 
                              : "bg-white/[0.04] border-white/[0.08] text-zinc-100 rounded-tl-sm"
                          }`}>
                            {isImg ? (
                              <img
                                src={msg.text}
                                alt="Chat Core File"
                                className="max-w-full max-h-48 rounded-xl bg-black/40 object-contain cursor-zoom-in"
                                onClick={() => setViewImageUrl(msg.text)}
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Sender Entry inputs */}
                <div className="border-t border-white/[0.06] pt-3 flex items-center gap-2">
                  <button
                    onClick={() => imgInputRef.current?.click()}
                    className="w-10 h-10 border border-white/[0.06] hover:border-cyan-400 hover:text-cyan-300 text-zinc-400 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-sm"
                    title="Upload image"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <input
                    type="file"
                    ref={imgInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <input
                    type="text"
                    value={chatDraft}
                    onChange={(e) => setChatDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendDraft()}
                    placeholder="Broadcast a message..."
                    className="flex-1 py-2 px-4 bg-white/[0.02] border border-white/[0.06] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white text-xs rounded-xl placeholder:text-zinc-600 transition-all shadow-inner"
                    id="chat-draft-input"
                  />

                  <button
                    onClick={handleSendDraft}
                    disabled={!chatDraft.trim()}
                    className="w-10 h-10 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 rounded-xl flex items-center justify-center transition-all shrink-0 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* VIEWPORT: PDF STUDY MATERIALS */}
            {activeTab === "materials" && (
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 mb-3 select-none px-1">
                  <span className="uppercase tracking-wider font-extrabold text-zinc-400">PDF REPOSITORY ({materials.length})</span>
                  <span className="uppercase tracking-wider text-cyan-400">{myRole} LEVEL</span>
                </div>

                {/* Staff Upload Section */}
                {isStaff ? (
                  <form 
                    onSubmit={handlePdfUploadSubmit}
                    className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3 mb-4 animate-fade-in shadow-inner"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      <Cpu className="h-3.5 w-3.5" />
                      <span>Upload Resource PDF</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={pdfUploadTitle}
                      onChange={(e) => setPdfUploadTitle(e.target.value)}
                      placeholder="Document Title (e.g. Math Notes)"
                      className="w-full py-2 px-3 bg-white/[0.02] border border-white/[0.06] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white text-xs rounded-xl placeholder:text-zinc-600 transition-all"
                    />
                    
                    {/* PC/Phone File input selector */}
                    <div className="flex flex-col gap-1">
                      {pdfUploadFileName ? (
                        <div className="flex items-center justify-between bg-cyan-500/5 border border-cyan-500/10 px-3 py-2 rounded-xl text-zinc-300 text-xs">
                          <span className="truncate max-w-[150px] uppercase font-bold text-cyan-400">{pdfUploadFileName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setPdfUploadFileBase64(null);
                              setPdfUploadFileName(null);
                            }}
                            className="text-rose-400 hover:text-rose-300 uppercase text-[9px] font-black cursor-pointer bg-rose-500/10 hover:bg-rose-500/20 px-2 py-0.5 rounded-lg border border-rose-500/10 transition-all"
                          >
                            REMOVE
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("pdf-file-selector") as HTMLInputElement;
                            if (input) input.click();
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-400/5 hover:bg-cyan-400/10 border border-cyan-400/20 hover:border-cyan-400/30 rounded-xl text-cyan-400 text-xs font-bold uppercase transition-all cursor-pointer text-center"
                        >
                          <Upload className="h-4 w-4" />
                          <span>{isReadingPdf ? "READING FILE..." : "SELECT PDF DOCUMENT"}</span>
                        </button>
                      )}
                      <input
                        id="pdf-file-selector"
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfUploadFileChange}
                        className="hidden"
                      />
                    </div>

                    {pdfUploadError && (
                      <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-2.5 text-center text-xs text-rose-400 uppercase font-semibold">
                        {pdfUploadError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isReadingPdf || !pdfUploadTitle || !pdfUploadFileBase64}
                      className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shadow-md"
                    >
                      UPLOAD DOCUMENT
                    </button>
                    <p className="text-[9px] text-zinc-600 select-none leading-relaxed text-center italic">
                      ONLY STAFF MEMBERS CAN UPLOAD DOCUMENTS.
                    </p>
                  </form>
                ) : (
                  <div className="bg-cyan-400/[0.01] border border-cyan-400/10 rounded-2xl p-4 mb-4 text-center">
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-center gap-2">
                      <BookOpen className="h-4 w-4" /> Study Documents
                    </p>
                    <p className="text-[10px] text-zinc-500 leading-relaxed mt-2 select-none uppercase font-semibold">
                      STUDY REFERENCE MATERIALS AND WORKSHEETS PROVIDED FOR STUDENTS IN THIS ROOM.
                    </p>
                  </div>
                )}

                {/* PDF materials list */}
                <div className="flex-1 overflow-y-auto space-y-2.5 mt-1 pr-1" style={{ maxHeight: "calc(100vh - 19rem)" }}>
                  {materials.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center select-none text-zinc-500 gap-2">
                      <FileText className="h-8 w-8 text-zinc-600 opacity-60 stroke-[1.5]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">No Documents Uploaded</span>
                    </div>
                  ) : (
                    materials.map((mat) => {
                      return (
                        <div 
                          key={mat.id}
                          className="flex flex-col gap-2.5 p-4 bg-white/[0.01] rounded-2xl border border-white/[0.04] hover:border-cyan-400/20 transition-all group"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-zinc-200 truncate uppercase tracking-wide">
                                {mat.title}
                              </h4>
                              <p className="text-[9px] font-bold text-zinc-500 mt-1">
                                FROM: {mat.uploadedBy} • {new Date(mat.uploadedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
                              </p>
                            </div>

                            {isStaff ? (
                              <button
                                onClick={() => handleDeleteMaterial(mat.id)}
                                className="p-1.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors shrink-0 cursor-pointer"
                                title="DELETE DOCUMENT"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-2 mt-1 pt-2 border-t border-white/[0.04]">
                            <button
                              onClick={() => setActiveSecureMaterial(mat)}
                              className="flex-1 py-1.5 bg-cyan-400/5 hover:bg-cyan-400/10 border border-cyan-400/20 hover:border-cyan-400 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="h-3.5 w-3.5" /> OPEN PDF
                            </button>
                            {isStaff && !mat.url.startsWith("data:") && (
                              <a
                                href={mat.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1] text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                                title="Staff direct link access"
                              >
                                DIRECT LINK
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* VIEWPORT: TODAY'S TASKS SUBJECT-WISE */}
            {activeTab === "tasks" && (
              <div className="flex flex-col flex-1 min-h-0 animate-fade-in px-1">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-3 select-none">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Academic Tasks</span>
                    <span className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5 mt-0.5">
                      <CheckSquare className="h-4 w-4 text-cyan-400" />
                      Study Plan ({tasks.length})
                    </span>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-400/5 border border-cyan-400/10 px-2 py-1 rounded-lg">
                    {isStaff ? "Staff Panel Active" : "Student View"}
                  </span>
                </div>

                {/* Progress bar and Motivational Card */}
                {tasks.length > 0 && (() => {
                  const completedCount = tasks.filter(t => t.completedBy?.includes(selfId)).length;
                  const totalCount = tasks.length;
                  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                  
                  let motivator = "No tasks started yet. Ready to learn? 🚀";
                  if (percent > 0 && percent < 50) motivator = "Starting strong! Keep checking them off! 💪";
                  else if (percent >= 50 && percent < 100) motivator = "Over halfway there! Excellent focus! 🔥";
                  else if (percent === 100) motivator = "All tasks completed! Today was incredibly productive! 🎉";

                  return (
                    <div className="bg-gradient-to-br from-zinc-900/80 to-black/40 border border-white/[0.05] rounded-2xl p-4 mb-4 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all duration-500" />
                      <div className="flex justify-between items-center text-xs font-bold mb-2.5 relative z-10">
                        <span className="text-zinc-300 uppercase tracking-wide flex items-center gap-1.5 font-extrabold">
                          <Award className="h-4 w-4 text-cyan-400" />
                          Today's Progress
                        </span>
                        <span className="text-cyan-400 font-mono font-black text-xs">
                          {completedCount} / {totalCount} Completed ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-zinc-950/80 h-3 rounded-full overflow-hidden border border-white/[0.04] p-0.5 relative z-10">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400 font-bold mt-2.5 uppercase tracking-wide italic select-none">
                        {motivator}
                      </p>
                    </div>
                  );
                })()}

                {/* Staff Upload Task Section */}
                {isStaff && (
                  <div className="bg-zinc-950/40 border border-white/[0.06] rounded-2xl p-4.5 flex flex-col gap-3.5 mb-4 shadow-xl">
                    <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-black uppercase tracking-wider border-b border-white/[0.04] pb-2">
                      <Cpu className="h-4 w-4" />
                      <span>Create Subject Study Task</span>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!taskDesc.trim()) return;
                        handleAddTask(taskSubject, taskDesc.trim(), taskPriority);
                        setTaskDesc("");
                      }}
                      className="flex flex-col gap-3.5"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-extrabold text-zinc-500 uppercase block mb-1">Select Subject</label>
                          <select
                            value={taskSubject}
                            onChange={(e) => setTaskSubject(e.target.value)}
                            className="w-full py-2 px-3 bg-zinc-900 border border-white/[0.08] focus:border-cyan-400 outline-none text-white text-xs rounded-xl transition-all cursor-pointer font-bold"
                          >
                            <option value="Mathematics">📐 Mathematics</option>
                            <option value="Physics">⚛️ Physics</option>
                            <option value="Chemistry">🧪 Chemistry</option>
                            <option value="Biology">🧬 Biology</option>
                            <option value="Computer Science">💻 Computer Science</option>
                            <option value="English">📚 English</option>
                            <option value="General Study">🎯 General Study</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] font-extrabold text-zinc-500 uppercase block mb-1">Set Priority</label>
                          <div className="grid grid-cols-3 bg-zinc-900 p-0.5 rounded-xl border border-white/[0.08] h-[34px]">
                            {(["Low", "Medium", "High"] as const).map((p) => {
                              const isActive = taskPriority === p;
                              const colors = {
                                Low: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
                                Medium: "text-amber-400 border-amber-500/20 bg-amber-500/5",
                                High: "text-rose-400 border-rose-500/20 bg-rose-500/5"
                              };
                              return (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => setTaskPriority(p)}
                                  className={`text-[9px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                                    isActive 
                                      ? `${colors[p]} border font-black shadow-[0_0_8px_rgba(255,255,255,0.05)]` 
                                      : "text-zinc-500 hover:text-zinc-300"
                                  }`}
                                >
                                  {p}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold text-zinc-500 uppercase block mb-1">Task Requirements</label>
                        <textarea
                          required
                          rows={2}
                          value={taskDesc}
                          onChange={(e) => setTaskDesc(e.target.value)}
                          placeholder="E.g. Solve exercises 1 to 5 from Section 4.2 of the Physics book."
                          className="w-full py-2.5 px-3 bg-zinc-900 border border-white/[0.06] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white text-xs rounded-xl placeholder:text-zinc-600 transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!taskDesc.trim()}
                        className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shadow-lg active:scale-[0.98]"
                      >
                        PUBLISH TASK FOR TODAY
                      </button>
                    </form>
                  </div>
                )}

                {/* ADVANCED MULTI-FILTERING PANEL */}
                <div className="bg-zinc-950/20 border border-white/[0.04] rounded-2xl p-3 mb-4 space-y-2.5 shadow-inner">
                  {/* Priority Pill Filters */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase tracking-wider text-zinc-500 px-1 select-none">Priority Filters</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(["All", "High", "Medium", "Low"] as const).map((f) => {
                        const count = f === "All" 
                          ? tasks.length 
                          : tasks.filter(t => t.priority === f).length;
                        const isActive = taskPriorityFilter === f;

                        const badgeColors = {
                          All: isActive ? "bg-white/[0.08] text-white border-white/[0.15]" : "text-zinc-400 hover:text-zinc-200 bg-white/[0.01] border-white/[0.04]",
                          High: isActive ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "text-zinc-400 hover:text-zinc-200 bg-rose-500/5 border-rose-500/10",
                          Medium: isActive ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "text-zinc-400 hover:text-zinc-200 bg-amber-500/5 border-amber-500/10",
                          Low: isActive ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "text-zinc-400 hover:text-zinc-200 bg-cyan-500/5 border-cyan-500/10"
                        };

                        return (
                          <button
                            key={f}
                            onClick={() => setTaskPriorityFilter(f)}
                            className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${badgeColors[f]}`}
                          >
                            {f === "High" && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                            {f === "Medium" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                            {f === "Low" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />}
                            <span>{f}</span>
                            <span className="opacity-60 text-[8px] px-1 bg-black/40 rounded">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Segment Filters */}
                  <div className="flex flex-col gap-1 pt-1.5 border-t border-white/[0.03]">
                    <span className="text-[8px] font-black uppercase tracking-wider text-zinc-500 px-1 select-none">Status Filter</span>
                    <div className="grid grid-cols-3 bg-zinc-900/60 p-0.5 rounded-xl border border-white/[0.04]">
                      {(["All", "Pending", "Completed"] as const).map((s) => {
                        const isActive = taskStatusFilter === s;
                        const count = s === "All" 
                          ? tasks.length 
                          : s === "Pending" 
                            ? tasks.filter(t => !t.completedBy?.includes(selfId)).length
                            : tasks.filter(t => t.completedBy?.includes(selfId)).length;

                        return (
                          <button
                            key={s}
                            onClick={() => setTaskStatusFilter(s)}
                            className={`py-1 text-[9px] font-extrabold uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              isActive 
                                ? "bg-white/[0.06] text-cyan-400 font-black border border-white/[0.04] shadow-sm" 
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            <span>{s}</span>
                            <span className="text-[8px] opacity-60">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="flex-1 overflow-y-auto space-y-4.5 mt-1 pr-1" style={{ maxHeight: "calc(100vh - 20rem)" }}>
                  {(() => {
                    const filteredTasks = tasks.filter(t => {
                      if (taskPriorityFilter !== "All" && t.priority !== taskPriorityFilter) {
                        return false;
                      }
                      const isCompleted = t.completedBy?.includes(selfId) || false;
                      if (taskStatusFilter === "Pending" && isCompleted) return false;
                      if (taskStatusFilter === "Completed" && !isCompleted) return false;
                      return true;
                    });

                    if (filteredTasks.length === 0) {
                      return (
                        <div className="py-16 flex flex-col items-center justify-center text-center select-none text-zinc-500 gap-2 border border-white/[0.04] rounded-2xl bg-white/[0.01]">
                          <CheckSquare className="h-8 w-8 text-zinc-700 opacity-50 stroke-[1.5] animate-bounce" />
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">No Matching Study Tasks Found</span>
                          <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-semibold mt-1">Adjust filters or check back later</span>
                        </div>
                      );
                    }

                    // Group by subject
                    const groupedTasks = filteredTasks.reduce((acc, t) => {
                      if (!acc[t.subject]) acc[t.subject] = [];
                      acc[t.subject].push(t);
                      return acc;
                    }, {} as Record<string, StudyTask[]>);

                    return Object.entries(groupedTasks).map(([subject, subTasksVal]) => {
                      const subTasks = subTasksVal as StudyTask[];
                      return (
                        <div key={subject} className="bg-gradient-to-br from-white/[0.01] to-black/20 rounded-2xl border border-white/[0.05] p-4 space-y-3.5 shadow-lg relative overflow-hidden">
                          {/* Subject Header Banner */}
                          <div className="flex justify-between items-center pb-2.5 border-b border-white/[0.04] select-none">
                            <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                              {subject === "Mathematics" && "📐"}
                              {subject === "Physics" && "⚛️"}
                              {subject === "Chemistry" && "🧪"}
                              {subject === "Biology" && "🧬"}
                              {subject === "Computer Science" && "💻"}
                              {subject === "English" && "📚"}
                              {subject === "General Study" && "🎯"}
                              {subject}
                            </span>
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-900/90 border border-white/[0.06] px-2 py-1 rounded-lg">
                              {subTasks.length} {subTasks.length === 1 ? "Task" : "Tasks"}
                            </span>
                          </div>

                          {/* List of Tasks under this subject */}
                          <div className="space-y-3">
                            {subTasks.map((t) => {
                              const isCompleted = t.completedBy?.includes(selfId) || false;
                              
                              // Color scheme based on priority
                              const priorityColors = {
                                High: {
                                  border: isCompleted ? "border-rose-900/20 border-l-rose-500/50" : "border-rose-500/30 hover:border-rose-500/60 border-l-rose-500",
                                  badge: "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.1)]",
                                  bg: "bg-rose-500/[0.01]"
                                },
                                Medium: {
                                  border: isCompleted ? "border-amber-900/20 border-l-amber-500/50" : "border-amber-500/30 hover:border-amber-500/60 border-l-amber-500",
                                  badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]",
                                  bg: "bg-amber-500/[0.01]"
                                },
                                Low: {
                                  border: isCompleted ? "border-cyan-900/20 border-l-cyan-500/50" : "border-cyan-500/30 hover:border-cyan-500/60 border-l-cyan-500",
                                  badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.1)]",
                                  bg: "bg-cyan-500/[0.01]"
                                }
                              };

                              const colors = priorityColors[t.priority] || priorityColors.Medium;

                              return (
                                <div 
                                  key={t.id} 
                                  className={`flex gap-3.5 items-start p-3.5 rounded-xl border border-l-4 transition-all relative overflow-hidden ${colors.bg} ${colors.border}`}
                                >
                                  {/* Custom Styled Interactive Checkbox */}
                                  <button
                                    onClick={() => handleToggleTask(t.id)}
                                    className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                                      isCompleted 
                                        ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                                        : "bg-zinc-950 border-white/[0.08] text-transparent hover:border-zinc-500 hover:bg-zinc-900"
                                    }`}
                                  >
                                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                                  </button>

                                  {/* Task Core info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {/* Priority Badge */}
                                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${colors.badge}`}>
                                        {t.priority} Priority
                                      </span>
                                    </div>

                                    <p className={`text-xs font-semibold leading-relaxed mt-2 transition-all ${
                                      isCompleted ? "line-through text-zinc-500 font-medium" : "text-zinc-200"
                                    }`}>
                                      {t.description}
                                    </p>

                                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[9px] font-bold text-zinc-500 uppercase tracking-wide border-t border-white/[0.02] pt-2">
                                      <span>By {t.uploadedBy}</span>
                                      <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                      <span>
                                        {new Date(t.uploadedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
                                      </span>

                                      {/* Multi-user live completion indicator */}
                                      {t.completedBy && t.completedBy.length > 0 && (
                                        <div className="flex items-center gap-1.5 ml-auto">
                                          <div className="flex -space-x-1.5 overflow-hidden">
                                            {t.completedBy.slice(0, 3).map((userId) => {
                                              const p = participants.find(part => part.id === userId);
                                              const initial = p ? p.username.charAt(0).toUpperCase() : "?";
                                              const isMe = userId === selfId;
                                              return (
                                                <div 
                                                  key={userId}
                                                  title={p ? p.username : "Student"}
                                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black text-black border border-zinc-950 select-none ${
                                                    isMe ? "bg-cyan-400" : "bg-zinc-400"
                                                  }`}
                                                >
                                                  {initial}
                                                </div>
                                              );
                                            })}
                                          </div>
                                          {t.completedBy.length > 3 && (
                                            <span className="text-[8px] text-zinc-400 font-black">
                                              +{t.completedBy.length - 3}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Admin Detail panel */}
                                    {isStaff && (
                                      <div className="mt-2 flex items-center gap-2 select-none">
                                        <div className="text-[8px] text-zinc-400 font-black bg-zinc-900/80 inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/[0.04]">
                                          <Users className="h-3 w-3 text-indigo-400" />
                                          <span>
                                            COMPLETED BY: {t.completedBy?.length || 0} / {participants.length} STUDENTS
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Delete Task button */}
                                  {isStaff && (
                                    <button
                                      onClick={() => handleDeleteTask(t.id)}
                                      className="p-1.5 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors shrink-0 cursor-pointer self-start ml-1.5"
                                      title="DELETE TASK"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* LIGHTBOX POPUP ANIMATE PRESENCE BLOCK */}
      <AnimatePresence>
        {viewImageUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
            onClick={() => setViewImageUrl(null)}
          >
            <button
              onClick={() => setViewImageUrl(null)}
              className="absolute top-4 right-4 p-1 rounded-md border border-white/10 hover:border-white/20 hover:bg-white/5 text-white/50 hover:text-white/90 z-50"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={viewImageUrl}
              alt="Lightbox Render"
              className="max-w-[95vw] max-h-[92vh] object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}

        {activeSecureMaterial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="w-full max-w-5xl h-[88vh] bg-[#050508] border border-cyan-400/30 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.05)] relative">
              
              {/* Header */}
              <div className="bg-black/80 border-b border-cyan-500/20 px-5 py-3.5 flex items-center justify-between select-none">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="space-mono text-[10px] text-cyan-400 font-bold uppercase tracking-[0.25em] flex items-center gap-2">
                    STUDY DOCUMENT VIEWPORT
                  </span>
                </div>
                <button
                  onClick={() => setActiveSecureMaterial(null)}
                  className="p-1 rounded-md border border-cyan-500/20 hover:border-cyan-400 bg-cyan-950/25 text-cyan-400/70 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Viewer Wrapper with non-selection */}
              <div className="flex-1 bg-black relative select-none overflow-hidden flex flex-col items-center justify-center">
                {/* Fallback helper popup for users who encounter Chrome CSP/sandbox iframe blocks */}
                {pdfBlobUrl && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-[#07070c]/95 border border-cyan-400/30 px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-fade-in backdrop-blur-md max-w-[90vw]">
                    <span className="space-mono text-[9px] text-white/50 uppercase">
                      Chrome blocking the viewer?
                    </span>
                    <a
                      href={pdfBlobUrl}
                      download={`${activeSecureMaterial.title}.pdf`}
                      className="py-1 px-3 bg-cyan-500 hover:bg-cyan-400 text-black text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="h-3 w-3 -rotate-180" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                )}

                {/* Embed PDF with Blob URL bypass and hidden toolbars */}
                {pdfBlobUrl ? (
                  <div className="w-full h-full relative flex flex-col items-center justify-center">
                    {/* Native fallback support box in the background layer in case Chrome completely blocks it from loading */}
                    <div className="absolute inset-x-8 text-center max-w-sm flex flex-col items-center gap-4 z-0">
                      <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        <BookOpen className="h-8 w-8" />
                      </div>
                      <h3 className="space-mono text-xs font-bold text-white uppercase tracking-wider">{activeSecureMaterial.title}</h3>
                      <p className="text-[10px] text-white/40 normal-case leading-relaxed">
                        To guarantee safe viewing, you can open or download the document directly to display it in full resolution.
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={pdfBlobUrl}
                          download={`${activeSecureMaterial.title}.pdf`}
                          className="py-2 px-5 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        >
                          <Upload className="h-3.5 w-3.5 -rotate-180" />
                          <span>GET LOCAL PDF DOCUMENT</span>
                        </a>
                      </div>
                    </div>

                    <embed
                      src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      type="application/pdf"
                      className="w-full h-full border-none bg-black/50 animate-fade-in z-10"
                      style={{ pointerEvents: "auto" }}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center space-mono text-cyan-400 text-xs">
                    LOADING SECURE FLOW CORE...
                  </div>
                )}

                {/* Cover transparent shield logic (blocks clicks / downloads / drag selection on the frame) */}
                <div 
                  className="absolute inset-0 bg-transparent pointer-events-none select-none z-0"
                  style={{ pointerEvents: "none" }}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>

              {/* Bottom metadata */}
              <div className="bg-black/80 border-t border-cyan-500/20 p-3 flex items-center justify-center gap-3 select-none">
                <span className="space-mono text-[8px] text-white/30 uppercase tracking-[0.2em]">
                  DOCUMENT TITLE: {activeSecureMaterial.title.toUpperCase()} · UPLOADED BY {activeSecureMaterial.uploadedBy.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {isStreamOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col p-4 backdrop-blur-lg animate-fade-in"
          >
            {/* Cinematic Header block bar */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/25 select-none mb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff3282] animate-pulse" />
                <h2 className="font-extrabold text-xs uppercase text-indigo-400 tracking-wider">
                  Live Active Study Channel
                </h2>
                <span className="text-[8px] space-mono text-cyan-400 border border-cyan-500/20 bg-cyan-950/10 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                  SECURED VIEWPORT (ACTIVE)
                </span>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setIsStreamOpen(false)}
                className="text-[10px] uppercase font-bold space-mono tracking-wider py-1 px-3.5 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-950/10 hover:text-red-400 text-white/50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                <span>EXIT STREAM</span>
              </button>
            </div>

            {/* The Embedded Frame content */}
            <div className="flex-1 w-full bg-[#050508] border border-white/5 rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(176,96,255,0.05)] flex items-center justify-center">
              {/* Fallback box at top/middle for users who encounter iframe refusal */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-[#07070c]/95 border border-[#b060ff]/30 p-6 rounded-xl flex flex-col items-center gap-2.5 text-center max-w-sm shadow-[0_0_30px_rgba(176,96,255,0.1)] backdrop-blur-md">
                <span className="text-[10px] uppercase font-bold text-[#b060ff] tracking-widest">Unable to load stream here?</span>
                <p className="text-[9px] text-white/50 uppercase leading-relaxed font-normal">
                  Some browsers block embedded rooms because of strict security rules. Click below to stream in a new tab.
                </p>
                <a
                  href="https://stream.testuk.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-5 bg-[#b060ff] hover:bg-[#b060ff]/80 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(176,96,255,0.2)]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>LAUNCH PORTAL NOW</span>
                </a>
              </div>

              <iframe
                src="https://stream.testuk.org/"
                allow="autoplay; encrypted-media; fullscreen"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full border-none opacity-20"
                title="Collaborative Study Stream"
              />
            </div>

            {/* Footer info line */}
            <div className="pt-2 select-none flex justify-between items-center text-[9px] space-mono text-white/20">
              <span>WORKSPACE STREAM SOURCE INTEGRATED DIRECTLY</span>
              <span>SYSTEM STABLE · SECURE TUNNEL ACTIVE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATS MODAL DIAGNOSTICS */}
      {user && token && (
        <StatsModal
          isOpen={viewStatsId}
          onClose={() => setViewStatsId(false)}
          token={token}
          username={user.username}
        />
      )}

      {/* PARTICIPANT METRICS DIAGNOSTICS */}
      <ParticipantModal
        isOpen={detailedParticipant !== null}
        onClose={() => setDetailedParticipant(null)}
        participant={detailedParticipant}
        isMe={detailedParticipant?.id === selfId}
      />

      {/* ALL USERS NAMES LIST MODAL */}
      <AnimatePresence>
        {showAllNamesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-extrabold text-zinc-100">Session Directory</span>
                    <span className="text-[10px] text-zinc-500 font-medium">{participants.length} total users engaged</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAllNamesModal(false)}
                  className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {participants.map((part) => {
                  const isMe = part.id === selfId;
                  const isPartAdmin = part.role === "admin";
                  const isPartCoHost = part.role === "co-host";
                  const words = part.username.split(/[\s_.-]+/);
                  const init = words.length >= 2 ? (words[0][0] + words[1][0]) : part.username.substring(0, 2);

                  return (
                    <div
                      key={part.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl border ${
                        isMe
                          ? "bg-cyan-400/[0.02] border-cyan-400/20"
                          : "bg-white/[0.01] border-white/[0.04]"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold uppercase relative shrink-0 ${
                        isMe
                          ? "border-cyan-500 text-cyan-400 bg-cyan-950/20 shadow-[0_0_8px_rgba(0,255,255,0.15)]"
                          : part.isActive && !part.isOffline
                          ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                          : "border-white/10 text-white/40"
                      }`}>
                        {init.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col text-left">
                        <span className="text-xs font-semibold text-zinc-200 truncate flex items-center gap-1.5">
                          {part.username}
                          {isMe && <span className="text-[8px] text-cyan-400/50 uppercase font-normal font-sans">(me)</span>}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md border ${
                            part.isOffline
                              ? "bg-zinc-850 text-zinc-500 border-zinc-800"
                              : part.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10 animate-pulse"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/10"
                          }`}>
                            {part.isOffline ? "Offline" : part.isActive ? "Live" : "Online"}
                          </span>

                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md border ${
                            isPartAdmin
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/10"
                              : isPartCoHost
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/10"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}>
                            {isPartAdmin ? "Admin" : isPartCoHost ? "Co-Host" : "Student"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE SIMULATOR MODAL */}
      <AnimatePresence>
        {isMobileSimulatorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-zinc-900/90 backdrop-blur-2xl border border-white/[0.08] rounded-[36px] p-6 lg:p-8 shadow-2xl flex flex-col lg:flex-row gap-8 items-stretch max-h-[90vh] overflow-y-auto relative"
            >
              {/* LEFT EXPLANATION COLUMN */}
              <div className="flex-1 flex flex-col justify-between text-left max-w-md">
                <div>
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest text-cyan-400 font-mono">Mobile Ecosystem</span>
                      <h3 className="text-lg font-black text-white">StudyCtrl Mobile App</h3>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    In a native smartphone deployment (iOS/Android), our client utilizes the platform's background app usage query APIs. This simulation demonstrates how we track educational focus states across apps.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs shrink-0 font-bold font-mono">01</div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">Usage Access Authority</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                          Android's <code className="text-indigo-400 font-mono">PACKAGE_USAGE_STATS</code> or iOS system telemetry permissions verify which app package is in the active viewport.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs shrink-0 font-bold font-mono">02</div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">Distraction Shield</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                          Educational programs (like VS Code or Wikipedia) continue the study tick. Entertainment or social media clients trigger auto-pause and alert prompts.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs shrink-0 font-bold font-mono">03</div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">OS-to-Web Synchronization</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                          Your accumulated background focus seconds can be synchronized over WebSockets directly into your active StudyCtrl study room!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider font-mono">
                  <span>Simulated Kernel 1.4.2</span>
                  <span>Sandbox Stable</span>
                </div>
              </div>

              {/* RIGHT SMARTPHONE SIMULATOR COLUMN */}
              <div className="flex-1 flex flex-col items-center justify-center relative min-w-[320px]">
                {/* Smartphone chassis */}
                <div className="w-[320px] h-[550px] bg-black border-[10px] border-zinc-800 rounded-[44px] shadow-2xl relative overflow-hidden flex flex-col select-none ring-1 ring-white/10">
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-zinc-900 border border-zinc-800/50 rounded-full z-30 flex items-center justify-between px-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-850" />
                    <span className="w-3.5 h-1.5 rounded-full bg-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.2)]" />
                  </div>

                  {/* On-Screen Header/Status Bar */}
                  <div className="h-8 pt-2.5 px-6 flex justify-between items-center text-[10px] font-bold text-zinc-400 z-20 font-mono select-none">
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex items-center gap-1.5">
                      <Wifi className="h-3 w-3 text-emerald-400" />
                      <div className="flex items-center gap-0.5 border border-zinc-700 rounded-sm px-0.5 py-px text-[8px] bg-zinc-900">
                        <span className="text-emerald-400 font-sans">100%</span>
                        <div className="w-2.5 h-1.5 bg-emerald-500 rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* PHONE SCREEN CONTENT CONTAINER */}
                  <div className="flex-1 relative overflow-hidden flex flex-col z-10 bg-gradient-to-b from-indigo-950/40 via-zinc-900 to-black">
                    
                    {/* WALLPAPER INTERFACE (If StudyCtrl App is closed) */}
                    {!isSimulatedAppRunning && (
                      <div className="absolute inset-0 p-5 flex flex-col justify-between">
                        {/* Time & Date Display Widget */}
                        <div className="text-center mt-6 select-none">
                          <h1 className="text-4xl font-black text-white tracking-tight">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </h1>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 mt-1">
                            {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                          </p>
                        </div>

                        {/* App Grid */}
                        <div className="grid grid-cols-4 gap-4 my-auto px-1 select-none">
                          {/* StudyCtrl App Icon */}
                          <div 
                            onClick={() => setIsSimulatedAppRunning(true)}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                          >
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:scale-105 transition-all relative">
                              <Compass className="h-5 w-5 text-white animate-pulse" />
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 border border-black rounded-full text-[8px] text-black font-black flex items-center justify-center">1</span>
                            </div>
                            <span className="text-[9px] font-bold text-zinc-200">StudyCtrl</span>
                          </div>

                          {/* VS Code Sim Icon */}
                          <div 
                            onClick={() => {
                              setSimulatedActiveApp("VS Code");
                              setSimulatedAppLogs((prev) => [
                                { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), text: "VS Code launched from mobile home screen.", type: "info" },
                                ...prev
                              ]);
                            }}
                            className={`flex flex-col items-center gap-1 cursor-pointer group ${simulatedActiveApp === "VS Code" ? "opacity-100" : "opacity-60"}`}
                          >
                            <div className="w-11 h-11 rounded-xl bg-zinc-805 border border-white/5 flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
                              <Cpu className={`h-5 w-5 ${simulatedActiveApp === "VS Code" ? "text-indigo-400 animate-pulse" : "text-zinc-400"}`} />
                            </div>
                            <span className="text-[9px] font-bold text-zinc-300">VS Code</span>
                          </div>

                          {/* Wikipedia Icon */}
                          <div 
                            onClick={() => {
                              setSimulatedActiveApp("Wikipedia");
                              setSimulatedAppLogs((prev) => [
                                { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), text: "Wikipedia browser launched.", type: "info" },
                                ...prev
                              ]);
                            }}
                            className={`flex flex-col items-center gap-1 cursor-pointer group ${simulatedActiveApp === "Wikipedia" ? "opacity-100" : "opacity-60"}`}
                          >
                            <div className="w-11 h-11 rounded-xl bg-zinc-805 border border-white/5 flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
                              <BookOpen className={`h-5 w-5 ${simulatedActiveApp === "Wikipedia" ? "text-cyan-400 animate-pulse" : "text-zinc-400"}`} />
                            </div>
                            <span className="text-[9px] font-bold text-zinc-300">Wiki</span>
                          </div>

                          {/* YouTube sim icon */}
                          <div 
                            onClick={() => {
                              setSimulatedActiveApp("YouTube");
                              setSimulatedAppLogs((prev) => [
                                { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), text: "YouTube multimedia player launched.", type: "warn" },
                                ...prev
                              ]);
                            }}
                            className={`flex flex-col items-center gap-1 cursor-pointer group ${simulatedActiveApp === "YouTube" ? "opacity-100" : "opacity-60"}`}
                          >
                            <div className="w-11 h-11 rounded-xl bg-zinc-805 border border-white/5 flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
                              <Play className={`h-5 w-5 ${simulatedActiveApp === "YouTube" ? "text-rose-500 animate-pulse" : "text-zinc-400"}`} />
                            </div>
                            <span className="text-[9px] font-bold text-zinc-300">YouTube</span>
                          </div>

                          {/* Instagram Sim Icon */}
                          <div 
                            onClick={() => {
                              setSimulatedActiveApp("Instagram");
                              setSimulatedAppLogs((prev) => [
                                { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), text: "Instagram social feed active.", type: "warn" },
                                ...prev
                              ]);
                            }}
                            className={`flex flex-col items-center gap-1 cursor-pointer group ${simulatedActiveApp === "Instagram" ? "opacity-100" : "opacity-60"}`}
                          >
                            <div className="w-11 h-11 rounded-xl bg-zinc-805 border border-white/5 flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
                              <Trophy className={`h-5 w-5 ${simulatedActiveApp === "Instagram" ? "text-amber-400 animate-pulse" : "text-zinc-400"}`} />
                            </div>
                            <span className="text-[9px] font-bold text-zinc-300">Instagram</span>
                          </div>

                          {/* Discord Icon */}
                          <div 
                            onClick={() => {
                              setSimulatedActiveApp("Discord");
                              setSimulatedAppLogs((prev) => [
                                { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), text: "Discord chat client running.", type: "warn" },
                                ...prev
                              ]);
                            }}
                            className={`flex flex-col items-center gap-1 cursor-pointer group ${simulatedActiveApp === "Discord" ? "opacity-100" : "opacity-60"}`}
                          >
                            <div className="w-11 h-11 rounded-xl bg-zinc-805 border border-white/5 flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
                              <MessageSquare className={`h-5 w-5 ${simulatedActiveApp === "Discord" ? "text-purple-400 animate-pulse" : "text-zinc-400"}`} />
                            </div>
                            <span className="text-[9px] font-bold text-zinc-300">Discord</span>
                          </div>
                        </div>

                        {/* OS Dock bar */}
                        <div className="bg-white/5 border border-white/[0.04] p-3 rounded-[24px] grid grid-cols-4 gap-3 text-center mb-2">
                          <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs">📱</div>
                          <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs">💬</div>
                          <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs">🌐</div>
                          <div 
                            onClick={() => setIsSimulatedAppRunning(true)}
                            className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white text-xs cursor-pointer shadow-sm animate-pulse"
                          >
                            <Compass className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STUDYCTRL MOBILE APP INTERFACE - PERMISSION REQUEST SCREEN */}
                    {isSimulatedAppRunning && !hasUsageAccessPermission && (
                      <div className="absolute inset-0 p-5 flex flex-col justify-between text-center">
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 select-none">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">System Integrity</span>
                          <button 
                            onClick={() => setIsSimulatedAppRunning(false)}
                            className="text-[9px] font-black text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md"
                          >
                            HOME
                          </button>
                        </div>

                        <div className="my-auto flex flex-col items-center">
                          <div className="w-14 h-14 rounded-[22px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-pulse">
                            <ShieldAlert className="h-7 w-7" />
                          </div>
                          <h4 className="text-sm font-extrabold text-white uppercase tracking-wide">Usage Access Required</h4>
                          <span className="text-[8px] font-mono text-amber-400 font-bold uppercase tracking-widest bg-amber-500/5 px-2 py-0.5 rounded-full mt-1">
                            OS Security Request
                          </span>
                          <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xs mt-3.5 px-2">
                            To run seamlessly in the background and award study seconds for writing code or researching, StudyCtrl needs system-wide <strong className="text-zinc-200">Usage Access permission</strong>. This queries active foreground window names on StudyOS.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setHasUsageAccessPermission(true);
                              localStorage.setItem("studyctrl_usage_access_permission", "granted");
                              setSimulatedAppLogs((prev) => [
                                { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), text: "OS PACKAGE_USAGE_STATS permission GRANTED by user.", type: "success" },
                                ...prev
                              ]);
                            }}
                            className="py-2.5 bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-bold rounded-2xl cursor-pointer transition-all uppercase shadow-md font-mono"
                          >
                            Allow Usage Access
                          </button>
                          <button
                            onClick={() => setIsSimulatedAppRunning(false)}
                            className="py-2 bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold rounded-2xl cursor-pointer transition-all uppercase"
                          >
                            Deny Access
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STUDYCTRL MOBILE APP INTERFACE - ACTIVE TRACKER DASHBOARD SCREEN */}
                    {isSimulatedAppRunning && hasUsageAccessPermission && (
                      <div className="absolute inset-0 p-4 flex flex-col justify-between overflow-hidden">
                        {/* App header bar */}
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 select-none">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white">
                              <Compass className="h-3 w-3" />
                            </div>
                            <span className="text-[10px] text-zinc-200 font-black uppercase tracking-wider font-mono">StudyCtrl Mobile</span>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setIsSimulatedAppRunning(false);
                            }}
                            className="text-[9px] font-black text-zinc-400 hover:text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1"
                          >
                            <Home className="h-2.5 w-2.5" />
                            <span>HOME</span>
                          </button>
                        </div>

                        {/* LIVE BACKGROUND SENSOR STATUS BANNER */}
                        <div className="mt-3 bg-cyan-400/5 border border-cyan-400/10 p-2.5 rounded-2xl text-left flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            <div className="flex flex-col leading-none">
                              <span className="text-[8px] text-zinc-500 font-bold uppercase font-mono">Tracking Engine</span>
                              <span className="text-[9.5px] font-extrabold text-cyan-400 uppercase mt-0.5">Background Active</span>
                            </div>
                          </div>
                          <span className="text-[8.5px] font-bold text-zinc-400 font-mono">PORT 3000 SYNC</span>
                        </div>

                        {/* RADIAL FOCUS TIME ACCUMULATOR */}
                        <div className="my-auto py-2 flex flex-col items-center">
                          <div className="relative w-32 h-32 rounded-full border-2 border-white/[0.04] flex items-center justify-center bg-black/40 shadow-inner">
                            {/* Glowing rings */}
                            <div className={`absolute inset-1 rounded-full border border-dashed transition-all duration-500 ${
                              ["StudyCtrl", "VS Code", "Wikipedia"].includes(simulatedActiveApp)
                                ? "border-cyan-400/40 animate-spin"
                                : "border-zinc-800 animate-none"
                            }`} style={{ animationDuration: '20s' }} />

                            <div className="flex flex-col items-center select-none z-10">
                              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Studied BG</span>
                              <span className="text-2xl font-black font-mono text-white tracking-tight mt-1 tabular-nums">
                                {formatSecondsToClock(backgroundStudyTime)}
                              </span>
                              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded mt-1.5 ${
                                ["StudyCtrl", "VS Code", "Wikipedia"].includes(simulatedActiveApp)
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-rose-500/10 text-rose-400 animate-pulse"
                              }`}>
                                {["StudyCtrl", "VS Code", "Wikipedia"].includes(simulatedActiveApp) ? "Focusing" : "Paused"}
                              </span>
                            </div>
                          </div>

                          {/* App switch status label */}
                          <div className="mt-3 text-center">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Foreground App Detected:</span>
                            <div className="flex items-center justify-center gap-1.5 mt-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                ["StudyCtrl", "VS Code", "Wikipedia"].includes(simulatedActiveApp) ? "bg-emerald-400 animate-pulse" : "bg-rose-400 animate-ping"
                              }`} />
                              <span className="text-xs font-black uppercase tracking-wide text-zinc-200">
                                {simulatedActiveApp === "StudyCtrl" ? "StudyCtrl (Active)" : simulatedActiveApp}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* INTERACTIVE FOREGROUND SWITCHER FOR TESTING */}
                        <div className="mb-2 bg-white/[0.01] border border-white/[0.04] p-2.5 rounded-2xl flex flex-col text-left">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest font-mono select-none">
                            Simulate App Switch (Testing):
                          </span>
                          <div className="grid grid-cols-3 gap-1.5 mt-2">
                            <button
                              onClick={() => setSimulatedActiveApp("StudyCtrl")}
                              className={`py-1 px-1 rounded-lg text-[8.5px] font-bold uppercase border transition-all truncate text-center cursor-pointer ${
                                simulatedActiveApp === "StudyCtrl"
                                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                                  : "bg-zinc-800/40 border-transparent text-zinc-400 hover:text-white"
                              }`}
                            >
                              StudyCtrl
                            </button>

                            <button
                              onClick={() => setSimulatedActiveApp("VS Code")}
                              className={`py-1 px-1 rounded-lg text-[8.5px] font-bold uppercase border transition-all truncate text-center cursor-pointer ${
                                simulatedActiveApp === "VS Code"
                                  ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-400"
                                  : "bg-zinc-800/40 border-transparent text-zinc-400 hover:text-white"
                              }`}
                            >
                              VS Code
                            </button>

                            <button
                              onClick={() => setSimulatedActiveApp("Wikipedia")}
                              className={`py-1 px-1 rounded-lg text-[8.5px] font-bold uppercase border transition-all truncate text-center cursor-pointer ${
                                simulatedActiveApp === "Wikipedia"
                                  ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
                                  : "bg-zinc-800/40 border-transparent text-zinc-400 hover:text-white"
                              }`}
                            >
                              Wiki
                            </button>

                            <button
                              onClick={() => setSimulatedActiveApp("YouTube")}
                              className={`py-1 px-1 rounded-lg text-[8.5px] font-bold uppercase border transition-all truncate text-center cursor-pointer ${
                                simulatedActiveApp === "YouTube"
                                  ? "bg-rose-500/10 border-rose-500/50 text-rose-400"
                                  : "bg-zinc-800/40 border-transparent text-zinc-400 hover:text-white"
                              }`}
                            >
                              YouTube
                            </button>

                            <button
                              onClick={() => setSimulatedActiveApp("Instagram")}
                              className={`py-1 px-1 rounded-lg text-[8.5px] font-bold uppercase border transition-all truncate text-center cursor-pointer ${
                                simulatedActiveApp === "Instagram"
                                  ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                                  : "bg-zinc-800/40 border-transparent text-zinc-400 hover:text-white"
                              }`}
                            >
                              Insta
                            </button>

                            <button
                              onClick={() => setSimulatedActiveApp("Discord")}
                              className={`py-1 px-1 rounded-lg text-[8.5px] font-bold uppercase border transition-all truncate text-center cursor-pointer ${
                                simulatedActiveApp === "Discord"
                                  ? "bg-purple-500/10 border-purple-500/50 text-purple-400"
                                  : "bg-zinc-800/40 border-transparent text-zinc-400 hover:text-white"
                              }`}
                            >
                              Discord
                            </button>
                          </div>

                          {/* ACTION: SYNC SECONDS TO ROOM */}
                          <button
                            onClick={() => {
                              if (backgroundStudyTime <= 0) return;
                              // Syncing: Send a chat packet or update client-side. To make it extremely satisfying, 
                              // let's send a simulated synchronization packet in chat!
                              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                                wsRef.current.send(JSON.stringify({
                                  type: "chat_message",
                                  text: `📱 [MOBILE SYNC] Successfully uploaded ${formatSecondsToClock(backgroundStudyTime)} of verified background focus logs (Foreground App: ${simulatedActiveApp}).`
                                }));
                              }
                              
                              // Trigger a rewarding toast
                              const btn = document.getElementById("sync-bg-sec-btn");
                              if (btn) {
                                btn.innerText = "SYNCHRONIZED!";
                                setTimeout(() => {
                                  if (btn) btn.innerText = "SYNC TIME TO LEADERBOARD";
                                }, 3000);
                              }

                              setSimulatedAppLogs((prev) => [
                                { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), text: `Transmitted ${backgroundStudyTime} study focus seconds to StudyCtrl host.`, type: "success" },
                                ...prev
                              ]);
                              
                              setBackgroundStudyTime(0);
                            }}
                            id="sync-bg-sec-btn"
                            disabled={backgroundStudyTime <= 0}
                            className="mt-3.5 w-full py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 disabled:from-zinc-800 disabled:to-zinc-800 text-black disabled:text-zinc-500 text-[10px] font-black rounded-xl cursor-pointer disabled:cursor-not-allowed transition-all uppercase tracking-wider font-mono text-center shadow-md flex items-center justify-center gap-1.5"
                          >
                            <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '4s' }} />
                            <span>Sync Time to Leaderboard</span>
                          </button>
                        </div>

                        {/* OS SENSOR LOGS STREAM */}
                        <div className="bg-black/60 border border-white/[0.04] p-2.5 rounded-2xl flex-1 flex flex-col min-h-0 text-left select-none">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest font-mono mb-2">Live Kernel Log Stream:</span>
                          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-none font-mono text-[8px] leading-relaxed">
                            {simulatedAppLogs.map((log) => (
                              <div key={log.id} className="flex gap-1.5 items-start">
                                <span className="text-zinc-600 shrink-0">{log.timestamp}</span>
                                <span className={
                                  log.type === "success" ? "text-cyan-400" :
                                  log.type === "warn" ? "text-rose-400" : "text-zinc-400"
                                }>
                                  {log.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                  </div>

                  {/* BOTTOM HOME INDICATOR BAR (Simulating physical phone button/swipe) */}
                  <div 
                    onClick={() => {
                      setIsSimulatedAppRunning(false);
                    }}
                    className="h-6 pb-2.5 flex items-center justify-center z-20 cursor-pointer"
                  >
                    <div className="w-28 h-1 bg-zinc-700 hover:bg-zinc-500 rounded-full transition-colors" />
                  </div>
                </div>
              </div>

              {/* OVERLAY CLOSE ACTION */}
              <button
                onClick={() => setIsMobileSimulatorOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- 404 NOT FOUND ---
function NotFoundPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-[#080711] via-[#0e0c1b] to-[#040307] text-white font-sans overflow-hidden select-none">
      <div className="absolute top-[30%] left-[30%] w-[350px] h-[350px] rounded-full bg-[#8c46ff] opacity-[0.05] filter blur-[100px] pointer-events-none" />
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-[32px] p-8 shadow-2xl text-center z-10">
        <h1 className="text-8xl font-black bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent animate-fade-in">404</h1>
        <h2 className="text-xl font-extrabold text-white mt-4 tracking-tight uppercase">Page Not Found</h2>
        <p className="text-xs text-zinc-400 mt-3 leading-relaxed max-w-xs mx-auto">
          The link you followed is invalid or has expired. Let's get you back to your workspace.
        </p>
        <Link to="/">
          <button className="mt-8 w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black text-xs font-bold rounded-2xl cursor-pointer transition-all hover:opacity-95 shadow-md">
            Return to Workspace
          </button>
        </Link>
      </div>
    </div>
  );
}

// --- MASTER ROUTER WRAPPER ---
export default function App() {
  return (
    <AuthProvider>
      <Switch>
        {/* Guarded access */}
        <Route path="/">
          {() => <GuardedRoute path="/" component={LobbyPage} />}
        </Route>
        <Route path="/session/:code">
          {(params) => <GuardedRoute path={`/session/${params.code}`} component={() => <SessionRoomPage params={params} />} />}
        </Route>

        {/* Public Access */}
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />

        {/* Fallback */}
        <Route component={NotFoundPage} />
      </Switch>
    </AuthProvider>
  );
}

// Custom Markdown Renderers for Premium Cyber Aesthetic Displays
function StyledMarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;
  
  // Split by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);
  
  return (
    <div className="flex flex-col gap-3 font-sans text-xs leading-relaxed text-white/90">
      {parts.map((part, idx) => {
        if (part.startsWith("```")) {
          // Code block parsing
          const lines = part.split("\n");
          const firstLine = lines[0];
          const lang = firstLine.replace("```", "").trim();
          const code = lines.slice(1, -1).join("\n");
          
          return (
            <div key={idx} className="my-2 rounded-xl border border-white/10 bg-black/80 overflow-hidden font-mono text-[10px] w-full max-w-full">
              <div className="flex items-center justify-between px-3 py-1 bg-white/5 text-white/40 select-none text-[8px] uppercase tracking-wider font-bold">
                <span>{lang || "CODEBLOCK"}</span>
                <span>SYSTEM RENDER</span>
              </div>
              <pre className="p-3 overflow-x-auto select-text scrollbar-thin text-cyan-300">
                <code>{code}</code>
              </pre>
            </div>
          );
        } else {
          // Regular narrative text block
          const lines = part.split("\n");
          return (
            <div key={idx} className="flex flex-col gap-1.5">
              {lines.map((line, lineIdx) => {
                const trimmed = line.trim();
                if (!trimmed) {
                  return <div key={lineIdx} className="h-1.5" />;
                }
                
                // Unordered lists
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  const content = trimmed.substring(2);
                  return (
                    <div key={lineIdx} className="flex gap-2 pl-1.5 py-0.5">
                      <span className="text-cyan-400 font-extrabold select-none">•</span>
                      <span className="flex-1">{parseInlineStyles(content)}</span>
                    </div>
                  );
                }
                
                // Numbered lists
                if (/^\d+\.\s/.test(trimmed)) {
                  const match = trimmed.match(/^(\d+\.)\s(.*)/);
                  if (match) {
                    return (
                      <div key={lineIdx} className="flex gap-2 pl-1.5 py-0.5">
                        <span className="text-cyan-400 font-bold space-mono select-none">{match[1]}</span>
                        <span className="flex-1">{parseInlineStyles(match[2])}</span>
                      </div>
                    );
                  }
                }
                
                // Headings
                if (trimmed.startsWith("### ")) {
                  return (
                    <h4 key={lineIdx} className="font-bold text-[10px] text-cyan-400 uppercase tracking-wider mt-2.5 mb-1 select-none">
                      {parseInlineStyles(trimmed.substring(4))}
                    </h4>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return (
                    <h3 key={lineIdx} className="font-black text-[10.5px] text-[#b060ff] uppercase tracking-wider mt-3.5 mb-1.5 select-none border-b border-white/5 pb-0.5">
                      {parseInlineStyles(trimmed.substring(3))}
                    </h3>
                  );
                }
                if (trimmed.startsWith("# ")) {
                  return (
                    <h2 key={lineIdx} className="font-black text-xs text-[#00ffff] uppercase tracking-wider mt-4 .5 mb-2 select-none border-b border-[#00ffff]/20 pb-1 text-shadow-cyan">
                      {parseInlineStyles(trimmed.substring(2))}
                    </h2>
                  );
                }
                
                return <p key={lineIdx} className="text-white/85">{parseInlineStyles(line)}</p>;
              })}
            </div>
          );
        }
      })}
    </div>
  );
}

function parseInlineStyles(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-extrabold text-[#00ffff] text-shadow-cyan">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-mono text-cyan-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
