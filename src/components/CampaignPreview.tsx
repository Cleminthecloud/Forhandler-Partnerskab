"use client";
import { Campaign, FormatKind, PartnerProfile } from "@/lib/data";
import { Theme } from "@/lib/themes";

/* =====================================================================
   Real ad-layout renderer. HTML/CSS — not SVG. Each format is a piece
   of media (no UI chrome). Image variant drives the photo area inside
   the ad. When real photos drop into /public/campaigns/, swap bg.
   ===================================================================== */

export interface CampaignImage {
  id: string;
  label: string;
  bg: string;          // CSS background — gradient or url(...) center/cover
  glyph?: string;      // emoji placeholder if no real photo yet
  fg?: "light" | "dark"; // hint for overlay text color
}

export const DEFAULT_IMAGES: CampaignImage[] = [
  {
    id: "lifestyle",
    label: "Lifestyle",
    bg: "linear-gradient(135deg, #F8C77A 0%, #E89A4A 55%, #B86825 100%)",
    glyph: "🏖️",
    fg: "light",
  },
  {
    id: "atmosfaere",
    label: "Atmosfære",
    bg: "linear-gradient(160deg, #6A8AAB 0%, #2C476A 60%, #1A2D45 100%)",
    glyph: "🌅",
    fg: "light",
  },
  {
    id: "produkt",
    label: "Produkt",
    bg: "linear-gradient(135deg, #E0D4C2 0%, #B89A78 60%, #7A5B3E 100%)",
    glyph: "🔐",
    fg: "dark",
  },
  {
    id: "studio",
    label: "Studio",
    bg: "linear-gradient(180deg, #2A2A2C 0%, #0E0E10 100%)",
    glyph: "📱",
    fg: "light",
  },
];

interface Props {
  campaign: Campaign;
  partner: PartnerProfile;
  theme: Theme;
  format: FormatKind;
  image: CampaignImage;
}

export function CampaignPreview({ campaign, partner, theme, format, image }: Props) {
  switch (format) {
    case "print-flyer":       return <FlyerA5         {...{ campaign, partner, theme, image }} />;
    case "print-poster":      return <PosterA3        {...{ campaign, partner, theme, image }} />;
    case "print-magasin":     return <Magasin         {...{ campaign, partner, theme, image }} />;
    case "print-bilstreamer": return <Bilstreamer     {...{ campaign, partner, theme, image }} />;
    case "digital-facebook":  return <FacebookSq      {...{ campaign, partner, theme, image }} />;
    case "digital-instagram": return <InstagramStory  {...{ campaign, partner, theme, image }} />;
    case "digital-email":     return <EmailSig        {...{ campaign, partner, theme, image }} />;
    case "digital-google":    return <GoogleAd        {...{ campaign, partner, theme, image }} />;
    default: return null;
  }
}

/* =================== shared bits =================== */

function PhotoArea({ image, height = "100%", className }: { image: CampaignImage; height?: string | number; className?: string }) {
  return (
    <div
      className={"relative overflow-hidden " + (className ?? "")}
      style={{ background: image.bg, height }}
      aria-hidden="true"
    >
      {image.glyph && (
        <div className="absolute inset-0 grid place-items-center text-[clamp(48px,12vw,120px)] select-none" style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.22))" }}>
          {image.glyph}
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 100%, rgba(0,0,0,0.18) 0%, transparent 60%)" }} />
    </div>
  );
}

function CertBadge({ dense }: { dense?: boolean }) {
  return (
    <div
      className="rounded shrink-0 grid text-white text-center content-center"
      style={{
        background: "#1158A3",
        width: dense ? 44 : 56,
        height: dense ? 26 : 32,
        padding: dense ? "3px 4px" : "4px 6px",
      }}
    >
      <div style={{ fontSize: dense ? 6 : 7, fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1 }}>CARL RAS</div>
      <div style={{ fontSize: dense ? 7 : 9, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1.1, marginTop: 1 }}>PARTNER</div>
    </div>
  );
}

