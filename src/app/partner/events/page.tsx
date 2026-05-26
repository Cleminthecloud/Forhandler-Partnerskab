"use client";
import { useState, useMemo } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { EVENTS, CalendarEvent, Region } from "@/lib/data";

const TYPE_COLOR: Record<CalendarEvent["type"], { bg: string; ink: string }> = {
  "Faglig Fredag":  { bg: "#FFF1DC", ink: "#7A4400" },
  "Regionsmøde":    { bg: "#E8F0FA", ink: "#0C447C" },
  "Produktdemo":    { bg: "#EAF1DC", ink: "#324A14" },
  "Certificering":  { bg: "#FCE4E6", ink: "#7E0309" },
  "Webinar":        { bg: "#F3F4F6", ink: "#444" },
};

export default function EventsPage() {
  const { theme } = useTheme();
  const { pushToast } = useApp();
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"Alle" | Region | "Online">("Alle");

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
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <div className="t-tagline" style={{ color: theme.accentInk }}>EVENTS &amp; KALENDER</div>
      <h1 className="t-display-lg mt-3 text-[var(--cr-navy-deep)]">Faglige Fredage, regionsmøder &amp; certificering</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Hver Faglig Fredag er en lokal halv eftermiddag med en Carl Ras-specialist. Vi viser nyt sortiment,
        I deler erfaringer, og I går hjem med konkrete salgsargumenter.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={"px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors " +
              (filter === r ? "border-transparent bg-[var(--cr-navy-deep)] text-white" : "border-[var(--hairline)] bg-white hover:bg-[var(--surface-pearl)]")}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        {filtered.map((e) => {
          const isReg = registered.has(e.id);
          const tc = TYPE_COLOR[e.type];
          return (
            <article key={e.id} className="card flex gap-5">
              <div className="rounded-2xl px-3 py-2.5 text-center shrink-0 self-start" style={{ background: tc.bg, color: tc.ink }}>
                <div className="text-[10px] uppercase tracking-wider">{new Date(e.dato).toLocaleDateString("da-DK", { month: "short" }).replace(".", "")}</div>
                <div className="text-[26px] font-bold leading-none mt-1">{new Date(e.dato).getDate()}</div>
                <div className="text-[10px] mt-1 opacity-80">{e.tid}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.ink }}>{e.type}</span>
                  <span className="text-[12px] text-[var(--ink-muted-48)]">{e.region}</span>
                </div>
                <div className="t-body-strong mt-2 text-[var(--cr-navy-deep)]">{e.titel}</div>
                <div className="t-caption mt-1">{e.lokation} · {e.varighed}</div>
                <p className="text-[13px] text-[var(--ink-muted-80)] mt-2 line-clamp-2">{e.beskrivelse}</p>
                <div className="t-caption mt-2">Vært: <strong className="text-[var(--cr-navy-deep)]">{e.vært}</strong> · {e.værtRolle}</div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[var(--ink-muted-48)]">
                    {e.tilmeldte + (isReg ? 1 : 0)} / {e.pladser} tilmeldt
                  </span>
                  <button
                    onClick={() => toggle(e.id, e.titel)}
                    className={isReg ? "pill pill-light" : "pill pill-primary"}
                  >
                    {isReg ? "✓ Tilmeldt" : "Tilmeld"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
