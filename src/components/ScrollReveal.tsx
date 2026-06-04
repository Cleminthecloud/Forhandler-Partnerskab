"use client";
import { useEffect, useRef, useState } from "react";

/* Scroll-triggered reveal — wraps a section that should fade-and-rise
   in as it enters the viewport. IntersectionObserver-based so it works
   everywhere (Safari, Firefox, Chromium). Respects prefers-reduced-motion.

   Usage:
     <ScrollReveal>
       <section className="card">…</section>
     </ScrollReveal>

   Stagger cascading siblings:
     {items.map((item, i) => (
       <ScrollReveal key={item.id} delay={i * 60}>…</ScrollReveal>
     ))}

   Once revealed, the IO disconnects — no further work after the entry
   animates in. Designed to feel fluid, not flashy: opacity 0 → 1, 20px
   rise, 700ms ease-out (the same Apple/Linear curve used everywhere). */

interface Props {
  children: React.ReactNode;
  /** Milliseconds to delay the transition start — use for staggered cascades. */
  delay?: number;
  /** Additional className on the wrapper. */
  className?: string;
  /** Override the default ~700ms duration. */
  durationMs?: number;
  /** Tag to render. Defaults to div. */
  as?: "div" | "section" | "article";
}

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  durationMs,
  as = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the element is already in viewport on mount (e.g. above-the-fold
    // dashboard hero), reveal immediately without waiting for a scroll —
    // otherwise the user lands on a page full of invisible elements.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // RAF so the initial paint is hidden, then animation fires next frame.
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      // Fire when the element is ~8% from the bottom edge of viewport —
      // gives the reveal time to play before the user reads the content.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLElement>}
      className={`scroll-reveal ${visible ? "in-view" : ""} ${className}`.trim()}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
        transitionDuration: durationMs ? `${durationMs}ms` : undefined,
      }}
    >
      {children}
    </Tag>
  );
}
