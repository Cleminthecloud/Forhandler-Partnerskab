"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { CommandPaletteTrigger } from "./CommandPalette";
import { CarlRasPartnerLogoWide } from "./BrandLogos";
import { MobileNav } from "./MobileNav";

const PERSONAS = [
  { href: "/partner", label: "Partner" },
  { href: "/admin", label: "Carl Ras" },
  { href: "/find", label: "Find en partner" },
];

export function DemoTopBar({ floating = false }: { floating?: boolean }) {
  const pathname = usePathname();
  const { theme, themes, setThemeId } = useTheme();
  const [open, setOpen] = useState(false);

  // Floating variant is unchanged — used on /find which has its own header
  if (floating) {
    return (
      <header className="app-chrome fixed top-3 right-3 z-50 rounded-full bg-[var(--accent-press)]/95 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md">
        <div className="px-2.5 h-10 flex items-center gap-2.5">
          <span className="px-1.5 text-[12px] uppercase tracking-[0.16em] text-white/55 select-none">Demo</span>
          <nav className="flex items-center rounded-full bg-white/[0.08] p-[3px] shrink-0">
            {PERSONAS.map((p) => {
              const active = pathname === p.href || (p.href !== "/" && pathname?.startsWith(p.href));
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className={
                    "px-2.5 py-1 text-[12px] font-medium rounded-full transition-colors whitespace-nowrap " +
                    (active ? "bg-white text-[#1D1D1F]" : "text-white/75 hover:text-white")
                  }
                >
                  {p.label === "Find en partner" ? "Find" : p.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="app-chrome sticky top-0 z-40 bg-[var(--accent)] text-white">
      {/* MOBILE TOP BAR — matches carl-ras.dk mobile pattern.
          Clean hamburger + logo + small theme dot on the right. Persona
          switcher and full theme picker live INSIDE the hamburger drawer. */}
      <div className="flex md:hidden items-center gap-3 h-[52px] px-3" style={{ paddingTop: "max(0px, env(safe-area-inset-top, 0px))" }}>
        <MobileNav />
        <Link href="/partner" aria-label="Carl Ras Partner" className="flex items-center min-w-0 flex-1">
          <CarlRasPartnerLogoWide color="white" height={20} className="max-w-full" />
        </Link>
        {/* Right: theme indicator chip + small chevron — taps to open theme picker */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] transition-colors shrink-0"
          aria-label={`Skift tema. Nuværende: ${theme.label}`}
          style={{ minHeight: 40 }}
        >
          <span className="size-2 rounded-full" style={{ background: theme.accent }} />
          <svg width="10" height="6" viewBox="0 0 10 6" className="opacity-70">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* DESKTOP TOP BAR — existing rich layout with persona switcher + theme dropdown.
          Hamburger nav still visible in the md→lg gap (where sidebars haven't kicked in yet). */}
      <div className="hidden md:flex mx-auto max-w-[1440px] px-6 h-[48px] items-center gap-6">
        <div className="lg:hidden"><MobileNav /></div>
        <Link
          href="/partner"
          className="flex items-center shrink-0 hover:opacity-90 transition-opacity"
          aria-label="Carl Ras Partner"
        >
          <CarlRasPartnerLogoWide color="white" height={22} />
        </Link>

        <div className="ml-auto"><CommandPaletteTrigger /></div>

        <nav className="flex items-center rounded-full bg-white/[0.08] p-[3px] shrink-0">
          {PERSONAS.map((p) => {
            const active = pathname === p.href || (p.href !== "/" && pathname?.startsWith(p.href));
            return (
              <Link
                key={p.href}
                href={p.href}
                className={
                  "px-3 py-1 text-[12px] font-medium rounded-full transition-colors whitespace-nowrap " +
                  (active ? "bg-white text-[#1D1D1F]" : "text-white/75 hover:text-white")
                }
              >
                {p.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative shrink-0">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full pl-1.5 pr-2.5 py-1 text-[12px] bg-white/[0.08] hover:bg-white/[0.14] transition-colors"
            aria-label={`Tema: ${theme.label}`}
          >
            <span className="inline-block size-2 rounded-full" style={{ background: theme.accent }} />
            <span className="text-white/70">Tema:</span>
            <span className="font-medium">{theme.label}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" className="opacity-60">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Theme picker dropdown / sheet — shared between mobile + desktop.
          On mobile it slides up from the bottom as a sheet; on desktop it
          drops below the trigger. */}
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          {/* Mobile: bottom sheet */}
          <div className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-white text-[var(--ink)] rounded-t-[18px] shadow-[0_-12px_40px_rgba(0,0,0,0.18)] overflow-hidden" style={{ animation: "slideInUp 280ms cubic-bezier(0.22,1,0.36,1)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
            <div className="grid place-items-center pt-2">
              <span className="w-10 h-1 rounded-full bg-[var(--line)] opacity-60" />
            </div>
            <div className="px-5 pt-3 pb-2">
              <div className="t-eyebrow !text-[12px]">BU årshjul — vælg tema</div>
            </div>
            <ul className="px-2 pb-2">
              {themes.map((t) => {
                const isActive = t.id === theme.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => { setThemeId(t.id); setOpen(false); }}
                      className={"w-full flex items-center gap-3 px-3 py-3.5 rounded-[var(--r-md)] text-left transition-colors " + (isActive ? "bg-[var(--canvas-2)]" : "hover:bg-[var(--canvas-2)]")}
                      style={{ minHeight: 56 }}
                    >
                      <span className="size-3 rounded-full shrink-0" style={{ background: t.accent }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-medium text-[var(--ink)]">{t.label}</span>
                          <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide" style={{ background: t.accentSoft, color: t.accentInk }}>{t.status}</span>
                        </div>
                        <div className="text-[12.5px] text-[var(--ink-60)] mt-0.5">{t.bu} · {t.season}</div>
                      </div>
                      {isActive && (
                        <svg width="16" height="16" viewBox="0 0 14 14" className="text-[var(--cr-blue)] shrink-0">
                          <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="px-5 py-3 bg-[var(--canvas-2)] text-[12px] text-[var(--ink-60)] border-t border-[var(--line-2)]">
              Platformen er konstant. Temaet roterer fra hvert BU&apos;s årshjul.
            </div>
          </div>
          {/* Desktop: dropdown anchored to the trigger */}
          <div className="hidden md:block absolute right-6 top-[52px] w-[320px] rounded-2xl bg-white text-[var(--ink)] shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-40 overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--divider)]">
              <div className="t-tagline" style={{ color: "var(--ink-60)" }}>BU årshjul — vælg tema</div>
            </div>
            <ul className="py-1">
              {themes.map((t) => {
                const isActive = t.id === theme.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => { setThemeId(t.id); setOpen(false); }}
                      className={"w-full flex items-center gap-3 px-4 py-3 text-left transition-colors " + (isActive ? "bg-[var(--surface-pearl)]" : "hover:bg-[var(--surface-pearl)]")}
                    >
                      <span className="size-3 rounded-full shrink-0" style={{ background: t.accent }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-medium text-[var(--ink)]">{t.label}</span>
                          <span className="text-[12px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide" style={{ background: t.accentSoft, color: t.accentInk }}>{t.status}</span>
                        </div>
                        <div className="text-[12px] text-[var(--ink-60)] mt-0.5">{t.bu} · {t.season}</div>
                      </div>
                      {isActive && (
                        <svg width="14" height="14" viewBox="0 0 14 14" className="text-[var(--cr-blue)]">
                          <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="px-4 py-3 bg-[var(--surface-pearl)] text-[12px] text-[var(--ink-60)] border-t border-[var(--divider)]">
              Platformen er konstant. Temaet roterer fra hvert BU&apos;s årshjul.
            </div>
          </div>
        </>
      )}
    </header>
  );
}

/* Back-compat */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-[var(--r-md)] focus:bg-[var(--ink)] focus:text-white focus:shadow-[var(--shadow-3)] focus:no-underline"
      >
        Spring til indhold
      </a>
      <DemoTopBar />
      <main id="main" className="flex-1">{children}</main>
    </div>
  );
}
