"use client";
import { useEffect } from "react";

/* ─── Tier benefits data ─────────────────────────────────────────────
   What a Partner unlocks at each level. Used by the TierBenefitsDialog
   on /partner (Tier-progression card click). Values are demo numbers
   designed to feel realistic for a Carl Ras B2B partner program. */
export type Tier = "Bronze" | "Sølv" | "Guld";

export const TIER_COLOR: Record<Tier, { ring: string; ink: string; bg: string }> = {
  Bronze: { ring: "#B96C2A", ink: "#7A3F12", bg: "#FBE9DC" },
  "Sølv": { ring: "#A0A4B0", ink: "#4A4F55", bg: "#ECEEF1" },
  Guld:   { ring: "#C99A20", ink: "#6B4A00", bg: "#FCEFCA" },
};

export const TIER_POINTS: Record<Tier, number> = {
  Bronze: 0,
  "Sølv": 500,
  Guld: 2000,
};

interface BenefitRow {
  label: string;
  bronze: string;
  soelv: string;
  guld: string;
}
const BENEFITS: BenefitRow[] = [
  { label: "Rabat på Carl Ras varer",       bronze: "10%",                 soelv: "15%",                              guld: "20%" },
  { label: "Certificeringer",                bronze: "Niveau 1 (selvbetalt)", soelv: "Niveau 1+2 gratis",              guld: "Alle inkl. premium-træning" },
  { label: "Lead-prioritet",                 bronze: "Standard",            soelv: "24t før Bronze",                   guld: "48t før Sølv" },
  { label: "Medie-budget dækket",            bronze: "—",                   soelv: "50% (op til 5.000 kr/md)",          guld: "70% (op til 12.000 kr/md)" },
  { label: "Næste tema",                     bronze: "Standard",            soelv: "1 md tidligere",                    guld: "2 md tidligere" },
  { label: "Find-en-partner",                bronze: "Synlig",              soelv: "Featured i lokalområdet",           guld: "Premium-placering nationalt" },
  { label: "Konsulent",                      bronze: "Almindelig support",   soelv: "Regional konsulent",               guld: "Dedikeret konsulent" },
];

