"use client";

// Force dynamic rendering — these pages use client hooks (useSearchParams) and/or
// heavy Recharts components that can hang Next.js static page generation.
export const dynamic = "force-dynamic";
import { use, useState } from "react";
import Link from "next/link";
import { PARTNERS, PRODUCTS, salesFor, CURRENT_PARTNER, CARL_RAS_KONSULENT } from "@/lib/data";
import { useApp } from "@/components/AppState";
import { InteractiveArea, InteractivePie, MiniArea } from "@/components/ChartsInteractive";
import { Icon } from "@/components/Icon";

const ACTIVITY_COLOR: Record<string, string> = {
  ordre:   "#2D4A0F",
  lead:    "var(--accent)",
  kursus:  "#C99A20",
  kontakt: "#0C447C",
  tier:    "#7E8993",
};

function tierClass(tier: "Bronze" | "Sølv" | "Guld") {
  const map = { Bronze: "tag tag-bronze", Sølv: "tag tag-soelv", Guld: "tag tag-guld" } as const;
  return map[tier];
}

function fmtKr(n: number) { return n.toLocaleString("da-DK") + " kr"; }
function fmtK(n: number)  { return Math.round(n / 1000) + "k"; }

// Deterministic next-visit date from partner id (Mon–Fri, next 14 days)
function nextVisitFor(partnerId: string): { dato: string; ugedag: string; tidStart: string; tidSlut: string; isoDay: number } {
  const seed = partnerId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const dayOffset = 3 + (seed % 11); // 3-13 days out
  const date = new Date(2026, 4, 27 + dayOffset); // base = today (2026-05-27)
  const months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  const days = ["søn", "man", "tir", "ons", "tor", "fre", "lør"];
  // bump weekends to Monday
  if (date.getDay() === 0) date.setDate(date.getDate() + 1);
  if (date.getDay() === 6) date.setDate(date.getDate() + 2);
  const hour = 9 + (seed % 4);
  return {
    dato: `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`,
    ugedag: days[date.getDay()],
    tidStart: `${hour}:00`,
    tidSlut: `${hour + 1}:30`,
    isoDay: date.getDate(),
  };
}

