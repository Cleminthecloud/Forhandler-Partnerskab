"use client";
import { useState, useEffect } from "react";
import { EVENTS, CalendarEvent, SPECIALISTS, PARTNERS, getEventDetail } from "@/lib/data";
import { useApp } from "@/components/AppState";
import { PageHeader } from "@/components/PageHeader";

/* =====================================================================
   Admin · Kalender — list of all events with click-to-open detail drawer.
   The drawer carries attendees, host specialist, agenda, and admin-side
   actions (rediger, eksportér, send påmindelse).
   ===================================================================== */

export default function AdminKalender() {
  const { pushToast } = useApp();
  const [open, setOpen] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const sorted = [...EVENTS].sort((a, b) => a.dato.localeCompare(b.dato));
  const upcoming = sorted.filter((e) => new Date(e.dato) >= new Date());
  const total = sorted.length;
  const totalAttendees = sorted.reduce((s, e) => s + e.tilmeldte, 0);
  const totalCapacity = sorted.reduce((s, e) => s + e.pladser, 0);
  const fillRate = Math.round((totalAttendees / totalCapacity) * 100);

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in min-h-[calc(100vh-48px)]">
      <PageHeader
        eyebrow="Kalender · administration"
        title="Events & Faglige Fredage"
        lead="Planlæg, opret, og overvåg tilmelding. Hver Faglig Fredag har en specialist som vært."
        actions={<>
          <button onClick={() => pushToast("Tilmeldte eksporteres…")} className="btn btn-secondary">Eksportér tilmeldte</button>
          <button onClick={() => pushToast("Event-editor åbnes…")} className="btn btn-primary">+ Nyt event</button>
        </>}
      />

      {/* KPI strip */}
      <section className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Tile label="Kommende events" value={String(upcoming.length)} delta={`${total} i alt`} />
        <Tile label="Tilmeldte (alle)"  value={totalAttendees.toString()} delta={`${fillRate}% udfyldt`} />
        <Tile label="Kapacitet"          value={totalCapacity.toString()} delta="pladser" subtle />
        <Tile label="Næste event"       value={upcoming[0] ? new Date(upcoming[0].dato).toLocaleDateString("da-DK", { day: "numeric", month: "short" }) : "—"} delta={upcoming[0]?.titel.slice(0, 28) ?? ""} />
      </section>

      {/* Table */}
      <div className="mt-6 card !p-0 overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_140px_140px_180px_80px] gap-4 px-5 py-3 border-b border-[var(--line)] bg-[var(--canvas-2)] text-[11px] uppercase tracking-wider text-[var(--ink-3)] font-semibold">
          <span>Dato</span><span>Titel · vært</span><span>Type</span><span>Region</span><span>Tilmeldte</span><span></span>
        </div>
        {sorted.map((e) => {
          const fill = e.tilmeldte / e.pladser;
          const fillColor = fill > 0.7 ? "#5B7F2C" : fill > 0.4 ? "#F49100" : "#E30613";
          return (
            <button
              key={e.id}
              onClick={() => setOpen(e)}
              className="w-full grid grid-cols-[80px_1fr_140px_140px_180px_80px] gap-4 px-5 py-4 border-b border-[var(--line-2)] last:border-b-0 items-center text-left hover:bg-[var(--canvas-2)] transition-colors"
            >
              <div className="text-[13px]">
                <div className="font-semibold text-[var(--ink)]">{new Date(e.dato).getDate()}/{new Date(e.dato).getMonth() + 1}</div>
                <div className="text-[11px] text-[var(--ink-3)]">{e.tid}</div>
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[var(--ink)] truncate">{e.titel}</div>
                <div className="text-[12px] text-[var(--ink-3)] truncate">Vært: {e.vært}</div>
              </div>
              <span className="text-[13px] text-[var(--ink-2)]">{e.type}</span>
              <span className="text-[13px] text-[var(--ink-2)]">{e.region}</span>
              <div>
                <div className="flex items-baseline justify-between text-[12.5px] mb-1">
                  <span className="font-semibold text-[var(--ink)] tabular-nums">{e.tilmeldte}/{e.pladser}</span>
                  <span className="text-[10.5px] text-[var(--ink-3)] tabular-nums">{Math.round(fill * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--canvas-2)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${fill * 100}%`, background: fillColor }} />
                </div>
              </div>
              <span className="text-[13px] font-semibold text-[var(--accent)] text-right">Åbn →</span>
            </button>
          );
        })}
      </div>

      {/* Event detail drawer */}
      {open && (
        <EventAdminDrawer event={open} onClose={() => setOpen(null)} pushToast={pushToast} />
      )}
    </div>
  );
}

/* =====================================================================
   Event detail drawer — admin view with attendees, host, agenda + actions
   ===================================================================== */

function EventAdminDrawer({ event, onClose, pushToast }: {
  event: CalendarEvent;
  onClose: () => void;
  pushToast: (text: string, kind?: "info" | "success") => void;
}) {
  const detail = getEventDetail(event.id);
  const host = SPECIALISTS.find((s) => s.navn === event.vært);
  const fill = event.tilmeldte / event.pladser;
  const fillColor = fill > 0.7 ? "#5B7F2C" : fill > 0.4 ? "#F49100" : "#E30613";
  const dateStr = new Date(event.dato).toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // Synthesize attendee list — a sample of partners that "registered" for this event,
  // deterministic from event.id so it doesn't change across renders.
  const seed = event.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const attendees = PARTNERS
    .filter((_, i) => (i * 7 + seed) % 9 < 5)   // ~55% of partners
    .slice(0, event.tilmeldte);

  return (
    <div className="fixed inset-0 z-50 animate-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <aside
        className="absolute top-[48px] right-0 bottom-0 w-[820px] max-w-[96vw] bg-white border-l border-[var(--line)] shadow-[-8px_0_24px_rgba(0,0,0,0.10)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideInRight 280ms cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* Hero header */}
        <div className="relative h-[180px] overflow-hidden shrink-0" style={{ background: detail.hero }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 70%, rgba(0,0,0,0.30) 0%, transparent 70%)" }} />
          <button onClick={onClose} className="absolute top-4 right-4 size-9 rounded-full bg-white/95 hover:bg-white text-[var(--ink)] grid place-items-center transition-colors z-10" aria-label="Luk">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider">{event.type}</span>
            <h2 className="mt-3 text-[24px] font-semibold leading-[1.1] tracking-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}>
              {event.titel}
            </h2>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 space-y-6">
          {/* Facts */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3">
            <Fact label="Dato">{dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</Fact>
            <Fact label="Tid">{event.tid} · {event.varighed}</Fact>
            <Fact label="Lokation">{event.lokation}</Fact>
            <Fact label="Region">{event.region}</Fact>
          </dl>

          {/* Attendance KPI */}
          <section className="rounded-[var(--r-md)] bg-[var(--canvas-2)] p-4">
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[var(--ink-3)] font-semibold">Tilmelding</div>
                <div className="text-[20px] font-bold text-[var(--ink)] tabular-nums mt-1">{event.tilmeldte} <span className="text-[var(--ink-3)] font-normal">/ {event.pladser} pladser</span></div>
              </div>
              <div className="text-right">
                <div className="text-[28px] font-bold tabular-nums" style={{ color: fillColor }}>{Math.round(fill * 100)}%</div>
                <div className="text-[11px] text-[var(--ink-3)]">udfyldt</div>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white overflow-hidden mt-3">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${fill * 100}%`, background: fillColor }} />
            </div>
          </section>

          {/* Host */}
          {host && (
            <section>
              <div className="t-eyebrow mb-3">Vært</div>
              <div className="flex items-center gap-3 p-3 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
                <div className="size-12 rounded-full grid place-items-center text-white font-semibold text-[14px] shrink-0" style={{ background: host.bg }}>
                  {host.initialer}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[var(--ink)]">{host.navn}</div>
                  <div className="text-[11.5px] text-[var(--ink-3)]">{host.rolle} · {host.bu}</div>
                </div>
                <button onClick={() => pushToast(`Beskedet sendt til ${host.navn.split(" ")[0]}`)} className="text-[12px] font-semibold text-[var(--accent)] hover:underline shrink-0">
                  Skriv →
                </button>
              </div>
            </section>
          )}

          {/* Description */}
          <section>
            <div className="t-eyebrow mb-3">Beskrivelse</div>
            <p className="text-[13.5px] text-[var(--ink-2)] leading-[1.55]">{event.beskrivelse}</p>
          </section>

          {/* Agenda */}
          <section>
            <div className="t-eyebrow mb-3">Program</div>
            <ol className="space-y-2">
              {detail.agenda.map((line, i) => (
                <li key={i} className="flex gap-3 text-[13px] text-[var(--ink-2)]">
                  <span className="size-1.5 mt-2 rounded-full bg-[var(--accent)] shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Attendees */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <div className="t-eyebrow">Tilmeldte partnere · {attendees.length}</div>
              <button onClick={() => pushToast(`${attendees.length} tilmeldte eksporteret som CSV`)} className="text-[11.5px] font-semibold text-[var(--accent)] hover:underline">
                Eksportér CSV
              </button>
            </div>
            {attendees.length === 0 ? (
              <div className="text-[12px] text-[var(--ink-3)] py-3">Endnu ingen tilmeldte.</div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attendees.map((p) => (
                  <li key={p.id} className="flex items-center gap-2.5 p-2.5 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
                    <div className="size-8 rounded-md grid place-items-center text-white font-semibold text-[10px] shrink-0" style={{ background: p.logoBg }}>
                      {p.initialer}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-semibold text-[var(--ink)] truncate">{p.firma}</div>
                      <div className="text-[10.5px] text-[var(--ink-3)] truncate">{p.ejer} · {p.tier}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Faktura note */}
          <section>
            <p className="text-[12.5px] p-3 rounded-[var(--r-md)] bg-[var(--accent-tint)] text-[var(--accent-press)]">
              💰 {detail.faktura}
            </p>
          </section>
        </div>

        {/* Footer actions — admin */}
        <div className="px-7 py-4 border-t border-[var(--line-2)] bg-[var(--canvas)] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[var(--ink-3)]">Event #{event.id}</span>
          <div className="flex gap-2">
            <button onClick={() => pushToast("Påmindelse sendt til alle tilmeldte")} className="btn btn-secondary !py-1.5">Send påmindelse</button>
            <button onClick={() => pushToast("Redigér event…")} className="btn btn-secondary !py-1.5">Rediger</button>
            <button onClick={() => pushToast("Aflys event?")} className="btn btn-secondary !py-1.5">Aflys</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* =====================================================================
   Small primitives
   ===================================================================== */

function Tile({ label, value, delta, subtle = false }: { label: string; value: string; delta?: string; subtle?: boolean }) {
  return (
    <div className="card">
      <div className="t-caption">{label}</div>
      <div className="text-[26px] font-semibold mt-1 leading-none text-[var(--ink)] tabular-nums">{value}</div>
      {delta && <div className={"text-[11.5px] mt-2 font-medium " + (subtle ? "text-[var(--ink-3)]" : "text-[#2D4A0F]")}>{delta}</div>}
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{label}</dt>
      <dd className="text-[13.5px] text-[var(--ink)] mt-0.5">{children}</dd>
    </div>
  );
}
