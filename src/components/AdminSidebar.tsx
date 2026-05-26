"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarCollapsed, CollapseToggle } from "./SidebarToggle";

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
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <aside
      className={
        "hidden lg:flex flex-col shrink-0 border-r border-[var(--hairline)] bg-[var(--canvas)] " +
        "sticky top-[48px] h-[calc(100vh-48px)] overflow-y-auto " +
        "transition-[width] duration-300 ease-out " +
        (collapsed ? "w-[64px]" : "w-[260px]")
      }
    >
      <div className={"border-b border-[var(--divider)] " + (collapsed ? "p-3" : "p-5")}>
        {collapsed ? (
          <div className="grid place-items-center">
            <span className="size-9 rounded-md bg-[var(--cr-blue)] grid place-items-center text-white font-bold text-[11px]">CR</span>
          </div>
        ) : (
          <>
            <div className="t-eyebrow">Carl Ras · Leadership</div>
            <div className="mt-2 text-[15px] font-semibold text-[var(--ink)]">Forhandler Partnerskab</div>
            <div className="text-[12px] text-[var(--ink-3)] mt-0.5">Drift &amp; vækst</div>
          </>
        )}
      </div>

      <nav className={"flex-1 overflow-y-auto py-3 " + (collapsed ? "px-2" : "px-3")}>
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              {...(collapsed ? { "data-tt": item.label, "data-tt-pos": "right" } : {})}
              className={
                "flex items-center gap-3 rounded-[11px] text-[14px] font-medium transition-colors mb-0.5 " +
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
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={"border-t border-[var(--divider)] " + (collapsed ? "p-2 flex justify-center" : "px-3 py-3 flex items-center justify-between gap-3")}>
        {!collapsed && (
          <span className="text-[11px] text-[var(--ink-3)] truncate">
            Demo · lokale ændringer
          </span>
        )}
        <CollapseToggle collapsed={collapsed} onClick={toggle} />
      </div>
    </aside>
  );
}
