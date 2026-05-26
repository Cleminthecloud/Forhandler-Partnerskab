"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin",                  label: "Oversigt",       icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/partnere",         label: "Partnere",       icon: "M3 7a4 4 0 118 0M3 21h14M5 21v-4a4 4 0 014-4h0a4 4 0 014 4v4" },
  { href: "/admin/kalender",         label: "Kalender",       icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
  { href: "/admin/certificering",    label: "Certificering",  icon: "M12 2l3 6 6 1-4 4 1 7-6-3-6 3 1-7-4-4 6-1z" },
  { href: "/admin/kampagner",        label: "Kampagner",      icon: "M4 5h16v4H4zM4 13h10v6H4zM16 13h4v6h-4z" },
  { href: "/admin/indhold",          label: "Indhold",        icon: "M4 5h16v14H4zM4 9h16M8 5v14" },
  { href: "/admin/beskeder",         label: "Beskeder",       icon: "M3 5h18v12H7l-4 4z" },
  { href: "/admin/data",             label: "Data & rapport", icon: "M3 21v-7m6 7V10m6 11V6m6 15v-9" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-[280px] shrink-0 border-r border-[var(--hairline)] bg-white">
      <div className="p-5 border-b border-[var(--hairline)]">
        <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>CARL RAS · LEADERSHIP</div>
        <div className="mt-2 text-[15px] font-semibold text-[var(--cr-navy-deep)]">Forhandler Partnerskab</div>
        <div className="text-[12px] text-[var(--ink-muted-48)] mt-0.5">Drift &amp; vækst</div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname?.startsWith(item.href);
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
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--hairline)] text-[11px] text-[var(--ink-muted-48)]">
        Demo · alle ændringer er lokale.
      </div>
    </aside>
  );
}
