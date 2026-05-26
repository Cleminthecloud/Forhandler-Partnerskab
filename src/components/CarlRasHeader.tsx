"use client";
import Link from "next/link";
import Image from "next/image";

const MAIN_NAV = [
  "Værktøj",
  "Beslag",
  "Kemi",
  "Befæstigelse",
  "Sikkerhed",
  "Arbejdstøj",
  "El & VVS",
  "Skurvognsartikler",
  "Entreprenør",
];

const SISTER_BRANDS = [
  { label: "carl ras", sub: "BYG", color: "#1158A3" },
  { label: "carl ras", sub: "SIKRING", color: "#E30613" },
  { label: "3 Aktive", sub: "ENTREPRENØR", color: "#0C447C" },
  { label: "Engros beslag", sub: "DØR & VINDUER", color: "#002D59" },
];

export function CarlRasHeader() {
  return (
    <header className="bg-white sticky top-0 z-30">
      {/* Utility strip — navy */}
      <div className="bg-[#001A33] text-white">
        <div className="mx-auto max-w-[1440px] px-6 h-8 flex items-center text-[11px]">
          <span className="flex items-center gap-1">
            Pris <strong className="font-semibold">inkl. moms</strong>
            <svg width="8" height="5" viewBox="0 0 10 6" className="opacity-70"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
          </span>
          <span className="ml-auto hidden md:flex items-center gap-5">
            <span>B2B-priser efter login</span>
            <span>·</span>
            <span>Gratis levering over 1.000 kr</span>
          </span>
        </div>
      </div>

      {/* Top row: logo + sister brands + search + actions */}
      <div className="border-b border-[#E0E0E0]">
        <div className="mx-auto max-w-[1440px] px-6 h-[64px] flex items-center gap-5">
          {/* Logo */}
          <Link href="/find" className="flex items-center gap-2 shrink-0">
            <span className="size-9 rounded-md grid place-items-center bg-[#1158A3]">
              <Image src="/carl-ras-logo.png" alt="Carl Ras" width={36} height={36} className="size-9 object-contain" />
            </span>
            <span className="hidden sm:flex flex-col leading-[1.05]">
              <span className="text-[15px] font-bold tracking-tight text-[#1D1D1F]">carl ras</span>
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#1158A3]">GRUPPEN</span>
            </span>
          </Link>

          {/* Find butik / Tilbud */}
          <div className="hidden lg:flex items-center gap-5 text-[13px] font-medium text-[#1D1D1F]">
            <Link href="#" className="hover:text-[#1158A3]">Find butik</Link>
            <Link href="#" className="hover:text-[#1158A3]">Tilbud</Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-[480px] flex items-center bg-[#F5F5F7] rounded-full px-4 h-10 border border-transparent focus-within:border-[#1158A3] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#7A7A7A]"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input type="text" placeholder="Søg efter: Varenummer, -navn, producent el. lign" className="flex-1 bg-transparent px-3 text-[13px] outline-none placeholder:text-[#86868B]" />
            <button className="text-[12px] text-[#515154] flex items-center gap-1">
              Hele sortiment
              <svg width="9" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-4 shrink-0">
            <Link href="#" className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-[#1D1D1F] hover:text-[#1158A3]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0116 0"/></svg>
              Log ind
            </Link>
            <Link href="#" className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-[#1D1D1F] hover:text-[#1158A3]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21l-7-7c-3-3-1-8 3-8 2 0 3 1 4 2 1-1 2-2 4-2 4 0 6 5 3 8z"/></svg>
              Favoritter
            </Link>
            <Link href="#" className="flex items-center gap-1.5 text-[13px] font-medium text-[#1D1D1F] hover:text-[#1158A3] relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h18l-2 12H5z"/><path d="M9 7V4h6v3"/></svg>
              Kurv
              <span className="absolute -top-1 -right-2 size-4 rounded-full bg-[#E30613] text-white text-[9px] font-bold grid place-items-center">1</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sister-brands strip */}
      <div className="border-b border-[#E0E0E0] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 h-11 flex items-center gap-0">
          <div className="flex items-center gap-0 overflow-x-auto">
            {SISTER_BRANDS.map((b, i) => (
              <Link
                key={i}
                href="#"
                className="inline-flex items-center gap-1.5 px-3.5 h-7 rounded-md text-[10px] font-bold uppercase tracking-[0.06em] whitespace-nowrap shrink-0 mr-2"
                style={{ background: b.color, color: "white" }}
              >
                {/* Tiny ram glyph */}
                <span className="size-3 rounded-[3px] bg-white/95 grid place-items-center">
                  <span style={{ color: b.color, fontSize: 7, fontWeight: 900, lineHeight: 1 }}>CR</span>
                </span>
                <span className="opacity-90">{b.label}</span>
                <span className="font-extrabold">{b.sub}</span>
              </Link>
            ))}
          </div>

          {/* Main nav */}
          <nav className="hidden xl:flex items-center gap-5 ml-6 overflow-x-auto">
            {MAIN_NAV.map((n) => (
              <Link key={n} href="#" className="text-[13px] text-[#1D1D1F] hover:text-[#1158A3] whitespace-nowrap">
                {n}
              </Link>
            ))}
          </nav>

          <Link
            href="/find"
            className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1158A3] whitespace-nowrap shrink-0"
          >
            <span className="size-4 rounded-full bg-[#1158A3] text-white grid place-items-center text-[9px] font-bold">N</span>
            Find en partner
          </Link>
        </div>
      </div>
    </header>
  );
}
