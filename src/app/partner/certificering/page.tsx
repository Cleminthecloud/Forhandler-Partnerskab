"use client";
import { useState } from "react";
import { useApp } from "@/components/AppState";
import {
  CERTS_HELD,
  CERTS_AVAILABLE,
  curriculumFor,
  type Certification,
  type CertModule,
} from "@/lib/data";
import { THEMES } from "@/lib/themes";
import { PageHeader } from "@/components/PageHeader";
import { Icon, type IconName } from "@/components/Icon";

const FORMAT_ICON: Record<string, IconName> = {
  "E-learning":    "play",
  "Online":        "play",
  "Workshop":      "users",
  "Hjemmeopgave":  "book-open",
  "Eksamen":       "graduation-cap",
};

type OpenCert =
  | { kind: "held";      cert: Certification; opnået: string; gyldigTil: string }
  | { kind: "available"; cert: Certification; modulerFærdige: number };

export default function CertificeringPage() {
  const { pushToast } = useApp();
  const [open, setOpen] = useState<OpenCert | null>(null);

  return (
    <div className="px-6 lg:px-10 xl:px-12 py-10 lg:py-12 animate-in space-y-10 lg:space-y-12">
      <PageHeader
        eyebrow="Uddannelse · Certificering"
        title="Certificeringer"
        lead="Hvert certifikat åbner et produktsortiment for dig og giver kunderne dokumentation på din ekspertise. Klik et certifikat for at se moduler, eksamen og dit næste skridt."
      />

      {/* Mine certificeringer */}
      <section>
        <div className="flex items-baseline gap-3 mb-5">
          <h2 className="text-[20px] font-semibold text-[var(--ink)]">Mine certificeringer</h2>
          <span className="text-[13px] text-[var(--ink-3)]">{CERTS_HELD.length} aktive</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {CERTS_HELD.map((h) => (
            <HeldCard key={h.cert.id} cert={h.cert} opnået={h.opnået} gyldigTil={h.gyldigTil} onOpen={() => setOpen({ kind: "held", ...h })} />
          ))}
        </div>
      </section>

      {/* Næste skridt */}
      <section>
        <div className="flex items-baseline gap-3 mb-5">
          <h2 className="text-[20px] font-semibold text-[var(--ink)]">Næste skridt</h2>
          <span className="text-[13px] text-[var(--ink-3)]">Klar at tage</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {CERTS_AVAILABLE.map((a) => (
            <AvailableCard
              key={a.cert.id}
              cert={a.cert}
              modulerFærdige={a.modulerFærdige}
              onOpen={() => setOpen({ kind: "available", ...a })}
            />
          ))}
        </div>
      </section>

      {open && (
        <CertDrawer
          openCert={open}
          onClose={() => setOpen(null)}
          pushToast={pushToast}
        />
      )}
    </div>
  );
}

/* ─────────────────────────── Cards ─────────────────────────── */

function HeldCard({ cert, opnået, gyldigTil, onOpen }: { cert: Certification; opnået: string; gyldigTil: string; onOpen: () => void }) {
  const tema = cert.tema ? THEMES.find((t) => t.id === cert.tema) : null;
  return (
    <button onClick={onOpen} className="card card-hover text-left w-full">
      <div className="flex items-start gap-4">
        <div className="size-12 rounded-2xl grid place-items-center text-[var(--ink)] shrink-0" style={{ background: tema?.accentSoft ?? "var(--canvas-2)" }}>
          <Icon name={cert.niveau === "Specialist" ? "shield" : "graduation-cap"} size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1" style={{ background: "#EAF1DC", color: "#324A14" }}>
              <Icon name="check" size={11} /> Opnået
            </span>
            <span className="text-[12px] text-[var(--ink-3)]">{cert.niveau}</span>
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--ink)] leading-tight">{cert.titel}</h3>
          <div className="text-[12px] text-[var(--ink-3)] mt-1">{cert.udsteder} · {cert.moduler} moduler · {cert.varighed}</div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[var(--line-2)] flex items-center justify-between text-[12px]">
        <span className="text-[var(--ink-3)]">Opnået <strong className="text-[var(--ink-2)] font-semibold">{opnået}</strong></span>
        <span className="text-[var(--ink-3)]">Gyldig til <strong className="text-[var(--ink-2)] font-semibold">{gyldigTil}</strong></span>
      </div>
    </button>
  );
}

