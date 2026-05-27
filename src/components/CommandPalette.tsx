"use client";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PARTNERS, CAMPAIGNS, EVENTS } from "@/lib/data";

/* =====================================================================
   Cmd+K command palette.

   PLATFORM-SCOPED — the three areas of this demo (Partner, Carl Ras HQ
   admin, Find-en-partner public finder) don't share users in real life,
   so the palette only ever shows nav for the area the user is currently
   in. Pathname drives the scope. Recents are stored per-platform.

   Centered modal, results grouped by category with per-category icon
   chip, recently-used items surface when input is empty, keyboard nav
   with hint badges.
   ===================================================================== */

type Platform = "partner" | "admin" | "find";
type Category = "Side" | "Partner" | "Kampagne" | "Event" | "Carl Ras HQ" | "Senest besøgt";

function detectPlatform(pathname: string | null): Platform {
  if (!pathname) return "partner";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/find"))  return "find";
  return "partner";
}

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
  { id: "p-kampagner",       title: "Kampagner",           subtitle: "Marketing-værktøjskasse",    category: "Side",        href: "/partner/kampagner",     icon: "M3 10v4l13 5V5L3 10z M18 9a4 4 0 010 6" },
  { id: "p-leads",           title: "Leads",               subtitle: "Carl Ras Partnerfinder",     category: "Side",        href: "/partner/leads",         icon: "M3 8l9 6 9-6M3 8v10h18V8M3 8l9-5 9 5" },
  { id: "p-events",          title: "Events",              subtitle: "Faglige Fredage & møder",    category: "Side",        href: "/partner/events",        icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
  { id: "p-cert",            title: "Certificering",       subtitle: "Mine certificeringer",       category: "Side",        href: "/partner/certificering", icon: "M12 3a6 6 0 110 12 6 6 0 010-12z M8 14l-2 7 6-3 6 3-2-7" },
  { id: "p-spec",            title: "Tal med Carl Ras",    subtitle: "Specialist-chat",            category: "Side",        href: "/partner/specialister",  icon: "M21 11.5c0 4.7-4 8.5-9 8.5-1.5 0-2.9-.3-4.1-.9L3 20l1.5-4.4C3.5 14 3 12.8 3 11.5 3 6.8 7 3 12 3s9 3.8 9 8.5z" },
  { id: "p-forum",           title: "Forum",               subtitle: "Peer-netværk",               category: "Side",        href: "/partner/forum",         icon: "M16 11a3 3 0 100-6 3 3 0 000 6z M8 11a3 3 0 100-6 3 3 0 000 6z M3 19c0-3 2-5 5-5s5 2 5 5 M11 19c0-3 2-5 5-5s5 2 5 5" },
  { id: "p-nyheder",         title: "Nyheder",             subtitle: "Carl Ras blog",              category: "Side",        href: "/partner/nyheder",       icon: "M4 5h13v14H4z M17 9h3v10H4 M7 9h7 M7 13h7 M7 17h4" },

  { id: "a-overview",        title: "Oversigt",            subtitle: "Drift & vækst",              category: "Carl Ras HQ", href: "/admin",                 icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { id: "a-partnere",        title: "Partnere",            subtitle: "Alle 47 partnere",           category: "Carl Ras HQ", href: "/admin/partnere",        icon: "M3 7a4 4 0 118 0M3 21h14M5 21v-4a4 4 0 014-4h0a4 4 0 014 4v4" },
  { id: "a-data",            title: "Data & rapport",      subtitle: "Charts og rapporter",        category: "Carl Ras HQ", href: "/admin/data",            icon: "M3 21v-7m6 7V10m6 11V6m6 15v-9" },
  { id: "a-kampagner",       title: "Kampagner",           subtitle: "Publicér til partnere",      category: "Carl Ras HQ", href: "/admin/kampagner",       icon: "M3 10v4l13 5V5L3 10z M18 9a4 4 0 010 6" },
  { id: "a-beskeder",        title: "Beskeder",            subtitle: "Targeted messaging",         category: "Carl Ras HQ", href: "/admin/beskeder",        icon: "M21 11.5c0 4.7-4 8.5-9 8.5-1.5 0-2.9-.3-4.1-.9L3 20l1.5-4.4C3.5 14 3 12.8 3 11.5 3 6.8 7 3 12 3s9 3.8 9 8.5z" },

  { id: "f-find",            title: "Find en partner",     subtitle: "Customer-facing finder",     category: "Side",        href: "/find",                  icon: "M21 21l-4.3-4.3M11 18a7 7 0 110-14 7 7 0 010 14z" },
];

const ICONS = {
  partner:  "M3 7a4 4 0 118 0M3 21h14M5 21v-4a4 4 0 014-4h0a4 4 0 014 4v4",
  campaign: "M3 10v4l13 5V5L3 10z M18 9a4 4 0 010 6",   // megaphone
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

const MAX_RECENTS = 5;
const recentsKey = (p: Platform) => `carl-ras-cmdk-recents-v2-${p}`;

function loadRecents(platform: Platform): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(recentsKey(platform));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENTS) : [];
  } catch { return []; }
}

