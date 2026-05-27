"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_PARTNER } from "@/lib/data";
import { useApp } from "./AppState";
import { useSidebarCollapsed, CollapseToggle } from "./SidebarToggle";

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
  const { leads } = useApp();
  const { collapsed, toggle } = useSidebarCollapsed();
  const newLeads = leads.filter((l) => l.partnerId === CURRENT_PARTNER.id && l.status === "Ny").length;
  const pct = Math.round((CURRENT_PARTNER.points / CURRENT_PARTNER.pointsTilNæste) * 100);

  return (
    <aside
      className={
        "hidden lg:flex flex-col shrink-0 border-r border-[var(--hairline)] bg-[var(--canvas)] " +
        "sticky top-[48px] h-[calc(100vh-48px)] overflow-y-auto scrollbar-hidden " +
        "transition-[width] duration-300 ease-out " +
        (collapsed ? "w-[64px]" : "w-[260px]")
      }
    >
      {/* Partner profile card */}
      <div className={"border-b border-[var(--divider)] " + (collapsed ? "p-3" : "p-5")}>
        <div className={"flex items-center gap-3 " + (collapsed ? "justify-center" : "")}>
          <div
            className="size-11 rounded-xl text-white font-semibold grid place-items-center shrink-0 text-[14px]"
            style={{ background: CURRENT_PARTNER.logoBg }}
            title={collapsed ? CURRENT_PARTNER.firma : undefined}
          >
            {CURRENT_PARTNER.initialer}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-[var(--ink)] truncate leading-tight">
                {CURRENT_PARTNER.firma}
              </div>
              <div className="text-[12px] text-[var(--ink-3)] truncate mt-0.5">
                {CURRENT_PARTNER.by} · {CURRENT_PARTNER.region}
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <>
            <div className="mt-4 flex items-center gap-1.5 text-[12px]">
              <TierBadge tier={CURRENT_PARTNER.tier} />
              <span className="font-semibold text-[var(--ink)]">{CURRENT_PARTNER.tier}-partner</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-[var(--ink-3)] mb-1.5">
                <span>{CURRENT_PARTNER.points.toLocaleString("da-DK")} point</span>
                <span>{Math.max(0, CURRENT_PARTNER.pointsTilNæste - CURRENT_PARTNER.points)} til Guld</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--divider)] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: pct + "%", background: "var(--cr-blue)" }} />
              </div>
            </div>
          </>
        )}
      </div>

      <nav className={"flex-1 overflow-y-auto py-3 " + (collapsed ? "px-2" : "px-3")}>
        {NAV.map((item) => {
          const active = item.href === "/partner" ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              {...(collapsed ? { "data-tt": item.label, "data-tt-pos": "right" } : {})}
              className={
                "flex items-center gap-3 rounded-[11px] text-[14px] font-medium transition-colors mb-0.5 relative " +
                (collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2") +
                " " +
                (active
                  ? "bg-[var(--cr-blue-tint)] text-[var(--cr-navy)]"
                  : "text-[var(--ink-80)] hover:bg-[var(--surface-pearl)]")
              }
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-80">
                <path d={item.icon} />
              </svg>
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {item.href === "/partner/leads" && newLeads > 0 && (
                <span
                  className={
                    "text-[10px] font-semibold rounded-full text-white shrink-0 " +
                    (collapsed
                      ? "absolute top-1 right-1 size-4 grid place-items-center text-[8px]"
                      : "px-1.5 py-0.5")
                  }
                  style={{ background: "var(--cr-blue)" }}
                >
                  {newLeads}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer with toggle */}
      <div className={"border-t border-[var(--divider)] " + (collapsed ? "p-2 flex justify-center" : "px-3 py-3 flex items-center justify-between gap-3")}>
        {!collapsed && (
          <span className="text-[11px] text-[var(--ink-3)] truncate">
            Partner siden {CURRENT_PARTNER.medlemSiden}
          </span>
        )}
        <CollapseToggle collapsed={collapsed} onClick={toggle} />
      </div>
    </aside>
  );
}

function TierBadge({ tier }: { tier: "Bronze" | "Sølv" | "Guld" }) {
  const color = tier === "Guld" ? "#C99A20" : tier === "Sølv" ? "#7E8993" : "#9C6A3F";
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l3 6 6 1-4.5 4.5L18 21l-6-3.5L6 21l1.5-7.5L3 9l6-1z" />
    </svg>
  );
}
