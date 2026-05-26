"use client";
import { useState, useMemo } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { CURRENT_PARTNER, Lead, LeadStatus } from "@/lib/data";
import { THEMES } from "@/lib/themes";

const STATUSES: LeadStatus[] = ["Ny", "Kontaktet", "Vundet", "Tabt"];

const STATUS_COLOR: Record<LeadStatus, { bg: string; ink: string; dot: string }> = {
  Ny:         { bg: "var(--theme-accent-soft)", ink: "var(--theme-accent-ink)", dot: "var(--theme-accent)" },
  Kontaktet:  { bg: "#E8F0FA", ink: "#0C447C", dot: "#1158A3" },
  Vundet:     { bg: "#EAF1DC", ink: "#324A14", dot: "#5B7F2C" },
  Tabt:       { bg: "#F3F4F6", ink: "#444",     dot: "#9CA3AF" },
};

export default function LeadsPage() {
  const { theme } = useTheme();
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
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <div className="t-tagline" style={{ color: theme.accentInk }}>LEADS · CARL-RAS.DK PARTNERFINDER</div>
      <h1 className="t-display-lg mt-3 text-[var(--cr-navy-deep)]">Leads</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Sommerhusejere finder dig på <strong>carl-ras.dk</strong>. Når de udfylder kontaktformularen,
        lander leadet her. Acceptér, kontakt, og opdatér status efterhånden som sagen flytter sig.
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
        <div className="grid grid-cols-[1fr_120px_120px_140px] gap-4 px-5 py-3 border-b border-[var(--hairline)] bg-[var(--surface-pearl)] text-[11px] uppercase tracking-wider text-[var(--ink-muted-48)] font-semibold">
          <div>Kunde · Behov</div>
          <div>Sted</div>
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
            className="w-full grid grid-cols-[1fr_120px_120px_140px] gap-4 px-5 py-4 border-b border-[var(--divider-soft)] last:border-b-0 hover:bg-[var(--surface-pearl)] text-left transition-colors items-center"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="t-body-strong text-[var(--cr-navy-deep)] truncate">{l.kunde}</span>
                <span className="text-[10px] text-[var(--ink-muted-48)] uppercase tracking-wide">
                  {THEMES.find((t) => t.id === l.tema)?.label.split(" ")[0] ?? l.tema}
                </span>
              </div>
              <div className="text-[13px] text-[var(--ink-muted-80)] truncate">{l.behov}</div>
            </div>
            <div className="text-[13px] text-[var(--ink-muted-80)]">{l.postnr} {l.by}</div>
            <div className="text-[13px] text-[var(--ink-muted-80)]">{l.værdi ?? "—"}</div>
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
