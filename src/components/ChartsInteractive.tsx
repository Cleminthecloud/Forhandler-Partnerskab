"use client";

/* ============================================================
   shadcn-style interactive charts using Recharts.
   Gradient area fills, hover crosshair, custom tooltips.
   ============================================================ */

import {
  AreaChart as RAreaChart,
  Area,
  BarChart as RBarChart,
  Bar,
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AreaPoint { label: string; value: number; }

interface InteractiveAreaProps {
  data: AreaPoint[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
  unit?: string;
}

/** Apple/shadcn-style area chart with gradient + crosshair tooltip. */
export function InteractiveArea({ data, color = "var(--accent)", height = 240, formatValue, unit }: InteractiveAreaProps) {
  const gradId = "grad-" + Math.random().toString(36).slice(2);
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RAreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--line-2)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--ink-3)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "var(--ink-3)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "var(--ink-3)", strokeWidth: 1, strokeDasharray: "3 3" }}
            content={(props) => {
              const { active, payload } = props as unknown as { active?: boolean; payload?: Array<{ value: number; payload: AreaPoint }> };
              if (!active || !payload || !payload.length) return null;
              const p = payload[0];
              return (
                <div className="bg-white rounded-[var(--r-md)] shadow-[var(--shadow-3)] border border-[var(--line-2)] px-3 py-2 text-[12px]">
                  <div className="text-[var(--ink-3)] mb-0.5">{p.payload.label}</div>
                  <div className="font-semibold text-[var(--ink)] tabular-nums">
                    {formatValue ? formatValue(p.value) : p.value}{unit ? ` ${unit}` : ""}
                  </div>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.4}
            fill={`url(#${gradId})`}
            activeDot={{ r: 5, fill: color, stroke: "white", strokeWidth: 2 }}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface InteractiveBarProps {
  data: AreaPoint[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
  unit?: string;
}

/** shadcn-style bar chart with hover tooltip. */
export function InteractiveBar({ data, color = "var(--accent)", height = 240, formatValue, unit }: InteractiveBarProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RBarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--line-2)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "var(--ink-3)", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "var(--ink-3)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatValue} width={40} />
          <Tooltip
            cursor={{ fill: "var(--canvas-2)" }}
            content={(props) => {
              const { active, payload } = props as unknown as { active?: boolean; payload?: Array<{ value: number; payload: AreaPoint }> };
              if (!active || !payload || !payload.length) return null;
              const p = payload[0];
              return (
                <div className="bg-white rounded-[var(--r-md)] shadow-[var(--shadow-3)] border border-[var(--line-2)] px-3 py-2 text-[12px]">
                  <div className="text-[var(--ink-3)] mb-0.5">{p.payload.label}</div>
                  <div className="font-semibold text-[var(--ink)] tabular-nums">
                    {formatValue ? formatValue(p.value) : p.value}{unit ? ` ${unit}` : ""}
                  </div>
                </div>
              );
            }}
          />
          <Bar
            dataKey="value"
            fill={color}
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={700}
          />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface InteractiveLineProps {
  series: { label: string; data: AreaPoint[]; color: string }[];
  height?: number;
  formatValue?: (v: number) => string;
}

/** Multi-line chart (useful for comparing this partner vs. peer average). */
export function InteractiveLine({ series, height = 240, formatValue }: InteractiveLineProps) {
  // Merge series into a single recharts-friendly data shape
  const labels = series[0]?.data.map((d) => d.label) ?? [];
  const data = labels.map((label, i) => {
    const row: Record<string, string | number> = { label };
    series.forEach((s) => { row[s.label] = s.data[i].value; });
    return row;
  });
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RLineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--line-2)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "var(--ink-3)", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "var(--ink-3)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatValue} width={40} />
          <Tooltip
            cursor={{ stroke: "var(--ink-3)", strokeDasharray: "3 3" }}
            content={(props) => {
              const { active, payload, label } = props as unknown as { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string };
              if (!active || !payload || !payload.length) return null;
              return (
                <div className="bg-white rounded-[var(--r-md)] shadow-[var(--shadow-3)] border border-[var(--line-2)] px-3 py-2 text-[12px] min-w-[140px]">
                  <div className="text-[var(--ink-3)] mb-1">{label}</div>
                  {payload.map((p) => (
                    <div key={p.name} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-[var(--ink-2)]">{p.name}</span>
                      </span>
                      <span className="font-semibold text-[var(--ink)] tabular-nums">
                        {formatValue ? formatValue(p.value) : p.value}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          {series.map((s) => (
            <Line
              key={s.label}
              type="monotone"
              dataKey={s.label}
              stroke={s.color}
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 4, fill: s.color, stroke: "white", strokeWidth: 2 }}
              isAnimationActive
              animationDuration={900}
            />
          ))}
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface InteractivePieProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  innerRadius?: number;
}

/** shadcn-style donut with center label + hover tooltip. */
export function InteractivePie({ data, size = 220, innerRadius = 60 }: InteractivePieProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ width: size, height: size }} className="relative">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={innerRadius}
            outerRadius={size / 2 - 4}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
            isAnimationActive
            animationDuration={800}
          >
            {data.map((d) => (
              <Cell key={d.label} fill={d.color} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            content={(props) => {
              const { active, payload } = props as unknown as { active?: boolean; payload?: Array<{ payload: { label: string; value: number; color: string } }> };
              if (!active || !payload || !payload.length) return null;
              const p = payload[0].payload;
              const pct = Math.round((p.value / total) * 100);
              return (
                <div className="bg-white rounded-[var(--r-md)] shadow-[var(--shadow-3)] border border-[var(--line-2)] px-3 py-2 text-[12px]">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-[var(--ink-2)]">{p.label}</span>
                  </div>
                  <div className="font-semibold text-[var(--ink)] tabular-nums mt-0.5">
                    {p.value.toLocaleString("da-DK")} · {pct}%
                  </div>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
