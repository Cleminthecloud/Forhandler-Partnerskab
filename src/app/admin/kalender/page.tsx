"use client";
import { EVENTS } from "@/lib/data";
import { useApp } from "@/components/AppState";

export default function AdminKalender() {
  const { pushToast } = useApp();
  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>KALENDER · ADMINISTRATION</div>
      <h1 className="t-display-lg mt-3 text-[var(--cr-navy-deep)]">Events &amp; Faglige Fredage</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Planlæg, opret, og overvåg tilmelding. Hver Faglig Fredag har en specialist som vært.
      </p>

      <div className="mt-8 flex gap-2">
        <button onClick={() => pushToast("Event-editor åbnes…")} className="pill pill-primary">+ Nyt event</button>
        <button onClick={() => pushToast("Tilmeldte eksporteres…")} className="pill pill-light">Eksportér tilmeldte</button>
      </div>

      <div className="mt-6 card !p-0 overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_140px_120px_140px_100px] gap-4 px-5 py-3 border-b border-[var(--hairline)] bg-[var(--surface-pearl)] text-[11px] uppercase tracking-wider text-[var(--ink-muted-48)] font-semibold">
          <span>Dato</span><span>Titel · vært</span><span>Type</span><span>Region</span><span>Tilmeldte</span><span></span>
        </div>
        {EVENTS.sort((a,b) => a.dato.localeCompare(b.dato)).map((e) => {
          const fill = e.tilmeldte / e.pladser;
          return (
            <div key={e.id} className="grid grid-cols-[80px_1fr_140px_120px_140px_100px] gap-4 px-5 py-4 border-b border-[var(--divider-soft)] last:border-b-0 items-center">
              <div className="text-[13px]">
                <div className="font-semibold text-[var(--cr-navy-deep)]">{new Date(e.dato).getDate()}/{new Date(e.dato).getMonth()+1}</div>
                <div className="text-[11px] text-[var(--ink-muted-48)]">{e.tid}</div>
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[var(--cr-navy-deep)] truncate">{e.titel}</div>
                <div className="text-[12px] text-[var(--ink-muted-48)] truncate">Vært: {e.vært}</div>
              </div>
              <span className="text-[13px] text-[var(--ink-muted-80)]">{e.type}</span>
              <span className="text-[13px] text-[var(--ink-muted-80)]">{e.region}</span>
              <div>
                <div className="text-[13px] font-medium text-[var(--cr-navy-deep)]">{e.tilmeldte}/{e.pladser}</div>
                <div className="h-1.5 mt-1 rounded-full bg-[var(--divider-soft)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${fill*100}%`, background: fill > 0.7 ? "#5B7F2C" : fill > 0.4 ? "#F49100" : "#E30613" }} />
                </div>
              </div>
              <button onClick={() => pushToast(`Redigerer "${e.titel}"`)} className="text-[13px] font-semibold text-[var(--cr-blue)] text-left">Åbn →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
