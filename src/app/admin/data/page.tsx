"use client";

// Force dynamic rendering — these pages use client hooks (useSearchParams) and/or
// heavy Recharts components that can hang Next.js static page generation.
export const dynamic = "force-dynamic";
import { useTheme } from "@/components/ThemeProvider";
import { ADMIN_STATS, Region, Tier } from "@/lib/data";
import { InteractiveArea, InteractivePie } from "@/components/ChartsInteractive";
import { BarMini } from "@/components/Charts";

const TIER_COLOR: Record<Tier, string> = {
  Guld:  "#C99A20",
  Sølv:  "#7E8993",
  Bronze: "#9C6A3F",
};

export default function AdminData() {
  const { theme } = useTheme();

  const partnerGrowth = [12, 18, 24, 31, 38, 47].map((v, i) => ({
    label: ["Jan","Feb","Mar","Apr","Maj","Jun"][i], value: v,
  }));
  const leadsByWeek = [22, 18, 24, 26, 31, 29, 33, 38].map((v, i) => ({
    label: ["U17","U18","U19","U20","U21","U22","U23","U24"][i], value: v,
  }));
  const tierSegments = (Object.entries(ADMIN_STATS.partnereByTier) as [Tier, number][])
    .map(([t, v]) => ({ label: t, value: v, color: TIER_COLOR[t] }));
  const regionRows = (Object.entries(ADMIN_STATS.partnereByRegion) as [Region, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([region, count]) => ({ label: region, value: count }));

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      <div className="t-eyebrow">Data &amp; rapport</div>
      <h1 className="t-display mt-3">Forhandler Partnerskab i tal</h1>
      <p className="t-body-lg mt-3 max-w-[680px]">
        Hvordan klarer motoren sig på tværs af regioner, niveauer og temaer.
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Aktive partnere"        value="47"   delta="+15%" />
        <Tile label="Leads / partner / md"   value="3.2"  delta="+0.4" />
        <Tile label="Konvertering"           value="42%"  delta="+3 pp" />
        <Tile label="Omsætning / partner / md" value="10.4k" delta="+18%" />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h3 className="t-h3">Partner-vækst</h3>
              <p className="t-caption mt-0.5">6 måneder · alle selskaber</p>
            </div>
            <div className="text-right">
              <div className="text-[24px] font-semibold leading-none text-[var(--ink)] tabular-nums">47</div>
              <div className="text-[12px] font-semibold text-[#2D4A0F] mt-1">+15%</div>
            </div>
          </div>
          <InteractiveArea data={partnerGrowth} color={theme.accent} height={220} unit="partnere" />
        </div>

        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h3 className="t-h3">Leads pr. uge</h3>
              <p className="t-caption mt-0.5">8 uger · alle kanaler</p>
            </div>
            <div className="text-right">
              <div className="text-[24px] font-semibold leading-none text-[var(--ink)] tabular-nums">38</div>
              <div className="text-[12px] font-semibold text-[#2D4A0F] mt-1">+31%</div>
            </div>
          </div>
          <InteractiveArea data={leadsByWeek} color={theme.accent} height={220} unit="leads" />
        </div>

        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="t-h3">Partnere pr. region</h3>
            <span className="t-caption">8 regioner</span>
          </div>
          <BarMini rows={regionRows} />
        </div>

        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="t-h3">Niveau-fordeling</h3>
            <span className="t-caption">47 partnere</span>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="relative">
              <InteractivePie data={tierSegments} size={180} innerRadius={62} />
              <div className="absolute inset-0 grid place-items-center text-center pointer-events-none">
                <div>
                  <div className="text-[26px] font-semibold leading-none tabular-nums">{ADMIN_STATS.aktivePartnere}</div>
                  <div className="text-[12px] text-[var(--ink-3)] mt-1 uppercase tracking-wider">aktive</div>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-[13px]">
              {tierSegments.map((s) => (
                <li key={s.label} className="flex items-center gap-3">
                  <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="font-semibold text-[var(--ink)]">{s.label}</span>
                  <span className="text-[var(--ink-3)] tabular-nums">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function Tile({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="card">
      <div className="t-caption">{label}</div>
      <div className="text-[28px] font-semibold mt-1 leading-none text-[var(--ink)] tabular-nums">{value}</div>
      <div className="text-[12px] mt-2 text-[#2D4A0F] font-medium">{delta}</div>
    </div>
  );
}
