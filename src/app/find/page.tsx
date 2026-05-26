"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { PARTNERS, Region, Faggruppe } from "@/lib/data";
import { THEMES, ThemeId } from "@/lib/themes";
import { useTheme } from "@/components/ThemeProvider";
import { DenmarkMap } from "@/components/DenmarkMap";

const FAGGRUPPER: Array<"Alle" | Faggruppe> = ["Alle", "Låsesmed", "Tømrer", "Elektriker", "VVS", "Maler", "Ejendomsservice", "Murer"];
const REGIONS: Array<"Alle" | Region> = ["Alle", "Nordsjælland", "Vestkysten", "Bornholm", "Lolland-Falster", "Hovedstaden", "Østjylland", "Nordjylland", "Fyn"];

export default function FindPartnerPage() {
  const { theme: globalTheme } = useTheme();
  const [tema, setTema] = useState<ThemeId | "Alle">(globalTheme.id);
  const [postnr, setPostnr] = useState("");
  const [fag, setFag] = useState<"Alle" | Faggruppe>("Alle");
  const [region, setRegion] = useState<"Alle" | Region>("Alle");

  const filtered = useMemo(() => {
    return PARTNERS.filter((p) => {
      if (fag !== "Alle" && p.faggruppe !== fag) return false;
      if (region !== "Alle" && p.region !== region) return false;
      if (postnr && !p.postnr.startsWith(postnr.trim())) return false;
      return true;
    });
  }, [fag, region, postnr]);

  return (
    <div className="animate-in">
      {/* ─── HERO ──────────────────────────────────────────────────
          Single dominant headline, generous whitespace, calm.        */}
      <section className="surface-parchment hairline-b border-b">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <div className="t-eyebrow">Find en partner</div>

          <h1 className="t-display mt-3 max-w-[820px]">
            Lokal håndværker.
            <br />
            <span className="text-[var(--ink-3)]">Godkendt af Carl Ras.</span>
          </h1>

          <p className="t-body-lg mt-5 max-w-[560px]">
            Vores partnere er certificerede specialister i deres lokalområde. Vælg hvad du har brug for, og find den nærmeste.
          </p>

          {/* Search builder — single block, progressive disclosure: only essentials visible */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 bg-[var(--canvas)] rounded-[20px] p-2 shadow-[var(--shadow-2)] max-w-[920px]"
          >
            <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_110px_auto]">
              <Field label="Hvad har du brug for?">
                <select value={tema} onChange={(e) => setTema(e.target.value as ThemeId | "Alle")} className="field">
                  <option value="Alle">Alle opgaver</option>
                  {THEMES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="Faggruppe">
                <select value={fag} onChange={(e) => setFag(e.target.value as "Alle" | Faggruppe)} className="field">
                  {FAGGRUPPER.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Region">
                <select value={region} onChange={(e) => setRegion(e.target.value as "Alle" | Region)} className="field">
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Postnr">
                <input
                  type="text"
                  value={postnr}
                  onChange={(e) => setPostnr(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                  placeholder="3100"
                  className="field"
                  inputMode="numeric"
                />
              </Field>
              <button type="submit" className="btn btn-primary btn-lg !rounded-2xl !w-full md:!w-auto md:!h-auto">
                <SearchIcon />
                <span className="md:hidden lg:inline">Søg</span>
              </button>
            </div>
          </form>

          {/* Trust strip */}
          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[var(--ink-3)]">
            <TrustItem>Carl Ras-certificeret</TrustItem>
            <TrustItem>Svar inden 24 timer</TrustItem>
            <TrustItem>Lokalt forankret</TrustItem>
            <TrustItem>Gratis at bruge</TrustItem>
          </ul>
        </div>
      </section>

      {/* ─── RESULTS ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8">
          <h2 className="t-h2">{filtered.length} partnere matcher</h2>
          <span className="t-caption">Sorteret efter nærmeste</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((p) => (
              <Link
                key={p.id}
                href={`/find/${p.id}`}
                className="card card-hover block"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="size-12 rounded-xl grid place-items-center text-white font-semibold text-[14px] shrink-0" style={{ background: p.logoBg }} aria-hidden="true">
                    {p.initialer}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-semibold text-[var(--ink)]">{p.firma}</span>
                      <span className={tierClass(p.tier)}>{p.tier}</span>
                    </div>
                    <div className="text-[13px] text-[var(--ink-3)] mt-0.5">{p.faggruppe} · {p.by} ({p.postnr})</div>
                  </div>
                </div>

                <p className="text-[14px] text-[var(--ink-2)] line-clamp-2 leading-[1.5]">{p.beskrivelse}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.specialer.slice(0, 3).map((s) => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--canvas-2)] text-[var(--ink-2)]">{s}</span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--line-2)] flex items-center justify-between">
                  <span className="text-[12px] text-[var(--ink-3)] inline-flex items-center gap-2">
                    <Star /> {p.rating} · {p.antalSager} sager
                  </span>
                  <span className="text-[13px] font-semibold text-[var(--accent)]">Se profil →</span>
                </div>
              </Link>
            ))}
          </div>

          <aside className="lg:sticky lg:top-6 self-start space-y-4">
            <div className="card !p-3">
              <DenmarkMap partners={filtered} selectedRegion={region} />
            </div>

            <div className="card !p-5">
              <div className="t-eyebrow">Sådan virker det</div>
              <ol className="mt-3 space-y-3 text-[14px] text-[var(--ink-2)] leading-[1.5]">
                <li className="flex gap-3">
                  <span className="size-5 shrink-0 rounded-full bg-[var(--accent)] text-white grid place-items-center text-[11px] font-semibold">1</span>
                  Vælg opgave, faggruppe og lokation.
                </li>
                <li className="flex gap-3">
                  <span className="size-5 shrink-0 rounded-full bg-[var(--accent)] text-white grid place-items-center text-[11px] font-semibold">2</span>
                  Vælg partner og send en kort beskrivelse.
                </li>
                <li className="flex gap-3">
                  <span className="size-5 shrink-0 rounded-full bg-[var(--accent)] text-white grid place-items-center text-[11px] font-semibold">3</span>
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
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block bg-[var(--canvas-2)] rounded-[14px] px-3.5 py-2.5">
      <span className="block text-[11px] font-medium text-[var(--ink-3)]">{label}</span>
      <div className="mt-0.5 -mx-1">{children}</div>
      <style>{`
        label .field { background: transparent; padding: 4px 4px; font-size: 14px; font-weight: 500; }
        label .field:hover, label .field:focus { background: transparent; border-color: transparent; }
      `}</style>
    </label>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <CheckIcon />
      <span>{children}</span>
    </li>
  );
}

function tierClass(tier: "Bronze" | "Sølv" | "Guld") {
  const map = { Bronze: "tag tag-bronze", Sølv: "tag tag-soelv", Guld: "tag tag-guld" } as const;
  return map[tier];
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className="text-[var(--accent)]" aria-hidden="true">
      <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#C99A20" aria-hidden="true">
      <path d="M12 2l3 6 6 1-4.5 4.5L18 21l-6-3.5L6 21l1.5-7.5L3 9l6-1z" />
    </svg>
  );
}
