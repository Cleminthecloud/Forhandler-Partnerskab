"use client";
import { useState, useMemo } from "react";
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
    <div className="px-6 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      {/* ─── HEADER ─── */}
      <header className="flex flex-wrap items-end justify-between gap-6 mb-6">
        <div>
          <div className="t-eyebrow flex items-center gap-2">
            <span className="theme-dot" style={{ background: theme.accent }} />
            <span>Marketing-værktøjskasse</span>
          </div>
          <h1 className="t-display mt-2">Kampagner</h1>
          <p className="t-body-lg mt-2 max-w-[640px]">
            Færdige co-brandede materialer. <strong className="text-[var(--ink)] font-semibold">Klik på tekst i ad&apos;en</strong> for at redigere den. Logo og kontaktoplysninger hentes fra din profil.
          </p>
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

      {/* ─── MAIN 3-PANEL EDITOR ─── */}
      <div className="grid gap-4 xl:grid-cols-[280px_1fr_300px]">
        {/* LEFT — campaigns + variants */}
        <aside className="flex flex-col gap-4 self-start xl:sticky xl:top-[60px]">
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

        {/* CENTER — big canvas */}
        <section className="card !p-0 overflow-hidden flex flex-col min-h-[760px]">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--line-2)] bg-[var(--canvas)]">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-3)]">Preview</span>
              <span className="text-[13px] font-semibold text-[var(--ink)]">{activeCampaign?.titel}</span>
              {isUnpublished && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--ink)] text-white">Ikke publiceret</span>
              )}
            </div>

            <div className="inline-flex rounded-full bg-[var(--canvas-2)] p-1">
              {(["print", "digital"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCategory(c);
                    const first = activeCampaign?.formater.find((f) => f.startsWith(c + "-"));
                    if (first) setFormat(first);
                  }}
                  className={
                    "px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors " +
                    (category === c ? "bg-white text-[var(--ink)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]" : "text-[var(--ink-3)] hover:text-[var(--ink)]")
                  }
                >
                  {c === "print" ? "Print" : "Digital"}
                </button>
              ))}
            </div>
          </div>

          {/* Big preview — scaled larger */}
          {activeCampaign && (
            <div className="flex-1 grid place-items-center p-6 lg:p-10 relative bg-[var(--canvas-2)]" style={{ minHeight: 540 }}>
              <div className="relative grid place-items-center" style={{ transform: "scale(1.25)", transformOrigin: "center" }}>
                <CampaignPreview campaign={activeCampaign} partner={CURRENT_PARTNER} theme={theme} format={format} image={currentImage} />
              </div>
            </div>
          )}

          {/* Format-thumbnail strip */}
          <div className="border-t border-[var(--line-2)] bg-[var(--canvas)] px-4 lg:px-5 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {currentCategoryFormats.map((f) => {
                const meta = FORMATS.find((x) => x.id === f)!;
                const sel = format === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    data-tt={meta.dim}
                    className={
                      "shrink-0 flex flex-col items-center gap-1.5 px-3.5 py-2 rounded-[var(--r-md)] transition-all border " +
                      (sel
                        ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                        : "bg-[var(--canvas)] text-[var(--ink-2)] border-[var(--line)] hover:bg-[var(--canvas-2)]")
                    }
                  >
                    <FormatThumb format={f} active={sel} />
                    <span className="text-[11px] font-medium whitespace-nowrap">{meta.label.replace(/ A[35]/, "")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action bar — context-aware: print vs digital */}
          <div className="border-t border-[var(--line-2)] bg-[var(--canvas)] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            {category === "print" ? (
              <>
                <p className="text-[12px] text-[var(--ink-3)] max-w-[480px]">
                  Sølv- og Guld-partnere: <strong className="text-[var(--ink-2)]">50% af medieomkostninger</strong> dækket. Levering inden for 5 hverdage.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirm({ kind: "print-pdf", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                    className="btn btn-secondary"
                    data-tt="Print-klar PDF til lokalt tryk"
                  >
                    Hent PDF
                  </button>
                  <button
                    onClick={() => setConfirm({ kind: "print-order", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                    className="btn btn-primary"
                  >
                    Bestil tryk
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-[12px] text-[var(--ink-3)] max-w-[460px]">
                  Asset-pakken indeholder JPG, PNG og dimensions klar til upload. Eller send direkte til din annoncekonto.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setConfirm({ kind: "digital-link", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                    className="btn btn-secondary"
                    data-tt="Kopiér en delelink til kampagnen"
                  >
                    🔗 Kopiér link
                  </button>
                  <button
                    onClick={() => setConfirm({ kind: "digital-pack", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                    className="btn btn-secondary"
                    data-tt="Download zip med JPG + PNG + dimensions"
                  >
                    ⬇ Hent asset-pakke
                  </button>
                  <button
                    onClick={() => setConfirm({ kind: "digital-send", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                    className="btn btn-primary"
                  >
                    Send til min konto
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* RIGHT — Inspector */}
        <aside className="flex flex-col gap-4 self-start xl:sticky xl:top-[60px]">
          <div className="card">
            <div className="t-eyebrow mb-3">Tilpas tekst</div>

            <EditField
              label="Hovedbudskab"
              value={activeCampaign?.hovedbudskab ?? ""}
              onChange={(v) => updateEdit("hovedbudskab", v)}
              max={80}
              multiline
            />
            <div className="h-3" />
            <EditField
              label="Underbudskab"
              value={activeCampaign?.underbudskab ?? ""}
              onChange={(v) => updateEdit("underbudskab", v)}
              max={200}
              multiline
            />
            <div className="h-3" />
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
          </div>

          <div className="card !p-4 flex items-center gap-3">
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

          {/* Connected ad accounts — shown when in digital mode */}
          {category === "digital" && (
            <div className="card">
              <div className="t-eyebrow mb-3">Forbundne konti</div>
              <ul className="space-y-2.5">
                {CONNECTED_ACCOUNTS.map((a) => (
                  <li key={a.id} className="flex items-center gap-3">
                    <div className="size-8 rounded-md grid place-items-center text-white text-[14px] shrink-0" style={{ background: a.color }}>{a.icon}</div>
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
            </div>
          )}

          <div className="card !p-4 bg-[var(--canvas-2)] !border-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">Tip</div>
            <p className="text-[12px] text-[var(--ink-2)] mt-1.5 leading-[1.5]">
              {category === "print"
                ? "Bestil tryk lader Carl Ras producere og levere. Eller hent en print-klar PDF til din lokale trykker."
                : "Send direkte til din annoncekonto som kladde, eller hent asset-pakken (JPG + PNG) til upload selv."}
            </p>
          </div>
        </aside>
      </div>

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
  const [target, setTarget] = useState<string>("meta");

  const isMeta = formatId === "digital-facebook" || formatId === "digital-instagram";
  const isGoogle = formatId === "digital-google";
  const defaultTarget = isMeta ? "meta" : isGoogle ? "google" : "meta";
  // initialize target
  useState(() => { setTarget(defaultTarget); return defaultTarget; });

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
        body: <>Get en kort URL der viser kampagnen i browseren. God til Slack, email og kundedialog inden du publicerer.</>,
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
function EditField({ label, value, onChange, max, multiline }: { label: string; value: string; onChange: (v: string) => void; max?: number; multiline?: boolean }) {
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
          rows={2}
          className="w-full bg-[var(--canvas-2)] rounded-[var(--r-md)] px-3 py-2 text-[13px] text-[var(--ink)] outline-none resize-none border border-transparent focus:border-[var(--accent)] focus:bg-white transition-colors leading-[1.45]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, max))}
          className="w-full bg-[var(--canvas-2)] rounded-[var(--r-md)] px-3 py-2 text-[13px] text-[var(--ink)] outline-none border border-transparent focus:border-[var(--accent)] focus:bg-white transition-colors"
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
    "print-flyer":      { w: 14, h: 20 },
    "print-poster":     { w: 14, h: 20 },
    "print-magasin":    { w: 14, h: 20 },
    "print-bilstreamer":{ w: 22, h: 6 },
    "digital-facebook": { w: 18, h: 18 },
    "digital-instagram":{ w: 12, h: 22 },
    "digital-email":    { w: 22, h: 8 },
    "digital-google":   { w: 18, h: 14 },
  };
  const d = dims[format];
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x={(22 - d.w) / 2} y={(22 - d.h) / 2} width={d.w} height={d.h} rx="2" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}
