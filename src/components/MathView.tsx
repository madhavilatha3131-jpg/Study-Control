import React from "react";
import katex from "katex";

interface MathViewProps {
  text: string;
  latex?: string;
  className?: string;
  inline?: boolean;
}

/**
 * MathView renders mathematical expressions with KaTeX while preserving clean text readability.
 * Supports:
 * 1. Explicit `latex` prop (renders full KaTeX).
 * 2. Delimited `$inline$` and `$$display$$` LaTeX inside text.
 * 3. Pure math strings (e.g., options, expressions).
 * 4. Regular English sentences with math symbols without smashing text into math-mode.
 */
export const MathView: React.FC<MathViewProps> = ({
  text,
  latex,
  className = "",
  inline = true,
}) => {
  // If explicit LaTeX is provided, render directly with KaTeX
  if (latex) {
    try {
      const html = katex.renderToString(latex, {
        displayMode: !inline,
        throwOnError: false,
        output: "htmlAndMathml",
      });
      return (
        <span
          className={`inline-block font-sans text-cyan-200 ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      return <span className={className}>{latex}</span>;
    }
  }

  if (!text) return null;

  const renderSingleLatex = (formula: string, displayMode: boolean = false) => {
    try {
      const html = katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
        output: "htmlAndMathml",
      });
      return (
        <span
          key={formula + Math.random()}
          className="inline-block text-cyan-200 px-0.5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      return <span>{formula}</span>;
    }
  };

  // 1. Text contains explicit $...$ or $$...$$ delimiters
  if (text.includes("$")) {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
    return (
      <span className={`inline leading-relaxed text-zinc-100 ${className}`}>
        {parts.map((part, i) => {
          if (part.startsWith("$$") && part.endsWith("$$")) {
            const math = part.slice(2, -2).trim();
            return renderSingleLatex(math, true);
          } else if (part.startsWith("$") && part.endsWith("$")) {
            const math = part.slice(1, -1).trim();
            return renderSingleLatex(math, false);
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  }

  // 2. Determine if the entire text is a short, pure formula (e.g. in option buttons or formula notes)
  // If it has multiple spaces and words (> 4 words), it is a sentence! Do NOT treat sentence as KaTeX math mode.
  const wordCount = text.trim().split(/\s+/).length;
  const isSentence = wordCount > 4 || (text.includes(".") && wordCount > 2) || text.length > 60;

  if (!isSentence) {
    const looksLikeFormula =
      text.includes("^") ||
      text.includes("√") ||
      text.includes("·") ||
      text.includes("î") ||
      text.includes("ĵ") ||
      text.includes("k̂") ||
      text.includes("≤") ||
      text.includes("≥") ||
      text.includes("θ") ||
      text.includes("Δ") ||
      text.includes("λ") ||
      text.includes("μ") ||
      text.includes("⟹") ||
      text.includes("/") ||
      text.includes("=") ||
      text.includes("+") ||
      text.includes("-") ||
      text.includes("\\");

    if (looksLikeFormula) {
      let converted = text
        .replace(/√\(([^)]+)\)/g, "\\sqrt{$1}")
        .replace(/√([0-9a-zA-Z]+)/g, "\\sqrt{$1}")
        .replace(/·/g, " \\cdot ")
        .replace(/î/g, "\\hat{i}")
        .replace(/ĵ/g, "\\hat{j}")
        .replace(/k̂/g, "\\hat{k}")
        .replace(/≤/g, "\\le ")
        .replace(/≥/g, "\\ge ")
        .replace(/θ/g, "\\theta ")
        .replace(/Δ/g, "\\Delta ")
        .replace(/λ/g, "\\lambda ")
        .replace(/μ/g, "\\mu ")
        .replace(/⟹/g, "\\implies ");

      return (
        <span className={`inline-block ${className}`}>
          {renderSingleLatex(converted, !inline)}
        </span>
      );
    }
  }

  // 3. Normal sentence: render cleanly with high legibility and proper word spaces
  return <span className={`leading-relaxed text-zinc-100 ${className}`}>{text}</span>;
};
