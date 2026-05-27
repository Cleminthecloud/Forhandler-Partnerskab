"use client";
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { CAMPAIGNS, FORMATS, CURRENT_PARTNER, FormatKind, Campaign } from "@/lib/data";
import { CampaignPreview, DEFAULT_IMAGES } from "@/components/CampaignPreview";
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
  const other = useMemo(() => CAMPAIGNS.filter((c) => c.tema !== theme.id), [theme.id]);

  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(themed[0]?.id ?? null);
  const baseCampaign: Campaign | null = useMemo(
    () => CAMPAIGNS.find((c) => c.id === activeCampaignId) ?? themed[0] ?? null,
    [activeCampaignId, themed]
  );
  const [format, setFormat] = useState<FormatKind>("print-flyer");
  const [category, setCategory] = useState<"print" | "digital">("print");
  const [imageVariant, setImageVariant] = useState(0);
  const [edits, setEdits] = useState<Record<string, Edits>>({});

  type ActionKind = "print-order" | "print-pdf" | "digital-pack" | "digital-send" | "digital-link";
  const [confirm, setConfirm] = useState<null | { kind: ActionKind; label: string; account?: string }>(null);
  const [showLogoSheet, setShowLogoSheet] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ESC closes drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const variants = DEFAULT_IMAGES;
  const currentImage = variants[imageVariant];
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
      {/* ─── COMPACT HEADER ─── */}
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 lg:px-10 xl:px-12 pt-6 pb-3 shrink-0">
        <div className="flex items-baseline gap-3">
          <div className="t-eyebrow flex items-center gap-2">
            <span className="theme-dot" style={{ background: theme.accent }} />
            <span>Marketing-værktøjskasse</span>
          </div>
          <span className="text-[var(--ink-4)]">·</span>
          <h1 className="text-[20px] font-semibold tracking-tight text-[var(--ink)] leading-none">Kampagner</h1>
        </div>
        <div className="flex gap-2">
          {hasEdits && (
            <button onClick={resetEdits} className="btn btn-secondary" data-tt="Vend tilbage til original copy">
              ⤺ Nulstil tekst
            </button>
          )}
          <button onClick={() => setShowLogoSheet(true)} className="btn btn-secondary" data-tt="Upload eller skift firma-logo">
            Skift logo
          </button>
          <button onClick={() => pushToast("Gemt som skabelon")} className="btn btn-secondary" data-tt="Gem som personlig skabelon">
            Gem skabelon
          </button>
        </div>
      </header>

      {/* ─── EDITOR: left rail + canvas. Generous pb so the floating dock never crowds the browser-window edge. */}
      <div className="flex-1 grid gap-4 px-6 lg:px-10 xl:px-12 pb-8 lg:pb-10 grid-cols-[280px_1fr] min-h-0">
        {/* LEFT — campaign picker + image variants */}
        <aside className="flex flex-col gap-4 self-start sticky top-[60px] h-[calc(100vh-90px)] overflow-y-auto pr-1">
          <div className="card !p-3">
            <div className="px-2 py-1 mb-1 flex items-center gap-2">
              <span className="theme-dot" style={{ background: theme.accent }} />
              <span className="t-eyebrow !text-[10px]">{theme.label}</span>
            </div>
            <ul>
              {themed.map((c) => {
                const isActive = activeCampaign?.id === c.id;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => { setActiveCampaignId(c.id); setFormat(c.formater[0]); setCategory(c.formater[0].startsWith("print") ? "print" : "digital"); }}
                      className={"w-full text-left flex items-start gap-3 p-2.5 rounded-[var(--r-md)] transition-colors " +
                        (isActive ? "bg-[var(--canvas-2)]" : "hover:bg-[var(--canvas-2)]")}
                    >
                      <div className="size-9 rounded-lg grid place-items-center text-xl shrink-0" style={{ background: theme.accentSoft }}>
                        {c.heroEmoji}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="text-[13px] font-semibold text-[var(--ink)] leading-tight truncate">{c.titel}</div>
                        <div className="text-[11px] text-[var(--ink-3)] mt-0.5">
                          {c.formater.length} formater · {c.status}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {other.length > 0 && (
              <>
                <div className="px-2 pt-3 mt-2 border-t border-[var(--line-2)] mb-1 flex items-center justify-between">
                  <span className="t-eyebrow !text-[10px] !text-[var(--ink-3)]">Andre temaer</span>
                  <span className="text-[10px] text-[var(--ink-3)]">Klik for preview</span>
                </div>
                <ul>
                  {other.slice(0, 4).map((c) => {
                    const otherTheme = THEMES.find((t) => t.id === c.tema);
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => {
                            if (c.tema !== theme.id && otherTheme) setThemeId(otherTheme.id);
                            setActiveCampaignId(c.id);
                            setFormat(c.formater[0]);
                            setCategory(c.formater[0].startsWith("print") ? "print" : "digital");
                          }}
                          className="w-full text-left flex items-start gap-3 p-2.5 rounded-[var(--r-md)] transition-colors hover:bg-[var(--canvas-2)]"
                        >
                          <div className="size-9 rounded-lg grid place-items-center text-xl shrink-0" style={{ background: otherTheme?.accentSoft ?? "var(--canvas-2)" }}>
                            {c.heroEmoji}
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="text-[13px] font-medium text-[var(--ink)] leading-tight truncate">{c.titel}</div>
                            <div className="text-[11px] text-[var(--ink-3)] mt-0.5 flex items-center gap-1.5">
                              <span className="size-1.5 rounded-full" style={{ background: otherTheme?.accent }} />
                              <span>{otherTheme?.label}</span>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          {/* Image variant strip */}
          <div className="card !p-4">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[12px] font-semibold text-[var(--ink-2)]">Billede</span>
              <span className="text-[11px] text-[var(--ink-3)]">{variants.length} valg</span>
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
            <div className="mt-3 text-[11px] text-[var(--ink-3)]">
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

          {/* FLOATING TOP BAR — campaign title + print/digital toggle */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-3 pointer-events-none">
            <div className="pointer-events-auto inline-flex items-center gap-2.5 bg-white/85 backdrop-blur-md rounded-full pl-3 pr-4 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[var(--line-2)]">
              <span className="theme-dot" style={{ background: theme.accent }} />
              <span className="text-[12px] font-semibold text-[var(--ink)]">{activeCampaign?.titel}</span>
              {isUnpublished && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--ink)] text-white ml-1">Udkast</span>
              )}
            </div>

            <div className="pointer-events-auto inline-flex rounded-full bg-white/85 backdrop-blur-md p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[var(--line-2)]">
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
          </div>

          {/* PREVIEW STAGE — auto-fit, no overflow. Generous pb so it never bumps the dock. */}
          {activeCampaign && (
            <div className="absolute inset-0 grid place-items-center px-6 pt-20 pb-48 lg:pb-44">
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

          {/* FLOATING BOTTOM — format dock + action bar (single unit) */}
          <div className="absolute left-4 right-4 bottom-5 z-20 pointer-events-none">
            <div className="pointer-events-auto bg-white/90 backdrop-blur-md rounded-[var(--r-xl)] border border-[var(--line-2)] shadow-[0_4px_18px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Format dock */}
              <div className="px-3 py-2 border-b border-[var(--line-2)] flex items-center gap-2 overflow-x-auto">
                {currentCategoryFormats.map((f) => {
                  const meta = FORMATS.find((x) => x.id === f)!;
                  const sel = format === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      data-tt={meta.dim}
                      className={
                        "shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-[var(--r-md)] transition-all border text-[12px] font-medium " +
                        (sel
                          ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                          : "bg-transparent text-[var(--ink-2)] border-transparent hover:bg-[var(--canvas-2)]")
                      }
                    >
                      <FormatThumb format={f} active={sel} />
                      <span className="whitespace-nowrap">{meta.label.replace(/ A[35]/, "")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action bar */}
              <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11.5px] text-[var(--ink-3)] max-w-[420px] leading-snug">
                  {category === "print"
                    ? <>Sølv- og Guld: <strong className="text-[var(--ink-2)]">50% af medieomkostninger</strong> dækket · 5 hverdages levering.</>
                    : <>Asset-pakken har JPG, PNG + dimensions klar til upload. Eller send direkte til din annoncekonto.</>}
                </p>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="btn btn-secondary !py-1.5"
                    data-tt="Åbn redigeringspanel"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline -mt-0.5 mr-1.5">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4z" />
                    </svg>
                    Rediger
                  </button>
                  {category === "print" ? (
                    <>
                      <button
                        onClick={() => setConfirm({ kind: "print-pdf", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                        className="btn btn-secondary !py-1.5"
                        data-tt="Print-klar PDF til lokalt tryk"
                      >
                        Hent PDF
                      </button>
                      <button
                        onClick={() => setConfirm({ kind: "print-order", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                        className="btn btn-primary !py-1.5"
                      >
                        Bestil tryk
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setConfirm({ kind: "digital-link", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                        className="btn btn-secondary !py-1.5"
                        data-tt="Kopiér en delelink til kampagnen"
                      >
                        🔗 Link
                      </button>
                      <button
                        onClick={() => setConfirm({ kind: "digital-pack", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                        className="btn btn-secondary !py-1.5"
                        data-tt="Download zip med JPG + PNG + dimensions"
                      >
                        ⬇ Asset-pakke
                      </button>
                      <button
                        onClick={() => setConfirm({ kind: "digital-send", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                        className="btn btn-primary !py-1.5"
                      >
                        Send til konto
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
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
            className="absolute top-[48px] right-0 bottom-0 w-[420px] max-w-[95vw] bg-white border-l border-[var(--line)] shadow-[-8px_0_24px_rgba(0,0,0,0.10)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideInRight 280ms cubic-bezier(0.22,1,0.36,1)" }}
          >
            {/* Drawer header */}
            <div className="px-5 py-4 border-b border-[var(--line-2)] flex items-center justify-between">
              <div>
                <div className="t-eyebrow !text-[10px]">Rediger kampagne</div>
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

              {/* Partner / logo */}
              <section>
                <div className="t-eyebrow mb-3">Partner</div>
                <div className="flex items-center gap-3 p-3 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
                  <div
                    className="size-10 rounded-lg grid place-items-center text-white font-semibold text-[13px] shrink-0"
                    style={{ background: CURRENT_PARTNER.logoBg }}
                  >
                    {CURRENT_PARTNER.initialer}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[var(--ink)] truncate">{CURRENT_PARTNER.firma}</div>
                    <div className="text-[11px] text-[var(--ink-3)] truncate">Auto-hentet fra profil</div>
                  </div>
                  <button onClick={() => setShowLogoSheet(true)} data-tt="Skift logo" className="text-[12px] font-semibold text-[var(--accent)] shrink-0">
                    Skift
                  </button>
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
                          <div className="text-[11px] text-[var(--ink-3)] truncate">{a.connected ? a.account : "Ikke forbundet"}</div>
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
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">Tip</div>
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
              <span className="text-[11px] text-[var(--ink-3)]">
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
              "print-order":  `${confirm.label} er bestilt. Forventet levering: 5 hverdage.`,
              "print-pdf":    `${confirm.label} (print-PDF) er sendt til din email.`,
              "digital-pack": `${confirm.label}-pakke downloades… ZIP er klar om få sekunder.`,
              "digital-send": `${confirm.label} er sendt som kladde til ${target ?? "din konto"}.`,
              "digital-link": `Delelink kopieret til udklipsholder.`,
            };
            pushToast(messages[confirm.kind]);
            setConfirm(null);
          }}
        />
      )}

      {/* Logo sheet */}
      {showLogoSheet && (
        <div className="fixed inset-0 z-50 bg-black/45 grid place-items-center p-6 animate-in" onClick={() => setShowLogoSheet(false)}>
          <div className="bg-white rounded-[var(--r-xl)] max-w-md w-full p-7 shadow-[var(--shadow-4)]" onClick={(e) => e.stopPropagation()}>
            <div className="t-eyebrow">Logo</div>
            <h3 className="t-h2 mt-2">Skift dit firma-logo</h3>
            <p className="t-body mt-3">
              Logoet bliver brugt på alle kampagner. PNG eller SVG anbefales. Vi tilpasser automatisk størrelse pr. format.
            </p>
            <div className="mt-5 p-4 rounded-[var(--r-md)] border-2 border-dashed border-[var(--line)] text-center">
              <div className="size-12 rounded-lg grid place-items-center text-white font-semibold text-[15px] shrink-0 mx-auto" style={{ background: CURRENT_PARTNER.logoBg }}>
                {CURRENT_PARTNER.initialer}
              </div>
              <div className="text-[13px] font-medium text-[var(--ink)] mt-3">Nuværende: {CURRENT_PARTNER.firma}</div>
              <div className="text-[11px] text-[var(--ink-3)] mt-1">Træk en fil her, eller</div>
              <button onClick={() => { pushToast("Filvælger åbnes (demo)"); setShowLogoSheet(false); }} className="btn btn-secondary mt-3">
                Upload PNG
              </button>
            </div>
            <div className="mt-5 flex gap-2 justify-end">
              <button className="btn btn-secondary" onClick={() => setShowLogoSheet(false)}>Færdig</button>
            </div>
          </div>
        </div>
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
  kind: "print-order" | "print-pdf" | "digital-pack" | "digital-send" | "digital-link";
  label: string;
  formatId: FormatKind;
  onClose: () => void;
  onConfirm: (target?: string) => void;
}) {
  const isMeta = formatId === "digital-facebook" || formatId === "digital-instagram";
  const isGoogle = formatId === "digital-google";
  const defaultTarget = isMeta ? "meta" : isGoogle ? "google" : "meta";
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
        eyebrow: "Send til annoncekonto",
        title: `Send ${label} som kladde`,
        body: <>Vi pusher kampagnen som <strong>kladde</strong> til din valgte konto. Du publicerer selv når du er klar.</>,
        cta: "Send som kladde",
      };
      case "digital-link": return {
        eyebrow: "Kopiér delelink",
        title: "Del kampagnen",
        body: <>Få en kort URL der viser kampagnen i browseren. God til Slack, email og kundedialog inden du publicerer.</>,
        cta: "Kopiér link",
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
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-2">Vælg konto</div>
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
                    <div className="text-[11px] text-[var(--ink-3)] truncate">{a.account}</div>
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
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{label}</label>
        {max && (
          <span className={"text-[10px] tabular-nums " + (near ? "text-[#A32D2D]" : "text-[var(--ink-3)]")}>
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
