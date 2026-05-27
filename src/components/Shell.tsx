"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { CommandPaletteTrigger } from "./CommandPalette";
import { CarlRasPartnerLogoWide } from "./BrandLogos";

const PERSONAS = [
  { href: "/partner", label: "Partner" },
  { href: "/admin", label: "Carl Ras" },
  { href: "/find", label: "Find en partner" },
];

export function DemoTopBar({ floating = false }: { floating?: boolean }) {
  const pathname = usePathname();
  const { theme, themes, setThemeId } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={
        floating
          ? "fixed top-3 right-3 z-50 rounded-full bg-[var(--accent-press)]/95 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md"
          : "sticky top-0 z-40 bg-[var(--accent)] text-white"
      }
    >
      <div className={floating ? "px-2.5 h-10 flex items-center gap-2.5" : "mx-auto max-w-[1440px] px-6 h-[48px] flex items-center gap-6"}>
        {!floating && (
          <Link
            href="/partner"
            className="flex items-center shrink-0 hover:opacity-90 transition-opacity"
            aria-label="Carl Ras Partner"
          >
            <CarlRasPartnerLogoWide color="white" height={22} />
          </Link>
        )}

        {floating && (
          <span className="px-1.5 text-[10px] uppercase tracking-[0.16em] text-white/55 select-none">
            Demo
          </span>
        )}

        {/* Command palette trigger */}
        {!floating && <div className="ml-auto"><CommandPaletteTrigger /></div>}

        {/* Persona switcher (segmented) */}
        <nav className={(floating ? "" : "") + "flex items-center rounded-full bg-white/[0.08] p-[3px]"}>
          {PERSONAS.map((p) => {
            const active = pathname === p.href || (p.href !== "/" && pathname?.startsWith(p.href));
            return (
              <Link
                key={p.href}
                href={p.href}
                className={
                  (floating ? "px-2.5 " : "px-3 ") +
                  "py-1 text-[12px] font-medium rounded-full transition-colors " +
                  (active ? "bg-white text-[#1D1D1F]" : "text-white/75 hover:text-white")
                }
              >
                {p.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme switcher */}
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full pl-1.5 pr-2.5 py-1 text-[12px] bg-white/[0.08] hover:bg-white/[0.14] transition-colors"
          >
            <span className="inline-block size-2 rounded-full" style={{ background: theme.accent }} />
            <span className="hidden md:inline text-white/70">Tema:</span>
            <span className="font-medium">{theme.label}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" className="opacity-60">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-[320px] rounded-2xl bg-white text-[var(--ink)] shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-40 overflow-hidden">
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
                          className={
                            "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors " +
                            (isActive ? "bg-[var(--surface-pearl)]" : "hover:bg-[var(--surface-pearl)]")
                          }
                        >
                          <span className="size-3 rounded-full shrink-0" style={{ background: t.accent }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-medium text-[var(--ink)]">{t.label}</span>
                              <span
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide"
                                style={{ background: t.accentSoft, color: t.accentInk }}
                              >
                                {t.status}
                              </span>
                            </div>
                            <div className="text-[12px] text-[var(--ink-60)] mt-0.5">
                              {t.bu} · {t.season}
                            </div>
                          </div>
                          {isActive && (
                            <svg width="14" height="14" viewBox="0 0 14 14" className="text-[var(--cr-blue)]">
                              <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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
        </div>
      </div>
    </header>
  );
}

/* Back-compat */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DemoTopBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
