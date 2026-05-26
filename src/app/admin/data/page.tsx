"use client";
import { useTheme } from "@/components/ThemeProvider";
import { ADMIN_STATS, Region, Tier } from "@/lib/data";

export default function AdminData() {
  const { theme } = useTheme();
  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10">
      <div className="t-tagline" style={{ color: theme.accentInk }}>DATA &amp; RAPPORT</div>
      <h1 className="t-display mt-3 text-[var(--cr-navy-deep)]">Forhandler Partnerskab i tal</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Hvordan klarer motoren sig på tværs af regioner, niveauer og temaer.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Aktive partnere" value="47" delta="+15%" />
        <Tile label="Leads / partner / md" value="3.2" delta="+0.4" />
        <Tile label="Konvertering" value="42%" delta="+3 pp" />
        <Tile label="Omsætning / partner / md" value="10.4k" delta="+18%" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Partner growth chart */}
        <div className="card">
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>PARTNER-VÆKST · 6 MÅNEDER</div>
          <Chart values={[12, 18, 24, 31, 38, 47]} accent={theme.accent} labels={["Jan","Feb","Mar","Apr","Maj","Jun"]} />
        </div>

        {/* Leads-flow */}
        <div className="card">
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>LEADS PR. UGE · 8 UGER</div>
          <Chart values={[22, 18, 24, 26, 31, 29, 33, 38]} accent={theme.accent} labels={["U17","U18","U19","U20","U21","U22","U23","U24"]} />
        </div>

        {/* Region bar chart */}
        <div className="card">
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>PARTNERE PR. REGION</div>
          <Bars data={Object.entries(ADMIN_STATS.partnereByRegion) as [Region, number][]} color="var(--cr-blue)" />
        </div>

        {/* Tier donut */}
        <div className="card">
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>NIVEAU-FORDELING</div>
          <div className="flex items-center gap-6 mt-4">
            <Donut data={Object.entries(ADMIN_STATS.partnereByTier) as [Tier, number][]} />
            <ul className="space-y-2 text-[13px]">
              {Object.entries(ADMIN_STATS.partnereByTier).map(([tier, count]) => (
                <li key={tier} className="flex items-center gap-3">
                  <span className="size-3 rounded-full" style={{ background: tier === "Guld" ? "#D4A437" : tier === "Sølv" ? "#9DA6B0" : "#B07A4B" }} />
                  <span className="font-semibold text-[var(--cr-navy-deep)]">{tier}</span>
                  <span className="text-[var(--ink-muted-48)]">{count} partnere</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="card">
      <div className="t-caption">{label}</div>
      <div className="text-[28px] font-semibold mt-1 leading-none text-[var(--cr-navy-deep)]">{value}</div>
      <div className="text-[12px] mt-2 text-[#324A14] font-medium">{delta}</div>
    </div>
  );
}

function Chart({ values, accent, labels }: { values: number[]; accent: string; labels: string[] }) {
  const max = Math.max(...values);
  const w = 600, h = 160, padX = 16, padY = 24;
  const xstep = (w - padX * 2) / (values.length - 1);
  const yscale = (v: number) => h - padY - (v / max) * (h - padY * 2);
  const points = values.map((v, i) => `${padX + i * xstep},${yscale(v)}`).join(" ");
  const area = `${padX},${h - padY} ${points} ${padX + (values.length - 1) * xstep},${h - padY}`;
  return (
    <div className="mt-3">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
        <polygon points={area} fill={accent + "22"} />
        <polyline points={points} fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {values.map((v, i) => (
          <g key={i}>
            <circle cx={padX + i * xstep} cy={yscale(v)} r={i === values.length - 1 ? 4 : 2.5} fill={i === values.length - 1 ? accent : "white"} stroke={accent} strokeWidth="2" />
            <text x={padX + i * xstep} y={yscale(v) - 8} textAnchor="middle" fontSize="10" fontFamily="Inter" fill="var(--ink-muted-48)">{v}</text>
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-8 text-[10px] text-[var(--ink-muted-48)]" style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}>
        {labels.map((l, i) => <span key={i} className="text-center">{l}</span>)}
      </div>
    </div>
  );
}

function Bars({ data, color }: { data: [string, number][]; color: string }) {
  const max = Math.max(...data.map(([, v]) => v));
  return (
    <div className="mt-3 space-y-2.5">
      {data.sort((a, b) => b[1] - a[1]).map(([k, v]) => (
        <div key={k}>
          <div className="flex items-center justify-between text-[12px] mb-1">
            <span className="text-[var(--cr-navy-deep)]">{k}</span>
            <span className="text-[var(--ink-muted-48)]">{v}</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--divider-soft)] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: (v / max) * 100 + "%", background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Donut({ data }: { data: [string, number][] }) {
  const total = data.reduce((s, [, v]) => s + v, 0);
  const radius = 50, cx = 60, cy = 60, stroke = 16;
  let acc = 0;
  const c = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 120 120" className="size-32 shrink-0">
      <circle cx={cx} cy={cy} r={radius} stroke="#F0F0F0" strokeWidth={stroke} fill="none" />
      {data.map(([tier, v]) => {
        const len = (v / total) * c;
        const off = -((acc / total) * c);
        acc += v;
        const color = tier === "Guld" ? "#D4A437" : tier === "Sølv" ? "#9DA6B0" : "#B07A4B";
        return (
          <circle
            key={tier}
            cx={cx} cy={cy} r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${len} ${c}`}
            strokeDashoffset={off}
            transform="rotate(-90 60 60)"
          />
        );
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="20" fontWeight="600" fontFamily="Inter" fill="var(--cr-navy-deep)">{total}</text>
    </svg>
  );
}
