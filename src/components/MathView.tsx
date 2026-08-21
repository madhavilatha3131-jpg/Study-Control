import React from "react";
import katex from "katex";

interface MathViewProps {
  text: string;
  className?: string;
  inline?: boolean;
}

/**
 * MathView automatically parses inline LaTeX ($...$ or $$...$$) and standard ASCII math fragments,
 * rendering them with KaTeX. If plain text is passed without delimiters, it checks if it contains
 * mathematical notations (e.g. fractions, sqrt, powers, vectors) and wraps them gracefully.
 */
export const MathView: React.FC<MathViewProps> = ({ text, className = "", inline = true }) => {
  if (!text) return null;

  // Function to render single LaTeX string with KaTeX
  const renderLatex = (latex: string, displayMode: boolean = false) => {
    try {
      const html = katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        output: "htmlAndMathml",
      });
      return <span key={latex + Math.random()} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <span>{latex}</span>;
    }
  };

  // If text already has $ or $$, parse delimiters
  if (text.includes("$")) {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
    return (
      <span className={className}>
        {parts.map((part, i) => {
          if (part.startsWith("$$") && part.endsWith("$$")) {
            const math = part.slice(2, -2).trim();
            return renderLatex(math, true);
          } else if (part.startsWith("$") && part.endsWith("$")) {
            const math = part.slice(1, -1).trim();
            return renderLatex(math, false);
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  }

  // If it's a direct formula string (like in options), check if it needs auto-math rendering
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
    text.includes("v₁") ||
    text.includes("v₂") ||
    text.includes("m₁") ||
    text.includes("m₂");

  if (looksLikeFormula) {
    // Convert common representations into clean LaTeX if not already LaTeX
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
      <span className={`inline-flex items-center flex-wrap gap-1 ${className}`}>
        {renderLatex(converted, !inline)}
      </span>
    );
  }

  return <span className={className}>{text}</span>;
};
