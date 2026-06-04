"use client";

import { useEffect, useRef, useState } from "react";

/* =====================================================================
   HelpHint — small "?" icon next to section titles that opens a
   click-away popover with a short explanation. Improves discoverability
   for non-power users without modal overhead.

   Usage:
     <h3 className="t-h3 inline-flex items-center gap-1.5">
       Tier-progression
       <HelpHint label="Hvad er tier-progression?">
         Du tjener point hver gang du køber hos Carl Ras eller løser
         sager via platformen. Når du krydser tærsklen til næste niveau
         (Sølv 500, Guld 2.000), låses nye fordele op automatisk.
       </HelpHint>
     </h3>

   Pattern:
   - Small inline "?" button — same height as the heading
   - Click toggles a popover anchored below the icon
   - Outside-click closes, ESC closes
   - 280px wide, max 4 lines of text, no scrollbars
   - Focus-visible ring for keyboard users
   ===================================================================== */

interface HelpHintProps {
  /** Accessible label for the trigger button (announced to screen readers). */
  label: string;
  /** Explanation shown inside the popover. Plain text or React nodes. */
  children: React.ReactNode;
  /** Where the popover anchors. Defaults to "bottom-left". */
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

export function HelpHint({ label, children, placement = "bottom-left" }: HelpHintProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  // Click outside + ESC to close
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Position classes per placement
  const posClass = {
    "bottom-left":  "top-[calc(100%+8px)] left-0",
    "bottom-right": "top-[calc(100%+8px)] right-0",
    "top-left":     "bottom-[calc(100%+8px)] left-0",
    "top-right":    "bottom-[calc(100%+8px)] right-0",
  }[placement];

  return (
    <span ref={wrapperRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        aria-label={label}
        aria-expanded={open}
        className={
          "inline-grid place-items-center size-5 rounded-full text-[11px] font-semibold transition-colors " +
          (open
            ? "bg-[var(--accent)] text-white"
            : "bg-[var(--canvas-2)] text-[var(--ink-3)] hover:bg-[var(--accent-tint)] hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]")
        }
        style={{ fontFamily: "Georgia, serif", lineHeight: 1 }}
      >
        ?
      </button>

      {open && (
        <span
          role="dialog"
          aria-label={label}
          className={
            "absolute z-50 w-[280px] max-w-[88vw] rounded-[var(--r-md)] bg-white border border-[var(--line-2)] shadow-[0_8px_28px_rgba(0,0,0,0.10)] p-3.5 " +
            posClass
          }
          style={{ animation: "fadeInUp 180ms ease both" }}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[var(--accent)]">Hvad er det?</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Luk"
              className="-mt-0.5 -mr-0.5 size-5 grid place-items-center rounded-full text-[var(--ink-3)] hover:bg-[var(--canvas-2)] hover:text-[var(--ink)] transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-[12.5px] text-[var(--ink-2)] leading-[1.5]">{children}</div>
        </span>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  );
}
