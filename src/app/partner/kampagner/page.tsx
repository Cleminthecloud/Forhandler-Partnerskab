"use client";
import { useState, useMemo } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { CAMPAIGNS, FORMATS, CURRENT_PARTNER, FormatKind, Campaign } from "@/lib/data";
import { CampaignPreview } from "@/components/CampaignPreview";

export default function KampagnerPage() {
  const { theme } = useTheme();
  const { pushToast } = useApp();

  const themed = useMemo(() => CAMPAIGNS.filter((c) => c.tema === theme.id), [theme.id]);
  const other = useMemo(() => CAMPAIGNS.filter((c) => c.tema !== theme.id), [theme.id]);

  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(themed[0]?.id ?? null);
  const activeCampaign: Campaign | null = useMemo(
    () => CAMPAIGNS.find((c) => c.id === activeCampaignId) ?? themed[0] ?? null,
    [activeCampaignId, themed]
  );
  const [format, setFormat] = useState<FormatKind>("print-flyer");
  const [category, setCategory] = useState<"print" | "digital">("print");
  const [imageVariant, setImageVariant] = useState(0);

  const [confirm, setConfirm] = useState<null | { kind: "print" | "digital"; label: string }>(null);
  const [showLogoSheet, setShowLogoSheet] = useState(false);

  // Image variants — placeholders until real images land.
  // Each is a styled gradient + glyph that hints at the campaign mood.
  const variants = [
    { id: 0, label: "Lifestyle", glyph: "🏖️", grad: "linear-gradient(135deg, #F8C77A 0%, #E89A4A 100%)" },
    { id: 1, label: "Atmosfære", glyph: "🌅", grad: "linear-gradient(160deg, #4A6B8A 0%, #1F3D5C 100%)" },
    { id: 2, label: "Produkt",   glyph: "🔐", grad: "linear-gradient(135deg, #E0D4C2 0%, #B89A78 100%)" },
    { id: 3, label: "Studio",    glyph: "📱", grad: "linear-gradient(180deg, #2A2A2C 0%, #0E0E10 100%)" },
  ];

  const currentCategoryFormats = activeCampaign
    ? activeCampaign.formater.filter((f) => f.startsWith(category + "-"))
    : [];

  return (
    <div className="px-6 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      {/* ─── HEADER ─── */}
      <header className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <div>
          <div className="t-eyebrow flex items-center gap-2">
            <span className="theme-dot" style={{ background: theme.accent }} />
            <span>Marketing-værktøjskasse</span>
          </div>
          <h1 className="t-display mt-2">Kampagner</h1>
          <p className="t-body-lg mt-2 max-w-[640px]">
            Færdige co-brandede materialer — print og digitalt. Dit firma, logo og kontaktoplysninger er hentet automatisk fra din profil.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowLogoSheet(true)} className="btn btn-secondary">
            Skift logo
          </button>
          <button onClick={() => pushToast("Gemt som skabelon")} className="btn btn-secondary">
            Gem skabelon
          </button>
        </div>
      </header>

      {/* ─── MAIN: two-column creative tool layout ─── */}
      <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
        {/* LEFT: campaign + image-variant rail */}
        <aside className="flex flex-col gap-4 self-start xl:sticky xl:top-4">
          {/* Campaigns */}
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
                <div className="px-2 pt-3 mt-2 border-t border-[var(--line-2)] mb-1">
                  <span className="t-eyebrow !text-[10px] !text-[var(--ink-3)]">Kommer senere</span>
                </div>
                <ul className="opacity-55">
                  {other.slice(0, 3).map((c) => (
                    <li key={c.id}>
                      <div className="flex items-start gap-3 p-2.5 rounded-[var(--r-md)]">
                        <div className="size-9 rounded-lg grid place-items-center text-xl shrink-0 bg-[var(--canvas-2)]">
                          {c.heroEmoji}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-[13px] font-medium text-[var(--ink)] leading-tight truncate">{c.titel}</div>
                          <div className="text-[11px] text-[var(--ink-3)] mt-0.5">{c.status}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Image variants */}
          <div className="card !p-4">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[12px] font-semibold text-[var(--ink-2)]">Billede</span>
              <span className="text-[11px] text-[var(--ink-3)]">{variants.length} varianter</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setImageVariant(v.id)}
                  className={"aspect-[3/4] rounded-[var(--r-md)] relative overflow-hidden text-[22px] grid place-items-center transition-all " +
                    (imageVariant === v.id ? "ring-2 ring-[var(--accent)] ring-offset-2" : "ring-1 ring-[var(--line-2)] hover:ring-[var(--accent)] opacity-90 hover:opacity-100")}
                  style={{ background: v.grad }}
                  aria-label={v.label}
                >
                  <span style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}>{v.glyph}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-[var(--ink-3)]">
              <strong className="text-[var(--ink-2)] font-medium">{variants[imageVariant].label}</strong> · placeholder. Rigtige billeder kommer.
            </div>
          </div>

          {/* Partner-info auto */}
          <div className="card !p-4 flex items-center gap-3">
            <div
              className="size-10 rounded-lg grid place-items-center text-white font-semibold text-[13px] shrink-0"
              style={{ background: CURRENT_PARTNER.logoBg }}
              aria-hidden="true"
            >
              {CURRENT_PARTNER.initialer}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-[var(--ink)] truncate">{CURRENT_PARTNER.firma}</div>
              <div className="text-[11px] text-[var(--ink-3)] truncate">Hentet fra profil</div>
            </div>
            <button onClick={() => setShowLogoSheet(true)} className="ml-auto text-[12px] font-semibold text-[var(--accent)] shrink-0">
              Skift
            </button>
          </div>
        </aside>

        {/* RIGHT: big creative canvas */}
        <section className="card !p-0 overflow-hidden flex flex-col min-h-[680px]">
          {/* Canvas top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--line-2)] bg-[var(--canvas)]">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-3)]">Preview</span>
              <span className="text-[13px] font-semibold text-[var(--ink)]">{activeCampaign?.titel}</span>
            </div>

            {/* Print/Digital toggle */}
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

          {/* Big preview */}
          {activeCampaign && (
            <div className="flex-1 grid place-items-center p-8 lg:p-12 relative" style={{ background: theme.accentSoft + "33" }}>
              {/* Variant background hint */}
              <div className="absolute inset-0 opacity-10" style={{ background: variants[imageVariant].grad }} aria-hidden="true" />
              <div className="relative max-h-full w-auto grid place-items-center" style={{ maxHeight: 540 }}>
                <CampaignPreview campaign={activeCampaign} partner={CURRENT_PARTNER} theme={theme} format={format} />
              </div>
            </div>
          )}

          {/* Format pills + actions */}
          <div className="border-t border-[var(--line-2)] bg-[var(--canvas)] p-4 lg:p-5">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {currentCategoryFormats.map((f) => {
                const meta = FORMATS.find((x) => x.id === f)!;
                const sel = format === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={
                      "px-3.5 py-2 rounded-full text-[13px] font-medium transition-all border " +
                      (sel
                        ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                        : "bg-[var(--canvas)] text-[var(--ink-2)] border-[var(--line)] hover:bg-[var(--canvas-2)] hover:border-[var(--ink-4)]")
                    }
                  >
                    {meta.label}
                    <span className={"ml-2 text-[11px] " + (sel ? "text-white/70" : "text-[var(--ink-3)]")}>{meta.dim}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] text-[var(--ink-3)] max-w-[480px]">
                Sølv- og Guld-partnere får dækket <strong className="text-[var(--ink-2)]">50% af medieomkostninger</strong> ved tryk. Levering inden for 5 hverdage.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirm({ kind: "digital", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                  className="btn btn-secondary"
                >
                  Hent PDF
                </button>
                <button
                  onClick={() => setConfirm({ kind: "print", label: FORMATS.find((f) => f.id === format)?.label ?? "" })}
                  className="btn btn-primary"
                >
                  Bestil tryk
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Confirmation modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 bg-black/45 grid place-items-center p-6 animate-in" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-[var(--r-xl)] max-w-md w-full p-7 shadow-[var(--shadow-4)]" onClick={(e) => e.stopPropagation()}>
            <div className="t-eyebrow">{confirm.kind === "digital" ? "Hent PDF" : "Bestil tryk"}</div>
            <h3 className="t-h2 mt-2">
              {confirm.kind === "digital" ? `${confirm.label} klar til download` : `Bestil ${confirm.label}`}
            </h3>
            <p className="t-body mt-3">
              {confirm.kind === "digital" ? (
                <>Vi genererer PDF&apos;en med dit logo og kontaktoplysninger. Den lander i din indbakke om få sekunder.</>
              ) : (
                <>Carl Ras producerer og leverer inden for 5 hverdage. Vi dækker 50% af medieomkostninger per din Sølv-aftale.</>
              )}
            </p>
            <div className="mt-7 flex gap-2 justify-end">
              <button className="btn btn-secondary" onClick={() => setConfirm(null)}>Annullér</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  pushToast(confirm.kind === "digital"
                    ? `${confirm.label} er sendt til din email.`
                    : `${confirm.label} er bestilt. Forventet levering: 5 hverdage.`);
                  setConfirm(null);
                }}
              >
                {confirm.kind === "digital" ? "Send PDF" : "Bekræft bestilling"}
              </button>
            </div>
          </div>
        </div>
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
