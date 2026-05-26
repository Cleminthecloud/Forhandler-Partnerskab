"use client";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PARTNERS, CAMPAIGNS, EVENTS } from "@/lib/data";

/* =====================================================================
   Cmd+K command palette.
   Centered modal, results grouped by category with per-category icon
   chip, recently-used items surface when input is empty, keyboard nav
   with hint badges.
   ===================================================================== */

type Category = "Side" | "Partner" | "Kampagne" | "Event" | "Carl Ras HQ" | "Senest besøgt";

interface CmdItem {
  id: string;
  title: string;
  subtitle?: string;
  category: Category;
  icon: string;           // SVG path
  href: string;
  keywords?: string[];    // extra search terms
}

const PAGES: CmdItem[] = [
  { id: "p-partner",         title: "Oversigt",            subtitle: "Partner dashboard",          category: "Side",        href: "/partner",               icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { id: "p-kampagner",       title: "Kampagner",           subtitle: "Marketing-værktøjskasse",    category: "Side",        href: "/partner/kampagner",     icon: "M4 5h16v4H4zM4 13h10v6H4zM16 13h4v6h-4z" },
  { id: "p-leads",           title: "Leads",               subtitle: "Carl Ras Partnerfinder",     category: "Side",        href: "/partner/leads",         icon: "M3 8l9 6 9-6M3 8v10h18V8M3 8l9-5 9 5" },
  { id: "p-events",          title: "Events",              subtitle: "Faglige Fredage & møder",    category: "Side",        href: "/partner/events",        icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
  { id: "p-cert",            title: "Certificering",       subtitle: "Mine certificeringer",       category: "Side",        href: "/partner/certificering", icon: "M12 2l3 6 6 1-4 4 1 7-6-3-6 3 1-7-4-4 6-1z" },
  { id: "p-spec",            title: "Tal med Carl Ras",    subtitle: "Specialist-chat",            category: "Side",        href: "/partner/specialister",  icon: "M21 12a9 9 0 11-3-6.7L21 4v5h-5" },
  { id: "p-forum",           title: "Forum",               subtitle: "Peer-netværk",               category: "Side",        href: "/partner/forum",         icon: "M21 11a8 8 0 11-3-6.2L21 3v6h-6M3 21l3-3" },
  { id: "p-nyheder",         title: "Nyheder",             subtitle: "Carl Ras blog",              category: "Side",        href: "/partner/nyheder",       icon: "M4 5h16v14H4zM4 9h16M8 5v14" },

  { id: "a-overview",        title: "Oversigt",            subtitle: "Drift & vækst",              category: "Carl Ras HQ", href: "/admin",                 icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { id: "a-partnere",        title: "Partnere",            subtitle: "Alle 47 partnere",           category: "Carl Ras HQ", href: "/admin/partnere",        icon: "M3 7a4 4 0 118 0M3 21h14M5 21v-4a4 4 0 014-4h0a4 4 0 014 4v4" },
  { id: "a-data",            title: "Data & rapport",      subtitle: "Charts og rapporter",        category: "Carl Ras HQ", href: "/admin/data",            icon: "M3 21v-7m6 7V10m6 11V6m6 15v-9" },
  { id: "a-kampagner",       title: "Kampagner",           subtitle: "Publicér til partnere",      category: "Carl Ras HQ", href: "/admin/kampagner",       icon: "M4 5h16v4H4zM4 13h10v6H4zM16 13h4v6h-4z" },
  { id: "a-beskeder",        title: "Beskeder",            subtitle: "Targeted messaging",         category: "Carl Ras HQ", href: "/admin/beskeder",        icon: "M3 5h18v12H7l-4 4z" },

  { id: "f-find",            title: "Find en partner",     subtitle: "Customer-facing finder",     category: "Side",        href: "/find",                  icon: "M21 21l-4.3-4.3M11 18a7 7 0 110-14 7 7 0 010 14z" },
];

const ICONS = {
  partner:  "M3 7a4 4 0 118 0M3 21h14M5 21v-4a4 4 0 014-4h0a4 4 0 014 4v4",
  campaign: "M4 5h16v4H4zM4 13h10v6H4zM16 13h4v6h-4z",
  event:    "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
} as const;

/* Per-category visual chip — color tint + iconography */
const CATEGORY_STYLE: Record<Category, { bg: string; ink: string }> = {
  "Side":            { bg: "var(--accent-tint)",      ink: "var(--accent-press)" },
  "Carl Ras HQ":     { bg: "#FCEFCA",                  ink: "#6B4A00" },
  "Partner":         { bg: "#E1EFD2",                  ink: "#2D4A0F" },
  "Kampagne":        { bg: "#FFF1DC",                  ink: "#5C3500" },
  "Event":           { bg: "#ECEEF1",                  ink: "#4A4F55" },
  "Senest besøgt":   { bg: "var(--canvas-2)",          ink: "var(--ink-3)" },
};

const RECENTS_KEY = "carl-ras-cmdk-recents-v1";
const MAX_RECENTS = 5;

function loadRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENTS) : [];
  } catch { return []; }
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [recents, setRecents] = useState<string[]>(loadRecents);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /* Build the full item index (pages + dynamic data) */
  const items: CmdItem[] = useMemo(() => {
    const partnerItems: CmdItem[] = PARTNERS.map((p) => ({
      id: "partner-" + p.id,
      title: p.firma,
      subtitle: `${p.faggruppe} · ${p.by} · ${p.tier}-partner`,
      category: "Partner",
      icon: ICONS.partner,
      href: `/admin/partnere/${p.id}`,
      keywords: [p.ejer, p.region, p.postnr],
    }));
    const campaignItems: CmdItem[] = CAMPAIGNS.map((c) => ({
      id: "camp-" + c.id,
      title: c.titel,
      subtitle: c.hovedbudskab,
      category: "Kampagne",
      icon: ICONS.campaign,
      href: "/partner/kampagner",
    }));
    const eventItems: CmdItem[] = EVENTS.map((e) => ({
      id: "event-" + e.id,
      title: e.titel,
      subtitle: `${e.lokation.split(",")[0]} · ${new Date(e.dato).toLocaleDateString("da-DK", { day: "numeric", month: "short" })}`,
      category: "Event",
      icon: ICONS.event,
      href: "/partner/events",
    }));
    return [...PAGES, ...partnerItems, ...campaignItems, ...eventItems];
  }, []);

  /* Reset query + focus when palette opens */
  function handleOpen() {
    setOpen(true);
    setQ("");
    setActiveIdx(0);
    // focus next tick — input is conditionally rendered
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleClose() {
    setOpen(false);
  }

  /* Global Cmd+K / Ctrl+K shortcut */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // Use functional state to avoid stale capture
        setOpen((prev) => {
          if (!prev) {
            setQ("");
            setActiveIdx(0);
            setTimeout(() => inputRef.current?.focus(), 0);
            return true;
          }
          return false;
        });
      } else if (e.key === "Escape") {
        setOpen((prev) => prev ? false : prev);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Filter + group results */
  const groups: { category: Category; items: CmdItem[] }[] = useMemo(() => {
    // No query → show Senest besøgt + Sider + Carl Ras HQ as the default landing
    if (!q.trim()) {
      const recentItems = recents
        .map((id) => items.find((i) => i.id === id))
        .filter(Boolean) as CmdItem[];

      const groupOrder: Category[] = ["Senest besøgt", "Side", "Carl Ras HQ", "Partner", "Kampagne", "Event"];
      const sections: { category: Category; items: CmdItem[] }[] = [];
      if (recentItems.length > 0) {
        sections.push({
          category: "Senest besøgt",
          items: recentItems.map((i) => ({ ...i, category: "Senest besøgt" })),
        });
      }
      sections.push({ category: "Side", items: items.filter((i) => i.category === "Side") });
      sections.push({ category: "Carl Ras HQ", items: items.filter((i) => i.category === "Carl Ras HQ") });
      sections.push({ category: "Partner", items: items.filter((i) => i.category === "Partner").slice(0, 4) });
      return sections.filter((s) => s.items.length > 0).sort((a, b) =>
        groupOrder.indexOf(a.category) - groupOrder.indexOf(b.category)
      );
    }

    // Query — search across everything, then group
    const t = q.toLowerCase();
    const matches = items.filter((i) => {
      const hay = (i.title + " " + (i.subtitle ?? "") + " " + (i.keywords ?? []).join(" ")).toLowerCase();
      return hay.includes(t);
    }).slice(0, 24);

    const grouped = new Map<Category, CmdItem[]>();
    matches.forEach((m) => {
      const list = grouped.get(m.category) ?? [];
      list.push(m);
      grouped.set(m.category, list);
    });
    const order: Category[] = ["Side", "Carl Ras HQ", "Partner", "Kampagne", "Event"];
    return order
      .filter((c) => grouped.has(c))
      .map((c) => ({ category: c, items: grouped.get(c)! }));
  }, [q, items, recents]);

  /* Flatten for keyboard nav */
  const flatItems = useMemo(
    () => groups.flatMap((g) => g.items),
    [groups]
  );

  /* Persist + open */
  const go = useCallback((item: CmdItem) => {
    // Recents update
    setRecents((prev) => {
      const next = [item.id, ...prev.filter((id) => id !== item.id)].slice(0, MAX_RECENTS);
      try { window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    router.push(item.href);
    setOpen(false);
  }, [router]);

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatItems[activeIdx];
      if (item) go(item);
    }
  }

  function onQueryChange(value: string) {
    setQ(value);
    setActiveIdx(0); // reset highlight on each keystroke — no effect needed
  }

  // Reference handleOpen so React/lint treats it as used (debug API for external triggers)
  void handleOpen;

  /* Compute global activeIdx → which item is highlighted in each group */
  let runningIdx = 0;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm grid place-items-center p-4 animate-in"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-[640px] bg-white rounded-[var(--r-xl)] shadow-[0_28px_70px_rgba(0,0,0,0.28)] overflow-hidden flex flex-col max-h-[78vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Søg overalt"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--line-2)] shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--ink-3)] shrink-0">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Søg partnere, sider, kampagner, events…"
                className="flex-1 text-[15px] outline-none bg-transparent text-[var(--ink)] placeholder:text-[var(--ink-4)]"
              />
              <kbd className="text-[11px] font-semibold text-[var(--ink-3)] bg-[var(--canvas-2)] border border-[var(--line-2)] rounded px-1.5 py-0.5">esc</kbd>
            </div>

            {/* Results — grouped */}
            <div className="flex-1 overflow-y-auto py-1 min-h-0">
              {flatItems.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <div className="text-[14px] text-[var(--ink-2)]">Intet match for <span className="font-semibold text-[var(--ink)]">&quot;{q}&quot;</span></div>
                  <div className="text-[12px] text-[var(--ink-3)] mt-1.5">Prøv et firmanavn, et postnummer, eller en tema-titel.</div>
                </div>
              ) : groups.map((group) => (
                <section key={group.category} className="pt-1.5 pb-1">
                  <div className="px-4 pb-1 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-3)]">{group.category}</span>
                    <span className="text-[10px] text-[var(--ink-4)] tabular-nums">·  {group.items.length}</span>
                  </div>
                  {group.items.map((item) => {
                    const itemIdx = runningIdx++;
                    const isActive = itemIdx === activeIdx;
                    const style = CATEGORY_STYLE[item.category];
                    return (
                      <button
                        key={item.id + "-" + group.category}
                        onClick={() => go(item)}
                        onMouseEnter={() => setActiveIdx(itemIdx)}
                        className={
                          "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors " +
                          (isActive ? "bg-[var(--accent-tint)]" : "hover:bg-[var(--canvas-2)]")
                        }
                      >
                        <div
                          className="size-9 rounded-lg grid place-items-center shrink-0"
                          style={{ background: style.bg }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={style.ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d={item.icon} />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-medium text-[var(--ink)] truncate">{item.title}</div>
                          {item.subtitle && <div className="text-[12px] text-[var(--ink-3)] truncate">{item.subtitle}</div>}
                        </div>
                        {isActive && (
                          <kbd className="text-[10px] font-semibold text-[var(--ink-3)] bg-white border border-[var(--line-2)] rounded px-1.5 py-0.5 shrink-0">↵</kbd>
                        )}
                      </button>
                    );
                  })}
                </section>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-[var(--line-2)] bg-[var(--canvas-2)] flex items-center gap-4 text-[11px] text-[var(--ink-3)] shrink-0">
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white border border-[var(--line-2)] rounded px-1 font-mono">↑</kbd>
                <kbd className="bg-white border border-[var(--line-2)] rounded px-1 font-mono">↓</kbd>
                naviger
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white border border-[var(--line-2)] rounded px-1 font-mono">↵</kbd>
                åbn
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white border border-[var(--line-2)] rounded px-1 font-mono">esc</kbd>
                luk
              </span>
              <span className="ml-auto">⌘K åbner overalt</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Tiny "press ⌘K" hint button — sits in the top app bar */
export function CommandPaletteTrigger() {
  function open() {
    // Synthesize cmd+k to reuse the global listener
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }
  return (
    <button
      onClick={open}
      className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.14] transition-colors text-[12px] text-white/75"
      title="Søg (⌘K)"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <span>Søg</span>
      <kbd className="text-[10px] bg-white/15 rounded px-1 py-0.5 font-mono">⌘K</kbd>
    </button>
  );
}
