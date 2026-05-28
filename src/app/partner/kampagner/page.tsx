"use client";
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { CAMPAIGNS, FORMATS, CURRENT_PARTNER, FormatKind, Campaign } from "@/lib/data";
import { CampaignPreview, imagesForTheme } from "@/components/CampaignPreview";
import { PageHeader } from "@/components/PageHeader";
import { THEMES } from "@/lib/themes";

interface Edits {
  hovedbudskab?: string;
  underbudskab?: string;
  cta?: string;
}

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

  // ESC closes drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

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
    <div className="flex flex-col h-[calc(100vh-48px)] animate-in">
      {/* ─── COMPACT HEADER (logo changer now lives in the edit drawer) ─── */}
      <div className="px-6 lg:px-10 xl:px-12 pt-6 pb-3 shrink-0">
        <PageHeader
          variant="compact"
          eyebrow="Marketing-værktøjskasse"
          title="Kampagner"
          themeColor={theme.accent}
          actions={<>
            {hasEdits && (
              <button onClick={resetEdits} className="btn btn-secondary" data-tt="Vend tilbage til original copy">
                ⤺ Nulstil tekst
              </button>
            )}
            <button onClick={() => pushToast("Gemt som skabelon")} className="btn btn-secondary" data-tt="Gem som personlig skabelon">
              Gem skabelon
            </button>
          </>}
        />
      </div>

      {/* ─── EDITOR: left rail + canvas. Generous pb so the floating dock never crowds the browser-window edge. */}
      <div className="flex-1 grid gap-4 px-6 lg:px-10 xl:px-12 pb-8 lg:pb-10 grid-cols-[280px_1fr] min-h-0">
        {/* LEFT — campaign picker + image variants (scrollbar visually hidden) */}
        <aside className="flex flex-col gap-4 self-start sticky top-[60px] h-[calc(100vh-90px)] overflow-y-auto pr-1 scrollbar-hidden">
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

        {/* CENTER — CANVAS (full bleed, floating chrome) */}
        <section className="relative rounded-[var(--r-xl)] overflow-hidden bg-[var(--canvas-3)] border border-[var(--line-2)] min-h-[640px]">
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

          {/* FLOATING TOP BAR — two groups now: mode+formats (left), actions (right).
              The campaign title pill was killed — the picker on the left already
              shows which campaign is active (left accent strip + ring + bold).
              Tooltips render BELOW (data-tt-pos="bottom") so they fall into the
              canvas space instead of being clipped above. */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-none flex-wrap">

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
            <div className="absolute inset-0 grid place-items-center px-6 pt-24 pb-12">
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
            className="absolute top-[48px] right-0 bottom-0 w-[480px] max-w-[95vw] bg-white border-l border-[var(--line-2)] shadow-[var(--shadow-3)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideInRight 280ms cubic-bezier(0.22,1,0.36,1)" }}
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
function EditField({ label, value, onChange, max, multiline, rows }: { label: string; value: string; onChange: (v: string) => void; max?: number; multiline?: boolean; rows?: number }) {
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
          className="w-full bg-[var(--canvas-2)] rounded-[var(--r-md)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none resize-y border border-transparent focus:border-[var(--accent)] focus:bg-white transition-colors leading-[1.5]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, max))}
          className="w-full bg-[var(--canvas-2)] rounded-[var(--r-md)] px-3 py-2.5 text-[13px] text-[var(--ink)] outline-none border border-transparent focus:border-[var(--accent)] focus:bg-white transition-colors"
        />
      )}
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

