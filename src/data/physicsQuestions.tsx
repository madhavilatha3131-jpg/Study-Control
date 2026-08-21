import React from "react";

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
  options: { id: string; label: string; text: string; latex?: string }[];
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
    formulaNote: "v₂ = [2m₁ / (m₁ + m₂)] · u₁ = (4/3)u",
    svgDiagram: (
      <svg className="w-full max-w-[480px] h-36" viewBox="0 0 460 140">
        <defs>
          <linearGradient id="neonWire" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="60%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="neonTank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#090d1a" />
          </linearGradient>
          <marker id="arrowNeonRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff007f" />
          </marker>
        </defs>
        <line x1="20" y1="95" x2="280" y2="95" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        
        {/* Bead 1 */}
        <circle cx="55" cy="95" r="14" fill="#0369a1" stroke="#00f0ff" strokeWidth="2.5" />
        <text x="55" y="70" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#00f0ff" className="font-mono">m</text>
        <line x1="18" y1="95" x2="36" y2="95" stroke="#ff007f" strokeWidth="2.5" markerEnd="url(#arrowNeonRed)" />
        <text x="24" y="85" fontSize="12" fontWeight="bold" fill="#ff007f" className="font-mono">u</text>

        {/* Bead 2 */}
        <circle cx="120" cy="95" r="11" fill="#0e7490" stroke="#38bdf8" strokeWidth="2" />
        <text x="120" y="72" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#38bdf8" className="font-mono">m/2</text>

        {/* Bead 3 */}
        <circle cx="175" cy="95" r="8" fill="#155e75" stroke="#7dd3fc" strokeWidth="1.5" />
        <text x="175" y="76" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7dd3fc" className="font-mono">m/4</text>

        {/* Ellipsis */}
        <text x="215" y="98" fontSize="18" fontWeight="bold" fill="#64748b" letterSpacing="3">...</text>

        {/* Bead n */}
        <circle cx="260" cy="95" r="6" fill="#0284c7" stroke="#00f0ff" strokeWidth="1.5" />
        <text x="260" y="82" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#00f0ff" className="font-mono">nth</text>

        {/* Vertical Loop */}
        <path d="M 280 95 A 42 42 0 1 1 330 55" fill="none" stroke="url(#neonWire)" strokeWidth="3.5" strokeDasharray="3 1" />
        
        {/* Tank */}
        <path d="M 320 100 L 375 100 L 365 130 L 330 130 Z" fill="url(#neonTank)" stroke="#00f0ff" strokeWidth="2" />
        <text x="348" y="118" fontSize="10" textAnchor="middle" fontWeight="bold" fill="#00f0ff" className="font-mono">TANK</text>
        <text x="330" y="45" fontSize="10" fontWeight="bold" fill="#a855f7" className="font-mono">Radius R</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "((3/4)^(n-1)) · √(5gR)", latex: "\\left(\\frac{3}{4}\\right)^{n-1} \\sqrt{5gR}" },
      { id: "B", label: "(B)", text: "((4/3)^(n-1)) · √(5gR)", latex: "\\left(\\frac{4}{3}\\right)^{n-1} \\sqrt{5gR}" },
      { id: "C", label: "(C)", text: "((3/4)^(n-1)) · 2√(gR)", latex: "\\left(\\frac{3}{4}\\right)^{n-1} 2\\sqrt{gR}" },
      { id: "D", label: "(D)", text: "((4/3)^(n-1)) · 2√(gR)", latex: "\\left(\\frac{4}{3}\\right)^{n-1} 2\\sqrt{gR}" },
    ],
    correctAnswers: ["A"],
    explanation: {
      keyFormula: "v_2 = \\frac{2m_1}{m_1 + m_2} u_1 \\quad \\text{for elastic collision with stationary target}",
      steps: [
        "For 1st collision (m₁ = m, m₂ = m/2): v₂ = [2m / (m + m/2)] · u = (4/3)u.",
        "By mathematical induction, each collision with half-mass bead amplifies speed by factor (4/3).",
        "Speed of n-th bead: v_n = (4/3)^(n-1) · u.",
        "To complete vertical circular loop of radius R without slacking: v_n ≥ √(5gR).",
        "(4/3)^(n-1) · u ≥ √(5gR)  ⟹  u = (3/4)^(n-1) · √(5gR).",
      ],
      summary: "Option (A) is correct. The required minimum initial launch speed is u = (3/4)^(n-1)√(5gR).",
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
    formulaNote: "t₀ = √(2h₀/g); Total bounce time = 2et₀ + 2e²t₀",
    svgDiagram: (
      <svg className="w-full max-w-[440px] h-36" viewBox="0 0 420 140">
        <line x1="20" y1="120" x2="400" y2="120" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        {/* Ball 2 */}
        <line x1="70" y1="20" x2="70" y2="115" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="70" cy="22" r="10" fill="#be123c" stroke="#ff007f" strokeWidth="2" />
        <text x="70" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ff007f" className="font-mono">Ball 2 (t=0)</text>
        <text x="35" y="70" fontSize="10" fill="#94a3b8" className="font-mono">Height h₀</text>

        {/* Ball 1 Bounces */}
        <circle cx="160" cy="110" r="10" fill="#0284c7" stroke="#00f0ff" strokeWidth="2" />
        <path d="M 160 120 Q 205 30 250 120" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeDasharray="3 2" />
        <path d="M 250 120 Q 285 65 320 120" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeDasharray="3 2" />
        
        <text x="205" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#00f0ff" className="font-mono">1st Bounce (2t₁)</text>
        <text x="285" y="58" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#00f0ff" className="font-mono">2nd Bounce (2t₂)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "e > 0.5", latex: "e > 0.5" },
      { id: "B", label: "(B)", text: "e = 0.5", latex: "e = 0.5" },
      { id: "C", label: "(C)", text: "e ≤ (√3 - 1) / 2", latex: "e \\le \\frac{\\sqrt{3} - 1}{2}" },
      { id: "D", label: "(D)", text: "e = (√3 + 1) / 2", latex: "e = \\frac{\\sqrt{3} + 1}{2}" },
    ],
    correctAnswers: ["C"],
    explanation: {
      keyFormula: "2t_1 + 2t_2 \\le t_0 \\implies 2e + 2e^2 \\le 1",
      steps: [
        "Time for dropped Ball 2 to reach floor: t₀ = √(2h₀/g).",
        "Time for 1st bounce of Ball 1: 2t₁ = 2e · √(2h₀/g).",
        "Time for 2nd bounce of Ball 1: 2t₂ = 2e² · √(2h₀/g).",
        "Condition: 2t₁ + 2t₂ ≤ t₀  ⟹  2e + 2e² ≤ 1  ⟹  2e² + 2e - 1 ≤ 0.",
        "Roots: e = [-2 ± √(4 + 8)] / 4 = (-1 + √3) / 2.",
        "Since e > 0, physical range is e ≤ (√3 - 1)/2.",
      ],
      summary: "Option (C) is correct. Solving the quadratic inequality gives e ≤ (√3 - 1)/2.",
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
        <rect x="70" y="45" width="45" height="40" rx="6" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
        <text x="92" y="70" fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="bold" className="font-mono">2 kg</text>
        <line x1="120" y1="65" x2="160" y2="65" stroke="#00f0ff" strokeWidth="3" markerEnd="url(#arrowNeonRed)" />
        <text x="140" y="55" fontSize="11" fontWeight="bold" fill="#00f0ff" className="font-mono">4 m/s</text>

        {/* Block 2 */}
        <rect x="250" y="52" width="36" height="33" rx="6" fill="#065f46" stroke="#00ff66" strokeWidth="2" />
        <text x="268" y="73" fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="bold" className="font-mono">1 kg</text>
        <line x1="245" y1="68" x2="205" y2="68" stroke="#00ff66" strokeWidth="3" markerEnd="url(#arrowNeonRed)" />
        <text x="225" y="58" fontSize="11" fontWeight="bold" fill="#00ff66" className="font-mono">2 m/s (←)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "v₁ = 0 m/s, v₂ = 6 m/s", latex: "v_1 = 0\\text{ m/s}, \\; v_2 = 6\\text{ m/s}" },
      { id: "B", label: "(B)", text: "v₁ = 2 m/s, v₂ = 4 m/s", latex: "v_1 = 2\\text{ m/s}, \\; v_2 = 4\\text{ m/s}" },
      { id: "C", label: "(C)", text: "v₁ = -1 m/s, v₂ = 5 m/s", latex: "v_1 = -1\\text{ m/s}, \\; v_2 = 5\\text{ m/s}" },
      { id: "D", label: "(D)", text: "v₁ = 1 m/s, v₂ = 3 m/s", latex: "v_1 = 1\\text{ m/s}, \\; v_2 = 3\\text{ m/s}" },
    ],
    correctAnswers: ["A"],
    explanation: {
      keyFormula: "P_i = P_f \\implies 2(4) + 1(-2) = 2v_1 + v_2 = 6, \\quad v_2 - v_1 = 4 - (-2) = 6",
      steps: [
        "Momentum Conservation: 2(4) + 1(-2) = 2v₁ + v₂  ⟹  6 = 2v₁ + v₂.",
        "Restitution (e = 1): v₂ - v₁ = 4 - (-2) = 6  ⟹  v₂ = v₁ + 6.",
        "Substitute v₂: 2v₁ + (v₁ + 6) = 6  ⟹  3v₁ = 0  ⟹  v₁ = 0 m/s.",
        "Substitute back: v₂ = 0 + 6 = 6 m/s.",
      ],
      summary: "Option (A) is correct. Mass m₁ comes to rest (v₁ = 0 m/s) and m₂ rebounds forward at 6 m/s.",
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
    formulaNote: "θ₁ + θ₂ = 90° for identical spheres undergoing elastic collision with target at rest",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-32" viewBox="0 0 400 120">
        <line x1="30" y1="60" x2="150" y2="60" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="150" cy="60" r="14" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
        
        {/* v1 Vector */}
        <line x1="150" y1="60" x2="250" y2="15" stroke="#00f0ff" strokeWidth="3" markerEnd="url(#arrowNeonRed)" />
        <text x="260" y="20" fontSize="12" fontWeight="bold" fill="#00f0ff" className="font-mono">v₁</text>

        {/* v2 Vector */}
        <line x1="150" y1="60" x2="250" y2="105" stroke="#00ff66" strokeWidth="3" markerEnd="url(#arrowNeonRed)" />
        <text x="260" y="110" fontSize="12" fontWeight="bold" fill="#00ff66" className="font-mono">v₂</text>

        {/* Angle Arc */}
        <path d="M 180 47 A 35 35 0 0 1 180 75" fill="none" stroke="#ff007f" strokeWidth="2" />
        <text x="200" y="65" fontSize="11" fontWeight="bold" fill="#ff007f" className="font-mono">60°</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "1 / √3", latex: "\\frac{1}{\\sqrt{3}}" },
      { id: "B", label: "(B)", text: "√3", latex: "\\sqrt{3}" },
      { id: "C", label: "(C)", text: "1", latex: "1" },
      { id: "D", label: "(D)", text: "1 / 3", latex: "\\frac{1}{3}" },
    ],
    correctAnswers: ["B"],
    explanation: {
      keyFormula: "\\tan(60^\\circ) = \\frac{v_1}{v_2} = \\sqrt{3}",
      steps: [
        "In an elastic oblique collision between equal masses with one initially at rest, v₁ ⊥ v₂.",
        "From velocity triangle geometry: v₁ / v₂ = tan(60°) = √3.",
      ],
      summary: "Option (B) is correct. The speed ratio v₁ / v₂ is √3.",
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
    formulaNote: "(1/2)·μ·(u_rel)² = (1/2)·k·(x_max)², where μ = m₁m₂/(m₁+m₂)",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-28" viewBox="0 0 400 110">
        <line x1="20" y1="85" x2="380" y2="85" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        
        {/* Block 1 */}
        <rect x="50" y="45" width="45" height="40" rx="6" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
        <text x="72" y="70" fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="bold" className="font-mono">3 kg</text>
        <line x1="45" y1="65" x2="15" y2="65" stroke="#00f0ff" strokeWidth="2.5" markerEnd="url(#arrowNeonRed)" />
        <text x="25" y="55" fontSize="10" fontWeight="bold" fill="#00f0ff" className="font-mono">2 m/s (←)</text>

        {/* Spring */}
        <path d="M 95 65 Q 110 40 125 65 T 155 65 T 185 65 T 215 65 T 245 65" fill="none" stroke="#a855f7" strokeWidth="3.5" />
        <text x="170" y="48" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a855f7" className="font-mono">k = 200 N/m</text>

        {/* Block 2 */}
        <rect x="245" y="40" width="55" height="45" rx="6" fill="#065f46" stroke="#00ff66" strokeWidth="2" />
        <text x="272" y="68" fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="bold" className="font-mono">6 kg</text>
        <line x1="305" y1="65" x2="335" y2="65" stroke="#00ff66" strokeWidth="2.5" markerEnd="url(#arrowNeonRed)" />
        <text x="315" y="55" fontSize="10" fontWeight="bold" fill="#00ff66" className="font-mono">3 m/s (→)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "25 cm", latex: "25\\text{ cm}" },
      { id: "B", label: "(B)", text: "30 cm", latex: "30\\text{ cm}" },
      { id: "C", label: "(C)", text: "50 cm", latex: "50\\text{ cm}" },
      { id: "D", label: "(D)", text: "75 cm", latex: "75\\text{ cm}" },
    ],
    correctAnswers: ["C"],
    explanation: {
      keyFormula: "\\frac{1}{2} \\mu (u_{\\text{rel}})^2 = \\frac{1}{2} k x_{\\max}^2, \\quad \\mu = \\frac{3 \\times 6}{3 + 6} = 2\\text{ kg}",
      steps: [
        "Reduced mass: μ = (3 × 6) / (3 + 6) = 18 / 9 = 2 kg.",
        "Relative speed: u_rel = |3 - (-2)| = 5 m/s.",
        "(1/2) · 2 · (5)² = (1/2) · 200 · (x_max)²  ⟹  25 = 100 (x_max)²  ⟹  x_max = 0.5 m = 50 cm.",
      ],
      summary: "Option (C) is correct. The maximum extension is 50 cm.",
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
    formulaNote: "K_f = (1/4)·m·v²·(1 + e²); K_i = (1/2)·m·v²",
    svgDiagram: (
      <svg className="w-full max-w-[400px] h-28" viewBox="0 0 380 110">
        <line x1="20" y1="85" x2="360" y2="85" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        <circle cx="90" cy="65" r="16" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
        <text x="90" y="70" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" className="font-mono">m</text>
        <line x1="112" y1="65" x2="152" y2="65" stroke="#00f0ff" strokeWidth="3" markerEnd="url(#arrowNeonRed)" />
        <text x="132" y="55" fontSize="11" fontWeight="bold" fill="#00f0ff" className="font-mono">v</text>

        <circle cx="250" cy="65" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
        <text x="250" y="70" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" className="font-mono">m</text>
        <text x="250" y="42" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle" className="font-mono">at rest</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "1 / 2", latex: "\\frac{1}{2}" },
      { id: "B", label: "(B)", text: "1 / √2", latex: "\\frac{1}{\\sqrt{2}}" },
      { id: "C", label: "(C)", text: "√3 / 2", latex: "\\frac{\\sqrt{3}}{2}" },
      { id: "D", label: "(D)", text: "1 / √3", latex: "\\frac{1}{\\sqrt{3}}" },
    ],
    correctAnswers: ["B"],
    explanation: {
      keyFormula: "K_f = \\frac{1}{4}mv^2(1 + e^2) = \\frac{3}{4} \\left(\\frac{1}{2}mv^2\\right) = \\frac{3}{8}mv^2",
      steps: [
        "Post-collision velocities: v₁ = (1-e)v/2 and v₂ = (1+e)v/2.",
        "Total K_f = (1/4)mv²(1 + e²).",
        "(1/4)mv²(1 + e²) = (3/8)mv²  ⟹  1 + e² = 3/2  ⟹  e² = 1/2  ⟹  e = 1/√2.",
      ],
      summary: "Option (B) is correct. Restitution coefficient is 1/√2.",
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
        <circle cx="200" cy="70" r="10" fill="#be123c" stroke="#ff007f" strokeWidth="2" />
        <text x="200" y="95" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ff007f" className="font-mono">8 kg (at rest)</text>

        {/* P1 along +x */}
        <line x1="200" y1="70" x2="310" y2="70" stroke="#00f0ff" strokeWidth="3" markerEnd="url(#arrowNeonRed)" />
        <text x="290" y="60" fontSize="11" fontWeight="bold" fill="#00f0ff" className="font-mono">P₁ (1 kg, v₁)</text>

        {/* P2 along +y */}
        <line x1="200" y1="70" x2="200" y2="10" stroke="#00ff66" strokeWidth="3" markerEnd="url(#arrowNeonRed)" />
        <text x="210" y="25" fontSize="11" fontWeight="bold" fill="#00ff66" className="font-mono">P₂ (2 kg, v₂)</text>

        {/* P3 opposite */}
        <line x1="200" y1="70" x2="90" y2="130" stroke="#ffb700" strokeWidth="3" markerEnd="url(#arrowNeonRed)" />
        <text x="70" y="130" fontSize="11" fontWeight="bold" fill="#ffb700" className="font-mono">P₃ (5 kg, 20 m/s)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "The velocity of the 1 kg piece is 60 m/s", latex: "v_1 = 60\\text{ m/s}" },
      { id: "B", label: "(B)", text: "The velocity of the 2 kg piece is 40 m/s", latex: "v_2 = 40\\text{ m/s}" },
      { id: "C", label: "(C)", text: "The velocity of the 1 kg piece is 30 m/s", latex: "v_1 = 30\\text{ m/s}" },
      { id: "D", label: "(D)", text: "The total momentum of the three pieces after explosion is zero", latex: "\\vec{P}_{\\text{total}} = 0" },
    ],
    correctAnswers: ["A", "B", "D"],
    explanation: {
      keyFormula: "|\\vec{P}_3| = \\sqrt{P_1^2 + P_2^2} = \\sqrt{(3k)^2 + (4k)^2} = 5k = 5 \\times 20 = 100",
      steps: [
        "Let v₁ = 3k and v₂ = 2k.",
        "P₁ = 1(3k) = 3k, P₂ = 2(2k) = 4k.",
        "Resultant |P₃| = 5k = 100 kg·m/s  ⟹  k = 20.",
        "v₁ = 3(20) = 60 m/s, v₂ = 2(20) = 40 m/s.",
        "Total momentum is conserved and remains zero.",
      ],
      summary: "Options (A), (B), and (D) are correct.",
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
    formulaNote: "m·v₀·cosθ = (M+m)v",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-32" viewBox="0 0 400 130">
        <line x1="20" y1="110" x2="380" y2="110" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        
        {/* Wedge */}
        <polygon points="140,110 270,110 140,35" fill="#1e293b" stroke="#00f0ff" strokeWidth="2" />
        <text x="175" y="85" fontSize="14" fontWeight="bold" fill="#00f0ff" className="font-mono">M</text>

        {/* Mud Pellet */}
        <circle cx="80" cy="20" r="8" fill="#be123c" stroke="#ff007f" strokeWidth="1.5" />
        <line x1="80" y1="20" x2="145" y2="55" stroke="#ff007f" strokeWidth="2.5" markerEnd="url(#arrowNeonRed)" />
        <text x="75" y="48" fontSize="11" fontWeight="bold" fill="#ff007f" className="font-mono">m, v₀</text>
        <line x1="80" y1="20" x2="135" y2="20" stroke="#64748b" strokeDasharray="3 3" />
        <text x="115" y="16" fontSize="10" fontWeight="bold" fill="#ff007f" className="font-mono">θ</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "The common horizontal velocity of the system is v = (m v₀ cosθ) / (M + m)", latex: "v = \\frac{m v_0 \\cos\\theta}{M + m}" },
      { id: "B", label: "(B)", text: "The change in kinetic energy is -[(M + m·sin²θ)·m·v₀²] / [2(M + m)]", latex: "\\Delta K = -\\frac{(M + m\\sin^2\\theta) m v_0^2}{2(M + m)}" },
      { id: "C", label: "(C)", text: "Total linear momentum along the vertical direction is conserved", latex: "\\text{Vertical momentum conserved}" },
      { id: "D", label: "(D)", text: "Horizontal momentum of the (M + m) system is conserved", latex: "P_x = \\text{constant}" },
    ],
    correctAnswers: ["A", "B", "D"],
    explanation: {
      keyFormula: "P_x = m v_0 \\cos\\theta = (M + m)v, \\quad \\Delta K = \\frac{1}{2}(M+m)v^2 - \\frac{1}{2}m v_0^2",
      steps: [
        "Floor is smooth, so horizontal momentum is conserved: v = (m v₀ cosθ)/(M + m).",
        "Vertical momentum is not conserved due to floor normal impulse.",
        "KE change: ΔK = (1/2)(M+m)v² - (1/2)mv₀² = -[(M + m·sin²θ)·m·v₀²] / [2(M + m)].",
      ],
      summary: "Options (A), (B), and (D) are correct.",
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
    formulaNote: "v' = v + 2u in ground frame",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-28" viewBox="0 0 400 110">
        {/* Ball */}
        <circle cx="90" cy="55" r="14" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
        <text x="90" y="60" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-mono">m</text>
        <line x1="115" y1="55" x2="160" y2="55" stroke="#00f0ff" strokeWidth="3" markerEnd="url(#arrowNeonRed)" />
        <text x="135" y="45" fontSize="11" fontWeight="bold" fill="#00f0ff" className="font-mono">v</text>

        {/* Wall */}
        <rect x="250" y="15" width="45" height="80" fill="#1e293b" stroke="#ff007f" strokeWidth="2" rx="4" />
        <line x1="240" y1="55" x2="195" y2="55" stroke="#ff007f" strokeWidth="3" markerEnd="url(#arrowNeonRed)" />
        <text x="215" y="45" fontSize="11" fontWeight="bold" fill="#ff007f" className="font-mono">u (←)</text>
        <text x="272" y="58" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle" className="font-mono">WALL</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "Rebound speed of the ball relative to ground is v' = v + 2u", latex: "v' = v + 2u" },
      { id: "B", label: "(B)", text: "The average elastic force acting on the ball is 2m(u + v) / Δt", latex: "F_{\\text{avg}} = \\frac{2m(u + v)}{\\Delta t}" },
      { id: "C", label: "(C)", text: "The kinetic energy of the ball increases by 2mu(u + v)", latex: "\\Delta K = 2mu(u + v)" },
      { id: "D", label: "(D)", text: "The magnitude of impulse received by the ball is 2m(u + v)", latex: "J = 2m(u + v)" },
    ],
    correctAnswers: ["A", "B", "C", "D"],
    explanation: {
      keyFormula: "v' = v + 2u, \\quad J = 2m(u + v), \\quad \\Delta K = 2mu(u + v)",
      steps: [
        "In wall frame: approach speed = v + u, separation speed = v + u.",
        "In ground frame: v' = (v + u) + u = v + 2u. (A is True)",
        "Impulse magnitude: J = m[v' - (-v)] = 2m(u + v). (D is True)",
        "Average force: F = J / Δt = 2m(u + v) / Δt. (B is True)",
        "ΔK = (1/2)m(v+2u)² - (1/2)mv² = 2mu(u + v). (C is True)",
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
    formulaNote: "v_x = -e·u_x = -1.5 m/s, v_y = u_y = 1 m/s",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-32" viewBox="0 0 400 130">
        <line x1="280" y1="10" x2="280" y2="120" stroke="#00f0ff" strokeWidth="6" strokeLinecap="round" />
        <text x="290" y="30" fontSize="11" fontWeight="bold" fill="#00f0ff" className="font-mono">Wall || ĵ</text>

        {/* Incident Ball */}
        <circle cx="110" cy="65" r="14" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
        <line x1="110" y1="65" x2="240" y2="95" stroke="#00f0ff" strokeWidth="2.5" markerEnd="url(#arrowNeonRed)" />
        <text x="145" y="70" fontSize="11" fontWeight="bold" fill="#00f0ff" className="font-mono">u = 3î + ĵ</text>

        {/* Reflected Path */}
        <line x1="280" y1="95" x2="180" y2="125" stroke="#ff007f" strokeWidth="2.5" markerEnd="url(#arrowNeonRed)" />
        <text x="210" y="125" fontSize="11" fontWeight="bold" fill="#ff007f" className="font-mono">v = -1.5î + ĵ</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "The velocity of the sphere after impact is -(3/2)î + ĵ m/s", latex: "\\vec{v} = -\\frac{3}{2}\\hat{i} + \\hat{j}\\text{ m/s}" },
      { id: "B", label: "(B)", text: "The loss in kinetic energy caused by the impact is (27/8)m Joules", latex: "\\Delta K = \\frac{27}{8}m\\text{ J}" },
      { id: "C", label: "(C)", text: "The impulse vector delivered by the wall is -(9/2)m î N·s", latex: "\\vec{J} = -\\frac{9}{2}m\\hat{i}\\text{ N}\\cdot\\text{s}" },
      { id: "D", label: "(D)", text: "The velocity component along the wall (ĵ) is completely destroyed", latex: "v_y = 0" },
    ],
    correctAnswers: ["A", "B", "C"],
    explanation: {
      keyFormula: "v_x = -e(3) = -1.5\\text{ m/s}, \\quad v_y = 1\\text{ m/s}",
      steps: [
        "Frictionless along ĵ ⟹ v_y = u_y = 1 m/s.",
        "Normal restitution: v_x = -0.5(3) = -1.5 = -3/2 m/s. (A is True)",
        "Initial KE = (1/2)m(3² + 1²) = 5m J.",
        "Final KE = (1/2)m(1.5² + 1²) = (13/8)m J. Loss = 5m - 13/8m = (27/8)m J. (B is True)",
        "Impulse = m(v - u) = m(-1.5î - 3î) = -(9/2)m î. (C is True)",
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
    formulaNote: "v_B1 = 3 m/s, v_B2 = 12 m/s; Deceleration a = μg = 3 m/s²",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-32" viewBox="0 0 400 120">
        <line x1="20" y1="85" x2="180" y2="85" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        <line x1="180" y1="85" x2="380" y2="85" stroke="#ff007f" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />
        
        {/* B1 */}
        <rect x="70" y="45" width="48" height="40" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" rx="4" />
        <text x="94" y="70" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-mono">2m (B₁)</text>
        <line x1="125" y1="65" x2="160" y2="65" stroke="#00f0ff" strokeWidth="2.5" markerEnd="url(#arrowNeonRed)" />
        <text x="140" y="55" fontSize="10" fontWeight="bold" fill="#00f0ff" className="font-mono">9 m/s</text>

        {/* B2 */}
        <rect x="195" y="52" width="38" height="33" fill="#065f46" stroke="#00ff66" strokeWidth="2" rx="4" />
        <text x="214" y="73" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">m (B₂)</text>

        <text x="90" y="105" fontSize="10" fontWeight="bold" fill="#64748b" className="font-mono">Smooth (μ = 0)</text>
        <text x="280" y="105" fontSize="10" fontWeight="bold" fill="#ff007f" className="font-mono">Rough (μ = 0.3)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "Block B₂ comes to rest before the second collision happens", latex: "\\text{B}_2\\text{ stops before 2nd impact}" },
      { id: "B", label: "(B)", text: "The second collision between the blocks occurs at t = 8 s", latex: "t_{\\text{impact}} = 8\\text{ s}" },
      { id: "C", label: "(C)", text: "The maximum relative separation between B₁ and B₂ is 13.5 m", latex: "x_{\\max} = 13.5\\text{ m}" },
      { id: "D", label: "(D)", text: "Infinite number of collisions are possible between the blocks", latex: "N_{\\text{collisions}} = \\infty" },
    ],
    correctAnswers: ["A", "B", "C", "D"],
    explanation: {
      keyFormula: "t_{\\text{stop}} = 12/3 = 4\\text{ s}, \\quad s = 24\\text{ m}, \\quad t_{\\text{catch}} = 24/3 = 8\\text{ s}",
      steps: [
        "Post-collision: v_B1 = 3 m/s, v_B2 = 12 m/s.",
        "B₂ stops in t = 12/3 = 4 s after traveling s = 12²/(2×3) = 24 m.",
        "B₁ reaches 24 m at t = 24/3 = 8 s. Since 8 > 4, B₂ is already at rest. (A, B True)",
        "Max relative separation: x(t) = 9t - 1.5t² ⟹ max at t=3s gives 13.5 m. (C True)",
        "B₁ keeps positive speed on smooth surface, repeating collisions infinitely. (D True)",
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
    formulaNote: "u₁ = √[2gL(1 - cosθ)]; v₁ = [(m₁ - m₂) / (m₁ + m₂)] · u₁",
    svgDiagram: (
      <svg className="w-full max-w-[400px] h-36" viewBox="0 0 380 140">
        <line x1="190" y1="10" x2="190" y2="120" stroke="#475569" strokeDasharray="3 3" />
        <line x1="190" y1="10" x2="270" y2="75" stroke="#00f0ff" strokeWidth="2" />
        <circle cx="270" cy="75" r="10" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
        <text x="295" y="75" fontSize="11" fontWeight="bold" fill="#00f0ff" className="font-mono">10 g (60°)</text>

        <circle cx="190" cy="120" r="14" fill="#065f46" stroke="#00ff66" strokeWidth="2" />
        <text x="190" y="124" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">20 g</text>
        <text x="190" y="138" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="middle" className="font-mono">at rest</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "n = 1", latex: "n = 1" },
      { id: "B", label: "(B)", text: "n = 2", latex: "n = 2" },
      { id: "C", label: "(C)", text: "n = 3", latex: "n = 3" },
      { id: "D", label: "(D)", text: "n = 4", latex: "n = 4" },
    ],
    correctAnswers: ["C"],
    explanation: {
      keyFormula: "u_1 = \\sqrt{2gh} = \\sqrt{2 \\times 980 \\times 50} = \\sqrt{98000}, \\quad v_1 = -\\frac{1}{3}\\sqrt{98000} = -\\frac{980}{3}",
      steps: [
        "h = L(1 - cos 60°) = 100(0.5) = 50 cm.",
        "u₁ = √(2 × 980 × 50) = √98000 cm/s.",
        "v₁ = [(10 - 20)/30] · √98000 = -(1/3)√98000 = -980/3 cm/s.",
        "Comparing with -980/n gives n = 3.",
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
    formulaNote: "v₁ = 2.5 m/s, v₂ = 7.5 m/s; Total time = 4/3 + 8/3 = 4 s",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-28" viewBox="0 0 400 110">
        <line x1="20" y1="85" x2="360" y2="85" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        <line x1="360" y1="20" x2="360" y2="95" stroke="#00f0ff" strokeWidth="6" strokeLinecap="round" />
        
        <circle cx="120" cy="65" r="14" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
        <text x="120" y="70" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">v₁</text>

        <circle cx="230" cy="65" r="14" fill="#065f46" stroke="#00ff66" strokeWidth="2" />
        <text x="230" y="70" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">v₂</text>

        <text x="360" y="15" fontSize="10" fontWeight="bold" fill="#00f0ff" textAnchor="middle" className="font-mono">WALL</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "2.5 s", latex: "2.5\\text{ s}" },
      { id: "B", label: "(B)", text: "3.0 s", latex: "3.0\\text{ s}" },
      { id: "C", label: "(C)", text: "4.0 s", latex: "4.0\\text{ s}" },
      { id: "D", label: "(D)", text: "5.0 s", latex: "5.0\\text{ s}" },
    ],
    correctAnswers: ["C"],
    explanation: {
      keyFormula: "v_1 = 2.5\\text{ m/s}, \\quad v_2 = 7.5\\text{ m/s}, \\quad t = t_1 + t_2 = \\frac{4}{3} + \\frac{8}{3} = 4\\text{ s}",
      steps: [
        "v₁ = (1-0.5)10/2 = 2.5 m/s; v₂ = (1+0.5)10/2 = 7.5 m/s.",
        "Distance to wall s = 2.5 × (4/3) = 10/3 m.",
        "Time for 2nd collision t = 4/3 + 8/3 = 12/3 = 4.0 s.",
      ],
      summary: "Option (C) is correct. Total elapsed time is 4.0 seconds.",
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
    formulaNote: "t_c = 100 / 50 = 2 s; h = 80 m; V_common = 5 m/s (↑)",
    svgDiagram: (
      <svg className="w-full max-w-[420px] h-36" viewBox="0 0 400 140">
        <line x1="30" y1="125" x2="370" y2="125" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        <text x="45" y="137" fontSize="10" fontWeight="bold" fill="#64748b" className="font-mono">GROUND</text>

        {/* Top Ball Dropped */}
        <circle cx="200" cy="20" r="10" fill="#be123c" stroke="#ff007f" strokeWidth="2" />
        <line x1="200" y1="33" x2="200" y2="55" stroke="#ff007f" strokeWidth="2.5" markerEnd="url(#arrowNeonRed)" />
        <text x="240" y="25" fontSize="10" fontWeight="bold" fill="#ff007f" className="font-mono">Dropped (100 m)</text>

        {/* Bottom Ball Thrown */}
        <circle cx="200" cy="115" r="10" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
        <line x1="200" y1="102" x2="200" y2="78" stroke="#00f0ff" strokeWidth="2.5" markerEnd="url(#arrowNeonRed)" />
        <text x="240" y="115" fontSize="10" fontWeight="bold" fill="#00f0ff" className="font-mono">u = 50 m/s (↑)</text>
      </svg>
    ),
    options: [
      { id: "A", label: "(A)", text: "4.5 s", latex: "4.5\\text{ s}" },
      { id: "B", label: "(B)", text: "6.5 s", latex: "6.5\\text{ s}" },
      { id: "C", label: "(C)", text: "9.0 s", latex: "9.0\\text{ s}" },
      { id: "D", label: "(D)", text: "13.0 s", latex: "13.0\\text{ s}" },
    ],
    correctAnswers: ["A"],
    explanation: {
      keyFormula: "t_c = \\frac{100}{50} = 2\\text{ s}, \\quad h = 80\\text{ m}, \\quad V = \\frac{30 - 20}{2} = 5\\text{ m/s}",
      steps: [
        "Time to collide: t_c = 100 / 50 = 2 s.",
        "Collision height: h = 50(2) - 0.5(10)(4) = 80 m.",
        "Velocities: u₁ = 30 m/s (↑), u₂ = -20 m/s (↓) ⟹ V = 5 m/s (↑).",
        "Time to apex: 0.5 s, Apex height = 81.25 m.",
        "Fall from apex: √(2 × 81.25 / 10) = 4.03 ≈ 4 s.",
        "Total time after collision = 0.5 s + 4.0 s = 4.5 s.",
      ],
      summary: "Option (A) is correct. The total time for the combined mass to hit the ground is 4.5 seconds.",
    },
  },
];