export default function PartnerProfilePage({ params }: { params: Promise<{ partnerId: string }> }) {
  const { partnerId } = use(params);
  const partner = PARTNERS.find((p) => p.id === partnerId);
  const { pushToast } = useApp();
  const [offerSent, setOfferSent] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showVisitDialog, setShowVisitDialog] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitAgenda, setVisitAgenda] = useState("");
  const [visitRescheduled, setVisitRescheduled] = useState(false);

  if (!partner) {
    return (
      <div className="px-8 py-16 text-center max-w-[600px] mx-auto">
        <h1 className="t-h2">Partner ikke fundet</h1>
        <Link href="/admin/partnere" className="link mt-4 inline-block">← Tilbage til partnere</Link>
      </div>
    );
  }

  const sales = salesFor(partner.id);
  const offerProducts = sales.predictedOffer.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Build chart-friendly data shape
  const omsætningSeries = sales.monthlyLabels.map((label, i) => ({ label, value: sales.monthlyOmsætning[i] }));

  function sendOffer() {
    setOfferSent(true);
    setShowOfferDialog(false);
    pushToast(`Forudsigt-tilbud sendt til ${partner!.firma} (${partner!.email}).`);
  }

  function saveVisit() {
    setVisitRescheduled(true);
    setShowVisitDialog(false);
    pushToast(`Besøg planlagt hos ${partner!.firma}. ${partner!.ejer} & Dennis Holmberg er underrettet.`);
  }

  const nextVisit = nextVisitFor(partner.id);
  void CURRENT_PARTNER;

  return (
    <div className="animate-in pb-12">
      {/* ─── HEADER (no cover image — clean Apple-style) ─── */}
      <header className="px-6 lg:px-12 pt-8 lg:pt-10">
        <Link href="/admin/partnere" className="link text-[13px] inline-flex items-center gap-1.5 mb-6">
          <svg width="12" height="12" viewBox="0 0 14 14"><path d="M9 11l-4-4 4-4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Alle partnere
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            <div
              className="size-20 rounded-2xl grid place-items-center text-white font-bold text-[24px] shrink-0"
              style={{ background: partner.logoBg }}
            >
              {partner.initialer}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={tierClass(partner.tier)}>{partner.tier}-partner</span>
                <span className="text-[12px] text-[var(--ink-3)]">Medlem siden {partner.medlemSiden}</span>
              </div>
              <h1 className="t-display-lg leading-tight">{partner.firma}</h1>
              <p className="t-body !text-[var(--ink-3)] mt-1">
                {partner.ejer} · {partner.faggruppe} · {partner.by} ({partner.postnr})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowVisitDialog(true)} className="btn btn-secondary inline-flex items-center gap-1.5"><Icon name="calendar" size={14} /> Planlæg besøg</button>
            <button onClick={() => pushToast("Beskedseditor åbnes…")} className="btn btn-secondary">Send besked</button>
            <button
              onClick={() => setShowOfferDialog(true)}
              className="btn btn-primary"
              disabled={offerSent}
            >
              {offerSent ? <span className="inline-flex items-center gap-1.5"><Icon name="check" size={14} /> Tilbud sendt</span> : "Send forudsigt-tilbud"}
            </button>
          </div>
        </div>
      </header>

      {/* ─── CRM RAIL: Kontakt + Konsulent + Næste besøg ─── */}
      <section className="px-6 lg:px-12 mt-7">
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Contact card */}
          <div className="card card-lg">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="t-h3">Kontakt</h3>
              <span className="t-caption">Ejer · ansvarlig</span>
            </div>
            <ul className="space-y-2.5">
              <ContactRow label="Ejer" value={partner.ejer} />
              <ContactRow label="Telefon" value={partner.telefon} href={`tel:${partner.telefon.replace(/\s/g, "")}`} />
              <ContactRow label="Email" value={partner.email} href={`mailto:${partner.email}`} />
              <ContactRow label="Web" value={partner.webadresse} href={`https://${partner.webadresse}`} external />
              <ContactRow label="Adresse" value={`${partner.postnr} ${partner.by}`} />
            </ul>
            <div className="mt-5 pt-4 border-t border-[var(--line-2)] flex flex-wrap gap-2">
              <a href={`tel:${partner.telefon.replace(/\s/g, "")}`} className="btn btn-secondary text-[12px] !px-3 !py-1.5 inline-flex items-center gap-1.5"><Icon name="phone" size={12} /> Ring</a>
              <a href={`mailto:${partner.email}`} className="btn btn-secondary text-[12px] !px-3 !py-1.5 inline-flex items-center gap-1.5"><Icon name="mail" size={12} /> Email</a>
              <button onClick={() => pushToast(`Note tilføjet til ${partner.firma}`)} className="btn btn-secondary text-[12px] !px-3 !py-1.5 inline-flex items-center gap-1.5"><Icon name="plus" size={12} /> Note</button>
            </div>
          </div>

          {/* Assigned consultant */}
          <div className="card card-lg">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="t-h3">Tilknyttet konsulent</h3>
              <button onClick={() => pushToast("Skift konsulent kræver godkendelse fra teamleder")} className="link text-[12px]">Skift →</button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CARL_RAS_KONSULENT.portrait}
                alt={CARL_RAS_KONSULENT.navn}
                className="size-12 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[var(--ink)]">{CARL_RAS_KONSULENT.navn}</div>
                <div className="text-[12px] text-[var(--ink-3)]">{CARL_RAS_KONSULENT.rolle} · {partner.region}</div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#EAF1DC", color: "#324A14" }}>
                <span className="size-1.5 rounded-full" style={{ background: "#5B7F2C" }} /> Aktiv
              </span>
            </div>
            <div className="space-y-1.5 text-[12px] text-[var(--ink-2)]">
              <div className="flex justify-between"><span className="text-[var(--ink-3)]">Sidste besøg</span><span className="tabular-nums">19. apr 2026</span></div>
              <div className="flex justify-between"><span className="text-[var(--ink-3)]">Besøg i år</span><span className="tabular-nums">4 (mål: 6)</span></div>
              <div className="flex justify-between"><span className="text-[var(--ink-3)]">Sidste touchpoint</span><span className="tabular-nums">5 dage siden</span></div>
              <div className="flex justify-between"><span className="text-[var(--ink-3)]">Relation-score</span><span className="tabular-nums font-semibold text-[#2D4A0F]">Stærk · 8.4</span></div>
            </div>
            <div className="mt-5 pt-4 border-t border-[var(--line-2)] flex flex-wrap gap-2">
              <button onClick={() => pushToast("Beskedseditor til Dennis åbnes…")} className="btn btn-secondary text-[12px] !px-3 !py-1.5">Skriv til Dennis</button>
              <button onClick={() => pushToast("Briefing genereret — sendt til Dennis' indbakke")} className="btn btn-secondary text-[12px] !px-3 !py-1.5">Send briefing</button>
            </div>
          </div>

          {/* Next visit */}
          <div className="card card-lg flex flex-col">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="t-h3">Næste besøg</h3>
              <span className="t-caption">{visitRescheduled ? "Genplanlagt" : "Planlagt"}</span>
            </div>
            <div className="rounded-[var(--r-md)] bg-[var(--canvas-2)] p-4 mb-4">
              <div className="flex items-baseline justify-between">
                <div className="text-[20px] font-semibold text-[var(--ink)] leading-none">{nextVisit.dato}</div>
                <div className="text-[12px] text-[var(--ink-3)] tabular-nums">{nextVisit.tidStart}–{nextVisit.tidSlut}</div>
              </div>
              <div className="text-[12px] text-[var(--ink-3)] mt-1 capitalize">{nextVisit.ugedag}dag · Hos partneren</div>
            </div>
            <div className="space-y-2 text-[12px] text-[var(--ink-2)] flex-1 leading-[1.5]">
              <div><span className="text-[var(--ink-3)] uppercase tracking-wider text-[10px] font-semibold block mb-0.5">Agenda</span>Kvartals-review · Stroxx Q3-pipeline · genforhandling af bonusaftale</div>
              <div><span className="text-[var(--ink-3)] uppercase tracking-wider text-[10px] font-semibold block mb-0.5">Deltagere</span>{partner.ejer}, Dennis Holmberg, Jens Pedersen (Sikring)</div>
              <div className="inline-flex items-center gap-1.5 text-[12px] px-2 py-1 rounded-full mt-1" style={{ background: "var(--accent-soft, #F5FAEB)", color: "#324A14" }}>
                <Icon name="check" size={11} /> {partner.ejer} har bekræftet
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-[var(--line-2)] flex flex-wrap gap-2">
              <button onClick={() => setShowVisitDialog(true)} className="btn btn-primary text-[12px] !px-3 !py-1.5">Genplanlæg</button>
              <button onClick={() => pushToast("Besøg tilføjet til din Outlook-kalender")} className="btn btn-secondary text-[12px] !px-3 !py-1.5 inline-flex items-center gap-1.5"><Icon name="calendar" size={12} /> Tilføj</button>
              <button onClick={() => pushToast(`Aflysning sendt til ${partner.ejer}`)} className="btn btn-secondary text-[12px] !px-3 !py-1.5">Aflys</button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── KPI ROW ─── */}
      <section className="px-6 lg:px-12 mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Omsætning 12 mdr" value={fmtKr(sales.omsætning12mo)} delta={`${sales.omsætningYoY > 0 ? "+" : ""}${sales.omsætningYoY}% YoY`} positive={sales.omsætningYoY > 0} sparkline={sales.monthlyOmsætning} labels={sales.monthlyLabels} color="var(--accent)" unit="kr" />
          <Kpi label="Sager YTD" value={sales.sagerYTD.toString()} delta={`${sales.sagerYoY > 0 ? "+" : ""}${sales.sagerYoY}% YoY`} positive={sales.sagerYoY > 0} sparkline={sales.monthlySager} labels={sales.monthlyLabels} color="#2D4A0F" />
          <Kpi label="Kontakt-omkostning" value={`${sales.kontaktOmkostningPerSag} kr`} delta="pr. sag" />
          <Kpi label="NPS" value={`+${sales.npsScore}`} delta={`${sales.npsRespondenter} svar`} positive />
        </div>
      </section>

      {/* ─── BIG CHART + DONUT ─── */}
      <section className="px-6 lg:px-12 mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Omsætning chart */}
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h2 className="t-h3">Omsætning · seneste 12 måneder</h2>
              <p className="t-caption mt-0.5">Hover for månedlige tal</p>
            </div>
            <div className="text-right">
              <div className="text-[26px] font-semibold leading-none text-[var(--ink)] tabular-nums">{fmtKr(sales.omsætning12mo)}</div>
              <div className={"text-[12px] font-semibold mt-1 " + (sales.omsætningYoY > 0 ? "text-[#2D4A0F]" : "text-[var(--ink-3)]")}>
                {sales.omsætningYoY > 0 ? "+" : ""}{sales.omsætningYoY}% vs. forrige år
              </div>
            </div>
          </div>
          <InteractiveArea
            data={omsætningSeries}
            color="var(--accent)"
            height={220}
            formatValue={(v) => fmtK(v)}
            unit="kr"
          />
        </div>

        {/* Category split */}
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="t-h3">Hvad de køber</h2>
            <span className="t-caption">Kategori-split</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <InteractivePie data={sales.kategoriSplit} size={200} innerRadius={62} />
          </div>
          <ul className="space-y-2">
            {sales.kategoriSplit.map((s) => (
              <li key={s.label} className="flex items-center gap-3 text-[13px]">
                <span className="size-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-[var(--ink-2)] flex-1">{s.label}</span>
                <span className="text-[var(--ink-3)] tabular-nums font-medium">{s.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── INSIGHTS + DISCOUNTS ─── */}
      <section className="px-6 lg:px-12 mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* What we've learned */}
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="t-h3">Hvad vi har lært</h2>
            <span className="t-caption">Indsigter fra data</span>
          </div>
          <div className="space-y-3">
            {sales.insights.map((it, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
                <div className="size-9 rounded-lg bg-white grid place-items-center text-xl shrink-0 shadow-[var(--shadow-1)]">{it.emoji}</div>
                <div>
                  <div className="text-[14px] font-semibold text-[var(--ink)]">{it.title}</div>
                  <p className="text-[13px] text-[var(--ink-2)] mt-0.5 leading-[1.5]">{it.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discount summary + payment */}
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="t-h3">Rabat &amp; betaling</h2>
            <span className="t-caption">12 mdr</span>
          </div>
          <div className="space-y-4">
            <Stat label="Effektiv rabat-sats" value={`${sales.rabatPct}%`} sub="Inkl. tier + kampagne" />
            <div className="h-px bg-[var(--line-2)]" />
            <Stat label="Total rabat givet" value={fmtKr(sales.rabatTotalDKK)} sub={`Svarer til ${Math.round(sales.rabatTotalDKK / sales.sagerYTD)} kr/sag`} />
            <div className="h-px bg-[var(--line-2)]" />
            <Stat label="Gns. betalingsdage" value={`${sales.betalingsdageGns} dage`} sub={sales.betalingsdageGns < 21 ? "Hurtigere end snittet" : "På linje med snittet"} />
            <div className="h-px bg-[var(--line-2)]" />
            <Stat label="NPS-bidragsydere" value={`${sales.npsRespondenter} svar`} sub={`Score +${sales.npsScore}`} />
          </div>
        </div>
      </section>

      {/* ─── PREDICTED OFFER ─── */}
      <section className="px-6 lg:px-12 mt-4">
        <div
          className="rounded-[var(--r-xl)] overflow-hidden border"
          style={{ borderColor: "#5B7F2C30", background: "linear-gradient(135deg, #F5FAEB 0%, #FFFFFF 60%)" }}
        >
          <div className="p-7 lg:p-8 flex flex-wrap items-start gap-6">
            <div className="flex-1 min-w-[280px]">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wider" style={{ background: "#EAF1DC", color: "#324A14" }}>
                <Icon name="lightbulb" size={12} />
                Forudsigt-tilbud · {sales.predictedOffer.confidence}% sikkerhed
              </div>
              <h2 className="t-h2 mt-3">Næste køb forudset — send tilbud med ét klik</h2>
              <p className="t-body mt-2 max-w-[640px]">{sales.predictedOffer.reason}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[12px] text-[var(--ink-3)] uppercase tracking-wider">Forventet ordreværdi</div>
              <div className="text-[28px] font-semibold text-[var(--ink)] tabular-nums">{sales.predictedOffer.estimatedValue}</div>
              <button
                onClick={() => setShowOfferDialog(true)}
                disabled={offerSent}
                className="btn btn-primary mt-3"
              >
                {offerSent ? <span className="inline-flex items-center gap-1.5"><Icon name="check" size={14} /> Tilbud sendt</span> : "Send tilbud (1 klik)"}
              </button>
            </div>
          </div>

          {/* Suggested products */}
          <div className="px-7 lg:px-8 pb-7 lg:pb-8">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-3">Anbefalede produkter</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {offerProducts.map((p) => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 p-3 rounded-[var(--r-md)] bg-white border border-[var(--line-2)] hover:border-[var(--accent)] hover:shadow-[var(--shadow-1)] transition-all"
                >
                  <div className="size-14 rounded-lg bg-[var(--canvas-2)] overflow-hidden grid place-items-center shrink-0">
                    {p.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.image} alt={p.navn} className="size-full object-cover" />
                    ) : (
                      <span className="text-2xl">{p.emoji}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{p.brand}</div>
                    <div className="text-[13px] font-semibold text-[var(--ink)] truncate">{p.navn}</div>
                    <div className="text-[12px] text-[var(--ink-3)] tabular-nums mt-0.5">{p.pris}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTIVITY ─── */}
      <section className="px-6 lg:px-12 mt-4">
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="t-h3">Seneste aktivitet</h2>
            <span className="t-caption">Seneste 30 dage</span>
          </div>
          <ul className="space-y-3">
            {sales.activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] py-2">
                <span className="size-2 rounded-full mt-2 shrink-0" style={{ background: ACTIVITY_COLOR[a.type] ?? "var(--ink-3)" }} />
                <span className="flex-1 text-[var(--ink-2)]">{a.text}</span>
                <span className="text-[12px] text-[var(--ink-3)] shrink-0 tabular-nums">{a.tid}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── SCHEDULE VISIT DIALOG ─── */}
      {showVisitDialog && (
        <div className="fixed inset-0 z-50 bg-black/45 grid place-items-center p-4 animate-in" onClick={() => setShowVisitDialog(false)}>
          <div className="bg-white rounded-[var(--r-xl)] max-w-lg w-full p-7 shadow-[var(--shadow-4)]" onClick={(e) => e.stopPropagation()}>
            <div className="t-eyebrow">Planlæg besøg</div>
            <h3 className="t-h2 mt-2">Book et møde hos {partner.firma}</h3>
            <p className="t-body mt-2">
              Dennis Holmberg og {partner.ejer} bliver underrettet med kalender-invite + email-bekræftelse.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1.5">Dato &amp; tid</label>
                <input
                  type="datetime-local"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  defaultValue="2026-06-03T10:30"
                  className="w-full px-3 py-2 rounded-[var(--r-sm)] border border-[var(--line-2)] text-[14px] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1.5">Agenda</label>
                <textarea
                  value={visitAgenda}
                  onChange={(e) => setVisitAgenda(e.target.value)}
                  rows={3}
                  placeholder="Fx kvartals-review, ny Stroxx-pris, Q3 pipeline …"
                  className="w-full px-3 py-2 rounded-[var(--r-sm)] border border-[var(--line-2)] text-[13px] focus:outline-none focus:border-[var(--accent)] resize-none"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1.5">Deltagere</label>
                <div className="flex flex-wrap gap-1.5">
                  <span className="tag inline-flex items-center gap-1" style={{ background: "var(--canvas-2)", color: "var(--ink-2)" }}><Icon name="user" size={11} /> {partner.ejer}</span>
                  <span className="tag inline-flex items-center gap-1" style={{ background: "var(--canvas-2)", color: "var(--ink-2)" }}><Icon name="user" size={11} /> Dennis Holmberg</span>
                  <span className="tag inline-flex items-center gap-1" style={{ background: "var(--canvas-2)", color: "var(--ink-2)" }}><Icon name="plus" size={11} /> Tilføj</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <button onClick={() => setShowVisitDialog(false)} className="btn btn-secondary">Annullér</button>
              <button onClick={saveVisit} className="btn btn-primary inline-flex items-center gap-1.5"><Icon name="calendar" size={14} /> Book &amp; underret</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONFIRMATION DIALOG ─── */}
      {showOfferDialog && (
        <div className="fixed inset-0 z-50 bg-black/45 grid place-items-center p-4 animate-in" onClick={() => setShowOfferDialog(false)}>
          <div className="bg-white rounded-[var(--r-xl)] max-w-md w-full p-7 shadow-[var(--shadow-4)]" onClick={(e) => e.stopPropagation()}>
            <div className="t-eyebrow">Bekræft</div>
            <h3 className="t-h2 mt-2">Send forudsigt-tilbud?</h3>
            <p className="t-body mt-3">
              {partner.firma} modtager en personlig email med {offerProducts.length} produkter til en samlet vurderet værdi af <strong className="text-[var(--ink)]">{sales.predictedOffer.estimatedValue}</strong>.
              Rabat-procent: <strong className="text-[var(--ink)]">{sales.rabatPct}%</strong>. Email: <strong className="text-[var(--ink)]">{partner.email}</strong>.
            </p>
            <div className="mt-6 flex gap-2 justify-end">
              <button onClick={() => setShowOfferDialog(false)} className="btn btn-secondary">Annullér</button>
              <button onClick={sendOffer} className="btn btn-primary">Send tilbud</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, delta, positive, sparkline, color, labels, unit }: { label: string; value: string; delta?: string; positive?: boolean; sparkline?: number[]; color?: string; labels?: string[]; unit?: string }) {
  const chartData = sparkline?.map((v, i) => ({ label: labels?.[i] ?? String(i + 1), value: v }));
  return (
    <div className="bg-[var(--canvas)] rounded-[var(--r-lg)] border border-[var(--line)] p-5 flex flex-col">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-[var(--ink-3)] font-medium">{label}</span>
        {delta && <span className={"text-[12px] font-semibold " + (positive ? "text-[#2D4A0F]" : "text-[var(--ink-3)]")}>{delta}</span>}
      </div>
      <div className="mt-2 text-[24px] font-semibold leading-none tracking-tight text-[var(--ink)] tabular-nums">{value}</div>
      {chartData && (
        <div className="mt-3 -mx-1">
          <MiniArea data={chartData} color={color ?? "var(--accent)"} height={44} unit={unit} />
        </div>
      )}
    </div>
  );
}

function ContactRow({ label, value, href, external }: { label: string; value: string; href?: string; external?: boolean }) {
  return (
    <li className="flex items-baseline justify-between gap-3 text-[13px]">
      <span className="text-[12px] text-[var(--ink-3)] uppercase tracking-wider font-semibold shrink-0 min-w-[60px]">{label}</span>
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="link tabular-nums truncate text-right text-[13px]"
        >
          {value}
        </a>
      ) : (
        <span className="text-[var(--ink-2)] tabular-nums truncate text-right">{value}</span>
      )}
    </li>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-[var(--ink-3)] font-medium">{label}</span>
        <span className="text-[18px] font-semibold text-[var(--ink)] tabular-nums">{value}</span>
      </div>
      {sub && <div className="text-[12px] text-[var(--ink-3)] mt-0.5">{sub}</div>}
    </div>
  );
}
