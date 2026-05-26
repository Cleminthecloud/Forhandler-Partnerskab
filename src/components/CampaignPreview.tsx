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
    id: "family",
    label: "Familie",
    bg: "url(/campaigns/sommerhus-family.jpg) center/cover",
    fg: "light",
  },
  {
    id: "dusk",
    label: "Skumring",
    bg: "url(/campaigns/sommerhus-dusk.jpg) center/cover",
    fg: "light",
  },
  {
    id: "lock-pov",
    label: "Smart lock",
    bg: "url(/campaigns/sommerhus-lock-pov.jpg) center/cover",
    fg: "light",
  },
  {
    id: "product",
    label: "Produkt",
    bg: "url(/campaigns/stroxx-product.jpg) center/cover",
    fg: "dark",
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
    </div>
  );
}

function CarlRasMark({ size = 14 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="rounded grid place-items-center shrink-0" style={{ background: "#1158A3", width: size, height: size }}>
        <span style={{ fontSize: size * 0.55, color: "white", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.05em" }}>CR</span>
      </span>
    </span>
  );
}

/** Editorial co-brand footer used on print formats. White text on dark photo. */
function CoBrandFooterLight({ partner, layout = "stacked" }: { partner: PartnerProfile; layout?: "stacked" | "wide" }) {
  return (
    <div className={layout === "wide" ? "flex items-end justify-between gap-4" : "text-center"}>
      <div className={layout === "wide" ? "" : ""}>
        <div className="font-extrabold text-white tracking-[0.04em]" style={{ fontSize: 20, lineHeight: 1.0 }}>
          {partner.firma.toUpperCase()}
        </div>
        <div className="text-white/75 mt-1" style={{ fontSize: 9.5, letterSpacing: "0.1em" }}>
          {partner.webadresse.toUpperCase()} · {partner.telefon}
        </div>
      </div>
      <div className={(layout === "wide" ? "" : "mt-2 ") + "flex items-center gap-2 " + (layout === "wide" ? "" : "justify-center")}>
        <span className="text-white/65" style={{ fontSize: 8, letterSpacing: "0.16em" }}>I SAMARBEJDE MED</span>
        <CarlRasMark size={14} />
        <span className="font-bold text-white" style={{ fontSize: 10, letterSpacing: "0.08em" }}>CARL RAS</span>
        <span className="px-1 py-0.5 rounded text-white" style={{ background: "#0A4685", fontSize: 7, fontWeight: 800, letterSpacing: "0.1em", lineHeight: 1 }}>
          SIKRING
        </span>
      </div>
    </div>
  );
}

/** Dark variant — for ads with light photos */
function CoBrandFooterDark({ partner, layout = "stacked" }: { partner: PartnerProfile; layout?: "stacked" | "wide" }) {
  return (
    <div className={layout === "wide" ? "flex items-end justify-between gap-4" : "text-center"}>
      <div>
        <div className="font-extrabold tracking-[0.04em]" style={{ fontSize: 20, lineHeight: 1.0, color: "#1D1D1F" }}>
          {partner.firma.toUpperCase()}
        </div>
        <div className="mt-1" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "#515154" }}>
          {partner.webadresse.toUpperCase()} · {partner.telefon}
        </div>
      </div>
      <div className={(layout === "wide" ? "" : "mt-2 ") + "flex items-center gap-2 " + (layout === "wide" ? "" : "justify-center")}>
        <span style={{ fontSize: 8, letterSpacing: "0.16em", color: "#6E6E73" }}>I SAMARBEJDE MED</span>
        <CarlRasMark size={14} />
        <span className="font-bold" style={{ fontSize: 10, letterSpacing: "0.08em", color: "#1D1D1F" }}>CARL RAS</span>
        <span className="px-1 py-0.5 rounded text-white" style={{ background: "#0A4685", fontSize: 7, fontWeight: 800, letterSpacing: "0.1em", lineHeight: 1 }}>
          SIKRING
        </span>
      </div>
    </div>
  );
}

