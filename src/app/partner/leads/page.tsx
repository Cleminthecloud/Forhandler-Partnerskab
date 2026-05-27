"use client";

// Force dynamic rendering — these pages use client hooks (useSearchParams) and/or
// heavy Recharts components that can hang Next.js static page generation.
export const dynamic = "force-dynamic";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppState";
import { CURRENT_PARTNER, Lead, LeadStatus, productsForBehov, CERTS_AVAILABLE, SPECIALISTS } from "@/lib/data";
import { THEMES } from "@/lib/themes";
import { PageHeader } from "@/components/PageHeader";

const STATUSES: LeadStatus[] = ["Ny", "Kontaktet", "Vundet", "Tabt"];

const STATUS_COLOR: Record<LeadStatus, { bg: string; ink: string; dot: string }> = {
  Ny:         { bg: "var(--theme-accent-soft)", ink: "var(--theme-accent-ink)", dot: "var(--theme-accent)" },
  Kontaktet:  { bg: "#E8F0FA", ink: "#0C447C", dot: "#1158A3" },
  Vundet:     { bg: "#EAF1DC", ink: "#324A14", dot: "#5B7F2C" },
  Tabt:       { bg: "#F3F4F6", ink: "#444",     dot: "#9CA3AF" },
};

export default function LeadsPage() {
  const { leads, updateLeadStatus, pushToast } = useApp();
  const [activeStatus, setActiveStatus] = useState<LeadStatus | "Alle">("Alle");
  const [openLead, setOpenLead] = useState<Lead | null>(null);

  const myLeads = useMemo(
    () => leads.filter((l) => l.partnerId === CURRENT_PARTNER.id).sort((a, b) => b.dato.localeCompare(a.dato)),
    [leads]
  );

  const filtered = useMemo(
    () => myLeads.filter((l) => activeStatus === "Alle" ? true : l.status === activeStatus),
    [myLeads, activeStatus]
  );

  const counts = useMemo(() => ({
    Ny:        myLeads.filter((l) => l.status === "Ny").length,
    Kontaktet: myLeads.filter((l) => l.status === "Kontaktet").length,
    Vundet:    myLeads.filter((l) => l.status === "Vundet").length,
    Tabt:      myLeads.filter((l) => l.status === "Tabt").length,
  }), [myLeads]);

  function changeStatus(id: string, status: LeadStatus) {
    updateLeadStatus(id, status);
    setOpenLead((prev) => (prev?.id === id ? { ...prev, status } : prev));
    pushToast(`Lead flyttet til "${status}".`);
  }

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in min-h-[calc(100vh-48px)]">
      <PageHeader
        eyebrow="Leads · Carl-ras.dk Partnerfinder"
        title="Leads"
        lead="Sommerhusejere finder dig på carl-ras.dk. Når de udfylder kontaktformularen, lander leadet her."
      />

      {/* Status pipeline */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <FilterChip active={activeStatus === "Alle"} onClick={() => setActiveStatus("Alle")} label={`Alle (${myLeads.length})`} />
        {STATUSES.map((s) => (
          <FilterChip key={s} active={activeStatus === s} onClick={() => setActiveStatus(s)} label={`${s} (${counts[s]})`} colorBg={STATUS_COLOR[s].bg} colorInk={STATUS_COLOR[s].ink} dot={STATUS_COLOR[s].dot} />
        ))}
      </div>

      {/* Leads table */}
      <div className="mt-6 card !p-0 overflow-hidden">
        <div className="grid grid-cols-[1.4fr_100px_120px_110px_130px] gap-4 px-5 py-3 border-b border-[var(--line)] bg-[var(--canvas-2)] text-[12px] uppercase tracking-wider text-[var(--ink-3)] font-semibold">
          <div>Kunde · Behov</div>
          <div>Postnr</div>
          <div>By</div>
          <div>Værdi</div>
          <div>Status</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-[14px] text-[var(--ink-muted-48)]">
            Ingen leads i denne kategori.
          </div>
        ) : filtered.map((l) => (
          <button
            key={l.id}
            onClick={() => setOpenLead(l)}
            className="w-full grid grid-cols-[1.4fr_100px_120px_110px_130px] gap-4 px-5 py-4 border-b border-[var(--line-2)] last:border-b-0 hover:bg-[var(--canvas-2)] text-left transition-colors items-center"
          >
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-[var(--ink)] truncate">{l.kunde}</div>
              <div className="text-[13px] text-[var(--ink-2)] truncate">{l.behov}</div>
            </div>
            <div className="text-[13px] text-[var(--ink-2)] tabular-nums">{l.postnr}</div>
            <div className="text-[13px] text-[var(--ink-2)] truncate">{l.by}</div>
            <div className="text-[13px] text-[var(--ink-2)] tabular-nums">{l.værdi ?? "—"}</div>
            <div>
              <StatusBadge status={l.status} />
            </div>
          </button>
        ))}
      </div>

      {/* Side drawer — full-viewport height with sticky header + sticky footer.
          Header carries the close button, body scrolls if content overflows,
          footer (status pills + contact CTAs) is always visible at the bottom. */}
      {openLead && (
        <div className="fixed inset-0 z-50 animate-in" onClick={() => setOpenLead(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside
            className="absolute top-[48px] right-0 bottom-0 w-[720px] max-w-[96vw] bg-white border-l border-[var(--line)] shadow-[-8px_0_24px_rgba(0,0,0,0.10)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideInRight 280ms cubic-bezier(0.22,1,0.36,1)" }}
          >
            {/* Sticky header */}
            <div className="px-7 py-5 border-b border-[var(--line-2)] flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="t-eyebrow !text-[10px]" style={{ color: STATUS_COLOR[openLead.status].ink }}>LEAD #{openLead.id.replace("l-", "")}</div>
                <div className="text-[24px] font-bold text-[var(--ink)] mt-1.5 leading-tight">{openLead.kunde}</div>
                <div className="mt-2"><StatusBadge status={openLead.status} /></div>
              </div>
              <button onClick={() => setOpenLead(null)} className="size-9 rounded-full hover:bg-[var(--canvas-2)] grid place-items-center text-[var(--ink-3)] hover:text-[var(--ink)] shrink-0" aria-label="Luk">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-7 py-5 space-y-5 min-h-0">
              <Section label="Behov">{openLead.behov}</Section>
              <Section label="Beskrivelse">{openLead.beskrivelse}</Section>

              <div className="grid grid-cols-2 gap-4">
                <Section label="Postnummer">{openLead.postnr} {openLead.by}</Section>
                <Section label="Estimeret værdi">{openLead.værdi ?? "—"}</Section>
                <Section label="Telefon">{openLead.telefon}</Section>
                <Section label="Email"><span className="break-all">{openLead.email}</span></Section>
              </div>

              <Section label="Tema">
                <span
                  className="inline-flex items-center gap-2 text-[12px] font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: THEMES.find((t) => t.id === openLead.tema)?.accentSoft,
                    color: THEMES.find((t) => t.id === openLead.tema)?.accentInk,
                  }}
                >
                  <span className="size-2 rounded-full" style={{ background: THEMES.find((t) => t.id === openLead.tema)?.accent }} />
                  {THEMES.find((t) => t.id === openLead.tema)?.label}
                </span>
              </Section>

              <Section label="Modtaget">{new Date(openLead.dato).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })}</Section>

              {/* Won-project upsell */}
              {openLead.status === "Vundet" && (
                <WonProjectUpsell lead={openLead} />
              )}
            </div>

            {/* Sticky footer */}
            <div className="px-7 py-4 border-t border-[var(--line-2)] bg-[var(--canvas-2)] shrink-0">
              <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-2.5">Opdatér status</div>
              <div className="grid grid-cols-4 gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(openLead.id, s)}
                    className={"py-2 rounded-full text-[12.5px] font-semibold transition-colors border " +
                      (openLead.status === s
                        ? "text-white border-transparent"
                        : "bg-white border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--ink-3)]")}
                    style={openLead.status === s ? { background: STATUS_COLOR[s].dot } : undefined}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <a href={`tel:${openLead.telefon}`} className="btn btn-primary flex-1 justify-center !py-2">📞 Ring til kunden</a>
                <a href={`mailto:${openLead.email}`} className="btn btn-secondary flex-1 justify-center !py-2">✉ Send email</a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label, colorBg, colorInk, dot }: { active: boolean; onClick: () => void; label: string; colorBg?: string; colorInk?: string; dot?: string }) {
  return (
    <button
      onClick={onClick}
      className={"px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors inline-flex items-center gap-2 " +
        (active
          ? "border-transparent text-white"
          : "border-[var(--hairline)] bg-white hover:bg-[var(--surface-pearl)]")}
      style={active ? { background: dot ?? "var(--cr-navy-deep)" } : (colorBg ? { background: colorBg, color: colorInk, borderColor: "transparent" } : undefined)}
    >
      {dot && !active && <span className="size-1.5 rounded-full" style={{ background: dot }} />}
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const c = STATUS_COLOR[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.ink }}>
      <span className="size-1.5 rounded-full" style={{ background: c.dot }} />
      {status}
    </span>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] uppercase tracking-wider text-[var(--ink-muted-48)] font-semibold mb-1.5">{label}</div>
      <div className="text-[14px] text-[var(--cr-navy-deep)]">{children}</div>
    </div>
  );
}

