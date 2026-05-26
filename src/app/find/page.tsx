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
      // tema gating — låsesmed/elektriker fit sommer-sikring; tømrer/VVS fit vinter-byg
      if (tema === "sommer-sikring" && !["Låsesmed", "Elektriker", "Ejendomsservice"].includes(p.faggruppe) && fag === "Alle") return true; // keep all when no faggruppe selected
      return true;
    });
  }, [fag, region, postnr, tema]);

  const themeMeta = tema === "Alle" ? null : THEMES.find((t) => t.id === tema);

  return (
    <div>
      {/* Hero search builder */}
      <section
        className="border-b border-[var(--hairline)]"
        style={{ background: themeMeta ? `linear-gradient(180deg, ${themeMeta.accentSoft}66 0%, white 100%)` : "var(--surface-pearl)" }}
      >
        <div className="mx-auto max-w-[1280px] px-6 py-14">
          <div className="t-tagline" style={{ color: themeMeta?.accentInk ?? "var(--cr-blue)" }}>
            FIND EN PARTNER · CARL RAS CERTIFICERET
          </div>
          <h1 className="text-[44px] font-semibold leading-tight tracking-tight text-[var(--cr-navy-deep)] mt-3 max-w-[820px]">
            Find lokal håndværker. <span className="text-[var(--ink-muted-48)]">Godkendt af Carl Ras.</span>
          </h1>
          <p className="text-[17px] text-[var(--ink-muted-80)] mt-3 max-w-[640px]">
            Vores partnere er certificerede specialister i deres lokalområde. Vælg hvad du har brug for,
            indtast dit postnummer, og find den nærmeste.
          </p>

          {/* Search builder */}
          <div className="mt-8 card !p-2 max-w-[1000px]">
            <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_140px_auto] items-stretch">
              <Field label="Hvad har du brug for?">
                <select value={tema} onChange={(e) => setTema(e.target.value as ThemeId | "Alle")} className="field-control">
                  <option value="Alle">Alle opgaver</option>
                  {THEMES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="Faggruppe">
                <select value={fag} onChange={(e) => setFag(e.target.value as "Alle" | Faggruppe)} className="field-control">
                  {FAGGRUPPER.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Region">
                <select value={region} onChange={(e) => setRegion(e.target.value as "Alle" | Region)} className="field-control">
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Postnummer">
                <input
                  type="text"
                  value={postnr}
                  onChange={(e) => setPostnr(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                  placeholder="3100"
                  className="field-control"
                />
              </Field>
              <div className="flex items-end">
                <button className="pill pill-primary w-full justify-center !py-3">Find partner</button>
              </div>
            </div>
            <style>{`
              .field-control { width: 100%; padding: 10px 12px; border-radius: 12px; background: var(--surface-pearl); font-size: 14px; outline: none; border: 1px solid transparent; transition: all 160ms ease; }
              .field-control:focus { background: white; border-color: var(--cr-blue); }
            `}</style>
          </div>
        </div>
      </section>

      {/* Map + results */}
      <section className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[20px] font-semibold text-[var(--cr-navy-deep)]">{filtered.length} partnere matcher</h2>
              <span className="text-[13px] text-[var(--ink-muted-48)]">Sorteret efter nærmeste</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/find/${p.id}`}
                  className="card hover:shadow-[0_10px_30px_rgba(0,45,89,0.08)] transition-shadow block"
                >
                  <div className="flex items-start gap-3">
                    <div className="size-12 rounded-xl grid place-items-center text-white font-semibold text-[14px] shrink-0" style={{ background: p.logoBg }}>
                      {p.initialer}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-semibold text-[var(--cr-navy-deep)]">{p.firma}</span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: p.tier === "Guld" ? "#FFF4D6" : p.tier === "Sølv" ? "#F1F3F5" : "#FBE9DC", color: p.tier === "Guld" ? "#7A5300" : p.tier === "Sølv" ? "#52595E" : "#7A3F12" }}
                        >
                          {p.tier}
                        </span>
                      </div>
                      <div className="text-[12px] text-[var(--ink-muted-48)]">{p.faggruppe} · {p.by} ({p.postnr})</div>
                    </div>
                  </div>
                  <p className="text-[13px] text-[var(--ink-muted-80)] mt-3 line-clamp-2">{p.beskrivelse}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.specialer.slice(0, 3).map((s) => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--cr-blue-tint)] text-[var(--cr-navy)]">{s}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[12px]">
                    <span className="text-[var(--ink-muted-48)]">★ {p.rating} · {p.antalSager} sager</span>
                    <span className="font-semibold text-[var(--cr-blue)]">Se profil →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-6 self-start">
            <div className="card !p-3">
              <DenmarkMap partners={filtered} selectedRegion={region} />
            </div>

            <div className="card !p-5 mt-4">
              <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>HVORDAN VIRKER DET?</div>
              <ol className="mt-3 space-y-3 text-[13px] text-[var(--ink-muted-80)]">
                <li className="flex gap-3"><span className="size-5 shrink-0 rounded-full bg-[var(--cr-blue)] text-white grid place-items-center text-[11px] font-semibold">1</span>Vælg opgave, faggruppe og lokation.</li>
                <li className="flex gap-3"><span className="size-5 shrink-0 rounded-full bg-[var(--cr-blue)] text-white grid place-items-center text-[11px] font-semibold">2</span>Vælg partner og send en kort beskrivelse.</li>
                <li className="flex gap-3"><span className="size-5 shrink-0 rounded-full bg-[var(--cr-blue)] text-white grid place-items-center text-[11px] font-semibold">3</span>Partneren kontakter dig direkte — typisk inden for 24 timer.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block bg-[var(--surface-pearl)] rounded-2xl p-3">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted-48)]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