export function TierBenefitsDialog({
  open,
  onClose,
  currentTier,
  points,
  pointsTilNæste,
}: {
  open: boolean;
  onClose: () => void;
  currentTier: Tier;
  points: number;
  pointsTilNæste: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const nextTier: Tier | null = currentTier === "Bronze" ? "Sølv" : currentTier === "Sølv" ? "Guld" : null;
  const tiers: Tier[] = ["Bronze", "Sølv", "Guld"];
  const pct = Math.min(100, Math.round((points / pointsTilNæste) * 100));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 grid place-items-end md:place-items-center p-0 md:p-6 animate-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tier-benefits-title"
    >
      <div
        className="bg-white rounded-t-[18px] md:rounded-[var(--r-xl)] max-w-full md:max-w-[860px] w-full max-h-[92vh] md:max-h-[88vh] overflow-hidden flex flex-col shadow-[var(--shadow-4)]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideInUp 320ms cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* Header */}
        <div className="px-7 pt-6 pb-5 border-b border-[var(--line-2)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="t-eyebrow">Carl Ras Partnerskab</div>
              <h2 id="tier-benefits-title" className="t-h2 mt-2">Fordele pr. niveau</h2>
              <p className="t-body !mt-2 text-[var(--ink-2)]">
                Jo flere sager du kører gennem Carl Ras Partnerskabet, jo højere niveau — og jo bedre rabatter, prioritet og support.
              </p>
            </div>
            <button
              onClick={onClose}
              className="size-9 rounded-full grid place-items-center hover:bg-[var(--canvas-2)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors shrink-0"
              aria-label="Luk"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress rail — where am I, where am I heading */}
          {nextTier && (
            <div className="mt-5 p-3.5 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[12.5px] font-semibold text-[var(--ink-2)]">
                  Du har <strong className="text-[var(--ink)]">{points.toLocaleString("da-DK")} point</strong>
                </span>
                <span className="text-[12.5px] text-[var(--ink-3)]">
                  {(pointsTilNæste - points).toLocaleString("da-DK")} point til <strong style={{ color: TIER_COLOR[nextTier].ink }}>{nextTier}</strong>
                </span>
              </div>
              <div className="h-2 rounded-full bg-white overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(to right, ${TIER_COLOR[currentTier].ring}, ${TIER_COLOR[nextTier].ring})`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Body — 3-column comparison */}
        <div className="flex-1 overflow-y-auto px-4 md:px-7 py-6">
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
            {tiers.map((t) => {
              const isCurrent = t === currentTier;
              const isNext = t === nextTier;
              const c = TIER_COLOR[t];
              return (
                <div
                  key={t}
                  className={
                    "rounded-[var(--r-lg)] p-4 text-center transition-all " +
                    (isCurrent ? "ring-2 shadow-[var(--shadow-2)]" : "border border-[var(--line-2)]")
                  }
                  style={{
                    background: isCurrent ? c.bg : "white",
                    ...(isCurrent ? { borderColor: "transparent" } : null),
                    ...(isCurrent ? ({ "--tw-ring-color": c.ring } as React.CSSProperties) : null),
                  }}
                >
                  <div className="grid place-items-center mb-2">
                    <StarBadge color={c.ring} size={36} />
                  </div>
                  <div className="text-[15px] font-bold" style={{ color: c.ink }}>{t}</div>
                  <div className="text-[11.5px] text-[var(--ink-3)] mt-1 tabular-nums">
                    {TIER_POINTS[t].toLocaleString("da-DK")}+ point
                  </div>
                  {isCurrent && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "white", color: c.ink }}>
                      <span className="size-1.5 rounded-full" style={{ background: c.ring }} /> Dit niveau
                    </div>
                  )}
                  {isNext && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--canvas-2)] text-[var(--ink-2)]">
                      Næste op
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[var(--line-2)]">
                <th className="text-left py-2.5 font-semibold text-[var(--ink-3)] text-[11.5px] uppercase tracking-wider">Fordel</th>
                {tiers.map((t) => (
                  <th key={t} className="text-left py-2.5 font-semibold text-[var(--ink-3)] text-[11.5px] uppercase tracking-wider" style={{ width: "25%" }}>
                    <span style={{ color: TIER_COLOR[t].ink }}>{t}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BENEFITS.map((row) => (
                <tr key={row.label} className="border-b border-[var(--line-2)] last:border-0">
                  <td className="py-3 pr-3 text-[var(--ink-2)] font-medium">{row.label}</td>
                  <td className={"py-3 pr-3 " + (currentTier === "Bronze" ? "font-semibold text-[var(--ink)]" : "text-[var(--ink-2)]")}>{row.bronze}</td>
                  <td className={"py-3 pr-3 " + (currentTier === "Sølv" ? "font-semibold text-[var(--ink)]" : "text-[var(--ink-2)]")}>{row.soelv}</td>
                  <td className={"py-3 " + (currentTier === "Guld" ? "font-semibold text-[var(--ink)]" : "text-[var(--ink-2)]")}>{row.guld}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 md:px-7 py-4 border-t border-[var(--line-2)] bg-[var(--canvas)] flex items-center justify-between">
          <p className="text-[12px] text-[var(--ink-3)]">
            Niveau opgraderes automatisk hver måned baseret på sager, certificeringer og engagement.
          </p>
          <button onClick={onClose} className="btn btn-primary">Færdig</button>
        </div>
      </div>
    </div>
  );
}

/** Reusable star badge — used inside the tier cards in the dialog AND as
 *  the center node of the Radial on the dashboard. */
export function StarBadge({ color = "#C99A20", size = 64, glow = false }: { color?: string; size?: number; glow?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
      style={glow ? { filter: `drop-shadow(0 0 8px ${color}55)` } : undefined}
    >
      <path d="M12 2.5l2.9 6.1 6.6.95-4.78 4.66 1.13 6.6L12 17.7l-5.85 3.1 1.13-6.6L2.5 9.55l6.6-.95L12 2.5z" />
    </svg>
  );
}
