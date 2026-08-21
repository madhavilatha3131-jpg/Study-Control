import React from "react";
import { X, Trophy, ShieldAlert, Cpu, Award, Zap, Activity, Radio } from "lucide-react";
import { Participant } from "../types";
import { motion } from "motion/react";

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: Participant | null;
  isMe: boolean;
}

export default function ParticipantModal({ isOpen, onClose, participant, isMe }: ParticipantModalProps) {
  if (!isOpen || !participant) return null;

  // Compute their live local session focus time
  let liveSeconds = participant.totalSeconds;
  if (participant.isActive && participant.focusStartedAt) {
    const elapsed = Math.floor((Date.now() - new Date(participant.focusStartedAt).getTime()) / 1000);
    liveSeconds += Math.max(0, elapsed);
  }

  const formatSec = (total: number) => {
    const hh = Math.floor(total / 3600);
    const mm = Math.floor((total % 3600) / 60);
    const ss = total % 60;
    if (hh > 0) {
      return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
    }
    return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  };

  // Determine avatar color index
  const hash = participant.username.charCodeAt(0) % 6;
  const avatars = [
    { bg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]" },
    { bg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]" },
    { bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,102,0.3)]" },
    { bg: "bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]" },
    { bg: "bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]" },
    { bg: "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_15px_rgba(255,183,0,0.3)]" },
  ];
  const color = avatars[hash];

  // Get Avatar Initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(/[\s_.-]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-sm bg-[#040918] border border-cyan-500/40 rounded-[28px] relative overflow-hidden flex flex-col p-6 shadow-[0_0_40px_rgba(0,240,255,0.2)] text-zinc-100"
        id="participant-modal-container"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-pink-500/50 hover:bg-pink-500/10 text-zinc-400 hover:text-pink-300 transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* User Profile Block */}
        <div className="flex flex-col items-center justify-center gap-3 mt-4 text-center select-none">
          <div 
            className={`w-18 h-18 rounded-2xl border-2 flex items-center justify-center text-xl font-bold font-mono relative ${color.bg}`}
          >
            {getInitials(participant.username)}
            {participant.isActive && !participant.isOffline && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#040918] rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </span>
            )}
          </div>
          <div className="flex flex-col mt-1">
            <h3 className="text-lg font-black text-cyan-300 font-mono flex items-center justify-center gap-2">
              {participant.username}
              {isMe && (
                <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  You
                </span>
              )}
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1 font-mono">
              TELEMETRY ID: {participant.id.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Focus stats grid */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="grid grid-cols-2 gap-3 select-none">
            <div className="bg-[#071026] border border-cyan-500/30 rounded-2xl p-4 flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold tracking-wider">Session focus</span>
              <span className="text-lg font-black text-cyan-400 font-mono mt-1">{formatSec(liveSeconds)}</span>
              <span className="text-[9px] text-zinc-500 font-mono mt-1">in this room</span>
            </div>
            <div className="bg-[#071026] border border-purple-500/30 rounded-2xl p-4 flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold tracking-wider">Today's total</span>
              <span className="text-lg font-black text-purple-400 font-mono mt-1">{formatSec(participant.dailySeconds)}</span>
              <span className="text-[9px] text-zinc-500 font-mono mt-1">cumulative</span>
            </div>
          </div>

          {/* Detailed Status Table */}
          <div className="bg-[#071026] border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2.5 font-mono text-xs">
            <div className="flex justify-between border-b border-zinc-800 pb-2 text-zinc-500 font-bold uppercase text-[10px] tracking-wider">
              <span>Telemetry Node</span>
              <span>Status Signal</span>
            </div>
            
            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400">Signal Tunnel</span>
              <span className={`font-bold flex items-center gap-1 text-[11px] ${participant.isOffline ? "text-pink-400" : "text-emerald-400"}`}>
                <Radio className={`h-3 w-3 ${!participant.isOffline && "animate-pulse"}`} />
                {participant.isOffline ? "DISCONNECTED" : "ONLINE CONNECTED"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400">Focus State</span>
              <span className={`font-bold text-[11px] ${participant.isActive ? "text-cyan-400" : "text-zinc-500"}`}>
                {participant.isActive ? "FOCUS LOCK ACTIVE" : "IDLE / BREAK"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400">Security Clearance</span>
              <span className="font-bold text-zinc-300 text-[11px]">
                {participant.role === "admin" ? (
                  <span className="text-indigo-400 font-black tracking-wide uppercase">WORKSPACE ADMIN</span>
                ) : participant.role === "co-host" ? (
                  <span className="text-purple-400 font-bold uppercase">CO-HOST</span>
                ) : (
                  <span className="text-zinc-400 uppercase">STUDENT</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
