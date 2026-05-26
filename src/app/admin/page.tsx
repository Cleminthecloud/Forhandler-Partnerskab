"use client";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { ADMIN_STATS, PARTNERS, Region, Tier } from "@/lib/data";

export default function AdminOverview() {
  const { theme } = useTheme();
  const { leads } = useApp();
  void leads;

  const leadGrowth = Math.round(((ADMIN_STATS.leadsDenneUge - ADMIN_STATS.leadsForrigeUge) / ADMIN_STATS.leadsForrigeUge) * 100);
  const omsætningGrowth = Math.round(((ADMIN_STATS.omsætningDenneMåned - ADMIN_STATS.omsætningForrigeMåned) / ADMIN_STATS.omsætningForrigeMåned) * 100);

  return (
    <div className="px-6 lg:px-12 py-10 lg:py-14 max-w-[1200px] animate-in">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <div className="t-eyebrow flex items-center gap-2">
            <span className="theme-dot" style={{ background: theme.accent }} />
            <span>Aktivt tema · {theme.label}</span>
          </div>
          <h1 className="t-display mt-3">Forhandler Partnerskab</h1>
          <p className="t-body-lg mt-3 max-w-[600px]">
            Motoren i drift. Skift tema i toppen for at se hvad næste BU&apos;s årshjul leverer.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="btn btn-secondary">Eksportér rapport</button>
          <button className="btn btn-primary">+ Ny kampagne</button>
        </div>
      </header>

      {/* KPI tiles — 4 across, equal weight */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <Kpi label="Aktive partnere"      value={ADMIN_STATS.aktivePartnere} delta="+6 i denne måned"  positive />
        <Kpi label="Leads denne uge"      value={ADMIN_STATS.leadsDenneUge}  delta={`${leadGrowth > 0 ? "+" : ""}${leadGrowth}% vs. forrige`} positive={leadGrowth > 0} />
        <Kpi label="Konvertering"         value={`${Math.round(ADMIN_STATS.leadsKonverteret * 100)}%`} delta="3 pp over Q1-mål" positive />
        <Kpi label="Omsætning maj"        value={`${Math.round(ADMIN_STATS.omsætningDenneMåned / 1000)}k kr`} delta={`${omsætningGrowth > 0 ? "+" : ""}${omsætningGrowth}% vs. april`} positive={omsætningGrowth > 0} />
      </section>

      {/* Trend chart — full width, calm */}
      <section className="card card-lg mb-12">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="t-h3">Leads pr. uge</h2>
            <p className="t-caption mt-0.5">Seneste 8 uger · alle kanaler</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-semibold text-[var(--ink)] leading-none">{ADMIN_STATS.leadsDenneUge}</span>
            <span className="text-[13px] font-medium text-[#2D4A0F]">+{leadGrowth}%</span>
          </div>
        </div>
        <Sparkline values={[22, 18, 24, 26, 31, 29, 33, 38]} labels={["U17","U18","U19","U20","U21","U22","U23","U24"]} />
      </section>

      {/* Two-column: distribution charts */}
      <section className="grid gap-4 lg:grid-cols-2 mb-12">
        <div className="card card-lg">
          <h2 className="t-h3 mb-5">Niveau-fordeling</h2>
          <div className="space-y-4">
            {(Object.entries(ADMIN_STATS.partnereByTier) as [Tier, number][]).map(([tier, count]) => {
              const pct = Math.round((count / ADMIN_STATS.aktivePartnere) * 100);
              const color = tier === "Guld" ? "#C99A20" : tier === "Sølv" ? "#7E8993" : "#9C6A3F";
              return (
                <div key={tier}>
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="font-semibold text-[var(--ink)]">{tier}-partner</span>
                    <span className="text-[var(--ink-3)] tabular-nums">{count} · {pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--canvas-2)] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: pct + "%", background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/admin/partnere" className="link mt-5 inline-flex items-center gap-1 text-[14px]">
            Se alle partnere →
          </Link>
        </div>

        <div className="card card-lg">
          <h2 className="t-h3 mb-5">Partnere pr. region</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {(Object.entries(ADMIN_STATS.partnereByRegion) as [Region, number][])
              .sort((a, b) => b[1] - a[1])
              .map(([region, count]) => {
                const pct = Math.round((count / ADMIN_STATS.aktivePartnere) * 100);
                return (
                  <div key={region}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-[var(--ink)]">{region}</span>
                      <span className="text-[var(--ink-3)] tabular-nums">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--canvas-2)] overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: pct + "%" }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Recent activity */}
      <section className="card card-lg mb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="t-h3">Seneste aktivitet</h2>
          <Link href="/admin/data" className="link text-[14px]">Se alt →</Link>
        </div>
        <ul className="divide-y divide-[var(--line-2)]">
          {[
            { tid: "for 18 min", body: <><strong>Blokhus Byg &amp; Bolig</strong> opgraderet til Guld-partner.</>, dot: "#C99A20" },
            { tid: "for 42 min", body: <><strong>3 nye leads</strong> routet fra carl-ras.dk → Hornbæk Låseservice.</>, dot: "var(--accent)" },
            { tid: "for 1 t",    body: <><strong>Faglig Fredag Bornholm</strong> nåede 8/18 tilmeldte.</>, dot: "var(--ink-3)" },
            { tid: "for 2 t",    body: <><strong>Nyt blogindlæg</strong> publiceret af Morten Bach: &quot;Vinterklargøring kommer Q4&quot;.</>, dot: "var(--ink-3)" },
            { tid: "i går",      body: <><strong>Targeted besked</strong> sendt til 21 Sølv-partnere (Niveau 2-tilmelding).</>, dot: "var(--ink-3)" },
          ].map((a, i) => (
            <li key={i} className="py-3 flex items-center gap-3 text-[14px]">
              <span className="size-1.5 rounded-full shrink-0" style={{ background: a.dot }} aria-hidden="true" />
              <span className="flex-1 text-[var(--ink-2)]">{a.body}</span>
              <span className="text-[12px] text-[var(--ink-3)] shrink-0 tabular-nums">{a.tid}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top performers */}
      <section className="card card-lg">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="t-h3">Top-performere</h2>
          <Link href="/admin/partnere" className="link text-[14px]">Se alle 47 →</Link>
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

function Kpi({ label, value, delta, positive }: { label: string; value: number | string; delta: string; positive?: boolean }) {
  return (
    <div className="card-pearl !p-4 transition-colors">
      <div className="text-[12px] text-[var(--ink-3)] font-medium">{label}</div>
      <div className="mt-1 text-[26px] font-semibold leading-none tracking-tight text-[var(--ink)] tabular-nums">{value}</div>
      <div className={"text-[11px] mt-2 font-medium " + (positive ? "text-[#2D4A0F]" : "text-[var(--ink-3)]")}>{delta}</div>
    </div>
  );
}

function tierClass(tier: "Bronze" | "Sølv" | "Guld") {
  const map = { Bronze: "tag tag-bronze", Sølv: "tag tag-soelv", Guld: "tag tag-guld" } as const;
  return map[tier];
}

function Sparkline({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values);
  const w = 800, h = 140, padX = 20, padY = 24;
  const xstep = (w - padX * 2) / (values.length - 1);
  const y = (v: number) => h - padY - (v / max) * (h - padY * 2);
  const points = values.map((v, i) => `${padX + i * xstep},${y(v)}`).join(" ");
  const area = `${padX},${h - padY} ${points} ${padX + (values.length - 1) * xstep},${h - padY}`;
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto block">
        <polygon points={area} fill="var(--accent-tint)" />
        <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {values.map((v, i) => (
          <circle key={i} cx={padX + i * xstep} cy={y(v)} r={i === values.length - 1 ? 5 : 3} fill={i === values.length - 1 ? "var(--accent)" : "white"} stroke="var(--accent)" strokeWidth="2" />
        ))}
      </svg>
      <div className="grid mt-1" style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}>
        {labels.map((l, i) => (
          <span key={i} className="text-center text-[11px] text-[var(--ink-3)]">{l}</span>
        ))}
      </div>
    </>
  );
}
