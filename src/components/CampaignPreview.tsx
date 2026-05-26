"use client";
import { Campaign, FORMATS, FormatKind, PartnerProfile } from "@/lib/data";
import { Theme } from "@/lib/themes";

interface Props {
  campaign: Campaign;
  partner: PartnerProfile;
  theme: Theme;
  format: FormatKind;
}

/** Dimensions in {w,h} for the preview SVG viewBox — proportional to the real format. */
const DIMS: Record<FormatKind, { w: number; h: number; kind: "portrait" | "square" | "tall" | "wide" | "landscape" }> = {
  "print-flyer":       { w: 420, h: 594, kind: "portrait" },   // A5
  "print-poster":      { w: 420, h: 594, kind: "portrait" },   // A3 proportional same as A5
  "print-magasin":     { w: 420, h: 594, kind: "portrait" },   // A4 magasin
  "print-bilstreamer": { w: 800, h: 200, kind: "wide" },
  "digital-facebook":  { w: 540, h: 540, kind: "square" },
  "digital-instagram": { w: 360, h: 640, kind: "tall" },
  "digital-email":     { w: 600, h: 200, kind: "wide" },
  "digital-google":    { w: 360, h: 300, kind: "landscape" },
};

export function CampaignPreview({ campaign, partner, theme, format }: Props) {
  const dim = DIMS[format];
  const fmt = FORMATS.find((f) => f.id === format)!;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="bg-white rounded-2xl ring-1 ring-[var(--hairline)] shadow-[0_10px_40px_rgba(0,26,51,0.08)] overflow-hidden w-full"
        style={{ maxWidth: dim.kind === "wide" ? 560 : dim.kind === "tall" ? 280 : 380 }}
      >
        <svg viewBox={`0 0 ${dim.w} ${dim.h}`} className="block w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          {format.startsWith("print-flyer") || format.startsWith("print-poster") || format.startsWith("print-magasin") ? (
            <PortraitLayout dim={dim} campaign={campaign} partner={partner} theme={theme} />
          ) : null}
          {format === "print-bilstreamer" || format === "digital-email" ? (
            <WideLayout dim={dim} campaign={campaign} partner={partner} theme={theme} />
          ) : null}
          {format === "digital-facebook" ? (
            <SquareLayout dim={dim} campaign={campaign} partner={partner} theme={theme} />
          ) : null}
          {format === "digital-instagram" ? (
            <TallLayout dim={dim} campaign={campaign} partner={partner} theme={theme} />
          ) : null}
          {format === "digital-google" ? (
            <LandscapeLayout dim={dim} campaign={campaign} partner={partner} theme={theme} />
          ) : null}
        </svg>
      </div>
      <div className="text-[11px] text-[var(--ink-muted-48)]">
        {fmt.label} · {fmt.dim}
      </div>
    </div>
  );
}

