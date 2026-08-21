import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { X, Trophy, Zap, Clock, ShieldCheck, Archive, Trash2, RotateCcw, Search, Calendar, Layers, TrendingUp, Flame, Sparkles, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DailyData {
  date: string;
  label: string;
  minutes: number;
  seconds: number;
}

interface UserSessionHistory {
  id: string;
  roomCode: string;
  durationDays: number;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  personalFocusSeconds: number;
  joinedAt: string;
  lastActiveAt: string;
  isArchived: boolean;
}

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  username: string;
}

export default function StatsModal({ isOpen, onClose, token, username }: StatsModalProps) {
  const [activeTab, setActiveTab] = useState<"diagnostics" | "sessions">("diagnostics");
  
  // Daily Stats States
  const [data, setData] = useState<DailyData[]>([]);
  const [allDays, setAllDays] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorRec, setErrorRec] = useState("");

  // Session History States
  const [sessions, setSessions] = useState<UserSessionHistory[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState("");
  const [sessionFilter, setSessionFilter] = useState<"active" | "archived" | "all">("active");
  const [sessionSearch, setSessionSearch] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setErrorRec("");
      const response = await fetch("/api/stats/daily_chart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Unable to retrieve focus analytics");
      }
      const raw = await response.json();
      setData(raw.dailyHistory || []);
      setAllDays(raw.allDaysHistory || []);
    } catch (e: any) {
      setErrorRec(e.message || "Failed to establish secure connection with archives");
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      setSessionsLoading(true);
      setSessionsError("");
      const response = await fetch("/api/users/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Unable to load session logs");
      }
      const raw = await response.json();
      setSessions(raw.sessionHistory || []);
    } catch (e: any) {
      setSessionsError(e.message || "Session history retrieval failed");
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleToggleArchive = async (id: string, isCurrentlyArchived: boolean) => {
    try {
      const response = await fetch(`/api/users/sessions/${id}/archive`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isArchived: !isCurrentlyArchived }),
      });
      if (response.ok) {
        setSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isArchived: !isCurrentlyArchived } : s))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!window.confirm("Permanently remove this session log?")) return;
    try {
      const response = await fetch(`/api/users/sessions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      loadStats();
      loadSessions();
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  // Analytics calculation
  const totalSeconds = allDays.reduce((acc, curr) => acc + curr.seconds, 0);
  const activeDays = allDays.filter((d) => d.seconds > 0).length;
  const averageMinutes = activeDays > 0 ? Math.round((totalSeconds / 60) / activeDays) : 0;
  const recordDay = allDays.length > 0 ? Math.max(...allDays.map((d) => d.minutes)) : 0;

  const formatSeconds = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);
    return parts.join(" ");
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return isoString;
    }
  };

  // Filtered session list logic
  const filteredSessions = sessions.filter((s) => {
    const matchesFilter =
      sessionFilter === "all" ||
      (sessionFilter === "active" && !s.isArchived) ||
      (sessionFilter === "archived" && s.isArchived);
    const matchesSearch = s.roomCode.toLowerCase().includes(sessionSearch.toLowerCase().trim());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-[#040918] border border-cyan-500/40 rounded-[28px] overflow-hidden flex flex-col p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] max-h-[90vh] min-h-0 text-zinc-100"
        id="stats-modal-container"
      >
        {/* Cyber Neon Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-5 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-cyan-400 tracking-wider uppercase orbitron">STUDY ANALYTICS HUD</h2>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider rajdhani">
                Focus Telemetry for <span className="text-cyan-300 font-mono font-bold">{username}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-pink-500/50 hover:bg-pink-500/10 text-zinc-400 hover:text-pink-300 transition-all cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-2 p-1 bg-[#060c1d] border border-cyan-500/20 rounded-2xl mb-5 select-none shrink-0">
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer rajdhani uppercase tracking-wider ${
              activeTab === "diagnostics"
                ? "bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Performance & All Days
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer rajdhani uppercase tracking-wider ${
              activeTab === "sessions"
                ? "bg-purple-600 text-white font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="h-4 w-4" />
            Session History
          </button>
        </div>

        {activeTab === "diagnostics" ? (
          loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 flex-grow min-h-0">
              <div className="w-9 h-9 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
              <span className="text-cyan-400 font-mono text-xs tracking-widest uppercase">// LOADING METRICS...</span>
            </div>
          ) : errorRec ? (
            <div className="py-16 text-center flex-grow flex flex-col items-center justify-center min-h-0">
              <p className="text-pink-400 text-xs bg-pink-500/10 px-4 py-2.5 border border-pink-500/30 rounded-2xl max-w-md font-mono">
                {errorRec}
              </p>
              <button
                onClick={loadStats}
                className="mt-4 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs rounded-xl transition-all cursor-pointer font-mono uppercase tracking-wider"
              >
                Retry Query
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 flex-1 overflow-y-auto min-h-0 pr-1 scrollbar-thin">
              {/* Overall Metrics grid across ALL days */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none shrink-0">
                <div className="bg-[#071026] border border-cyan-500/30 p-4 rounded-2xl flex flex-col shadow-[0_0_15px_rgba(0,240,255,0.08)]">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold tracking-wider">Total Focus Time</span>
                  <span className="text-lg font-black text-cyan-300 font-mono mt-1.5 truncate">{formatSeconds(totalSeconds)}</span>
                  <span className="text-[9px] text-zinc-500 font-mono mt-1">accumulated</span>
                </div>
                <div className="bg-[#071026] border border-cyan-500/30 p-4 rounded-2xl flex flex-col shadow-[0_0_15px_rgba(0,240,255,0.08)]">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold tracking-wider">Active Days</span>
                  <span className="text-lg font-black text-cyan-400 font-mono mt-1.5">{activeDays} <span className="text-xs text-zinc-400 font-normal">days</span></span>
                  <span className="text-[9px] text-zinc-500 font-mono mt-1">tracked</span>
                </div>
                <div className="bg-[#071026] border border-purple-500/30 p-4 rounded-2xl flex flex-col shadow-[0_0_15px_rgba(168,85,247,0.08)]">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold tracking-wider">Daily Average</span>
                  <span className="text-lg font-black text-purple-400 font-mono mt-1.5">{averageMinutes} <span className="text-xs text-zinc-400 font-normal">mins</span></span>
                  <span className="text-[9px] text-zinc-500 font-mono mt-1">active days</span>
                </div>
                <div className="bg-[#071026] border border-emerald-500/30 p-4 rounded-2xl flex flex-col shadow-[0_0_15px_rgba(0,255,102,0.08)]">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold tracking-wider">Peak Focus</span>
                  <span className="text-lg font-black text-emerald-400 font-mono mt-1.5">{recordDay} <span className="text-xs text-zinc-400 font-normal">mins</span></span>
                  <span className="text-[9px] text-zinc-500 font-mono mt-1">single day record</span>
                </div>
              </div>

              {/* Recent Chart and All Days Split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0 flex-1">
                
                {/* Left side: recent study pattern chart */}
                <div className="md:col-span-7 bg-[#060c1e] border border-cyan-500/20 rounded-2xl p-4 flex flex-col min-h-[220px]">
                  <h3 className="text-[11px] font-black text-cyan-400 uppercase tracking-widest font-mono mb-3">7-Day Focus Distribution</h3>
                  <div className="flex-1 w-full min-h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} margin={{ top: 10, right: 5, left: -32, bottom: 0 }}>
                        <XAxis
                          dataKey="label"
                          stroke="#64748b"
                          tickLine={false}
                          style={{ fontSize: 10, fontFamily: "Space Mono" }}
                        />
                        <YAxis
                          stroke="#64748b"
                          tickLine={false}
                          style={{ fontSize: 10, fontFamily: "Space Mono" }}
                          axisLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(0, 240, 255, 0.05)" }}
                          contentStyle={{
                            backgroundColor: "#060d20",
                            border: "1px solid rgba(0, 240, 255, 0.3)",
                            borderRadius: "12px",
                            padding: "8px 12px",
                          }}
                          labelStyle={{ color: "#00f0ff", fontSize: 11, fontWeight: "bold", fontFamily: "Space Mono" }}
                          itemStyle={{ color: "#e2e8f0", fontSize: 11, fontFamily: "Space Mono" }}
                          formatter={(v) => [`${v} mins focused`]}
                        />
                        <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                          {data.map((entry, index) => {
                            const isHighest = entry.minutes === recordDay && recordDay > 0;
                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={isHighest ? "#00ff66" : "#00f0ff"}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right side: ALL DAYS list */}
                <div className="md:col-span-5 bg-[#060c1e] border border-cyan-500/20 rounded-2xl p-4 flex flex-col h-full min-h-[220px]">
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <h3 className="text-[11px] font-black text-cyan-400 uppercase tracking-widest font-mono">Archive History</h3>
                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
                      {allDays.length} {allDays.length === 1 ? "Day" : "Days"}
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto space-y-2 pr-1 max-h-[220px] md:max-h-none scrollbar-thin">
                    {allDays.length === 0 ? (
                      <div className="flex items-center justify-center h-full py-10 text-center text-zinc-500 text-xs italic font-mono">
                        No historical study days.
                      </div>
                    ) : (
                      allDays.map((day) => {
                        const relativePercent = recordDay > 0 ? Math.min(100, (day.minutes / recordDay) * 100) : 0;
                        return (
                          <div 
                            key={day.date} 
                            className="p-3 bg-[#081228] border border-zinc-800 hover:border-cyan-500/40 rounded-xl flex flex-col gap-1.5 transition-all"
                          >
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-xs font-bold text-zinc-200 rajdhani">
                                {day.label}, {formatDate(day.date)}
                              </span>
                              <span className="font-mono text-xs font-black text-cyan-400">
                                {formatSeconds(day.seconds)}
                              </span>
                            </div>
                            
                            {/* Horizontal progress visualization */}
                            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                                style={{ width: `${relativePercent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>
          )
        ) : (
          /* SESSIONS TAB VIEW */
          <div className="flex flex-col gap-4 flex-grow min-h-0 select-none">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="relative flex-grow flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search space code..."
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  className="w-full bg-[#071026] border border-zinc-800 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-all font-mono"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#071026] p-1 rounded-xl border border-zinc-800">
                {(["active", "archived", "all"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSessionFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer rajdhani ${
                      sessionFilter === filter
                        ? "bg-cyan-500 text-black font-extrabold shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-0 scrollbar-thin">
              {sessionsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                  <span className="text-zinc-500 font-mono text-xs">// RETRIEVING ARCHIVES...</span>
                </div>
              ) : sessionsError ? (
                <div className="p-4 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs rounded-xl text-center font-mono">
                  {sessionsError}
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 text-xs italic bg-[#060c1d] border border-zinc-800 rounded-2xl font-mono">
                  No sessions matching criteria.
                </div>
              ) : (
                filteredSessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-[#071026] hover:bg-[#0a1532] border border-zinc-800 hover:border-cyan-500/40 rounded-2xl flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-cyan-300 font-mono tracking-wider">
                          {s.roomCode}
                        </span>
                        {s.isArchived && (
                          <span className="text-[9px] uppercase font-bold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-md font-mono">
                            Archived
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Joined: {formatDate(s.joinedAt)} • Personal Focus:{" "}
                        <strong className="text-cyan-400 font-bold">{formatSeconds(s.personalFocusSeconds)}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleArchive(s.id, s.isArchived)}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-zinc-400 hover:text-cyan-300 transition-all cursor-pointer"
                        title={s.isArchived ? "Unarchive" : "Archive"}
                      >
                        {s.isArchived ? <RotateCcw className="h-4 w-4 text-cyan-400" /> : <Archive className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteSession(s.id)}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-pink-500/50 hover:text-pink-400 text-zinc-500 transition-all cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
