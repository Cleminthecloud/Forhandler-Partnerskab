"use client";
import { ReactNode } from "react";

/* =====================================================================
   Shared page header used across all /partner, /admin pages.

   - "default" variant: tall hero-style header for dashboards and lists
     (eyebrow on top, t-display title, optional t-body-lg lead)
   - "compact" variant: single-row header for canvas/editor pages
     (Kampagner, Specialister) — eyebrow + title inline, no lead

   Both variants accept optional `themeColor` to render a colored dot
   next to the eyebrow (signals the active årshjul theme), and optional
   `actions` which renders right-aligned button cluster.
   ===================================================================== */

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  lead?: string;
  themeColor?: string;
  actions?: ReactNode;
  variant?: "default" | "compact";
  /** Extra classes for the outer wrapper — e.g. extra margin overrides */
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  themeColor,
  actions,
  variant = "default",
  className = "",
}: PageHeaderProps) {
  if (variant === "compact") {
    return (
      <header className={"flex flex-wrap items-center justify-between gap-3 " + className}>
        <div className="flex items-baseline gap-3 min-w-0">
          <div className="t-eyebrow flex items-center gap-2 shrink-0">
            {themeColor && <span className="theme-dot" style={{ background: themeColor }} />}
            <span className="truncate">{eyebrow}</span>
          </div>
          <span className="text-[var(--ink-4)] shrink-0" aria-hidden>·</span>
          <h1 className="text-[20px] font-semibold tracking-tight text-[var(--ink)] leading-none truncate">
            {title}
          </h1>
        </div>
        {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
      </header>
    );
  }

  return (
    <header className={"flex flex-wrap items-end justify-between gap-6 " + className}>
      <div className="max-w-[760px]">
        <div className="t-eyebrow flex items-center gap-2">
          {themeColor && <span className="theme-dot" style={{ background: themeColor }} />}
          <span>{eyebrow}</span>
        </div>
        <h1 className="t-display mt-3">{title}</h1>
        {lead && <p className="t-body-lg mt-4 max-w-[680px] !text-[var(--ink-2)]">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
