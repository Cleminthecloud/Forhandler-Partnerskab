"use client";
import { Campaign, FormatKind, PartnerProfile } from "@/lib/data";
import { Theme } from "@/lib/themes";

/* =====================================================================
   Real ad-layout renderer. HTML/CSS — not SVG. Each format is a piece
   of media (no UI chrome). Image variant drives the photo area inside
   the ad. All formats scale with viewport via clamp()/vh/vw + use
   container-query units (cqw) for font sizes so type stays proportional
   to the rendered poster size, not the viewport.
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

/* =====================================================================
   Sizing tokens for each format. Portrait formats are height-driven
   (their width derives from aspect-ratio). Horizontal formats are
   width-driven. All include a min/max so the result is sane on tiny
   laptops and 4K monitors alike.
   ===================================================================== */

const FRAME = {
  // Portrait — height-driven
  flyer:        { height: "clamp(420px, 72vh, 760px)", aspectRatio: "148 / 210" }, // A5 portrait
  poster:       { height: "clamp(420px, 72vh, 760px)", aspectRatio: "297 / 420" }, // A3 portrait
  magasin:      { height: "clamp(420px, 72vh, 760px)", aspectRatio: "210 / 297" }, // A4-ish
  instagram:    { height: "clamp(440px, 72vh, 760px)", aspectRatio: "9 / 16" },    // story
  // Square
  facebook:     { width:  "clamp(360px, min(54vh, 44vw), 600px)", aspectRatio: "1 / 1" },
  // Horizontal — width-driven
  bilstreamer:  { width:  "clamp(560px, 70vw, 1080px)", aspectRatio: "5 / 1" },
  email:        { width:  "clamp(440px, 56vw, 780px)", aspectRatio: "3 / 1" },
  google:       { width:  "clamp(320px, 36vw, 520px)", aspectRatio: "6 / 5" },     // 300x250-ish
} as const;

/* Wrap content in a container-query context so cqw-based font sizes
   scale with the rendered poster width, not the viewport width. */
function ContentBox({ children, bg, radius = 4 }: { children: React.ReactNode; bg: string; radius?: number }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: bg,
        borderRadius: radius,
        containerType: "inline-size",
        containerName: "ad",
      }}
    >
      {children}
    </div>
  );
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

function CoBrandFooterLight({ partner }: { partner: PartnerProfile }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div style={{ fontSize: "1.8cqw", letterSpacing: "0.12em", lineHeight: 1, color: "rgba(255,255,255,0.75)", fontWeight: 700, textTransform: "uppercase" }}>Lokal partner</div>
        <div className="font-bold mt-0.5 truncate" style={{ color: "white", fontSize: "3.6cqw" }}>{partner.firma}</div>
        <div className="truncate" style={{ color: "rgba(255,255,255,0.86)", fontSize: "2.2cqw" }}>{partner.telefon} · {partner.webadresse}</div>
      </div>
      <div className="shrink-0 text-right">
        <div style={{ fontSize: "1.8cqw", letterSpacing: "0.18em", lineHeight: 1, color: "rgba(255,255,255,0.55)", fontWeight: 700, textTransform: "uppercase" }}>I samarbejde med</div>
        <div className="mt-1 inline-flex items-center gap-1.5 rounded px-1.5 py-1" style={{ background: "rgba(255,255,255,0.95)" }}>
          <span className="rounded-sm grid place-items-center font-bold" style={{ background: "#1158A3", color: "white", fontSize: "1.6cqw", padding: "1cqw 1.4cqw", letterSpacing: "0.04em", lineHeight: 1 }}>CR</span>
          <span style={{ color: "#1158A3", fontSize: "2.4cqw", fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1 }}>CARL RAS</span>
          <span className="rounded-sm" style={{ background: "#E30613", color: "white", fontSize: "1.6cqw", fontWeight: 800, padding: "1cqw 1.2cqw", letterSpacing: "0.06em", lineHeight: 1 }}>SIKRING</span>
        </div>
      </div>
    </div>
  );
}

