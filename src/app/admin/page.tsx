"use client";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { ADMIN_STATS, PARTNERS, Region, Tier } from "@/lib/data";

export default function AdminOverview() {
  const { theme } = useTheme();
  const { leads } = useApp();

  const newLeadsLastWeek = leads.filter((l) => {
    const d = new Date(l.dato);
    return Date.now() - d.getTime() < 7 * 24 * 3600 * 1000;
  }).length;

  const wonValue = leads.filter((l) => l.status === "Vundet").length * 14000; // rough avg
  const leadGrowth = Math.round(((ADMIN_STATS.leadsDenneUge - ADMIN_STATS.leadsForrigeUge) / ADMIN_STATS.leadsForrigeUge) * 100);
  const omsætningGrowth = Math.round(((ADMIN_STATS.omsætningDenneMåned - ADMIN_STATS.omsætningForrigeMåned) / ADMIN_STATS.omsætningForrigeMåned) * 100);
  void newLeadsLastWeek; void wonValue;

  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="t-tagline" style={{ color: theme.accentInk }}>OVERSIGT · {theme.label.toUpperCase()}</div>
          <h1 className="t-display-lg mt-3 text-[var(--cr-navy-deep)]">Forhandler Partnerskab</h1>
          <p className="t-lead mt-2 max-w-[640px]">Motoren i drift. Skift tema i toppen for at se hvad næste BU&apos;s årshjul leverer.</p>
        </div>
        <div className="flex gap-2">
          <button className="pill pill-primary">+ Ny kampagne</button>
          <button className="pill pill-light">Eksportér rapport</button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Aktive partnere" value={ADMIN_STATS.aktivePartnere} sub={`+6 denne måned`} positive />
        <Tile label="Leads denne uge" value={ADMIN_STATS.leadsDenneUge} sub={`${leadGrowth > 0 ? "+" : ""}${leadGrowth}% vs. forrige uge`} positive={leadGrowth > 0} />
        <Tile label="Konvertering" value={`${Math.round(ADMIN_STATS.leadsKonverteret * 100)}%`} sub="3 pp over Q1-mål" positive />
        <Tile label="Omsætning maj" value={`${(ADMIN_STATS.omsætningDenneMåned / 1000).toFixed(0)}k kr`} sub={`${omsætningGrowth > 0 ? "+" : ""}${omsætningGrowth}% vs. april`} positive={omsætningGrowth > 0} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {/* Tier distribution */}
        <div className="card">
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>NIVEAU-FORDELING</div>
          <div className="mt-3 space-y-3">
            {(Object.entries(ADMIN_STATS.partnereByTier) as [Tier, number][]).map(([tier, count]) => {
              const pct = Math.round((count / ADMIN_STATS.aktivePartnere) * 100);
              const color = tier === "Guld" ? "#D4A437" : tier === "Sølv" ? "#9DA6B0" : "#B07A4B";
              return (
                <div key={tier}>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="font-semibold text-[var(--cr-navy-deep)]">{tier}</span>
                    <span className="text-[var(--ink-muted-48)]">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--divider-soft)] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: pct + "%", background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/admin/partnere" className="mt-4 inline-block text-[13px] font-semibold" style={{ color: "var(--cr-blue)" }}>
            Se alle partnere →
          </Link>
        </div>

        {/* Region distribution */}
        <div className="card lg:col-span-2">
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>PARTNERE PR. REGION</div>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {(Object.entries(ADMIN_STATS.partnereByRegion) as [Region, number][])
              .sort((a, b) => b[1] - a[1])
              .map(([region, count]) => {
                const pct = Math.round((count / ADMIN_STATS.aktivePartnere) * 100);
                return (
                  <div key={region}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-[var(--cr-navy-deep)]">{region}</span>
                      <span className="text-[var(--ink-muted-48)]">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--divider-soft)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: pct + "%", background: "var(--cr-blue)" }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Leads-flow trend */}
        <div className="card lg:col-span-2">
          <div className="t-tagline" style={{ color: theme.accentInk }}>LEADS-FLOW · 8 UGER</div>
          <Sparkline />
          <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--ink-muted-48)]">
            <span>Uge 17</span><span>Uge 18</span><span>Uge 19</span><span>Uge 20</span><span>Uge 21</span>
          </div>
        </div>

        {/* Active theme card */}
        <div className="card" style={{ background: theme.accentSoft + "55", borderColor: theme.accentSoft }}>
          <div className="t-tagline" style={{ color: theme.accentInk }}>AKTIVT TEMA</div>
          <div className="mt-2 text-[18px] font-semibold text-[var(--cr-navy-deep)]">{theme.label}</div>
          <div className="t-caption">{theme.bu} · {theme.season}</div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Mini label="Aktive kampagner" value="3" />
            <Mini label="Leads gen. (uge)" value="38" />
            <Mini label="Materialer hentet" value="124" />
            <Mini label="Faglige Fredage" value="4" />
          </div>
          <Link href="/admin/kampagner" className="mt-4 inline-block text-[13px] font-semibold" style={{ color: theme.accentInk }}>
            Administrér tema →
          </Link>
        </div>

        {/* Recent activity */}
        <div className="card lg:col-span-3">
          <div className="flex items-center justify-between">
            <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>SENESTE AKTIVITET</div>
            <Link href="/admin/data" className="text-[13px] font-semibold" style={{ color: "var(--cr-blue)" }}>Se alt →</Link>
          </div>
          <ul className="mt-3 divide-y divide-[var(--divider-soft)]">
            {[
              { tid: "for 18 min", body: <><strong>Blokhus Byg &amp; Bolig</strong> opgraderet til Guld-partner.</>, dot: "#D4A437" },
              { tid: "for 42 min", body: <><strong>3 nye leads</strong> routet fra carl-ras.dk → Hornbæk Låseservice.</>, dot: theme.accent },
              { tid: "for 1 t", body: <><strong>Faglig Fredag Bornholm</strong> nåede 8/18 tilmeldte.</>, dot: "var(--cr-blue)" },
              { tid: "for 2 t", body: <><strong>Nyt blogindlæg</strong> publiceret af Morten Bach: &quot;Vinterklargøring kommer Q4&quot;.</>, dot: "#5B7F2C" },
              { tid: "i går", body: <><strong>Targeted besked</strong> sendt til 21 Sølv-partnere (Niveau 2-tilmelding).</>, dot: "#9DA6B0" },
            ].map((a, i) => (
              <li key={i} className="py-3 flex items-center gap-3 text-[14px]">
                <span className="size-2 rounded-full shrink-0" style={{ background: a.dot }} />
                <span className="flex-1 text-[var(--ink-muted-80)]">{a.body}</span>
                <span className="text-[12px] text-[var(--ink-muted-48)] shrink-0">{a.tid}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top partners */}
      <div className="mt-8 card">
        <div className="flex items-center justify-between mb-3">
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>TOP-PERFORMERE</div>
          <Link href="/admin/partnere" className="text-[13px] font-semibold" style={{ color: "var(--cr-blue)" }}>Se alle 47 →</Link>
        </div>
        <div className="grid grid-cols-[1fr_100px_100px_100px_120px] gap-4 text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-muted-48)] mb-2">
          <span>Partner</span><span>Tier</span><span>Sager</span><span>Rating</span><span>Region</span>
        </div>
        {PARTNERS.slice(0, 6).map((p) => (
          <div key={p.id} className="grid grid-cols-[1fr_100px_100px_100px_120px] gap-4 py-3 border-t border-[var(--divider-soft)] items-center">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-xl grid place-items-center text-white text-[11px] font-semibold shrink-0" style={{ background: p.logoBg }}>
                {p.initialer}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-[var(--cr-navy-deep)] truncate">{p.firma}</div>
                <div className="text-[11px] text-[var(--ink-muted-48)] truncate">{p.faggruppe} · {p.by}</div>
              </div>
            </div>
            <span className="text-[13px]">{p.tier}</span>
            <span className="text-[13px]">{p.antalSager}</span>
            <span className="text-[13px]">{p.rating} ★</span>
            <span className="text-[12px] text-[var(--ink-muted-48)]">{p.region}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Tile({ label, value, sub, positive }: { label: string; value: number | string; sub: string; positive?: boolean }) {
  return (
    <div className="card">
      <div className="t-caption">{label}</div>
      <div className="mt-1 text-[28px] font-semibold leading-none tracking-tight text-[var(--cr-navy-deep)]">{value}</div>
      <div className={"text-[12px] mt-2 font-medium " + (positive ? "text-[#324A14]" : "text-[var(--ink-muted-48)]")}>{sub}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/60 rounded-xl px-3 py-2">
      <div className="text-[11px] text-[var(--ink-muted-48)]">{label}</div>
      <div className="text-[18px] font-semibold text-[var(--cr-navy-deep)]">{value}</div>
    </div>
  );
}

function Sparkline() {
  const data = [22, 18, 24, 26, 31, 29, 33, 38];
  const max = Math.max(...data);
  const w = 600, h = 80, pad = 8;
  const xstep = (w - pad * 2) / (data.length - 1);
  const yscale = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const points = data.map((v, i) => `${pad + i * xstep},${yscale(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full h-20">
      <polyline points={points} fill="none" stroke="var(--theme-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={pad + i * xstep} cy={yscale(v)} r={i === data.length - 1 ? 4 : 2.5} fill={i === data.length - 1 ? "var(--theme-accent)" : "white"} stroke="var(--theme-accent)" strokeWidth="2" />
      ))}
    </svg>
  );
}
