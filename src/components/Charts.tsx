"use client";
import * as React from "react";

/* ============================================================
   Chart primitives — pure SVG, no library, Apple-restrained.
   With tasteful CSS-driven entry animations.
   ============================================================ */

interface SparklineProps {
  values: number[];
  color?: string;
  className?: string;
  fill?: boolean;
  height?: number;
}

/** Tiny in-tile line chart. Embeds in KPI tiles. */
export function Sparkline({ values, color = "var(--accent)", fill = true, height = 36, className }: SparklineProps) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const w = 120, h = height, padY = 4;
  const xstep = w / (values.length - 1);
  const y = (v: number) => h - padY - ((v - min) / range) * (h - padY * 2);
  const points = values.map((v, i) => `${i * xstep},${y(v)}`).join(" ");
  const last = values[values.length - 1];
  const area = fill ? `0,${h} ${points} ${(values.length - 1) * xstep},${h}` : "";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={"w-full h-auto block " + (className ?? "")} preserveAspectRatio="none" aria-hidden="true">
      {fill && <polygon points={area} fill={color} opacity="0.12" className="chart-area" />}
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="chart-line" />
      <circle cx={(values.length - 1) * xstep} cy={y(last)} r="2.5" fill={color} className="chart-dot" />
    </svg>
  );
}

interface AreaChartProps {
  values: number[];
  labels?: string[];
  color?: string;
  height?: number;
  showAxis?: boolean;
}

