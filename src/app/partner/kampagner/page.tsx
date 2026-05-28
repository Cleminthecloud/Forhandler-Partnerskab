"use client";
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { CAMPAIGNS, FORMATS, CURRENT_PARTNER, FormatKind, Campaign } from "@/lib/data";
import { CampaignPreview, imagesForTheme } from "@/components/CampaignPreview";
import { PageHeader } from "@/components/PageHeader";
import { Icon } from "@/components/Icon";
import { THEMES } from "@/lib/themes";

interface Edits {
  hovedbudskab?: string;
  underbudskab?: string;
  cta?: string;
  ctaLink?: string;     // Destination URL for digital ads (FB/IG/LinkedIn/Google/Email)
}

/* ─── Campaign history (demo data) ───────────────────────────────────
   Past runs by this partner. In a real build this would be hydrated from
   the partner's order/post history. For the demo, it's a curated set that
   spans every status type (active, finished, in print, sent to ad-platform)
   and every format so a partner can re-pick from any channel. */
type HistoryStatus = "Aktiv" | "Afsluttet" | "I tryk" | "Sendt til Meta" | "Sendt til Google" | "Sendt til LinkedIn" | "Email-signatur";
interface CampaignHistoryEntry {
  id: string;
  campaignId: string;       // → CAMPAIGNS[id]
  format: FormatKind;
  status: HistoryStatus;
  dato: string;             // human-readable Danish date
  detail: string;           // "250 flyere", "Lokalavisen Nordsjælland", "Meta Business — Hornbæk Låseservice"
  leads?: number;           // optional performance — undefined when not yet measurable
  imageVariant?: number;    // which photo was chosen — defaults to 0
}
const CAMPAIGN_HISTORY: CampaignHistoryEntry[] = [
  { id: "h-1", campaignId: "c-sommer-smartlock",   format: "print-flyer",       status: "I tryk",          dato: "17. maj 2026",   detail: "250 stk · levering 22. maj",                            leads: 12, imageVariant: 0 },
  { id: "h-2", campaignId: "c-sommer-alarm",       format: "digital-facebook",  status: "Aktiv",           dato: "14. maj 2026",   detail: "Meta Business · 4.500 kr brugt af 6.000 kr",            leads: 8,  imageVariant: 1 },
  { id: "h-3", campaignId: "c-sommer-pakke",       format: "print-magasin",     status: "Afsluttet",       dato: "8. maj 2026",    detail: "Lokalavisen Nordsjælland · uge 18-19",                  leads: 5,  imageVariant: 2 },
  { id: "h-4", campaignId: "c-sommer-smartlock",   format: "digital-email",     status: "Email-signatur",  dato: "8. maj 2026",    detail: "Installeret i Outlook · 142 udgående emails siden",     leads: 3 },
  { id: "h-5", campaignId: "c-sommer-airbnb",      format: "digital-linkedin",  status: "Sendt til LinkedIn", dato: "5. maj 2026", detail: "LinkedIn Campaign Manager · målgruppe sommerhusejere",  leads: 6,  imageVariant: 1 },
  { id: "h-6", campaignId: "c-sommer-alarm",       format: "digital-google",    status: "Sendt til Google",dato: "2. maj 2026",    detail: "Google Ads · geo-targeted Nordsjælland 25 km",          leads: 4 },
  { id: "h-7", campaignId: "c-sommer-pakke",       format: "print-bilstreamer", status: "Afsluttet",       dato: "12. april 2026", detail: "Monteret på firmabilen · sæson afsluttet",              leads: 18, imageVariant: 0 },
];

const STATUS_STYLES: Record<HistoryStatus, { bg: string; ink: string; dot: string }> = {
  "Aktiv":              { bg: "#E5F4EA", ink: "#1F6A3A", dot: "#2D9D5A" },
  "I tryk":             { bg: "#FFF1DC", ink: "#7A4400", dot: "#F49100" },
  "Afsluttet":          { bg: "#F0F1F4", ink: "#3A3F44", dot: "#86868B" },
  "Sendt til Meta":     { bg: "#E5EEFB", ink: "#0C447C", dot: "#0866FF" },
  "Sendt til Google":   { bg: "#E5F4EA", ink: "#1F6A3A", dot: "#34A853" },
  "Sendt til LinkedIn": { bg: "#E5EEFB", ink: "#0C447C", dot: "#0A66C2" },
  "Email-signatur":     { bg: "#F0F1F4", ink: "#3A3F44", dot: "#86868B" },
};

