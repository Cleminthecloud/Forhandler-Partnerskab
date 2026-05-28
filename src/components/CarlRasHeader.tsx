"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CarlRasLogo } from "./BrandLogos";

/* Persona switcher — exposed in the mobile drawer so users on /find
   have a way back to /partner or /admin. On desktop this lives in
   DemoTopBar above the carl-ras.dk header. */
const PERSONAS: { href: string; label: string }[] = [
  { href: "/partner", label: "Partner" },
  { href: "/admin",   label: "Carl Ras" },
  { href: "/find",    label: "Find en partner" },
];

/* ------------------------------------------------------------------ */
/* SISTER BRANDS — exact colors from live carl-ras.dk nav.            */
/* These are the four "segments" that anchor the Carl Ras Gruppen     */
/* navigation. Each segment owns its own brand color on the live site */
/* (BYG blue, SIKRING red, 3 AKTIVE dark+yellow, ENGROS BESLAG green) */
/* — so we mirror that here even though our partner-platform accent    */
/* stays Carl Ras Blå.                                                 */
/* ------------------------------------------------------------------ */
type Sister = {
  label: string;
  sub: string;
  bg: string;
  fg: string;
  subWeight?: "bold" | "extrabold";
};

const SISTER_BRANDS: Sister[] = [
  { label: "carl ras",      sub: "BYG",            bg: "#1158A3", fg: "#FFFFFF" },
  { label: "carl ras",      sub: "SIKRING",        bg: "#E30613", fg: "#FFFFFF" },
  { label: "3 aktive",      sub: "ENTREPRENØR",    bg: "#1F262A", fg: "#FFED00" },
  { label: "engros beslag", sub: "DØR & VINDUER",  bg: "#5B7F2C", fg: "#FFFFFF" },
];

/* ------------------------------------------------------------------ */
/* CATEGORY STRIP — the nine main faggrupper on the live site, each   */
/* with its own pictogram. SVGs are simplified line-icons (currentColor)*/
/* ------------------------------------------------------------------ */
type Category = { label: string; icon: React.ReactNode };

const CATEGORIES: Category[] = [
  {
    label: "Værktøj",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 015.7 5.7l-2.1-2.1-2.1.7-.7 2.1 2.1 2.1a4 4 0 01-5.7-5.7" />
        <path d="M12 12L4 20l2 2 8-8" />
      </svg>
    ),
  },
  {
    label: "Beslag",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="16" height="12" rx="1.5" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
        <path d="M12 6v12" />
      </svg>
    ),
  },
  {
    label: "Kemi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3v6l-4 9a3 3 0 002.7 4.3h8.6A3 3 0 0019 18l-4-9V3" />
        <path d="M9 3h6" />
        <path d="M7 14h10" />
      </svg>
    ),
  },
  {
    label: "Befæstigelse",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6l-1 4h-4z" />
        <path d="M10 7h4l-.5 13a1.5 1.5 0 01-3 0z" />
        <path d="M10 11h4M10 14h4M10 17h4" />
      </svg>
    ),
  },
  {
    label: "Sikkerhed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Arbejdstøj",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4h10l3 4-4 2-1 11H9L8 10 4 8z" />
        <path d="M10 4l2 3 2-3" />
      </svg>
    ),
  },
  {
    label: "El & VVS",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 3L5 14h6l-2 7 8-11h-6z" />
      </svg>
    ),
  },
  {
    label: "Skurvognsartikler",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="8" width="18" height="9" rx="1" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="15" cy="19" r="2" />
        <path d="M20 12h2v3h-2" />
        <path d="M6 11h4v3H6z" />
      </svg>
    ),
  },
  {
    label: "Entreprenør",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 19h18" />
        <path d="M5 19v-5l5-2 4 3 5-1v5" />
        <circle cx="8" cy="9" r="2" />
        <path d="M14 7l3-3 3 3-3 3z" />
      </svg>
    ),
  },
];

