"use client";
import { useState, useMemo } from "react";
import { useApp } from "@/components/AppState";
import { EVENTS, CalendarEvent, Region, getEventDetail, SPECIALISTS } from "@/lib/data";

const TYPE_COLOR: Record<CalendarEvent["type"], { bg: string; ink: string }> = {
  "Faglig Fredag":  { bg: "#FFF1DC", ink: "#7A4400" },
  "Regionsmøde":    { bg: "#E8F0FA", ink: "#0C447C" },
  "Produktdemo":    { bg: "#EAF1DC", ink: "#324A14" },
  "Certificering":  { bg: "#FCE4E6", ink: "#7E0309" },
  "Webinar":        { bg: "#F3F4F6", ink: "#444" },
};

export default function EventsPage() {
  const { pushToast } = useApp();
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"Alle" | Region | "Online">("Alle");
  const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);

  const filtered = useMemo(() => {
    return EVENTS.filter((e) => filter === "Alle" ? true : e.region === filter)
      .sort((a, b) => a.dato.localeCompare(b.dato));
  }, [filter]);

  function toggle(id: string, name: string) {
    setRegistered((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); pushToast(`Afmeldt: ${name}`); }
      else { next.add(id); pushToast(`Tilmeldt: ${name}`); }
      return next;
    });
  }

  const regions: Array<"Alle" | Region | "Online"> = ["Alle", "Nordsjælland", "Vestkysten", "Bornholm", "Hovedstaden", "Østjylland", "Nordjylland", "Online"];

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      <div className="t-eyebrow">Events &amp; kalender</div>
      <h1 className="t-display mt-3">Faglige Fredage &amp; regionsmøder</h1>
      <p className="t-body-lg mt-3 max-w-[680px]">
        Hver Faglig Fredag er en lokal halv eftermiddag med en Carl Ras-specialist. Vi viser nyt sortiment, deler erfaringer, og I går hjem med konkrete salgsargumenter.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={"px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors " +
              (filter === r ? "border-transparent bg-[var(--ink)] text-white" : "border-[var(--line)] bg-white hover:bg-[var(--canvas-2)]")}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => {
          const isReg = registered.has(e.id);
          const tc = TYPE_COLOR[e.type];
          return (
            <article key={e.id} className="card card-hover flex gap-4 cursor-pointer" onClick={() => setOpenEvent(e)}>
              <div className="rounded-xl px-3 py-2.5 text-center shrink-0 self-start" style={{ background: tc.bg, color: tc.ink }}>
                <div className="text-[10px] uppercase tracking-wider">{new Date(e.dato).toLocaleDateString("da-DK", { month: "short" }).replace(".", "")}</div>
                <div className="text-[24px] font-bold leading-none mt-1">{new Date(e.dato).getDate()}</div>
                <div className="text-[10px] mt-1 opacity-80">{e.tid}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.ink }}>{e.type}</span>
                  <span className="text-[12px] text-[var(--ink-3)]">{e.region}</span>
                </div>
                <div className="text-[15px] font-semibold mt-2 text-[var(--ink)] leading-tight line-clamp-2">{e.titel}</div>
                <div className="text-[12px] text-[var(--ink-3)] mt-1.5">{e.lokation.split(",")[0]} · {e.varighed}</div>
                <div className="text-[12px] text-[var(--ink-3)] mt-0.5">Vært: <span className="text-[var(--ink-2)]">{e.vært}</span></div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[var(--ink-3)] tabular-nums">
                    {e.tilmeldte + (isReg ? 1 : 0)}/{e.pladser} tilmeldt
                  </span>
                  <button
                    onClick={(ev) => { ev.stopPropagation(); toggle(e.id, e.titel); }}
                    className={isReg ? "btn btn-secondary btn-sm" : "btn btn-primary btn-sm"}
                  >
                    {isReg ? "✓ Tilmeldt" : "Tilmeld"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Event detail modal */}
      {openEvent && (
        <EventDetailModal
          event={openEvent}
          registered={registered.has(openEvent.id)}
          onClose={() => setOpenEvent(null)}
          onToggleRegister={() => toggle(openEvent.id, openEvent.titel)}
        />
      )}
    </div>
  );
}

