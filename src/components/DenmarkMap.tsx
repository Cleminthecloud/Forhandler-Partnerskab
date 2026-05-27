"use client";
import { PartnerProfile, Region } from "@/lib/data";
import { useState } from "react";

/* Approximate viewbox positions for Danish regions — abstract, not geographic-precise */
const REGION_POS: Record<Region, { cx: number; cy: number }> = {
  Nordsjælland:      { cx: 430, cy: 165 },
  Hovedstaden:       { cx: 440, cy: 200 },
  Vestkysten:        { cx: 175, cy: 145 },
  Bornholm:          { cx: 555, cy: 280 },
  "Lolland-Falster": { cx: 395, cy: 305 },
  Fyn:               { cx: 305, cy: 240 },
  Østjylland:        { cx: 230, cy: 220 },
  Nordjylland:       { cx: 240, cy: 90 },
};

interface Props {
  partners: PartnerProfile[];
  selectedRegion?: Region | "Alle";
  onPick?: (p: PartnerProfile) => void;
}

export function DenmarkMap({ partners, selectedRegion = "Alle", onPick }: Props) {
  const [hover, setHover] = useState<PartnerProfile | null>(null);

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 600 400" className="w-full h-auto">
        {/* Sea background */}
        <rect x="0" y="0" width="600" height="400" fill="#E8F0FA" />
        {/* Stylized Jylland */}
        <path
          d="M150 50 C140 80 130 110 145 145 C155 175 165 200 175 220 C185 240 195 255 210 270 C220 285 225 290 235 295 C245 290 255 280 260 260 C270 235 275 210 270 180 C265 160 255 140 250 120 C240 90 215 60 195 50 C180 45 165 47 150 50 Z"
          fill="white" stroke="#C0CFE0" strokeWidth="1.5"
        />
        {/* Fyn */}
        <ellipse cx="305" cy="240" rx="32" ry="22" fill="white" stroke="#C0CFE0" strokeWidth="1.5" />
        {/* Sjælland */}
        <path
          d="M390 140 C385 130 405 120 430 120 C460 122 480 140 478 175 C475 210 460 240 440 245 C420 248 400 230 388 200 C378 175 380 150 390 140 Z"
          fill="white" stroke="#C0CFE0" strokeWidth="1.5"
        />
        {/* Lolland-Falster */}
        <ellipse cx="395" cy="305" rx="48" ry="14" fill="white" stroke="#C0CFE0" strokeWidth="1.5" transform="rotate(-12 395 305)" />
        {/* Bornholm */}
        <ellipse cx="555" cy="280" rx="14" ry="10" fill="white" stroke="#C0CFE0" strokeWidth="1.5" />

        {/* Region labels */}
        {Object.entries(REGION_POS).map(([region, pos]) => (
          <text key={region} x={pos.cx} y={pos.cy - 22} fill="#7A7A7A" fontSize="9" fontFamily="Inter" textAnchor="middle" pointerEvents="none">
            {region}
          </text>
        ))}

        {/* Partner pins */}
        {partners.map((p, i) => {
          const base = REGION_POS[p.region];
          // Jitter pins within region so multiple partners don't overlap
          const jitterX = ((i * 13) % 30) - 15;
          const jitterY = ((i * 17) % 22) - 11;
          const cx = base.cx + jitterX;
          const cy = base.cy + jitterY;
          const muted = selectedRegion !== "Alle" && p.region !== selectedRegion;
          return (
            <g
              key={p.id}
              onMouseEnter={() => setHover(p)}
              onMouseLeave={() => setHover((h) => (h?.id === p.id ? null : h))}
              onClick={() => onPick?.(p)}
              style={{ cursor: "pointer", opacity: muted ? 0.25 : 1 }}
            >
              <circle cx={cx} cy={cy} r={9} fill="white" stroke={p.logoBg} strokeWidth="2.5" />
              <circle cx={cx} cy={cy} r={4} fill={p.logoBg} />
            </g>
          );
        })}

        {/* Hover label */}
        {hover && (
          <g pointerEvents="none">
            <rect
              x={(REGION_POS[hover.region].cx) + 14}
              y={(REGION_POS[hover.region].cy) - 12}
              width="160"
              height="38"
              rx="8"
              fill="white"
              stroke="#E0E0E0"
            />
            <text x={REGION_POS[hover.region].cx + 22} y={REGION_POS[hover.region].cy + 4} fontSize="11" fontFamily="Inter" fontWeight="600" fill="#002D59">{hover.firma}</text>
            <text x={REGION_POS[hover.region].cx + 22} y={REGION_POS[hover.region].cy + 18} fontSize="10" fontFamily="Inter" fill="#7A7A7A">{hover.by} · {hover.faggruppe}</text>
          </g>
        )}
      </svg>

      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-lg border border-[var(--hairline)] px-3 py-1.5 text-[12px] text-[var(--ink-muted-48)]">
        {partners.length} partnere
      </div>
    </div>
  );
}
