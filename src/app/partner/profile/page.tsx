"use client";
import { useState } from "react";
import Link from "next/link";
import { CURRENT_PARTNER, Region, salesFor } from "@/lib/data";
import { useApp } from "@/components/AppState";
import { PageHeader } from "@/components/PageHeader";

/* Region-mapped Unsplash cover photos — same map as /find and /find/[partnerId]
   so the partner's preview here matches exactly what customers see. */
const REGION_COVER_IDS: Record<Region, string> = {
  "Nordsjælland":    "mDceqGnb8Ps",
  "Hovedstaden":     "PAMKahnLhd0",
  "Vestkysten":      "DR6SFVhkZtI",
  "Bornholm":        "jcRIu_D1dfs",
  "Lolland-Falster": "kJv05ClK57k",
  "Fyn":             "x8dgFTYbGOw",
  "Østjylland":      "imLsDPLnr7Y",
  "Nordjylland":     "WlQg8uCFVu0",
};

/* Deterministic 8-digit CVR — same derivation as the find profile so the
   number shown here matches the public listing exactly. */
function deriveCVR(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i);
  const seven = Math.abs(h % 9_000_000) + 1_000_000;
  return `${(Math.abs(h) % 8) + 2}${seven}`;
}

export default function PartnerProfilePage() {
  const { pushToast } = useApp();
  const sales = salesFor(CURRENT_PARTNER.id);

  // Mock-editable fields. Local state only; "Gem ændringer" just shows a toast.
  const [firma,       setFirma]       = useState(CURRENT_PARTNER.firma);
  const [ejer,        setEjer]        = useState(CURRENT_PARTNER.ejer);
  const [telefon,     setTelefon]     = useState(CURRENT_PARTNER.telefon);
  const [email,       setEmail]       = useState(CURRENT_PARTNER.email);
  const [webadresse,  setWebadresse]  = useState(CURRENT_PARTNER.webadresse);
  const [beskrivelse, setBeskrivelse] = useState(CURRENT_PARTNER.beskrivelse);
  const [specialer,   setSpecialer]   = useState<string[]>(CURRENT_PARTNER.specialer);
  const [newSpec,     setNewSpec]     = useState("");

  // Public-profile fields that mirror /find/[partnerId]. Locally editable
  // so the partner can manage what customers see. Initial values match the
  // deterministic defaults that the public page synthesizes.
  const [gade,         setGade]         = useState("Hovedgade 23");
  const [hoursMonFri,  setHoursMonFri]  = useState("07:00 – 17:00");
  const [hoursLor,     setHoursLor]     = useState("09:00 – 13:00");
  const [hoursSon,     setHoursSon]     = useState("Lukket");
  const [vagttelefon,  setVagttelefon]  = useState("Ja, akut udrykning udenfor åbningstid");

  const coverId = REGION_COVER_IDS[CURRENT_PARTNER.region];
  const coverUrl = `https://images.unsplash.com/photo-${coverId}?auto=format&fit=crop&w=1200&q=80`;
  const cvr = deriveCVR(CURRENT_PARTNER.id);

  function addSpec() {
    const t = newSpec.trim();
    if (!t) return;
    if (specialer.includes(t)) { pushToast("Speciale findes allerede"); return; }
    setSpecialer((prev) => [...prev, t]);
    setNewSpec("");
  }

  function removeSpec(s: string) {
    setSpecialer((prev) => prev.filter((x) => x !== s));
  }

  function save() {
    pushToast("Profil opdateret (demo)", "success");
  }

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in min-h-[calc(100vh-48px)]">
      <PageHeader
        eyebrow="Min konto"
        title="Profil"
        lead="Sådan ser din forretning ud for Carl Ras og — vigtigst — for sommerhusejere der finder dig på carl-ras.dk."
        actions={
          <>
            <button onClick={save} className="btn btn-primary">Gem ændringer</button>
          </>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* LEFT — editable form */}
        <div className="space-y-5">
          {/* OFFENTLIG PROFIL — mirrors carl-ras.dk/find/[partnerId] so the
              partner can manage exactly what customers see. Sits at the top
              because it's the highest-value section (drives leads). */}
          <section className="card">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="text-[15px] font-semibold text-[var(--ink)]">Offentlig profil</div>
                <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Sådan ser kunderne dig på carl-ras.dk/find</div>
              </div>
              <Link
                href={`/find/${CURRENT_PARTNER.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--accent)] hover:underline shrink-0 mt-0.5"
              >
                Se offentlig profil
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l10-10M7 7h10v10"/></svg>
              </Link>
            </div>

            {/* Cover photo preview + change. Currently region-mapped (auto),
                with an upload hint for the future. */}
            <div className="mb-5">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-2">Coverbillede</label>
              <div className="relative aspect-[16/6] rounded-lg overflow-hidden bg-[var(--canvas-2)] border border-[var(--line-2)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverUrl} alt="" className="absolute inset-0 size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-2 left-3 text-white text-[11px] font-semibold tracking-wide drop-shadow">
                  {CURRENT_PARTNER.by} · {CURRENT_PARTNER.region}
                </div>
                <button
                  onClick={() => pushToast("Cover-upload kommer snart")}
                  className="absolute top-2 right-2 inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur text-[var(--ink)] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-white transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l9-5 9 5M3 16l9 5 9-5"/></svg>
                  Skift coverbillede
                </button>
              </div>
              <div className="text-[11.5px] text-[var(--ink-3)] mt-2">
                Vi viser et regionsspecifikt billede som standard. Upload dit eget for at vise lokal forankring — fx en arbejdsscene fra et nyligt projekt.
              </div>
            </div>

            {/* Owner portrait */}
            <div className="mb-5">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-2">Portræt af ejer / kontaktperson</label>
              <div className="flex items-center gap-4">
                {CURRENT_PARTNER.ejerPortrait ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={CURRENT_PARTNER.ejerPortrait}
                    alt={CURRENT_PARTNER.ejer}
                    className="size-16 rounded-2xl object-cover ring-2 ring-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                  />
                ) : (
                  <div className="size-16 rounded-2xl grid place-items-center text-white font-semibold text-[20px]" style={{ background: CURRENT_PARTNER.logoBg }}>
                    {CURRENT_PARTNER.initialer}
                  </div>
                )}
                <button
                  onClick={() => pushToast("Portræt-upload kommer snart")}
                  className="btn btn-secondary !py-1.5"
                >
                  Skift portræt
                </button>
              </div>
              <div className="text-[11.5px] text-[var(--ink-3)] mt-2">
                Et tydeligt ansigt skaber tillid. Brug et nyt foto i godt lys, ikke et logo.
              </div>
            </div>

            {/* Address row */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_1fr] gap-4 mb-4">
              <Field label="Gadeadresse" value={gade} onChange={setGade} />
              <Field label="Postnr" value={CURRENT_PARTNER.postnr} onChange={() => undefined} disabled />
              <Field label="By" value={CURRENT_PARTNER.by} onChange={() => undefined} disabled />
            </div>
            <div className="text-[11.5px] text-[var(--ink-3)] -mt-1 mb-5 flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/></svg>
              Adressen vises offentligt med link til Google Maps.
            </div>

            {/* CVR — read-only, sourced from CVR-registret */}
            <div className="mb-5">
              <Field label="CVR (fra Virk.dk)" value={cvr} onChange={() => undefined} disabled />
              <div className="text-[11.5px] text-[var(--ink-3)] mt-1.5">
                Hentes automatisk fra Virk.dk når du bliver godkendt af Carl Ras.
              </div>
            </div>

            {/* Opening hours */}
            <div>
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-2">Åbningstider</label>
              <div className="space-y-2">
                <HoursField day="Mandag – fredag" value={hoursMonFri} onChange={setHoursMonFri} />
                <HoursField day="Lørdag" value={hoursLor} onChange={setHoursLor} />
                <HoursField day="Søndag" value={hoursSon} onChange={setHoursSon} />
              </div>
              <div className="mt-3">
                <Field label="Vagttelefon (akut udrykning)" value={vagttelefon} onChange={setVagttelefon} />
              </div>
            </div>
          </section>

          {/* Identity */}
          <section className="card">
            <SectionHeader title="Forretningen" hint="Vises på din /find-profil og i co-brandede ad-materialer" />
            <div className="flex items-center gap-4 mb-5">
              <div
                className="size-16 rounded-2xl grid place-items-center text-white font-semibold text-[20px] shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                style={{ background: CURRENT_PARTNER.logoBg }}
              >
                {CURRENT_PARTNER.initialer}
              </div>
              <div>
                <button
                  onClick={() => pushToast("Logo-upload kommer snart")}
                  className="btn btn-secondary !py-1.5"
                >
                  Skift logo
                </button>
                <div className="text-[12px] text-[var(--ink-3)] mt-1.5">
                  PNG eller SVG · maks 2 MB
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Firma" value={firma} onChange={setFirma} />
              <Field label="Ejer / kontaktperson" value={ejer} onChange={setEjer} />
            </div>

            <div className="mt-4">
              <Field label="Beskrivelse" value={beskrivelse} onChange={setBeskrivelse} multiline />
            </div>
          </section>

          {/* Contact */}
          <section className="card">
            <SectionHeader title="Kontakt" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Telefon" value={telefon} onChange={setTelefon} />
              <Field label="Email" value={email} onChange={setEmail} type="email" />
              <Field label="Webadresse" value={webadresse} onChange={setWebadresse} />
              <Field label="By · region" value={`${CURRENT_PARTNER.by}, ${CURRENT_PARTNER.region}`} onChange={() => undefined} disabled />
            </div>
            <div className="mt-3 text-[12px] text-[var(--ink-3)] flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/></svg>
              Region kan kun ændres af Carl Ras Drift — kontakt din specialist.
            </div>
          </section>

          {/* Faggruppe + specialer */}
          <section className="card">
            <SectionHeader title="Faggruppe & specialer" hint="Bruges af kunder til at finde dig på /find" />
            <Field label="Faggruppe" value={CURRENT_PARTNER.faggruppe} onChange={() => undefined} disabled />
            <div className="mt-4">
              <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-2">Specialer</div>
              <div className="flex flex-wrap gap-2 mb-2.5">
                {specialer.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full bg-[var(--accent-tint)] text-[var(--accent-press)]"
                  >
                    {s}
                    <button onClick={() => removeSpec(s)} className="opacity-60 hover:opacity-100" aria-label={`Fjern ${s}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpec}
                  onChange={(e) => setNewSpec(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpec(); } }}
                  placeholder="Tilføj speciale (fx Smart Lock-installation)"
                  className="field !text-[13px] flex-1"
                />
                <button onClick={addSpec} className="btn btn-secondary !py-2" disabled={!newSpec.trim()}>
                  Tilføj
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT — stat panel + program badge */}
        <aside className="space-y-4 self-start lg:sticky lg:top-[72px]">
          <section className="card">
            <div className="t-eyebrow mb-3">Dit partner-niveau</div>
            <div className="flex items-center gap-3">
              <TierBadge tier={CURRENT_PARTNER.tier} large />
              <div>
                <div className="text-[20px] font-semibold text-[var(--ink)] leading-none">{CURRENT_PARTNER.tier}-partner</div>
                <div className="text-[11.5px] text-[var(--ink-3)] mt-1">siden {CURRENT_PARTNER.medlemSiden}</div>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-baseline justify-between text-[11.5px] mb-1.5">
                <span className="text-[var(--ink-2)] font-medium tabular-nums">{CURRENT_PARTNER.points.toLocaleString("da-DK")} <span className="text-[var(--ink-3)] font-normal">point</span></span>
                <span className="text-[var(--ink-3)] tabular-nums">{Math.max(0, CURRENT_PARTNER.pointsTilNæste - CURRENT_PARTNER.points)} til Guld</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--canvas-2)] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: Math.round((CURRENT_PARTNER.points / CURRENT_PARTNER.pointsTilNæste) * 100) + "%", background: "linear-gradient(90deg, var(--accent), var(--accent-press))" }} />
              </div>
            </div>
          </section>

          <section className="card">
            <div className="t-eyebrow mb-3">Performance · 12 mdr</div>
            <ul className="space-y-2.5 text-[12.5px]">
              <li className="flex items-baseline justify-between">
                <span className="text-[var(--ink-3)]">Omsætning</span>
                <span className="font-semibold text-[var(--ink)] tabular-nums">{sales.omsætning12mo.toLocaleString("da-DK", { maximumFractionDigits: 0 })} kr</span>
              </li>
              <li className="flex items-baseline justify-between">
                <span className="text-[var(--ink-3)]">Antal sager</span>
                <span className="font-semibold text-[var(--ink)] tabular-nums">{CURRENT_PARTNER.antalSager}</span>
              </li>
              <li className="flex items-baseline justify-between">
                <span className="text-[var(--ink-3)]">Kundetilfredshed</span>
                <span className="font-semibold text-[var(--ink)] tabular-nums">{CURRENT_PARTNER.rating} ★</span>
              </li>
            </ul>
          </section>

          <section className="card !p-4 bg-[var(--canvas-2)] !border-0">
            <div className="t-eyebrow !text-[12px]">Tip</div>
            <p className="text-[12px] text-[var(--ink-2)] mt-1.5 leading-[1.5]">
              Specialer og beskrivelse opdaterer din /find-profil i realtid. Detaljer bygger tillid hos kunderne.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* =====================================================================
   Small primitives
   ===================================================================== */

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4">
      <div className="text-[15px] font-semibold text-[var(--ink)]">{title}</div>
      {hint && <div className="text-[11.5px] text-[var(--ink-3)] mt-1">{hint}</div>}
    </div>
  );
}

function Field({ label, value, onChange, multiline = false, disabled = false, type = "text" }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; disabled?: boolean; type?: string }) {
  return (
    <div>
      <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          disabled={disabled}
          className="field !text-[13.5px] resize-y leading-[1.5] disabled:opacity-60"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="field !text-[13.5px] disabled:opacity-60"
        />
      )}
    </div>
  );
}

function HoursField({ day, value, onChange }: { day: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-[var(--ink-2)] w-[140px] shrink-0">{day}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field !text-[13px] !py-1.5 flex-1"
        placeholder="07:00 – 17:00 eller Lukket"
      />
    </div>
  );
}

function TierBadge({ tier, large = false }: { tier: "Bronze" | "Sølv" | "Guld"; large?: boolean }) {
  const color = tier === "Guld" ? "#C99A20" : tier === "Sølv" ? "#7E8993" : "#9C6A3F";
  const size = large ? 28 : 14;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className="shrink-0">
      <path d="M12 2l3 6 6 1-4.5 4.5L18 21l-6-3.5L6 21l1.5-7.5L3 9l6-1z" />
    </svg>
  );
}
