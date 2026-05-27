"use client";
import { useState } from "react";
import { useApp } from "@/components/AppState";
import { PageHeader } from "@/components/PageHeader";

const REGIONS = ["Nordsjælland", "Vestkysten", "Bornholm", "Nordjylland", "Østjylland", "Lolland-Falster", "Fyn", "Sønderjylland", "Online"];

export default function AdminProfilePage() {
  const { pushToast } = useApp();
  const [navn,         setNavn]         = useState("Dennis Holmberg");
  const [email,        setEmail]        = useState("dennis.holmberg@carl-ras.dk");
  const [telefon,      setTelefon]      = useState("+45 31 22 88 04");
  const [rolle,        setRolle]        = useState("Regional Sales Lead");
  const [primaryRegion, setPrimaryRegion] = useState("Nordsjælland");
  const [coverage, setCoverage] = useState<string[]>(["Nordsjælland", "Bornholm"]);
  const [bio, setBio] = useState("Følger 12 partnere på Nordkysten og Bornholm. Sikring + smart-lock specialist. Tager altid kaffen med på hjemmebesøg.");

  function toggleRegion(r: string) {
    setCoverage((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  }

  function save() {
    pushToast("Profil opdateret (demo)", "success");
  }

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in min-h-[calc(100vh-48px)]">
      <PageHeader
        eyebrow="Min konto"
        title="Profil"
        lead="Carl Ras-stamdata, rolle og region-dækning. Bruges af partnerne når de leder efter den rette specialist."
        actions={<button onClick={save} className="btn btn-primary">Gem ændringer</button>}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <section className="card">
            <div className="mb-4">
              <div className="text-[15px] font-semibold text-[var(--ink)]">Identitet</div>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div
                className="size-16 rounded-2xl grid place-items-center text-white font-semibold text-[18px] shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                style={{ background: "linear-gradient(135deg, #515154, #1D1D1F)" }}
              >
                {navn.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <button onClick={() => pushToast("Foto-upload kommer snart")} className="btn btn-secondary !py-1.5">
                Skift foto
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Navn" value={navn} onChange={setNavn} />
              <Field label="Email" value={email} onChange={setEmail} type="email" />
              <Field label="Telefon" value={telefon} onChange={setTelefon} />
              <Field label="Rolle" value={rolle} onChange={setRolle} />
            </div>
            <div className="mt-4">
              <Field label="Bio" value={bio} onChange={setBio} multiline />
              <div className="text-[12px] text-[var(--ink-3)] mt-1.5">Vises på partnerens specialist-chat side.</div>
            </div>
          </section>

          <section className="card">
            <div className="mb-4">
              <div className="text-[15px] font-semibold text-[var(--ink)]">Region-dækning</div>
              <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Partnere i disse regioner kan booke dig som specialist.</div>
            </div>

            <div>
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1.5">Primær region</label>
              <select
                value={primaryRegion}
                onChange={(e) => setPrimaryRegion(e.target.value)}
                className="field !text-[13.5px]"
              >
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="mt-5">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-2">Sekundære regioner</label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.filter((r) => r !== primaryRegion).map((r) => {
                  const sel = coverage.includes(r);
                  return (
                    <button
                      key={r}
                      onClick={() => toggleRegion(r)}
                      className={
                        "text-[12.5px] font-medium px-3 py-1.5 rounded-full border transition-colors " +
                        (sel
                          ? "bg-[var(--accent-tint)] text-[var(--accent-press)] border-[var(--accent)]"
                          : "bg-white text-[var(--ink-2)] border-[var(--line-2)] hover:border-[var(--ink-4)]")
                      }
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 self-start lg:sticky lg:top-[72px]">
          <section className="card">
            <div className="t-eyebrow mb-3">Min aktivitet · 30 dage</div>
            <ul className="space-y-2.5 text-[12.5px]">
              <li className="flex items-baseline justify-between"><span className="text-[var(--ink-3)]">Hjemmebesøg</span><span className="font-semibold text-[var(--ink)] tabular-nums">8</span></li>
              <li className="flex items-baseline justify-between"><span className="text-[var(--ink-3)]">Chat-svar</span><span className="font-semibold text-[var(--ink)] tabular-nums">142</span></li>
              <li className="flex items-baseline justify-between"><span className="text-[var(--ink-3)]">Faglige Fredage</span><span className="font-semibold text-[var(--ink)] tabular-nums">3</span></li>
              <li className="flex items-baseline justify-between"><span className="text-[var(--ink-3)]">Aktive partnere</span><span className="font-semibold text-[var(--ink)] tabular-nums">{coverage.length === 0 ? 12 : coverage.length * 8}</span></li>
            </ul>
          </section>

          <section className="card !p-4 bg-[var(--canvas-2)] !border-0">
            <div className="t-eyebrow !text-[12px]">Bio bruges</div>
            <p className="text-[12px] text-[var(--ink-2)] mt-1.5 leading-[1.5]">
              Din bio vises i specialist-listen som partnere ser i &quot;Tal med Carl Ras&quot;. Hold den menneskelig.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline = false, type = "text" }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string }) {
  return (
    <div>
      <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="field !text-[13.5px] resize-y leading-[1.5]" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="field !text-[13.5px]" />
      )}
    </div>
  );
}
