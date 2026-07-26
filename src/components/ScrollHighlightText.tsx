"use client";

import { useEffect, useRef, useState } from "react";

type ScrollHighlightTextProps = {
  text: string;
  className?: string;
};

export function ScrollHighlightText({
  text,
  className = "",
}: ScrollHighlightTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);
  const words = text.trim().split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // Start highlighting as the line enters the middle band of the viewport
      const start = viewport * 0.72;
      const end = viewport * 0.28;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => {
        const wordStart = index / words.length;
        const wordEnd = (index + 1) / words.length;
        const local = (progress - wordStart) / (wordEnd - wordStart);
        const opacity = 0.28 + Math.min(1, Math.max(0, local)) * 0.72;

        return (
          <span
            key={`${word}-${index}`}
            className="transition-colors duration-150"
            style={{ color: `rgba(0, 0, 0, ${opacity})` }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}