function CoBrandFooterDark({ partner }: { partner: PartnerProfile }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div style={{ fontSize: "1.8cqw", letterSpacing: "0.12em", lineHeight: 1, color: "rgba(0,0,0,0.55)", fontWeight: 700, textTransform: "uppercase" }}>Lokal partner</div>
        <div className="font-bold mt-0.5 truncate" style={{ color: "#1D1D1F", fontSize: "3.6cqw" }}>{partner.firma}</div>
        <div className="truncate" style={{ color: "rgba(0,0,0,0.7)", fontSize: "2.2cqw" }}>{partner.telefon} · {partner.webadresse}</div>
      </div>
      <div className="shrink-0 text-right">
        <div style={{ fontSize: "1.8cqw", letterSpacing: "0.18em", lineHeight: 1, color: "rgba(0,0,0,0.55)", fontWeight: 700, textTransform: "uppercase" }}>I samarbejde med</div>
        <div className="mt-1 inline-flex items-center gap-1.5 rounded px-1.5 py-1" style={{ background: "#1158A3" }}>
          <span className="rounded-sm grid place-items-center font-bold" style={{ background: "white", color: "#1158A3", fontSize: "1.6cqw", padding: "1cqw 1.4cqw", letterSpacing: "0.04em", lineHeight: 1 }}>CR</span>
          <span style={{ color: "white", fontSize: "2.4cqw", fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1 }}>CARL RAS</span>
          <span className="rounded-sm" style={{ background: "#E30613", color: "white", fontSize: "1.6cqw", fontWeight: 800, padding: "1cqw 1.2cqw", letterSpacing: "0.06em", lineHeight: 1 }}>SIKRING</span>
        </div>
      </div>
    </div>
  );
}

function CertifiedSticker() {
  return (
    <div className="absolute size-[18cqw] rounded-full bg-white shadow-md grid place-items-center text-center" style={{ top: "5cqw", left: "5cqw", border: "0.5cqw solid #5DBA47" }}>
      <div>
        <div style={{ color: "#5DBA47", fontSize: "2.2cqw", fontWeight: 800, lineHeight: 1 }}>✓</div>
        <div style={{ color: "#1D1D1F", fontSize: "2.2cqw", fontWeight: 900, letterSpacing: "0.04em", lineHeight: 1.1 }}>CERTIFIED</div>
        <div style={{ color: "#5DBA47", fontSize: "1.4cqw", marginTop: "0.5cqw", letterSpacing: "0.06em" }}>X LOCK</div>
      </div>
    </div>
  );
}

