import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Filter,
  BarChart3,
  Award,
  Layers,
  Zap,
  Bookmark,
  Share2,
  Search,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  X,
  Maximize2,
  Minimize2,
  Atom,
} from "lucide-react";

export interface QuestionData {
  id: string;
  num: number;
  title: string;
  topic: string;
  type: "single" | "multi";
  marks: { pos: number; neg: number };
  questionText: string;
  formulaNote?: string;
  svgDiagram: React.ReactNode;
  options: { id: string; label: string; text: string }[];
  correctAnswers: string[];
  explanation: {
    keyFormula?: string;
    steps: string[];
    summary: string;
  };
}

export const PHYSICS_OT_QUESTIONS: QuestionData[] = [
  {
    id: "q23",
    num: 23,
    title: "Velocity for Vertical Loop of nth Bead",
    topic: "Head-on Elastic Collisions & Circular Motion",
    type: "single",
    marks: { pos: 4, neg: 1 },
    questionText:
      "n beads are resting on a smooth horizontal wire which is circular at the end with radius R. The masses of the beads are m, m/2, m/4, ..., m/2^(n-1) respectively. Find the minimum velocity u that must be imparted to the first bead of mass m such that the n-th bead will complete the circular vertical loop of radius R and fall into the tank. All collisions are perfectly elastic.",
    formulaNote: "For m₁ with stationary m₂ = m₁/2: v₂ = 2m₁/(m₁+m₂) · u = (4/3)u",
    svgDiagram: (
      <svg className="w-full max-w-[480px] h-36" viewBox="0 0 460 140">
        <defs>
          <linearGradient id="wireGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="70%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="tankGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <marker id="arrowRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>
        <line x1="20" y1="95" x2="280" y2="95" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
        
        {/* Bead 1 */}
        <circle cx="55" cy="95" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <text x="55" y="72" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0284c7">m</text>
        <line x1="18" y1="95" x2="36" y2="95" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
        <text x="24" y="85" fontSize="12" fontWeight="bold" fill="#ef4444">u</text>

        {/* Bead 2 */}
        <circle cx="120" cy="95" r="11" fill="#0ea5e9" stroke="#7dd3fc" strokeWidth="1.5" />
        <text x="120" y="74" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0284c7">m/2</text>

        {/* Bead 3 */}
        <circle cx="175" cy="95" r="8" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1.5" />
        <text x="175" y="76" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0284c7">m/4</text>

        {/* Ellipsis */}
        <text x="215" y="98" fontSize="18" fontWeight="bold" fill="#64748b" letterSpacing="3">...</text>

        {/* Bead n */}
        <circle cx="260" cy="95" r="6" fill="#7dd3fc" stroke="#e0f2fe" strokeWidth="1.5" />
        <text x="260" y="82" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0284c7">nth</text>

        {/* Vertical Loop */}
        <path d="M 280 95 A 42 42 0 1 1 330 55" fill="none" stroke="url(#wireGrad)" strokeWidth="3.5" strokeDasharray="3 1" />
        
        {/* Tank */}
        <path d="M 320 100 L 375 100 L 365 130 L 330 130 Z" fill="url(#tankGrad)" stroke="#0284c7" strokeWidth="2" />
        <text x="348" y="118" fontSize="10" textAnchor="middle" fontWeight="bold" fill="#ffffff">TANK</text>
        <text x="330" y="45" fontSize="10" fontWeight="bold" fill="#6366f1">Radius R</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "((3/4)^(n-1)) · √(5gR)" },
      { id: "B", label: "(B)", text: "((4/3)^(n-1)) · √(5gR)" },
      { id: "C", label: "(C)", text: "((3/4)^(n-1)) · 2√(gR)" },
      { id: "D", label: "(D)", text: "((4/3)^(n-1)) · 2√(gR)" },
    ],
    correctAnswers: ["A"],
    explanation: {
      keyFormula: "v₂ = [2m₁ / (m₁ + m₂)] · u₁ for elastic collision with stationary target",
      steps: [
        "For the 1st collision (m₁ = m, m₂ = m/2): v₂ = [2m / (m + m/2)] · u = (4/3)u.",
        "By induction, after each collision with half-mass, speed scales by (4/3).",
        "Speed of n-th bead v_n = (4/3)^(n-1) · u.",
        "To complete a vertical loop of radius R, minimum speed at the lowest point is √(5gR).",
        "Therefore: (4/3)^(n-1) · u ≥ √(5gR) ⟹ u = (3/4)^(n-1) · √(5gR).",
      ],
      summary: "Option (A) is correct. Each successive collision amplifies velocity by (4/3), requiring initial velocity u = (3/4)^(n-1)√(5gR).",
    },
  },
  {
    id: "q24",
    num: 24,
    title: "Bouncing Balls Timing & Restitution Condition",
    topic: "Coefficient of Restitution & Multi-Bounce Kinematics",
    type: "single",
    marks: { pos: 4, neg: 1 },
    questionText:
      "Two identical balls are dropped from the same height h₀ onto a hard floor. The second ball is released from the top at the exact instant the first ball makes its first impact with the ground. If the first ball completes two subsequent bounces in the time taken by the second ball to reach the ground, find the condition for the coefficient of restitution e.",
    formulaNote: "Time of flight of dropped ball = √(2h₀/g); Total bounce time = 2e√(2h₀/g) + 2e²√(2h₀/g)",
    svgDiagram: (
      <svg className="w-full max-w-[440px] h-36" viewBox="0 0 420 140">
        <line x1="20" y1="120" x2="400" y2="120" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        {/* Ball 2 */}
        <line x1="70" y1="20" x2="70" y2="115" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="70" cy="22" r="10" fill="#ef4444" stroke="#f87171" strokeWidth="2" />
        <text x="70" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">Ball 2 (t=0)</text>
        <text x="40" y="70" fontSize="10" fill="#64748b">Height h₀</text>

        {/* Ball 1 Bounces */}
        <circle cx="160" cy="110" r="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <path d="M 160 120 Q 205 30 250 120" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="3 2" />
        <path d="M 250 120 Q 285 65 320 120" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="3 2" />
        
        <text x="205" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0284c7">1st Bounce (2t₁)</text>
        <text x="285" y="58" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0284c7">2nd Bounce (2t₂)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "e > 0.5" },
      { id: "B", label: "(B)", text: "e = 0.5" },
      { id: "C", label: "(C)", text: "e ≤ (√3 - 1) / 2" },
      { id: "D", label: "(D)", text: "e = (√3 + 1) / 2" },
    ],
    correctAnswers: ["C"],
    explanation: {
      keyFormula: "t₀ = √(2h₀/g), t₁ = e·t₀, t₂ = e²·t₀",
      steps: [
        "Time taken by Ball 2 to fall from height h₀ to ground: t₀ = √(2h₀/g).",
        "Time for 1st bounce of Ball 1: 2t₁ = 2e · √(2h₀/g).",
        "Time for 2nd bounce of Ball 1: 2t₂ = 2e² · √(2h₀/g).",
        "Condition: 2t₁ + 2t₂ ≤ t₀  ⟹  2e + 2e² ≤ 1  ⟹  2e² + 2e - 1 ≤ 0.",
        "Solving quadratic equation 2e² + 2e - 1 = 0 yields e = [-2 ± √(4 + 8)] / 4 = (-1 + √3)/2.",
        "Since e > 0, the valid physical domain is e ≤ (√3 - 1)/2.",
      ],
      summary: "Option (C) is correct. Solving the inequality 2e² + 2e - 1 ≤ 0 gives e ≤ (√3 - 1)/2.",
    },
  },
  {
    id: "q25",
    num: 25,
    title: "1D Head-on Elastic Collision Between Moving Masses",
    topic: "Momentum & Kinetic Energy Conservation",
    type: "single",
    marks: { pos: 4, neg: 1 },
    questionText:
      "A body of mass m₁ = 2 kg moving with an initial velocity u₁ = 4 m/s undergoes a head-on perfectly elastic collision with another body of mass m₂ = 1 kg moving with velocity u₂ = -2 m/s. Determine their velocities (v₁, v₂) immediately after the collision.",
    formulaNote: "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂ and v₂ - v₁ = u₁ - u₂",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-28" viewBox="0 0 400 110">
        <line x1="20" y1="85" x2="380" y2="85" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        
        {/* Block 1 */}
        <rect x="70" y="45" width="45" height="40" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <text x="92" y="70" fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="bold">2 kg</text>
        <line x1="120" y1="65" x2="160" y2="65" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arrowRed)" />
        <text x="140" y="55" fontSize="11" fontWeight="bold" fill="#0284c7">4 m/s</text>

        {/* Block 2 */}
        <rect x="250" y="52" width="36" height="33" rx="6" fill="#10b981" stroke="#34d399" strokeWidth="2" />
        <text x="268" y="73" fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="bold">1 kg</text>
        <line x1="245" y1="68" x2="205" y2="68" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowRed)" />
        <text x="225" y="58" fontSize="11" fontWeight="bold" fill="#10b981">2 m/s (←)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "v₁ = 0 m/s, v₂ = 6 m/s" },
      { id: "B", label: "(B)", text: "v₁ = 2 m/s, v₂ = 4 m/s" },
      { id: "C", label: "(C)", text: "v₁ = -1 m/s, v₂ = 5 m/s" },
      { id: "D", label: "(D)", text: "v₁ = 1 m/s, v₂ = 3 m/s" },
    ],
    correctAnswers: ["A"],
    explanation: {
      keyFormula: "Conservation of Linear Momentum + Newton's Law of Restitution (e = 1)",
      steps: [
        "1. Momentum Conservation: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂",
        "   2(4) + 1(-2) = 2v₁ + v₂  ⟹  6 = 2v₁ + v₂  --- (Eq 1)",
        "2. Elastic restitution condition (e = 1): v₂ - v₁ = u₁ - u₂",
        "   v₂ - v₁ = 4 - (-2) = 6  ⟹  v₂ = v₁ + 6  --- (Eq 2)",
        "3. Substitute Eq 2 into Eq 1: 2v₁ + (v₁ + 6) = 6  ⟹  3v₁ = 0  ⟹  v₁ = 0 m/s.",
        "4. Substitute back: v₂ = 0 + 6 = 6 m/s.",
      ],
      summary: "Option (A) is correct. Mass m₁ halts completely (v₁ = 0 m/s) and m₂ rebounds forward at 6 m/s.",
    },
  },
  {
    id: "q26",
    num: 26,
    title: "Oblique Elastic Collision & Deflection Angle",
    topic: "2D Oblique Elastic Collision",
    type: "single",
    marks: { pos: 4, neg: 1 },
    questionText:
      "A moving sphere collides obliquely and elastically with an identical stationary sphere on a smooth table. After collision, their velocity directions are mutually perpendicular, and the first sphere is deflected by 60° with respect to the second sphere's motion. Find the ratio of their final speeds v₁ / v₂.",
    formulaNote: "Two identical spheres undergoing elastic oblique collision always emerge mutually perpendicular (θ₁ + θ₂ = 90°)",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-32" viewBox="0 0 400 120">
        <line x1="30" y1="60" x2="150" y2="60" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="150" cy="60" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        
        {/* v1 Vector */}
        <line x1="150" y1="60" x2="250" y2="15" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arrowRed)" />
        <text x="260" y="20" fontSize="12" fontWeight="bold" fill="#0284c7">v₁</text>

        {/* v2 Vector */}
        <line x1="150" y1="60" x2="250" y2="105" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowRed)" />
        <text x="260" y="110" fontSize="12" fontWeight="bold" fill="#10b981">v₂</text>

        {/* Angle Arc */}
        <path d="M 180 47 A 35 35 0 0 1 180 75" fill="none" stroke="#ef4444" strokeWidth="2" />
        <text x="200" y="65" fontSize="11" fontWeight="bold" fill="#ef4444">60°</text>
        <text x="80" y="50" fontSize="11" fill="#64748b">Incident u</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "1 / √3" },
      { id: "B", label: "(B)", text: "√3" },
      { id: "C", label: "(C)", text: "1" },
      { id: "D", label: "(D)", text: "1 / 3" },
    ],
    correctAnswers: ["B"],
    explanation: {
      keyFormula: "tan(60°) = v₁ / v₂ = √3",
      steps: [
        "In an elastic oblique collision between equal masses with one initially at rest, the angle between v₁ and v₂ is 90°.",
        "From vector velocity triangle decomposition, the ratio of components satisfies tan θ = v₁ / v₂.",
        "With angle θ = 60°: v₁ / v₂ = tan(60°) = √3.",
      ],
      summary: "Option (B) is correct. The ratio of final speeds is √3.",
    },
  },
  {
    id: "q27",
    num: 27,
    title: "Maximum Spring Compression in Connected System",
    topic: "Reduced Mass & Center of Mass Energy",
    type: "single",
    marks: { pos: 4, neg: 1 },
    questionText:
      "Two blocks of masses m₁ = 3 kg and m₂ = 6 kg are placed on a smooth horizontal surface and connected by a light spring of force constant k = 200 N/m. Initially, the spring is unstretched. Velocities u₁ = -2 m/s and u₂ = 3 m/s are imparted to the blocks. The maximum extension/compression of the spring will be:",
    formulaNote: "Maximum deformation: (1/2)·μ·(u_rel)² = (1/2)·k·(x_max)², where μ = m₁m₂/(m₁+m₂)",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-28" viewBox="0 0 400 110">
        <line x1="20" y1="85" x2="380" y2="85" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        
        {/* Block 1 */}
        <rect x="50" y="45" width="45" height="40" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <text x="72" y="70" fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="bold">3 kg</text>
        <line x1="45" y1="65" x2="15" y2="65" stroke="#0284c7" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
        <text x="25" y="55" fontSize="10" fontWeight="bold" fill="#0284c7">2 m/s (←)</text>

        {/* Spring */}
        <path d="M 95 65 Q 110 40 125 65 T 155 65 T 185 65 T 215 65 T 245 65" fill="none" stroke="#64748b" strokeWidth="3.5" />
        <text x="170" y="48" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">k = 200 N/m</text>

        {/* Block 2 */}
        <rect x="245" y="40" width="55" height="45" rx="6" fill="#10b981" stroke="#34d399" strokeWidth="2" />
        <text x="272" y="68" fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="bold">6 kg</text>
        <line x1="305" y1="65" x2="335" y2="65" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
        <text x="315" y="55" fontSize="10" fontWeight="bold" fill="#10b981">3 m/s (→)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "25 cm" },
      { id: "B", label: "(B)", text: "30 cm" },
      { id: "C", label: "(C)", text: "50 cm" },
      { id: "D", label: "(D)", text: "75 cm" },
    ],
    correctAnswers: ["C"],
    explanation: {
      keyFormula: "Using reduced mass μ = (m₁ · m₂) / (m₁ + m₂)",
      steps: [
        "1. Calculate reduced mass: μ = (3 × 6) / (3 + 6) = 18 / 9 = 2 kg.",
        "2. Relative initial speed: u_rel = |3 - (-2)| = 5 m/s.",
        "3. Conservation of mechanical energy in CM frame:",
        "   (1/2) · μ · (u_rel)² = (1/2) · k · (x_max)²",
        "   (1/2) · 2 · (5)² = (1/2) · 200 · (x_max)²",
        "   25 = 100 · (x_max)²  ⟹  (x_max)² = 0.25  ⟹  x_max = 0.5 m = 50 cm.",
      ],
      summary: "Option (C) is correct. The maximum deformation is 0.50 m (50 cm).",
    },
  },
  {
    id: "q28",
    num: 28,
    title: "Fractional Kinetic Energy Loss & Restitution",
    topic: "Inelastic Collision Mechanics",
    type: "single",
    marks: { pos: 4, neg: 1 },
    questionText:
      "A ball of mass m moving at a speed v makes a head-on collision with an identical ball at rest. The total kinetic energy of the system after collision is 3/4 of the initial kinetic energy. The coefficient of restitution e is:",
    formulaNote: "Final KE: K_f = (1/4)·m·v²·(1 + e²); K_i = (1/2)·m·v²",
    svgDiagram: (
      <svg className="w-full max-w-[400px] h-28" viewBox="0 0 380 110">
        <line x1="20" y1="85" x2="360" y2="85" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        <circle cx="90" cy="65" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <text x="90" y="70" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">m</text>
        <line x1="112" y1="65" x2="152" y2="65" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arrowRed)" />
        <text x="132" y="55" fontSize="11" fontWeight="bold" fill="#0284c7">v</text>

        <circle cx="250" cy="65" r="16" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
        <text x="250" y="70" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">m</text>
        <text x="250" y="42" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle">at rest</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "1 / 2" },
      { id: "B", label: "(B)", text: "1 / √2" },
      { id: "C", label: "(C)", text: "√3 / 2" },
      { id: "D", label: "(D)", text: "1 / √3" },
    ],
    correctAnswers: ["B"],
    explanation: {
      keyFormula: "v₁ = (1-e)v / 2,  v₂ = (1+e)v / 2",
      steps: [
        "1. Post-collision velocities: v₁ = [(1 - e)/2]v and v₂ = [(1 + e)/2]v.",
        "2. Final total kinetic energy: K_f = (1/2)m·v₁² + (1/2)m·v₂² = (1/4)mv²(1 + e²).",
        "3. Given K_f = (3/4)K_i = (3/4)·[(1/2)mv²] = (3/8)mv².",
        "4. (1/4)mv²(1 + e²) = (3/8)mv²  ⟹  1 + e² = 3/2  ⟹  e² = 1/2  ⟹  e = 1 / √2.",
      ],
      summary: "Option (B) is correct. Restitution coefficient e = 1/√2.",
    },
  },
  {
    id: "q29_30",
    num: 29,
    title: "Explosion of 8kg Body into 3 Perpendicular Pieces",
    topic: "2D Momentum Conservation in Explosions",
    type: "multi",
    marks: { pos: 4, neg: 2 },
    questionText:
      "A body of mass 8 kg at rest explodes into 3 pieces of masses m₁ = 1 kg, m₂ = 2 kg, and m₃ = 5 kg. The first two pieces fly off perpendicularly to each other with velocities in the ratio 3 : 2. The 5 kg piece flies off with a speed of 20 m/s. Which of the following statements is/are correct?",
    formulaNote: "P₁ = 1(3k) = 3k, P₂ = 2(2k) = 4k, Resultant |P₃| = √(3k)² + (4k)² = 5k",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-36" viewBox="0 0 400 140">
        <circle cx="200" cy="70" r="10" fill="#ef4444" stroke="#f87171" strokeWidth="2" />
        <text x="200" y="95" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">8 kg (at rest)</text>

        {/* P1 along +x */}
        <line x1="200" y1="70" x2="310" y2="70" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arrowRed)" />
        <text x="290" y="60" fontSize="11" fontWeight="bold" fill="#0284c7">P₁ (1 kg, v₁)</text>

        {/* P2 along +y */}
        <line x1="200" y1="70" x2="200" y2="10" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowRed)" />
        <text x="210" y="25" fontSize="11" fontWeight="bold" fill="#10b981">P₂ (2 kg, v₂)</text>

        {/* P3 opposite */}
        <line x1="200" y1="70" x2="90" y2="130" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrowRed)" />
        <text x="70" y="130" fontSize="11" fontWeight="bold" fill="#f59e0b">P₃ (5 kg, 20 m/s)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "The velocity of the 1 kg piece is 60 m/s" },
      { id: "B", label: "(B)", text: "The velocity of the 2 kg piece is 40 m/s" },
      { id: "C", label: "(C)", text: "The velocity of the 1 kg piece is 30 m/s" },
      { id: "D", label: "(D)", text: "The total momentum of the three pieces after explosion is zero" },
    ],
    correctAnswers: ["A", "B", "D"],
    explanation: {
      keyFormula: "P_total = P₁ + P₂ + P₃ = 0  ⟹  |P₃| = √(P₁² + P₂²)",
      steps: [
        "1. Let v₁ = 3k and v₂ = 2k.",
        "2. P₁ = 1 · (3k) = 3k (along î), P₂ = 2 · (2k) = 4k (along ĵ).",
        "3. Total resultant of first two pieces = √[(3k)² + (4k)²] = 5k.",
        "4. By conservation of momentum, |P₃| = 5k. Given P₃ = 5 kg × 20 m/s = 100 kg·m/s.",
        "5. 5k = 100  ⟹  k = 20.",
        "6. v₁ = 3(20) = 60 m/s, v₂ = 2(20) = 40 m/s.",
        "7. Since explosion is caused purely by internal forces, total linear momentum remains 0.",
      ],
      summary: "Options (A), (B), and (D) are correct. v₁ = 60 m/s, v₂ = 40 m/s, and momentum is strictly conserved.",
    },
  },
  {
    id: "q31",
    num: 31,
    title: "Mud Pellet Impacting Smooth Triangular Wedge",
    topic: "Completely Inelastic Oblique Impact",
    type: "multi",
    marks: { pos: 4, neg: 2 },
    questionText:
      "A mud pellet of mass m strikes a stationary smooth wedge of mass M on a horizontal floor with velocity v₀ inclined at angle θ to the horizontal. The collision is completely inelastic. Select the correct statement(s):",
    formulaNote: "Horizontal momentum is conserved: m·v₀·cosθ = (M+m)v",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-32" viewBox="0 0 400 130">
        <line x1="20" y1="110" x2="380" y2="110" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        
        {/* Wedge */}
        <polygon points="140,110 270,110 140,35" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <text x="175" y="85" fontSize="14" fontWeight="bold" fill="#1e293b">M</text>

        {/* Mud Pellet */}
        <circle cx="80" cy="20" r="8" fill="#78350f" stroke="#92400e" strokeWidth="1.5" />
        <line x1="80" y1="20" x2="145" y2="55" stroke="#78350f" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
        <text x="80" y="48" fontSize="11" fontWeight="bold" fill="#78350f">m, v₀</text>
        <line x1="80" y1="20" x2="135" y2="20" stroke="#94a3b8" strokeDasharray="3 3" />
        <text x="115" y="16" fontSize="10" fontWeight="bold" fill="#78350f">θ</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "The common horizontal velocity of the system just after collision is v = (m v₀ cosθ) / (M + m)" },
      { id: "B", label: "(B)", text: "The change in kinetic energy of the system is -[(M + m·sin²θ)·m·v₀²] / [2(M + m)]" },
      { id: "C", label: "(C)", text: "Total linear momentum along the vertical direction is conserved" },
      { id: "D", label: "(D)", text: "Horizontal momentum of the (M + m) system is conserved" },
    ],
    correctAnswers: ["A", "B", "D"],
    explanation: {
      keyFormula: "ΔK = (1/2)(M+m)v² - (1/2)m v₀²",
      steps: [
        "1. Floor is smooth, so no horizontal external force acts. Horizontal momentum is conserved: m v₀ cosθ = (M + m)v ⟹ v = (m v₀ cosθ)/(M + m).",
        "2. Vertical momentum is NOT conserved due to large normal impulse from the rigid floor.",
        "3. Initial KE = (1/2)m v₀²; Final KE = (1/2)(M+m)v².",
        "4. ΔK = (1/2)(M+m)[(m v₀ cosθ)/(M+m)]² - (1/2)m v₀² = -[(M + m·sin²θ)·m·v₀²] / [2(M + m)].",
      ],
      summary: "Options (A), (B), and (D) are correct. Common velocity is (mv₀cosθ)/(M+m) and KE loss includes vertical kinetic component.",
    },
  },
  {
    id: "q32",
    num: 32,
    title: "Ball Colliding with Advancing Massive Wall",
    topic: "Moving Frame of Reference & Elastic Impact",
    type: "multi",
    marks: { pos: 4, neg: 2 },
    questionText:
      "A ball of mass m moving with velocity v hits a massive wall moving towards the ball with velocity u. An elastic impact lasts for a time Δt. Which of the following statements are correct?",
    formulaNote: "Velocity of separation = Velocity of approach in moving wall reference frame",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-28" viewBox="0 0 400 110">
        {/* Ball */}
        <circle cx="90" cy="55" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <text x="90" y="60" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">m</text>
        <line x1="115" y1="55" x2="160" y2="55" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arrowRed)" />
        <text x="135" y="45" fontSize="11" fontWeight="bold" fill="#0284c7">v</text>

        {/* Wall */}
        <rect x="250" y="15" width="45" height="80" fill="#475569" stroke="#334155" strokeWidth="2" rx="4" />
        <line x1="240" y1="55" x2="195" y2="55" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowRed)" />
        <text x="215" y="45" fontSize="11" fontWeight="bold" fill="#ef4444">u (←)</text>
        <text x="272" y="58" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">WALL</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "Rebound speed of the ball relative to ground is v' = v + 2u" },
      { id: "B", label: "(B)", text: "The average elastic force acting on the ball is [2m(u + v)] / Δt" },
      { id: "C", label: "(C)", text: "The kinetic energy of the ball increases by 2mu(u + v)" },
      { id: "D", label: "(D)", text: "The magnitude of impulse received by the ball is 2m(u + v)" },
    ],
    correctAnswers: ["A", "B", "C", "D"],
    explanation: {
      keyFormula: "v_sep = v_app  ⟹  (v' - u) = (v + u)  ⟹  v' = v + 2u",
      steps: [
        "1. In wall's frame, approach speed = v + u.",
        "2. Since collision is elastic (e = 1), separation speed = v + u.",
        "3. In ground frame, rebound speed v' = (v + u) + u = v + 2u. (Statement A is True)",
        "4. Impulse magnitude: J = |m(v') - (-mv)| = m(v + 2u + v) = 2m(u + v). (Statement D is True)",
        "5. Average force: F_avg = J / Δt = 2m(u + v) / Δt. (Statement B is True)",
        "6. Kinetic Energy change: ΔK = (1/2)m(v + 2u)² - (1/2)mv² = (1/2)m(4uv + 4u²) = 2mu(u + v). (Statement C is True)",
      ],
      summary: "All options (A, B, C, D) are correct.",
    },
  },
  {
    id: "q33_35",
    num: 33,
    title: "2D Vector Impact with Fixed Wall (e = 0.5)",
    topic: "Vector Restitution & Kinetic Energy Dissipation",
    type: "multi",
    marks: { pos: 4, neg: 2 },
    questionText:
      "A smooth sphere of mass m moving on a horizontal plane with velocity u = 3î + ĵ (m/s) collides with a vertical wall parallel to the vector ĵ. The coefficient of restitution between the sphere and the wall is e = 0.5. Which of the following statements is/are correct?",
    formulaNote: "Velocity parallel to wall is unchanged (v_y = u_y); perpendicular component reflects with restitution: v_x = -e·u_x",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-32" viewBox="0 0 400 130">
        {/* Wall */}
        <line x1="280" y1="10" x2="280" y2="120" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
        <text x="290" y="30" fontSize="11" fontWeight="bold" fill="#334155">Wall || ĵ</text>

        {/* Incident Ball */}
        <circle cx="110" cy="65" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <line x1="110" y1="65" x2="240" y2="95" stroke="#0284c7" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
        <text x="145" y="70" fontSize="11" fontWeight="bold" fill="#0284c7">u = 3î + ĵ</text>

        {/* Reflected Path */}
        <line x1="280" y1="95" x2="180" y2="125" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
        <text x="210" y="125" fontSize="11" fontWeight="bold" fill="#ef4444">v = -1.5î + ĵ</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "The velocity of the sphere after impact is -(3/2)î + ĵ m/s" },
      { id: "B", label: "(B)", text: "The loss in kinetic energy caused by the impact is (27/8)m Joules" },
      { id: "C", label: "(C)", text: "The impulse vector delivered by the wall is -(9/2)m î N·s" },
      { id: "D", label: "(D)", text: "The velocity component along the wall (ĵ) is completely destroyed" },
    ],
    correctAnswers: ["A", "B", "C"],
    explanation: {
      keyFormula: "v_x = -e · u_x = -0.5(3) = -1.5 m/s;  v_y = u_y = 1 m/s",
      steps: [
        "1. Because the wall is frictionless along ĵ, v_y = u_y = 1 m/s.",
        "2. Normal direction along î: v_x = -e(u_x) = -0.5(3) = -1.5 = -3/2 m/s.",
        "3. Final velocity: v = -(3/2)î + ĵ m/s. (Option A is True)",
        "4. Initial KE = (1/2)m(3² + 1²) = 5m J.",
        "5. Final KE = (1/2)m((-1.5)² + 1²) = (1/2)m(2.25 + 1) = (13/8)m J.",
        "6. KE Loss = 5m - (13/8)m = (27/8)m J. (Option B is True)",
        "7. Impulse: J = m(v - u) = m[(-1.5î + ĵ) - (3î + ĵ)] = -(9/2)m î. (Option C is True)",
      ],
      summary: "Options (A), (B), and (C) are correct.",
    },
  },
  {
    id: "q36_38",
    num: 36,
    title: "Repetitive Collisions on Mixed Friction Track",
    topic: "Elastic Collision & Friction Stopping Distance",
    type: "multi",
    marks: { pos: 4, neg: 2 },
    questionText:
      "A block B₁ of mass 2m moving with speed 9 m/s on a frictionless floor collides elastically with a stationary block B₂ of mass m. After collision, block B₂ moves on a rough surface with coefficient of friction μ = 0.3 (g = 10 m/s²), while B₁ remains on the smooth floor. Select the correct statement(s):",
    formulaNote: "After 1st collision: v_B1 = 3 m/s, v_B2 = 12 m/s; Deceleration of B₂: a = μg = 3 m/s²",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-32" viewBox="0 0 400 120">
        {/* Track */}
        <line x1="20" y1="85" x2="180" y2="85" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        <line x1="180" y1="85" x2="380" y2="85" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />
        
        {/* B1 */}
        <rect x="70" y="45" width="48" height="40" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" rx="4" />
        <text x="94" y="70" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">2m (B₁)</text>
        <line x1="125" y1="65" x2="160" y2="65" stroke="#0284c7" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
        <text x="140" y="55" fontSize="10" fontWeight="bold" fill="#0284c7">9 m/s</text>

        {/* B2 */}
        <rect x="195" y="52" width="38" height="33" fill="#10b981" stroke="#34d399" strokeWidth="2" rx="4" />
        <text x="214" y="73" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">m (B₂)</text>

        <text x="90" y="105" fontSize="10" fontWeight="bold" fill="#64748b">Smooth (μ = 0)</text>
        <text x="280" y="105" fontSize="10" fontWeight="bold" fill="#ef4444">Rough (μ = 0.3)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "Block B₂ comes to rest before the second collision happens" },
      { id: "B", label: "(B)", text: "The second collision between the blocks occurs at t = 8 s" },
      { id: "C", label: "(C)", text: "The maximum relative separation between B₁ and B₂ before the second collision is 13.5 m" },
      { id: "D", label: "(D)", text: "Infinite number of collisions are possible between the blocks" },
    ],
    correctAnswers: ["A", "B", "C", "D"],
    explanation: {
      keyFormula: "v_B1 = [(2m-m)/3m]·9 = 3 m/s;  v_B2 = [2(2m)/3m]·9 = 12 m/s",
      steps: [
        "1. Deceleration of B₂ on rough floor: a = μg = 0.3 × 10 = 3 m/s².",
        "2. Time for B₂ to come to rest: t = v_B2 / a = 12 / 3 = 4 s.",
        "3. Distance travelled by B₂ before stopping: s = (12)² / [2(3)] = 24 m.",
        "4. B₁ moves at constant 3 m/s. Time to reach s = 24 m is t' = 24 / 3 = 8 s.",
        "   Since 8 s > 4 s, B₂ is completely at rest when struck. (Statement A & B are True)",
        "5. Relative displacement x(t) = (12t - 1.5t²) - 3t = 9t - 1.5t².",
        "   Maximum occurs at dx/dt = 9 - 3t = 0 ⟹ t = 3 s. x_max = 9(3) - 1.5(9) = 13.5 m. (Statement C is True)",
        "6. In each cycle, B₁ retains a positive constant velocity on the smooth floor, repeating the cycle infinitely. (Statement D is True)",
      ],
      summary: "All statements (A, B, C, D) are correct.",
    },
  },
  {
    id: "q39",
    num: 39,
    title: "Pendulum Bob Elastic Impact at Lowest Point",
    topic: "Mechanical Energy Conservation & Elastic Impact",
    type: "single",
    marks: { pos: 4, neg: 1 },
    questionText:
      "A simple pendulum bob of mass m₁ = 10 g is suspended by a string of length L = 1 m. It is pulled aside by θ = 60° and released. At the lowest position, it strikes a stationary body of mass m₂ = 20 g elastically (g = 980 cm/s²). If the velocity of m₁ after collision is -980/n cm/s, find the integer n.",
    formulaNote: "Speed at bottom: u₁ = √[2gL(1 - cosθ)]; v₁ = [(m₁ - m₂) / (m₁ + m₂)] · u₁",
    svgDiagram: (
      <svg className="w-full max-w-[400px] h-36" viewBox="0 0 380 140">
        <line x1="190" y1="10" x2="190" y2="120" stroke="#cbd5e1" strokeDasharray="3 3" />
        {/* Suspended string at 60 deg */}
        <line x1="190" y1="10" x2="270" y2="75" stroke="#334155" strokeWidth="2" />
        <circle cx="270" cy="75" r="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <text x="295" y="75" fontSize="11" fontWeight="bold" fill="#0284c7">10 g (60°)</text>

        {/* Stationary Bob at bottom */}
        <circle cx="190" cy="120" r="14" fill="#10b981" stroke="#34d399" strokeWidth="2" />
        <text x="190" y="124" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">20 g</text>
        <text x="190" y="138" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="middle">at rest</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "n = 1" },
      { id: "B", label: "(B)", text: "n = 2" },
      { id: "C", label: "(C)", text: "n = 3" },
      { id: "D", label: "(D)", text: "n = 4" },
    ],
    correctAnswers: ["C"],
    explanation: {
      keyFormula: "u₁ = √[2 · 980 · 100 · (1 - 0.5)] = √98000 = 980/√9.8",
      steps: [
        "1. Bob drops by height h = L(1 - cos 60°) = 100 cm · 0.5 = 50 cm.",
        "2. Velocity before impact: u₁ = √(2gh) = √(2 × 980 × 50) = √98000 cm/s.",
        "3. Post-elastic collision velocity for m₁: v₁ = [(m₁ - m₂)/(m₁ + m₂)] · u₁ = [(10 - 20)/30] · √98000 = -(1/3)√98000 = -980/3 cm/s.",
        "4. Comparing with -980/n cm/s gives n = 3.",
      ],
      summary: "Option (C) is correct. The integer value is n = 3.",
    },
  },
  {
    id: "q40",
    num: 40,
    title: "Two-Stage Collision with Reflection Wall (e = 0.5)",
    topic: "Restitution Dynamics & Time to 2nd Impact",
    type: "single",
    marks: { pos: 4, neg: 1 },
    questionText:
      "A ball of mass m moving with speed 10 m/s undergoes an inelastic head-on collision with an identical stationary ball (e = 0.5). The distance between the point of collision and the reflection wall is such that t₁ = 4/3 s. The second collision occurs at total time t. Find the value of t in seconds.",
    formulaNote: "v₁ = (1-e)u/2 = 2.5 m/s, v₂ = (1+e)u/2 = 7.5 m/s; Total time t = t₁ + t₂ = 4/3 + 8/3 = 4 s",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-28" viewBox="0 0 400 110">
        <line x1="20" y1="85" x2="360" y2="85" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        {/* Wall */}
        <line x1="360" y1="20" x2="360" y2="95" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
        
        {/* Balls */}
        <circle cx="120" cy="65" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <text x="120" y="70" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">v₁</text>

        <circle cx="230" cy="65" r="14" fill="#10b981" stroke="#34d399" strokeWidth="2" />
        <text x="230" y="70" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">v₂</text>

        <text x="360" y="15" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">WALL</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "2.5 s" },
      { id: "B", label: "(B)", text: "3.0 s" },
      { id: "C", label: "(C)", text: "4.0 s" },
      { id: "D", label: "(D)", text: "5.0 s" },
    ],
    correctAnswers: ["C"],
    explanation: {
      keyFormula: "v₁ = [(1-e)/2]u, v₂ = [(1+e)/2]u",
      steps: [
        "1. v₁ = [(1 - 0.5)/2] · 10 = 2.5 m/s.",
        "2. v₂ = [(1 + 0.5)/2] · 10 = 7.5 m/s.",
        "3. Separation distance to wall: s = v₁ · t₁ = 2.5 × (4/3) = 10/3 m.",
        "4. Time for Ball 2 to travel to wall and rebound to hit Ball 1: t₂ = 8/3 s.",
        "5. Total elapsed time: t = t₁ + t₂ = 4/3 + 8/3 = 12/3 = 4.0 s.",
      ],
      summary: "Option (C) is correct. Total time taken for second collision is 4.0 seconds.",
    },
  },
  {
    id: "q41",
    num: 41,
    title: "Mid-Air Completely Inelastic Collision of Vertical Projectiles",
    topic: "1D Gravity & Inelastic Impact Mechanics",
    type: "single",
    marks: { pos: 4, neg: 1 },
    questionText:
      "A ball of mass 100 g is projected vertically upward from the ground with a velocity of 50 m/s. At the same time, an identical ball is dropped from a height of 100 m directly above it (g = 10 m/s²). The two balls collide and stick together. Find the total time taken by the combined mass to fall to the ground.",
    formulaNote: "Time to collide: t_c = 100 / 50 = 2 s; Height of impact = 80 m; Combined velocity V = 5 m/s",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-36" viewBox="0 0 400 140">
        <line x1="30" y1="125" x2="370" y2="125" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        <text x="45" y="137" fontSize="10" fontWeight="bold" fill="#64748b">GROUND</text>

        {/* Top Ball Dropped */}
        <circle cx="200" cy="20" r="10" fill="#ef4444" stroke="#f87171" strokeWidth="2" />
        <line x1="200" y1="33" x2="200" y2="55" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
        <text x="240" y="25" fontSize="10" fontWeight="bold" fill="#ef4444">Dropped (100 m)</text>

        {/* Bottom Ball Thrown */}
        <circle cx="200" cy="115" r="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <line x1="200" y1="102" x2="200" y2="78" stroke="#0284c7" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
        <text x="240" y="115" fontSize="10" fontWeight="bold" fill="#0284c7">u = 50 m/s (↑)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "4.5 s" },
      { id: "B", label: "(B)", text: "6.5 s" },
      { id: "C", label: "(C)", text: "9.0 s" },
      { id: "D", label: "(D)", text: "13.0 s" },
    ],
    correctAnswers: ["A"],
    explanation: {
      keyFormula: "t_c = 100/50 = 2 s; h = 80 m; V_common = (30 - 20)/2 = 5 m/s (↑)",
      steps: [
        "1. Relative velocity = 50 m/s ⟹ Time of impact: t_c = 100 / 50 = 2 s.",
        "2. Height of collision: h = 50(2) - (1/2)(10)(2²) = 80 m.",
        "3. Velocities at impact: u₁ = 50 - 10(2) = 30 m/s (↑); u₂ = -10(2) = -20 m/s (↓).",
        "4. Combined common velocity: V = [m(30) + m(-20)] / 2m = 5 m/s (↑).",
        "5. Time to apex: t_up = 5 / 10 = 0.5 s. Max height = 80 + (5²)/20 = 81.25 m.",
        "6. Time to fall from apex to ground: t_down = √[2(81.25)/10] = √16.25 ≈ 4.03 ≈ 4 s.",
        "7. Total time after collision = 0.5 s + 4.0 s = 4.5 s.",
      ],
      summary: "Option (A) is correct. The total time for the combined mass to hit the ground is 4.5 seconds.",
    },
  },
];

