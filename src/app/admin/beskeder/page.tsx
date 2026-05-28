"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/components/AppState";
import { ADMIN_STATS } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { Icon } from "@/components/Icon";

/* ─── Past messages (demo data) ──────────────────────────────────────
   Sent + drafts + scheduled messages from Carl Ras HQ. In a real build
   this hydrates from the messaging backend. Spans every status type so
   the demo shows the breadth of cadence + audiences Carl Ras runs. */
type MessageStatus = "Sendt" | "Kladde" | "Planlagt";
type Tier = "Alle" | "Bronze" | "Sølv" | "Guld";
interface PastMessage {
  id: string;
  emne: string;
  body: string;
  tier: Tier;
  region: string;
  tema: string;
  status: MessageStatus;
  dato: string;          // human-readable Danish date
  modtagere?: number;    // recipient count — for Sendt + Planlagt
  scheduledFor?: string; // for Planlagt
}
const PAST_MESSAGES: PastMessage[] = [
  {
    id: "m-1",
    emne: "Niveau 2-certificering er åben for tilmelding",
    body: "Hej {{fornavn}},\n\nNiveau 2 Sikring-certificeringen åbner for tilmelding 1. juni. Sølv-partnere har gratis adgang. Læs mere i din portal.\n\nTina, Træningschef · Carl Ras Sikring",
    tier: "Sølv", region: "Alle", tema: "Alle",
    status: "Sendt", dato: "15. maj 2026", modtagere: 21,
  },
  {
    id: "m-2",
    emne: "Smart Lock — ny pris fra 1. juni",
    body: "Hej {{fornavn}},\n\nFra 1. juni får alle Sølv- og Guld-partnere 8% ekstra rabat på STROXX Smart Lock. Det betyder bedre margin på dine sommerhus-installationer.\n\nMarie Lindgren · Specialist · Sikring",
    tier: "Sølv", region: "Alle", tema: "Sommerhussikring",
    status: "Sendt", dato: "8. maj 2026", modtagere: 18,
  },
  {
    id: "m-3",
    emne: "Vinterklargøring — første adgang i september",
    body: "Hej {{fornavn}},\n\nVi forbereder næste tema i årshjulet — Vinterklargøring. Tagrender, frostsikring og vinterlukning. Sølv- og Guld-partnere får første adgang fra september. Hold øje med din portal.\n\nMorten Bach · Specialist · Byg",
    tier: "Alle", region: "Alle", tema: "Alle",
    status: "Sendt", dato: "23. april 2026", modtagere: 47,
  },
  {
    id: "m-4",
    emne: "Faglig Fredag — STROXX Gateway G2 demo",
    body: "Hej {{fornavn}},\n\nDenne fredag kl. 14: live-demo af STROXX Gateway G2 + integration mod ABUS. 45 minutter, plus Q&A. Tilmeld dig i kalenderen.\n\nChristian Funch · Specialist · Sikring",
    tier: "Alle", region: "Alle", tema: "Sommerhussikring",
    status: "Sendt", dato: "16. april 2026", modtagere: 32,
  },
  {
    id: "m-5",
    emne: "Bronze → Sølv: 3 partnere er klar",
    body: "Hej {{fornavn}},\n\nDu har taget Niveau 1 Sikring og kørt 5+ sager de sidste 3 måneder. Det betyder du nu kvalificerer til Sølv-niveau — og gratis adgang til Niveau 2.\n\nKlik i din portal for at opgradere.\n\nDennis Holmberg · Regional Sales Lead",
    tier: "Bronze", region: "Nordsjælland", tema: "Alle",
    status: "Kladde", dato: "Sidst redigeret 21. maj",
  },
  {
    id: "m-6",
    emne: "Sommerhus-segmentet — månedsrapport maj",
    body: "Hej {{fornavn}},\n\nVi har samlet partnernes data fra maj: 47 partnere, 412 vundne sager, 18% vækst i konverteringsraten. Læs hele rapporten i Nyheder.\n\nPeter Bak Torjusen · Direktør · Digital & Marketing",
    tier: "Alle", region: "Alle", tema: "Alle",
    status: "Planlagt", dato: "Planlagt", modtagere: 47, scheduledFor: "1. juni 2026 kl. 08:00",
  },
];

const STATUS_STYLES: Record<MessageStatus, { bg: string; ink: string; dot: string }> = {
  "Sendt":    { bg: "#E5F4EA", ink: "#1F6A3A", dot: "#2D9D5A" },
  "Kladde":   { bg: "#F0F1F4", ink: "#3A3F44", dot: "#86868B" },
  "Planlagt": { bg: "#FFF1DC", ink: "#7A4400", dot: "#F49100" },
};