/* =================== Flyer A5 — editorial full-bleed (PDF p.15) =================== */
function FlyerA5({ campaign, partner, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  const overlayDark = image.fg === "light";
  return (
    <div
      className="shadow-[0_20px_60px_rgba(0,26,51,0.22)] relative overflow-hidden"
      style={{ width: 380, aspectRatio: "148/210", borderRadius: 4, background: image.bg }}
    >
      {/* CERTIFIED sticker — only when product variant is in use, top-left */}
      {image.id === "product" && (
        <div className="absolute top-5 left-5 size-16 rounded-full bg-white shadow-md grid place-items-center text-center" style={{ border: "2px solid #5DBA47" }}>
          <div>
            <div className="text-[8px] text-[#5DBA47]" style={{ fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1 }}>✓</div>
            <div className="text-[8px]" style={{ fontWeight: 900, letterSpacing: "0.04em", lineHeight: 1.1 }}>CERTIFIED</div>
            <div className="text-[5px] mt-0.5" style={{ color: "#5DBA47", letterSpacing: "0.06em" }}>X LOCK</div>
          </div>
        </div>
      )}

      {/* Bottom scrim for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-[58%] pointer-events-none" style={{
        background: overlayDark
          ? "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.10) 75%, transparent 100%)"
          : "linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 40%, transparent 100%)",
      }} />

      {/* Headline + body — anchored to bottom */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
        <h3 className="font-bold leading-[0.98] tracking-tight" style={{ color: overlayDark ? "white" : "#1D1D1F", fontSize: 30 }}>
          {campaign.hovedbudskab}
        </h3>
        <p className="mt-3 leading-[1.4]" style={{ color: overlayDark ? "rgba(255,255,255,0.92)" : "#1D1D1F", fontSize: 11, columnCount: 2, columnGap: 12 }}>
          {campaign.underbudskab} Hos os får du en lokal låsesmed der kender området, og produkterne kommer direkte fra Carl Ras&apos; lager. Gratis hjemmebesøg — vi vurderer og giver tilbud på under en time.
        </p>
        <div className="mt-4">
          {overlayDark ? <CoBrandFooterLight partner={partner} /> : <CoBrandFooterDark partner={partner} />}
        </div>
      </div>
    </div>
  );
}

/* =================== Poster A3 — editorial full-bleed =================== */
function PosterA3({ campaign, partner, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  const overlayDark = image.fg === "light";
  return (
    <div
      className="shadow-[0_20px_60px_rgba(0,26,51,0.22)] relative overflow-hidden"
      style={{ width: 360, aspectRatio: "297/420", borderRadius: 4, background: image.bg }}
    >
      {image.id === "product" && (
        <div className="absolute top-5 left-5 size-16 rounded-full bg-white shadow-md grid place-items-center text-center" style={{ border: "2px solid #5DBA47" }}>
          <div>
            <div className="text-[8px] text-[#5DBA47]" style={{ fontWeight: 800, lineHeight: 1 }}>✓</div>
            <div className="text-[8px]" style={{ fontWeight: 900, letterSpacing: "0.04em", lineHeight: 1.1 }}>CERTIFIED</div>
            <div className="text-[5px] mt-0.5" style={{ color: "#5DBA47", letterSpacing: "0.06em" }}>X LOCK</div>
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-[54%] pointer-events-none" style={{
        background: overlayDark
          ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.45) 40%, transparent 100%)"
          : "linear-gradient(to top, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.55) 40%, transparent 100%)",
      }} />

      <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
        <h3 className="font-bold leading-[0.96] tracking-tight" style={{ color: overlayDark ? "white" : "#1D1D1F", fontSize: 34 }}>
          {campaign.hovedbudskab}
        </h3>
        <p className="mt-3 leading-[1.4]" style={{ color: overlayDark ? "rgba(255,255,255,0.92)" : "#1D1D1F", fontSize: 11, columnCount: 2, columnGap: 12 }}>
          {campaign.underbudskab} Hos os får du en lokal låsesmed der kender området, og produkterne kommer direkte fra Carl Ras&apos; lager.
        </p>
        <div className="mt-4">
          {overlayDark ? <CoBrandFooterLight partner={partner} /> : <CoBrandFooterDark partner={partner} />}
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