export default function KampagnerPage() {
  const { theme, setThemeId } = useTheme();
  const { pushToast } = useApp();

  const themed = useMemo(() => CAMPAIGNS.filter((c) => c.tema === theme.id), [theme.id]);

  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(themed[0]?.id ?? null);
  const baseCampaign: Campaign | null = useMemo(
    () => CAMPAIGNS.find((c) => c.id === activeCampaignId) ?? themed[0] ?? null,
    [activeCampaignId, themed]
  );
  const [format, setFormat] = useState<FormatKind>("print-flyer");
  const [category, setCategory] = useState<"print" | "digital">("print");
  const [imageVariant, setImageVariant] = useState(0);
  const [edits, setEdits] = useState<Record<string, Edits>>({});

  type ActionKind =
    | "print-order"
    | "print-pdf"
    | "digital-pack"
    | "digital-send"          // Meta (FB/IG)
    | "digital-send-google"   // Google Ads
    | "digital-send-linkedin" // LinkedIn Campaign Manager
    | "digital-link"
    | "email-html"            // Copy email-signature HTML
    | "email-outlook";        // Install email signature in Outlook
  const [confirm, setConfirm] = useState<null | { kind: ActionKind; label: string; account?: string }>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  /* Mobile-only: bottom tab bar opens one of four sheets — Format, Billede,
     Tema, or Rediger (which routes to the existing edit drawer). On desktop
     these controls live in the floating top bar + left aside, both hidden
     below `lg:`. The preview is the killer feature; everything else is one
     thumb-tap away. */
  type SheetTab = "format" | "billede" | "tema";
  const [sheetTab, setSheetTab] = useState<SheetTab | null>(null);
  /* Mobile-only: pixel-perfect zoom lightbox. The inline preview on mobile
     fits the whole creative in view so the user sees the layout. Tap the
     magnifying glass to open it large enough to read text and inspect
     details — scroll/pan inside, X or ESC to close. */
  const [zoomOpen, setZoomOpen] = useState(false);

  // ESC closes drawers
  useEffect(() => {
    if (!drawerOpen && !historyOpen && !sheetTab && !zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setHistoryOpen(false);
        setSheetTab(null);
        setZoomOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, historyOpen, sheetTab, zoomOpen]);

  // Body scroll lock while any mobile bottom sheet OR zoom lightbox is open
  useEffect(() => {
    if (!sheetTab && !zoomOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [sheetTab, zoomOpen]);

  // Image variants filtered by active theme — sommer photos for sommer-sikring,
  // winter for vinter-byg, dusk/autumn for indbrud-efterar.
  const variants = useMemo(() => imagesForTheme(theme.id), [theme.id]);
  const safeIdx = Math.min(imageVariant, variants.length - 1);
  const currentImage = variants[safeIdx];

  // React 19 "adjust state during render" pattern (https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  // When the theme tab changes, reset the image picker AND jump to the first
  // campaign of the new theme so the canvas stays on-theme.
  const [prevThemeId, setPrevThemeId] = useState(theme.id);
  if (prevThemeId !== theme.id) {
    setPrevThemeId(theme.id);
    setImageVariant(0);
    const firstInTheme = themed[0];
    if (firstInTheme) {
      setActiveCampaignId(firstInTheme.id);
      setFormat(firstInTheme.formater[0]);
      setCategory(firstInTheme.formater[0].startsWith("print") ? "print" : "digital");
    }
  }
  const isUnpublished = baseCampaign?.tema !== theme.id;

  // Apply edits to the base campaign
  const activeCampaign: Campaign | null = useMemo(() => {
    if (!baseCampaign) return null;
    const e = edits[baseCampaign.id] ?? {};
    return {
      ...baseCampaign,
      hovedbudskab: e.hovedbudskab ?? baseCampaign.hovedbudskab,
      underbudskab: e.underbudskab ?? baseCampaign.underbudskab,
      cta:          e.cta          ?? baseCampaign.cta,
    };
  }, [baseCampaign, edits]);

  const hasEdits = Boolean(baseCampaign && edits[baseCampaign.id]);

  function updateEdit(field: keyof Edits, value: string) {
    if (!baseCampaign) return;
    setEdits((prev) => ({
      ...prev,
      [baseCampaign.id]: { ...(prev[baseCampaign.id] ?? {}), [field]: value },
    }));
  }
  function resetEdits() {
    if (!baseCampaign) return;
    setEdits((prev) => { const next = { ...prev }; delete next[baseCampaign.id]; return next; });
    pushToast("Tekst nulstillet til original");
  }

  const currentCategoryFormats = activeCampaign
    ? activeCampaign.formater.filter((f) => f.startsWith(category + "-"))
    : [];

  return (
    /* pb-[92px] on mobile leaves room for the fixed mobile bottom bar so it
       doesn't cover the canvas preview at the end of the page. Reset on lg+. */
    <div className="flex flex-col min-h-[calc(100vh-48px)] lg:h-[calc(100vh-48px)] pb-[92px] lg:pb-0 animate-in">
      {/* Desktop-best notice killed on mobile — now that the page has a
          proper tabbed bottom bar (Format / Billede / Tema / Rediger) the
          editor IS usable on a phone, the apology was misleading. */}

      {/* ─── COMPACT HEADER (logo changer now lives in the edit drawer) ─── */}
      <div className="px-4 lg:px-10 xl:px-12 pt-6 pb-3 shrink-0">
        <PageHeader
          variant="compact"
          eyebrow="Marketing-værktøjskasse"
          title="Kampagner"
          themeColor={theme.accent}
          actions={
            /* PageHeader actions on desktop only. On mobile these were
               wrapping into a gray strip above the canvas; the same
               functions live in the bottom tab sheets (Mine kampagner is
               inside the Kampagne sheet, Nulstil/Gem are in the edit
               drawer). */
            <div className="hidden lg:contents">
              {hasEdits && (
                <button onClick={resetEdits} className="btn btn-secondary" data-tt="Vend tilbage til original copy">
                  Nulstil tekst
                </button>
              )}
              <button
                onClick={() => setHistoryOpen(true)}
                className="btn btn-secondary inline-flex items-center gap-2"
                data-tt="Se kampagner du har kørt — genbestil eller send igen"
              >
                <Icon name="history" size={14} />
                Mine kampagner
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold leading-none">{CAMPAIGN_HISTORY.length}</span>
              </button>
              <button onClick={() => pushToast("Gemt som skabelon")} className="btn btn-secondary" data-tt="Gem som personlig skabelon">
                Gem skabelon
              </button>
            </div>
          }
        />
      </div>

      {/* ─── EDITOR: left rail + canvas. Generous pb so the floating dock never crowds the browser-window edge.
          On mobile (<lg) the rail stacks above the canvas so nothing overflows horizontally. */}
      <div className="flex-1 grid gap-4 px-4 lg:px-10 xl:px-12 pb-8 lg:pb-10 grid-cols-1 lg:grid-cols-[280px_1fr] min-h-0">
        {/* LEFT — campaign picker + image variants. Desktop only.
            On mobile (<lg) the equivalent controls live in the bottom tab
            bar (Tema sheet + Billede sheet) so the canvas can take the
            whole viewport — the preview is the killer feature. */}
        <aside className="hidden lg:flex flex-col gap-4 lg:self-start lg:sticky lg:top-[60px] lg:h-[calc(100vh-90px)] lg:overflow-y-auto lg:pr-1 lg:scrollbar-hidden">
          <div className="card !p-3">
            {/* Theme tabs — pick the årshjul, see only its campaigns below.
                Short single-word labels (Sommer / Vinter / Indbrud) fit cleanly in
                the 280px rail; full label is on hover via title=. min-w-0 on the
                flex children is what makes truncate actually engage — without it
                the long compound words push past the card edge. */}
            <div className="flex gap-1 mb-3 p-1 bg-[var(--canvas-2)] rounded-[var(--r-md)]" role="tablist" aria-label="Vælg tema">
              {THEMES.map((t) => {
                const isActive = t.id === theme.id;
                const count = CAMPAIGNS.filter((c) => c.tema === t.id).length;
                // Short tab label derived from theme id — first segment, capitalised.
                // "sommer-sikring" → "Sommer", "vinter-byg" → "Vinter", "indbrud-efterar" → "Indbrud"
                const shortLabel = t.id.split("-")[0];
                const tabLabel = shortLabel.charAt(0).toUpperCase() + shortLabel.slice(1);
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setThemeId(t.id)}
                    className={
                      "min-w-0 flex-1 px-2 py-2 rounded-[8px] text-[12px] font-semibold transition-colors flex flex-col items-center gap-1 " +
                      (isActive
                        ? "bg-white text-[var(--ink)] shadow-[var(--shadow-1)]"
                        : "text-[var(--ink-3)] hover:text-[var(--ink-2)]")
                    }
                    title={t.label}
                  >
                    <span className="size-2 rounded-full" style={{ background: t.accent }} aria-hidden="true" />
                    <span className="truncate w-full text-center leading-tight">{tabLabel}</span>
                    <span className="text-[10px] text-[var(--ink-4)] tabular-nums">{count}</span>
                  </button>
                );
              })}
            </div>

            <ul>
              {themed.map((c) => {
                const isActive = activeCampaign?.id === c.id;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => { setActiveCampaignId(c.id); setFormat(c.formater[0]); setCategory(c.formater[0].startsWith("print") ? "print" : "digital"); }}
                      className={"w-full text-left flex items-start gap-3 p-2.5 rounded-[var(--r-md)] transition-colors relative " +
                        (isActive
                          ? "bg-[var(--accent-tint)] ring-1 ring-[var(--accent)]/30"
                          : "hover:bg-[var(--canvas-2)]")}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {/* Left accent strip — bolder active signal */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full" style={{ background: theme.accent }} />
                      )}
                      <div className="size-9 rounded-lg grid place-items-center text-xl shrink-0" style={{ background: theme.accentSoft }}>
                        {c.heroEmoji}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className={"text-[13px] leading-tight truncate " + (isActive ? "font-bold text-[var(--accent-press)]" : "font-semibold text-[var(--ink)]")}>
                          {c.titel}
                        </div>
                        <div className="text-[12px] text-[var(--ink-3)] mt-0.5 truncate">
                          Print + digital · {c.status}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

          </div>

          {/* Image variant strip */}
          <div className="card !p-4">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[12px] font-semibold text-[var(--ink-2)]">Billede</span>
              <span className="text-[12px] text-[var(--ink-3)]">{variants.length} valg</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setImageVariant(idx)}
                  data-tt={v.label}
                  className={"aspect-[3/4] rounded-[var(--r-md)] relative overflow-hidden grid place-items-center transition-all " +
                    (imageVariant === idx ? "ring-2 ring-[var(--accent)] ring-offset-2" : "ring-1 ring-[var(--line-2)] hover:ring-[var(--accent)] opacity-90 hover:opacity-100")}
                  style={{ background: v.bg }}
                  aria-label={v.label}
                />
              ))}
            </div>
            <div className="mt-3 text-[12px] text-[var(--ink-3)]">
              <strong className="text-[var(--ink-2)] font-medium">{variants[imageVariant].label}</strong>
            </div>
          </div>
        </aside>

        {/* CENTER — CANVAS (full bleed, floating chrome). On mobile we
            give it the bulk of the viewport — preview is the killer
            feature, chrome lives in the bottom tab bar. */}
        <section className="relative rounded-[var(--r-xl)] overflow-hidden bg-[var(--canvas-3)] border border-[var(--line-2)] min-h-[calc(100dvh-220px)] lg:min-h-[640px]">
          {/* subtle canvas grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.55] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* FLOATING TOP BAR — desktop only. Tried inlining it on mobile but
              the `pointer-events-none` parent + crowded layout meant the bar
              showed but no buttons fired. On mobile we now use a dedicated
              fixed bottom-bar + bottom-sheet pattern (further down in this
              component) — same controls, native-mobile UX. */}
          <div className="hidden lg:flex absolute top-4 left-4 right-4 z-20 items-center justify-between gap-3 pointer-events-none flex-wrap">

            {/* Udkast badge — only shown when there are unsaved edits, no longer
                attached to the now-killed title pill. */}
            {isUnpublished ? (
              <div className="pointer-events-auto inline-flex items-center gap-2 bg-[var(--ink)] text-white rounded-full px-3 py-1 text-[11px] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <span className="size-1.5 rounded-full bg-white" />
                Udkast
              </div>
            ) : (
              <span aria-hidden="true" />
            )}

            {/* CENTER — Print/Digital + format pills, visually bonded */}
            <div className="pointer-events-auto flex items-center gap-1.5">
              <div className="inline-flex rounded-full bg-white/90 backdrop-blur-md p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[var(--line-2)]">
                {(["print", "digital"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      const first = activeCampaign?.formater.find((f) => f.startsWith(c + "-"));
                      if (first) setFormat(first);
                    }}
                    className={
                      "px-3.5 py-1 rounded-full text-[12px] font-medium transition-colors " +
                      (category === c ? "bg-[var(--ink)] text-white" : "text-[var(--ink-3)] hover:text-[var(--ink)]")
                    }
                  >
                    {c === "print" ? "Print" : "Digital"}
                  </button>
                ))}
              </div>

              {currentCategoryFormats.length > 0 && (
                <div className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[var(--line-2)]">
                  {currentCategoryFormats.map((f) => {
                    const meta = FORMATS.find((x) => x.id === f)!;
                    const sel = format === f;
                    // Short pill label — strip the channel suffix ("-opslag",
                    // " story", "-signatur", "-annonce", " A3/A5") so all four
                    // formats fit on one row alongside the action cluster.
                    // Full name still appears in the tooltip via data-tt.
                    const shortLabel = meta.label
                      .replace(/ A[35]/, "")
                      .replace(/-opslag$/, "")
                      .replace(/ story$/, "")
                      .replace(/-signatur$/, "")
                      .replace(/-annonce$/, "");
                    return (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        data-tt={`${meta.label} · ${meta.dim}`}
                        data-tt-pos="bottom"
                        className={
                          "shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-[12px] font-medium whitespace-nowrap " +
                          (sel ? "bg-[var(--ink)] text-white" : "text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--canvas-2)]")
                        }
                      >
                        <FormatThumb format={f} active={sel} />
                        <span>{shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT — primary actions cluster (Rediger + secondary + primary CTA) */}
            <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[var(--line-2)]">
              <button
                onClick={() => setDrawerOpen(true)}
                data-tt="Åbn redigerings­panel"
                data-tt-pos="bottom"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium text-[var(--ink-2)] hover:bg-[var(--canvas-2)] transition-colors whitespace-nowrap"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4z" />
                </svg>
                Rediger
              </button>

              <span className="w-px h-5 bg-[var(--line-2)]" />

              {/* Format-specific action cluster.
                  Each format has its own natural verbs — an email signature
                  doesn't get "Send til konto", a Google ad doesn't get
                  "Indsæt i Outlook". Keeps the action menu tight and on-task. */}
              {(() => {
                const fmtLabel = FORMATS.find((f) => f.id === format)?.label ?? "";

                // — Email signature: copy HTML or install in Outlook —
                if (format === "digital-email") {
                  return (
                    <>
                      <button
                        onClick={() => setConfirm({ kind: "email-html", label: fmtLabel })}
                        data-tt="Kopiér HTML-snippet til email-klient"
                        data-tt-pos="bottom"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium text-[var(--ink-2)] hover:bg-[var(--canvas-2)] transition-colors whitespace-nowrap"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        Kopiér HTML
                      </button>
                      <button
                        onClick={() => setConfirm({ kind: "email-outlook", label: fmtLabel })}
                        data-tt="Send signatur som .htm-fil til Outlook"
                        data-tt-pos="bottom"
                        className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-press)] transition-colors whitespace-nowrap"
                      >
                        Indsæt i Outlook
                      </button>
                    </>
                  );
                }

                // — Google ads: link, asset pack, send to Google Ads —
                if (format === "digital-google") {
                  return (
                    <>
                      <button
                        onClick={() => setConfirm({ kind: "digital-link", label: fmtLabel })}
                        data-tt="Kopiér delelink"
                        data-tt-pos="bottom"
                        className="size-7 grid place-items-center rounded-full text-[var(--ink-2)] hover:bg-[var(--canvas-2)] transition-colors"
                        aria-label="Kopiér link"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 007 0l4-4a5 5 0 00-7-7l-1 1" />
                          <path d="M14 11a5 5 0 00-7 0l-4 4a5 5 0 007 7l1-1" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirm({ kind: "digital-pack", label: fmtLabel })}
                        data-tt="Download asset-pakke (JPG + PNG + dimensions)"
                        data-tt-pos="bottom"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium text-[var(--ink-2)] hover:bg-[var(--canvas-2)] transition-colors whitespace-nowrap"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Asset-pakke
                      </button>
                      <button
                        onClick={() => setConfirm({ kind: "digital-send-google", label: fmtLabel })}
                        data-tt="Send kampagnen som kladde til Google Ads"
                        data-tt-pos="bottom"
                        className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-press)] transition-colors whitespace-nowrap"
                      >
                        Send til Google Ads
                      </button>
                    </>
                  );
                }

                // — LinkedIn: link, asset pack, send to LinkedIn Campaign Manager —
                if (format === "digital-linkedin") {
                  return (
                    <>
                      <button
                        onClick={() => setConfirm({ kind: "digital-link", label: fmtLabel })}
                        data-tt="Kopiér delelink"
                        data-tt-pos="bottom"
                        className="size-7 grid place-items-center rounded-full text-[var(--ink-2)] hover:bg-[var(--canvas-2)] transition-colors"
                        aria-label="Kopiér link"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 007 0l4-4a5 5 0 00-7-7l-1 1" />
                          <path d="M14 11a5 5 0 00-7 0l-4 4a5 5 0 007 7l1-1" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirm({ kind: "digital-pack", label: fmtLabel })}
                        data-tt="Download asset-pakke (JPG + PNG + dimensions)"
                        data-tt-pos="bottom"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium text-[var(--ink-2)] hover:bg-[var(--canvas-2)] transition-colors whitespace-nowrap"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Asset-pakke
                      </button>
                      <button
                        onClick={() => setConfirm({ kind: "digital-send-linkedin", label: fmtLabel })}
                        data-tt="Send kampagnen som kladde til LinkedIn Campaign Manager"
                        data-tt-pos="bottom"
                        className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-press)] transition-colors whitespace-nowrap"
                      >
                        Send til LinkedIn
                      </button>
                    </>
                  );
                }

                // — Meta (Facebook / Instagram): link, asset pack, send to Meta —
                if (format === "digital-facebook" || format === "digital-instagram") {
                  return (
                    <>
                      <button
                        onClick={() => setConfirm({ kind: "digital-link", label: fmtLabel })}
                        data-tt="Kopiér delelink"
                        data-tt-pos="bottom"
                        className="size-7 grid place-items-center rounded-full text-[var(--ink-2)] hover:bg-[var(--canvas-2)] transition-colors"
                        aria-label="Kopiér link"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 007 0l4-4a5 5 0 00-7-7l-1 1" />
                          <path d="M14 11a5 5 0 00-7 0l-4 4a5 5 0 007 7l1-1" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirm({ kind: "digital-pack", label: fmtLabel })}
                        data-tt="Download asset-pakke (JPG + PNG + dimensions)"
                        data-tt-pos="bottom"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium text-[var(--ink-2)] hover:bg-[var(--canvas-2)] transition-colors whitespace-nowrap"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Asset-pakke
                      </button>
                      <button
                        onClick={() => setConfirm({ kind: "digital-send", label: fmtLabel })}
                        data-tt="Send kampagnen som kladde til Meta Business"
                        data-tt-pos="bottom"
                        className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-press)] transition-colors whitespace-nowrap"
                      >
                        Send til Meta
                      </button>
                    </>
                  );
                }

                // — Print (flyer / poster / magasin / bilstreamer): PDF + bestil tryk —
                return (
                  <>
                    <button
                      onClick={() => setConfirm({ kind: "print-pdf", label: fmtLabel })}
                      data-tt="Print-klar PDF til lokalt tryk"
                      data-tt-pos="bottom"
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium text-[var(--ink-2)] hover:bg-[var(--canvas-2)] transition-colors whitespace-nowrap"
                    >
                      Hent PDF
                    </button>
                    <button
                      onClick={() => setConfirm({ kind: "print-order", label: fmtLabel })}
                      data-tt="Carl Ras producerer og leverer · 50% af medieomkostninger dækket"
                      data-tt-pos="bottom"
                      className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-press)] transition-colors whitespace-nowrap"
                    >
                      {format === "print-bilstreamer" ? "Bestil streamer" : "Bestil tryk"}
                    </button>
                  </>
                );
              })()}
            </div>
          </div>

          {/* PREVIEW STAGE — fills the canvas with maximum breathing room.
              Top padding clears the action/format/title row; bottom padding
              clears the thin info strip. Preview is the hero. */}
          {activeCampaign && (
            <>
              {/* Desktop preview — natural sizing via FRAME values (vw/vh).
                  The desktop canvas is wide enough that cqw-based text
                  inside CampaignPreview resolves at readable sizes. */}
              <div className="hidden lg:grid absolute inset-0 place-items-center px-6 pt-24 pb-12">
                <div className="relative max-w-full max-h-full grid place-items-center">
                  <CampaignPreview
                    campaign={activeCampaign}
                    partner={CURRENT_PARTNER}
                    theme={theme}
                    format={format}
                    image={currentImage}
                  />
                </div>
              </div>

              {/* Mobile preview — fit the WHOLE creative in view so the
                  user gets the layout/feel at a glance. Uses the FRAME
                  defaults (92vw / 72vh) so the preview sizes to fit the
                  canvas section. Text inside is proportionally small at
                  this scale; the magnifying-glass button below opens a
                  pixel-perfect lightbox for reading + inspecting. */}
              <div className="lg:hidden absolute inset-0 grid place-items-center px-4 py-4">
                <div className="relative max-w-full max-h-full grid place-items-center">
                  <CampaignPreview
                    campaign={activeCampaign}
                    partner={CURRENT_PARTNER}
                    theme={theme}
                    format={format}
                    image={currentImage}
                  />
                </div>
              </div>

              {/* Zoom button — opens the pixel-perfect lightbox.
                  Positioned top-right of the canvas, above the preview. */}
              <button
                onClick={() => setZoomOpen(true)}
                aria-label="Forstør kreativ"
                className="lg:hidden absolute top-3 right-3 z-10 size-11 rounded-full bg-white/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.18)] grid place-items-center text-[var(--ink)] active:scale-[0.95] transition-transform"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                  <path d="M11 8v6M8 11h6" />
                </svg>
              </button>
            </>
          )}

          {/* BOTTOM INFO STRIP — quiet, no actions, no card. Just contextual info
              the partner cares about. All actions live in the top bar now. */}
          <div className="absolute left-6 right-6 bottom-3 z-10 flex items-center justify-between gap-3 text-[12px] text-[var(--ink-3)] pointer-events-none">
            <span className="pointer-events-auto inline-flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16v.5" />
              </svg>
              {category === "print"
                ? <>Sølv- og Guld: <strong className="text-[var(--ink-2)] font-semibold">50% af medieomkostninger dækket</strong> · 5 hverdages levering</>
                : <>Asset-pakken indeholder JPG + PNG + dimensions klar til upload</>}
            </span>
            <span className="pointer-events-auto tabular-nums opacity-80">
              {FORMATS.find((f) => f.id === format)?.dim}
            </span>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE BOTTOM TAB BAR — four tabs at viewport bottom. Each tab
          opens a bottom sheet with focused controls:
            Format  → Print/Digital + format chips
            Billede → image variants (was in the aside on desktop)
            Tema    → theme tabs + campaign list (was in the aside)
            Rediger → opens the existing edit drawer (which is already
                      a bottom-sheet on mobile via .mobile-sheet)
          The preview is the killer feature, so the tab bar is the only
          chrome above the canvas — controls stay one tap away without
          eating screen.
          ═════════════════════════════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[var(--line-2)] flex items-stretch shadow-[0_-6px_18px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: "max(6px, env(safe-area-inset-bottom, 0px))" }}
        aria-label="Kampagne-kontroller"
      >
        {[
          {
            id: "format" as const,
            label: "Format",
            sub: category === "print" ? "Print" : "Digital",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 3v18" />
              </svg>
            ),
          },
          {
            id: "billede" as const,
            label: "Billede",
            sub: variants[imageVariant]?.label.split(" ")[0] ?? "",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            ),
          },
          {
            id: "tema" as const,
            label: "Kampagne",
            sub: activeCampaign?.titel.split(" ")[0] ?? "Vælg",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <path d="M9 22V12h6v10" />
              </svg>
            ),
          },
          {
            id: "rediger" as const,
            label: "Rediger",
            sub: hasEdits ? "Ændret" : "Tekst",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4z" />
              </svg>
            ),
          },
        ].map((tab) => {
          const isActive =
            tab.id === "rediger" ? drawerOpen : sheetTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "rediger") {
                  setSheetTab(null);
                  setDrawerOpen(true);
                } else {
                  setSheetTab(sheetTab === tab.id ? null : tab.id);
                }
              }}
              className={
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors " +
                (isActive ? "text-[var(--accent)]" : "text-[var(--ink-2)] active:text-[var(--ink)]")
              }
              aria-pressed={isActive}
            >
              <span className={isActive ? "text-[var(--accent)]" : "text-[var(--ink-2)]"}>{tab.icon}</span>
              <span className="text-[10.5px] font-semibold leading-tight">{tab.label}</span>
              {tab.sub && (
                <span className="text-[9.5px] text-[var(--ink-3)] leading-tight truncate max-w-[64px]">{tab.sub}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE BOTTOM SHEETS — one per tab (Rediger uses the existing
          edit drawer, not a sheet). All share the same shell: backdrop,
          drag handle, header with title + X, scrolling body.
          ═════════════════════════════════════════════════════════════ */}
      {sheetTab && (
        <div className="lg:hidden fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={sheetTab === "format" ? "Skift format" : sheetTab === "billede" ? "Skift billede" : "Skift kampagne"}>
          <div
            onClick={() => setSheetTab(null)}
            className="absolute inset-0 bg-black/45 backdrop-blur-[1px] animate-in"
          />
          <aside
            className="absolute left-0 right-0 bottom-0 bg-white rounded-t-[20px] shadow-[0_-12px_40px_rgba(0,0,0,0.22)] flex flex-col max-h-[88dvh]"
            style={{ animation: "slideInUp 280ms cubic-bezier(0.22,1,0.36,1)", paddingBottom: "max(20px, env(safe-area-inset-bottom, 0px))" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="grid place-items-center pt-3">
              <span className="w-10 h-1 rounded-full bg-[var(--line)] opacity-60" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-3 pb-4">
              <h3 className="font-bold text-[var(--ink)] tracking-tight" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>
                {sheetTab === "format" && "Medie & format"}
                {sheetTab === "billede" && "Vælg billede"}
                {sheetTab === "tema" && "Vælg kampagne"}
              </h3>
              <button
                onClick={() => setSheetTab(null)}
                aria-label="Luk"
                className="size-9 grid place-items-center rounded-full active:bg-[var(--canvas-2)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ─── FORMAT SHEET ─── */}
            {sheetTab === "format" && (
              <div className="px-5 pb-3 overflow-y-auto">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-3)] mb-2">Medie</div>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-[var(--canvas-2)]">
                  {(["print", "digital"] as const).map((c) => {
                    const active = category === c;
                    return (
                      <button
                        key={c}
                        onClick={() => {
                          setCategory(c);
                          const first = activeCampaign?.formater.find((f) => f.startsWith(c + "-"));
                          if (first) setFormat(first);
                        }}
                        className={
                          "py-2.5 text-[14px] font-semibold rounded-full transition-colors " +
                          (active ? "bg-white text-[var(--ink)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-[var(--ink-3)]")
                        }
                      >
                        {c === "print" ? "Print" : "Digital"}
                      </button>
                    );
                  })}
                </div>

                <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-3)] mt-5 mb-2">Format</div>
                <div className="grid grid-cols-2 gap-2">
                  {currentCategoryFormats.map((f) => {
                    const meta = FORMATS.find((x) => x.id === f);
                    if (!meta) return null;
                    const active = format === f;
                    return (
                      <button
                        key={f}
                        onClick={() => { setFormat(f); setSheetTab(null); }}
                        className={
                          "text-left rounded-[var(--r-md)] border-2 transition-all active:scale-[0.98] " +
                          (active
                            ? "border-[var(--ink)] bg-[var(--ink)] text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                            : "border-[var(--line)] bg-white")
                        }
                        style={{ minHeight: 64, padding: "12px 14px" }}
                      >
                        <div className={"font-semibold " + (active ? "text-white" : "text-[var(--ink)]")} style={{ fontSize: 14 }}>{meta.label}</div>
                        <div className={"mt-0.5 " + (active ? "text-white/80" : "text-[var(--ink-3)]")} style={{ fontSize: 12 }}>{meta.dim}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── BILLEDE SHEET ─── */}
            {sheetTab === "billede" && (
              <div className="px-5 pb-3 overflow-y-auto">
                <p className="text-[13px] text-[var(--ink-3)] mb-3">Skift fotoet i kampagnen. Tryk på en variant for at se den i canvas.</p>
                <div className="grid grid-cols-3 gap-3">
                  {variants.map((v, idx) => {
                    const active = imageVariant === idx;
                    return (
                      <button
                        key={v.id}
                        onClick={() => { setImageVariant(idx); setSheetTab(null); }}
                        className={
                          "aspect-[3/4] rounded-[var(--r-md)] relative overflow-hidden grid place-items-end transition-all active:scale-[0.97] " +
                          (active ? "ring-2 ring-[var(--ink)] ring-offset-2" : "ring-1 ring-[var(--line-2)]")
                        }
                        style={{ background: v.bg }}
                      >
                        <span className="w-full bg-gradient-to-t from-black/60 to-transparent text-white text-[11px] font-semibold px-2 py-1 text-left leading-tight">{v.label}</span>
                        {active && (
                          <span className="absolute top-1.5 right-1.5 size-5 rounded-full bg-white grid place-items-center">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── TEMA / KAMPAGNE SHEET ─── */}
            {sheetTab === "tema" && (
              <div className="px-5 pb-3 overflow-y-auto">
                {/* Theme tabs — same Sommer/Vinter/Indbrud picker from the
                    aside. Switching a theme reseeds image + campaign via
                    the "adjust during render" effect higher up. */}
                <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-3)] mb-2">Tema</div>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-[var(--canvas-2)]">
                  {THEMES.map((t) => {
                    const isActive = t.id === theme.id;
                    const shortLabel = t.id.split("-")[0];
                    const tabLabel = shortLabel.charAt(0).toUpperCase() + shortLabel.slice(1);
                    return (
                      <button
                        key={t.id}
                        onClick={() => setThemeId(t.id)}
                        className={
                          "py-2.5 text-[13px] font-semibold rounded-full transition-colors " +
                          (isActive ? "bg-white text-[var(--ink)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-[var(--ink-3)]")
                        }
                      >
                        {tabLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Campaign list for the active theme */}
                <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-3)] mt-5 mb-2">Kampagne</div>
                <ul className="flex flex-col gap-1.5">
                  {themed.map((c) => {
                    const isActive = activeCampaign?.id === c.id;
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => {
                            setActiveCampaignId(c.id);
                            setFormat(c.formater[0]);
                            setCategory(c.formater[0].startsWith("print") ? "print" : "digital");
                            setSheetTab(null);
                          }}
                          className={
                            "w-full text-left flex items-start gap-3 p-3 rounded-[var(--r-md)] transition-colors " +
                            (isActive ? "bg-[var(--accent-tint)] ring-1 ring-[var(--accent)]/30" : "bg-[var(--canvas-2)] active:bg-[var(--canvas-3)]")
                          }
                        >
                          <div
                            className="size-10 rounded-lg grid place-items-center text-[15px] font-bold shrink-0"
                            style={{ background: theme.accentSoft, color: theme.accentInk }}
                          >
                            {c.titel.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className={"text-[14px] leading-tight " + (isActive ? "font-bold text-[var(--accent-press)]" : "font-semibold text-[var(--ink)]")}>
                              {c.titel}
                            </div>
                            <div className="text-[12px] text-[var(--ink-3)] mt-0.5">
                              Print + digital · {c.status}
                            </div>
                          </div>
                          {isActive && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1.5">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Mine kampagner shortcut */}
                <button
                  onClick={() => { setHistoryOpen(true); setSheetTab(null); }}
                  className="w-full mt-5 pt-4 border-t border-[var(--line-2)] flex items-center justify-between"
                >
                  <span className="text-[14px] font-semibold text-[var(--ink-2)]">Tidligere kampagner ({CAMPAIGN_HISTORY.length})</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--ink-3)]">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE ZOOM LIGHTBOX — pixel-perfect view of the creative.
          Forces CampaignPreview to render at 720px container width via
          the --cp-max-w / --cp-h CSS variables, so the internal cqw text
          resolves at desktop-equivalent sizes. The wrapper is overflow-
          auto with touch-action: manipulation so the user can pan in
          both axes + pinch-zoom (where the platform supports it). X
          button in the top bar, ESC also closes.
          ═════════════════════════════════════════════════════════════ */}
      {zoomOpen && activeCampaign && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex flex-col" role="dialog" aria-modal="true" aria-label="Forstør kreativ">
          {/* Top bar */}
          <div
            className="shrink-0 flex items-center justify-between gap-3 px-3 py-2 text-white"
            style={{ paddingTop: "max(8px, env(safe-area-inset-top, 0px))" }}
          >
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.14em] opacity-60 font-semibold">Pixel-perfekt</div>
              <div className="text-[14px] font-semibold truncate">
                {activeCampaign.titel} · {FORMATS.find((f) => f.id === format)?.label}
              </div>
            </div>
            <button
              onClick={() => setZoomOpen(false)}
              aria-label="Luk"
              className="size-10 rounded-full grid place-items-center bg-white/15 active:bg-white/25 transition-colors shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scroll + pinch-zoom area */}
          <div
            className="flex-1 overflow-auto"
            style={{
              touchAction: "manipulation",
              ["--cp-max-w" as string]: "720px",
              ["--cp-h" as string]: "1024px",
            }}
          >
            <div className="min-h-full flex items-center justify-center px-3 py-5">
              <CampaignPreview
                campaign={activeCampaign}
                partner={CURRENT_PARTNER}
                theme={theme}
                format={format}
                image={currentImage}
              />
            </div>
          </div>

          {/* Hint strip */}
          <div
            className="shrink-0 text-center text-[11.5px] text-white/55 px-3 py-2"
            style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom, 0px))" }}
          >
            Træk for at panorere · Knib for at zoome
          </div>
        </div>
      )}

      {/* ─── EDIT DRAWER (slides from right) ─── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 animate-in"
          onClick={() => setDrawerOpen(false)}
        >
          {/* dim */}
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

          {/* panel */}
          <aside
            className="mobile-sheet md:top-[48px] md:right-0 md:bottom-0 md:w-[480px] md:max-w-[95vw] bg-white md:border-l md:border-[var(--line-2)] shadow-[var(--shadow-3)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="px-5 py-4 border-b border-[var(--line-2)] flex items-center justify-between">
              <div>
                <div className="t-eyebrow !text-[12px]">Rediger kampagne</div>
                <div className="text-[15px] font-semibold text-[var(--ink)] mt-0.5">{activeCampaign?.titel}</div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="size-8 rounded-full grid place-items-center hover:bg-[var(--canvas-2)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
                aria-label="Luk"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer body — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {/* Tilpas tekst */}
              <section>
                <div className="t-eyebrow mb-3">Tekst</div>
                <EditField
                  label="Hovedbudskab"
                  value={activeCampaign?.hovedbudskab ?? ""}
                  onChange={(v) => updateEdit("hovedbudskab", v)}
                  max={80}
                  multiline
                  rows={2}
                />
                <div className="h-4" />
                <EditField
                  label="Underbudskab"
                  value={activeCampaign?.underbudskab ?? ""}
                  onChange={(v) => updateEdit("underbudskab", v)}
                  max={200}
                  multiline
                  rows={5}
                />
                <div className="h-4" />
                <EditField
                  label="Call-to-action"
                  value={activeCampaign?.cta ?? ""}
                  onChange={(v) => updateEdit("cta", v)}
                  max={40}
                />
                <div className="h-4" />
                {/* CTA destination URL — where clicks go on digital ads.
                    Defaults to the partner's main website. Required by Meta,
                    Google, LinkedIn — without it, ads can't be approved. */}
                <EditField
                  label="Link til CTA"
                  value={edits[baseCampaign?.id ?? ""]?.ctaLink ?? `https://${CURRENT_PARTNER.webadresse}`}
                  onChange={(v) => updateEdit("ctaLink", v)}
                  max={200}
                  placeholder="https://din-side.dk/booking"
                  helpText="Hvor klik fra Facebook · Instagram · LinkedIn · Google sender kunden hen. Print-formater ignorerer dette felt."
                />
                {hasEdits && (
                  <button onClick={resetEdits} className="mt-4 text-[12px] font-semibold text-[var(--accent)] hover:underline">
                    Nulstil til original
                  </button>
                )}
              </section>

              {/* Partner logo — full editor lives here inside the drawer */}
              <section>
                <div className="t-eyebrow mb-3">Dit logo</div>
                <div className="flex items-center gap-3 p-3 rounded-[var(--r-md)] bg-[var(--canvas-2)] mb-2.5">
                  <div
                    className="size-10 rounded-lg grid place-items-center text-white font-semibold text-[13px] shrink-0"
                    style={{ background: CURRENT_PARTNER.logoBg }}
                  >
                    {CURRENT_PARTNER.initialer}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[var(--ink)] truncate">{CURRENT_PARTNER.firma}</div>
                    <div className="text-[12px] text-[var(--ink-3)] truncate">Nuværende logo · auto-hentet fra profil</div>
                  </div>
                </div>

                {/* Drag-drop upload area */}
                <label
                  className="block p-4 rounded-[var(--r-md)] border-2 border-dashed border-[var(--line)] text-center cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-tint)] transition-colors"
                  onClick={() => pushToast("Filvælger åbnes (demo)")}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-[var(--ink-3)]">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <div className="text-[12.5px] font-semibold text-[var(--ink-2)] mt-2">Træk en fil hertil, eller klik</div>
                  <div className="text-[12px] text-[var(--ink-3)] mt-1">PNG eller SVG · maks 2 MB · transparent baggrund anbefales</div>
                </label>
                <div className="text-[12px] text-[var(--ink-3)] mt-2 flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16v.5" /></svg>
                  Vi tilpasser automatisk logoets størrelse pr. format.
                </div>
              </section>

              {/* Digital-only: connected accounts */}
              {category === "digital" && (
                <section>
                  <div className="t-eyebrow mb-3">Forbundne konti</div>
                  <ul className="space-y-2">
                    {CONNECTED_ACCOUNTS.map((a) => (
                      <li key={a.id} className="flex items-center gap-3 p-2.5 rounded-[var(--r-md)] border border-[var(--line-2)]">
                        <div className="size-8 rounded-md grid place-items-center text-white text-[14px] font-bold shrink-0" style={{ background: a.color }}>{a.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-[var(--ink)] truncate">{a.name}</div>
                          <div className="text-[12px] text-[var(--ink-3)] truncate">{a.connected ? a.account : "Ikke forbundet"}</div>
                        </div>
                        {a.connected ? (
                          <span className="size-2 rounded-full bg-[#2D4A0F] shrink-0" data-tt="Forbundet" />
                        ) : (
                          <button className="text-[12px] font-semibold text-[var(--accent)] shrink-0">Forbind →</button>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Tip */}
              <section>
                <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
                  <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">Tip</div>
                  <p className="text-[12px] text-[var(--ink-2)] mt-1.5 leading-[1.5]">
                    {category === "print"
                      ? "Bestil tryk lader Carl Ras producere og levere. Eller hent en print-klar PDF til din lokale trykker."
                      : "Send direkte til din annoncekonto som kladde, eller hent asset-pakken (JPG + PNG) til upload selv."}
                  </p>
                </div>
              </section>
            </div>

            {/* Drawer footer */}
            <div className="px-5 py-3.5 border-t border-[var(--line-2)] flex items-center justify-between gap-3 bg-[var(--canvas)]">
              <span className="text-[12px] text-[var(--ink-3)]">
                Ændringer gemmes automatisk
              </span>
              <button onClick={() => setDrawerOpen(false)} className="btn btn-primary !py-1.5">Færdig</button>
            </div>
          </aside>
        </div>
      )}

      {/* ─── HISTORY DRAWER: Mine kampagner ─── */}
      {historyOpen && (
        <div className="fixed inset-0 z-40 animate-in" onClick={() => setHistoryOpen(false)}>
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
          <aside
            className="mobile-sheet md:top-[48px] md:right-0 md:bottom-0 md:w-[560px] md:max-w-[95vw] bg-white md:border-l md:border-[var(--line-2)] shadow-[var(--shadow-3)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--line-2)] flex items-center justify-between">
              <div>
                <div className="t-eyebrow !text-[12px]">Aktivitet</div>
                <div className="text-[15px] font-semibold text-[var(--ink)] mt-0.5">Mine kampagner</div>
                <div className="text-[12px] text-[var(--ink-3)] mt-0.5">
                  {CAMPAIGN_HISTORY.length} kampagner siden april · {CAMPAIGN_HISTORY.reduce((s, h) => s + (h.leads ?? 0), 0)} leads i alt
                </div>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="size-8 rounded-full grid place-items-center hover:bg-[var(--canvas-2)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
                aria-label="Luk"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
              {CAMPAIGN_HISTORY.map((h) => {
                const campaign = CAMPAIGNS.find((c) => c.id === h.campaignId);
                const fmt = FORMATS.find((f) => f.id === h.format);
                const tema = campaign ? THEMES.find((t) => t.id === campaign.tema) : null;
                const variants = campaign ? imagesForTheme(campaign.tema) : [];
                const img = variants[h.imageVariant ?? 0];
                const status = STATUS_STYLES[h.status];
                if (!campaign || !fmt) return null;
                return (
                  <article key={h.id} className="rounded-[var(--r-lg)] border border-[var(--line-2)] bg-white hover:shadow-[var(--shadow-2)] hover:border-[var(--line)] transition-all overflow-hidden">
                    <div className="flex gap-3 p-3">
                      {/* Thumbnail — themed image with format ratio hint */}
                      <div
                        className="shrink-0 w-[88px] h-[88px] rounded-[var(--r-md)] bg-[var(--canvas-2)] overflow-hidden grid place-items-center text-2xl"
                        style={img ? { background: img.bg } : undefined}
                      >
                        {!img && campaign.heroEmoji}
                      </div>
                      {/* Body */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              {tema && <span className="size-2 rounded-full shrink-0" style={{ background: tema.accent }} aria-hidden />}
                              <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-3)] truncate">{fmt.label}</span>
                            </div>
                            <h3 className="text-[14px] font-semibold text-[var(--ink)] leading-tight mt-0.5 truncate">{campaign.titel}</h3>
                          </div>
                          <span
                            className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: status.bg, color: status.ink }}
                          >
                            <span className="size-1.5 rounded-full" style={{ background: status.dot }} />
                            {h.status}
                          </span>
                        </div>
                        <div className="text-[12px] text-[var(--ink-3)] mt-1 leading-[1.5]">
                          <div className="truncate">{h.dato} · {h.detail}</div>
                          {typeof h.leads === "number" && (
                            <div className="mt-1 inline-flex items-center gap-1 text-[var(--ink-2)] font-semibold">
                              <Icon name="users" size={12} /> {h.leads} {h.leads === 1 ? "lead" : "leads"} fra denne kampagne
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveCampaignId(h.campaignId);
                              setFormat(h.format);
                              setCategory(h.format.startsWith("print") ? "print" : "digital");
                              if (typeof h.imageVariant === "number") setImageVariant(h.imageVariant);
                              setHistoryOpen(false);
                              pushToast(`${campaign.titel} indlæst — klar til at sende igen`);
                            }}
                            className="btn btn-primary !py-1 !px-3 !text-[12px]"
                          >
                            Brug igen
                          </button>
                          <button
                            onClick={() => {
                              setActiveCampaignId(h.campaignId);
                              setFormat(h.format);
                              setCategory(h.format.startsWith("print") ? "print" : "digital");
                              if (typeof h.imageVariant === "number") setImageVariant(h.imageVariant);
                              setHistoryOpen(false);
                            }}
                            className="text-[12px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] px-2 py-1"
                          >
                            Se i editor →
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Empty-state hint at the bottom — reinforces the platform-as-memory pitch */}
              <div className="mt-3 p-3.5 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
                <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">Sådan virker det</div>
                <p className="text-[12px] text-[var(--ink-2)] mt-1.5 leading-[1.5]">
                  Hver kampagne du bestiller eller sender via platformen havner her. Brug &ldquo;Brug igen&rdquo; til at genbruge det samme materiale — Carl Ras pusher en ny kladde eller printer en ny omgang med dine ændringer fra sidst.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Confirmation modal — context-aware copy per action */}
      {confirm && (
        <ActionConfirm
          kind={confirm.kind}
          label={confirm.label}
          formatId={format}
          onClose={() => setConfirm(null)}
          onConfirm={(target) => {
            const messages: Record<typeof confirm.kind, string> = {
              "print-order":           `${confirm.label} er bestilt. Forventet levering: 5 hverdage.`,
              "print-pdf":             `${confirm.label} (print-PDF) er sendt til din email.`,
              "digital-pack":          `${confirm.label}-pakke downloades… ZIP er klar om få sekunder.`,
              "digital-send":          `${confirm.label} er sendt som kladde til ${target ?? "Meta Business"}.`,
              "digital-send-google":   `${confirm.label} er sendt som kladde til Google Ads.`,
              "digital-send-linkedin": `${confirm.label} er sendt som kladde til LinkedIn Campaign Manager.`,
              "digital-link":          `Delelink kopieret til udklipsholder.`,
              "email-html":            `HTML-snippet kopieret til udklipsholder. Indsæt i din email-klient.`,
              "email-outlook":         `${confirm.label} sendt til din email som .htm-fil — dobbeltklik for at installere i Outlook.`,
            };
            pushToast(messages[confirm.kind]);
            setConfirm(null);
          }}
        />
      )}

    </div>
  );
}

/* ─── Connected ad-account stubs (demo) ─── */
const CONNECTED_ACCOUNTS = [
  { id: "meta",     name: "Meta Business",  account: "Hornbæk Låseservice · Ad Account",  icon: "f", color: "#0866FF", connected: true },
  { id: "google",   name: "Google Ads",     account: "hornbaek-laas.dk · MCC linked",     icon: "G", color: "#34A853", connected: true },
  { id: "linkedin", name: "LinkedIn Pages", account: "—",                                  icon: "in", color: "#0A66C2", connected: false },
];

/* ─── ActionConfirm — context-aware modal for print + digital actions ─── */
function ActionConfirm({
  kind, label, formatId, onClose, onConfirm,
}: {
  kind:
    | "print-order"
    | "print-pdf"
    | "digital-pack"
    | "digital-send"
    | "digital-send-google"
    | "digital-send-linkedin"
    | "digital-link"
    | "email-html"
    | "email-outlook";
  label: string;
  formatId: FormatKind;
  onClose: () => void;
  onConfirm: (target?: string) => void;
}) {
  const isMeta = formatId === "digital-facebook" || formatId === "digital-instagram";
  const defaultTarget = isMeta ? "meta" : "meta";
  const [target, setTarget] = useState<string>(defaultTarget);

  const meta = (() => {
    switch (kind) {
      case "print-order": return {
        eyebrow: "Bestil tryk",
        title: `Bestil ${label}`,
        body: <>Carl Ras producerer og leverer inden for <strong>5 hverdage</strong>. Vi dækker 50% af medieomkostninger per din Sølv-aftale. Faktureres på din B2B-konto.</>,
        cta: "Bekræft bestilling",
      };
      case "print-pdf": return {
        eyebrow: "Hent print-PDF",
        title: `${label} klar som PDF`,
        body: <>Vi genererer en print-klar PDF med dine ændringer, logo og kontaktoplysninger. Lander i din indbakke om få sekunder.</>,
        cta: "Send PDF",
      };
      case "digital-pack": return {
        eyebrow: "Hent asset-pakke",
        title: `Download ${label}-pakke`,
        body: (
          <>
            ZIP indeholder:
            <ul className="mt-2 ml-4 space-y-1 text-[13px]">
              <li>• <strong>{label}.jpg</strong> (full resolution)</li>
              <li>• <strong>{label}@2x.png</strong> (retina, transparent)</li>
              <li>• <strong>dimensions.txt</strong> (specs til upload)</li>
            </ul>
            <span className="block mt-3 text-[12px] text-[var(--ink-3)]">Klar til upload til Meta, Google, LinkedIn eller hvor du nu poster.</span>
          </>
        ),
        cta: "Download ZIP",
      };
      case "digital-send": return {
        eyebrow: "Send til Meta Business",
        title: `Send ${label} som kladde`,
        body: <>Vi pusher kampagnen som <strong>kladde</strong> til din Meta-konto (Facebook + Instagram). Du publicerer selv når du er klar.</>,
        cta: "Send som kladde",
      };
      case "digital-send-google": return {
        eyebrow: "Send til Google Ads",
        title: `Send ${label} som kladde`,
        body: <>Vi pusher kampagnen som <strong>kladde</strong> til din Google Ads-konto, geo-targeted til dit lokalområde. Du publicerer selv når du er klar.</>,
        cta: "Send til Google Ads",
      };
      case "digital-send-linkedin": return {
        eyebrow: "Send til LinkedIn Campaign Manager",
        title: `Send ${label} som kladde`,
        body: <>Vi pusher kampagnen som <strong>kladde</strong> til LinkedIn Campaign Manager. Vælg selv målgruppe (jobtitel, branche, virksomhedsstørrelse) og publicér når du er klar.</>,
        cta: "Send til LinkedIn",
      };
      case "digital-link": return {
        eyebrow: "Kopiér delelink",
        title: "Del kampagnen",
        body: <>Få en kort URL der viser kampagnen i browseren. God til Slack, email og kundedialog inden du publicerer.</>,
        cta: "Kopiér link",
      };
      case "email-html": return {
        eyebrow: "Kopiér HTML-snippet",
        title: `Kopiér ${label}`,
        body: (
          <>
            Vi kopierer HTML for din email-signatur til udklipsholderen. Indsæt i:
            <ul className="mt-2 ml-4 space-y-1 text-[13px]">
              <li>• <strong>Gmail</strong> · Indstillinger → Signatur → Indsæt</li>
              <li>• <strong>Apple Mail</strong> · Indstillinger → Signaturer → træk ind</li>
              <li>• <strong>Outlook</strong> · brug “Indsæt i Outlook” for nemmeste installation</li>
            </ul>
          </>
        ),
        cta: "Kopiér HTML",
      };
      case "email-outlook": return {
        eyebrow: "Send til Outlook",
        title: `Installér ${label}`,
        body: <>Vi mailer signaturen som en <strong>.htm-fil</strong> til din adresse. Dobbeltklik for at åbne i Outlook — den lægger sig automatisk under Indstillinger → Mail → Signaturer.</>,
        cta: "Send som .htm",
      };
    }
  })();

  return (
    <div className="fixed inset-0 z-50 bg-black/45 grid place-items-center p-6 animate-in" onClick={onClose}>
      <div className="bg-white rounded-[var(--r-xl)] max-w-md w-full p-7 shadow-[var(--shadow-4)]" onClick={(e) => e.stopPropagation()}>
        <div className="t-eyebrow">{meta.eyebrow}</div>
        <h3 className="t-h2 mt-2">{meta.title}</h3>
        <div className="t-body mt-3">{meta.body}</div>

        {kind === "digital-send" && (
          <div className="mt-5">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-2">Vælg konto</div>
            <div className="space-y-2">
              {CONNECTED_ACCOUNTS.filter((a) => a.connected).map((a) => (
                <label key={a.id} className={"flex items-center gap-3 p-3 rounded-[var(--r-md)] border cursor-pointer transition-colors " + (target === a.id ? "border-[var(--accent)] bg-[var(--accent-tint)]" : "border-[var(--line-2)] hover:border-[var(--accent)]")}>
                  <input
                    type="radio"
                    name="acct"
                    checked={target === a.id}
                    onChange={() => setTarget(a.id)}
                    className="accent-[var(--accent)]"
                  />
                  <div className="size-7 rounded-md grid place-items-center text-white text-[12px] font-bold shrink-0" style={{ background: a.color }}>{a.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[var(--ink)]">{a.name}</div>
                    <div className="text-[12px] text-[var(--ink-3)] truncate">{a.account}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 flex gap-2 justify-end">
          <button className="btn btn-secondary" onClick={onClose}>Annullér</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              const accountName = kind === "digital-send" ? CONNECTED_ACCOUNTS.find((a) => a.id === target)?.name : undefined;
              onConfirm(accountName);
            }}
          >
            {meta.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Inspector edit field ─── */
function EditField({ label, value, onChange, max, multiline, rows, placeholder, helpText }: { label: string; value: string; onChange: (v: string) => void; max?: number; multiline?: boolean; rows?: number; placeholder?: string; helpText?: string }) {
  const len = value.length;
  const near = max ? len > max * 0.85 : false;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{label}</label>
        {max && (
          <span className={"text-[12px] tabular-nums " + (near ? "text-[#A32D2D]" : "text-[var(--ink-3)]")}>
            {len}/{max}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, max))}
          rows={rows ?? 3}
          placeholder={placeholder}
          className="w-full bg-[var(--canvas-2)] rounded-[var(--r-md)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none resize-y border border-transparent focus:border-[var(--accent)] focus:bg-white transition-colors leading-[1.5]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, max))}
          placeholder={placeholder}
          className="w-full bg-[var(--canvas-2)] rounded-[var(--r-md)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none border border-transparent focus:border-[var(--accent)] focus:bg-white transition-colors"
        />
      )}
      {helpText && <div className="text-[11.5px] text-[var(--ink-3)] mt-1.5 leading-[1.5]">{helpText}</div>}
    </div>
  );
}

/* ─── Tiny format thumbnail icon ─── */
function FormatThumb({ format, active }: { format: FormatKind; active: boolean }) {
  const stroke = active ? "white" : "currentColor";
  // Render a simplified rect approximating the aspect ratio of the format
  const dims: Record<FormatKind, { w: number; h: number }> = {
    "print-flyer":      { w: 11, h: 16 },
    "print-poster":     { w: 11, h: 16 },
    "print-magasin":    { w: 11, h: 16 },
    "print-bilstreamer":{ w: 18, h: 5 },
    "digital-facebook": { w: 15, h: 15 },
    "digital-instagram":{ w: 10, h: 18 },
    "digital-linkedin": { w: 18, h: 9 },   // 1.91:1 horizontal
    "digital-email":    { w: 18, h: 7 },
    "digital-google":   { w: 15, h: 12 },
  };
  const d = dims[format];
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x={(18 - d.w) / 2} y={(18 - d.h) / 2} width={d.w} height={d.h} rx="1.5" stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
}

