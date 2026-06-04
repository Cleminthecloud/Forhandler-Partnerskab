"use client";
import { useState, useMemo, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { PARTNERS, Region, Faggruppe, PartnerProfile } from "@/lib/data";
import { THEMES, ThemeId } from "@/lib/themes";
import { useTheme } from "@/components/ThemeProvider";
import { DenmarkMap } from "@/components/DenmarkMap";

/* Region-mapped local cover photos — matches /find/[partnerId] hero so the
   listing thumbnail equals the profile cover. Local sommerhus images,
   licensed for our use, always loads. */
const REGION_COVER: Record<Region, string> = {
  "Nordsjælland":    "/campaigns/sommerhus-family_wide.jpg",
  "Hovedstaden":     "/campaigns/sommerhus-family.jpg",
  "Vestkysten":      "/campaigns/sommerhus-dusk.jpg",
  "Bornholm":        "/campaigns/sommerhus-dusk.jpg",
  "Lolland-Falster": "/campaigns/sommerhus-family.jpg",
  "Fyn":             "/campaigns/sommerhus-family_wide.jpg",
  "Østjylland":      "/campaigns/sommerhus-family_wide.jpg",
  "Nordjylland":     "/campaigns/sommerhus-lock-pov.jpg",
};

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

function coverFor(p: PartnerProfile): string {
  // Region-mapped local sommerhus photo — same source map as /find/[id]
  // so the listing thumbnail equals the profile hero for each partner.
  return REGION_COVER[p.region];
}

export default function FindPartnerPage() {
  const { theme: globalTheme } = useTheme();
  const [tema, setTema] = useState<ThemeId | "Alle">(globalTheme.id);
  const [postnr, setPostnr] = useState("");
  const [fag, setFag] = useState<"Alle" | Faggruppe>("Alle");
  const [region, setRegion] = useState<"Alle" | Region>("Alle");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<"naer" | "rating" | "sager">("naer");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Sticky search bar condenses (smaller padding, faggruppe strip
  // compresses) once the user scrolls past the hero. Apple/Linear pattern:
  // gives the bar a "wake-up" feel and reclaims real estate. Driven by an
  // IntersectionObserver on a sentinel element just below the hero so we
  // don't read window.scrollY on every event.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [condensed, setCondensed] = useState(false);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { rootMargin: "0px 0px -80% 0px" } // fires when sentinel is near the viewport top
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Lock background scroll while the Airbnb-style search modal is open.
  // Without this, the page underneath scrolls when you swipe inside the
  // modal — and Safari can also momentarily reveal the CarlRasHeader at
  // the top because the body keeps tracking touch.
  useEffect(() => {
    if (!mobileSearchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mobileSearchOpen]);

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

  // Filter signature — used as part of each card's React key so the cards
  // unmount + remount when filters change, re-firing the card-rise-in
  // entrance animation. Cheap to compute, 4 string concats.
  const filterSig = `${tema}-${fag}-${region}-${postnr}-${sort}`;

  // Faggruppe tab items — shared by both mobile + desktop strips so the
  // sliding underline (FagTabStrip) has a single source of truth.
  const fagTabItems: FagTabItem[] = [
    {
      id: "Alle",
      label: "Alle",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18" />
        </svg>
      ),
    },
    ...(FAGGRUPPER.filter((f) => f !== "Alle") as Faggruppe[]).map<FagTabItem>((f) => ({
      id: f,
      label: f,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={FAG_ICONS[f]} />
        </svg>
      ),
    })),
  ];

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
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-7 sm:py-12 lg:py-16">
          <div className="t-eyebrow">Find en partner</div>
          <h1 className="t-display mt-3 max-w-[820px]">
            Lokal håndværker.
            <br />
            <span className="text-[var(--ink-3)]">Anbefalet af Carl Ras.</span>
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

      {/* Sentinel — when this scrolls out of the viewport (i.e. user has
          scrolled past the hero), the sticky search bar condenses. */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* MOBILE: Airbnb-style search trigger — single pill that opens a
          full-screen modal with the Hvad/Hvor/Hvem filters. Replaces the
          5-column form below which won't fit on a phone. NOT sticky on
          mobile because the CarlRasHeader above is already tall (~218px)
          and stacking another sticky layer was overlapping the hero text. */}
      <div className="md:hidden bg-white border-b border-[var(--line-2)] px-4 py-3">
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="w-full flex items-center gap-3 bg-white rounded-full border border-[var(--line)] shadow-[0_4px_16px_rgba(0,26,51,0.06)] px-4 py-3 text-left"
          style={{ minHeight: 56 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--ink-2)] shrink-0">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-[var(--ink)] leading-tight">
              {fag === "Alle" && region === "Alle" && !postnr ? "Find en partner" : "Filtrer søgning"}
            </div>
            <div className="text-[12.5px] text-[var(--ink-3)] leading-tight mt-0.5 truncate">
              {[
                fag === "Alle" ? "Alle faggrupper" : fag,
                region === "Alle" ? "Hele Danmark" : region,
                postnr ? `Postnr ${postnr}` : null,
              ].filter(Boolean).join(" · ")}
            </div>
          </div>
          <span className="size-9 rounded-full bg-[var(--accent)] grid place-items-center text-white shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </button>

        {/* Faggruppe icon strip — mobile. Sliding-underline tab pattern
            via FagTabStrip. */}
        <FagTabStrip
          items={fagTabItems}
          activeId={fag}
          onChange={(id) => setFag(id as "Alle" | Faggruppe)}
          className="mt-3 scrollbar-hidden"
        />
      </div>

      {/* MOBILE: Airbnb-style full-screen search modal */}
      {mobileSearchOpen && (
        <FindSearchModal
          tema={tema} setTema={setTema}
          fag={fag} setFag={setFag}
          region={region} setRegion={setRegion}
          postnr={postnr} setPostnr={setPostnr}
          matches={filtered.length}
          onClose={() => setMobileSearchOpen(false)}
        />
      )}

      {/* Sticky search + faggruppe-chips strip — DESKTOP ONLY now */}
      {/* Sticky search + faggruppe chips — pins to top-0 now that the
          CarlRasHeader scrolls away (sticky={false} in /find layout).
          One single sticky surface, no stacked stickies, no jump.

          Condense behavior: when the user scrolls past the hero, the
          outer padding tightens and the faggruppe strip compresses, so
          the bar reclaims ~30px of vertical real estate. Transitions
          ease over 280ms — Apple-style chrome that wakes up on scroll. */}
      <div
        className={
          "hidden md:block sticky top-0 z-20 bg-white/95 backdrop-blur-md border-y border-[var(--line-2)] shadow-[0_2px_8px_rgba(0,26,51,0.04)] " +
          (condensed ? "find-sticky-condensed" : "")
        }
        style={{
          transition: "padding 280ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          className="mx-auto max-w-[1440px] px-6 lg:px-10"
          style={{
            paddingTop: condensed ? 8 : 12,
            paddingBottom: condensed ? 6 : 12,
            transition: "padding 280ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
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

          {/* Faggruppe icon strip — desktop. Sliding-underline pattern
              via FagTabStrip — shared component, one source of truth.
              When the bar is condensed (scrolled past hero), the strip
              compresses: icons shrink, padding tightens. Layout direction
              stays flex-col throughout so no hard reflow mid-animation. */}
          <div
            style={{
              // Stays flex-col, just tightens — no overflow:hidden so the
              // underline can't get clipped during the transition.
              marginTop: condensed ? 4 : 12,
              transition: "margin-top 280ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <FagTabStrip
              items={fagTabItems}
              activeId={fag}
              onChange={(id) => setFag(id as "Alle" | Faggruppe)}
              compact={condensed}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
          <div>
            <h2 className="t-h2">
              <CountUp value={filtered.length} /> partnere matcher
            </h2>
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

        {/* Min-height on the grid prevents the document from collapsing
            when a filter narrows results to 1–2 cards. Without this, the
            browser auto-scrolls upward to fit the new short page and the
            user lands in an unexpected position. 65vh = enough room that
            the sticky bar always has somewhere to sit. */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] min-h-[65vh]">
          {/* Gallery grid. The filter signature is part of the key on each
              card wrapper so the cards re-mount when a filter changes — that
              re-fires the card-rise-in animation and gives the grid an
              "alive" feel instead of a static pop. Only the first 6 cards
              get staggered delay (25ms each) so large result sets don't
              stall behind the cascade and the cascade doesn't compound. */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {filtered.map((p, idx) => (
              <div
                key={`${p.id}__${filterSig}`}
                className="card-rise-in"
                style={{ animationDelay: idx < 6 ? `${idx * 25}ms` : "0ms" }}
              >
                <PartnerCard
                  partner={p}
                  cover={coverFor(p)}
                  isFav={favorites.has(p.id)}
                  onToggleFav={() => toggleFav(p.id)}
                />
              </div>
            ))}
          </div>

          {/* Right rail — sticky map. Sits just under the sticky search
              strip (which is ~160px tall on desktop). +16px buffer. */}
          <aside className="lg:sticky lg:top-[176px] self-start space-y-4">
            <div className="card !p-3">
              <DenmarkMap
                partners={filtered}
                selectedRegion={region}
                onRegionClick={(r) => setRegion(r)}
              />
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
      className="group block bg-[var(--canvas)] rounded-[var(--r-xl)] overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-3)]"
      style={{
        // Apple/Linear ease-out — pairs with the rest of the app's motion.
        // Hover transition is split out so transform AND shadow ease together
        // (transition-all picks up unwanted properties like animation).
        transition:
          "transform 240ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
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

        {/* Bottom row — partner monogram + certificering badge as a single
            unified pill. Reads as one element instead of two floating items;
            keeps the card image visible on mobile where space is tighter. */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-black/55 backdrop-blur-md rounded-full pl-1 pr-3 py-1 max-w-full">
            <div className="size-7 rounded-full grid place-items-center text-white font-semibold text-[11px] shrink-0" style={{ background: partner.logoBg }}>
              {partner.initialer}
            </div>
            <div className="text-white text-[10.5px] uppercase tracking-wider font-semibold whitespace-nowrap">
              ✓ Carl Ras certificeret
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-[var(--ink)] leading-tight truncate group-hover:text-[var(--accent)] transition-colors">
            {partner.firma}
          </h3>
          <div
            className="flex items-center gap-1 shrink-0"
            aria-label={`${partner.rating} stjerner ud af 5, baseret på ${partner.antalSager} sager`}
          >
            <Star /> <span className="text-[13px] font-semibold tabular-nums" aria-hidden="true">{partner.rating}</span>
            <span className="text-[12px] text-[var(--ink-3)]" aria-hidden="true">({partner.antalSager})</span>
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

/* Faggruppe tab strip — Apple/Stripe-style sliding underline.
   ONE shared underline lives at the bottom of the strip and translateX +
   resizes to whichever tab is active. This is the "premium" tab pattern
   used by Linear, Stripe, Notion, iOS Settings.

   Implementation: each tab gets a ref via the refs Map. After render we
   measure the active tab's offsetLeft + offsetWidth (relative to the
   strip), store them in state, and the underline animates to those
   coords with cubic-bezier(.22,1,.36,1).

   The strip also debounces re-measure on window resize so the underline
   tracks correctly across viewport changes.

   The component accepts arbitrary tab data — keeps the rendering
   declarative. Used by both the mobile + desktop faggruppe strips. */
type FagTabItem = { id: string; label: string; icon: React.ReactNode };

function FagTabStrip({
  items,
  activeId,
  onChange,
  className = "",
  compact = false,
}: {
  items: FagTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  /* When true, tabs render with smaller icons and tighter padding — used
     when the parent (desktop sticky bar) condenses on scroll. */
  compact?: boolean;
}) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);

  // Measure the active tab's position relative to the strip and update
  // the underline. Re-runs on activeId/items/compact change AND tracks the
  // tab's live width via ResizeObserver — so when compact mode animates
  // padding + icon size, the underline slides smoothly with the tab
  // instead of snapping to the final position at t=0.
  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const tab = tabRefs.current.get(activeId);
      if (!strip || !tab) return;
      const stripBox = strip.getBoundingClientRect();
      const tabBox = tab.getBoundingClientRect();
      setBar({
        left: tabBox.left - stripBox.left + strip.scrollLeft,
        width: tabBox.width,
      });
    };
    // Coalesce multiple measure calls into one rAF — prevents thrash
    // when ResizeObserver fires for every tab on the same frame.
    const scheduleMeasure = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };
    measure();
    // Track the active tab's live size during the compact transition.
    // We observe ALL tabs (not just the active one) because activeId may
    // change while we're inside the effect cleanup window.
    const ro = new ResizeObserver(scheduleMeasure);
    tabRefs.current.forEach((el) => ro.observe(el));
    window.addEventListener("resize", scheduleMeasure);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [activeId, items.length, compact]);

  return (
    <div
      ref={stripRef}
      className={"relative flex items-center gap-1 overflow-x-auto pb-1 -mx-2 px-2 " + className}
    >
      {items.map((it) => {
        const active = it.id === activeId;
        return (
          <button
            key={it.id}
            ref={(el) => {
              if (el) tabRefs.current.set(it.id, el);
              else tabRefs.current.delete(it.id);
            }}
            onClick={() => onChange(it.id)}
            aria-pressed={active}
            // NB: flex-direction stays `flex-col` regardless of compact mode.
            // Swapping flex-col → flex-row mid-animation caused jitter (Tailwind
            // utility-class swaps can't be CSS-transitioned). Now compact only
            // tightens padding + icon size via inline style — all transitionable.
            className={
              "relative flex flex-col items-center gap-1 px-3 shrink-0 transition-colors duration-200 " +
              (active ? "text-[var(--accent)]" : "text-[var(--ink-3)] hover:text-[var(--ink)]")
            }
            style={{
              paddingTop: compact ? 4 : 8,
              paddingBottom: compact ? 6 : 10,
              transition:
                "padding-top 280ms cubic-bezier(0.22, 1, 0.36, 1), padding-bottom 280ms cubic-bezier(0.22, 1, 0.36, 1), color 200ms ease-out",
            }}
          >
            <span
              style={{
                width: compact ? 18 : 22,
                height: compact ? 18 : 22,
                display: "inline-flex",
                transition:
                  "width 280ms cubic-bezier(0.22, 1, 0.36, 1), height 280ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {it.icon}
            </span>
            <span className="font-medium whitespace-nowrap text-[12px]">{it.label}</span>
          </button>
        );
      })}

      {/* Shared sliding underline. Sits at bottom of the strip; only one
          element, so the animation is a smooth slide between tabs rather
          than a fade-in/out per tab. Width auto-shrinks to the active
          tab. The 0 width fallback (before first measure) keeps it
          invisible so it doesn't flash at left:0. */}
      <span
        aria-hidden="true"
        className="absolute bottom-1 h-[2px] rounded-full bg-[var(--accent)] pointer-events-none"
        style={{
          left: 0,
          // 12px inset on each side matches the px-3 padding of each tab —
          // underline visually aligns with the icon+label, not the full
          // tab hitbox.
          transform: bar ? `translateX(${bar.left + 12}px)` : "translateX(0)",
          width: bar ? bar.width - 24 : 0,
          opacity: bar ? 1 : 0,
          transition:
            "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), width 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease-out",
        }}
      />
    </div>
  );
}

/* ─── CountUp — animated number tick for the result count ────────────────
   When `value` changes, briefly renders the .count-bump animation so the
   eye catches the change. Cheap, no JS animation loop — pure CSS
   triggered by React key. */
function CountUp({ value }: { value: number }) {
  return (
    <span key={value} className="count-bump tabular-nums">{value}</span>
  );
}

function Star() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#1D1D1F" aria-hidden="true">
      <path d="M12 2l3 6 6 1-4.5 4.5L18 21l-6-3.5L6 21l1.5-7.5L3 9l6-1z" />
    </svg>
  );
}

/* ─── FindSearchModal — Airbnb-style step-by-step search ───────────────
   Replaces the previous "one tall scroll" with the Airbnb pattern: three
   stacked cards (Hvor → Hvad → Hvem). One card expanded at a time, the
   others collapse to a short row showing the current value (or "Tilføj X"
   if blank). Sticky top header (back + title + close). Sticky bottom bar
   with "Ryd alt" link + accent "Søg" button showing match count.

   Skip controls: each expanded card has a "Spring over" underline link
   alongside the "Næste" button — no field is required, every step can
   be passed through to the bottom Søg button.

   Touch targets ≥44pt. 100dvh root. Background is light gray so the
   white cards stand out — same elevation pattern as the screenshots. */
function FindSearchModal({
  tema, setTema, fag, setFag, region, setRegion, postnr, setPostnr,
  matches, onClose,
}: {
  tema: ThemeId | "Alle";
  setTema: (v: ThemeId | "Alle") => void;
  fag: "Alle" | Faggruppe;
  setFag: (v: "Alle" | Faggruppe) => void;
  region: "Alle" | Region;
  setRegion: (v: "Alle" | Region) => void;
  postnr: string;
  setPostnr: (v: string) => void;
  matches: number;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"hvor" | "hvad" | "hvem">("hvor");

  // Collapsed-card summary lines. Empty selection shows a soft "Tilføj X"
  // hint — the affordance Airbnb uses ("Add dates", "Add guests") to
  // suggest the field is optional and tappable.
  const hvorValue = (() => {
    const parts: string[] = [];
    if (region !== "Alle") parts.push(region);
    if (postnr) parts.push(`${postnr}`);
    return parts.length ? parts.join(" · ") : "Tilføj område";
  })();
  const hvadValue =
    tema === "Alle" ? "Tilføj opgave" : (THEMES.find((t) => t.id === tema)?.label ?? "Tilføj opgave");
  const hvemValue = fag === "Alle" ? "Tilføj faggruppe" : fag;

  function clearAll() {
    setTema("Alle"); setFag("Alle"); setRegion("Alle"); setPostnr("");
    setStep("hvor");
  }

  return (
    <div
      className="md:hidden fixed inset-0 z-[70] bg-[#F5F5F7] flex flex-col"
      style={{ height: "100dvh" }}
      role="dialog"
      aria-modal="true"
      aria-label="Find en partner"
    >
      {/* ─── Sticky header — back + title + circular close ─── */}
      <header className="shrink-0 bg-white border-b border-[var(--line-2)]" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="flex items-center justify-between h-[56px] px-3">
          <button
            onClick={onClose}
            aria-label="Tilbage"
            className="size-11 grid place-items-center rounded-full -ml-1 active:bg-[var(--canvas-2)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="font-semibold text-[var(--ink)]" style={{ fontSize: 15 }}>Find en partner</div>
          <button
            onClick={onClose}
            aria-label="Luk"
            className="size-11 grid place-items-center rounded-full border border-[var(--line)] -mr-1 active:bg-[var(--canvas-2)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* ─── Stacked step cards — one expanded, others collapsed ─── */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-5 flex flex-col gap-2.5">
        {/* STEP 1 — HVOR */}
        <StepCard
          isActive={step === "hvor"}
          onActivate={() => setStep("hvor")}
          label="Hvor"
          valueIfCollapsed={hvorValue}
          expandedTitle="Hvor søger du?"
          expandedSubtitle="Vælg en region — eller spring over for hele Danmark."
        >
          <div className="grid grid-cols-2 gap-2">
            {REGIONS.map((r) => (
              <FilterChip
                key={r}
                active={region === r}
                onClick={() => setRegion(r)}
                label={r === "Alle" ? "Hele Danmark" : r}
              />
            ))}
          </div>
          <label className="block mt-4">
            <span className="text-[var(--ink-3)] font-semibold uppercase tracking-wider" style={{ fontSize: 11 }}>Postnummer (valgfrit)</span>
            <input
              type="text"
              value={postnr}
              onChange={(e) => setPostnr(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
              placeholder="Fx 3100"
              inputMode="numeric"
              className="w-full mt-1.5 bg-[var(--canvas-2)] border border-transparent rounded-[var(--r-md)] focus:bg-white focus:border-[var(--accent)] outline-none transition-colors"
              style={{ minHeight: 52, paddingInline: 14, fontSize: 16 }}
            />
          </label>
          <StepFooter
            onSkip={() => { setRegion("Alle"); setPostnr(""); setStep("hvad"); }}
            onNext={() => setStep("hvad")}
          />
        </StepCard>

        {/* STEP 2 — HVAD */}
        <StepCard
          isActive={step === "hvad"}
          onActivate={() => setStep("hvad")}
          label="Hvad"
          valueIfCollapsed={hvadValue}
          expandedTitle="Hvad leder du efter?"
          expandedSubtitle="Vælg et tema — eller spring over for hele sortimentet."
        >
          <div className="grid grid-cols-2 gap-2">
            <FilterChip
              active={tema === "Alle"}
              onClick={() => setTema("Alle")}
              label="Alle opgaver"
              subtitle="Hele sortimentet"
            />
            {THEMES.map((t) => (
              <FilterChip
                key={t.id}
                active={tema === t.id}
                onClick={() => setTema(t.id)}
                label={t.label}
                subtitle={t.bu}
                accent={t.accent}
              />
            ))}
          </div>
          <StepFooter
            onSkip={() => { setTema("Alle"); setStep("hvem"); }}
            onNext={() => setStep("hvem")}
          />
        </StepCard>

        {/* STEP 3 — HVEM */}
        <StepCard
          isActive={step === "hvem"}
          onActivate={() => setStep("hvem")}
          label="Hvem"
          valueIfCollapsed={hvemValue}
          expandedTitle="Hvilken faggruppe?"
          expandedSubtitle="Vælg den faggruppe der passer din opgave."
        >
          <div className="grid grid-cols-2 gap-2">
            {FAGGRUPPER.map((f) => (
              <FilterChip
                key={f}
                active={fag === f}
                onClick={() => setFag(f)}
                label={f === "Alle" ? "Alle faggrupper" : f}
              />
            ))}
          </div>
          {/* Last step has no "Næste" — the bottom Søg button is the final action.
              Skip still available for symmetry. */}
          <div className="mt-5 flex items-center">
            <button
              onClick={() => setFag("Alle")}
              className="text-[14px] font-semibold underline text-[var(--ink-2)]"
              style={{ minHeight: 44, paddingInline: 4 }}
            >
              Spring over
            </button>
          </div>
        </StepCard>
      </div>

      {/* ─── Sticky bottom — Ryd alt + Søg with match count ─── */}
      <footer
        className="shrink-0 bg-white border-t border-[var(--line-2)] flex items-center justify-between gap-3 px-4"
        style={{ paddingBlock: 12, paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}
      >
        <button
          onClick={clearAll}
          className="text-[14px] font-semibold underline text-[var(--ink-2)]"
          style={{ minHeight: 44, paddingInline: 4 }}
        >
          Ryd alt
        </button>
        <button
          onClick={onClose}
          className="flex-1 max-w-[260px] bg-[var(--accent)] text-white font-semibold rounded-full active:scale-[0.98] hover:bg-[var(--accent-press)] transition-all inline-flex items-center justify-center gap-2"
          style={{ minHeight: 52, fontSize: 15 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          Søg ({matches})
        </button>
      </footer>
    </div>
  );
}

/* StepCard — collapsed pill row OR expanded full content card.
   Only one card is "active" at a time. Tap a collapsed card to expand
   it (parent rolls the others into pills). */
function StepCard({
  isActive, onActivate, label, valueIfCollapsed, expandedTitle, expandedSubtitle, children,
}: {
  isActive: boolean;
  onActivate: () => void;
  label: string;
  valueIfCollapsed: string;
  expandedTitle: string;
  expandedSubtitle?: string;
  children: React.ReactNode;
}) {
  if (!isActive) {
    return (
      <button
        onClick={onActivate}
        className="w-full bg-white rounded-[16px] px-5 flex items-center justify-between text-left active:scale-[0.99] transition-transform shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        style={{ minHeight: 60, paddingBlock: 16 }}
      >
        <span className="font-semibold text-[var(--ink)]" style={{ fontSize: 14 }}>{label}</span>
        <span className="text-[var(--ink-3)] truncate ml-3" style={{ fontSize: 14, maxWidth: "60%" }}>{valueIfCollapsed}</span>
      </button>
    );
  }
  return (
    <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <h3 className="font-bold text-[var(--ink)] tracking-tight" style={{ fontSize: 22, letterSpacing: "-0.01em" }}>{expandedTitle}</h3>
      {expandedSubtitle && (
        <p className="text-[var(--ink-3)] mt-1" style={{ fontSize: 13.5 }}>{expandedSubtitle}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

/* StepFooter — the "Spring over | Næste" row at the bottom of each
   expanded card (except the last step which uses the bottom Søg). */
function StepFooter({ onSkip, onNext }: { onSkip: () => void; onNext: () => void }) {
  return (
    <div className="mt-5 flex items-center justify-between">
      <button
        onClick={onSkip}
        className="text-[14px] font-semibold underline text-[var(--ink-2)]"
        style={{ minHeight: 44, paddingInline: 4 }}
      >
        Spring over
      </button>
      <button
        onClick={onNext}
        className="bg-[var(--ink)] text-white font-semibold rounded-full inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
        style={{ minHeight: 46, paddingInline: 22, fontSize: 15 }}
      >
        Næste
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

function FilterChip({ active, onClick, label, subtitle, accent }: { active: boolean; onClick: () => void; label: string; subtitle?: string; accent?: string }) {
  return (
    <button
      onClick={onClick}
      className={
        "relative text-left rounded-[var(--r-md)] border-2 transition-all active:scale-[0.98] " +
        (active
          ? "border-[var(--ink)] bg-[var(--ink)] text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          : "border-[var(--line)] bg-white hover:border-[var(--ink-3)]")
      }
      style={{ minHeight: 64, padding: "12px 14px" }}
    >
      {/* Checkmark badge in the corner of the active chip — unmistakable signal */}
      {active && (
        <span className="absolute top-1.5 right-1.5 size-5 rounded-full bg-white grid place-items-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      <div className="flex items-center gap-2">
        {accent && <span className={"size-2 rounded-full shrink-0 " + (active ? "ring-1 ring-white/40" : "")} style={{ background: accent }} />}
        <span className={"font-semibold " + (active ? "text-white" : "text-[var(--ink)]")} style={{ fontSize: "clamp(13px, 3.6vw, 14px)" }}>{label}</span>
      </div>
      {subtitle && <div className={"mt-0.5 " + (active ? "text-white/80" : "text-[var(--ink-3)]")} style={{ fontSize: "clamp(11.5px, 3vw, 12.5px)" }}>{subtitle}</div>}
    </button>
  );
}
