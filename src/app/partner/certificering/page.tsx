"use client";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { CERTS_HELD, CERTS_AVAILABLE } from "@/lib/data";
import { THEMES } from "@/lib/themes";

export default function CertificeringPage() {
  const { theme } = useTheme();
  const { pushToast } = useApp();

  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <div className="t-tagline" style={{ color: theme.accentInk }}>UDDANNELSE &amp; CERTIFICERING</div>
      <h1 className="t-display-lg mt-3 text-[var(--cr-navy-deep)]">Certificeringer</h1>
      <p className="t-lead mt-2 max-w-[720px]">
        Hvert certifikat åbner et produktsortiment for dig — og giver kunderne dokumentation på din
        ekspertise. Sølv-partnere har gratis adgang til Niveau 2.
      </p>

      {/* Held */}
      <section className="mt-10">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[20px] font-semibold text-[var(--cr-navy-deep)]">Mine certificeringer</h2>
          <span className="text-[13px] text-[var(--ink-muted-48)]">{CERTS_HELD.length} aktive</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {CERTS_HELD.map(({ cert, opnået, gyldigTil }) => (
            <div key={cert.id} className="card">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl grid place-items-center text-3xl bg-[var(--cr-blue-tint)] shrink-0">{cert.ikon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide bg-[#EAF1DC] text-[#324A14]">
                      ✓ Opnået
                    </span>
                    <span className="text-[11px] text-[var(--ink-muted-48)]">{cert.niveau}</span>
                  </div>
                  <div className="t-body-strong mt-1 text-[var(--cr-navy-deep)]">{cert.titel}</div>
                  <div className="t-caption">{cert.udsteder}</div>
                  <p className="text-[13px] text-[var(--ink-muted-80)] mt-2">{cert.beskrivelse}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--ink-muted-48)]">
                    <span>Opnået: <strong className="text-[var(--cr-navy-deep)]">{opnået}</strong></span>
                    <span>Gyldig til: <strong className="text-[var(--cr-navy-deep)]">{gyldigTil}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available */}
      <section className="mt-12">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[20px] font-semibold text-[var(--cr-navy-deep)]">Næste skridt</h2>
          <span className="text-[13px] text-[var(--ink-muted-48)]">Klar at tage</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {CERTS_AVAILABLE.map(({ cert, modulerFærdige }) => {
            const pct = Math.round((modulerFærdige / cert.moduler) * 100);
            const tema = cert.tema ? THEMES.find((t) => t.id === cert.tema) : null;
            const started = modulerFærdige > 0;
            return (
              <div key={cert.id} className="card flex flex-col">
                <div className="flex items-start gap-4">
                  <div className="size-14 rounded-2xl grid place-items-center text-3xl shrink-0" style={{ background: tema?.accentSoft ?? "var(--surface-pearl)" }}>
                    {cert.ikon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-[var(--ink-muted-48)]">{cert.niveau}</span>
                      {tema && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: tema.accentSoft, color: tema.accentInk }}>
                          {tema.label}
                        </span>
                      )}
                    </div>
                    <div className="t-body-strong mt-1 text-[var(--cr-navy-deep)]">{cert.titel}</div>
                    <div className="t-caption">{cert.udsteder} · {cert.moduler} moduler · {cert.varighed}</div>
                    <p className="text-[13px] text-[var(--ink-muted-80)] mt-2">{cert.beskrivelse}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted-48)] mb-1">
                      <span>{started ? `${modulerFærdige} / ${cert.moduler} moduler` : "Ikke startet"}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--divider-soft)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tema?.accent ?? "var(--cr-blue)" }} />
                    </div>
                  </div>
                  <button
                    onClick={() => pushToast(started ? `Fortsætter ${cert.titel}` : `Tilmeldt ${cert.titel}`)}
                    className="pill pill-primary shrink-0"
                  >
                    {started ? "Fortsæt" : "Start"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
