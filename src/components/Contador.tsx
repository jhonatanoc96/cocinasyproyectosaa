"use client";

import { useEffect, useRef } from "react";

/**
 * Number that counts up when it scrolls into view. The server renders the
 * final value (SEO / no-JS); the animation only rewrites the text node.
 */
export function Contador({ valor, duracion = 1600 }: { valor: number; duracion?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = "0";
    let frame = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const inicio = performance.now();
        const paso = (t: number) => {
          const p = Math.min(1, (t - inicio) / duracion);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = String(Math.round(valor * eased));
          if (p < 1) frame = requestAnimationFrame(paso);
        };
        frame = requestAnimationFrame(paso);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [valor, duracion]);

  return (
    <span ref={ref} className="tabular-nums">
      {valor}
    </span>
  );
}
