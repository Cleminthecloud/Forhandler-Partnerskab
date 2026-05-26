"use client";
import Link from "next/link";
import Image from "next/image";

const NAV = ["Værktøj", "Beslag", "Arbejdstøj", "Sikring", "Vinterklargøring", "Find butik"];

export function CarlRasHeader() {
  return (
    <header className="bg-white">
      {/* Top utility bar — like the real carl-ras.dk */}
      <div className="bg-[var(--cr-navy-deep)] text-white">
        <div className="mx-auto max-w-[1280px] px-6 h-8 flex items-center justify-end gap-5 text-[11px]">
          <span>B2B-priser efter login</span>
          <span>·</span>
          <span>Gratis levering over 1.000 kr</span>
          <span>·</span>
          <span>📞 +45 70 27 99 00</span>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-[var(--hairline)]">
        <div className="mx-auto max-w-[1280px] px-6 h-16 flex items-center gap-8">
          <Link href="/find" className="flex items-center gap-3">
            <span className="size-10 rounded-md grid place-items-center bg-[var(--cr-blue)]">
              <Image src="/carl-ras-logo.png" alt="Carl Ras" width={40} height={40} className="size-10 object-contain" />
            </span>
            <span className="text-[22px] font-bold tracking-tight text-[var(--cr-navy-deep)]">Carl Ras</span>
          </Link>

          {/* Search bar */}
          <div className="hidden lg:flex flex-1 max-w-[420px] items-center bg-[var(--surface-pearl)] rounded-full px-4 h-10 border border-[var(--hairline)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--ink-muted-48)]"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input type="text" placeholder="Søg sortiment, varenummer, partner…" className="flex-1 bg-transparent px-3 text-[13px] outline-none" />
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-5">
            <Link href="#" className="hidden md:flex items-center gap-1.5 text-[13px] text-[var(--cr-navy-deep)] hover:underline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h18l-2 12H5z"/><path d="M9 7V4h6v3"/></svg>
              Kurv
            </Link>
            <Link href="#" className="hidden md:flex items-center gap-1.5 text-[13px] text-[var(--cr-navy-deep)] hover:underline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0116 0"/></svg>
              Min konto
            </Link>
          </div>
        </div>
      </div>

      {/* Nav row */}
      <nav className="border-b border-[var(--hairline)] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 h-11 flex items-center gap-7 overflow-x-auto">
          {NAV.map((n) => (
            <Link key={n} href="#" className="text-[13px] font-medium text-[var(--cr-navy-deep)] hover:text-[var(--cr-blue)] whitespace-nowrap">
              {n}
            </Link>
          ))}
          <Link
            href="/find"
            className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--cr-blue)] whitespace-nowrap"
          >
            <span className="size-4 rounded-full bg-[var(--cr-blue)] text-white grid place-items-center text-[9px]">N</span>
            Find en partner
          </Link>
        </div>
      </nav>
    </header>
  );
}