/* =================== Flyer A5 — editorial portrait =================== */
function FlyerA5({ campaign, partner, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  const overlayDark = image.fg === "light";
  return (
    <div className="relative shadow-[0_20px_60px_rgba(0,26,51,0.22)]" style={FRAME.flyer}>
      <ContentBox bg={image.bg}>
        {image.id === "product" && <CertifiedSticker />}

        {/* Bottom scrim */}
        <div className="absolute inset-x-0 bottom-0 h-[58%] pointer-events-none" style={{
          background: overlayDark
            ? "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.10) 75%, transparent 100%)"
            : "linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 40%, transparent 100%)",
        }} />

        {/* Headline + body anchored to bottom */}
        <div className="absolute inset-x-0 bottom-0" style={{ padding: "6cqw 6cqw 5cqw" }}>
          <h3 className="font-bold tracking-tight" style={{ color: overlayDark ? "white" : "#1D1D1F", fontSize: "8.6cqw", lineHeight: 0.98, letterSpacing: "-0.02em" }}>
            {campaign.hovedbudskab}
          </h3>
          <p style={{
            marginTop: "3cqw",
            color: overlayDark ? "rgba(255,255,255,0.92)" : "#1D1D1F",
            fontSize: "2.8cqw",
            lineHeight: 1.4,
            columnCount: 2,
            columnGap: "3cqw",
          }}>
            {campaign.underbudskab} Hos os får du en lokal låsesmed der kender området, og produkterne kommer direkte fra Carl Ras&apos; lager. Gratis hjemmebesøg — vi vurderer og giver tilbud på under en time.
          </p>
          <div style={{ marginTop: "4cqw" }}>
            {overlayDark ? <CoBrandFooterLight partner={partner} /> : <CoBrandFooterDark partner={partner} />}
          </div>
        </div>
      </ContentBox>
    </div>
  );
}

/* =================== Poster A3 — editorial full-bleed =================== */
function PosterA3({ campaign, partner, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  const overlayDark = image.fg === "light";
  return (
    <div className="relative shadow-[0_20px_60px_rgba(0,26,51,0.22)]" style={FRAME.poster}>
      <ContentBox bg={image.bg}>
        {image.id === "product" && <CertifiedSticker />}

        <div className="absolute inset-x-0 bottom-0 h-[54%] pointer-events-none" style={{
          background: overlayDark
            ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.45) 40%, transparent 100%)"
            : "linear-gradient(to top, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.55) 40%, transparent 100%)",
        }} />

        <div className="absolute inset-x-0 bottom-0" style={{ padding: "6cqw 6cqw 5cqw" }}>
          <h3 className="font-bold tracking-tight" style={{ color: overlayDark ? "white" : "#1D1D1F", fontSize: "9.4cqw", lineHeight: 0.96, letterSpacing: "-0.02em" }}>
            {campaign.hovedbudskab}
          </h3>
          <p style={{
            marginTop: "3cqw",
            color: overlayDark ? "rgba(255,255,255,0.92)" : "#1D1D1F",
            fontSize: "2.8cqw",
            lineHeight: 1.4,
            columnCount: 2,
            columnGap: "3cqw",
          }}>
            {campaign.underbudskab} Hos os får du en lokal låsesmed der kender området, og produkterne kommer direkte fra Carl Ras&apos; lager.
          </p>
          <div style={{ marginTop: "4cqw" }}>
            {overlayDark ? <CoBrandFooterLight partner={partner} /> : <CoBrandFooterDark partner={partner} />}
          </div>
        </div>
      </ContentBox>
    </div>
  );
}

