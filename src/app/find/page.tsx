"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { PARTNERS, Region, Faggruppe, PartnerProfile } from "@/lib/data";
import { THEMES, ThemeId } from "@/lib/themes";
import { useTheme } from "@/components/ThemeProvider";
import { DenmarkMap } from "@/components/DenmarkMap";

const COVER_IMAGES = [
  "/campaigns/sommerhus-family.jpg",
  "/campaigns/sommerhus-dusk.jpg",
  "/campaigns/sommerhus-lock-pov.jpg",
  "/campaigns/sommerhus-family_wide.jpg",
];

const FAGGRUPPER: Array<"Alle" | Faggruppe> = ["Alle", "Låsesmed", "Tømrer", "Elektriker", "VVS", "Maler", "Ejendomsservice", "Murer"];
const REGIONS: Array<"Alle" | Region> = ["Alle", "Nordsjælland", "Vestkysten", "Bornholm", "Lolland-Falster", "Hovedstaden", "Østjylland", "Nordjylland", "Fyn"];

/** Faggruppe icons (Tabler-style outline SVGs) */
const FAG_ICONS: Record<Faggruppe, string> = {
  "Låsesmed":         "M12 11V7a4 4 0 118 0M8 11h12v10H8zM14 16v2",
  "Tømrer":           "M4 21L20 5M14 5l5 5M9 7L7 9M3 21h6l3-3",
  "Elektriker":       "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  "Maler":            "M3 7h12V3H3zM15 5h6v6h-6zM12 11v4l-3 6h6l-3-6",
  "VVS":              "M9 21V11a3 3 0 016 0v10M9 11H4V3h16v8h-5M9 15h6",
  "Ejendomsservice":  "M3 12l9-9 9 9M5 10v10h14V10",
  "Murer":            "M3 7h7v4H3zM10 11h7v4h-7zM3 11h7v4H3zM10 7h7v4h-7zM3 15h7v4H3zM10 15h7v4h-7z",
};

function coverFor(p: PartnerProfile, idx: number): string {
  // Prefer the partner's own cover photo (trade-scene from data layer)
  if (p.coverImage) return p.coverImage;
  // Fallback to themed sommerhus stock
  if (p.faggruppe === "Låsesmed") return COVER_IMAGES[2];
  if (p.faggruppe === "Tømrer" || p.faggruppe === "Murer") return COVER_IMAGES[0];
  if (p.faggruppe === "VVS" || p.faggruppe === "Ejendomsservice") return COVER_IMAGES[1];
  return COVER_IMAGES[idx % COVER_IMAGES.length];
}

