"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_PARTNER } from "@/lib/data";
import { useApp } from "./AppState";

const NAV: { href: string; label: string; icon: string }[] = [
  { href: "/partner",                label: "Oversigt",          icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/partner/kampagner",      label: "Kampagner",         icon: "M4 5h16v4H4zM4 13h10v6H4zM16 13h4v6h-4z" },
  { href: "/partner/leads",          label: "Leads",             icon: "M3 8l9 6 9-6M3 8v10h18V8M3 8l9-5 9 5" },
  { href: "/partner/events",         label: "Events & kalender", icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
  { href: "/partner/certificering",  label: "Certificering",     icon: "M12 2l3 6 6 1-4 4 1 7-6-3-6 3 1-7-4-4 6-1z" },
  { href: "/partner/specialister",   label: "Tal med Carl Ras",  icon: "M21 12a9 9 0 11-3-6.7L21 4v5h-5" },
  { href: "/partner/forum",          label: "Forum",             icon: "M21 11a8 8 0 11-3-6.2L21 3v6h-6M3 21l3-3" },
  { href: "/partner/nyheder",        label: "Nyheder",           icon: "M4 5h16v14H4zM4 9h16M8 5v14" },
];

export function PartnerSidebar() {
  const pathname = usePathname();
  const { leads } = useApp();
  const newLeads = leads.filter((l) => l.partnerId === CURRENT_PARTNER.id && l.status === "Ny").length;
  const pct = Math.round((CURRENT_PARTNER.points / CURRENT_PARTNER.pointsTilNæste) * 100);

  return (
    <aside className="hidden lg:flex flex-col w-[280px] shrink-0 border-r border-[var(--hairline)] bg-white">
      {/* Partner profile card */}
      <div className="p-4 border-b border-[var(--hairline)]">
        <div className="flex items-center gap-3">
          <div
            className="size-12 rounded-2xl text-white font-semibold grid place-items-center shrink-0"
            style={{ background: CURRENT_PARTNER.logoBg }}
          >
            {CURRENT_PARTNER.initialer}
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-[var(--cr-navy-deep)] truncate">
              {CURRENT_PARTNER.firma}
            </div>
            <div className="text-[12px] text-[var(--ink-muted-48)] truncate">
              {CURRENT_PARTNER.by} · {CURRENT_PARTNER.region}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[12px]">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--cr-navy-deep)]">
            <TierBadge tier={CURRENT_PARTNER.tier} /> {CURRENT_PARTNER.tier}-partner
          </span>
          <span className="text-[var(--ink-muted-48)]">
            {CURRENT_PARTNER.points.toLocaleString("da-DK")} / {CURRENT_PARTNER.pointsTilNæste.toLocaleString("da-DK")}
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-[var(--divider-soft)] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: pct + "%", background: "var(--cr-blue)" }} />
        </div>
        <div className="mt-2 text-[11px] text-[var(--ink-muted-48)]">
          {CURRENT_PARTNER.pointsTilNæste - CURRENT_PARTNER.points} point til Guld
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2">
        {NAV.map((item) => {
          const active = item.href === "/partner" ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors " +
                (active
                  ? "bg-[var(--cr-blue-tint)] text-[var(--cr-navy-deep)] font-semibold"
                  : "text-[var(--ink-muted-80)] hover:bg-[var(--surface-pearl)]")
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d={item.icon} />
              </svg>
              <span className="flex-1">{item.label}</span>
              {item.href === "/partner/leads" && newLeads > 0 && (
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--theme-accent-soft)", color: "var(--theme-accent-ink)" }}
                >
                  {newLeads} nye
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer note */}
      <div className="p-3 border-t border-[var(--hairline)] text-[11px] text-[var(--ink-muted-48)]">
        Carl Ras Partner siden {CURRENT_PARTNER.medlemSiden}.
      </div>
    </aside>
  );
}

function TierBadge({ tier }: { tier: "Bronze" | "Sølv" | "Guld" }) {
  const color = tier === "Guld" ? "#D4A437" : tier === "Sølv" ? "#9DA6B0" : "#B07A4B";
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l3 6 6 1-4.5 4.5L18 21l-6-3.5L6 21l1.5-7.5L3 9l6-1z" />
    </svg>
  );
}