export default function AdminBeskeder() {
  const { pushToast } = useApp();
  const [tier, setTier] = useState<Tier>("Sølv");
  const [region, setRegion] = useState<string>("Alle");
  const [tema, setTema] = useState<string>("Alle");
  const [subject, setSubject] = useState("Niveau 2-certificering er åben for tilmelding");
  const [body, setBody] = useState("Hej {{fornavn}},\n\nNiveau 2 Sikring-certificeringen åbner for tilmelding 1. juni. Sølv-partnere har gratis adgang. Læs mere i din portal.\n\nTina, Træningschef · Carl Ras Sikring");
  const [archiveOpen, setArchiveOpen] = useState(false);

  // ESC closes drawer
  useEffect(() => {
    if (!archiveOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setArchiveOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [archiveOpen]);

  const segment = computeSegment(tier, region, tema);

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10">
      <PageHeader
        eyebrow="Targeted messaging"
        title="Send besked til en partner-segment"
        lead="Beskeder bliver pushet til partnernes inbox + email. Personalisering via flettefelter."
        actions={
          <button
            onClick={() => setArchiveOpen(true)}
            className="btn btn-secondary inline-flex items-center gap-2"
            data-tt="Se og genbrug tidligere beskeder + kladder"
          >
            <Icon name="history" size={14} />
            Tidligere beskeder
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold leading-none">{PAST_MESSAGES.length}</span>
          </button>
        }
      />

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
              <select value={tier} onChange={(e) => setTier(e.target.value as Tier)} className="mt-1 w-full rounded-xl px-4 py-2 bg-[var(--surface-pearl)] text-[14px] border border-transparent focus:ring-2 focus:ring-[var(--cr-blue)] outline-none">
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

      {/* ─── ARCHIVE DRAWER: Tidligere beskeder ─── */}
      {archiveOpen && (
        <div className="fixed inset-0 z-40 animate-in" onClick={() => setArchiveOpen(false)}>
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
          <aside
            className="absolute top-[48px] right-0 bottom-0 w-[560px] max-w-[95vw] bg-white border-l border-[var(--line-2)] shadow-[var(--shadow-3)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideInRight 280ms cubic-bezier(0.22,1,0.36,1)" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--line-2)] flex items-center justify-between">
              <div>
                <div className="t-eyebrow !text-[12px]">Arkiv</div>
                <div className="text-[15px] font-semibold text-[var(--ink)] mt-0.5">Tidligere beskeder</div>
                <div className="text-[12px] text-[var(--ink-3)] mt-0.5">
                  {PAST_MESSAGES.filter((m) => m.status === "Sendt").length} sendt · {PAST_MESSAGES.filter((m) => m.status === "Kladde").length} kladde · {PAST_MESSAGES.filter((m) => m.status === "Planlagt").length} planlagt
                </div>
              </div>
              <button
                onClick={() => setArchiveOpen(false)}
                className="size-8 rounded-full grid place-items-center hover:bg-[var(--canvas-2)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
                aria-label="Luk"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
              {PAST_MESSAGES.map((m) => {
                const status = STATUS_STYLES[m.status];
                const segmentChip = [
                  m.tier !== "Alle" ? m.tier : null,
                  m.region !== "Alle" ? m.region : null,
                  m.tema !== "Alle" ? m.tema : null,
                ].filter(Boolean).join(" · ") || "Alle partnere";
                return (
                  <article key={m.id} className="rounded-[var(--r-lg)] border border-[var(--line-2)] bg-white hover:shadow-[var(--shadow-2)] hover:border-[var(--line)] transition-all p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[14px] font-semibold text-[var(--ink)] leading-tight truncate">{m.emne}</h3>
                      <span
                        className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: status.bg, color: status.ink }}
                      >
                        <span className="size-1.5 rounded-full" style={{ background: status.dot }} />
                        {m.status}
                      </span>
                    </div>
                    <div className="text-[12px] text-[var(--ink-3)] mt-1.5 leading-[1.5] line-clamp-2">
                      {m.body.replace(/\{\{[^}]+\}\}/g, "…").split("\n")[2] ?? m.body.split("\n")[0]}
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
                      <span className="inline-flex items-center gap-1 text-[var(--ink-2)] font-medium">
                        <Icon name="users" size={12} /> {segmentChip}
                      </span>
                      <span className="text-[var(--ink-3)]">·</span>
                      <span className="text-[var(--ink-3)]">
                        {m.dato}
                        {typeof m.modtagere === "number" && (
                          <> · {m.modtagere} {m.modtagere === 1 ? "modtager" : "modtagere"}</>
                        )}
                      </span>
                      {m.scheduledFor && (
                        <>
                          <span className="text-[var(--ink-3)]">·</span>
                          <span className="text-[var(--ink-2)] font-medium">Afsendes {m.scheduledFor}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSubject(m.emne);
                          setBody(m.body);
                          setTier(m.tier);
                          setRegion(m.region);
                          setTema(m.tema);
                          setArchiveOpen(false);
                          pushToast(`"${m.emne}" indlæst — klar til at sende igen`);
                        }}
                        className="btn btn-primary !py-1 !px-3 !text-[12px]"
                      >
                        Brug igen
                      </button>
                      <button
                        onClick={() => {
                          setSubject(m.emne);
                          setBody(m.body);
                          setTier(m.tier);
                          setRegion(m.region);
                          setTema(m.tema);
                          setArchiveOpen(false);
                        }}
                        className="text-[12px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] px-2 py-1"
                      >
                        Åbn i editor →
                      </button>
                    </div>
                  </article>
                );
              })}

              <div className="mt-3 p-3.5 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
                <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">Sådan virker det</div>
                <p className="text-[12px] text-[var(--ink-2)] mt-1.5 leading-[1.5]">
                  Hver besked du sender, gemmer som kladde eller planlægger, havner her. &ldquo;Brug igen&rdquo; loader emne, indhold og segment-filtre tilbage i editoren, så du hurtigt kan opdatere datoer og sende en ny omgang.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
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
