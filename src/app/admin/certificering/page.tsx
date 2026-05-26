"use client";
import { CERTS_HELD, CERTS_AVAILABLE } from "@/lib/data";
import { THEMES } from "@/lib/themes";
import { useApp } from "@/components/AppState";

export default function AdminCertificering() {
  const { pushToast } = useApp();
  const all = [...CERTS_HELD.map((c) => c.cert), ...CERTS_AVAILABLE.map((c) => c.cert)];

  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>CERTIFICERING · ADMINISTRATION</div>
      <h1 className="t-display-lg mt-3 text-[var(--cr-navy-deep)]">Certificeringsprogrammer</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Hvert program er en tema-koblet motor til partner-progression. Niveau 1 åbner Sølv, Niveau 2 åbner Guld.
      </p>

      <div className="mt-8 flex gap-2">
        <button onClick={() => pushToast("Nyt certificeringsprogram…")} className="pill pill-primary">+ Nyt program</button>
        <button onClick={() => pushToast("Tilmeldte eksporteres…")} className="pill pill-light">Eksportér tilmeldte</button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {all.map((c) => {
          const tema = c.tema ? THEMES.find((t) => t.id === c.tema) : null;
          return (
            <div key={c.id} className="card">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl grid place-items-center text-3xl shrink-0" style={{ background: tema?.accentSoft ?? "var(--surface-pearl)" }}>
                  {c.ikon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-[var(--ink-muted-48)]">{c.niveau} · {c.moduler} moduler · {c.varighed}</div>
                  <div className="t-body-strong mt-1 text-[var(--cr-navy-deep)]">{c.titel}</div>
                  <div className="t-caption">{c.udsteder}</div>
                  <p className="text-[13px] text-[var(--ink-muted-80)] mt-2 line-clamp-2">{c.beskrivelse}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-[var(--surface-pearl)] rounded-lg p-2">
                  <div className="text-[11px] text-[var(--ink-muted-48)]">Tilmeldte</div>
                  <div className="text-[16px] font-semibold text-[var(--cr-navy-deep)]">{8 + Math.floor(Math.random() * 18)}</div>
                </div>
                <div className="bg-[var(--surface-pearl)] rounded-lg p-2">
                  <div className="text-[11px] text-[var(--ink-muted-48)]">Færdige</div>
                  <div className="text-[16px] font-semibold text-[var(--cr-navy-deep)]">{4 + Math.floor(Math.random() * 8)}</div>
                </div>
                <div className="bg-[var(--surface-pearl)] rounded-lg p-2">
                  <div className="text-[11px] text-[var(--ink-muted-48)]">Gns. score</div>
                  <div className="text-[16px] font-semibold text-[var(--cr-navy-deep)]">{(85 + Math.random() * 10).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