/** Medium-sized area chart for performance metrics. */
export function AreaChart({ values, labels, color = "var(--accent)", height = 200, showAxis = true }: AreaChartProps) {
  const max = Math.max(...values, 1);
  const min = 0;
  const w = 800, h = height, padX = 16, padY = 28;
  const xstep = (w - padX * 2) / (values.length - 1);
  const y = (v: number) => h - padY - ((v - min) / (max - min || 1)) * (h - padY * 2);
  const points = values.map((v, i) => `${padX + i * xstep},${y(v)}`).join(" ");
  const area = `${padX},${h - padY} ${points} ${padX + (values.length - 1) * xstep},${h - padY}`;
  const lastIdx = values.length - 1;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto block" preserveAspectRatio="none">
        {/* Grid lines */}
        {showAxis && [0.25, 0.5, 0.75].map((p) => {
          const yy = padY + (h - padY * 2) * p;
          return <line key={p} x1={padX} y1={yy} x2={w - padX} y2={yy} stroke="var(--line-2)" strokeWidth="1" strokeDasharray="2 4" />;
        })}
        <polygon points={area} fill={color} opacity="0.10" className="chart-area" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="chart-line" />
        {values.map((v, i) => (
          <circle
            key={i}
            cx={padX + i * xstep}
            cy={y(v)}
            r={i === lastIdx ? 5 : 0}
            fill="white"
            stroke={color}
            strokeWidth="2"
            className={i === lastIdx ? "chart-dot" : ""}
          />
        ))}
        {/* Last value annotation */}
        <g transform={`translate(${padX + lastIdx * xstep}, ${y(values[lastIdx]) - 12})`} className="chart-fade">
          <rect x="-18" y="-14" width="36" height="20" rx="6" fill={color} />
          <text x="0" y="0" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="Inter" fill="white">{values[lastIdx]}</text>
        </g>
      </svg>
      {labels && (
        <div className="grid mt-1 px-4" style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}>
          {labels.map((l, i) => (
            <span key={i} className="text-center text-[12px] text-[var(--ink-3)] tabular-nums">{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

interface RadialProps {
  value: number;
  size?: number;
  thickness?: number;
  color?: string;
  /** Optional gradient — when both stops are set, the ring fades from `from` to `to`. */
  gradientFrom?: string;
  gradientTo?: string;
  trackColor?: string;
  label?: string;
  sub?: string;
  /** Optional custom center renderer — overrides label/sub when provided. */
  children?: React.ReactNode;
}

/** Big radial progress arc. Animates from 0 to value via stroke-dashoffset.
 *  Supports an optional gradient stroke (gradientFrom → gradientTo) and a
 *  custom center node via children. */
export function Radial({ value, size = 160, thickness = 14, color = "var(--accent)", gradientFrom, gradientTo, trackColor = "var(--line-2)", label, sub, children }: RadialProps) {
  const v = Math.min(100, Math.max(0, value));
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;
  // Stable gradient id per render — avoids collisions if multiple Radials on the page
  const gradId = React.useId();
  const useGradient = Boolean(gradientFrom && gradientTo);
  const stroke = useGradient ? `url(#${gradId})` : color;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block -rotate-90">
        {useGradient && (
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
        )}
        <circle cx={cx} cy={cy} r={r} stroke={trackColor} strokeWidth={thickness} fill="none" />
        <circle
          cx={cx} cy={cy} r={r}
          stroke={stroke}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          strokeDashoffset={dash}
          style={{
            animation: "radial-sweep 1200ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms forwards",
          }}
        />
        <style>{`@keyframes radial-sweep { from { stroke-dashoffset: ${dash}; } to { stroke-dashoffset: 0; } }`}</style>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center chart-fade">
        {children ?? (
          <>
            {label && <div className="text-[28px] font-semibold leading-none text-[var(--ink)] tabular-nums">{label}</div>}
            {sub && <div className="text-[12px] text-[var(--ink-3)] mt-1.5 max-w-[100px]">{sub}</div>}
          </>
        )}
      </div>
    </div>
  );
}

interface DonutSegment { label: string; value: number; color: string; }

/** Multi-segment donut chart. Segments animate in with staggered delay. */
export function Donut({ segments, size = 140, thickness = 18 }: { segments: DonutSegment[]; size?: number; thickness?: number }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  // Pre-compute the cumulative offset for each segment (no in-render mutation)
  const cumValues = segments.reduce<number[]>((arr, seg, i) => {
    arr.push((i === 0 ? 0 : arr[i - 1]) + seg.value);
    return arr;
  }, []);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block -rotate-90">
      <circle cx={cx} cy={cy} r={r} stroke="var(--line-2)" strokeWidth={thickness} fill="none" />
      {segments.map((seg, i) => {
        const len = (seg.value / total) * c;
        const priorTotal = i === 0 ? 0 : cumValues[i - 1];
        const off = -((priorTotal / total) * c);
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            stroke={seg.color}
            strokeWidth={thickness}
            fill="none"
            strokeDasharray={`${len - 2} ${c}`}
            strokeDashoffset={off}
            strokeLinecap="butt"
            style={{
              opacity: 0,
              animation: `chart-fade-in 500ms ease-out ${300 + i * 150}ms forwards`,
            }}
          />
        );
      })}
    </svg>
  );
}

/** Horizontal mini-bar list — used for category breakdowns. */
export function BarMini({ rows, max }: { rows: { label: string; value: number; color?: string; suffix?: string }[]; max?: number }) {
  const m = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i}>
          <div className="flex items-center justify-between text-[12px] mb-1">
            <span className="text-[var(--ink-2)] font-medium">{r.label}</span>
            <span className="text-[var(--ink-3)] tabular-nums">{r.value}{r.suffix ?? ""}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--canvas-2)] overflow-hidden">
            <div
              className="h-full rounded-full chart-bar"
              style={{
                width: `${(r.value / m) * 100}%`,
                background: r.color ?? "var(--accent)",
                animationDelay: `${i * 80}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface MiniBarChartProps {
  values: number[];
  color?: string;
  height?: number;
  highlightLast?: boolean;
}

/** Tiny bar chart for in-tile data viz. */
export function MiniBarChart({ values, color = "var(--accent)", height = 60, highlightLast = true }: MiniBarChartProps) {
  const max = Math.max(...values, 1);
  const w = 280, h = height, gap = 4;
  const barW = (w - gap * (values.length - 1)) / values.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto block" preserveAspectRatio="none" aria-hidden="true">
      {values.map((v, i) => {
        const bh = (v / max) * h;
        const isLast = i === values.length - 1;
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={h - bh}
            width={barW}
            height={bh}
            rx="2"
            fill={highlightLast && isLast ? color : color}
            opacity={highlightLast && !isLast ? 0.32 : 1}
            className="chart-bar-v"
            style={{
              transformOrigin: `${i * (barW + gap) + barW / 2}px ${h}px`,
              animationDelay: `${i * 50}ms`,
            }}
          />
        );
      })}
    </svg>
  );
}
