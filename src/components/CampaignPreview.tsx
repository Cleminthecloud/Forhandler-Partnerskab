"use client";
import { Campaign, FormatKind, PartnerProfile } from "@/lib/data";
import { Theme, ThemeId } from "@/lib/themes";
import { CarlRasSikringLogo, CarlRasPartnerLogo } from "./BrandLogos";

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
  /** Themes this image fits. Used to filter the image-picker per active theme. */
  themes?: ThemeId[];
}

/* Unsplash CDN helper for non-sommerhus themes (vinter, indbrud) until we have
   licensed Carl Ras photography for those. */
const U = (id: string) => `url(https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80) center/cover`;

export const DEFAULT_IMAGES: CampaignImage[] = [
  /* ─── Sommer-sikring ─── */
  { id: "family",    label: "Familie",     bg: "url(/campaigns/sommerhus-family.jpg) center/cover",   fg: "light", themes: ["sommer-sikring"] },
  { id: "dusk",      label: "Skumring",    bg: "url(/campaigns/sommerhus-dusk.jpg) center/cover",     fg: "light", themes: ["sommer-sikring"] },
  { id: "lock-pov",  label: "Smart lock",  bg: "url(/campaigns/sommerhus-lock-pov.jpg) center/cover", fg: "light", themes: ["sommer-sikring"] },
  { id: "product",   label: "Produkt",     bg: "url(/campaigns/stroxx-product.jpg) center/cover",     fg: "dark",  themes: ["sommer-sikring"] },

  /* ─── Vinter-byg — snow, frost, winter house ─── */
  { id: "snow-road",   label: "Sne",        bg: U("1483728642387-6c3bdd6c93e5"), fg: "light", themes: ["vinter-byg"] },
  { id: "winter-house",label: "Vinterhus",  bg: U("1486754735734-325b5831c3ad"), fg: "light", themes: ["vinter-byg"] },
  { id: "frost-tools", label: "Værktøj",    bg: U("1611348586804-61bf6c080437"), fg: "dark",  themes: ["vinter-byg"] },
  { id: "winter-roof", label: "Tagrender",  bg: U("1517299321609-52687d1bc55a"), fg: "light", themes: ["vinter-byg"] },

  /* ─── Indbrud-efterar — dusk, security, autumn ─── */
  { id: "dusk-home",   label: "Skumring",   bg: U("1568605114967-8130f3a36994"), fg: "light", themes: ["indbrud-efterar"] },
  { id: "night-house", label: "Mørke",      bg: U("1531545514256-b1400bc00f31"), fg: "light", themes: ["indbrud-efterar"] },
  { id: "lit-window",  label: "Lys på",     bg: U("1606857521015-7f9fcf423740"), fg: "light", themes: ["indbrud-efterar"] },
  { id: "autumn-evening",label: "Efterår",  bg: U("1559548331-f9cb98001426"),    fg: "light", themes: ["indbrud-efterar"] },
];

/** Filter images for a given theme. Falls back to all images if none tagged. */
export function imagesForTheme(themeId: ThemeId): CampaignImage[] {
  const tagged = DEFAULT_IMAGES.filter((i) => !i.themes || i.themes.includes(themeId));
  return tagged.length > 0 ? tagged : DEFAULT_IMAGES;
}

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
  bilstreamer:  { width:  "clamp(480px, 56vw, 880px)",  aspectRatio: "5 / 1" },
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

/* Renders the official Carl Ras Sikring logo at a size relative to the ad.
   Wrapped in a small container so the logo height scales with the container query. */