/* =================== Magasin annonce =================== */
function Magasin({ campaign, partner, theme, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  const overlayDark = image.fg === "light";
  const inkColor = overlayDark ? "#FFFFFF" : "#1D1D1F";
  void theme;
  return (
    <div className="relative shadow-[0_20px_60px_rgba(0,26,51,0.18)]" style={FRAME.magasin}>
      <ContentBox bg={image.bg}>
        <div className="absolute inset-x-0 bottom-0 h-[55%]" style={{
          background: overlayDark
            ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
            : "linear-gradient(to top, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.4) 60%, transparent 100%)",
        }} />
        <div className="absolute inset-x-0 bottom-0" style={{ padding: "6cqw 6cqw 6cqw" }}>
          <h3 className="font-bold tracking-tight" style={{ color: inkColor, fontSize: "8.2cqw", lineHeight: 1.0, letterSpacing: "-0.02em" }}>
            {campaign.hovedbudskab}
          </h3>
          <p style={{
            marginTop: "3cqw",
            color: inkColor,
            opacity: 0.92,
            fontSize: "3cqw",
            lineHeight: 1.4,
            maxWidth: "70cqw",
          }}>
            {campaign.underbudskab}
          </p>
          <div style={{ marginTop: "5cqw" }}>
            {overlayDark ? <CoBrandFooterLight partner={partner} /> : <CoBrandFooterDark partner={partner} />}
          </div>
        </div>
      </ContentBox>
    </div>
  );
}

/* =================== Bilstreamer (wide horizontal) =================== */
function Bilstreamer({ partner, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  return (
    <div className="relative shadow-[0_20px_60px_rgba(0,26,51,0.18)]" style={FRAME.bilstreamer}>
      <div className="absolute inset-0 flex overflow-hidden" style={{ borderRadius: 4, containerType: "inline-size" }}>
        <PhotoArea image={image} className="shrink-0 w-[40%]" height="100%" />
        <div className="flex-1 flex items-center" style={{ background: "#001A33", padding: "0 2.5cqw", gap: "2cqw" }}>
          <div className="rounded grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: "5.6cqw", height: "5.6cqw", fontSize: "1.6cqw" }}>
            {partner.initialer}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold leading-tight" style={{ color: "white", fontSize: "2.2cqw" }}>{partner.firma}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.1cqw", marginTop: "0.4cqw" }}>{partner.faggruppe} · {partner.by}</div>
            <div style={{ color: "white", fontSize: "1.5cqw", fontWeight: 600, marginTop: "0.8cqw" }}>{partner.telefon} · {partner.webadresse}</div>
          </div>
          <div className="rounded text-center shrink-0" style={{ background: "#1158A3", padding: "1cqw 1.4cqw" }}>
            <div style={{ fontSize: "0.7cqw", fontWeight: 700, letterSpacing: "0.08em", lineHeight: 1, color: "white" }}>CARL RAS</div>
            <div style={{ fontSize: "1.1cqw", fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1.1, color: "white", marginTop: "0.2cqw" }}>PARTNER</div>
            <div style={{ fontSize: "0.6cqw", opacity: 0.85, lineHeight: 1, marginTop: "0.2cqw", color: "white" }}>CERTIFICERET</div>
          </div>
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
    <div className="relative shadow-[0_20px_60px_rgba(0,26,51,0.18)]" style={FRAME.facebook}>
      <ContentBox bg={image.bg} radius={6}>
        <div className="absolute inset-x-0 top-0 h-[55%]" style={{
          background: overlayDark
            ? "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)"
            : "linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, transparent 100%)",
        }} />
        <div className="absolute inset-x-0 top-0" style={{ padding: "5cqw 6cqw 0" }}>
          <h3 className="font-bold tracking-tight" style={{ color: inkColor, fontSize: "6.5cqw", lineHeight: 1.05, letterSpacing: "-0.02em", textShadow: overlayDark ? "0 0.4cqw 2.4cqw rgba(0,0,0,0.45)" : "none" }}>
            {campaign.hovedbudskab}
          </h3>
          <p style={{
            marginTop: "2cqw",
            color: inkColor,
            opacity: 0.92,
            fontSize: "2.8cqw",
            lineHeight: 1.4,
            maxWidth: "65cqw",
            textShadow: overlayDark ? "0 0.2cqw 1.2cqw rgba(0,0,0,0.5)" : "none",
          }}>
            {campaign.underbudskab}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-white flex items-center" style={{ padding: "3cqw 4cqw", gap: "2cqw" }}>
          <div className="rounded-md grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: "8cqw", height: "8cqw", fontSize: "2.6cqw" }}>
            {partner.initialer}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold truncate text-[#1D1D1F]" style={{ fontSize: "3cqw" }}>{partner.firma}</div>
            <div className="text-[#515154] truncate" style={{ fontSize: "2.2cqw" }}>{partner.by} · {partner.telefon}</div>
          </div>
          <span className="rounded-full text-white font-semibold shrink-0" style={{ background: theme.accent, fontSize: "2.6cqw", padding: "1.5cqw 3cqw" }}>
            {campaign.cta} →
          </span>
        </div>
      </ContentBox>
    </div>
  );
}

/* =================== Instagram story =================== */
function InstagramStory({ campaign, partner, theme, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  const overlayDark = image.fg === "light";
  const inkColor = overlayDark ? "#FFFFFF" : "#1D1D1F";
  return (
    <div className="relative shadow-[0_20px_60px_rgba(0,26,51,0.18)]" style={FRAME.instagram}>
      <ContentBox bg={image.bg} radius={8}>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center" style={{ padding: "0 7cqw" }}>
          <h3 className="font-bold tracking-tight" style={{ color: inkColor, fontSize: "9cqw", lineHeight: 1.05, letterSpacing: "-0.02em", textShadow: overlayDark ? "0 0.4cqw 2.4cqw rgba(0,0,0,0.5)" : "none" }}>
            {campaign.hovedbudskab}
          </h3>
          <p style={{
            marginTop: "3cqw",
            color: inkColor,
            opacity: 0.9,
            fontSize: "4cqw",
            lineHeight: 1.4,
            textShadow: overlayDark ? "0 0.2cqw 1.2cqw rgba(0,0,0,0.5)" : "none",
          }}>
            {campaign.underbudskab}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center" style={{ padding: "5cqw 4cqw", gap: "2.5cqw" }}>
          <span className="rounded-full text-white font-semibold" style={{ background: theme.accent, fontSize: "4cqw", padding: "2cqw 5cqw" }}>
            {campaign.cta}
          </span>
          <div className="rounded-lg bg-white/95 backdrop-blur-sm flex items-center" style={{ padding: "1.5cqw 3cqw", gap: "2cqw" }}>
            <div className="rounded grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: "5cqw", height: "5cqw", fontSize: "2cqw" }}>
              {partner.initialer}
            </div>
            <span className="font-semibold text-[#1D1D1F]" style={{ fontSize: "2.8cqw" }}>{partner.firma}</span>
            <span className="text-[#515154]" style={{ fontSize: "2.4cqw" }}>· {partner.telefon}</span>
          </div>
        </div>
      </ContentBox>
    </div>
  );
}

/* =================== Email signature (wide horizontal) =================== */
function EmailSig({ partner, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  return (
    <div className="relative shadow-[0_20px_60px_rgba(0,26,51,0.18)]" style={FRAME.email}>
      <div className="absolute inset-0 flex overflow-hidden bg-white" style={{ borderRadius: 6, containerType: "inline-size" }}>
        <PhotoArea image={image} className="shrink-0 w-[35%]" height="100%" />
        <div className="flex-1 flex flex-col justify-center" style={{ padding: "3.5cqw 4cqw" }}>
          <div className="flex items-center" style={{ gap: "2cqw" }}>
            <div className="rounded-md grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: "6cqw", height: "6cqw", fontSize: "1.8cqw" }}>
              {partner.initialer}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-[#1D1D1F] truncate" style={{ fontSize: "2.4cqw" }}>{partner.firma}</div>
              <div className="text-[#515154]" style={{ fontSize: "1.7cqw" }}>{partner.ejer} · {partner.faggruppe}</div>
            </div>
          </div>
          <div className="text-[#515154]" style={{ marginTop: "2cqw", fontSize: "1.7cqw", lineHeight: 1.5 }}>
            <div>{partner.telefon}</div>
            <div>{partner.webadresse}</div>
            <div>{partner.by} · {partner.region}</div>
          </div>
          <div className="flex items-center" style={{ marginTop: "1.4cqw", gap: "1.4cqw" }}>
            <div className="rounded" style={{ background: "#1158A3", padding: "0.5cqw 1.4cqw" }}>
              <span className="font-bold text-white" style={{ fontSize: "1.1cqw", letterSpacing: "0.08em" }}>CARL RAS PARTNER</span>
            </div>
            <span className="text-[#86868B]" style={{ fontSize: "1.2cqw" }}>{partner.tier}-niveau</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== Google display 300×250 =================== */
function GoogleAd({ campaign, partner, theme, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  return (
    <div className="relative shadow-[0_20px_60px_rgba(0,26,51,0.18)]" style={FRAME.google}>
      <div className="absolute inset-0 bg-white overflow-hidden flex flex-col" style={{ borderRadius: 6, containerType: "inline-size" }}>
        <PhotoArea image={image} height="48%" />
        <div className="flex-1 flex flex-col" style={{ padding: "3cqw" }}>
          <h3 className="font-bold tracking-tight" style={{ color: "#1D1D1F", fontSize: "4.5cqw", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {campaign.hovedbudskab}
          </h3>
          <div className="flex items-center" style={{ marginTop: "1.5cqw", gap: "1.5cqw" }}>
            <div className="rounded grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: "4cqw", height: "4cqw", fontSize: "1.8cqw" }}>
              {partner.initialer}
            </div>
            <span className="font-semibold text-[#1D1D1F] truncate" style={{ fontSize: "2.8cqw" }}>{partner.firma}</span>
            <span className="text-[#515154] truncate" style={{ fontSize: "2.4cqw" }}>· {partner.by}</span>
          </div>
          <div className="mt-auto" style={{ paddingTop: "2cqw" }}>
            <span className="block text-center rounded-md text-white font-semibold" style={{ background: theme.accent, fontSize: "3cqw", padding: "1.8cqw 0" }}>
              {campaign.cta}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