/* Which page-categories belong to which platform */
const PLATFORM_PAGE_FILTER: Record<Platform, (item: CmdItem) => boolean> = {
  // Partner area: partner pages only — no admin, no /find
  partner: (i) => i.href.startsWith("/partner"),
  // Admin: admin pages only
  admin:   (i) => i.href.startsWith("/admin"),
  // Find: /find pages — minimal nav, this surface is essentially one page
  find:    (i) => i.href.startsWith("/find"),
};

/* Which entity categories make sense in each platform */
const PLATFORM_ENTITIES: Record<Platform, Category[]> = {
  partner: ["Kampagne", "Event"],   // partners browse their own campaigns + events
  admin:   ["Partner", "Event"],    // HQ browses partners + events on calendar
  find:    [],                       // customers just search partners directly on /find — no jump-list needed
};

const PLATFORM_LABEL: Record<Platform, string> = {
  partner: "Partner-platform",
  admin:   "Carl Ras HQ",
  find:    "Find en partner",
};

export function CommandPalette() {
  const pathname = usePathname();
  const platform = detectPlatform(pathname);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  // Recents are derived from localStorage on each render. We bump a version
  // counter inside `go()` to force re-derivation when we write — no effect needed.
  const [recentsVersion, setRecentsVersion] = useState(0);
  const recents = useMemo(() => {
    void recentsVersion; // intentional dep — cache-buster after writes
    return loadRecents(platform);
  }, [platform, recentsVersion]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /* Build the full item index, but only what makes sense for current platform */
  const items: CmdItem[] = useMemo(() => {
    // Page items — filtered by which platform's pathname they live under
    const scopedPages = PAGES.filter(PLATFORM_PAGE_FILTER[platform]);

    // Decide which entity sets to include for this platform
    const includeEntities = PLATFORM_ENTITIES[platform];

    const partnerItems: CmdItem[] = includeEntities.includes("Partner")
      ? PARTNERS.map((p) => ({
          id: "partner-" + p.id,
          title: p.firma,
          subtitle: `${p.faggruppe} · ${p.by} · ${p.tier}-partner`,
          category: "Partner",
          icon: ICONS.partner,
          href: `/admin/partnere/${p.id}`,
          keywords: [p.ejer, p.region, p.postnr],
        }))
      : [];

    const campaignItems: CmdItem[] = includeEntities.includes("Kampagne")
      ? CAMPAIGNS.map((c) => ({
          id: "camp-" + c.id,
          title: c.titel,
          subtitle: c.hovedbudskab,
          category: "Kampagne",
          icon: ICONS.campaign,
          href: "/partner/kampagner",
        }))
      : [];

    const eventItems: CmdItem[] = includeEntities.includes("Event")
      ? EVENTS.map((e) => ({
          id: "event-" + e.id,
          title: e.titel,
          subtitle: `${e.lokation.split(",")[0]} · ${new Date(e.dato).toLocaleDateString("da-DK", { day: "numeric", month: "short" })}`,
          category: "Event",
          icon: ICONS.event,
          // Events live under /partner/events for partners; admin has their own /admin/kalender
          href: platform === "admin" ? "/admin/kalender" : "/partner/events",
        }))
      : [];

    return [...scopedPages, ...partnerItems, ...campaignItems, ...eventItems];
  }, [platform]);

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

  /* Filter + group results. Order changes per platform — admin foregrounds Partner,
     partner foregrounds Sider, find barely needs grouping. */
  const groups: { category: Category; items: CmdItem[] }[] = useMemo(() => {
    const order: Category[] = platform === "admin"
      ? ["Senest besøgt", "Carl Ras HQ", "Partner", "Event"]
      : platform === "partner"
        ? ["Senest besøgt", "Side", "Kampagne", "Event"]
        : ["Senest besøgt", "Side"];

    // No query → show recents + top-of-each-section
    if (!q.trim()) {
      const recentItems = recents
        .map((id) => items.find((i) => i.id === id))
        .filter(Boolean) as CmdItem[];

      const sections: { category: Category; items: CmdItem[] }[] = [];
      if (recentItems.length > 0) {
        sections.push({
          category: "Senest besøgt",
          items: recentItems.map((i) => ({ ...i, category: "Senest besøgt" })),
        });
      }
      // Always show full Side or Carl Ras HQ list — they're small
      const pageCat: Category = platform === "admin" ? "Carl Ras HQ" : "Side";
      sections.push({ category: pageCat, items: items.filter((i) => i.category === pageCat) });

      // Show a preview of entity sections relevant to this platform (top 4 each)
      PLATFORM_ENTITIES[platform].forEach((cat) => {
        const list = items.filter((i) => i.category === cat).slice(0, 4);
        if (list.length > 0) sections.push({ category: cat, items: list });
      });

      return sections
        .filter((s) => s.items.length > 0)
        .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
    }

    // Query — search across the scoped items only, then group
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
    return order
      .filter((c) => grouped.has(c))
      .map((c) => ({ category: c, items: grouped.get(c)! }));
  }, [q, items, recents, platform]);

  /* Flatten for keyboard nav */
  const flatItems = useMemo(
    () => groups.flatMap((g) => g.items),
    [groups]
  );

  /* Persist + open. Recents are stored per-platform so jumping between
     partner / admin / find never bleeds history across surfaces. */
  const go = useCallback((item: CmdItem) => {
    try {
      const prev = loadRecents(platform);
      const next = [item.id, ...prev.filter((id) => id !== item.id)].slice(0, MAX_RECENTS);
      window.localStorage.setItem(recentsKey(platform), JSON.stringify(next));
    } catch {}
    setRecentsVersion((v) => v + 1); // force re-derivation of `recents`
    router.push(item.href);
    setOpen(false);
  }, [router, platform]);

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
            {/* Input — placeholder & scope chip reflect current platform */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--line-2)] shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--ink-3)] shrink-0">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={onInputKey}
                placeholder={
                  platform === "admin"
                    ? "Søg partnere, admin-sider, events…"
                    : platform === "partner"
                      ? "Søg sider, kampagner, events…"
                      : "Søg på Find en partner…"
                }
                className="flex-1 text-[15px] outline-none bg-transparent text-[var(--ink)] placeholder:text-[var(--ink-4)]"
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--ink-3)] bg-[var(--canvas-2)] border border-[var(--line-2)] rounded px-2 py-0.5">
                {PLATFORM_LABEL[platform]}
              </span>
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