/* ───────── Portrait (flyer/poster/magasin) ───────── */
function PortraitLayout({ dim, campaign, partner, theme }: { dim: { w: number; h: number }; campaign: Campaign; partner: PartnerProfile; theme: Theme }) {
  return (
    <>
      {/* Carl Ras navy header */}
      <rect x="0" y="0" width={dim.w} height="56" fill="#001A33" />
      <rect x="20" y="14" width="28" height="28" rx="6" fill="#1158A3" />
      <text x="58" y="32" fill="white" fontSize="13" fontWeight="600" fontFamily="Inter">Carl Ras Partner</text>
      <text x="58" y="48" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="Inter" letterSpacing="1.5">FORHANDLER PARTNERSKAB</text>

      {/* Hero area with theme accent */}
      <rect x="0" y="56" width={dim.w} height={dim.h - 56 - 110} fill={theme.accentSoft} />
      <text x={dim.w / 2} y="140" textAnchor="middle" fontSize="68" fontFamily="Inter">{campaign.heroEmoji}</text>

      <foreignObject x="30" y="180" width={dim.w - 60} height="180">
        <div style={{ fontFamily: "Inter", color: theme.accentInk, fontSize: 26, lineHeight: 1.15, fontWeight: 700, letterSpacing: "-0.02em", textAlign: "center" }}>
          {campaign.hovedbudskab}
        </div>
      </foreignObject>

      <foreignObject x="40" y="370" width={dim.w - 80} height="80">
        <div style={{ fontFamily: "Inter", color: "#1D1D1F", fontSize: 13, lineHeight: 1.45, textAlign: "center" }}>
          {campaign.underbudskab}
        </div>
      </foreignObject>

      {/* CTA */}
      <rect x={(dim.w - 200) / 2} y="465" width="200" height="36" rx="18" fill={theme.accent} />
      <text x={dim.w / 2} y="488" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" fontFamily="Inter">
        {campaign.cta}
      </text>

      {/* Partner footer */}
      <rect x="0" y={dim.h - 110} width={dim.w} height="110" fill="white" />
      <line x1="20" y1={dim.h - 110} x2={dim.w - 20} y2={dim.h - 110} stroke="#E0E0E0" />

      <rect x="24" y={dim.h - 92} width="44" height="44" rx="10" fill={partner.logoBg} />
      <text x="46" y={dim.h - 62} textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Inter">{partner.initialer}</text>

      <text x="80" y={dim.h - 76} fontSize="13" fontWeight="700" fontFamily="Inter" fill="#002D59">{partner.firma}</text>
      <text x="80" y={dim.h - 62} fontSize="10" fontFamily="Inter" fill="#7A7A7A">{partner.faggruppe} · {partner.by}</text>
      <text x="80" y={dim.h - 48} fontSize="10" fontFamily="Inter" fill="#7A7A7A">{partner.telefon} · {partner.webadresse}</text>

      {/* "Carl Ras Partner"-badge */}
      <rect x={dim.w - 124} y={dim.h - 78} width="100" height="22" rx="11" fill="#1158A3" />
      <text x={dim.w - 74} y={dim.h - 63} textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Inter" letterSpacing="0.5">CARL RAS PARTNER</text>
      <text x={dim.w - 74} y={dim.h - 44} textAnchor="middle" fill="#7A7A7A" fontSize="8" fontFamily="Inter">Certificeret 2026</text>
    </>
  );
}

/* ───────── Wide (bilstreamer / email signature) ───────── */
function WideLayout({ dim, campaign, partner, theme }: { dim: { w: number; h: number }; campaign: Campaign; partner: PartnerProfile; theme: Theme }) {
  return (
    <>
      <rect x="0" y="0" width={dim.w} height={dim.h} fill="white" />
      {/* Left brand block */}
      <rect x="0" y="0" width={dim.w * 0.42} height={dim.h} fill={theme.accentSoft} />
      <text x="32" y="64" fontSize="42" fontFamily="Inter">{campaign.heroEmoji}</text>
      <text x="32" y={dim.h - 60} fontSize="20" fontWeight="700" fontFamily="Inter" fill={theme.accentInk}>{campaign.titel}</text>
      <text x="32" y={dim.h - 32} fontSize="11" fontFamily="Inter" fill="#1D1D1F">Carl Ras Partner</text>

      {/* Right partner block */}
      <rect x={dim.w * 0.42} y="0" width={dim.w * 0.58} height={dim.h} fill="#001A33" />
      <rect x={dim.w * 0.42 + 24} y="38" width="48" height="48" rx="11" fill={partner.logoBg} />
      <text x={dim.w * 0.42 + 48} y="70" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Inter">{partner.initialer}</text>

      <text x={dim.w * 0.42 + 84} y="58" fontSize="18" fontWeight="700" fontFamily="Inter" fill="white">{partner.firma}</text>
      <text x={dim.w * 0.42 + 84} y="76" fontSize="11" fontFamily="Inter" fill="rgba(255,255,255,0.65)">{partner.faggruppe} · {partner.by}</text>
      <text x={dim.w * 0.42 + 84} y={dim.h - 32} fontSize="12" fontWeight="600" fontFamily="Inter" fill="white">{partner.telefon}</text>
      <text x={dim.w * 0.42 + 84} y={dim.h - 16} fontSize="10" fontFamily="Inter" fill="rgba(255,255,255,0.55)">{partner.webadresse}</text>
    </>
  );
}

