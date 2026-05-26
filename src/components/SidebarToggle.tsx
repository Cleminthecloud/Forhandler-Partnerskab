"use client";
import { useEffect, useState } from "react";

const LS_KEY = "sidebar-collapsed-v1";

/** Hook used by both sidebars + (eventually) layouts to share collapse state via localStorage. */
export function useSidebarCollapsed() {
  // Start uncollapsed on SSR to match initial server render, then read localStorage.
  const [collapsed, setCollapsedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(LS_KEY);
      if (v === "1") setCollapsedState(true);
    } catch {}
    setHydrated(true);
  }, []);

  function toggle() {
    setCollapsedState((prev) => {
      const next = !prev;
      try { localStorage.setItem(LS_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }

  return { collapsed, toggle, hydrated };
}

export function CollapseToggle({ collapsed, onClick }: { collapsed: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="size-7 rounded-md grid place-items-center text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--canvas-2)] transition-colors shrink-0"
      aria-label={collapsed ? "Udvid menu" : "Skjul menu"}
      title={collapsed ? "Udvid menu" : "Skjul menu"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {collapsed ? (
          <>
            <path d="M13 18l6-6-6-6" />
            <path d="M5 18l6-6-6-6" opacity="0.55" />
          </>
        ) : (
          <>
            <path d="M11 18l-6-6 6-6" />
            <path d="M19 18l-6-6 6-6" opacity="0.55" />
          </>
        )}
      </svg>
    </button>
  );
}
