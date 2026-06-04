"use client";
import { PartnerProfile, Region } from "@/lib/data";
import { useState } from "react";

/* Approximate viewbox positions for Danish regions — abstract, not geographic-precise.
   These also define the clickable region zones (each REGION_POS becomes a tappable
   target so the map can be used to filter the partner list). */
const REGION_POS: Record<Region, { cx: number; cy: number; r: number }> = {
  Nordsjælland:      { cx: 430, cy: 165, r: 28 },
  Hovedstaden:       { cx: 450, cy: 205, r: 26 },
  Vestkysten:        { cx: 175, cy: 145, r: 30 },
  Bornholm:          { cx: 555, cy: 280, r: 22 },
  "Lolland-Falster": { cx: 395, cy: 305, r: 30 },
  Fyn:               { cx: 305, cy: 240, r: 28 },
  Østjylland:        { cx: 230, cy: 220, r: 30 },
  Nordjylland:       { cx: 240, cy: 90,  r: 30 },
};

const ALL_REGIONS = Object.keys(REGION_POS) as Region[];

interface Props {
  partners: PartnerProfile[];
  selectedRegion?: Region | "Alle";
  onPick?: (p: PartnerProfile) => void;
  onRegionClick?: (region: Region | "Alle") => void;
}

export function DenmarkMap({ partners, selectedRegion = "Alle", onPick, onRegionClick }: Props) {
  const [hoverPartner, setHoverPartner] = useState<PartnerProfile | null>(null);
  const [hoverRegion, setHoverRegion] = useState<Region | null>(null);

  // Count partners per region — used both for the heat-tint and the label badge.
  const countByRegion = ALL_REGIONS.reduce<Record<string, number>>((acc, r) => {
    acc[r] = partners.filter((p) => p.region === r).length;
    return acc;
  }, {});

  const handleRegionClick = (r: Region) => {
    if (!onRegionClick) return;
    // Toggle off if already selected
    onRegionClick(selectedRegion === r ? "Alle" : r);
  };

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 600 400" className="w-full h-auto select-none">
        {/* Sea background */}
        <rect x="0" y="0" width="600" height="400" fill="#E8F0FA" />

        {/* Stylized landmasses — decorative, not interactive */}
        <path
          d="M150 50 C140 80 130 110 145 145 C155 175 165 200 175 220 C185 240 195 255 210 270 C220 285 225 290 235 295 C245 290 255 280 260 260 C270 235 275 210 270 180 C265 160 255 140 250 120 C240 90 215 60 195 50 C180 45 165 47 150 50 Z"
          fill="white" stroke="#C0CFE0" strokeWidth="1.5"
          pointerEvents="none"
        />
        <ellipse cx="305" cy="240" rx="32" ry="22" fill="white" stroke="#C0CFE0" strokeWidth="1.5" pointerEvents="none" />
        <path
          d="M390 140 C385 130 405 120 430 120 C460 122 480 140 478 175 C475 210 460 240 440 245 C420 248 400 230 388 200 C378 175 380 150 390 140 Z"
          fill="white" stroke="#C0CFE0" strokeWidth="1.5"
          pointerEvents="none"
        />
        <ellipse cx="395" cy="305" rx="48" ry="14" fill="white" stroke="#C0CFE0" strokeWidth="1.5" transform="rotate(-12 395 305)" pointerEvents="none" />
        <ellipse cx="555" cy="280" rx="14" ry="10" fill="white" stroke="#C0CFE0" strokeWidth="1.5" pointerEvents="none" />

        {/* Clickable region zones — render BEFORE the pins so pins sit on top.
            Each zone is a soft tinted circle that intensifies on hover/select.
            Heat scales lightly with partner count so dense regions read first. */}
        {ALL_REGIONS.map((region) => {
          const pos = REGION_POS[region];
          const count = countByRegion[region] ?? 0;
          const isActive = selectedRegion === region;
          const isHover = hoverRegion === region;
          const heat = Math.min(0.18, count * 0.025);
          const fill = isActive
            ? "rgba(17, 88, 163, 0.18)"
            : isHover
              ? "rgba(17, 88, 163, 0.10)"
              : `rgba(17, 88, 163, ${heat})`;
          const stroke = isActive ? "#1158A3" : "transparent";
          return (
            <g
              key={`zone-${region}`}
              onMouseEnter={() => setHoverRegion(region)}
              onMouseLeave={() => setHoverRegion((h) => (h === region ? null : h))}
              onClick={() => handleRegionClick(region)}
              style={{ cursor: onRegionClick ? "pointer" : "default" }}
            >
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={pos.r}
                fill={fill}
                stroke={stroke}
                strokeWidth={isActive ? 1.5 : 0}
                strokeDasharray={isActive ? "3 3" : undefined}
                style={{
                  // Smooth heat-tint + selection ring instead of binary snap.
                  // 200ms ease-out matches the app's standard Apple curve.
                  transition:
                    "fill 200ms cubic-bezier(0.22, 1, 0.36, 1), stroke 200ms cubic-bezier(0.22, 1, 0.36, 1), stroke-width 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </g>
          );
        })}

        {/* Region labels — sit above zones but ignore pointer events so they
            don't block the zone click. */}
        {ALL_REGIONS.map((region) => {
          const pos = REGION_POS[region];
          const isActive = selectedRegion === region;
          return (
            <text
              key={`label-${region}`}
              x={pos.cx}
              y={pos.cy - pos.r - 4}
              fill={isActive ? "#1158A3" : "#7A7A7A"}
              fontSize="10"
              fontWeight={isActive ? 700 : 500}
              fontFamily="Inter"
              textAnchor="middle"
              pointerEvents="none"
            >
              {region}
            </text>
          );
        })}

        {/* Partner pins */}
        {partners.map((p, i) => {
          const base = REGION_POS[p.region];
          // Jitter pins within region so multiple partners don't overlap
          const jitterX = ((i * 13) % 24) - 12;
          const jitterY = ((i * 17) % 18) - 9;
          const cx = base.cx + jitterX;
          const cy = base.cy + jitterY;
          const muted = selectedRegion !== "Alle" && p.region !== selectedRegion;
          return (
            <g
              key={p.id}
              onMouseEnter={() => setHoverPartner(p)}
              onMouseLeave={() => setHoverPartner((h) => (h?.id === p.id ? null : h))}
              onClick={(e) => {
                e.stopPropagation();
                onPick?.(p);
              }}
              style={{
                cursor: "pointer",
                opacity: muted ? 0.25 : 1,
                // Pin fade-in/out when region filter changes
                transition: "opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <circle cx={cx} cy={cy} r={8} fill="white" stroke={p.logoBg} strokeWidth="2.5" />
              <circle cx={cx} cy={cy} r={3.5} fill={p.logoBg} />
            </g>
          );
        })}

        {/* Hover label for partner pin */}
        {hoverPartner && (
          <g pointerEvents="none">
            <rect
              x={(REGION_POS[hoverPartner.region].cx) + 14}
              y={(REGION_POS[hoverPartner.region].cy) - 14}
              width="170"
              height="40"
              rx="8"
              fill="white"
              stroke="#E0E0E0"
            />
            <text x={REGION_POS[hoverPartner.region].cx + 22} y={REGION_POS[hoverPartner.region].cy + 2} fontSize="11" fontFamily="Inter" fontWeight="600" fill="#002D59">{hoverPartner.firma}</text>
            <text x={REGION_POS[hoverPartner.region].cx + 22} y={REGION_POS[hoverPartner.region].cy + 16} fontSize="10" fontFamily="Inter" fill="#7A7A7A">{hoverPartner.by} · {hoverPartner.faggruppe}</text>
          </g>
        )}
      </svg>

      {/* Top-right counter pill */}
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-lg border border-[var(--hairline)] px-3 py-1.5 text-[12px] text-[var(--ink-muted-48)]">
        {partners.length} partnere
      </div>

      {/* Top-left helper — reads as "the map is interactive" */}
      {onRegionClick && (
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-lg border border-[var(--hairline)] px-3 py-1.5 text-[12px] text-[var(--ink-muted-48)] flex items-center gap-2">
          {selectedRegion !== "Alle" ? (
            <>
              <span>
                Region: <span className="font-semibold text-[var(--accent)]">{selectedRegion}</span>
              </span>
              <button
                type="button"
                onClick={() => onRegionClick("Alle")}
                className="text-[11px] underline text-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                Vis hele Danmark
              </button>
            </>
          ) : (
            <span>Klik på et område for at filtrere</span>
          )}
        </div>
      )}
    </div>
  );
}
