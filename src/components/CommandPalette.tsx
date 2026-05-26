"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PARTNERS, CAMPAIGNS, EVENTS } from "@/lib/data";

interface CmdItem {
  id: string;
  title: string;
  subtitle?: string;
  hint?: string;          // shown right-aligned (Partner, Page, Campaign)
  icon: string;           // SVG path
  href: string;
  kbd?: string;
  keywords?: string[];    // extra search terms
}

const PAGES: CmdItem[] = [
  { id: "p-partner",         title: "Oversigt",       subtitle: "Partner dashboard",          hint: "Side",   href: "/partner",               icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { id: "p-kampagner",       title: "Kampagner",      subtitle: "Marketing-værktøjskasse",    hint: "Side",   href: "/partner/kampagner",     icon: "M4 5h16v4H4zM4 13h10v6H4zM16 13h4v6h-4z" },
  { id: "p-leads",           title: "Leads",          subtitle: "Carl Ras Partnerfinder",     hint: "Side",   href: "/partner/leads",         icon: "M3 8l9 6 9-6M3 8v10h18V8M3 8l9-5 9 5" },
  { id: "p-events",          title: "Events",         subtitle: "Faglige Fredage & møder",    hint: "Side",   href: "/partner/events",        icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
  { id: "p-cert",            title: "Certificering",  subtitle: "Mine certificeringer",       hint: "Side",   href: "/partner/certificering", icon: "M12 2l3 6 6 1-4 4 1 7-6-3-6 3 1-7-4-4 6-1z" },
  { id: "p-spec",            title: "Tal med Carl Ras", subtitle: "Specialist-chat",          hint: "Side",   href: "/partner/specialister",  icon: "M21 12a9 9 0 11-3-6.7L21 4v5h-5" },
  { id: "p-forum",           title: "Forum",          subtitle: "Peer-netværk",               hint: "Side",   href: "/partner/forum",         icon: "M21 11a8 8 0 11-3-6.2L21 3v6h-6M3 21l3-3" },
  { id: "p-nyheder",         title: "Nyheder",        subtitle: "Carl Ras blog",              hint: "Side",   href: "/partner/nyheder",       icon: "M4 5h16v14H4zM4 9h16M8 5v14" },

  { id: "a-overview",        title: "Admin · Oversigt", subtitle: "Drift & vækst",            hint: "Carl Ras", href: "/admin",               icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { id: "a-partnere",        title: "Admin · Partnere", subtitle: "Alle 47 partnere",         hint: "Carl Ras", href: "/admin/partnere",      icon: "M3 7a4 4 0 118 0M3 21h14M5 21v-4a4 4 0 014-4h0a4 4 0 014 4v4" },
  { id: "a-data",            title: "Admin · Data & rapport", subtitle: "Charts og rapporter", hint: "Carl Ras", href: "/admin/data",         icon: "M3 21v-7m6 7V10m6 11V6m6 15v-9" },
  { id: "a-kampagner",       title: "Admin · Kampagner", subtitle: "Publicér til partnere",   hint: "Carl Ras", href: "/admin/kampagner",     icon: "M4 5h16v4H4zM4 13h10v6H4zM16 13h4v6h-4z" },
  { id: "a-beskeder",        title: "Admin · Beskeder", subtitle: "Targeted messaging",       hint: "Carl Ras", href: "/admin/beskeder",      icon: "M3 5h18v12H7l-4 4z" },

  { id: "f-find",            title: "Find en partner", subtitle: "Customer-facing finder",    hint: "carl-ras.dk", href: "/find",             icon: "M21 21l-4.3-4.3M11 18a7 7 0 110-14 7 7 0 010 14z" },
];

const PARTNER_ICON = "M3 7a4 4 0 118 0M3 21h14M5 21v-4a4 4 0 014-4h0a4 4 0 014 4v4";
const CAMPAIGN_ICON = "M4 5h16v4H4zM4 13h10v6H4zM16 13h4v6h-4z";
const EVENT_ICON = "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reset state when reopening
  useEffect(() => {
    if (open) {
      setQ("");
      setActiveIdx(0);
      // focus input next tick
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const items: CmdItem[] = useMemo(() => {
    const partnerItems: CmdItem[] = PARTNERS.map((p) => ({
      id: "partner-" + p.id,
      title: p.firma,
      subtitle: `${p.faggruppe} · ${p.by} · ${p.tier}-partner`,
      hint: "Partner",
      icon: PARTNER_ICON,
      href: `/admin/partnere/${p.id}`,
      keywords: [p.ejer, p.region, p.postnr],
    }));
    const campaignItems: CmdItem[] = CAMPAIGNS.map((c) => ({
      id: "camp-" + c.id,
      title: c.titel,
      subtitle: c.hovedbudskab,
      hint: "Kampagne",
      icon: CAMPAIGN_ICON,
      href: "/partner/kampagner",
    }));
    const eventItems: CmdItem[] = EVENTS.map((e) => ({
      id: "event-" + e.id,
      title: e.titel,
      subtitle: `${e.lokation.split(",")[0]} · ${new Date(e.dato).toLocaleDateString("da-DK", { day: "numeric", month: "short" })}`,
      hint: "Event",
      icon: EVENT_ICON,
      href: "/partner/events",
    }));
    return [...PAGES, ...partnerItems, ...campaignItems, ...eventItems];
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) {
      // Show pages + top partners when empty
      return [...PAGES.slice(0, 8), ...items.filter((i) => i.id.startsWith("partner-")).slice(0, 4)];
    }
    const t = q.toLowerCase();
    return items
      .filter((i) => {
        const hay = (i.title + " " + (i.subtitle ?? "") + " " + (i.keywords ?? []).join(" ")).toLowerCase();
        return hay.includes(t);
      })
      .slice(0, 12);
  }, [q, items]);

  useEffect(() => { setActiveIdx(0); }, [q]);

  function go(item: CmdItem) {
    router.push(item.href);
    setOpen(false);
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIdx];
      if (item) go(item);
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm grid place-items-start pt-[12vh] px-4 animate-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[640px] bg-white rounded-[var(--r-xl)] shadow-[0_24px_60px_rgba(0,0,0,0.22)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--line-2)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--ink-3)] shrink-0">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Søg partnere, sider, kampagner, events…"
                className="flex-1 text-[15px] outline-none bg-transparent text-[var(--ink)] placeholder:text-[var(--ink-4)]"
              />
              <kbd className="text-[11px] font-semibold text-[var(--ink-3)] bg-[var(--canvas-2)] border border-[var(--line-2)] rounded px-1.5 py-0.5">esc</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[480px] overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-5 py-10 text-center text-[14px] text-[var(--ink-3)]">
                  Intet match for &quot;{q}&quot;
                </div>
              ) : filtered.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => go(item)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors " +
                    (idx === activeIdx ? "bg-[var(--cr-blue-tint)]" : "")
                  }
                >
                  <div className={"size-9 rounded-lg grid place-items-center shrink-0 transition-colors " + (idx === activeIdx ? "bg-white" : "bg-[var(--canvas-2)]")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--ink-2)]">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-[var(--ink)] truncate">{item.title}</div>
                    {item.subtitle && <div className="text-[12px] text-[var(--ink-3)] truncate">{item.subtitle}</div>}
                  </div>
                  {item.hint && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)] shrink-0">
                      {item.hint}
                    </span>
                  )}
                  {idx === activeIdx && (
                    <kbd className="text-[10px] font-semibold text-[var(--ink-3)] bg-white border border-[var(--line-2)] rounded px-1.5 py-0.5 shrink-0">↵</kbd>
                  )}
                </button>
              ))}
            </div>

            {/* Footer with shortcuts */}
            <div className="px-5 py-2.5 border-t border-[var(--line-2)] bg-[var(--canvas-2)] flex items-center gap-4 text-[11px] text-[var(--ink-3)]">
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white border border-[var(--line-2)] rounded px-1 font-mono">↑</kbd>
                <kbd className="bg-white border border-[var(--line-2)] rounded px-1 font-mono">↓</kbd>
                naviger
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white border border-[var(--line-2)] rounded px-1 font-mono">↵</kbd>
                åbn
              </span>
              <span className="ml-auto">⌘K åbner overalt</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Tiny "press ⌘K" hint button — put in top bar */
export function CommandPaletteTrigger() {
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && /Mac/.test(navigator.platform));
  }, []);
  function open() {
    // Synthesize cmd+k
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
      <kbd className="text-[10px] bg-white/15 rounded px-1 py-0.5 font-mono">{isMac ? "⌘K" : "Ctrl+K"}</kbd>
    </button>
  );
}
