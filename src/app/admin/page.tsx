"use client";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { ADMIN_STATS, PARTNERS, Region, Tier } from "@/lib/data";
import { Sparkline, AreaChart, Donut, BarMini } from "@/components/Charts";

type DateRange = "uge" | "maaned" | "kvartal";

const TIER_COLOR: Record<Tier, string> = {
  Guld:  "#C99A20",
  Sølv:  "#7E8993",
  Bronze: "#9C6A3F",
};

export default function AdminOverview() {
  const { theme } = useTheme();
  const [range, setRange] = useState<DateRange>("maaned");

  const leadGrowth = Math.round(((ADMIN_STATS.leadsDenneUge - ADMIN_STATS.leadsForrigeUge) / ADMIN_STATS.leadsForrigeUge) * 100);
  const omsætningGrowth = Math.round(((ADMIN_STATS.omsætningDenneMåned - ADMIN_STATS.omsætningForrigeMåned) / ADMIN_STATS.omsætningForrigeMåned) * 100);

  const leadSeries = [22, 18, 24, 26, 31, 29, 33, 38];
  const partnerGrowth = [12, 18, 24, 31, 38, 47];

  const tierSegments = (Object.entries(ADMIN_STATS.partnereByTier) as [Tier, number][])
    .map(([t, v]) => ({ label: t, value: v, color: TIER_COLOR[t] }));

  return (
    <div className="px-6 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      {/* ─── HEADER ─── */}
      <header className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <div>
          <div className="t-eyebrow flex items-center gap-2">
            <span className="theme-dot" style={{ background: theme.accent }} />
            <span>Aktivt tema · {theme.label}</span>
          </div>
          <h1 className="t-display mt-2">Forhandler Partnerskab</h1>
          <p className="t-body-lg mt-2 max-w-[600px]">
            Motoren i drift. Skift tema i toppen for at se hvad næste BU&apos;s årshjul leverer.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SegmentedRange value={range} onChange={setRange} />
          <button className="btn btn-secondary">Eksportér</button>
          <button className="btn btn-primary">+ Ny kampagne</button>
        </div>
      </header>

      {/* ─── KPI ROW ─── */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <KpiTile
          label="Aktive partnere"
          value={ADMIN_STATS.aktivePartnere}
          delta="+6 i denne måned"
          deltaPositive
          sparkline={partnerGrowth}
          sparkColor="var(--accent)"
        />
        <KpiTile
          label="Leads denne uge"
          value={ADMIN_STATS.leadsDenneUge}
          delta={`${leadGrowth > 0 ? "+" : ""}${leadGrowth}% vs. forrige`}
          deltaPositive={leadGrowth > 0}
          sparkline={leadSeries}
          sparkColor={theme.accent}
        />
        <KpiTile
          label="Konvertering"
          value={`${Math.round(ADMIN_STATS.leadsKonverteret * 100)}%`}
          delta="3 pp over Q1-mål"
          deltaPositive
          sparkline={[36, 38, 40, 39, 41, 42, 42, 42]}
          sparkColor="#2D4A0F"
        />
        <KpiTile
          label="Omsætning maj"
          value={`${Math.round(ADMIN_STATS.omsætningDenneMåned / 1000)}k`}
          unit="kr"
          delta={`${omsætningGrowth > 0 ? "+" : ""}${omsætningGrowth}% vs. april`}
          deltaPositive={omsætningGrowth > 0}
          sparkline={[280, 310, 340, 370, 412, 487]}
          sparkColor="#C99A20"
        />
      </section>

      {/* ─── HERO ROW: Big leads chart + Tier donut ─── */}
      <section className="grid gap-4 lg:grid-cols-[1.7fr_1fr] mb-4">
        {/* Big leads chart */}
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h3 className="t-h3">Leads pr. uge</h3>
              <p className="t-caption mt-0.5">Seneste 8 uger · alle kanaler</p>
            </div>
            <div className="text-right">
              <div className="text-[36px] font-semibold leading-none text-[var(--ink)] tabular-nums">{ADMIN_STATS.leadsDenneUge}</div>
              <div className="text-[12px] font-semibold text-[#2D4A0F] mt-1">+{leadGrowth}%</div>
            </div>
          </div>
          <AreaChart
            values={leadSeries}
            labels={["U17","U18","U19","U20","U21","U22","U23","U24"]}
            color={theme.accent}
            height={200}
          />
        </div>

        {/* Tier donut */}
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="t-h3">Niveau-fordeling</h3>
            <span className="t-caption">{ADMIN_STATS.aktivePartnere} partnere</span>
          </div>
          <p className="text-[12px] text-[var(--ink-3)] mb-4">Andele af niveauer</p>

          <div className="flex items-center justify-center gap-5 mt-2">
            <div className="relative grid place-items-center">
              <Donut segments={tierSegments} size={140} thickness={16} />
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-[24px] font-semibold leading-none tabular-nums">{ADMIN_STATS.aktivePartnere}</div>
                  <div className="text-[10px] text-[var(--ink-3)] mt-1 uppercase tracking-wider">aktive</div>
                </div>
              </div>
            </div>
          </div>

          <ul className="mt-5 space-y-2.5">
            {tierSegments.map((s) => (
              <li key={s.label} className="flex items-center gap-3 text-[13px]">
                <span className="size-2.5 rounded-full shrink-0" style={{ background: s.color }} aria-hidden="true" />
                <span className="font-medium text-[var(--ink)] flex-1">{s.label}</span>
                <span className="text-[var(--ink-3)] tabular-nums">
                  {s.value} · {Math.round((s.value / ADMIN_STATS.aktivePartnere) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── REGION + ACTIVITY ─── */}
      <section className="grid gap-4 lg:grid-cols-2 mb-4">
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="t-h3">Partnere pr. region</h3>
            <span className="t-caption">8 regioner</span>
          </div>
          <BarMini
            rows={(Object.entries(ADMIN_STATS.partnereByRegion) as [Region, number][])
              .sort((a, b) => b[1] - a[1])
              .map(([region, count]) => ({ label: region, value: count }))}
          />
        </div>

        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="t-h3">Seneste aktivitet</h3>
            <Link href="/admin/data" className="link text-[13px]">Se alt →</Link>
          </div>
          <ul className="space-y-4">
            {[
              { tid: "for 18 min", body: <><strong>Blokhus Byg &amp; Bolig</strong> opgraderet til Guld-partner.</>, color: "#C99A20" },
              { tid: "for 42 min", body: <><strong>3 nye leads</strong> routet fra carl-ras.dk → Hornbæk Låseservice.</>, color: theme.accent },
              { tid: "for 1 t",    body: <><strong>Faglig Fredag Bornholm</strong> nåede 8/18 tilmeldte.</>, color: "var(--accent)" },
              { tid: "for 2 t",    body: <><strong>Nyt blogindlæg</strong> publiceret: &quot;Vinterklargøring kommer Q4&quot;.</>, color: "#5B7F2C" },
              { tid: "i går",      body: <><strong>Targeted besked</strong> sendt til 21 Sølv-partnere.</>, color: "#7E8993" },
            ].map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px]">
                <span className="size-2 rounded-full shrink-0 mt-2" style={{ background: a.color }} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-[var(--ink-2)] leading-snug">{a.body}</div>
                  <div className="text-[12px] text-[var(--ink-3)] mt-0.5">{a.tid}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── TOP PERFORMERS ─── */}
      <section className="card card-lg">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="t-h3">Top-performere</h3>
          <Link href="/admin/partnere" className="link text-[13px]">Se alle 47 →</Link>
        </div>
        <div className="grid grid-cols-[1fr_80px_70px_80px_110px] gap-4 px-2 mb-2 text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-3)]">
          <span>Partner</span><span>Tier</span><span>Sager</span><span>Rating</span><span>Region</span>
        </div>
        {PARTNERS.slice(0, 6).map((p) => (
          <div key={p.id} className="grid grid-cols-[1fr_80px_70px_80px_110px] gap-4 px-2 py-3 border-t border-[var(--line-2)] items-center">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-lg grid place-items-center text-white text-[11px] font-semibold shrink-0" style={{ background: p.logoBg }} aria-hidden="true">
                {p.initialer}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[var(--ink)] truncate">{p.firma}</div>
                <div className="text-[12px] text-[var(--ink-3)] truncate">{p.faggruppe} · {p.by}</div>
              </div>
            </div>
            <span className={tierClass(p.tier)}>{p.tier}</span>
            <span className="text-[13px] tabular-nums">{p.antalSager}</span>
            <span className="text-[13px] tabular-nums">{p.rating} ★</span>
            <span className="text-[12px] text-[var(--ink-3)]">{p.region}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ─────────── small components ─────────── */

function SegmentedRange({ value, onChange }: { value: DateRange; onChange: (v: DateRange) => void }) {
  const options: { id: DateRange; label: string }[] = [
    { id: "uge",     label: "Uge" },
    { id: "maaned",  label: "Måned" },
    { id: "kvartal", label: "Kvartal" },
  ];
  return (
    <div className="inline-flex rounded-full bg-[var(--canvas-2)] p-1">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={
            "px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors " +
            (value === o.id ? "bg-white text-[var(--ink)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]" : "text-[var(--ink-3)] hover:text-[var(--ink)]")
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function KpiTile({
  label, value, unit, delta, deltaPositive, sparkline, sparkColor = "var(--accent)",
}: {
  label: string; value: string | number; unit?: string; delta?: string;
  deltaPositive?: boolean; sparkline?: number[]; sparkColor?: string;
}) {
  return (
    <div className="bg-[var(--canvas)] rounded-[var(--r-lg)] border border-[var(--line)] p-5 flex flex-col transition-shadow hover:shadow-[var(--shadow-1)]">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-[var(--ink-3)] font-medium">{label}</span>
        {delta && (
          <span className={"text-[11px] font-semibold " + (deltaPositive ? "text-[#2D4A0F]" : "text-[var(--ink-3)]")}>
            {delta}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-[32px] font-semibold leading-none tracking-tight text-[var(--ink)] tabular-nums">{value}</span>
        {unit && <span className="text-[14px] text-[var(--ink-3)] font-medium">{unit}</span>}
      </div>
      {sparkline && (
        <div className="mt-3 -mx-1">
          <Sparkline values={sparkline} color={sparkColor} height={32} />
        </div>
      )}
    </div>
  );
}

function tierClass(tier: "Bronze" | "Sølv" | "Guld") {
  const map = { Bronze: "tag tag-bronze", Sølv: "tag tag-soelv", Guld: "tag tag-guld" } as const;
  return map[tier];
}
