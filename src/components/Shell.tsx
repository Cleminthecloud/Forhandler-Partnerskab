"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

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
          ? "fixed top-3 right-3 z-50 rounded-full bg-[var(--cr-navy-deep)] text-white shadow-2xl ring-1 ring-white/10"
          : "sticky top-0 z-40 bg-[var(--cr-navy-deep)] text-white"
      }
    >
      <div className={floating ? "px-3 h-11 flex items-center gap-3" : "mx-auto max-w-[1440px] px-6 h-14 flex items-center gap-6"}>
        {!floating && (
          <Link href="/partner" className="flex items-center gap-3 shrink-0">
            <span className="size-7 rounded-md overflow-hidden ring-1 ring-white/10 grid place-items-center bg-[var(--cr-blue)]">
              <Image src="/carl-ras-logo.png" alt="Carl Ras" width={28} height={28} className="size-7 object-contain" />
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="text-[13px] font-semibold tracking-tight">Carl Ras</span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-white/55">Forhandler&nbsp;Partnerskab</span>
            </span>
          </Link>
        )}

        {floating && (
          <div className="flex items-center gap-2 px-2 text-[11px] uppercase tracking-[0.14em] text-white/60">
            <span className="size-2 rounded-full bg-[var(--theme-accent)]" />
            Demo
          </div>
        )}

        <nav className={(floating ? "" : "ml-auto ") + "flex items-center gap-1 rounded-full bg-white/[0.06] p-1"}>
          {PERSONAS.map((p) => {
            const active = pathname === p.href || (p.href !== "/" && pathname?.startsWith(p.href));
            return (
              <Link
                key={p.href}
                href={p.href}
                className={
                  "px-3 sm:px-4 py-1.5 text-[12px] font-medium rounded-full transition-colors " +
                  (active ? "bg-white text-[var(--cr-navy-deep)]" : "text-white/80 hover:text-white")
                }
              >
                {p.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 text-[12px] bg-white/[0.08] hover:bg-white/[0.14] transition-colors"
          >
            <span className="inline-block size-2.5 rounded-full" style={{ background: theme.accent }} />
            <span className="hidden md:inline">Tema:</span>
            <span className="font-medium">{theme.label}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" className="opacity-70">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-[300px] rounded-2xl bg-white text-[var(--ink)] shadow-2xl ring-1 ring-black/5 z-40 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--divider-soft)]">
                  <div className="t-caption">BU årshjul — vælg tema</div>
                </div>
                <ul className="py-1">
                  {themes.map((t) => (
                    <li key={t.id}>
                      <button
                        onClick={() => { setThemeId(t.id); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-pearl)] text-left"
                      >
                        <span className="size-3 rounded-full shrink-0" style={{ background: t.accent }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[14px]">{t.label}</span>
                            <span
                              className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide"
                              style={{ background: t.accentSoft, color: t.accentInk }}
                            >
                              {t.status}
                            </span>
                          </div>
                          <div className="text-[12px] text-[var(--ink-muted-48)]">
                            {t.bu} · {t.season}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-3 bg-[var(--surface-pearl)] text-[12px] text-[var(--ink-muted-48)] border-t border-[var(--divider-soft)]">
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

/* Back-compat — old import path */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DemoTopBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
