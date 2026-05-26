"use client";
import { useState, useMemo } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { CAMPAIGNS, FORMATS, CURRENT_PARTNER, FormatKind, Campaign } from "@/lib/data";
import { CampaignPreview } from "@/components/CampaignPreview";

export default function KampagnerPage() {
  const { theme } = useTheme();
  const { pushToast } = useApp();

  const themed = useMemo(() => CAMPAIGNS.filter((c) => c.tema === theme.id), [theme.id]);
  const other = useMemo(() => CAMPAIGNS.filter((c) => c.tema !== theme.id), [theme.id]);

  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(themed[0]?.id ?? null);
  const activeCampaign: Campaign | null = useMemo(
    () => CAMPAIGNS.find((c) => c.id === activeCampaignId) ?? themed[0] ?? null,
    [activeCampaignId, themed]
  );
  const [format, setFormat] = useState<FormatKind>("print-flyer");

  // confirmation modal
  const [confirm, setConfirm] = useState<null | { kind: "print" | "digital"; label: string }>(null);

  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <div className="t-tagline" style={{ color: theme.accentInk }}>MARKETING-VÆRKTØJSKASSE</div>
      <h1 className="t-display-lg mt-3 text-[var(--cr-navy-deep)]">Kampagner</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Færdige co-brandede materialer — print og digitalt. Dit firma, logo og kontaktoplysninger
        er hentet automatisk fra din profil. Vælg format, se preview, bestil.
      </p>

      {/* Theme's campaigns */}
      <div className="mt-8">
        <div className="text-[12px] font-semibold mb-3 text-[var(--ink-muted-80)]">
          Aktivt tema · <span style={{ color: theme.accentInk }}>{theme.label}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {themed.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              accent={theme.accent}
              accentSoft={theme.accentSoft}
              active={activeCampaign?.id === c.id}
              onClick={() => { setActiveCampaignId(c.id); setFormat(c.formater[0]); }}
            />
          ))}
        </div>
      </div>

      {/* Other themes' campaigns */}
      {other.length > 0 && (
        <div className="mt-10">
          <div className="text-[12px] font-semibold mb-3 text-[var(--ink-muted-80)]">Øvrige temaer i årshjulet</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {other.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                accent="#9CA3AF"
                accentSoft="#F3F4F6"
                muted
                active={activeCampaign?.id === c.id}
                onClick={() => { setActiveCampaignId(c.id); setFormat(c.formater[0]); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Configurator */}
      {activeCampaign && (
        <div className="mt-12 card !p-0 overflow-hidden">
          <div
            className="px-6 py-4 border-b border-[var(--hairline)] flex flex-wrap items-center gap-3 justify-between"
            style={{ background: theme.accentSoft + "55" }}
          >
            <div>
              <div className="t-tagline" style={{ color: theme.accentInk }}>KONFIGURATOR</div>
              <div className="t-display text-[var(--cr-navy-deep)] mt-1">{activeCampaign.titel}</div>
              <div className="t-caption mt-1">{activeCampaign.hovedbudskab}</div>
            </div>
            <ProfilePill />
          </div>

          <div className="grid lg:grid-cols-[1fr_minmax(0,460px)] gap-0">
            {/* Left — format chooser */}
            <div className="p-6 border-r border-[var(--hairline)]">
              <FormatSection title="Print" items={activeCampaign.formater.filter((f) => f.startsWith("print-"))} active={format} onPick={setFormat} accent={theme.accent} />
              <FormatSection title="Digital" items={activeCampaign.formater.filter((f) => f.startsWith("digital-"))} active={format} onPick={setFormat} accent={theme.accent} />

              <div className="mt-8 pt-6 border-t border-[var(--hairline)]">
                <div className="text-[12px] font-semibold mb-3 text-[var(--ink-muted-80)]">Bestil / hent</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setConfirm({ kind: "digital", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                    className="pill pill-primary"
                  >
                    Hent som PDF
                  </button>
                  <button
                    onClick={() => setConfirm({ kind: "print", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                    className="pill pill-light"
                  >
                    Bestil tryk hos Carl Ras
                  </button>
                  <button
                    onClick={() => pushToast("Kampagnen er gemt i dine favoritter.")}
                    className="pill pill-light"
                  >
                    Gem som skabelon
                  </button>
                </div>
                <p className="t-caption mt-3 max-w-[440px]">
                  Sølv- og Guld-partnere får dækket 50% af medieomkostninger ved tryk. Levering inden for 5 hverdage.
                </p>
              </div>
            </div>

            {/* Right — preview */}
            <div className="bg-[var(--surface-pearl)] p-6 grid place-items-center">
              <CampaignPreview campaign={activeCampaign} partner={CURRENT_PARTNER} theme={theme} format={format} />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 bg-black/45 grid place-items-center p-6" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="t-tagline" style={{ color: theme.accentInk }}>BEKRÆFT</div>
            <h3 className="t-display mt-2 text-[var(--cr-navy-deep)]">
              {confirm.kind === "digital" ? "Hent som PDF" : "Bestil tryk"}
            </h3>
            <p className="t-body mt-3 text-[var(--ink-muted-80)]">
              {confirm.kind === "digital" ? (
                <>Vi genererer {confirm.label} med dit logo og kontaktoplysninger. PDF&apos;en lander i din indbakke om få sekunder.</>
              ) : (
                <>Carl Ras producerer og leverer <strong>{confirm.label}</strong> inden for 5 hverdage. Vi dækker 50% af medieomkostninger per din Sølv-aftale.</>
              )}
            </p>
            <div className="mt-6 flex gap-2 justify-end">
              <button className="pill pill-light" onClick={() => setConfirm(null)}>Annullér</button>
              <button
                className="pill pill-primary"
                onClick={() => {
                  pushToast(confirm.kind === "digital"
                    ? `${confirm.label} er sendt til din email.`
                    : `${confirm.label} er bestilt. Forventet levering: 5 hverdage.`);
                  setConfirm(null);
                }}
              >
                {confirm.kind === "digital" ? "Send PDF" : "Bekræft bestilling"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CampaignCard({ campaign, accent, accentSoft, active, onClick, muted }: { campaign: Campaign; accent: string; accentSoft: string; active: boolean; onClick: () => void; muted?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={"card text-left transition-all " + (active ? "ring-2 ring-[var(--cr-blue)]" : "hover:shadow-[0_10px_24px_rgba(0,45,89,0.06)]") + (muted ? " opacity-90" : "")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="size-12 rounded-xl grid place-items-center text-2xl shrink-0" style={{ background: accentSoft }}>
          {campaign.heroEmoji}
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{ background: accentSoft, color: accent === "#9CA3AF" ? "#444" : "var(--theme-accent-ink)" }}
        >
          {campaign.status}
        </span>
      </div>
      <div className="mt-4 t-body-strong text-[var(--cr-navy-deep)]">{campaign.titel}</div>
      <p className="t-caption mt-1 line-clamp-2">{campaign.hovedbudskab}</p>
      <div className="mt-3 text-[11px] text-[var(--ink-muted-48)]">{campaign.formater.length} formater · klar at bruge</div>
    </button>
  );
}

function ProfilePill() {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-white ring-1 ring-[var(--hairline)]">
      <div className="size-7 rounded-md text-white grid place-items-center font-semibold text-[11px]" style={{ background: CURRENT_PARTNER.logoBg }}>
        {CURRENT_PARTNER.initialer}
      </div>
      <div className="leading-tight">
        <div className="text-[12px] font-semibold text-[var(--cr-navy-deep)]">{CURRENT_PARTNER.firma}</div>
        <div className="text-[10px] text-[var(--ink-muted-48)]">Hentet fra profil · {CURRENT_PARTNER.telefon}</div>
      </div>
    </div>
  );
}

function FormatSection({ title, items, active, onPick, accent }: { title: string; items: FormatKind[]; active: FormatKind; onPick: (f: FormatKind) => void; accent: string }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="text-[12px] font-semibold mb-3 text-[var(--ink-muted-80)]">{title}</div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((f) => {
          const meta = FORMATS.find((x) => x.id === f)!;
          const sel = active === f;
          return (
            <button
              key={f}
              onClick={() => onPick(f)}
              className={"text-left p-3 rounded-xl border transition-all " + (sel ? "border-transparent ring-2" : "border-[var(--hairline)] hover:bg-[var(--surface-pearl)]")}
              style={sel ? { boxShadow: `inset 0 0 0 2px ${accent}`, background: "white" } : undefined}
            >
              <div className="text-[13px] font-semibold text-[var(--cr-navy-deep)]">{meta.label}</div>
              <div className="text-[11px] text-[var(--ink-muted-48)] mt-0.5">{meta.dim}</div>
              <div className="text-[11px] text-[var(--ink-muted-80)] mt-1 line-clamp-2">{meta.blurb}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