function PartnerFooter({ partner }: { partner: PartnerProfile }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-md grid place-items-center text-white font-bold shrink-0"
        style={{ background: partner.logoBg, width: 36, height: 36, fontSize: 11 }}
      >
        {partner.initialer}
      </div>
      <div className="leading-tight min-w-0">
        <div className="font-bold truncate" style={{ fontSize: 12, color: "#1D1D1F" }}>{partner.firma}</div>
        <div className="truncate" style={{ fontSize: 9.5, color: "#515154" }}>{partner.faggruppe} · {partner.by}</div>
        <div className="truncate" style={{ fontSize: 9.5, color: "#515154" }}>{partner.telefon} · {partner.webadresse}</div>
      </div>
      <CertBadge />
    </div>
  );
}

/* =================== Flyer A5 =================== */
function FlyerA5({ campaign, partner, theme, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  return (
    <div
      className="bg-white shadow-[0_20px_60px_rgba(0,26,51,0.18)] flex flex-col overflow-hidden"
      style={{ width: 360, aspectRatio: "148/210", borderRadius: 4 }}
    >
      <PhotoArea image={image} height="56%" />
      <div className="flex-1 flex flex-col px-5 pt-4 pb-3">
        <h3 className="font-bold leading-[1.05] tracking-tight" style={{ color: "#1D1D1F", fontSize: 24 }}>
          {campaign.hovedbudskab}
        </h3>
        <p className="mt-2 leading-[1.4]" style={{ color: "#515154", fontSize: 12 }}>
          {campaign.underbudskab}
        </p>
        <div className="mt-3">
          <span
            className="inline-block px-3.5 py-1.5 rounded-full text-white font-semibold"
            style={{ background: theme.accent, fontSize: 11 }}
          >
            {campaign.cta}
          </span>
        </div>
        <div className="mt-auto pt-3 border-t border-[#E5E5EA]">
          <PartnerFooter partner={partner} />
        </div>
      </div>
    </div>
  );
}

/* =================== Poster A3 =================== */
function PosterA3({ campaign, partner, theme, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  return (
    <div
      className="bg-white shadow-[0_20px_60px_rgba(0,26,51,0.18)] flex flex-col overflow-hidden"
      style={{ width: 340, aspectRatio: "297/420", borderRadius: 4 }}
    >
      <PhotoArea image={image} height="62%" />
      <div className="flex-1 flex flex-col px-5 pt-4 pb-3">
        <h3 className="font-bold leading-[1.02] tracking-tight" style={{ color: "#1D1D1F", fontSize: 26 }}>
          {campaign.hovedbudskab}
        </h3>
        <p className="mt-2 leading-[1.4]" style={{ color: "#515154", fontSize: 12 }}>
          {campaign.underbudskab}
        </p>
        <div className="mt-auto pt-3 border-t border-[#E5E5EA] flex items-center gap-2">
          <span
            className="inline-block px-3 py-1.5 rounded-full text-white font-semibold shrink-0"
            style={{ background: theme.accent, fontSize: 10 }}
          >
            {campaign.cta}
          </span>
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <div className="rounded-md grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: 26, height: 26, fontSize: 9 }}>
              {partner.initialer}
            </div>
            <div className="leading-tight min-w-0 flex-1">
              <div className="font-bold truncate text-[10px] text-[#1D1D1F]">{partner.firma}</div>
              <div className="text-[#515154] truncate text-[8px]">{partner.telefon}</div>
            </div>
            <CertBadge dense />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== Magasin annonce =================== */
function Magasin({ campaign, partner, theme, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  const overlayDark = image.fg === "light";
  const inkColor = overlayDark ? "#FFFFFF" : "#1D1D1F";
  void theme;
  return (
    <div
      className="shadow-[0_20px_60px_rgba(0,26,51,0.18)] relative overflow-hidden"
      style={{ width: 360, aspectRatio: "210/297", background: image.bg, borderRadius: 4 }}
    >
      {image.glyph && (
        <div className="absolute inset-0 grid place-items-center text-[120px] select-none" style={{ filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.28))" }}>
          {image.glyph}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-[55%]" style={{
        background: overlayDark
          ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
          : "linear-gradient(to top, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.4) 60%, transparent 100%)",
      }} />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-8">
        <h3 className="font-bold leading-[1.0] tracking-tight" style={{ color: inkColor, fontSize: 30 }}>
          {campaign.hovedbudskab}
        </h3>
        <p className="mt-3 leading-[1.4] max-w-[260px]" style={{ color: inkColor, opacity: 0.92, fontSize: 12 }}>
          {campaign.underbudskab}
        </p>
        <div className="mt-5 flex items-end justify-between">
          <div className="min-w-0">
            <div className="text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: inkColor, opacity: 0.7 }}>Lokal partner</div>
            <div className="font-bold mt-0.5 truncate" style={{ color: inkColor, fontSize: 13 }}>{partner.firma}</div>
            <div className="truncate" style={{ color: inkColor, opacity: 0.85, fontSize: 10 }}>{partner.telefon} · {partner.webadresse}</div>
          </div>
          <div className="rounded p-1.5 text-center shrink-0 ml-3" style={{ background: overlayDark ? "rgba(255,255,255,0.96)" : "rgba(17,88,163,0.95)", color: overlayDark ? "#1158A3" : "#FFFFFF" }}>
            <div style={{ fontSize: 6, fontWeight: 700, letterSpacing: "0.08em", lineHeight: 1 }}>CARL RAS</div>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1.1 }}>PARTNER</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== Bilstreamer =================== */
function Bilstreamer({ partner, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  return (
    <div
      className="shadow-[0_20px_60px_rgba(0,26,51,0.18)] flex overflow-hidden"
      style={{ width: 560, aspectRatio: "1000/200", borderRadius: 4 }}
    >
      <PhotoArea image={image} className="shrink-0 w-[40%]" height="100%" />
      <div className="flex-1 flex items-center px-5 gap-4" style={{ background: "#001A33" }}>
        <div className="rounded-md grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: 56, height: 56, fontSize: 16 }}>
          {partner.initialer}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold leading-tight" style={{ color: "white", fontSize: 22 }}>{partner.firma}</div>
          <div className="text-white/65 mt-0.5" style={{ fontSize: 11 }}>{partner.faggruppe} · {partner.by}</div>
          <div className="text-white mt-1.5 font-semibold" style={{ fontSize: 14 }}>{partner.telefon} · {partner.webadresse}</div>
        </div>
        <div className="rounded text-center px-2 py-1.5 shrink-0" style={{ background: "#1158A3" }}>
          <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.08em", lineHeight: 1, color: "white" }}>CARL RAS</div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1.1, color: "white", marginTop: 1 }}>PARTNER</div>
          <div style={{ fontSize: 6, opacity: 0.85, lineHeight: 1, marginTop: 1, color: "white" }}>CERTIFICERET</div>
        </div>
      </div>
    </div>
  );
}

/* =================== Facebook square =================== */
function FacebookSq({ campaign, partner, theme, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  const overlayDark = image.fg === "light";
  const inkColor = overlayDark ? "#FFFFFF" : "#1D1D1F";
  return (
    <div
      className="shadow-[0_20px_60px_rgba(0,26,51,0.18)] relative overflow-hidden"
      style={{ width: 420, aspectRatio: "1/1", background: image.bg, borderRadius: 6 }}
    >
      {image.glyph && (
        <div className="absolute inset-0 grid place-items-center text-[150px] select-none" style={{ filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.28))" }}>
          {image.glyph}
        </div>
      )}
      <div className="absolute inset-x-0 top-0 h-[55%]" style={{
        background: overlayDark
          ? "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)"
          : "linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, transparent 100%)",
      }} />
      <div className="absolute inset-x-0 top-0 px-6 pt-6">
        <h3 className="font-bold leading-[1.05] tracking-tight" style={{ color: inkColor, fontSize: 26, textShadow: overlayDark ? "0 2px 12px rgba(0,0,0,0.45)" : "none" }}>
          {campaign.hovedbudskab}
        </h3>
        <p className="mt-2 leading-[1.4] max-w-[280px]" style={{ color: inkColor, opacity: 0.92, fontSize: 12, textShadow: overlayDark ? "0 1px 6px rgba(0,0,0,0.5)" : "none" }}>
          {campaign.underbudskab}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-white px-4 py-3 flex items-center gap-2">
        <div className="rounded-md grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: 36, height: 36, fontSize: 11 }}>
          {partner.initialer}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold truncate text-[13px] text-[#1D1D1F]">{partner.firma}</div>
          <div className="text-[#515154] truncate text-[10px]">{partner.by} · {partner.telefon}</div>
        </div>
        <span
          className="rounded-full px-3 py-1.5 text-white font-semibold shrink-0"
          style={{ background: theme.accent, fontSize: 11 }}
        >
          {campaign.cta} →
        </span>
      </div>
    </div>
  );
}

/* =================== Instagram story =================== */
function InstagramStory({ campaign, partner, theme, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  const overlayDark = image.fg === "light";
  const inkColor = overlayDark ? "#FFFFFF" : "#1D1D1F";
  return (
    <div
      className="shadow-[0_20px_60px_rgba(0,26,51,0.18)] relative overflow-hidden"
      style={{ width: 280, aspectRatio: "9/16", background: image.bg, borderRadius: 8 }}
    >
      {image.glyph && (
        <div className="absolute inset-0 grid place-items-center text-[140px] select-none" style={{ filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.28))" }}>
          {image.glyph}
        </div>
      )}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
        <h3 className="font-bold leading-[1.05] tracking-tight" style={{ color: inkColor, fontSize: 26, textShadow: overlayDark ? "0 2px 12px rgba(0,0,0,0.5)" : "none" }}>
          {campaign.hovedbudskab}
        </h3>
        <p className="mt-3 leading-[1.4]" style={{ color: inkColor, opacity: 0.9, fontSize: 12, textShadow: overlayDark ? "0 1px 6px rgba(0,0,0,0.5)" : "none" }}>
          {campaign.underbudskab}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col items-center gap-2">
        <span
          className="rounded-full px-5 py-2 text-white font-semibold"
          style={{ background: theme.accent, fontSize: 12 }}
        >
          {campaign.cta}
        </span>
        <div className="rounded-lg px-3 py-1.5 bg-white/95 backdrop-blur-sm flex items-center gap-2">
          <div className="rounded grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: 20, height: 20, fontSize: 7 }}>
            {partner.initialer}
          </div>
          <span className="text-[10px] font-semibold text-[#1D1D1F]">{partner.firma}</span>
          <span className="text-[8px] text-[#515154]">· {partner.telefon}</span>
        </div>
      </div>
    </div>
  );
}

/* =================== Email signature =================== */
function EmailSig({ partner, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  return (
    <div
      className="shadow-[0_20px_60px_rgba(0,26,51,0.18)] flex overflow-hidden bg-white"
      style={{ width: 500, aspectRatio: "600/200", borderRadius: 6 }}
    >
      <PhotoArea image={image} className="shrink-0 w-[35%]" height="100%" />
      <div className="flex-1 px-5 py-4 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <div className="rounded-md grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: 36, height: 36, fontSize: 11 }}>
            {partner.initialer}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[15px] text-[#1D1D1F] truncate">{partner.firma}</div>
            <div className="text-[11px] text-[#515154]">{partner.ejer} · {partner.faggruppe}</div>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-[#515154] leading-[1.5]">
          <div>{partner.telefon}</div>
          <div>{partner.webadresse}</div>
          <div>{partner.by} · {partner.region}</div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="rounded px-2 py-0.5" style={{ background: "#1158A3" }}>
            <span className="text-[7px] font-bold tracking-[0.08em] text-white">CARL RAS PARTNER</span>
          </div>
          <span className="text-[8px] text-[#86868B]">{partner.tier}-niveau</span>
        </div>
      </div>
    </div>
  );
}

/* =================== Google display 300×250 =================== */
function GoogleAd({ campaign, partner, theme, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  return (
    <div
      className="shadow-[0_20px_60px_rgba(0,26,51,0.18)] bg-white overflow-hidden flex flex-col"
      style={{ width: 320, aspectRatio: "300/250", borderRadius: 6 }}
    >
      <PhotoArea image={image} height="48%" />
      <div className="flex-1 p-3 flex flex-col">
        <h3 className="font-bold leading-[1.1] tracking-tight" style={{ color: "#1D1D1F", fontSize: 15 }}>
          {campaign.hovedbudskab}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="rounded grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: 18, height: 18, fontSize: 8 }}>
            {partner.initialer}
          </div>
          <span className="text-[10px] font-semibold text-[#1D1D1F] truncate">{partner.firma}</span>
          <span className="text-[9px] text-[#515154] truncate">· {partner.by}</span>
        </div>
        <div className="mt-auto pt-2">
          <span className="block text-center rounded-md py-1.5 text-white font-semibold" style={{ background: theme.accent, fontSize: 11 }}>
            {campaign.cta}
          </span>
        </div>
      </div>
    </div>
  );
}
