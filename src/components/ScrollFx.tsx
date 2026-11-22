"use client";

import { useEffect } from "react";

const SELECTOR = ".reveal, [data-fx]";

/**
 * Scroll reveal for every `.reveal` / [data-fx] element (see globals.css).
 * - Children of [data-fx-stagger] get an index (--i) for staggered delays.
 * - A MutationObserver picks up elements added by client navigations.
 * Rendered once in the site layout; renders nothing.
 */
export function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    const preparar = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>("[data-fx-stagger]").forEach((g) => {
        Array.from(g.children).forEach((c, i) =>
          (c as HTMLElement).style.setProperty("--i", String(i))
        );
      });
      scope.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.classList.contains("in")) return;
        if (reducido) el.classList.add("in");
        else io.observe(el);
      });
    };

    preparar(document);
    root.classList.add("fx-ready");

    const mo = new MutationObserver((muts) => {
      for (const m of muts)
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            if (n.matches(SELECTOR) && !n.classList.contains("in")) io.observe(n);
            preparar(n);
          }
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
