import React from "react";
import katex from "katex";

interface MathViewProps {
  text?: string;
  latex?: string;
  className?: string;
  inline?: boolean;
}

/**
 * Converts standard Unicode physics/math symbols to their LaTeX equivalents
 */
export function convertUnicodeToLatex(str: string): string {
  return str
    .replace(/√\(([^)]+)\)/g, "\\sqrt{$1}")
    .replace(/√([0-9a-zA-Z]+)/g, "\\sqrt{$1}")
    .replace(/·/g, " \\cdot ")
    .replace(/î/g, "\\hat{i}")
    .replace(/ĵ/g, "\\hat{j}")
    .replace(/k̂/g, "\\hat{k}")
    .replace(/≤/g, " \\le ")
    .replace(/≥/g, " \\ge ")
    .replace(/θ/g, "\\theta ")
    .replace(/Δ/g, "\\Delta ")
    .replace(/λ/g, "\\lambda ")
    .replace(/μ/g, "\\mu ")
    .replace(/⟹/g, " \\implies ")
    .replace(/±/g, "\\pm ")
    .replace(/₀/g, "_0")
    .replace(/₁/g, "_1")
    .replace(/₂/g, "_2")
    .replace(/₃/g, "_3")
    .replace(/⁴/g, "^4")
    .replace(/³/g, "^3")
    .replace(/²/g, "^2")
    .replace(/⁻¹/g, "^{-1}")
    .replace(/°/g, "^\\circ");
}

/**
 * Safely renders a LaTeX formula string with KaTeX
 */
export function renderKaTeXString(formula: string, displayMode: boolean = false): string | null {
  try {
    return katex.renderToString(formula.trim(), {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch {
    return null;
  }
}

/**
 * Checks if a string is purely a standalone mathematical formula or equation
 * (as opposed to an English prose sentence describing a physics question or summary).
 */
export function isPureFormula(str: string): boolean {
  const trimmed = str.trim();

  // If it starts with standard LaTeX macros
  if (/^\\(frac|sqrt|Delta|left|begin|vec|int|sum|lim|partial|alpha|beta|theta|tan|sin|cos|log|ln|text)\b/.test(trimmed)) {
    return true;
  }

  // Count non-math English words (3+ letters) that aren't math functions
  const words = trimmed
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/\{[^}]*\}/g, "")
    .split(/[\s,;:!?()]+/)
    .filter(
      (w) =>
        /^[a-zA-Z]{3,}$/.test(w) &&
        !["sin", "cos", "tan", "cot", "sec", "csc", "log", "sqrt", "frac", "left", "right", "implies", "cdot", "quad", "text", "and", "for"].includes(w.toLowerCase())
    );

  // If there are 2 or more regular English words (e.g. "body", "mass", "moving", "velocity", "undergoes", "collision", "find")
  // it is PROSE, NOT a standalone formula!
  if (words.length >= 2) {
    return false;
  }

  // If it contains typical LaTeX math markers or equation structure without prose words
  if (
    trimmed.includes("\\") ||
    trimmed.includes("^") ||
    trimmed.includes("_") ||
    trimmed.includes("=") ||
    trimmed.includes("≤") ||
    trimmed.includes("≥") ||
    trimmed.includes("√") ||
    trimmed.includes("·") ||
    trimmed.includes("⟹")
  ) {
    return true;
  }

  return false;
}

/**
 * MathView component: cleanly renders mathematical formulas with KaTeX while preserving
 * full natural word spacing, typography, and readability for English sentences and questions.
 */
export const MathView: React.FC<MathViewProps> = ({
  text = "",
  latex,
  className = "",
  inline = true,
}) => {
  // 1. Explicit latex prop provided (e.g. from options or formula note)
  if (latex) {
    const html = renderKaTeXString(latex, !inline);
    if (html) {
      return (
        <span
          className={`inline-block font-sans text-cyan-200 ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    return <span className={className}>{latex}</span>;
  }

  if (!text) return null;
  const raw = text.trim();

  // 2. Text contains explicit $...$ or $$...$$ delimiters
  if (raw.includes("$")) {
    const parts = raw.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
    return (
      <span className={`leading-relaxed text-zinc-100 ${className}`}>
        {parts.map((part, i) => {
          if (part.startsWith("$$") && part.endsWith("$$")) {
            const math = part.slice(2, -2).trim();
            const html = renderKaTeXString(math, true);
            return html ? (
              <span
                key={i}
                className="block my-2 text-cyan-200"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <span key={i}>{part}</span>
            );
          } else if (part.startsWith("$") && part.endsWith("$")) {
            const math = part.slice(1, -1).trim();
            const html = renderKaTeXString(math, false);
            return html ? (
              <span
                key={i}
                className="inline-block text-cyan-200 px-0.5 align-baseline"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <span key={i}>{part}</span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  }

  // 3. Step-by-step solution pattern: "Label: Formula"
  // Example: "Time for dropped Ball 2 to reach floor: t₀ = √(2h₀/g)."
  const colonIndex = raw.indexOf(":");
  if (colonIndex > 0 && colonIndex < 35 && !raw.substring(0, colonIndex).includes("=")) {
    const label = raw.substring(0, colonIndex + 1);
    let formulaPart = raw.substring(colonIndex + 1).trim();
    let trailingPeriod = false;
    if (formulaPart.endsWith(".")) {
      trailingPeriod = true;
      formulaPart = formulaPart.slice(0, -1).trim();
    }

    if (isPureFormula(formulaPart)) {
      const converted = convertUnicodeToLatex(formulaPart);
      const html = renderKaTeXString(converted, false);
      if (html && !html.includes("katex-error")) {
        return (
          <span className={`leading-relaxed text-zinc-100 ${className}`}>
            <span className="font-semibold text-cyan-300 mr-2">{label}</span>
            <span
              className="inline-block text-cyan-100 align-middle font-mono py-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {trailingPeriod && <span className="text-zinc-400">.</span>}
          </span>
        );
      }
    }
  }

  // 4. Pure standalone formula (options, cheat sheets, keyFormula)
  if (isPureFormula(raw)) {
    const converted = convertUnicodeToLatex(raw);
    const html = renderKaTeXString(converted, !inline);
    if (html && !html.includes("katex-error")) {
      return (
        <span
          className={`inline-block text-cyan-200 ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
  }

  // 5. English prose sentence (e.g. questionText, explanation summary)
  // Preserves normal readable spaces, fonts, line-height, and typography
  return <span className={`leading-relaxed text-zinc-100 font-normal tracking-normal ${className}`}>{raw}</span>;
};