function AvailableCard({ cert, modulerFærdige, onOpen }: { cert: Certification; modulerFærdige: number; onOpen: () => void }) {
  const tema = cert.tema ? THEMES.find((t) => t.id === cert.tema) : null;
  const pct = Math.round((modulerFærdige / cert.moduler) * 100);
  const started = modulerFærdige > 0;
  return (
    <button onClick={onOpen} className="card card-hover text-left w-full flex flex-col">
      <div className="flex items-start gap-4">
        <div className="size-12 rounded-2xl grid place-items-center text-[var(--ink)] shrink-0" style={{ background: tema?.accentSoft ?? "var(--canvas-2)" }}>
          <Icon name={cert.niveau === "Specialist" ? "shield" : "graduation-cap"} size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[12px] text-[var(--ink-3)] font-semibold uppercase tracking-wider">{cert.niveau}</span>
            {tema && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: tema.accentSoft, color: tema.accentInk }}>
                {tema.label}
              </span>
            )}
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--ink)] leading-tight">{cert.titel}</h3>
          <div className="text-[12px] text-[var(--ink-3)] mt-1">{cert.udsteder} · {cert.moduler} moduler · {cert.varighed}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--line-2)]">
        <div className="flex items-baseline justify-between text-[12px] mb-1.5">
          <span className="text-[var(--ink-3)]">{started ? `Modul ${modulerFærdige} af ${cert.moduler}` : "Ikke startet"}</span>
          <span className="text-[var(--ink-2)] font-semibold tabular-nums">{pct}%</span>
        </div>
        <div className="h-[6px] rounded-full bg-[var(--canvas-2)] overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: tema?.accent ?? "var(--accent)" }} />
        </div>
        <div className="mt-3 text-[12px] font-semibold text-[var(--accent-press)] inline-flex items-center gap-1">
          {started ? "Fortsæt forløb" : "Se moduler"} <Icon name="chevron-right" size={13} />
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────── Detail drawer ─────────────────────────── */

