"use client";
import { useState, useMemo } from "react";
import { useApp } from "@/components/AppState";
import { CURRENT_PARTNER, Lead, LeadStatus, productsForBehov, CERTS_AVAILABLE, SPECIALISTS } from "@/lib/data";
import { THEMES } from "@/lib/themes";

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
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      <div className="t-eyebrow">Leads · Carl-ras.dk Partnerfinder</div>
      <h1 className="t-display mt-3">Leads</h1>
      <p className="t-body-lg mt-3 max-w-[680px]">
        Sommerhusejere finder dig på <strong className="text-[var(--ink)] font-semibold">carl-ras.dk</strong>. Når de udfylder kontaktformularen, lander leadet her.
      </p>

      {/* Status pipeline */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <FilterChip active={activeStatus === "Alle"} onClick={() => setActiveStatus("Alle")} label={`Alle (${myLeads.length})`} />
        {STATUSES.map((s) => (
          <FilterChip key={s} active={activeStatus === s} onClick={() => setActiveStatus(s)} label={`${s} (${counts[s]})`} colorBg={STATUS_COLOR[s].bg} colorInk={STATUS_COLOR[s].ink} dot={STATUS_COLOR[s].dot} />
        ))}
      </div>

      {/* Leads table */}
      <div className="mt-6 card !p-0 overflow-hidden">
        <div className="grid grid-cols-[1.4fr_100px_120px_110px_130px] gap-4 px-5 py-3 border-b border-[var(--line)] bg-[var(--canvas-2)] text-[11px] uppercase tracking-wider text-[var(--ink-3)] font-semibold">
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

      {/* Side panel */}
      {openLead && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setOpenLead(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-[480px] bg-white h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--hairline)] flex items-center justify-between">
              <div>
                <div className="t-tagline" style={{ color: STATUS_COLOR[openLead.status].ink }}>LEAD #{openLead.id.replace("l-", "")}</div>
                <div className="t-display mt-1 text-[var(--cr-navy-deep)]">{openLead.kunde}</div>
              </div>
              <button onClick={() => setOpenLead(null)} className="size-9 rounded-full hover:bg-[var(--surface-pearl)] grid place-items-center text-[var(--ink-muted-80)]" aria-label="Luk">
                <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
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
            </div>

            {/* Won-project upsell */}
            {openLead.status === "Vundet" && (
              <WonProjectUpsell behov={openLead.behov} />
            )}

            <div className="p-6 border-t border-[var(--hairline)] bg-[var(--surface-pearl)]">
              <div className="text-[12px] font-semibold mb-3 text-[var(--ink-muted-80)]">Opdatér status</div>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(openLead.id, s)}
                    className={"pill text-[13px] " + (openLead.status === s ? "" : "pill-light")}
                    style={openLead.status === s ? { background: STATUS_COLOR[s].dot, color: "white" } : undefined}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <a href={`tel:${openLead.telefon}`} className="pill pill-primary flex-1 justify-center">📞 Ring til kunden</a>
                <a href={`mailto:${openLead.email}`} className="pill pill-light flex-1 justify-center">✉ Send email</a>
              </div>
            </div>
          </div>
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
      <div className="text-[11px] uppercase tracking-wider text-[var(--ink-muted-48)] font-semibold mb-1.5">{label}</div>
      <div className="text-[14px] text-[var(--cr-navy-deep)]">{children}</div>
    </div>
  );
}

function WonProjectUpsell({ behov }: { behov: string }) {
  const { products, træningId } = productsForBehov(behov);
  const træning = træningId ? CERTS_AVAILABLE.find((c) => c.cert.id === træningId)?.cert : undefined;
  const specialist = SPECIALISTS[0]; // Jens Pedersen — Sikring

  return (
    <div className="border-t-8 border-[#EAF1DC] mt-2">
      <div className="px-6 pt-5 pb-2 bg-[var(--canvas)]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EAF1DC] text-[#2D4A0F]">
          <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-[11px] font-semibold uppercase tracking-wider">Vundet — næste skridt</span>
        </div>
        <h3 className="text-[18px] font-semibold text-[var(--ink)] mt-3">Nu kommer arbejdet</h3>
        <p className="text-[13px] text-[var(--ink-2)] mt-1 leading-[1.5]">
          Her er hvad du skal bruge til opgaven. Køb varerne hos Carl Ras til partner-priser og forbered dig på selve installationen.
        </p>
      </div>

      {/* Products from Carl Ras */}
      <div className="px-6 py-5 bg-[var(--canvas)]">
        <div className="flex items-baseline justify-between mb-3">
          <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
            Anbefalede produkter
          </h4>
          <a
            href={`https://www.carl-ras.dk/search/?sortType=0&search=${encodeURIComponent(behov)}`}
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
                className="flex items-center gap-3 p-3 rounded-[var(--r-md)] border border-[var(--line-2)] hover:border-[var(--accent)] hover:bg-[var(--canvas-2)] transition-colors group"
              >
                <div className="size-12 rounded-lg bg-[var(--canvas-2)] grid place-items-center text-2xl shrink-0">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{p.brand}</div>
                  <div className="text-[13px] font-semibold text-[var(--ink)] truncate group-hover:text-[var(--accent)]">{p.navn}</div>
                  <div className="text-[11px] text-[var(--ink-3)] mt-0.5">Varenr {p.id} {p.margin ? `· ${p.margin}` : ""}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[13px] font-semibold text-[var(--ink)] tabular-nums">{p.pris}</div>
                  <div className="text-[11px] text-[var(--accent)] mt-0.5">Åbn PDP ↗</div>
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
              <div className="text-[11px] text-[var(--ink-3)] mt-0.5">{træning.moduler} moduler · {træning.varighed}</div>
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
            <div className="text-[11px] text-[var(--ink-3)]">
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
