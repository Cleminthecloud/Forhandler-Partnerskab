"use client";
import { useState, useMemo } from "react";
import {
  CERTS_HELD,
  CERTS_AVAILABLE,
  PARTNERS,
  curriculumFor,
  enrollmentsFor,
  type Certification,
  type CertStage,
  type CertEnrollment,
  type PartnerProfile,
} from "@/lib/data";
import { THEMES } from "@/lib/themes";
import { useApp } from "@/components/AppState";
import { Icon, type IconName } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";

/* The flow stages in canonical order — used for both the per-cert kanban
   and the partner-progress chips. */
const STAGES: { id: CertStage; label: string; bg: string; ink: string; dot: string }[] = [
  { id: "Tilmeldt",        label: "Tilmeldt",        bg: "#ECEEF1", ink: "#4A4F55", dot: "#7E8993" },
  { id: "I gang",          label: "I gang",           bg: "#FCEFCA", ink: "#6B4A00", dot: "#C99A20" },
  { id: "Eksamen booket",  label: "Eksamen booket",   bg: "#E8F0FA", ink: "#0C447C", dot: "#1158A3" },
  { id: "Bestået",         label: "Bestået",          bg: "#E1EFD2", ink: "#2D4A0F", dot: "#5B7F2C" },
  { id: "Reprøve",         label: "Reprøve",          bg: "#FDE3D3", ink: "#7A2E00", dot: "#C2410C" },
];

const FORMAT_ICON: Record<string, IconName> = {
  "E-learning":    "play",
  "Online":        "play",
  "Workshop":      "users",
  "Hjemmeopgave":  "book-open",
  "Eksamen":       "graduation-cap",
};

function partnerById(id: string): PartnerProfile | undefined {
  return PARTNERS.find((p) => p.id === id);
}

export default function AdminCertificering() {
  const { pushToast } = useApp();
  const allCerts = useMemo(() => {
    return [...CERTS_HELD.map((c) => c.cert), ...CERTS_AVAILABLE.map((c) => c.cert)];
  }, []);
  const [openCertId, setOpenCertId] = useState<string | null>(null);

  // Aggregate KPIs
  const totalEnrollments = allCerts.reduce((sum, c) => sum + enrollmentsFor(c.id).length, 0);
  const inFlow = allCerts.reduce(
    (sum, c) => sum + enrollmentsFor(c.id).filter((e) => e.stage === "I gang" || e.stage === "Eksamen booket").length,
    0,
  );
  const beståede = allCerts.reduce(
    (sum, c) => sum + enrollmentsFor(c.id).filter((e) => e.stage === "Bestået").length,
    0,
  );

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      <PageHeader
        eyebrow="Certificering · Administration"
        title="Certificeringsprogrammer"
        lead="Hvert program er en tema-koblet motor til partner-progression. Niveau 1 åbner Sølv, Niveau 2 åbner Guld. Klik et program for at se moduler, eksamen og hvilke partnere der er i flow."
      />

      <div className="mt-6 flex flex-wrap gap-2 items-center">
        <button onClick={() => pushToast("Nyt certificeringsprogram…")} className="pill pill-primary inline-flex items-center gap-1.5"><Icon name="plus" size={12} /> Nyt program</button>
        <button onClick={() => pushToast("Tilmeldte eksporteres som CSV…")} className="pill pill-light">Eksportér tilmeldte</button>
      </div>

      {/* KPI row */}
      <section className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile label="Aktive programmer" value={allCerts.length.toString()} />
        <KpiTile label="Tilmeldte i alt" value={totalEnrollments.toString()} sub="seneste 6 mdr" />
        <KpiTile label="I flow nu" value={inFlow.toString()} sub="aktive forløb" tone="warn" />
        <KpiTile label="Beståede 2026" value={beståede.toString()} sub="årets resultat" tone="ok" />
      </section>

      {/* Cert cards */}
      <section className="mt-4 grid gap-3 md:grid-cols-2">
        {allCerts.map((c) => (
          <CertCard key={c.id} cert={c} onOpen={() => setOpenCertId(c.id)} />
        ))}
      </section>

      {openCertId && (
        <CertDetailDrawer
          cert={allCerts.find((c) => c.id === openCertId)!}
          onClose={() => setOpenCertId(null)}
          pushToast={pushToast}
        />
      )}
    </div>
  );
}

/* ─────────────────────────── Cert card ─────────────────────────── */

