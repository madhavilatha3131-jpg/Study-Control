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
    { bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    { bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
    { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    { bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-sm bg-zinc-900 border border-white/[0.08] rounded-[32px] relative overflow-hidden flex flex-col p-6 shadow-2xl animate-in duration-200"
        id="participant-modal-container"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* User Profile Block */}
        <div className="flex flex-col items-center justify-center gap-3 mt-4 text-center select-none">
          <div 
            className={`w-18 h-18 rounded-full border-2 flex items-center justify-center text-xl font-bold font-sans relative ${color.bg}`}
          >
            {getInitials(participant.username)}
            {participant.isActive && !participant.isOffline && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </span>
            )}
          </div>
          <div className="flex flex-col mt-1">
            <h3 className="text-lg font-black text-white flex items-center justify-center gap-2">
              {participant.username}
              {isMe && (
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  You
                </span>
              )}
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
              Member ID: {participant.id.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Focus stats grid */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="grid grid-cols-2 gap-3 select-none">
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4 flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Session focus</span>
              <span className="text-lg font-black text-cyan-400 mt-1">{formatSec(liveSeconds)}</span>
              <span className="text-[9px] text-zinc-400 font-medium mt-1">active in this space</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4 flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Today's total</span>
              <span className="text-lg font-black text-indigo-400 mt-1">{formatSec(participant.dailySeconds)}</span>
              <span className="text-[9px] text-zinc-400 font-medium mt-1">cumulative daily focus</span>
            </div>
          </div>

          {/* Detailed Status Table */}
          <div className="bg-black/20 border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3 font-sans text-xs">
            <div className="flex justify-between border-b border-white/[0.06] pb-2 text-zinc-500 font-bold uppercase text-[10px] tracking-wider">
              <span>Status Parameter</span>
              <span>Report Value</span>
            </div>
            
            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400 font-medium">Channel Link</span>
              <span className={`font-bold flex items-center gap-1 text-[11px] ${participant.isOffline ? "text-rose-400" : "text-emerald-400"}`}>
                <Radio className={`h-3 w-3 ${!participant.isOffline && "animate-pulse"}`} />
                {participant.isOffline ? "OFFLINE" : "ONLINE CONNECTED"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400 font-medium">Focus Process</span>
              <span className={`font-bold text-[11px] ${participant.isActive ? "text-cyan-400" : "text-zinc-500"}`}>
                {participant.isActive ? "RUNNING STUDY LOCK" : "IDLE / BREAK"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400 font-medium">System Role</span>
              <span className="font-bold text-zinc-300 text-[11px]">
                {participant.role === "admin" ? (
                  <span className="text-indigo-400 font-black tracking-wide uppercase">SPACE OWNER</span>
                ) : participant.role === "co-host" ? (
                  <span className="text-purple-400 font-bold uppercase">CO-HOST</span>
                ) : (
                  <span className="text-zinc-500 uppercase">STUDENT</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
