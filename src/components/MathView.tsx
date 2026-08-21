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
function convertUnicodeToLatex(str: string): string {
  return str
    .replace(/√\(([^)]+)\)/g, "\\sqrt{$1}")
    .replace(/√([0-9a-zA-Z]+)/g, "\\sqrt{$1}")
    .replace(/·/g, " \\cdot ")
    .replace(/î/g, "\\hat{i}")
    .replace(/ĵ/g, "\\hat{j}")
    .replace(/k̂/g, "\\hat{k}")
    .replace(/≤/g, " \\le ")
    .replace(/≥/g, " \\ge ")
    .replace(/θ/g, " \\theta ")
    .replace(/Δ/g, " \\Delta ")
    .replace(/λ/g, " \\lambda ")
    .replace(/μ/g, " \\mu ")
    .replace(/⟹/g, " \\implies ")
    .replace(/±/g, " \\pm ")
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
 * Checks if a string contains typical LaTeX macros or math symbols
 */
function containsLatexSyntax(str: string): boolean {
  return (
    /\\[a-zA-Z]+/.test(str) ||
    str.includes("=") ||
    str.includes("^") ||
    str.includes("_") ||
    str.includes("\\") ||
    str.includes("{") ||
    str.includes("}") ||
    str.includes("√") ||
    str.includes("·") ||
    str.includes("≤") ||
    str.includes("≥") ||
    str.includes("θ") ||
    str.includes("Δ") ||
    str.includes("λ") ||
    str.includes("μ") ||
    str.includes("⟹") ||
    str.includes("±")
  );
}

/**
 * Attempts to render a formula string directly via KaTeX
 */
function renderKaTeXString(formula: string, displayMode: boolean = false): string | null {
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
 * MathView component: renders mathematical expressions with KaTeX while preserving
 * clean text readability for questions, formula cheat sheets, options, and explanations.
 */
export const MathView: React.FC<MathViewProps> = ({
  text = "",
  latex,
  className = "",
  inline = true,
}) => {
  // 1. Explicit latex prop provided
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
      <span className={`inline leading-relaxed text-zinc-100 ${className}`}>
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
                className="inline-block text-cyan-200 px-0.5"
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

  // 3. Check for "Label: Formula" pattern (common in step-by-step solutions)
  // Example: "Time for dropped Ball 2 to reach floor: t₀ = √(2h₀/g)."
  const colonIndex = raw.indexOf(":");
  if (colonIndex > 0 && colonIndex < raw.length - 2) {
    const label = raw.substring(0, colonIndex + 1);
    const formulaRaw = raw.substring(colonIndex + 1).trim();

    // Check if the formula part contains math notation
    if (containsLatexSyntax(formulaRaw)) {
      let cleanedFormula = convertUnicodeToLatex(formulaRaw);
      let trailingPeriod = false;
      if (cleanedFormula.endsWith(".")) {
        trailingPeriod = true;
        cleanedFormula = cleanedFormula.slice(0, -1).trim();
      }

      const html = renderKaTeXString(cleanedFormula, !inline && !formulaRaw.includes(" "));
      if (html) {
        return (
          <span className={`leading-relaxed text-zinc-100 ${className}`}>
            <span className="font-semibold text-zinc-300 mr-2">{label}</span>
            <span
              className="inline-block text-cyan-200 align-middle"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {trailingPeriod && <span className="text-zinc-300">.</span>}
          </span>
        );
      }
    }
  }

  // 4. Check if the string contains LaTeX commands (e.g. \frac, \sqrt, \Delta, \le, etc.)
  if (containsLatexSyntax(raw)) {
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

  // 5. Normal plain text
  return <span className={`leading-relaxed text-zinc-100 ${className}`}>{raw}</span>;
};