function CertCard({ cert, onOpen }: { cert: Certification; onOpen: () => void }) {
  const tema = cert.tema ? THEMES.find((t) => t.id === cert.tema) : null;
  const enrollments = enrollmentsFor(cert.id);
  const stageCounts = STAGES.map((s) => ({
    ...s,
    count: enrollments.filter((e) => e.stage === s.id).length,
  }));
  const total = enrollments.length;
  const passed = enrollments.filter((e) => e.stage === "Bestået").length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <button onClick={onOpen} className="card card-hover text-left w-full">
      <div className="flex items-start gap-4">
        <div className="size-12 rounded-2xl grid place-items-center shrink-0 text-[var(--cr-navy-deep)]" style={{ background: tema?.accentSoft ?? "var(--surface-pearl)" }}>
          <Icon name={cert.niveau === "Specialist" ? "shield" : "graduation-cap"} size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-[var(--ink-muted-48)]">{cert.niveau} · {cert.moduler} moduler · {cert.varighed}</div>
          <div className="t-body-strong mt-1 text-[var(--cr-navy-deep)] line-clamp-1">{cert.titel}</div>
          <div className="t-caption truncate">{cert.udsteder}</div>
          <p className="text-[12.5px] text-[var(--ink-muted-80)] mt-1.5 line-clamp-2 leading-snug">{cert.beskrivelse}</p>
        </div>
      </div>

      {/* Stage distribution */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-muted-48)]">{total} tilmeldte</span>
          <span className="text-[12px] text-[var(--ink-muted-48)]">{passRate}% bestået</span>
        </div>
        {/* Compact stage bar */}
        {total > 0 ? (
          <div className="flex h-[7px] rounded-full overflow-hidden bg-[var(--surface-pearl)]">
            {stageCounts.map((s) => s.count > 0 && (
              <div
                key={s.id}
                style={{ background: s.dot, width: `${(s.count / total) * 100}%` }}
                title={`${s.label}: ${s.count}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-[12px] text-[var(--ink-muted-48)] italic">Ingen tilmeldte endnu — programmet er klar til kampagne</div>
        )}
        {/* Chip legend */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {stageCounts.filter((s) => s.count > 0).map((s) => (
            <span key={s.id} className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.ink }}>
              <span className="size-1.5 rounded-full" style={{ background: s.dot }} />
              {s.label} · {s.count}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────── Detail drawer ─────────────────────────── */

function CertDetailDrawer({
  cert,
  onClose,
  pushToast,
}: {
  cert: Certification;
  onClose: () => void;
  pushToast: (text: string, kind?: "info" | "success") => void;
}) {
  const curriculum = curriculumFor(cert.id);
  const enrollments = enrollmentsFor(cert.id);
  const tema = cert.tema ? THEMES.find((t) => t.id === cert.tema) : null;

  const stageColumns = useMemo(() => {
    return STAGES.map((s) => ({
      ...s,
      enrollments: enrollments.filter((e) => e.stage === s.id),
    }));
  }, [enrollments]);

  return (
    <div className="fixed inset-0 z-40 animate-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      <aside
        className="absolute top-[48px] right-0 bottom-0 w-[1000px] max-w-[96vw] bg-white border-l border-[var(--line-2)] shadow-[var(--shadow-3)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thin theme-colored accent strip */}
        <div className="h-1 shrink-0" style={{ background: tema?.accent ?? "var(--accent)" }} />

        {/* Header — generous hero */}
        <div className="px-8 pt-7 pb-6 border-b border-[var(--line-2)] flex items-start gap-4 shrink-0">
          <div className="size-14 rounded-2xl grid place-items-center shrink-0 text-[var(--cr-navy-deep)]" style={{ background: tema?.accentSoft ?? "var(--surface-pearl)" }}>
            <Icon name={cert.niveau === "Specialist" ? "shield" : "graduation-cap"} size={26} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-2">
              {cert.niveau} · {cert.udsteder}
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

          {/* Quick facts */}
          {curriculum && (
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Fact label="Forudsætninger" value={curriculum.forudsætninger.join(" + ") || "Ingen"} />
              <Fact label="Eksamen" value={curriculum.eksamenFormat} />
              <Fact label="Beståelseskrav" value={curriculum.beståelseskrav} />
              {curriculum.honorar && <Fact label="Honorar" value={curriculum.honorar} tone="ok" />}
            </section>
          )}

          {/* Curriculum / module list */}
          {curriculum && (
            <section>
              <h3 className="t-h3 mb-3">Modul-curriculum</h3>
              <ol className="space-y-2">
                {curriculum.moduler.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-[var(--r-md)] border border-[var(--line-2)] hover:border-[var(--ink-3)] transition-colors">
                    <div className="size-7 rounded-full bg-[var(--canvas-2)] grid place-items-center text-[12px] font-semibold text-[var(--ink-2)] shrink-0 tabular-nums">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium text-[var(--ink)] leading-snug">{m.titel}</div>
                      <div className="text-[11.5px] text-[var(--ink-3)] mt-1 inline-flex items-center gap-2">
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
                      <span className="text-[12px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "#FDE3D3", color: "#7A2E00" }}>Afgørende</span>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Flow / kanban */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="t-h3">Partner-flow</h3>
              <span className="t-caption">{enrollments.length} partnere · {enrollments.filter((e) => e.stage === "Bestået").length} bestået</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {stageColumns.map((col) => (
                <div key={col.id} className="rounded-[var(--r-md)] bg-[var(--canvas-2)] p-2.5 min-h-[120px]">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: col.ink }}>
                      <span className="size-1.5 rounded-full" style={{ background: col.dot }} />
                      {col.label}
                    </span>
                    <span className="text-[12px] font-semibold text-[var(--ink-3)] tabular-nums">{col.enrollments.length}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {col.enrollments.map((e) => (
                      <EnrollmentCard key={e.partnerId + e.certId} enrollment={e} totalModules={cert.moduler} />
                    ))}
                    {col.enrollments.length === 0 && (
                      <li className="text-[12px] text-[var(--ink-3)] italic px-1.5 py-2">—</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTAs */}
          <section className="pt-3 border-t border-[var(--line-2)] flex flex-wrap gap-2">
            <button onClick={() => pushToast("Tilmeldingsside-link kopieret")} className="btn btn-secondary inline-flex items-center gap-1.5"><Icon name="external" size={14} /> Kopiér tilmeldings-link</button>
            <button onClick={() => pushToast("Påmindelse sendt til alle 'I gang'-partnere")} className="btn btn-secondary inline-flex items-center gap-1.5"><Icon name="send" size={14} /> Send påmindelse</button>
            <button onClick={() => pushToast(`Eksport sendt til din indbakke (${enrollments.length} partnere)`)} className="btn btn-secondary inline-flex items-center gap-1.5"><Icon name="file-text" size={14} /> Eksportér flow</button>
          </section>
        </div>
      </aside>
    </div>
  );
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

function KpiTile({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "ok" | "warn" }) {
  const sign = tone === "ok" ? "#2D4A0F" : tone === "warn" ? "#6B4A00" : "var(--ink)";
  return (
    <div className="bg-[var(--canvas)] rounded-[var(--r-lg)] border border-[var(--line)] p-5">
      <div className="text-[12px] text-[var(--ink-3)] font-medium">{label}</div>
      <div className="text-[24px] font-semibold mt-2 leading-none tabular-nums" style={{ color: sign }}>{value}</div>
      {sub && <div className="text-[12px] text-[var(--ink-3)] mt-1.5">{sub}</div>}
    </div>
  );
}

function Fact({ label, value, tone }: { label: string; value: string; tone?: "ok" }) {
  return (
    <div className="rounded-[var(--r-md)] bg-[var(--canvas-2)] p-3">
      <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{label}</div>
      <div className="text-[12.5px] mt-1 leading-snug" style={{ color: tone === "ok" ? "#2D4A0F" : "var(--ink-2)", fontWeight: tone === "ok" ? 600 : 500 }}>{value}</div>
    </div>
  );
}

function EnrollmentCard({ enrollment, totalModules }: { enrollment: CertEnrollment; totalModules: number }) {
  const partner = partnerById(enrollment.partnerId);
  if (!partner) return null;
  const pct = totalModules > 0 ? Math.round((enrollment.modulerFærdige / totalModules) * 100) : 0;

  return (
    <li className="bg-white rounded-[var(--r-sm)] border border-[var(--line-2)] p-2">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="size-6 rounded-md grid place-items-center text-white font-semibold text-[9px] shrink-0" style={{ background: partner.logoBg }}>
          {partner.initialer}
        </div>
        <span className="text-[11.5px] font-medium text-[var(--ink)] truncate flex-1">{partner.firma}</span>
      </div>
      {enrollment.stage === "I gang" && (
        <>
          <div className="flex items-baseline justify-between text-[12px] text-[var(--ink-3)] mb-1 tabular-nums">
            <span>Modul {enrollment.modulerFærdige}/{totalModules}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-[3px] bg-[var(--canvas-2)] rounded-full overflow-hidden">
            <div className="h-full" style={{ width: `${pct}%`, background: "#C99A20" }} />
          </div>
        </>
      )}
      {enrollment.stage === "Eksamen booket" && enrollment.eksamenDato && (
        <div className="text-[12px] text-[var(--ink-3)] inline-flex items-center gap-1">
          <Icon name="calendar" size={10} />
          {new Date(enrollment.eksamenDato).toLocaleDateString("da-DK", { day: "numeric", month: "short" })}
        </div>
      )}
      {enrollment.stage === "Bestået" && enrollment.score !== undefined && (
        <div className="text-[12px] inline-flex items-center gap-1 font-medium" style={{ color: "#2D4A0F" }}>
          <Icon name="check-circle" size={10} /> Score {enrollment.score}%
        </div>
      )}
      {enrollment.stage === "Reprøve" && enrollment.score !== undefined && (
        <div className="text-[12px] inline-flex items-center gap-1 font-medium" style={{ color: "#7A2E00" }}>
          <Icon name="alert-triangle" size={10} /> {enrollment.score}% · reprøve
        </div>
      )}
      {enrollment.stage === "Tilmeldt" && (
        <div className="text-[12px] text-[var(--ink-3)]">
          Startet {new Date(enrollment.startet).toLocaleDateString("da-DK", { day: "numeric", month: "short" })}
        </div>
      )}
    </li>
  );
}
