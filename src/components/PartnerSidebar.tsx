"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { CURRENT_PARTNER } from "@/lib/data";
import { useApp } from "./AppState";
import { useSidebarCollapsed, CollapseToggle } from "./SidebarToggle";

/* =====================================================================
   Partner sidebar — workspace-style three-block layout:
   1. Business profile (firma, tier, points progress)
   2. Nav with "PARTNER MENU" section label, notification badges, active state
   3. User account cell (ejer name + email) that opens a profile/settings menu
   Collapsed state shows icons + initials only with right-side tooltips.
   ===================================================================== */

// Icons reviewed for semantic match: kampagner = megaphone, certificering = medal
// w/ ribbon, specialister = speech bubble, forum = people cluster, nyheder = newspaper.
const NAV: { href: string; label: string; icon: string }[] = [
  { href: "/partner",                label: "Oversigt",          icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/partner/kampagner",      label: "Kampagner",         icon: "M3 10v4l13 5V5L3 10z M18 9a4 4 0 010 6" },
  { href: "/partner/leads",          label: "Leads",             icon: "M3 8l9 6 9-6M3 8v10h18V8M3 8l9-5 9 5" },
  { href: "/partner/projekter",      label: "Projekter",         icon: "M9 4h6l1 3h4v13H4V7h4z M9 11h6 M9 15h4" },
  { href: "/partner/events",         label: "Events",            icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
  { href: "/partner/certificering",  label: "Certificering",     icon: "M12 3a6 6 0 110 12 6 6 0 010-12z M8 14l-2 7 6-3 6 3-2-7" },
  { href: "/partner/specialister",   label: "Tal med Carl Ras",  icon: "M21 11.5c0 4.7-4 8.5-9 8.5-1.5 0-2.9-.3-4.1-.9L3 20l1.5-4.4C3.5 14 3 12.8 3 11.5 3 6.8 7 3 12 3s9 3.8 9 8.5z" },
  { href: "/partner/forum",          label: "Forum",             icon: "M16 11a3 3 0 100-6 3 3 0 000 6z M8 11a3 3 0 100-6 3 3 0 000 6z M3 19c0-3 2-5 5-5s5 2 5 5 M11 19c0-3 2-5 5-5s5 2 5 5" },
  { href: "/partner/nyheder",        label: "Nyheder",           icon: "M4 5h13v14H4z M17 9h3v10H4 M7 9h7 M7 13h7 M7 17h4" },
];

export function PartnerSidebar() {
  const pathname = usePathname();
  const { leads, pushToast } = useApp();
  const { collapsed, toggle } = useSidebarCollapsed();
  const newLeads = leads.filter((l) => l.partnerId === CURRENT_PARTNER.id && l.status === "Ny").length;
  const pct = Math.round((CURRENT_PARTNER.points / CURRENT_PARTNER.pointsTilNæste) * 100);

  return (
    <aside
      className={
        "hidden lg:flex flex-col shrink-0 border-r border-[var(--line)] bg-[var(--canvas)] " +
        "sticky top-[48px] h-[calc(100vh-48px)] overflow-y-auto scrollbar-hidden " +
        "transition-[width] duration-300 ease-out " +
        (collapsed ? "w-[64px]" : "w-[264px]")
      }
    >
      {/* ─── BUSINESS HEADER ─── */}
      <div className={"border-b border-[var(--line-2)] " + (collapsed ? "p-3" : "px-5 pt-5 pb-4")}>
        <div className={"flex items-center gap-3 " + (collapsed ? "justify-center" : "")}>
          <div
            className="size-11 rounded-xl text-white font-semibold grid place-items-center shrink-0 text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
            style={{ background: CURRENT_PARTNER.logoBg }}
            title={collapsed ? CURRENT_PARTNER.firma : undefined}
            data-tt={collapsed ? CURRENT_PARTNER.firma : undefined}
            data-tt-pos={collapsed ? "right" : undefined}
          >
            {CURRENT_PARTNER.initialer}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-[var(--ink)] truncate leading-tight">
                {CURRENT_PARTNER.firma}
              </div>
              <div className="text-[11.5px] text-[var(--ink-3)] truncate mt-0.5">
                {CURRENT_PARTNER.by} · {CURRENT_PARTNER.region}
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <>
            <div className="mt-3.5 flex items-center gap-1.5">
              <TierBadge tier={CURRENT_PARTNER.tier} />
              <span className="text-[12.5px] font-semibold text-[var(--ink)]">{CURRENT_PARTNER.tier}-partner</span>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline justify-between text-[11px] mb-1.5">
                <span className="text-[var(--ink-2)] font-medium tabular-nums">{CURRENT_PARTNER.points.toLocaleString("da-DK")} <span className="text-[var(--ink-3)] font-normal">point</span></span>
                <span className="text-[var(--ink-3)] tabular-nums">{Math.max(0, CURRENT_PARTNER.pointsTilNæste - CURRENT_PARTNER.points)} til Guld</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--canvas-2)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: pct + "%", background: "linear-gradient(90deg, var(--accent), var(--accent-press))" }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── NAV ─── */}
      <nav className={"flex-1 py-4 " + (collapsed ? "px-2" : "px-3")}>
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-3)]">
            Partner menu
          </div>
        )}
        {NAV.map((item) => {
          const active = item.href === "/partner" ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              {...(collapsed ? { "data-tt": item.label, "data-tt-pos": "right" } : {})}
              className={
                "flex items-center gap-3 rounded-[10px] text-[13.5px] font-medium transition-colors mb-0.5 relative " +
                (collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2") +
                " " +
                (active
                  ? "bg-[var(--accent-tint)] text-[var(--accent-press)]"
                  : "text-[var(--ink-2)] hover:bg-[var(--canvas-2)] hover:text-[var(--ink)]")
              }
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={"shrink-0 " + (active ? "opacity-100" : "opacity-80")}
              >
                <path d={item.icon} />
              </svg>
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {item.href === "/partner/leads" && newLeads > 0 && (
                <span
                  className={
                    "text-[10px] font-semibold rounded-full text-white shrink-0 " +
                    (collapsed
                      ? "absolute top-1 right-1 size-4 grid place-items-center text-[8px]"
                      : "min-w-[20px] h-[20px] px-1.5 grid place-items-center")
                  }
                  style={{ background: "var(--accent)" }}
                >
                  {newLeads}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ─── USER ACCOUNT (with popover menu) ─── */}
      <UserCell collapsed={collapsed} pushToast={pushToast} />

      {/* ─── Footer: collapse toggle + label ─── */}
      <div className={"border-t border-[var(--line-2)] " + (collapsed ? "p-2 flex justify-center" : "px-3 py-2.5 flex items-center justify-between gap-2")}>
        {!collapsed && (
          <span className="text-[10.5px] text-[var(--ink-3)] truncate">
            Partner siden {CURRENT_PARTNER.medlemSiden}
          </span>
        )}
        <CollapseToggle collapsed={collapsed} onClick={toggle} />
      </div>
    </aside>
  );
}

/* =====================================================================
   User account cell + popover menu
   ===================================================================== */

function UserCell({ collapsed, pushToast }: { collapsed: boolean; pushToast: (text: string, kind?: "info" | "success") => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openCmdK() {
    setOpen(false);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }

  const initials = CURRENT_PARTNER.ejer.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative border-t border-[var(--line-2)]">
      <button
        onClick={() => setOpen((v) => !v)}
        {...(collapsed ? { "data-tt": CURRENT_PARTNER.ejer, "data-tt-pos": "right" } : {})}
        className={
          "w-full flex items-center gap-3 hover:bg-[var(--canvas-2)] transition-colors text-left " +
          (collapsed ? "justify-center p-3" : "px-3 py-2.5")
        }
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div
          className="size-9 rounded-full grid place-items-center text-white font-semibold text-[12px] shrink-0"
          style={{ background: "linear-gradient(135deg, #515154, #1D1D1F)" }}
        >
          {initials}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-[var(--ink)] truncate leading-tight">{CURRENT_PARTNER.ejer}</div>
              <div className="text-[11px] text-[var(--ink-3)] truncate mt-0.5">{CURRENT_PARTNER.email}</div>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={"text-[var(--ink-3)] shrink-0 transition-transform " + (open ? "rotate-180" : "")}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </>
        )}
      </button>

      {/* Popover menu — opens upward, positioned via absolute */}
      {open && (
        <div
          className={
            "absolute z-30 bg-white rounded-[var(--r-md)] border border-[var(--line)] shadow-[0_12px_32px_rgba(0,0,0,0.14)] py-1.5 overflow-hidden " +
            (collapsed ? "left-[calc(100%+8px)] bottom-2 w-[240px]" : "left-3 right-3 bottom-[calc(100%+8px)]")
          }
          style={{ animation: "slideUpFade 200ms cubic-bezier(0.22,1,0.36,1)" }}
          role="menu"
        >
          {/* Header — only when there's room (the popover hugs the cell on the sidebar) */}
          {collapsed && (
            <div className="px-3 py-2.5 border-b border-[var(--line-2)]">
              <div className="text-[13px] font-semibold text-[var(--ink)] truncate">{CURRENT_PARTNER.ejer}</div>
              <div className="text-[11px] text-[var(--ink-3)] truncate">{CURRENT_PARTNER.email}</div>
            </div>
          )}

          <MenuItem
            label="Min profil"
            hint="Forretning, kontakt, specialer"
            icon="M12 12a4 4 0 100-8 4 4 0 000 8z M4 21a8 8 0 0116 0"
            onClick={() => go("/partner/profile")}
          />
          <MenuItem
            label="Indstillinger"
            hint="Notifikationer, integrationer"
            icon="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 113.4 16.96l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 116.04 3.4l.06.06a1.65 1.65 0 001.82.33H8a1.65 1.65 0 001-1.51V2a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06A2 2 0 1120.6 6.04l-.06.06a1.65 1.65 0 00-.33 1.82V8a1.65 1.65 0 001.51 1H22a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            onClick={() => go("/partner/settings")}
          />
          <MenuItem
            label="Søg overalt"
            hint=""
            kbd="⌘K"
            icon="M21 21l-4.3-4.3M11 18a7 7 0 110-14 7 7 0 010 14z"
            onClick={openCmdK}
          />
          <MenuItem
            label="Hjælp & support"
            hint=""
            icon="M9.1 9a3 3 0 015.83 1c0 2-3 3-3 3 M12 17h.01 M12 22a10 10 0 100-20 10 10 0 000 20z"
            onClick={() => { pushToast("Skriv til support@carl-ras.dk"); setOpen(false); }}
          />

          <div className="h-px bg-[var(--line-2)] my-1.5" />

          <MenuItem
            label="Log ud"
            hint=""
            icon="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9"
            onClick={() => { pushToast("Logget ud (demo)"); setOpen(false); }}
            danger
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  label, hint, icon, kbd, onClick, danger = false,
}: {
  label: string;
  hint?: string;
  icon: string;
  kbd?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      className={
        "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors " +
        (danger
          ? "text-[#8a1f1f] hover:bg-[#FBE2E2]"
          : "text-[var(--ink-2)] hover:bg-[var(--canvas-2)] hover:text-[var(--ink)]")
      }
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-80">
        <path d={icon} />
      </svg>
      <span className="flex-1 min-w-0">
        <div className="text-[13px] font-medium leading-tight">{label}</div>
        {hint && <div className="text-[10.5px] text-[var(--ink-3)] truncate mt-0.5">{hint}</div>}
      </span>
      {kbd && (
        <kbd className="text-[10px] font-semibold text-[var(--ink-3)] bg-[var(--canvas-2)] border border-[var(--line-2)] rounded px-1.5 py-0.5 font-mono">
          {kbd}
        </kbd>
      )}
    </button>
  );
}

function TierBadge({ tier }: { tier: "Bronze" | "Sølv" | "Guld" }) {
  const color = tier === "Guld" ? "#C99A20" : tier === "Sølv" ? "#7E8993" : "#9C6A3F";
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l3 6 6 1-4.5 4.5L18 21l-6-3.5L6 21l1.5-7.5L3 9l6-1z" />
    </svg>
  );
}
