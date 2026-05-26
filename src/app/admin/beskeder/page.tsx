"use client";
import { useState } from "react";
import { useApp } from "@/components/AppState";
import { ADMIN_STATS } from "@/lib/data";

export default function AdminBeskeder() {
  const { pushToast } = useApp();
  const [tier, setTier] = useState<"Alle" | "Bronze" | "Sølv" | "Guld">("Sølv");
  const [region, setRegion] = useState<string>("Alle");
  const [tema, setTema] = useState<string>("Alle");
  const [subject, setSubject] = useState("Niveau 2-certificering er åben for tilmelding");
  const [body, setBody] = useState("Hej {{fornavn}},\n\nNiveau 2 Sikring-certificeringen åbner for tilmelding 1. juni. Sølv-partnere har gratis adgang. Læs mere i din portal.\n\nTina, Træningschef · Carl Ras Sikring");

  const segment = computeSegment(tier, region, tema);

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10">
      <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>TARGETED MESSAGING</div>
      <h1 className="t-display mt-3 text-[var(--cr-navy-deep)]">Send besked til en partner-segment</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Beskeder bliver pushet til partnernes inbox + email. Personalisering via flettefelter.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card">
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>BESKED</div>
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-[12px] font-semibold text-[var(--ink-muted-80)]">Emne</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-xl px-4 py-2.5 bg-[var(--surface-pearl)] text-[14px] outline-none focus:ring-2 focus:ring-[var(--cr-blue)] border border-transparent"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[var(--ink-muted-80)]">Indhold</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="mt-1 w-full rounded-xl px-4 py-2.5 bg-[var(--surface-pearl)] text-[14px] outline-none focus:ring-2 focus:ring-[var(--cr-blue)] border border-transparent font-mono"
              />
              <div className="t-caption mt-1">Flettefelter: <code>{"{{fornavn}}"}</code> <code>{"{{firma}}"}</code> <code>{"{{by}}"}</code></div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => pushToast(`Besked sendt til ${segment} partnere`)} className="pill pill-primary">Send til {segment}</button>
              <button onClick={() => pushToast("Test-besked sendt til dig")} className="pill pill-light">Send testbesked</button>
              <button onClick={() => pushToast("Gemt som kladde")} className="pill pill-light">Gem som kladde</button>
            </div>
          </div>
        </div>

        <aside className="card">
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>SEGMENT</div>
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-[12px] font-semibold text-[var(--ink-muted-80)]">Niveau</label>
              <select value={tier} onChange={(e) => setTier(e.target.value as "Alle" | "Bronze" | "Sølv" | "Guld")} className="mt-1 w-full rounded-xl px-4 py-2 bg-[var(--surface-pearl)] text-[14px] border border-transparent focus:ring-2 focus:ring-[var(--cr-blue)] outline-none">
                <option>Alle</option><option>Bronze</option><option>Sølv</option><option>Guld</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[var(--ink-muted-80)]">Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1 w-full rounded-xl px-4 py-2 bg-[var(--surface-pearl)] text-[14px] border border-transparent focus:ring-2 focus:ring-[var(--cr-blue)] outline-none">
                <option>Alle</option>{Object.keys(ADMIN_STATS.partnereByRegion).map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[var(--ink-muted-80)]">Tema-engagement</label>
              <select value={tema} onChange={(e) => setTema(e.target.value)} className="mt-1 w-full rounded-xl px-4 py-2 bg-[var(--surface-pearl)] text-[14px] border border-transparent focus:ring-2 focus:ring-[var(--cr-blue)] outline-none">
                <option>Alle</option><option>Sommerhussikring</option><option>Vinterklargøring</option>
              </select>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-[var(--cr-blue-tint)]">
              <div className="t-tagline" style={{ color: "var(--cr-navy)" }}>SEGMENT-STØRRELSE</div>
              <div className="text-[28px] font-semibold text-[var(--cr-navy-deep)] mt-1 leading-none">{segment}</div>
              <div className="t-caption mt-1">partnere matcher</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function computeSegment(tier: string, region: string, tema: string) {
  let n = 47;
  if (tier === "Sølv") n = 21;
  if (tier === "Guld") n = 8;
  if (tier === "Bronze") n = 18;
  if (region !== "Alle") n = Math.max(1, Math.round(n * 0.25));
  if (tema !== "Alle") n = Math.max(1, Math.round(n * 0.7));
  return n;
}