function CertDrawer({
  openCert,
  onClose,
  pushToast,
}: {
  openCert: OpenCert;
  onClose: () => void;
  pushToast: (text: string, kind?: "info" | "success") => void;
}) {
  const cert = openCert.cert;
  const curriculum = curriculumFor(cert.id);
  const tema = cert.tema ? THEMES.find((t) => t.id === cert.tema) : null;
  const isHeld = openCert.kind === "held";
  const modulerFærdige = openCert.kind === "available" ? openCert.modulerFærdige : cert.moduler;
  const pct = Math.round((modulerFærdige / cert.moduler) * 100);

  return (
    <div className="fixed inset-0 z-50 animate-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <aside
        className="absolute top-[48px] right-0 bottom-0 w-[960px] max-w-[96vw] bg-white border-l border-[var(--line-2)] shadow-[var(--shadow-3)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideInRight 280ms cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* Thin accent strip */}
        <div className="h-1 shrink-0" style={{ background: tema?.accent ?? "var(--accent)" }} />

        {/* Hero */}
        <div className="px-8 pt-7 pb-6 border-b border-[var(--line-2)] flex items-start gap-4 shrink-0">
          <div className="size-14 rounded-2xl grid place-items-center shrink-0 text-[var(--ink)]" style={{ background: tema?.accentSoft ?? "var(--canvas-2)" }}>
            <Icon name={cert.niveau === "Specialist" ? "shield" : "graduation-cap"} size={26} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              {isHeld ? (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1" style={{ background: "#EAF1DC", color: "#324A14" }}>
                  <Icon name="check" size={11} /> Opnået
                </span>
              ) : (
                <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{cert.niveau}</span>
              )}
              <span className="text-[12px] text-[var(--ink-3)]">{cert.udsteder}</span>
            </div>
            <h2 className="text-[24px] font-bold text-[var(--ink)] leading-[1.2] tracking-tight">{cert.titel}</h2>
            <div className="text-[13px] text-[var(--ink-3)] mt-1.5">{cert.moduler} moduler · {cert.varighed}</div>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-full grid place-items-center hover:bg-[var(--canvas-2)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors shrink-0"
            aria-label="Luk"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7 space-y-7">
          {/* Description */}
          <p className="t-body text-[var(--ink-2)] leading-[1.55]">{cert.beskrivelse}</p>

          {/* Progress */}
          {!isHeld && (
            <section className="rounded-[var(--r-md)] bg-[var(--canvas-2)] p-5">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[13px] font-semibold text-[var(--ink)]">Dit forløb</span>
                <span className="text-[13px] font-semibold text-[var(--ink-2)] tabular-nums">
                  Modul {modulerFærdige} af {cert.moduler} · {pct}%
                </span>
              </div>
              <div className="h-[8px] rounded-full bg-white overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: tema?.accent ?? "var(--accent)" }} />
              </div>
            </section>
          )}

          {/* Quick facts */}
          {curriculum && (
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Fact label="Forudsætninger" value={curriculum.forudsætninger.join(" + ") || "Ingen"} />
              <Fact label="Eksamen" value={curriculum.eksamenFormat} />
              <Fact label="Beståelseskrav" value={curriculum.beståelseskrav} />
              {curriculum.honorar && <Fact label="Honorar" value={curriculum.honorar} tone="ok" />}
            </section>
          )}

          {/* Curriculum */}
          {curriculum && (
            <section>
              <h3 className="t-h3 mb-3">Modul-curriculum</h3>
              <ol className="space-y-2">
                {curriculum.moduler.map((m, i) => (
                  <ModuleRow key={i} index={i} module={m} done={i < modulerFærdige} current={!isHeld && i === modulerFærdige} />
                ))}
              </ol>
            </section>
          )}

          {/* Held meta */}
          {isHeld && openCert.kind === "held" && (
            <section className="grid grid-cols-2 gap-3">
              <Fact label="Opnået" value={openCert.opnået} />
              <Fact label="Gyldig til" value={openCert.gyldigTil} />
            </section>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-8 py-5 border-t border-[var(--line-2)] bg-[var(--canvas)] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[12px] text-[var(--ink-3)]">
            {isHeld ? "Certifikatet er aktivt — fornyelse 2 mdr før udløb" : "Sølv-partnere har gratis adgang"}
          </span>
          <div className="flex gap-2">
            {isHeld ? (
              <button onClick={() => { pushToast("PDF-certifikat sendt til din email."); onClose(); }} className="btn btn-primary">
                Hent certifikat
              </button>
            ) : modulerFærdige > 0 ? (
              <button onClick={() => { pushToast(`Fortsætter ${cert.titel}`); onClose(); }} className="btn btn-primary">
                Fortsæt forløb
              </button>
            ) : (
              <button onClick={() => { pushToast(`Tilmeldt ${cert.titel}`); onClose(); }} className="btn btn-primary">
                Tilmeld dig
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

function Fact({ label, value, tone }: { label: string; value: string; tone?: "ok" }) {
  return (
    <div className="rounded-[var(--r-md)] bg-[var(--canvas-2)] p-3.5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{label}</div>
      <div className="text-[13px] mt-1 leading-snug" style={{ color: tone === "ok" ? "#2D4A0F" : "var(--ink-2)", fontWeight: tone === "ok" ? 600 : 500 }}>{value}</div>
    </div>
  );
}

function ModuleRow({ index, module: m, done, current }: { index: number; module: CertModule; done: boolean; current: boolean }) {
  const bgClass = done
    ? "border-[var(--line-2)] bg-white"
    : current
      ? "border-[var(--accent)] bg-[var(--accent-tint)]"
      : "border-[var(--line-2)] bg-white";
  return (
    <li className={`flex items-start gap-3 p-3.5 rounded-[var(--r-md)] border ${bgClass}`}>
      <div className="size-8 rounded-full grid place-items-center text-[12px] font-semibold shrink-0 tabular-nums"
           style={done
             ? { background: "#5B7F2C", color: "white" }
             : current
               ? { background: "var(--accent)", color: "white" }
               : { background: "var(--canvas-2)", color: "var(--ink-3)" }}>
        {done ? <Icon name="check" size={14} /> : index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-[var(--ink)] leading-snug">{m.titel}</div>
        <div className="text-[12px] text-[var(--ink-3)] mt-1 inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <Icon name={FORMAT_ICON[m.format] ?? "book-open"} size={11} /> {m.format}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" size={11} /> {m.varighed}
          </span>
        </div>
      </div>
      {m.format === "Eksamen" && (
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0" style={{ background: "#FDE3D3", color: "#7A2E00" }}>
          Afgørende
        </span>
      )}
    </li>
  );
}