export function CarlRasHeader() {
  const pathname = usePathname() ?? "";
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile drawer on route change. React 19 pattern:
  // compare prev/current pathname in render rather than useEffect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  // ESC + body scroll lock while drawer is open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  return (
    /* sticky ONLY on desktop. On mobile this header is ~218px tall
       (utility strip + top row + sister brands + categories) — pinning
       it as the user scrolls covers the hero on /find AND the partner
       name on the profile page. Letting it scroll with content is the
       normal mobile pattern (Airbnb, Booking, carl-ras.dk itself).

       The mobile layout (md:hidden block below) is a slim 56px bar +
       hamburger drawer — a real mobile carl-ras.dk skin, NOT the
       desktop layout shoehorned into a phone viewport. */
    <header className="bg-white md:sticky md:top-0 z-30">
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE — slim top bar (hamburger + logo + cart). Everything
          else (search, categories, sister brands, persona switcher)
          lives inside the hamburger drawer.
          ═════════════════════════════════════════════════════════════ */}
      <div className="md:hidden border-b border-[#E5E5E7]" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="flex items-center h-[56px] px-3 gap-1">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Åbn menu"
            aria-expanded={menuOpen}
            className="size-10 grid place-items-center rounded-md text-[#1D1D1F] active:bg-[#F5F5F7]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link href="/find" aria-label="Carl Ras" className="flex-1 flex items-center justify-center min-w-0">
            <CarlRasLogo color="#1158A3" height={22} />
          </Link>

          <Link href="#" aria-label="Søg" className="size-10 grid place-items-center rounded-md text-[#1D1D1F] active:bg-[#F5F5F7]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </Link>

          <Link href="#" aria-label="Kurv" className="size-10 grid place-items-center rounded-md text-[#1D1D1F] active:bg-[#F5F5F7] relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7h18l-2 12H5z" />
              <path d="M9 7V4h6v3" />
            </svg>
            <span className="absolute top-1 right-1 size-[14px] rounded-full bg-[#E30613] text-white text-[9px] font-bold grid place-items-center">1</span>
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE DRAWER — slides in from the left. Order matches the
          real carl-ras.dk mobile menu: persona switcher (demo nav) →
          search → categories → sister brands → utility links.
          ═════════════════════════════════════════════════════════════ */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Navigation">
          <div onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-black/45 backdrop-blur-[1px] animate-in" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-[88vw] max-w-[360px] bg-white flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
            style={{ animation: "slideInRight 260ms cubic-bezier(0.22,1,0.36,1)", paddingTop: "env(safe-area-inset-top, 0px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between gap-3 h-[56px] px-3 border-b border-[#E5E5E7]">
              <Link href="/find" className="flex items-center min-w-0">
                <CarlRasLogo color="#1158A3" height={22} />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Luk menu"
                className="size-10 grid place-items-center rounded-md text-[#1D1D1F] active:bg-[#F5F5F7]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Persona switcher — demo control. Without this there's no
                way back from /find to /partner or /admin on mobile. */}
            <div className="px-4 pt-4 pb-3 border-b border-[#E5E5E7]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#86868B] mb-2">Demo · skift visning</div>
              <nav className="grid grid-cols-3 gap-1 rounded-full bg-[#F5F5F7] p-[3px]">
                {PERSONAS.map((p) => {
                  const active = pathname === p.href || (p.href !== "/" && pathname?.startsWith(p.href + "/")) || pathname === p.href;
                  return (
                    <Link
                      key={p.href}
                      href={p.href}
                      className={
                        "py-2 text-[12.5px] font-semibold rounded-full text-center transition-colors " +
                        (active ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-[#515154] active:text-[#1D1D1F]")
                      }
                      style={{ minHeight: 36 }}
                    >
                      {p.label === "Find en partner" ? "Find" : p.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Search */}
            <div className="px-4 pt-3 pb-3 border-b border-[#E5E5E7]">
              <div className="flex items-center gap-2 bg-[#F5F5F7] rounded-full px-3 h-11">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#7A7A7A] shrink-0">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Søg i hele sortimentet"
                  className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#86868B] min-w-0"
                />
              </div>
            </div>

            {/* Categories — vertical list with chevrons, real-site pattern */}
            <nav className="flex-1 overflow-y-auto">
              <ul>
                {CATEGORIES.map((c) => (
                  <li key={c.label}>
                    <Link
                      href="#"
                      className="flex items-center gap-3 px-4 text-[15px] font-medium text-[#1D1D1F] border-b border-[#F0F0F2] active:bg-[#F5F5F7]"
                      style={{ minHeight: 52 }}
                    >
                      <span className="size-[22px] text-[#1158A3] shrink-0">{c.icon}</span>
                      <span className="flex-1">{c.label}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#86868B]">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Sister brands strip */}
              <div className="px-4 pt-5 pb-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#86868B] mb-2">Carl Ras Gruppen</div>
                <div className="flex flex-wrap gap-2">
                  {SISTER_BRANDS.map((b, i) => (
                    <Link
                      key={i}
                      href="#"
                      className="inline-flex items-center gap-1.5 px-2.5 h-[28px] rounded-[5px] text-[11px] font-bold uppercase tracking-[0.06em] whitespace-nowrap"
                      style={{ background: b.bg, color: b.fg }}
                    >
                      <span className="size-[12px] rounded-[2px] grid place-items-center" style={{ background: b.fg === "#FFFFFF" ? "rgba(255,255,255,0.9)" : b.fg }}>
                        <span style={{ color: b.bg, fontSize: 6.5, fontWeight: 900, lineHeight: 1 }}>CR</span>
                      </span>
                      <span style={{ opacity: 0.92, textTransform: "lowercase", letterSpacing: 0, fontWeight: 600, fontSize: 9.5 }}>{b.label}</span>
                      <span className="font-extrabold" style={{ fontSize: 10 }}>{b.sub}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Utility links — Find butik / Tilbud / B2B-login / Find partner */}
              <div className="px-4 pb-6 pt-2 space-y-1">
                <Link href="/find" className="flex items-center gap-2.5 py-3 text-[14px] font-semibold text-[#1158A3]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                  </svg>
                  Find en partner
                </Link>
                <Link href="#" className="flex items-center gap-2.5 py-3 text-[14px] text-[#1D1D1F]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" /><circle cx="12" cy="9" r="2.5" />
                  </svg>
                  Find butik
                </Link>
                <Link href="#" className="flex items-center gap-2.5 py-3 text-[14px] text-[#1D1D1F]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 13L13 20a2 2 0 01-2.8 0l-7-7V4h9z" /><circle cx="8.5" cy="8.5" r="1.2" />
                  </svg>
                  Tilbud
                </Link>
                <Link href="#" className="flex items-center gap-2.5 py-3 text-[14px] text-[#1D1D1F]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20a8 8 0 0116 0" />
                  </svg>
                  B2B-login
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP — the full carl-ras.dk skin (utility strip + top row
          + sister brands + categories). Hidden on mobile.
          ═════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block">

      {/* ── Utility strip (navy) ─────────────────────────────────────── */}
      <div className="bg-[#001A33] text-white">
        <div className="mx-auto max-w-[1440px] px-6 h-8 flex items-center text-[12px]">
          <button className="flex items-center gap-1.5 hover:opacity-80">
            <span>Pris</span>
            <strong className="font-semibold">inkl. moms</strong>
            <svg width="9" height="6" viewBox="0 0 10 6" className="opacity-70">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
          </button>
          <span className="ml-auto hidden md:flex items-center gap-5 opacity-90">
            <span>B2B-priser efter login</span>
            <span className="opacity-50">·</span>
            <span>Gratis levering over 1.000 kr</span>
          </span>
        </div>
      </div>

      {/* ── Top row: logo · meta links · search · user actions ────── */}
      <div className="border-b border-[#E5E5E7]">
        <div className="mx-auto max-w-[1440px] px-6 h-[68px] flex items-center gap-6">
          {/* Logo — real Carl Ras wordmark (with GRUPPEN sub-label) */}
          <Link href="/find" className="flex items-center gap-2.5 shrink-0 group">
            <CarlRasLogo color="#1158A3" height={26} ariaLabel="Carl Ras" />
            <span className="hidden sm:flex flex-col leading-[1.05] pl-1 border-l border-[#E0E0E0] ml-0.5">
              <span className="text-[9px] font-bold tracking-[0.22em] text-[#1158A3]">GRUPPEN</span>
              <span className="text-[12px] text-[#86868B] mt-0.5">B2B</span>
            </span>
          </Link>

          {/* Find butik · Tilbud */}
          <div className="hidden lg:flex items-center gap-5 text-[13px] font-medium text-[#1D1D1F] shrink-0">
            <Link href="#" className="flex items-center gap-1.5 hover:text-[#1158A3]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Find butik
            </Link>
            <Link href="#" className="flex items-center gap-1.5 hover:text-[#E30613]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 13L13 20a2 2 0 01-2.8 0l-7-7V4h9z" />
                <circle cx="8.5" cy="8.5" r="1.2" />
              </svg>
              Tilbud
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-[520px] flex items-center bg-[#F5F5F7] rounded-full px-4 h-11 border border-transparent focus-within:border-[#1158A3] focus-within:bg-white transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#7A7A7A] shrink-0">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Søg efter: Varenummer, -navn, producent el. lign"
              className="flex-1 bg-transparent px-3 text-[13px] outline-none placeholder:text-[#86868B]"
            />
            <button className="text-[12px] font-medium text-[#515154] flex items-center gap-1 shrink-0 border-l border-[#D2D2D7] pl-3 ml-1">
              Hele sortiment
              <svg width="9" height="6" viewBox="0 0 10 6">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Right user actions */}
          <div className="ml-auto flex items-center gap-5 shrink-0">
            <Link href="#" className="hidden md:flex flex-col items-center gap-0.5 text-[#1D1D1F] hover:text-[#1158A3]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20a8 8 0 0116 0" />
              </svg>
              <span className="text-[12px] font-medium">Log ind</span>
            </Link>
            <Link href="#" className="hidden md:flex flex-col items-center gap-0.5 text-[#1D1D1F] hover:text-[#1158A3]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21l-7-7c-3-3-1-8 3-8 2 0 3 1 4 2 1-1 2-2 4-2 4 0 6 5 3 8z" />
              </svg>
              <span className="text-[12px] font-medium">Favoritter</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-0.5 text-[#1D1D1F] hover:text-[#1158A3] relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7h18l-2 12H5z" />
                <path d="M9 7V4h6v3" />
              </svg>
              <span className="text-[12px] font-medium">Kurv</span>
              <span className="absolute -top-1 right-1 size-[14px] rounded-full bg-[#E30613] text-white text-[9px] font-bold grid place-items-center">1</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Sister-brand segments — each in its real live-site color ─ */}
      <div className="bg-white border-b border-[#EDEDEF]">
        <div className="mx-auto max-w-[1440px] px-6 h-[44px] flex items-center gap-2 overflow-x-auto">
          {SISTER_BRANDS.map((b, i) => (
            <Link
              key={i}
              href="#"
              className="inline-flex items-center gap-2 px-3.5 h-[30px] rounded-[5px] text-[12px] font-bold uppercase tracking-[0.08em] whitespace-nowrap shrink-0 transition-transform hover:translate-y-[-1px]"
              style={{ background: b.bg, color: b.fg }}
            >
              {/* Carl Ras mark (CR ram glyph) */}
              <span
                className="size-[14px] rounded-[3px] grid place-items-center"
                style={{ background: b.fg === "#FFFFFF" ? "rgba(255,255,255,0.95)" : b.fg }}
              >
                <span style={{ color: b.bg, fontSize: 7.5, fontWeight: 900, lineHeight: 1, letterSpacing: 0 }}>
                  CR
                </span>
              </span>
              <span style={{ opacity: 0.92, textTransform: "lowercase", letterSpacing: 0, fontWeight: 600, fontSize: 11 }}>
                {b.label}
              </span>
              <span className="font-extrabold">{b.sub}</span>
            </Link>
          ))}

          {/* Find en partner — anchor right */}
          <Link
            href="/find"
            className="ml-auto inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#1158A3] whitespace-nowrap shrink-0 hover:text-[#002C5B] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            Find en partner
          </Link>
        </div>
      </div>

      {/* ── Category strip with icons ─────────────────────────────── */}
      <div className="bg-white border-b border-[#E5E5E7]">
        <div className="mx-auto max-w-[1440px] px-4 h-[78px] flex items-center gap-1 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href="#"
              className="group flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md hover:bg-[#F5F5F7] text-[#1D1D1F] hover:text-[#1158A3] transition-colors shrink-0 min-w-[88px]"
            >
              <span className="size-[26px] text-[#1158A3] group-hover:text-[#002C5B] transition-colors">
                {c.icon}
              </span>
              <span className="text-[11.5px] font-medium whitespace-nowrap">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>

      </div>
      {/* /desktop-only wrapper */}
    </header>
  );
}