/* ───────── Square (Facebook) ───────── */
function SquareLayout({ dim, campaign, partner, theme }: { dim: { w: number; h: number }; campaign: Campaign; partner: PartnerProfile; theme: Theme }) {
  return (
    <>
      <rect x="0" y="0" width={dim.w} height={dim.h} fill={theme.accentSoft} />
      <text x={dim.w / 2} y={dim.h * 0.32} textAnchor="middle" fontSize="80" fontFamily="Inter">{campaign.heroEmoji}</text>
      <foreignObject x="32" y={dim.h * 0.38} width={dim.w - 64} height={dim.h * 0.34}>
        <div style={{ fontFamily: "Inter", color: theme.accentInk, fontSize: 26, lineHeight: 1.15, fontWeight: 700, letterSpacing: "-0.02em", textAlign: "center" }}>
          {campaign.hovedbudskab}
        </div>
      </foreignObject>
      {/* Partner footer band */}
      <rect x="0" y={dim.h - 78} width={dim.w} height="78" fill="white" />
      <rect x="24" y={dim.h - 60} width="42" height="42" rx="10" fill={partner.logoBg} />
      <text x="45" y={dim.h - 32} textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Inter">{partner.initialer}</text>
      <text x="80" y={dim.h - 42} fontSize="13" fontWeight="700" fontFamily="Inter" fill="#002D59">{partner.firma}</text>
      <text x="80" y={dim.h - 26} fontSize="10" fontFamily="Inter" fill="#7A7A7A">{partner.by} · {partner.telefon}</text>
      <rect x={dim.w - 110} y={dim.h - 50} width="86" height="22" rx="11" fill="#1158A3" />
      <text x={dim.w - 67} y={dim.h - 35} textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Inter" letterSpacing="0.5">CARL RAS PARTNER</text>
    </>
  );
}

/* ───────── Tall (Instagram story) ───────── */
function TallLayout({ dim, campaign, partner, theme }: { dim: { w: number; h: number }; campaign: Campaign; partner: PartnerProfile; theme: Theme }) {
  return (
    <>
      <rect x="0" y="0" width={dim.w} height={dim.h} fill={theme.accent} />
      <rect x="0" y={dim.h * 0.55} width={dim.w} height={dim.h * 0.45} fill={theme.accentSoft} />
      <text x={dim.w / 2} y={dim.h * 0.28} textAnchor="middle" fontSize="72" fontFamily="Inter">{campaign.heroEmoji}</text>

      <foreignObject x="24" y={dim.h * 0.6} width={dim.w - 48} height={dim.h * 0.16}>
        <div style={{ fontFamily: "Inter", color: theme.accentInk, fontSize: 22, lineHeight: 1.15, fontWeight: 700, letterSpacing: "-0.02em", textAlign: "center" }}>
          {campaign.hovedbudskab}
        </div>
      </foreignObject>

      <rect x="0" y={dim.h - 84} width={dim.w} height="84" fill="#001A33" />
      <rect x="20" y={dim.h - 68} width="40" height="40" rx="10" fill={partner.logoBg} />
      <text x="40" y={dim.h - 42} textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Inter">{partner.initialer}</text>
      <text x="72" y={dim.h - 52} fontSize="13" fontWeight="700" fontFamily="Inter" fill="white">{partner.firma}</text>
      <text x="72" y={dim.h - 36} fontSize="10" fontFamily="Inter" fill="rgba(255,255,255,0.7)">{partner.by} · {partner.telefon}</text>
      <text x="72" y={dim.h - 20} fontSize="9" fontFamily="Inter" fill="rgba(255,255,255,0.55)">Carl Ras Partner · {partner.webadresse}</text>
    </>
  );
}

/* ───────── Landscape (Google display 300x250 → 360x300) ───────── */
function LandscapeLayout({ dim, campaign, partner, theme }: { dim: { w: number; h: number }; campaign: Campaign; partner: PartnerProfile; theme: Theme }) {
  return (
    <>
      <rect x="0" y="0" width={dim.w} height={dim.h} fill="white" />
      <rect x="0" y="0" width={dim.w} height={dim.h * 0.5} fill={theme.accentSoft} />
      <text x="24" y="60" fontSize="36" fontFamily="Inter">{campaign.heroEmoji}</text>

      <foreignObject x="24" y="80" width={dim.w - 48} height="80">
        <div style={{ fontFamily: "Inter", color: theme.accentInk, fontSize: 16, lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.01em" }}>
          {campaign.hovedbudskab}
        </div>
      </foreignObject>

      <rect x="20" y={dim.h - 110} width="32" height="32" rx="8" fill={partner.logoBg} />
      <text x="36" y={dim.h - 89} textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Inter">{partner.initialer}</text>
      <text x="62" y={dim.h - 96} fontSize="11" fontWeight="700" fontFamily="Inter" fill="#002D59">{partner.firma}</text>
      <text x="62" y={dim.h - 82} fontSize="9" fontFamily="Inter" fill="#7A7A7A">{partner.by} · {partner.telefon}</text>

      <rect x="20" y={dim.h - 60} width={dim.w - 40} height="32" rx="16" fill={theme.accent} />
      <text x={dim.w / 2} y={dim.h - 40} textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="Inter">{campaign.cta}</text>
    </>
  );
}
