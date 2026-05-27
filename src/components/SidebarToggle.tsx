"use client";
import { useSyncExternalStore } from "react";

const LS_KEY = "sidebar-collapsed-v1";
const EVENT = "sidebar-collapse-change";

/* useSyncExternalStore is React 19's recommended way to subscribe to
   an external mutable source (here: localStorage). It avoids the
   setState-in-effect anti-pattern and gives us proper SSR safety. */
function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  // Cross-tab sync
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getClientSnapshot(): boolean {
  try {
    return window.localStorage.getItem(LS_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false; // default uncollapsed on SSR — matches initial paint
}

/** Hook used by both sidebars + layouts to share collapse state via localStorage. */
export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  function toggle() {
    try {
      const next = !collapsed;
      window.localStorage.setItem(LS_KEY, next ? "1" : "0");
      window.dispatchEvent(new Event(EVENT));
    } catch {}
  }

  return { collapsed, toggle, hydrated: true };
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
