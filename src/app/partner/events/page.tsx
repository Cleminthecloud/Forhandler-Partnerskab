"use client";
import { useState, useMemo } from "react";
import { useApp } from "@/components/AppState";
import { EVENTS, CalendarEvent, Region, getEventDetail, SPECIALISTS } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";

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
      <PageHeader
        eyebrow="Events & kalender"
        title="Faglige Fredage & regionsmøder"
        lead="Hver Faglig Fredag er en lokal halv eftermiddag med en Carl Ras-specialist. Vi viser nyt sortiment, deler erfaringer, og I går hjem med konkrete salgsargumenter."
      />

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
                <div className="text-[12px] uppercase tracking-wider">{new Date(e.dato).toLocaleDateString("da-DK", { month: "short" }).replace(".", "")}</div>
                <div className="text-[24px] font-bold leading-none mt-1">{new Date(e.dato).getDate()}</div>
                <div className="text-[12px] mt-1 opacity-80">{e.tid}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.ink }}>{e.type}</span>
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
    <div className="fixed inset-0 z-50 animate-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <aside
        className="mobile-sheet md:top-[48px] md:right-0 md:bottom-0 md:w-[880px] md:max-w-[96vw] bg-white md:border-l md:border-[var(--line-2)] shadow-[var(--shadow-3)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thin accent strip — uses theme accent or event-type color */}
        <div className="h-1 shrink-0" style={{ background: detail.hero }} />

        {/* Clean hero header — light, generous, on white */}
        <div className="px-8 pt-7 pb-6 border-b border-[var(--line-2)] flex items-start justify-between gap-4 shrink-0">
          <div className="flex-1 min-w-0">
            <span
              className="inline-block text-[12px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3"
              style={{ background: detail.hero, color: "white" }}
            >
              {event.type}
            </span>
            <h2 className="text-[26px] font-bold text-[var(--ink)] leading-[1.15] tracking-tight">
              {event.titel}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-full hover:bg-[var(--canvas-2)] grid place-items-center text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors shrink-0"
            aria-label="Luk"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-7 min-h-0">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mb-6 pb-6 border-b border-[var(--line-2)]">
            <Fact label="Dato">{dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</Fact>
            <Fact label="Tid">{event.tid} · {event.varighed}</Fact>
            <Fact label="Lokation">{event.lokation}</Fact>
            <Fact label="Tilmeldte">
              <span className="tabular-nums">{event.tilmeldte + (registered ? 1 : 0)}/{event.pladser}</span>
            </Fact>
          </dl>

          <p className="t-body-lg !text-[var(--ink-2)] leading-[1.55] mb-6">{event.beskrivelse}</p>

          {host && (
            <div className="mb-6 p-4 rounded-[var(--r-lg)] bg-[var(--canvas-2)] flex items-center gap-3">
              {host.portrait ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={host.portrait}
                  alt={host.navn}
                  className="size-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="size-12 rounded-full text-white font-semibold grid place-items-center shrink-0 text-[14px]" style={{ background: host.bg }}>
                  {host.initialer}
                </div>
              )}
              <div className="flex-1">
                <div className="t-caption">Vært</div>
                <div className="text-[15px] font-semibold text-[var(--ink)]">{host.navn}</div>
                <div className="text-[12px] text-[var(--ink-3)]">{host.rolle} · {host.bu}</div>
              </div>
            </div>
          )}

          <h3 className="t-h3 mb-3">Program</h3>
          <ol className="space-y-2 mb-6">
            {detail.agenda.map((line, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-[var(--ink-2)]">
                <span className="size-1.5 mt-2.5 rounded-full bg-[var(--accent)] shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ol>

          <h3 className="t-h3 mb-3">Medbring</h3>
          <ul className="space-y-2 mb-6">
            {detail.medbringer.map((line, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-[var(--ink-2)]">
                <svg width="14" height="14" viewBox="0 0 14 14" className="mt-1 text-[var(--accent)] shrink-0"><path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="t-caption p-3 rounded-[var(--r-md)] bg-[var(--accent-tint)] text-[var(--cr-navy)]">
            💰 {detail.faktura}
          </p>
        </div>

        {/* Sticky footer */}
        <div className="px-8 py-5 border-t border-[var(--line-2)] bg-[var(--canvas)] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11.5px] text-[var(--ink-3)]">
            {event.tilmeldte + (registered ? 1 : 0)} / {event.pladser} pladser brugt
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn btn-secondary !py-1.5">Luk</button>
            <button onClick={onToggleRegister} className={registered ? "btn btn-secondary !py-1.5" : "btn btn-primary !py-1.5"}>
              {registered ? "✓ Afmeld" : "Tilmeld mig"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{label}</dt>
      <dd className="text-[14px] text-[var(--ink)] mt-0.5">{children}</dd>
    </div>
  );
}
