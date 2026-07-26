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
      const viewport = window.innerHeight || 1;
      // Hero line starts muted; scroll down to light words in sequence
      const distance = Math.max(220, viewport * 0.4);
      const raw = window.scrollY / distance;
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
        const local =
          (progress - wordStart) / Math.max(0.0001, wordEnd - wordStart);
        const t = Math.min(1, Math.max(0, local));
        const opacity = 0.28 + t * 0.72;

        return (
          <span
            key={`${word}-${index}`}
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