function WonProjectUpsell({ lead }: { lead: Lead }) {
  const { products, træningId } = productsForBehov(lead.behov);
  const træning = træningId ? CERTS_AVAILABLE.find((c) => c.cert.id === træningId)?.cert : undefined;
  const specialist = SPECIALISTS[0]; // Jens Pedersen — Sikring

  // Map the lead's behov/tema to a project type for sensible pre-fill
  const guessedType: "Sommerhus" | "Bolig" | "Udlejning" | "Erhverv" | "Ejendom" =
    /udlejning|sommerhus.*udlej/i.test(lead.behov) ? "Udlejning" :
    /sommerhus/i.test(lead.behov) ? "Sommerhus" :
    /butik|kontor|erhverv/i.test(lead.behov) ? "Erhverv" :
    /ejendom|bolig.*forening/i.test(lead.behov) ? "Ejendom" :
    /sommer|sommerhus/i.test(lead.tema) ? "Sommerhus" : "Bolig";

  // Pre-fill query string for /partner/projekter?new=…
  const planQuery = new URLSearchParams({
    new: "1",
    kunde: lead.kunde,
    kontakt: lead.email || lead.telefon,
    type: guessedType,
    by: lead.by,
    enheder: "1",
    note: `Vundet lead fra carl-ras.dk · ${lead.behov}`,
  }).toString();

  return (
    <div className="border-t-8 border-[#EAF1DC] mt-2">
      <div className="px-6 pt-5 pb-2 bg-[var(--canvas)]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EAF1DC] text-[#2D4A0F]">
          <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-[12px] font-semibold uppercase tracking-wider">Vundet — næste skridt</span>
        </div>
        <h3 className="text-[18px] font-semibold text-[var(--ink)] mt-3">Nu kommer arbejdet</h3>
        <p className="text-[13px] text-[var(--ink-2)] mt-1 leading-[1.5]">
          Lav en plan så du holder styr på alle faser. Eller dyk direkte ned i produkterne du skal bestille.
        </p>

        {/* Primary CTA — pre-fills the project form with this lead's data */}
        <Link
          href={`/partner/projekter?${planQuery}`}
          className="mt-4 inline-flex items-center gap-2 btn btn-primary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 4h6l1 3h4v13H4V7h4z" /><path d="M9 11h6" /><path d="M9 15h4" />
          </svg>
          Lav en plan for {lead.kunde.split(" ").slice(-1)[0]}
        </Link>
        <span className="ml-3 text-[11.5px] text-[var(--ink-3)]">
          ✨ {specialist.navn.split(" ")[0]} har et færdigt forløb klar til {guessedType.toLowerCase()}-projekter
        </span>
      </div>

      {/* Products from Carl Ras */}
      <div className="px-6 py-5 bg-[var(--canvas)]">
        <div className="flex items-baseline justify-between mb-3">
          <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
            Anbefalede produkter
          </h4>
          <a
            href={`https://www.carl-ras.dk/search/?sortType=0&search=${encodeURIComponent(lead.behov)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-[var(--accent)] hover:underline"
          >
            Se alle på carl-ras.dk →
          </a>
        </div>
        <ul className="space-y-2.5">
          {products.map((p) => (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3.5 rounded-[var(--r-md)] border border-[var(--line-2)] hover:border-[var(--accent)] hover:bg-[var(--canvas-2)] transition-colors group"
              >
                <div className="size-24 rounded-lg bg-white border border-[var(--line-2)] overflow-hidden grid place-items-center shrink-0 p-2">
                  {p.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.image} alt={p.navn} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-3xl">{p.emoji}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{p.brand}</div>
                  <div className="text-[14px] font-semibold text-[var(--ink)] truncate group-hover:text-[var(--accent)] mt-0.5">{p.navn}</div>
                  <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Varenr {p.id} {p.margin ? `· ${p.margin}` : ""}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[14px] font-semibold text-[var(--ink)] tabular-nums">{p.pris}</div>
                  <div className="text-[12px] text-[var(--accent)] mt-1">Åbn PDP ↗</div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Training */}
      {træning && (
        <div className="px-6 py-5 bg-[var(--canvas)] border-t border-[var(--line-2)]">
          <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-3">
            Træning til opgaven
          </h4>
          <a
            href="/partner/certificering"
            className="flex items-center gap-3 p-3 rounded-[var(--r-md)] border border-[var(--line-2)] hover:border-[var(--accent)] hover:bg-[var(--canvas-2)] transition-colors group"
          >
            <div className="size-12 rounded-lg bg-[var(--cr-blue-tint)] grid place-items-center text-2xl shrink-0">
              {træning.ikon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{træning.udsteder}</div>
              <div className="text-[13px] font-semibold text-[var(--ink)] truncate group-hover:text-[var(--accent)]">{træning.titel}</div>
              <div className="text-[12px] text-[var(--ink-3)] mt-0.5">{træning.moduler} moduler · {træning.varighed}</div>
            </div>
            <div className="text-[12px] font-semibold text-[var(--accent)] shrink-0">Start →</div>
          </a>
        </div>
      )}

      {/* Specialist */}
      <div className="px-6 py-5 bg-[var(--canvas)] border-t border-[var(--line-2)]">
        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-3">
          Brug for en specialist?
        </h4>
        <a
          href="/partner/specialister"
          className="flex items-center gap-3 p-3 rounded-[var(--r-md)] border border-[var(--line-2)] hover:border-[var(--accent)] hover:bg-[var(--canvas-2)] transition-colors group"
        >
          <div
            className="size-12 rounded-full grid place-items-center text-white font-semibold text-[13px] shrink-0"
            style={{ background: specialist.bg }}
          >
            {specialist.initialer}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-[var(--ink)] truncate group-hover:text-[var(--accent)]">{specialist.navn}</div>
            <div className="text-[12px] text-[var(--ink-3)]">
              {specialist.rolle} · {specialist.bu}
              {specialist.online && <span className="ml-2 text-[#2D4A0F]">● Online</span>}
            </div>
          </div>
          <div className="text-[12px] font-semibold text-[var(--accent)] shrink-0">Skriv →</div>
        </a>
      </div>
    </div>
  );
}