interface PhysicsOTAdvancedQuizProps {
  onClose?: () => void;
  isOpen: boolean;
}

export function PhysicsOTAdvancedQuiz({ isOpen, onClose }: PhysicsOTAdvancedQuizProps) {
  const [activeTab, setActiveTab] = useState<"quiz" | "summary" | "formulas">("quiz");
  const [examMode, setExamMode] = useState<"practice" | "live">("practice");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [examTimeLeft, setExamTimeLeft] = useState<number>(45 * 60); // 45 mins
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<"all" | "single" | "multi">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Timer for live exam
  useEffect(() => {
    let timer: any = null;
    if (isOpen && examMode === "live" && !examSubmitted && examTimeLeft > 0) {
      timer = setInterval(() => {
        setExamTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, examMode, examSubmitted, examTimeLeft]);

  if (!isOpen) return null;

  const currentQ = PHYSICS_OT_QUESTIONS[currentIdx];

  // Filtering
  const filteredQuestions = PHYSICS_OT_QUESTIONS.filter((q) => {
    if (filterType !== "all" && q.type !== filterType) return false;
    if (searchQuery.trim()) {
      const qText = `${q.num} ${q.title} ${q.topic} ${q.questionText}`.toLowerCase();
      return qText.includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleOptionToggle = (qId: string, optId: string, isMulti: boolean) => {
    if (examSubmitted && examMode === "live") return;

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

  const handleToggleSolution = (qId: string) => {
    setShowSolution((prev) => ({ ...prev, [qId]: !prev[qId] }));
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
        // Multi-correct scoring
        const isExactMatch =
          userAns.length === q.correctAnswers.length &&
          userAns.every((a) => q.correctAnswers.includes(a));
        const hasWrongOption = userAns.some((a) => !q.correctAnswers.includes(a));

        if (isExactMatch) {
          score += q.marks.pos;
          correctCount++;
        } else if (!hasWrongOption && userAns.length > 0) {
          // Partial credit (+1 per correct option with no wrong choices)
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
    setActiveTab("summary");
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  };

  const resetExam = () => {
    setSelectedAnswers({});
    setShowSolution({});
    setMarkedForReview({});
    setExamSubmitted(false);
    setExamTimeLeft(45 * 60);
    setActiveTab("quiz");
    setCurrentIdx(0);
  };

  const stats = calculateScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/80 backdrop-blur-md overflow-hidden animate-fade-in font-sans">
      <div
        ref={containerRef}
        className={`w-full max-w-6xl h-[92vh] max-h-[880px] bg-white border border-zinc-200 rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative ${
          isFullscreen ? "!fixed !inset-0 !max-w-none !h-full !rounded-none" : ""
        }`}
      >
        {/* TOP EXAM APP BAR */}
        <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Atom className="h-5 w-5 text-white animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400 font-mono">
                  Physics OT Advanced PYQ
                </span>
                <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Collisions & Impulse
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                ICON C2 OT-4 Advanced Module • Q23 to Q41 High-Yield Practice
              </p>
            </div>
          </div>

          {/* Center Mode Switch & Timer */}
          <div className="flex items-center gap-3">
            {examMode === "live" && !examSubmitted && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3.5 py-1.5 rounded-xl font-mono text-xs text-rose-300">
                <Clock className="h-3.5 w-3.5 animate-pulse text-rose-400" />
                <span className="font-bold">
                  {Math.floor(examTimeLeft / 60)}:
                  {String(examTimeLeft % 60).padStart(2, "0")}
                </span>
              </div>
            )}

            <div className="bg-zinc-800 p-1 rounded-xl flex items-center gap-1 border border-zinc-700 text-[10px] font-bold">
              <button
                onClick={() => setExamMode("practice")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer uppercase ${
                  examMode === "practice"
                    ? "bg-cyan-500 text-black font-extrabold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Practice Mode
              </button>
              <button
                onClick={() => setExamMode("live")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer uppercase ${
                  examMode === "live"
                    ? "bg-indigo-500 text-white font-extrabold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Live Test
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-rose-900/40 hover:border-rose-700/50 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-rose-300 transition-all cursor-pointer"
                title="Close Quiz"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* SUBHEADER NAVIGATION & STATS STRIP */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-2.5 flex items-center justify-between shrink-0 select-none text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Questions</span>
            </button>

            <button
              onClick={() => setActiveTab("summary")}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "summary"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Scorecard</span>
            </button>

            <button
              onClick={() => setActiveTab("formulas")}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "formulas"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Key Formula Sheet</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold text-zinc-600">
            <span className="flex items-center gap-1.5">
              <span className="text-zinc-400">Attempted:</span>
              <strong className="text-zinc-900 font-bold font-mono">
                {Object.keys(selectedAnswers).length} / {PHYSICS_OT_QUESTIONS.length}
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-zinc-400">Current Score:</span>
              <strong className={`font-mono font-bold ${stats.score >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {stats.score} Marks
              </strong>
            </span>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE QUESTION PORTAL */}
        {activeTab === "quiz" && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
            {/* LEFT / CENTER: ACTIVE QUESTION DISPLAY (Col 8) */}
            <div className="lg:col-span-8 flex flex-col h-full border-r border-zinc-200 bg-white overflow-y-auto p-6 scrollbar-thin">
              {currentQ && (
                <div className="flex flex-col gap-5">
                  {/* Question Header Status */}
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-black uppercase font-mono">
                        Question {currentQ.num}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          currentQ.type === "single"
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
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
                            ? "bg-amber-50 border-amber-300 text-amber-600"
                            : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-700"
                        }`}
                        title="Bookmark Question"
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleReview(currentQ.id)}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                          markedForReview[currentQ.id]
                            ? "bg-purple-50 border-purple-300 text-purple-700"
                            : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-800"
                        }`}
                      >
                        {markedForReview[currentQ.id] ? "Marked for Review" : "Mark Review"}
                      </button>
                    </div>
                  </div>

                  {/* Question Topic */}
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                    TOPIC: <span className="text-zinc-700">{currentQ.topic}</span>
                  </div>

                  {/* Problem Statement */}
                  <p className="text-zinc-800 text-sm leading-relaxed font-medium">
                    {currentQ.questionText}
                  </p>

                  {/* Visual Diagram Box */}
                  <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-inner">
                    <span className="absolute top-2 left-3 text-[9px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                      Diagram Schematic
                    </span>
                    {currentQ.svgDiagram}
                  </div>

                  {/* Options List */}
                  <div className="flex flex-col gap-2.5 mt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 select-none">
                      {currentQ.type === "single"
                        ? "Select One Option:"
                        : "Select All Correct Options:"}
                    </span>

                    {currentQ.options.map((opt) => {
                      const userChoices = selectedAnswers[currentQ.id] || [];
                      const isSelected = userChoices.includes(opt.id);
                      const isCorrect = currentQ.correctAnswers.includes(opt.id);
                      const isRevealed =
                        showSolution[currentQ.id] ||
                        (examSubmitted && examMode === "live");

                      let cardStyle = "bg-white border-zinc-200 hover:border-cyan-400 hover:bg-cyan-50/30 text-zinc-800";

                      if (isSelected) {
                        cardStyle = "bg-cyan-50 border-cyan-600 text-cyan-950 font-semibold shadow-sm";
                      }

                      if (isRevealed) {
                        if (isCorrect) {
                          cardStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold";
                        } else if (isSelected && !isCorrect) {
                          cardStyle = "bg-rose-50 border-rose-400 text-rose-950 font-semibold";
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
                          className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer select-none ${cardStyle}`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                              isSelected
                                ? "bg-cyan-600 text-white border-cyan-600"
                                : "bg-zinc-100 text-zinc-600 border-zinc-300"
                            }`}
                          >
                            {isSelected ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : opt.id}
                          </div>
                          <div className="flex-1 text-xs leading-relaxed">
                            <span className="font-bold mr-1.5">{opt.label}</span>
                            <span>{opt.text}</span>
                          </div>
                          {isRevealed && isCorrect && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {isRevealed && isSelected && !isCorrect && (
                            <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleClearResponse(currentQ.id)}
                        disabled={!selectedAnswers[currentQ.id]}
                        className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 disabled:opacity-30 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                      >
                        Clear Selection
                      </button>

                      {examMode === "practice" && (
                        <button
                          onClick={() => handleToggleSolution(currentQ.id)}
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          {showSolution[currentQ.id] ? (
                            <>
                              <EyeOff className="h-3.5 w-3.5" /> Hide Solution
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5" /> Show Full Solution
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                        disabled={currentIdx === 0}
                        className="px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* STEP-BY-STEP EXPLANATION DRAWER */}
                  {(showSolution[currentQ.id] ||
                    (examSubmitted && examMode === "live")) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-zinc-900 text-white border border-zinc-700 rounded-2xl p-5 flex flex-col gap-3 shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-cyan-400 font-mono">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Detailed Mathematical Derivation</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">
                          Correct: {currentQ.correctAnswers.join(", ")}
                        </span>
                      </div>

                      {currentQ.explanation.keyFormula && (
                        <div className="bg-zinc-800/80 border border-zinc-700 p-3 rounded-xl font-mono text-xs text-amber-300">
                          <span className="text-[9px] text-zinc-400 uppercase tracking-widest block font-bold mb-1">
                            Core Physics Principle / Formula:
                          </span>
                          {currentQ.explanation.keyFormula}
                        </div>
                      )}

                      <div className="space-y-2 text-xs leading-relaxed text-zinc-300 font-sans">
                        {currentQ.explanation.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex gap-2 items-start">
                            <span className="text-cyan-400 font-mono font-bold">
                              {sIdx + 1}.
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-1 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 font-medium">
                        {currentQ.explanation.summary}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT: QUESTION PALETTE & NAVIGATION (Col 4) */}
            <div className="lg:col-span-4 bg-zinc-50 p-5 flex flex-col justify-between h-full overflow-y-auto">
              <div className="flex flex-col gap-4">
                {/* Search & Topic Filters */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                      Question Navigation Grid
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400">
                      {PHYSICS_OT_QUESTIONS.length} Questions
                    </span>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search questions or topics..."
                      className="w-full bg-white border border-zinc-200 py-1.5 pl-8 pr-3 rounded-xl text-xs text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Legend Indicators */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-zinc-600 bg-white p-2.5 rounded-xl border border-zinc-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-cyan-600" />
                    <span>Answered ({Object.keys(selectedAnswers).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-purple-500" />
                    <span>Review ({Object.keys(markedForReview).filter((k) => markedForReview[k]).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-400" />
                    <span>Bookmarked ({Object.keys(bookmarked).filter((k) => bookmarked[k]).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-zinc-200" />
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

                    let bg = "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300";
                    if (isAnswered) bg = "bg-cyan-600 border-cyan-600 text-white font-bold";
                    if (isReview) bg = "bg-purple-600 border-purple-600 text-white font-bold";

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-11 rounded-xl border-2 flex flex-col items-center justify-center relative text-xs font-mono font-bold transition-all cursor-pointer shadow-xs ${bg} ${
                          isCurrent ? "ring-2 ring-cyan-500 ring-offset-2" : ""
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
              <div className="pt-4 border-t border-zinc-200 flex flex-col gap-2 mt-4">
                <button
                  onClick={handleAutoSubmit}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  <span>Submit Exam & View Analysis</span>
                </button>
                <button
                  onClick={resetExam}
                  className="w-full py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-bold rounded-xl uppercase transition-all cursor-pointer"
                >
                  Reset Answers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCORECARD & PERFORMANCE SUMMARY */}
        {activeTab === "summary" && (
          <div className="flex-1 p-6 overflow-y-auto bg-zinc-50 flex flex-col gap-6">
            {/* Top Score Banner */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-[28px] p-6 border border-zinc-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">
                    PHYSICS ADVANCED SCORE REPORT
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    {stats.score} / {stats.maxScore} Marks
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1">
                    Accuracy Rate: <strong className="text-emerald-400">{stats.accuracy}%</strong> • Attempted:{" "}
                    <strong>
                      {stats.attemptedCount} / {PHYSICS_OT_QUESTIONS.length}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab("quiz");
                    setShowSolution(
                      PHYSICS_OT_QUESTIONS.reduce((acc, q) => ({ ...acc, [q.id]: true }), {})
                    );
                  }}
                  className="px-5 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-md"
                >
                  Review All Solutions
                </button>
                <button
                  onClick={resetExam}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer border border-white/10"
                >
                  Retake Exam
                </button>
              </div>
            </div>

            {/* Performance KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Correct Answers
                </span>
                <span className="text-2xl font-black text-zinc-900 mt-1 font-mono">
                  {stats.correctCount}
                </span>
                <span className="text-[10px] text-zinc-400 mt-0.5">+4 Marks Each</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                  Incorrect Answers
                </span>
                <span className="text-2xl font-black text-zinc-900 mt-1 font-mono">
                  {stats.incorrectCount}
                </span>
                <span className="text-[10px] text-zinc-400 mt-0.5">Negative Marking Applied</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Unattempted
                </span>
                <span className="text-2xl font-black text-zinc-900 mt-1 font-mono">
                  {stats.unattemptedCount}
                </span>
                <span className="text-[10px] text-zinc-400 mt-0.5">0 Marks Impact</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col">
                <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">
                  Net Accuracy
                </span>
                <span className="text-2xl font-black text-cyan-700 mt-1 font-mono">
                  {stats.accuracy}%
                </span>
                <span className="text-[10px] text-zinc-400 mt-0.5">Target &gt; 80% for IIT-JEE</span>
              </div>
            </div>

            {/* Question Breakdown List */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-3 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700">
                Detailed Question-Wise Breakdown
              </h4>
              <div className="divide-y divide-zinc-100">
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
                        setActiveTab("quiz");
                      }}
                      className="py-3 flex items-center justify-between hover:bg-zinc-50 px-2 rounded-xl transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-zinc-400 w-8">
                          #{q.num}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-900">{q.title}</span>
                          <span className="text-[10px] text-zinc-500">{q.topic}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isAttempted ? (
                          isCorrect ? (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-lg flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Correct (+{q.marks.pos})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-lg flex items-center gap-1">
                              <XCircle className="h-3 w-3" /> Incorrect (-{q.marks.neg})
                            </span>
                          )
                        ) : (
                          <span className="px-2.5 py-1 bg-zinc-100 text-zinc-500 border border-zinc-200 text-[10px] font-medium rounded-lg">
                            Skipped
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-zinc-400" />
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
          <div className="flex-1 p-6 overflow-y-auto bg-zinc-50 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-cyan-600 font-mono tracking-wider">
                1D Head-on Elastic Collision
              </span>
              <h4 className="text-sm font-bold text-zinc-900">Velocity Formulas</h4>
              <p className="font-mono text-xs bg-zinc-100 p-3 rounded-xl text-zinc-800">
                v₁ = [(m₁ - m₂) / (m₁ + m₂)] · u₁ + [2m₂ / (m₁ + m₂)] · u₂<br />
                v₂ = [2m₁ / (m₁ + m₂)] · u₁ + [(m₂ - m₁) / (m₁ + m₂)] · u₂
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Equal masses (m₁ = m₂) exchange their velocities completely upon elastic impact.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-indigo-600 font-mono tracking-wider">
                Coefficient of Restitution (e)
              </span>
              <h4 className="text-sm font-bold text-zinc-900">Newton's Experimental Law</h4>
              <p className="font-mono text-xs bg-zinc-100 p-3 rounded-xl text-zinc-800">
                e = Velocity of Separation / Velocity of Approach = (v₂ - v₁) / (u₁ - u₂)
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                e = 1 for perfectly elastic; e = 0 for completely inelastic (bodies stick together).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-amber-600 font-mono tracking-wider">
                Kinetic Energy Loss in Inelastic Collision
              </span>
              <h4 className="text-sm font-bold text-zinc-900">Loss Formula</h4>
              <p className="font-mono text-xs bg-zinc-100 p-3 rounded-xl text-zinc-800">
                ΔK = [m₁m₂ / 2(m₁ + m₂)] · (u₁ - u₂)² · (1 - e²)
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                When bodies move in opposite directions, the relative speed term becomes (u₁ + u₂)².
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-purple-600 font-mono tracking-wider">
                Oblique Collision on Fixed Smooth Plane
              </span>
              <h4 className="text-sm font-bold text-zinc-900">Tangential & Normal Decomposition</h4>
              <p className="font-mono text-xs bg-zinc-100 p-3 rounded-xl text-zinc-800">
                v·sinα = u·sinθ (Tangential unchanged)<br />
                v·cosα = e·u·cosθ (Normal restitution) ⟹ tanα = (tanθ) / e
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Resulting rebound speed: v = u · √(sin²θ + e²cos²θ).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-rose-600 font-mono tracking-wider">
                Impulsive Tensions in Strings
              </span>
              <h4 className="text-sm font-bold text-zinc-900">Jerk & Momentum Jump</h4>
              <p className="font-mono text-xs bg-zinc-100 p-3 rounded-xl text-zinc-800">
                J = ∫ T dt = ΔP along the string
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                The velocity components of both connected particles along the taut string must be equal immediately after the jerk.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-emerald-600 font-mono tracking-wider">
                Variable Mass & Falling Chains
              </span>
              <h4 className="text-sm font-bold text-zinc-900">Total Normal Force on Floor</h4>
              <p className="font-mono text-xs bg-zinc-100 p-3 rounded-xl text-zinc-800">
                N_total = Weight on floor + Thrust force = λgx + 2λgx = 3λgx = 3mg
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                When the upper end is about to touch the floor, the total reaction is exactly 3 times the total weight of the chain!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