function EventDetailModal({
  event,
  registered,
  onClose,
  onToggleRegister,
}: {
  event: CalendarEvent;
  registered: boolean;
  onClose: () => void;
  onToggleRegister: () => void;
}) {
  const detail = getEventDetail(event.id);
  const host = SPECIALISTS.find((s) => s.navn === event.vært);
  const dateStr = new Date(event.dato).toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="fixed inset-0 z-50 bg-black/55 grid place-items-center p-4 sm:p-6 animate-in" onClick={onClose}>
      <div
        className="bg-white rounded-[20px] max-w-[760px] w-full max-h-[90vh] overflow-y-auto shadow-[var(--shadow-4)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="relative h-[200px] overflow-hidden rounded-t-[20px]" style={{ background: detail.hero }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 70%, rgba(0,0,0,0.25) 0%, transparent 70%)" }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-9 rounded-full bg-white/95 hover:bg-white text-[var(--ink)] grid place-items-center transition-colors"
            aria-label="Luk"
          >
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider">
              {event.type}
            </span>
            <h2 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}>
              {event.titel}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 lg:p-7">
          {/* Quick facts */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mb-6 pb-6 border-b border-[var(--line-2)]">
            <Fact label="Dato">{dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</Fact>
            <Fact label="Tid">{event.tid} · {event.varighed}</Fact>
            <Fact label="Lokation">{event.lokation}</Fact>
            <Fact label="Tilmeldte">
              <span className="tabular-nums">{event.tilmeldte + (registered ? 1 : 0)}/{event.pladser}</span>
            </Fact>
          </dl>

          <p className="t-body-lg !text-[var(--ink-2)] leading-[1.55] mb-6">{event.beskrivelse}</p>

          {/* Host */}
          {host && (
            <div className="mb-6 p-4 rounded-[var(--r-lg)] bg-[var(--canvas-2)] flex items-center gap-3">
              <div className="size-12 rounded-full text-white font-semibold grid place-items-center shrink-0 text-[14px]" style={{ background: host.bg }}>
                {host.initialer}
              </div>
              <div className="flex-1">
                <div className="t-caption">Vært</div>
                <div className="text-[15px] font-semibold text-[var(--ink)]">{host.navn}</div>
                <div className="text-[12px] text-[var(--ink-3)]">{host.rolle} · {host.bu}</div>
              </div>
            </div>
          )}

          {/* Agenda */}
          <h3 className="t-h3 mb-3">Program</h3>
          <ol className="space-y-2 mb-6">
            {detail.agenda.map((line, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-[var(--ink-2)]">
                <span className="size-1.5 mt-2.5 rounded-full bg-[var(--accent)] shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ol>

          {/* Medbring */}
          <h3 className="t-h3 mb-3">Medbring</h3>
          <ul className="space-y-2 mb-6">
            {detail.medbringer.map((line, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-[var(--ink-2)]">
                <svg width="14" height="14" viewBox="0 0 14 14" className="mt-1 text-[var(--accent)] shrink-0"><path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="t-caption mb-6 p-3 rounded-[var(--r-md)] bg-[var(--accent-tint)] text-[var(--cr-navy)]">
            💰 {detail.faktura}
          </p>

          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="btn btn-secondary">Luk</button>
            <button onClick={onToggleRegister} className={registered ? "btn btn-secondary" : "btn btn-primary"}>
              {registered ? "✓ Afmeld" : "Tilmeld mig"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{label}</dt>
      <dd className="text-[14px] text-[var(--ink)] mt-0.5">{children}</dd>
    </div>
  );
}
