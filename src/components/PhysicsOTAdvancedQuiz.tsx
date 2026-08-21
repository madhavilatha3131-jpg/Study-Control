import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Award,
  Zap,
  Bookmark,
  Search,
  Check,
  Flame,
  X,
  Maximize2,
  Minimize2,
  Atom,
  AlertTriangle,
  Send,
  HelpCircle,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";
import { PHYSICS_OT_QUESTIONS, QuestionData } from "../data/physicsQuestions";
import { MathView } from "./MathView";

interface PhysicsOTAdvancedQuizProps {
  onClose?: () => void;
  isOpen: boolean;
}

export function PhysicsOTAdvancedQuiz({ isOpen, onClose }: PhysicsOTAdvancedQuizProps) {
  const [activeTab, setActiveTab] = useState<"test" | "review" | "scorecard" | "formulas">("test");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [examTimeLeft, setExamTimeLeft] = useState<number>(45 * 60); // 45 mins countdown
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "single" | "multi">("all");

  const containerRef = useRef<HTMLDivElement>(null);

  // Live Exam Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isOpen && !examSubmitted && examTimeLeft > 0) {
      timer = setInterval(() => {
        setExamTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timer as NodeJS.Timeout);
            handleAutoSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, examSubmitted, examTimeLeft]);

  if (!isOpen) return null;

  const currentQ: QuestionData = PHYSICS_OT_QUESTIONS[currentIdx] || PHYSICS_OT_QUESTIONS[0];

  const handleOptionToggle = (qId: string, optId: string, isMulti: boolean) => {
    if (examSubmitted) return;

    setSelectedAnswers((prev) => {
      const current = prev[qId] || [];
      if (!isMulti) {
        return { ...prev, [qId]: [optId] };
      } else {
        if (current.includes(optId)) {
          return { ...prev, [qId]: current.filter((x) => x !== optId) };
        } else {
          return { ...prev, [qId]: [...current, optId] };
        }
      }
    });
  };

  const handleClearResponse = (qId: string) => {
    if (examSubmitted) return;
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const handleToggleReview = (qId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleToggleBookmark = (qId: string) => {
    setBookmarked((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Evaluation & Scoring Logic
  const calculateScore = () => {
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    PHYSICS_OT_QUESTIONS.forEach((q) => {
      const userAns = selectedAnswers[q.id] || [];
      if (userAns.length === 0) {
        unattemptedCount++;
        return;
      }

      if (q.type === "single") {
        if (userAns.length === 1 && userAns[0] === q.correctAnswers[0]) {
          score += q.marks.pos;
          correctCount++;
        } else {
          score -= q.marks.neg;
          incorrectCount++;
        }
      } else {
        // Multi-correct scoring (+4 if all exact, partial +1 per correct if no wrong chosen, -2 if any wrong)
        const isExactMatch =
          userAns.length === q.correctAnswers.length &&
          userAns.every((a) => q.correctAnswers.includes(a));
        const hasWrongOption = userAns.some((a) => !q.correctAnswers.includes(a));

        if (isExactMatch) {
          score += q.marks.pos;
          correctCount++;
        } else if (!hasWrongOption && userAns.length > 0) {
          score += userAns.length;
          correctCount++;
        } else {
          score -= q.marks.neg;
          incorrectCount++;
        }
      }
    });

    return {
      score,
      maxScore: PHYSICS_OT_QUESTIONS.length * 4,
      correctCount,
      incorrectCount,
      unattemptedCount,
      attemptedCount: correctCount + incorrectCount,
      accuracy:
        correctCount + incorrectCount > 0
          ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
          : 0,
    };
  };

  const handleAutoSubmit = () => {
    setExamSubmitted(true);
    setShowSubmitModal(false);
    setActiveTab("scorecard");
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  };

  const resetExam = () => {
    setSelectedAnswers({});
    setMarkedForReview({});
    setExamSubmitted(false);
    setExamTimeLeft(45 * 60);
    setActiveTab("test");
    setCurrentIdx(0);
  };

  const stats = calculateScore();
  const minutes = Math.floor(examTimeLeft / 60);
  const seconds = examTimeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl overflow-hidden font-sans select-none text-zinc-100">
      <div
        ref={containerRef}
        className={`w-full max-w-6xl h-[94vh] max-h-[920px] bg-[#030712] border border-cyan-500/40 rounded-[28px] shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden relative ${
          isFullscreen ? "!fixed !inset-0 !max-w-none !h-full !rounded-none" : ""
        }`}
      >
        {/* TOP CYBER HUD EXAM APP BAR */}
        <div className="bg-[#050b18] px-6 py-3.5 flex items-center justify-between border-b border-cyan-500/30 shrink-0">
          {/* Brand & Module */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Atom className="h-5 w-5 text-cyan-400 animate-spin" style={{ animationDuration: "10s" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-cyan-400 orbitron">
                  PHYSICS OT ADVANCED PYQ
                </span>
                <span className="bg-pink-500/10 text-pink-400 border border-pink-500/40 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider rajdhani">
                  LIVE EXAM
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                Collisions & Impulse • High-Yield IIT-JEE Advanced Questions (Q23 – Q41)
              </p>
            </div>
          </div>

          {/* Center Timer Display (Locked in Live Mode) */}
          <div className="flex items-center gap-3">
            {!examSubmitted ? (
              <div className="flex items-center gap-2 bg-[#0d1527] border border-pink-500/50 px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(255,0,127,0.25)]">
                <Clock className="h-4 w-4 text-pink-400 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-pink-400/80 font-mono font-bold leading-none">
                    TIME REMAINING
                  </span>
                  <span className="font-mono font-black text-sm text-pink-300">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/40 px-4 py-1.5 rounded-xl">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono text-emerald-400 uppercase">
                  Exam Submitted & Evaluated
                </span>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded-xl bg-zinc-900/80 hover:bg-cyan-500/20 border border-zinc-700 hover:border-cyan-500/50 flex items-center justify-center text-zinc-400 hover:text-cyan-300 transition-all cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-zinc-900/80 hover:bg-pink-500/20 border border-zinc-700 hover:border-pink-500/50 flex items-center justify-center text-zinc-400 hover:text-pink-300 transition-all cursor-pointer"
                title="Close Window"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* SUBHEADER NAVIGATION & STATS STRIP */}
        <div className="bg-[#070e1e] border-b border-cyan-500/20 px-6 py-2.5 flex items-center justify-between shrink-0 select-none text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("test")}
              className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 cursor-pointer rajdhani ${
                activeTab === "test"
                  ? "bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{examSubmitted ? "Questions & Review" : "Live Test Portal"}</span>
            </button>

            {examSubmitted && (
              <button
                onClick={() => setActiveTab("scorecard")}
                className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 cursor-pointer rajdhani ${
                  activeTab === "scorecard"
                    ? "bg-pink-500 text-white font-extrabold shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                    : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Scorecard & Analysis</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("formulas")}
              className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 cursor-pointer rajdhani ${
                activeTab === "formulas"
                  ? "bg-purple-500 text-white font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Formulas Cheatsheet</span>
            </button>
          </div>

          <div className="flex items-center gap-5 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span>Attempted:</span>
              <strong className="text-cyan-400 font-bold">
                {Object.keys(selectedAnswers).length} / {PHYSICS_OT_QUESTIONS.length}
              </strong>
            </span>
            {examSubmitted && (
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span>Final Score:</span>
                <strong className={`font-bold ${stats.score >= 0 ? "text-emerald-400" : "text-pink-400"}`}>
                  {stats.score} Marks
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* TAB 1: LIVE TEST & QUESTION VIEW */}
        {activeTab === "test" && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
            {/* LEFT / CENTER: ACTIVE QUESTION DISPLAY (Col 8) */}
            <div className="lg:col-span-8 flex flex-col h-full border-r border-cyan-500/20 bg-[#040815] overflow-y-auto p-6 scrollbar-thin">
              {currentQ && (
                <div className="flex flex-col gap-5">
                  {/* Question Header */}
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-xs font-black uppercase font-mono shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                        QUESTION {currentQ.num}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border rajdhani tracking-wider ${
                          currentQ.type === "single"
                            ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                            : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                        }`}
                      >
                        {currentQ.type === "single"
                          ? `Single Correct (+${currentQ.marks.pos}, -${currentQ.marks.neg})`
                          : `Multiple Correct (+${currentQ.marks.pos}, -${currentQ.marks.neg})`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleBookmark(currentQ.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          bookmarked[currentQ.id]
                            ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(255,183,0,0.3)]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                        }`}
                        title="Bookmark Question"
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleReview(currentQ.id)}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer rajdhani ${
                          markedForReview[currentQ.id]
                            ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {markedForReview[currentQ.id] ? "Marked for Review" : "Mark Review"}
                      </button>
                    </div>
                  </div>

                  {/* Question Topic */}
                  <div className="text-[10px] font-black text-cyan-400/80 uppercase tracking-widest font-mono">
                    TOPIC: <span className="text-zinc-300">{currentQ.topic}</span>
                  </div>

                  {/* Problem Statement with KaTeX */}
                  <div className="text-zinc-200 text-sm leading-relaxed font-normal">
                    <MathView text={currentQ.questionText} />
                  </div>

                  {/* Visual Diagram Box */}
                  <div className="bg-[#070e20] border border-cyan-500/30 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                    <span className="absolute top-2 left-3 text-[9px] font-mono uppercase tracking-widest text-cyan-400/60 font-bold">
                      SCHEMATIC DIAGRAM
                    </span>
                    {currentQ.svgDiagram}
                  </div>

                  {/* Options List */}
                  <div className="flex flex-col gap-3 mt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 rajdhani">
                      {currentQ.type === "single"
                        ? "Select One Option:"
                        : "Select All Correct Options:"}
                    </span>

                    {currentQ.options.map((opt) => {
                      const userChoices = selectedAnswers[currentQ.id] || [];
                      const isSelected = userChoices.includes(opt.id);
                      const isCorrect = currentQ.correctAnswers.includes(opt.id);
                      const isRevealed = examSubmitted;

                      let cardStyle =
                        "bg-[#091124] border-zinc-800 hover:border-cyan-500/60 hover:bg-[#0c1730] text-zinc-200";

                      if (isSelected) {
                        cardStyle =
                          "bg-[#091d38] border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(0,240,255,0.35)]";
                      }

                      if (isRevealed) {
                        if (isCorrect) {
                          cardStyle =
                            "bg-emerald-950/50 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(0,255,102,0.3)] font-semibold";
                        } else if (isSelected && !isCorrect) {
                          cardStyle =
                            "bg-rose-950/50 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)]";
                        }
                      }

                      return (
                        <div
                          key={opt.id}
                          onClick={() =>
                            handleOptionToggle(
                              currentQ.id,
                              opt.id,
                              currentQ.type === "multi"
                            )
                          }
                          className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 cursor-pointer select-none ${cardStyle}`}
                        >
                          {/* Option Badge */}
                          <div
                            className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-all ${
                              isSelected
                                ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                                : "bg-zinc-900 text-zinc-400 border-zinc-700"
                            }`}
                          >
                            {isSelected ? <Check className="h-4 w-4 stroke-[3]" /> : opt.id}
                          </div>

                          {/* Render Option Content with MathView */}
                          <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed flex items-center gap-2">
                            <div className="overflow-x-auto py-1">
                              <MathView text={opt.latex || opt.text} />
                            </div>
                          </div>

                          {/* Evaluation Badges (Only in Review) */}
                          {isRevealed && isCorrect && (
                            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-mono shrink-0">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>CORRECT</span>
                            </div>
                          )}
                          {isRevealed && isSelected && !isCorrect && (
                            <div className="flex items-center gap-1 text-rose-400 text-xs font-bold font-mono shrink-0">
                              <XCircle className="h-4 w-4" />
                              <span>INCORRECT</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-cyan-500/20">
                    <button
                      onClick={() => handleClearResponse(currentQ.id)}
                      disabled={!selectedAnswers[currentQ.id] || examSubmitted}
                      className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer font-mono"
                    >
                      Clear Selection
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                        disabled={currentIdx === 0}
                        className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer font-mono"
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentIdx((i) =>
                            Math.min(PHYSICS_OT_QUESTIONS.length - 1, i + 1)
                          )
                        }
                        disabled={currentIdx === PHYSICS_OT_QUESTIONS.length - 1}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-black text-xs flex items-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] font-mono uppercase tracking-wider"
                      >
                        Next <ChevronRight className="h-4 w-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>

                  {/* POST-EXAM STEP-BY-STEP SOLUTION ACCORDION (Revealed ONLY after submission) */}
                  {examSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#060c1d] border border-cyan-500/40 rounded-2xl p-5 flex flex-col gap-3.5 shadow-[0_0_30px_rgba(0,240,255,0.15)] mt-2"
                    >
                      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-400 orbitron">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Detailed Mathematical Derivation</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold">
                          Correct Option(s): {currentQ.correctAnswers.join(", ")}
                        </span>
                      </div>

                      {currentQ.explanation.keyFormula && (
                        <div className="bg-[#0b1428] border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300">
                          <span className="text-[9px] text-amber-400 uppercase tracking-widest block font-bold font-mono mb-1">
                            Core Physics Principle & Master Formula:
                          </span>
                          <MathView text={currentQ.explanation.keyFormula} />
                        </div>
                      )}

                      <div className="space-y-2 text-xs leading-relaxed text-zinc-300 font-sans">
                        {currentQ.explanation.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex gap-2.5 items-start">
                            <span className="text-cyan-400 font-mono font-bold shrink-0">
                              {sIdx + 1}.
                            </span>
                            <div>
                              <MathView text={step} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-1 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
                        <strong>Summary: </strong>
                        <MathView text={currentQ.explanation.summary} />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT: QUESTION PALETTE & NAVIGATION (Col 4) */}
            <div className="lg:col-span-4 bg-[#030610] p-5 flex flex-col justify-between h-full overflow-y-auto border-l border-cyan-500/10">
              <div className="flex flex-col gap-4">
                {/* Search */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 orbitron">
                      QUESTION PALETTE
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {PHYSICS_OT_QUESTIONS.length} Questions
                    </span>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter topics or questions..."
                      className="w-full bg-[#080f20] border border-zinc-800 focus:border-cyan-500/50 py-1.5 pl-8 pr-3 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Legend Indicators */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-zinc-400 bg-[#070e1e] p-2.5 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-cyan-500 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                    <span>Answered ({Object.keys(selectedAnswers).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span>Review ({Object.keys(markedForReview).filter((k) => markedForReview[k]).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-400 shadow-[0_0_8px_rgba(255,183,0,0.8)]" />
                    <span>Bookmarked ({Object.keys(bookmarked).filter((k) => bookmarked[k]).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-zinc-700" />
                    <span>Unanswered</span>
                  </div>
                </div>

                {/* Question Grid Buttons */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {PHYSICS_OT_QUESTIONS.map((q, idx) => {
                    const isAnswered = !!selectedAnswers[q.id];
                    const isReview = !!markedForReview[q.id];
                    const isBook = !!bookmarked[q.id];
                    const isCurrent = currentIdx === idx;

                    let bg = "bg-[#091124] border-zinc-800 text-zinc-400 hover:border-zinc-700";
                    if (isAnswered) bg = "bg-cyan-500 border-cyan-400 text-black font-black shadow-[0_0_10px_rgba(0,240,255,0.4)]";
                    if (isReview) bg = "bg-purple-600 border-purple-400 text-white font-black shadow-[0_0_10px_rgba(168,85,247,0.4)]";

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-11 rounded-xl border flex flex-col items-center justify-center relative text-xs font-mono font-bold transition-all cursor-pointer ${bg} ${
                          isCurrent ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#030610]" : ""
                        }`}
                      >
                        <span>Q{q.num}</span>
                        {isBook && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Final Test Button */}
              <div className="pt-4 border-t border-cyan-500/20 flex flex-col gap-2 mt-4">
                {!examSubmitted ? (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-[0_0_20px_rgba(255,0,127,0.4)] flex items-center justify-center gap-2 orbitron"
                  >
                    <Send className="h-4 w-4" />
                    <span>SUBMIT LIVE EXAM</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab("scorecard")}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 orbitron"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>VIEW FINAL SCORECARD</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCORECARD & PERFORMANCE ANALYSIS (Revealed ONLY after submission) */}
        {activeTab === "scorecard" && (
          <div className="flex-1 p-6 overflow-y-auto bg-[#040815] flex flex-col gap-6 scrollbar-thin">
            {/* Top Score Banner */}
            <div className="bg-gradient-to-r from-[#060e22] via-[#091533] to-[#060e22] border border-cyan-500/40 rounded-[28px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,183,0,0.5)] shrink-0">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 orbitron">
                    OFFICIAL SCORECARD & PERFORMANCE REPORT
                  </span>
                  <h3 className="text-3xl font-black text-white mt-0.5 font-mono">
                    {stats.score} / {stats.maxScore} <span className="text-sm font-normal text-zinc-400">Marks</span>
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1 font-mono">
                    Net Accuracy: <strong className="text-emerald-400">{stats.accuracy}%</strong> • Questions Attempted:{" "}
                    <strong className="text-cyan-300">
                      {stats.attemptedCount} / {PHYSICS_OT_QUESTIONS.length}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab("test");
                    setCurrentIdx(0);
                  }}
                  className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)] orbitron"
                >
                  Review Step-by-Step Solutions
                </button>
                <button
                  onClick={resetExam}
                  className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer font-mono flex items-center gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Retake Test
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#070e20] p-4 rounded-2xl border border-emerald-500/30 shadow-[0_0_15px_rgba(0,255,102,0.1)] flex flex-col">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider rajdhani">
                  Correct Answers
                </span>
                <span className="text-2xl font-black text-emerald-300 mt-1 font-mono">
                  {stats.correctCount}
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5 font-mono">+4 Marks Earned</span>
              </div>

              <div className="bg-[#070e20] p-4 rounded-2xl border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)] flex flex-col">
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider rajdhani">
                  Incorrect Answers
                </span>
                <span className="text-2xl font-black text-rose-300 mt-1 font-mono">
                  {stats.incorrectCount}
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5 font-mono">Negative Penalty Applied</span>
              </div>

              <div className="bg-[#070e20] p-4 rounded-2xl border border-zinc-800 flex flex-col">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider rajdhani">
                  Unattempted
                </span>
                <span className="text-2xl font-black text-zinc-300 mt-1 font-mono">
                  {stats.unattemptedCount}
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5 font-mono">0 Marks Impact</span>
              </div>

              <div className="bg-[#070e20] p-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] flex flex-col">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider rajdhani">
                  Net Accuracy
                </span>
                <span className="text-2xl font-black text-cyan-300 mt-1 font-mono">
                  {stats.accuracy}%
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5 font-mono">Target &gt; 80% for IIT Top 500</span>
              </div>
            </div>

            {/* Question Breakdown List */}
            <div className="bg-[#060c1d] rounded-2xl border border-zinc-800 p-5 flex flex-col gap-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 orbitron">
                Question Breakdown & Solution Navigation
              </h4>
              <div className="divide-y divide-zinc-800/80">
                {PHYSICS_OT_QUESTIONS.map((q, idx) => {
                  const userAns = selectedAnswers[q.id] || [];
                  const isCorrect =
                    q.type === "single"
                      ? userAns.length === 1 && userAns[0] === q.correctAnswers[0]
                      : userAns.length === q.correctAnswers.length &&
                        userAns.every((a) => q.correctAnswers.includes(a));
                  const isAttempted = userAns.length > 0;

                  return (
                    <div
                      key={q.id}
                      onClick={() => {
                        setCurrentIdx(idx);
                        setActiveTab("test");
                      }}
                      className="py-3.5 flex items-center justify-between hover:bg-[#0b152d] px-3 rounded-xl transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-cyan-400 w-8">
                          #{q.num}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-200">{q.title}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{q.topic}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isAttempted ? (
                          isCorrect ? (
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-lg flex items-center gap-1 font-mono">
                              <CheckCircle2 className="h-3 w-3" /> Correct (+{q.marks.pos})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold rounded-lg flex items-center gap-1 font-mono">
                              <XCircle className="h-3 w-3" /> Incorrect (-{q.marks.neg})
                            </span>
                          )
                        ) : (
                          <span className="px-2.5 py-1 bg-zinc-800/80 text-zinc-500 text-[10px] font-mono rounded-lg">
                            Skipped
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-zinc-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KEY FORMULA CHEATSHEET */}
        {activeTab === "formulas" && (
          <div className="flex-1 p-6 overflow-y-auto bg-[#040815] grid grid-cols-1 md:grid-cols-2 gap-4 scrollbar-thin">
            <div className="bg-[#070e20] p-5 rounded-2xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-cyan-400 font-mono tracking-wider orbitron">
                1D Head-on Elastic Collision
              </span>
              <h4 className="text-sm font-bold text-zinc-200">Velocity Formulas</h4>
              <div className="font-mono text-xs bg-[#0b1428] border border-cyan-500/20 p-3 rounded-xl text-cyan-200">
                <MathView text="v_1 = \frac{m_1 - m_2}{m_1 + m_2}u_1 + \frac{2m_2}{m_1 + m_2}u_2" /><br />
                <MathView text="v_2 = \frac{2m_1}{m_1 + m_2}u_1 + \frac{m_2 - m_1}{m_1 + m_2}u_2" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Equal masses (m₁ = m₂) exchange their velocities completely upon elastic impact.
              </p>
            </div>

            <div className="bg-[#070e20] p-5 rounded-2xl border border-pink-500/30 shadow-[0_0_15px_rgba(255,0,127,0.1)] flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-pink-400 font-mono tracking-wider orbitron">
                Coefficient of Restitution (e)
              </span>
              <h4 className="text-sm font-bold text-zinc-200">Newton's Restitution Law</h4>
              <div className="font-mono text-xs bg-[#0b1428] border border-pink-500/20 p-3 rounded-xl text-pink-200">
                <MathView text="e = \frac{\text{Separation Velocity}}{\text{Approach Velocity}} = \frac{v_2 - v_1}{u_1 - u_2}" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                e = 1 for perfectly elastic; e = 0 for completely inelastic (bodies stick together).
              </p>
            </div>

            <div className="bg-[#070e20] p-5 rounded-2xl border border-amber-500/30 shadow-[0_0_15px_rgba(255,183,0,0.1)] flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-amber-400 font-mono tracking-wider orbitron">
                Kinetic Energy Loss in Inelastic Impact
              </span>
              <h4 className="text-sm font-bold text-zinc-200">Loss Formula</h4>
              <div className="font-mono text-xs bg-[#0b1428] border border-amber-500/20 p-3 rounded-xl text-amber-200">
                <MathView text="\Delta K = \frac{m_1 m_2}{2(m_1 + m_2)} (u_1 - u_2)^2 (1 - e^2)" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                When moving in opposite directions, relative speed term becomes (u₁ + u₂)².
              </p>
            </div>

            <div className="bg-[#070e20] p-5 rounded-2xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)] flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-purple-400 font-mono tracking-wider orbitron">
                Oblique Collision on Smooth Plane
              </span>
              <h4 className="text-sm font-bold text-zinc-200">Tangential & Normal Reflection</h4>
              <div className="font-mono text-xs bg-[#0b1428] border border-purple-500/20 p-3 rounded-xl text-purple-200">
                <MathView text="v_t = u_t, \quad v_n = e \cdot u_n \implies \tan\alpha = \frac{\tan\theta}{e}" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Resulting rebound speed: v = u · √(sin²θ + e²cos²θ).
              </p>
            </div>
          </div>
        )}

        {/* CONFIRMATION MODAL BEFORE SUBMITTING */}
        <AnimatePresence>
          {showSubmitModal && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#060d1e] border border-pink-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(255,0,127,0.3)] flex flex-col gap-4 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/50 text-pink-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(255,0,127,0.3)]">
                  <AlertTriangle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white orbitron">Submit Live Exam?</h3>
                  <p className="text-zinc-400 text-xs mt-1 font-mono">
                    Once submitted, your responses will be evaluated and full step-by-step solutions will be unlocked.
                  </p>
                </div>

                <div className="bg-[#09142c] p-3 rounded-2xl border border-zinc-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Attempted</span>
                    <strong className="text-cyan-400 font-bold text-sm">
                      {Object.keys(selectedAnswers).length}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Marked</span>
                    <strong className="text-purple-400 font-bold text-sm">
                      {Object.keys(markedForReview).filter((k) => markedForReview[k]).length}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Remaining</span>
                    <strong className="text-pink-400 font-bold text-sm">
                      {PHYSICS_OT_QUESTIONS.length - Object.keys(selectedAnswers).length}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold text-xs uppercase rounded-xl transition-all cursor-pointer font-mono"
                  >
                    Resume Test
                  </button>
                  <button
                    onClick={handleAutoSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black text-xs uppercase rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(255,0,127,0.5)] orbitron"
                  >
                    Confirm Submit
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