export default function FindPartnerPage() {
  const { theme: globalTheme } = useTheme();
  const [tema, setTema] = useState<ThemeId | "Alle">(globalTheme.id);
  const [postnr, setPostnr] = useState("");
  const [fag, setFag] = useState<"Alle" | Faggruppe>("Alle");
  const [region, setRegion] = useState<"Alle" | Region>("Alle");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<"naer" | "rating" | "sager">("naer");

  const filtered = useMemo(() => {
    const r = PARTNERS.filter((p) => {
      if (fag !== "Alle" && p.faggruppe !== fag) return false;
      if (region !== "Alle" && p.region !== region) return false;
      if (postnr && !p.postnr.startsWith(postnr.trim())) return false;
      return true;
    });
    if (sort === "rating") r.sort((a, b) => b.rating - a.rating);
    if (sort === "sager")  r.sort((a, b) => b.antalSager - a.antalSager);
    return r;
  }, [fag, region, postnr, sort]);

  function toggleFav(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="animate-in">
      {/* ─── HERO + STICKY SEARCH ─────────────────────────────── */}
      <section className="surface-parchment">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-12 lg:py-16">
          <div className="t-eyebrow">Find en partner</div>
          <h1 className="t-display mt-3 max-w-[820px]">
            Lokal håndværker.
            <br />
            <span className="text-[var(--ink-3)]">Godkendt af Carl Ras.</span>
          </h1>
          <p className="t-body-lg mt-4 max-w-[560px]">
            Certificerede specialister i hele Danmark. Sammenlign, gem favoritter, kontakt direkte.
          </p>

          {/* Trust strip */}
          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[var(--ink-2)]">
            <TrustItem>{PARTNERS.length}+ certificerede partnere</TrustItem>
            <TrustItem>Svar inden 24 timer</TrustItem>
            <TrustItem>Gratis at bruge</TrustItem>
            <TrustItem>Lokalt forankret</TrustItem>
          </ul>
        </div>
      </section>

      {/* Sticky search + faggruppe-chips strip */}
      <div className="sticky top-[143px] z-20 bg-white/95 backdrop-blur-md border-y border-[var(--line-2)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-3">
          {/* Search bar */}
          <form onSubmit={(e) => e.preventDefault()} className="bg-[var(--canvas)] rounded-full border border-[var(--line)] shadow-[0_4px_16px_rgba(0,26,51,0.04)] flex items-center divide-x divide-[var(--line-2)] hover:shadow-[0_6px_20px_rgba(0,26,51,0.08)] transition-shadow">
            <SearchField label="Hvad" className="rounded-l-full">
              <select value={tema} onChange={(e) => setTema(e.target.value as ThemeId | "Alle")} className="search-select">
                <option value="Alle">Alle opgaver</option>
                {THEMES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </SearchField>
            <SearchField label="Hvem">
              <select value={fag} onChange={(e) => setFag(e.target.value as "Alle" | Faggruppe)} className="search-select">
                {FAGGRUPPER.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </SearchField>
            <SearchField label="Region">
              <select value={region} onChange={(e) => setRegion(e.target.value as "Alle" | Region)} className="search-select">
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </SearchField>
            <SearchField label="Postnr">
              <input
                type="text"
                value={postnr}
                onChange={(e) => setPostnr(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                placeholder="3100"
                className="search-input"
                inputMode="numeric"
              />
            </SearchField>
            <div className="pl-2 pr-2 py-2">
              <button type="submit" className="size-12 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-press)] text-white grid place-items-center transition-colors" aria-label="Søg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              </button>
            </div>
          </form>

          <style>{`
            .search-select, .search-input { background: transparent; outline: none; border: none; font-size: 14px; font-weight: 500; width: 100%; color: var(--ink); cursor: pointer; }
            .search-select { padding-right: 18px; }
            .search-input { font-weight: 500; cursor: text; }
            .search-input::placeholder { color: var(--ink-4); font-weight: 400; }
          `}</style>

          {/* Faggruppe icon strip — Airbnb category style */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 -mx-2 px-2">
            <button
              onClick={() => setFag("Alle")}
              className={"flex flex-col items-center gap-1 px-3 py-2 rounded-lg shrink-0 transition-colors " +
                (fag === "Alle" ? "border-b-2 border-[var(--ink)] text-[var(--ink)]" : "border-b-2 border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]")}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18"/></svg>
              <span className="text-[12px] font-medium whitespace-nowrap">Alle</span>
            </button>
            {(FAGGRUPPER.filter((f) => f !== "Alle") as Faggruppe[]).map((f) => (
              <button
                key={f}
                onClick={() => setFag(f)}
                className={"flex flex-col items-center gap-1 px-3 py-2 rounded-lg shrink-0 transition-colors " +
                  (fag === f ? "border-b-2 border-[var(--ink)] text-[var(--ink)]" : "border-b-2 border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={FAG_ICONS[f]} />
                </svg>
                <span className="text-[12px] font-medium whitespace-nowrap">{f}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
          <div>
            <h2 className="t-h2">{filtered.length} partnere matcher</h2>
            <p className="t-caption mt-1">Carl Ras-certificerede · {region === "Alle" ? "hele Danmark" : region}</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[12px] text-[var(--ink-3)]">Sortér</label>
            <select value={sort} onChange={(e) => setSort(e.target.value as "naer" | "rating" | "sager")} className="text-[13px] bg-[var(--canvas-2)] border border-transparent hover:border-[var(--line)] rounded-full px-3 py-1.5 outline-none">
              <option value="naer">Nærmeste</option>
              <option value="rating">Højeste rating</option>
              <option value="sager">Flest sager</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Gallery grid */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {filtered.map((p, idx) => (
              <PartnerCard
                key={p.id}
                partner={p}
                cover={coverFor(p, idx)}
                isFav={favorites.has(p.id)}
                onToggleFav={() => toggleFav(p.id)}
              />
            ))}
          </div>

          {/* Right rail — sticky map */}
          <aside className="lg:sticky lg:top-[280px] self-start space-y-4">
            <div className="card !p-3">
              <DenmarkMap partners={filtered} selectedRegion={region} />
            </div>

            <div className="card !p-5">
              <div className="t-eyebrow !text-[var(--accent)]">Sådan virker det</div>
              <ol className="mt-3 space-y-3 text-[13px] text-[var(--ink-2)] leading-[1.5]">
                <li className="flex gap-3">
                  <span className="size-5 shrink-0 rounded-full bg-[var(--accent)] text-white grid place-items-center text-[12px] font-semibold">1</span>
                  Filtrér på opgave, faggruppe og lokation.
                </li>
                <li className="flex gap-3">
                  <span className="size-5 shrink-0 rounded-full bg-[var(--accent)] text-white grid place-items-center text-[12px] font-semibold">2</span>
                  Klik en partner og send en kort beskrivelse.
                </li>
                <li className="flex gap-3">
                  <span className="size-5 shrink-0 rounded-full bg-[var(--accent)] text-white grid place-items-center text-[12px] font-semibold">3</span>
                  Partneren kontakter dig — typisk inden for 24 timer.
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

/* ─── helpers ─── */

function SearchField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={"flex-1 min-w-0 px-5 py-2.5 hover:bg-[var(--canvas-2)] transition-colors cursor-pointer " + (className ?? "")}>
      <span className="block text-[12px] font-semibold text-[var(--ink)]">{label}</span>
      <div className="mt-0.5 truncate text-[var(--ink-2)]">{children}</div>
    </label>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 14 14" className="text-[var(--accent)]" aria-hidden="true">
        <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>{children}</span>
    </li>
  );
}

function tierClass(tier: "Bronze" | "Sølv" | "Guld") {
  const map = { Bronze: "tag tag-bronze", Sølv: "tag tag-soelv", Guld: "tag tag-guld" } as const;
  return map[tier];
}

function PartnerCard({ partner, cover, isFav, onToggleFav }: { partner: PartnerProfile; cover: string; isFav: boolean; onToggleFav: () => void }) {
  return (
    <Link
      href={`/find/${partner.id}`}
      className="group block bg-[var(--canvas)] rounded-[var(--r-xl)] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-3)]"
    >
      {/* Hero photo */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          className="absolute inset-0 size-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]"
        />
        {/* Subtle bottom gradient for legibility */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.05) 35%, transparent 60%)" }} />

        {/* Tier chip top-left */}
        <span className={tierClass(partner.tier) + " absolute top-3 left-3 backdrop-blur-md bg-white/90"}>{partner.tier}</span>

        {/* Favorite heart top-right */}
        <button
          onClick={(e) => { e.preventDefault(); onToggleFav(); }}
          className="absolute top-3 right-3 size-9 rounded-full grid place-items-center transition-all hover:scale-110"
          style={{
            background: isFav ? "white" : "rgba(0,0,0,0.32)",
            backdropFilter: "blur(10px)",
          }}
          aria-label={isFav ? "Fjern fra favoritter" : "Tilføj til favoritter"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "#E30613" : "none"} stroke={isFav ? "#E30613" : "white"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>

        {/* Logo monogram bottom-left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="size-9 rounded-lg grid place-items-center text-white font-semibold text-[12px] shadow-md" style={{ background: partner.logoBg }}>
            {partner.initialer}
          </div>
          <div className="text-white text-[12px] uppercase tracking-wider font-semibold drop-shadow">
            ✓ Carl Ras certificeret
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-[var(--ink)] leading-tight truncate group-hover:text-[var(--accent)] transition-colors">
            {partner.firma}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star /> <span className="text-[13px] font-semibold tabular-nums">{partner.rating}</span>
            <span className="text-[12px] text-[var(--ink-3)]">({partner.antalSager})</span>
          </div>
        </div>
        <div className="text-[13px] text-[var(--ink-3)] mt-0.5 truncate">{partner.faggruppe} · {partner.by} ({partner.postnr})</div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {partner.specialer.slice(0, 2).map((s) => (
            <span key={s} className="text-[12px] px-2 py-0.5 rounded-md bg-[var(--canvas-2)] text-[var(--ink-2)]">{s}</span>
          ))}
          {partner.specialer.length > 2 && (
            <span className="text-[12px] px-2 py-0.5 text-[var(--ink-3)]">+{partner.specialer.length - 2}</span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-[var(--line-2)] flex items-center justify-between">
          <span className="text-[12px] text-[var(--ink-3)]">Partner siden {partner.medlemSiden.split(" ")[1] ?? partner.medlemSiden}</span>
          <span className="text-[13px] font-semibold text-[var(--accent)]">Se profil →</span>
        </div>
      </div>
    </Link>
  );
}

function Star() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#1D1D1F" aria-hidden="true">
      <path d="M12 2l3 6 6 1-4.5 4.5L18 21l-6-3.5L6 21l1.5-7.5L3 9l6-1z" />
    </svg>
  );
}