function SikringMark({ inkColor }: { inkColor: string }) {
  return (
    <div style={{ height: "5.4cqw" }} aria-hidden>
      <CarlRasSikringLogo color={inkColor} height={undefined as unknown as number} className="!h-full" />
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
      <div className="shrink-0 text-right flex flex-col items-end">
        <div style={{ fontSize: "1.8cqw", letterSpacing: "0.18em", lineHeight: 1, color: "rgba(255,255,255,0.55)", fontWeight: 700, textTransform: "uppercase" }}>I samarbejde med</div>
        <div className="mt-1.5">
          <SikringMark inkColor="white" />
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
      <div className="shrink-0 text-right flex flex-col items-end">
        <div style={{ fontSize: "1.8cqw", letterSpacing: "0.18em", lineHeight: 1, color: "rgba(0,0,0,0.55)", fontWeight: 700, textTransform: "uppercase" }}>I samarbejde med</div>
        <div className="mt-1.5">
          <SikringMark inkColor="#002C5B" />
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

/* =================== Bilstreamer (wide horizontal) ===================
   Layout: photo on the left (with Carl Ras Partner wordmark anchored
   top-right over the image), navy text block on the right (with the
   Carl Ras Partner wordmark anchored bottom-right — no blue box).
   Both marks share the same padding rhythm so they read as a paired
   diagonal — top-left and bottom-right of the visual centerline. */
function Bilstreamer({ partner, image }: { campaign: Campaign; partner: PartnerProfile; theme: Theme; image: CampaignImage }) {
  return (
    <div className="relative shadow-[0_20px_60px_rgba(0,26,51,0.18)]" style={FRAME.bilstreamer}>
      <div className="absolute inset-0 flex overflow-hidden" style={{ borderRadius: 4, containerType: "inline-size" }}>
        {/* LEFT — photo area (no overlay logo — the CRP wordmark on the navy
            side is enough; doubling it cluttered the banner). */}
        <PhotoArea image={image} className="shrink-0 w-[40%]" height="100%" />

        {/* RIGHT — navy text block with CRP wordmark anchored bottom-right
            (scaled to ~80% with extra right-padding to keep the whole
            wordmark visible inside the 5:1 banner crop). */}
        <div className="relative flex-1 flex items-center" style={{ background: "#001A33", padding: "0 2.5cqw", gap: "2cqw" }}>
          <div className="rounded grid place-items-center text-white font-bold shrink-0" style={{ background: partner.logoBg, width: "5.6cqw", height: "5.6cqw", fontSize: "1.6cqw" }}>
            {partner.initialer}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold leading-tight" style={{ color: "white", fontSize: "2.2cqw" }}>{partner.firma}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.1cqw", marginTop: "0.4cqw" }}>{partner.faggruppe} · {partner.by}</div>
            <div style={{ color: "white", fontSize: "1.5cqw", fontWeight: 600, marginTop: "0.8cqw" }}>{partner.telefon} · {partner.webadresse}</div>
          </div>
          <div className="absolute" style={{ bottom: "2.5cqw", right: "3cqw", height: "2.8cqw" }}>
            <CarlRasPartnerLogo color="white" height={undefined as unknown as number} className="!h-full" />
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
        {/* Carl Ras Partner wordmark anchored top-right of image area — same
            padding rhythm as the bilstreamer's photo-side mark. */}
        <div className="absolute" style={{ top: "4cqw", right: "4cqw", height: "3.2cqw", filter: "drop-shadow(0 0.4cqw 1.2cqw rgba(0,0,0,0.5))" }}>
          <CarlRasPartnerLogo color="white" height={undefined as unknown as number} className="!h-full" />
        </div>
        <div className="absolute inset-x-0 top-0" style={{ padding: "5cqw 6cqw 0" }}>
          <h3 className="font-bold tracking-tight" style={{ color: inkColor, fontSize: "6.5cqw", lineHeight: 1.05, letterSpacing: "-0.02em", textShadow: overlayDark ? "0 0.4cqw 2.4cqw rgba(0,0,0,0.45)" : "none", maxWidth: "52cqw" }}>
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
        {/* Right column — relative so the CRP wordmark can dock bottom-right */}
        <div className="relative flex-1 flex flex-col justify-center" style={{ padding: "3.5cqw 4cqw" }}>
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
          {/* CRP wordmark anchored bottom-right with comfortable padding —
              replaces the prior "Sølv-niveau" tier text, which was redundant
              with the partner data already visible above. */}
          <div className="absolute" style={{ bottom: "3.5cqw", right: "4cqw", height: "4cqw" }}>
            <CarlRasPartnerLogo color="#1158A3" height={undefined as unknown as number} className="!h-full" />
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
        {/* Photo area with Carl Ras Partner wordmark anchored top-right —
            consistent with FB ad + bilstreamer pattern. */}
        <div className="relative" style={{ height: "48%" }}>
          <PhotoArea image={image} height="100%" />
          <div className="absolute" style={{ top: "3cqw", right: "3cqw", height: "7cqw", filter: "drop-shadow(0 0.4cqw 1.2cqw rgba(0,0,0,0.5))" }}>
            <CarlRasPartnerLogo color="white" height={undefined as unknown as number} className="!h-full" />
          </div>
        </div>
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
