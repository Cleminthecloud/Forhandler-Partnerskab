"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

/* =====================================================================
   MobileNav — hamburger button + slide-in drawer for navigation when the
   desktop sidebar is hidden (<lg breakpoint). Picks the right nav set
   based on whether we're under /partner/* or /admin/*. Auto-closes on
   route change so taps don't leave the menu hanging open.

   This is Tier-A mobile support: gets the partner platform out of "no
   way to navigate on a phone" territory. Not a polished mobile product —
   but the demo doesn't look broken when opened on a phone.
   ===================================================================== */

const PARTNER_NAV: NavItem[] = [
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

const ADMIN_NAV: NavItem[] = [
  { href: "/admin",                  label: "Oversigt",       icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/partnere",         label: "Partnere",       icon: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M22 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75" },
  { href: "/admin/kalender",         label: "Kalender",       icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
  { href: "/admin/certificering",    label: "Certificering",  icon: "M12 3a6 6 0 110 12 6 6 0 010-12z M8 14l-2 7 6-3 6 3-2-7" },
  { href: "/admin/kampagner",        label: "Kampagner",      icon: "M3 10v4l13 5V5L3 10z M18 9a4 4 0 010 6" },
  { href: "/admin/indhold",          label: "Indhold",        icon: "M7 4h11v14H7z M4 7v13h11" },
  { href: "/admin/beskeder",         label: "Beskeder",       icon: "M21 11.5c0 4.7-4 8.5-9 8.5-1.5 0-2.9-.3-4.1-.9L3 20l1.5-4.4C3.5 14 3 12.8 3 11.5 3 6.8 7 3 12 3s9 3.8 9 8.5z" },
  { href: "/admin/data",             label: "Data & rapport", icon: "M3 21v-7m6 7V10m6 11V6m6 15v-9" },
];

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Auto-close when route changes. React 19 "adjust state during render"
  // pattern — comparing previous vs current pathname inside render and
  // setting state conditionally is preferred over useEffect+setState,
  // which causes cascading renders.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Pick nav set based on the current platform context
  const isAdmin = pathname?.startsWith("/admin");
  const isPartner = pathname?.startsWith("/partner");
  const nav = isAdmin ? ADMIN_NAV : isPartner ? PARTNER_NAV : null;
  const label = isAdmin ? "Carl Ras HQ" : isPartner ? "Partner Menu" : "Menu";

  // Nothing to navigate on the public /find page — don't render the menu
  if (!nav) return null;

  return (
    <>
      {/* Hamburger button — only visible on mobile (<lg). Sits in the top bar */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center justify-center size-9 rounded-full text-white/85 hover:text-white hover:bg-white/[0.08] transition-colors"
        aria-label="Åbn menu"
        aria-expanded={open}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] animate-in" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-[var(--canvas)] shadow-[var(--shadow-3)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideInRight 240ms cubic-bezier(0.22,1,0.36,1)", transformOrigin: "left", transform: "scaleX(1)" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--line-2)] flex items-center justify-between">
              <div className="text-[12px] uppercase tracking-wider font-semibold text-[var(--ink-3)]">{label}</div>
              <button
                onClick={() => setOpen(false)}
                className="size-9 rounded-full grid place-items-center text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--canvas-2)] transition-colors"
                aria-label="Luk menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav list */}
            <nav className="flex-1 overflow-y-auto py-3">
              <ul>
                {nav.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/partner" && item.href !== "/admin" && pathname?.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={
                          "flex items-center gap-3 px-5 py-3 text-[14.5px] font-medium transition-colors " +
                          (isActive
                            ? "bg-[var(--accent-tint)] text-[var(--accent-press)] border-l-[3px] border-[var(--accent)]"
                            : "text-[var(--ink-2)] hover:bg-[var(--canvas-2)] border-l-[3px] border-transparent")
                        }
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          <path d={item.icon} />
                        </svg>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer — quick context about the demo */}
            <div className="px-5 py-3 border-t border-[var(--line-2)] text-[11.5px] text-[var(--ink-3)]">
              Forhandler Partnerskab · {isAdmin ? "Carl Ras HQ" : "Partner-portal"}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
