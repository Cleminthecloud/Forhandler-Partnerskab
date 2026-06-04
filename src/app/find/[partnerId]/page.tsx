"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PARTNERS, Region, Faggruppe, PartnerProfile } from "@/lib/data";
import { THEMES } from "@/lib/themes";
import { useApp } from "@/components/AppState";
import { Spinner } from "@/components/Spinner";
import { DenmarkMap } from "@/components/DenmarkMap";

/* ─────────────────────────────────────────────────────────────────────
   Partner profile page — sales-grade landing page.

   Structure (researched against Airbnb host, Trustpilot biz, Yelp,
   Google Business Profile, and Houzz pro patterns):

     1. Cover hero  — local area image, gradient overlay
     2. Identity row — owner portrait overlapping hero, name + tier
     3. Trust strip  — Trustpilot widget, Carl Ras cert, response time, years
     4. About story  — derived from region + faggruppe
     5. Projects     — with cover images
     6. Reviews      — 3 mock excerpts derived from region + customer types
     7. Service area — mini map highlighting the partner's region
     8. Business info — CVR, address, hours, contact, mini location map
     9. Sticky contact form — always at hand on right rail

   All synthetic data (CVR, address, reviews, hours) is derived from the
   partner record locally — keeps the data layer untouched. */

/* ─────── Region-aware specialist content (unchanged) ─────── */
const REGION_FLAVOR: Record<Region, { flavor: string; towns: string[]; descriptor: string }> = {
  Nordsjælland:      { flavor: "langs Nordsjællands kyst", descriptor: "Nordkystens",      towns: ["Hornbæk", "Tisvildeleje", "Dronningmølle", "Hellebæk"] },
  Hovedstaden:       { flavor: "i Storkøbenhavn",          descriptor: "Storkøbenhavns",   towns: ["Frederiksberg", "Hellerup", "Charlottenlund", "Vanløse"] },
  Vestkysten:        { flavor: "langs Vestkysten",         descriptor: "Vestkystens",      towns: ["Blokhus", "Løkken", "Henne Strand", "Vejers"] },
  Bornholm:          { flavor: "på Bornholm",              descriptor: "Bornholms",        towns: ["Aakirkeby", "Rønne", "Allinge", "Snogebæk"] },
  "Lolland-Falster": { flavor: "på Sydhavsøerne",          descriptor: "Sydhavets",        towns: ["Marielyst", "Maribo", "Væggerløse", "Bøtø"] },
  Fyn:               { flavor: "på Fyn",                   descriptor: "Fynske",           towns: ["Odense", "Faaborg", "Middelfart", "Svendborg"] },
  Østjylland:        { flavor: "i Østjylland",             descriptor: "Østjyllands",      towns: ["Aarhus", "Ebeltoft", "Grenå", "Mols"] },
  Nordjylland:       { flavor: "i Vendsyssel",             descriptor: "Vendsyssels",      towns: ["Skagen", "Ålbæk", "Råbjerg", "Frederikshavn"] },
};

const FAG_PROJECT_VERBS: Record<Faggruppe, { lead: string; price: [number, number] }> = {
  "Låsesmed":        { lead: "Smart-lock installation",     price: [9, 28] },
  "Tømrer":          { lead: "Terrasse og facade",          price: [22, 65] },
  "Elektriker":      { lead: "Smart-home installation",     price: [14, 38] },
  "VVS":             { lead: "Frostsikring og vintertømning", price: [12, 24] },
  "Maler":           { lead: "Træfacade og imprægnering",   price: [18, 42] },
  "Ejendomsservice": { lead: "Helårsservice sommerhus",     price: [8, 18] },
  "Murer":           { lead: "Facade og indbrudsforstærkning", price: [28, 75] },
};

/* Deterministic founding year derived from antalSager — more cases = older firm.
   Used both for the about-blurb and the trust strip "etableret YYYY" badge. */
function foundingYear(p: PartnerProfile): number {
  if (p.antalSager > 200) return 2008;
  if (p.antalSager > 100) return 2014;
  if (p.antalSager > 40)  return 2018;
  return 2022;
}

/* Deterministic 8-digit CVR from partner.id — looks real in the demo,
   maps the same partner to the same CVR every render. Real Danish CVRs
   are 8 digits and start with 1-3 typically. */
function deriveCVR(p: PartnerProfile): string {
  // Hash the partner id to a stable 7-digit suffix
  let h = 0;
  for (let i = 0; i < p.id.length; i++) h = ((h << 5) - h) + p.id.charCodeAt(i);
  const seven = Math.abs(h % 9_000_000) + 1_000_000;
  return `${(Math.abs(h) % 8) + 2}${seven}`; // 8 digits, leading 2-9
}

/* Street address — synthesized from by + faggruppe so it reads as real.
   Danish street naming patterns: "Hovedgade NN" for main streets,
   "vej" for typical roads, "Plads" for square-fronted shops. */
function deriveAddress(p: PartnerProfile): string {
  const streets: Record<Faggruppe, string[]> = {
    "Låsesmed":        ["Hovedgade", "Bygmestervej", "Stationsvej"],
    "Tømrer":          ["Industrivej", "Tømrergade", "Værkstedsvej"],
    "Elektriker":      ["Industrivej", "Elektrovej", "Strandvejen"],
    "VVS":             ["Industrivej", "Smedegade", "Værkstedsvej"],
    "Maler":           ["Hovedgade", "Strandvejen", "Kongevejen"],
    "Ejendomsservice": ["Industrivej", "Bygade", "Stationsvej"],
    "Murer":           ["Murerstræde", "Industrivej", "Brovejen"],
  };
  let h = 0;
  for (let i = 0; i < p.id.length; i++) h = ((h << 3) - h) + p.id.charCodeAt(i);
  const streetList = streets[p.faggruppe];
  const street = streetList[Math.abs(h) % streetList.length];
  const number = (Math.abs(h) % 80) + 1;
  return `${street} ${number}, ${p.postnr} ${p.by}`;
}

/* Cover photo — replaces the Unsplash CDN URLs in data.ts with our own
   local sommerhus photos. Unsplash IDs were returning generic/wrong content
   (computer screens, abstract shots) which broke the "local" feel. These
   sommerhus images live in /public/campaigns and are tied to the partner's
   trade so the visual makes sense. */
function coverPhotoFor(p: PartnerProfile): string {
  const map: Record<Faggruppe, string> = {
    "Låsesmed":        "/campaigns/sommerhus-lock-pov.jpg",   // lock POV — relevant for locksmith
    "Tømrer":          "/campaigns/sommerhus-family_wide.jpg",
    "Elektriker":      "/campaigns/sommerhus-dusk.jpg",        // dusk lighting — electrical theme
    "Maler":           "/campaigns/sommerhus-family_wide.jpg",
    "VVS":             "/campaigns/sommerhus-family.jpg",
    "Ejendomsservice": "/campaigns/sommerhus-family.jpg",
    "Murer":           "/campaigns/sommerhus-family_wide.jpg",
  };
  return map[p.faggruppe];
}

/* Mock reviews — derived from region + faggruppe so they read locally true.
   Customer names + cities use the region's town pool. */
function deriveReviews(p: PartnerProfile): { author: string; from: string; date: string; rating: number; body: string }[] {
  const r = REGION_FLAVOR[p.region];
  const firstName = p.ejer.split(" ")[0];

  // Three reviews — varied tones, mostly 5 stars (matches partner.rating).
  // Real Trustpilot reviews lean toward extremes; we keep them positive but
  // not all identical. Bodies tie to faggruppe so they sound credible.
  const fagSpecific: Record<Faggruppe, [string, string, string]> = {
    "Låsesmed": [
      `${firstName} kom samme dag og fik installeret smart locks på både fordør og sommerhus. Tydelig prissætning og ryddet op efter sig.`,
      `Vi havde fået skiftet ejer og skulle have hele låsesystemet om. ${firstName} foreslog en løsning der både var hurtigere og billigere end vores første tanke. Anbefales.`,
      `Hurtig udrykning da vi var låst ude. Ringede kl. 19, var der inden for en time. Professionelt og venligt.`,
    ],
    "Tømrer": [
      `Vi fik bygget en ny terrasse til sommerhuset. ${firstName} og holdet arbejdede præcist og hurtigt — terrassen stod færdig på 4 dage. Aftalen holdt 100%.`,
      `Renovering af facade. Detaljer som inddækninger og rendebakker er udført ordentligt — kvalitet man kan se.`,
      `Vinterklargøring af sommerhus. Sendt billeder af alt arbejdet bagefter — meget transparent.`,
    ],
    "Elektriker": [
      `${firstName} installerede smart-home pakke i hele huset. Forklarede alt undervejs, ingen overraskelser på regningen.`,
      `Solceller og batteri. Solidt arbejde, god rådgivning om dimensionering.`,
      `Strømsvigt i sommerhuset — kom samme dag og fandt fejlen på 20 minutter. Reel pris.`,
    ],
    "Maler": [
      `Træfacade på sommerhuset trængte. ${firstName} brugte en god imprægnering der står godt i saltluft. Tydelig forskel allerede første år.`,
      `Hele indvendigt arbejde i forbindelse med flytning. Aftalen blev holdt, prisen var som lovet.`,
      `Hurtig og venlig. Beskyttet gulve og møbler ordentligt, ikke en plet på vores eget.`,
    ],
    "VVS": [
      `Vi havde sprunget en rør i sommerhuset over vinteren. ${firstName} udbedrede skaden og lavede ordentlig frostsikring så det ikke sker igen.`,
      `Vintertømning + tilsyn pr. abonnement. Føler os helt trygge — får besked hvis noget ser anderledes ud.`,
      `Varmepumpe installeret. Klar rådgivning, god pris og virker upåklageligt.`,
    ],
    "Ejendomsservice": [
      `Vi bor i København og har sommerhus i området. ${firstName} kører forbi månedligt og tjekker. Føler os helt trygge.`,
      `Klargøring inden vi kom på ferie — alt var rent, opvarmet og klar. Værd hver eneste krone.`,
      `Hurtig respons da vores nabo meldte om en åben dør. Kørte derhen, sikrede huset, ringede til os.`,
    ],
    "Murer": [
      `Facaderens og imprægnering. ${firstName} arbejder grundigt og leverer høj kvalitet. Vi fik faglig sparring undervejs.`,
      `Indbrudsforstærkning af bagdør og kælder. Solidt arbejde — du kan se det er holdbart.`,
      `Skorstensrenovering. Kompliceret opgave, men håndteret professionelt.`,
    ],
  };

  const bodies = fagSpecific[p.faggruppe];
  const lastNames = ["Sørensen", "Hansen", "Jensen", "Nielsen", "Andersen", "Pedersen", "Christensen"];
  // Derive deterministic name/city from id
  const idCharSum = p.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return bodies.map((body, i) => ({
    author: `Familien ${lastNames[(idCharSum + i) % lastNames.length]}`,
    from: r.towns[i % r.towns.length],
    date: ["2 uger siden", "1 måned siden", "3 måneder siden"][i],
    rating: i === 1 ? 4 : 5, // mostly 5, one 4 to look real
    body,
  }));
}

/* Service area headline + bullets — matches the partner's region. */
function deriveServiceArea(p: PartnerProfile): { headline: string; towns: string[] } {
  const r = REGION_FLAVOR[p.region];
  return {
    headline: `Servicerer hele ${p.region} og omegn`,
    towns: r.towns,
  };
}

function specialistBlurb(p: PartnerProfile): { headline: string; body: string; projects: { titel: string; body: string; pris: string }[] } {
  const r = REGION_FLAVOR[p.region];
  const v = FAG_PROJECT_VERBS[p.faggruppe];
  const firstName = p.ejer.split(" ")[0];
  const teamSize = p.tier === "Guld" ? "fast hold på 6–8 mand" : p.tier === "Sølv" ? "tre-mands hold" : "to-mands hold";
  const sinceYear = foundingYear(p);
  const specialty = p.specialer[0] ?? p.faggruppe;

  return {
    headline: `${specialty} ${r.flavor}`,
    body: `${p.firma} har serviceret kunder ${r.flavor} siden ${sinceYear}. ${firstName} driver et ${teamSize} med korte responstider og lokalt kendskab til ${r.towns.slice(0, 2).join(" og ")}-områderne. Specialist i ${p.specialer.slice(0, 2).join(" og ").toLowerCase()}.`,
    projects: r.towns.map((town, i) => {
      const pris = v.price[0] + Math.round(((v.price[1] - v.price[0]) * ((i * 37) % 100)) / 100);
      const variant = [
        `${v.lead}, ${town}`,
        `${p.specialer[i % p.specialer.length] ?? p.faggruppe}, ${town}`,
        `${v.lead} — ${town}`,
        `${p.specialer[(i + 1) % p.specialer.length] ?? p.faggruppe}, ${town}`,
      ][i];
      const desc = [
        `Komplet løsning til lokalt sommerhus. Vurderet og afsluttet inden for 2 uger.`,
        `Servicebesøg med opfølgning. Anbefalet af ${r.descriptor} grundejerforening.`,
        `Klargøring inden højsæson. ${p.specialer[0] ?? "Fagligt"} kvalitetscheck.`,
        `Eftersyn + dokumentation. Carl Ras-certificeret arbejdsproces.`,
      ][i];
      return { titel: variant, body: desc, pris: `≈ ${pris}.000 kr` };
    }),
  };
}

export default function PartnerProfilePage({ params }: { params: Promise<{ partnerId: string }> }) {
  const { partnerId } = use(params);
  const partner = PARTNERS.find((p) => p.id === partnerId);
  const { addLead, pushToast } = useApp();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    kunde: "",
    postnr: "",
    by: "",
    telefon: "",
    email: "",
    behov: "",
    beskrivelse: "",
    tema: THEMES[0].id,
  });

  if (!partner) {
    return (
      <div className="mx-auto max-w-[800px] px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Partner ikke fundet</h1>
        <Link href="/find" className="mt-4 inline-block text-[var(--cr-blue)] font-semibold">← Tilbage til partnerfinder</Link>
      </div>
    );
  }

  const p = partner;
  const founded = foundingYear(p);
  const yearsInBusiness = 2026 - founded;
  const cvr = deriveCVR(p);
  const address = deriveAddress(p);
  const reviews = deriveReviews(p);
  const serviceArea = deriveServiceArea(p);
  const blurb = specialistBlurb(p);
  const reviewCount = Math.floor(p.antalSager * 0.6);
  const cover = coverPhotoFor(p);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kunde || !form.telefon || !form.behov) {
      pushToast("Udfyld venligst navn, telefon og kort beskrivelse af opgaven.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 850));
    addLead({
      kunde: form.kunde,
      postnr: form.postnr,
      by: form.by,
      telefon: form.telefon,
      email: form.email,
      behov: form.behov,
      beskrivelse: form.beskrivelse,
      tema: form.tema,
      værdi: "Vurderes af partner",
      partnerId: p.id,
    });
    setIsSubmitting(false);
    setSubmitted(true);
    pushToast(`Tak! ${p.firma} kontakter dig snart.`);
  }

  return (
    <article>
      {/* ─── HERO COVER ──────────────────────────────────────────────
         Local sommerhus photo from /public/campaigns — controlled assets,
         so the visual always fits the trade (lock POV for låsesmed, dusk
         for elektriker, etc). Strong bottom gradient + the identity row
         sits ENTIRELY BELOW the cover (Twitter/LinkedIn pattern) so the
         company name is always on a white background — never overlapping
         the photo. Just the portrait avatar floats up to overlap. */}
      <section className="relative bg-[var(--canvas-2)]">
        <div className="relative h-[220px] sm:h-[280px] lg:h-[320px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
          {/* Stronger bottom gradient so the avatar pops + visual transition */}
          <div className="absolute inset-x-0 bottom-0 h-[140px] bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

          {/* Back link — floats top-left, blurred pill so it reads on any photo */}
          <Link
            href="/find"
            className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md text-[13px] font-semibold text-[var(--ink)] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Tilbage til søgning
          </Link>

          {/* Local-area caption — bottom-right on the photo, sits on the
              gradient so it's always readable */}
          <div className="absolute bottom-4 right-5 text-white text-[12px] font-semibold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
            {p.by} · {p.region}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        {/* ─── IDENTITY ROW ─────────────────────────────────────────
           Twitter/LinkedIn pattern: only the portrait avatar overlaps
           the cover. Everything textual sits BELOW the cover on white,
           never overlapping the photo. */}
        <header className="relative z-10">
          {/* Portrait — floats upward to overlap the cover by ~52px */}
          <div className="-mt-[52px] sm:-mt-[64px]">
            {p.ejerPortrait ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={p.ejerPortrait}
                alt={p.ejer}
                className="size-24 sm:size-28 rounded-2xl object-cover ring-4 ring-white shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
              />
            ) : (
              <div className="size-24 sm:size-28 rounded-2xl ring-4 ring-white shadow-[0_8px_24px_rgba(0,0,0,0.14)] grid place-items-center text-white font-semibold text-[28px]" style={{ background: p.logoBg }}>
                {p.initialer}
              </div>
            )}
          </div>

          {/* Company info — fully below the cover, on white */}
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-tight text-[var(--ink)]">{p.firma}</h1>
              <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full" style={{
                background: p.tier === "Guld" ? "#FFF4D6" : p.tier === "Sølv" ? "#F1F3F5" : "#FBE9DC",
                color: p.tier === "Guld" ? "#7A5300" : p.tier === "Sølv" ? "#52595E" : "#7A3F12",
              }}>{p.tier}-partner</span>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-[var(--cr-blue-tint)] text-[var(--cr-navy)]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Carl Ras Certificeret
              </span>
            </div>
            <div className="text-[14px] sm:text-[15px] text-[var(--ink-2)] mt-1.5">
              {p.faggruppe} · {p.by} ({p.postnr}) · {p.region}
            </div>
          </div>
        </header>

        {/* ─── TRUST STRIP ─────────────────────────────────────────
           4 cards: Trustpilot widget, Carl Ras cert, response time,
           years in business. Horizontal scroll on mobile, grid on lg. */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <TrustCard
            title="Trustpilot"
            value={
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[18px] font-bold tabular-nums text-[var(--ink)]">{p.rating}</span>
                <Stars rating={p.rating} />
              </span>
            }
            sub={`${reviewCount} anmeldelser · Fremragende`}
            accent="#00B67A"
          />
          <TrustCard
            title="Carl Ras"
            value={<span className="text-[18px] font-bold text-[var(--ink)]">Certificeret</span>}
            sub={`Partner siden ${p.medlemSiden}`}
            accent="#1158A3"
          />
          <TrustCard
            title="Responstid"
            value={<span className="text-[18px] font-bold text-[var(--ink)]">&lt; 24 timer</span>}
            sub="Typisk svartid på forespørgsel"
            accent="#1158A3"
          />
          <TrustCard
            title="Etableret"
            value={<span className="text-[18px] font-bold text-[var(--ink)]">{founded}</span>}
            sub={`${yearsInBusiness} år i branchen`}
            accent="#1158A3"
          />
        </div>

        {/* ─── TWO-COL CONTENT ─────────────────────────────────────── */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left rail */}
          <main className="space-y-10 min-w-0">
            {/* About section */}
            <section>
              <div className="t-tagline text-[var(--accent)]">OM VIRKSOMHEDEN</div>
              <h2 className="text-[22px] font-semibold mt-2 text-[var(--ink)]">{blurb.headline}</h2>
              <p className="text-[15px] text-[var(--ink-2)] mt-3 leading-relaxed">{p.beskrivelse}</p>
              <p className="text-[15px] text-[var(--ink-2)] mt-3 leading-relaxed">{blurb.body}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.specialer.map((s) => (
                  <span key={s} className="text-[12.5px] px-3 py-1 rounded-full bg-[var(--canvas-2)] text-[var(--ink-2)] font-medium">{s}</span>
                ))}
              </div>
            </section>

            {/* Recent projects */}
            <section>
              <div className="t-tagline text-[var(--accent)]">SENESTE PROJEKTER</div>
              <h2 className="text-[22px] font-semibold mt-2 text-[var(--ink)]">Udvalgte sager fra det seneste år</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {blurb.projects.map((c, i) => (
                  <ProjectCard
                    key={c.titel}
                    title={c.titel}
                    body={c.body}
                    price={c.pris}
                    coverFallback={cover}
                    index={i}
                  />
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="t-tagline text-[var(--accent)]">ANMELDELSER</div>
                  <h2 className="text-[22px] font-semibold mt-2 text-[var(--ink)] inline-flex items-center gap-2">
                    {p.rating} <Stars rating={p.rating} large />
                    <span className="text-[14px] font-normal text-[var(--ink-3)]">({reviewCount})</span>
                  </h2>
                </div>
                <div className="text-[12px] text-[var(--ink-3)]">via Trustpilot</div>
              </div>
              <div className="mt-5 space-y-3">
                {reviews.map((rev) => (
                  <ReviewCard key={rev.author} {...rev} />
                ))}
              </div>
            </section>

            {/* Service area */}
            <section>
              <div className="t-tagline text-[var(--accent)]">SERVICEOMRÅDE</div>
              <h2 className="text-[22px] font-semibold mt-2 text-[var(--ink)]">{serviceArea.headline}</h2>
              <p className="text-[14px] text-[var(--ink-3)] mt-2">
                Dækker bl.a. {serviceArea.towns.slice(0, 3).join(", ")} og {serviceArea.towns[3]}.
              </p>

              {/* Map FILLS the section width — the partner pin's tooltip
                  is clipped when the map is in a narrow column. Town list
                  moves below as a horizontal chip row instead of a sidebar. */}
              <div className="mt-5 card !p-3">
                <DenmarkMap partners={[p]} selectedRegion={p.region} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] py-1.5 mr-1">
                  Dækker:
                </span>
                {serviceArea.towns.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-full bg-[var(--canvas-2)] text-[var(--ink-2)] font-medium"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)] shrink-0">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* Business info */}
            <section>
              <div className="t-tagline text-[var(--accent)]">VIRKSOMHEDSOPLYSNINGER</div>
              <h2 className="text-[22px] font-semibold mt-2 text-[var(--ink)]">Kontakt og lokation</h2>

              <div className="mt-5 card !p-0 overflow-hidden">
                <div className="grid sm:grid-cols-2">
                  {/* Info column */}
                  <div className="p-5 space-y-4">
                    <InfoRow
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      }
                      label="Adresse"
                      value={
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent)] hover:underline"
                        >
                          {address}
                          <span className="ml-1.5 text-[11px] text-[var(--ink-3)]">↗ Vis på kort</span>
                        </a>
                      }
                    />
                    <InfoRow
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                      }
                      label="Telefon"
                      value={<a href={`tel:${p.telefon.replace(/\s/g, "")}`} className="text-[var(--accent)] hover:underline">{p.telefon}</a>}
                    />
                    <InfoRow
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      }
                      label="Email"
                      value={<a href={`mailto:${p.email}`} className="text-[var(--accent)] hover:underline">{p.email}</a>}
                    />
                    <InfoRow
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                      }
                      label="Website"
                      value={<a href={`https://${p.webadresse}`} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">{p.webadresse}</a>}
                    />
                    <InfoRow
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      }
                      label="CVR"
                      value={<span className="text-[var(--ink-2)] tabular-nums">{cvr}</span>}
                    />
                  </div>
                  {/* Hours column */}
                  <div className="p-5 sm:border-l border-t sm:border-t-0 border-[var(--line-2)] bg-[var(--canvas-2)]/50">
                    <div className="t-eyebrow text-[var(--accent)] mb-3">ÅBNINGSTIDER</div>
                    <ul className="space-y-2 text-[14px]">
                      <HoursRow day="Mandag – Fredag" hours="07:00 – 17:00" />
                      <HoursRow day="Lørdag" hours="09:00 – 13:00" />
                      <HoursRow day="Søndag" hours="Lukket" muted />
                    </ul>
                    <div className="mt-5 pt-4 border-t border-[var(--line-2)]">
                      <div className="t-eyebrow text-[var(--accent)] mb-2">VAGTTELEFON</div>
                      <p className="text-[13px] text-[var(--ink-2)] leading-relaxed">
                        Akut udrykning udenfor åbningstid — ring direkte. Mertillæg efter aftale.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* ─── STICKY CONTACT FORM ─────────────────────────────── */}
          <aside className="lg:sticky lg:top-4 self-start space-y-4">
            {!submitted ? (
              <form onSubmit={submit} className="card !p-6">
                <div className="t-tagline text-[var(--accent)]">BED OM KONTAKT</div>
                <h3 className="text-[22px] font-semibold mt-2 text-[var(--ink)]">{p.ejer.split(" ")[0]} kontakter dig</h3>
                <p className="text-[13px] text-[var(--ink-3)] mt-1">Typisk inden for 24 timer. Helt uforpligtende.</p>

                <div className="mt-5 space-y-3.5">
                  <Field label="Dit navn *">
                    <input type="text" value={form.kunde} onChange={(e) => setForm({ ...form, kunde: e.target.value })} className="form-input" placeholder="For- og efternavn" />
                  </Field>
                  <Field label="Telefon *">
                    <input type="tel" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} className="form-input" placeholder="+45 …" />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="dig@email.dk" />
                  </Field>
                  <div className="grid grid-cols-[110px_1fr] gap-3">
                    <Field label="Postnr">
                      <input type="text" value={form.postnr} onChange={(e) => setForm({ ...form, postnr: e.target.value })} className="form-input" placeholder={p.postnr} />
                    </Field>
                    <Field label="By">
                      <input type="text" value={form.by} onChange={(e) => setForm({ ...form, by: e.target.value })} className="form-input" placeholder={p.by} />
                    </Field>
                  </div>
                  <Field label="Hvad har du brug for? *">
                    <input type="text" value={form.behov} onChange={(e) => setForm({ ...form, behov: e.target.value })} className="form-input" placeholder={`F.eks. ${p.specialer[0]}`} />
                  </Field>
                  <Field label="Beskrivelse">
                    <textarea rows={3} value={form.beskrivelse} onChange={(e) => setForm({ ...form, beskrivelse: e.target.value })} className="form-input resize-none" placeholder="Kort beskrivelse af opgaven…" />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 pill pill-primary w-full justify-center !py-3 inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size={14} label="Sender forespørgsel" />
                      Sender…
                    </>
                  ) : (
                    "Send forespørgsel"
                  )}
                </button>
                <p className="t-caption mt-3 text-center">
                  Vi sender din forespørgsel direkte til {p.firma}. Carl Ras gemmer ikke dine data.
                </p>
                <style>{`
                  .form-input { width: 100%; padding: 10px 12px; border-radius: 10px; background: var(--canvas-2); font-size: 14px; outline: none; border: 1px solid transparent; transition: all 160ms ease; }
                  .form-input:focus { background: white; border-color: var(--accent); }
                `}</style>
              </form>
            ) : (
              <div className="card !p-6 text-center">
                <div className="size-12 mx-auto rounded-full bg-[var(--cr-blue-tint)] grid place-items-center text-[var(--accent)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 className="text-[22px] font-semibold text-[var(--ink)] mt-3">Forespørgsel sendt</h3>
                <p className="text-[14px] text-[var(--ink-2)] mt-2">
                  {p.firma} har modtaget din forespørgsel og kontakter dig snarest — typisk inden for 24 timer.
                </p>
                <div className="mt-5 p-4 rounded-xl bg-[var(--cr-blue-tint)] text-left text-[12px]">
                  <div className="font-semibold text-[var(--ink)]">Sådan virker partnerflowet</div>
                  <p className="text-[var(--ink-2)] mt-1">
                    Forespørgslen lander nu i partnerens lead-indbakke. Skift til <strong>Partner</strong>-rollen i top-højre demo-nav for at se den der.
                  </p>
                  <button onClick={() => router.push("/partner/leads")} className="pill pill-primary mt-3 text-[12px]">
                    Se lead-indbakken →
                  </button>
                </div>
                <button onClick={() => router.push("/find")} className="mt-4 pill pill-light w-full justify-center">
                  Tilbage til søgning
                </button>
              </div>
            )}
          </aside>
        </div>

        {/* Bottom spacer so the sticky aside has scroll headroom */}
        <div className="h-16" />
      </div>
    </article>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[var(--ink-2)]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function TrustCard({
  title,
  value,
  sub,
  accent,
}: {
  title: string;
  value: React.ReactNode;
  sub: string;
  accent: string;
}) {
  return (
    <div className="card !p-4">
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ background: accent }} />
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{title}</div>
      </div>
      <div className="mt-2">{value}</div>
      <div className="text-[12px] text-[var(--ink-3)] mt-1">{sub}</div>
    </div>
  );
}

function Stars({ rating, large = false }: { rating: number; large?: boolean }) {
  // Render 5 stars, filled per rating value. Trustpilot uses green; we'll
  // also use green here to match the well-known visual cue.
  const size = large ? 16 : 13;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(rating);
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "#00B67A" : "#E1E5E9"}
            aria-hidden="true"
          >
            <path d="M12 2l3 6 6 1-4.5 4.5L18 21l-6-3.5L6 21l1.5-7.5L3 9l6-1z" />
          </svg>
        );
      })}
    </span>
  );
}

function ReviewCard({ author, from, date, rating, body }: { author: string; from: string; date: string; rating: number; body: string }) {
  // Customer monogram avatar — derived from author initials.
  const initials = author.split(" ").slice(-1)[0].slice(0, 2).toUpperCase();
  return (
    <div className="card !p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-full bg-[var(--canvas-2)] text-[var(--ink-2)] font-semibold grid place-items-center text-[12px] shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-[var(--ink)] truncate">{author}</div>
            <div className="text-[12px] text-[var(--ink-3)]">{from} · {date}</div>
          </div>
        </div>
        <Stars rating={rating} />
      </div>
      <p className="text-[14px] text-[var(--ink-2)] mt-3 leading-relaxed">{body}</p>
    </div>
  );
}

function ProjectCard({ title, body, price, coverFallback, index }: { title: string; body: string; price: string; coverFallback?: string; index: number }) {
  // Subtle photo header — uses the partner's cover photo as fallback so
  // every project card has visual weight. In a real build each project
  // would have its own image.
  return (
    <div className="card !p-0 overflow-hidden">
      {coverFallback && (
        <div className="relative h-[140px] overflow-hidden bg-[var(--canvas-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverFallback}
            alt=""
            className="absolute inset-0 size-full object-cover"
            style={{ filter: `hue-rotate(${index * 8}deg) saturate(${100 + index * 5}%)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-2 right-3 text-white text-[11px] font-semibold tracking-wide">
            {price}
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="text-[14px] font-semibold text-[var(--ink)]">{title}</div>
        <p className="text-[13px] text-[var(--ink-2)] mt-1.5 leading-relaxed">{body}</p>
        {!coverFallback && (
          <div className="text-[12px] text-[var(--ink-3)] mt-3">{price}</div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="size-8 rounded-lg bg-[var(--canvas-2)] grid place-items-center text-[var(--ink-2)] shrink-0">{icon}</span>
      <div className="min-w-0 pt-0.5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{label}</div>
        <div className="text-[14px] mt-0.5 break-words">{value}</div>
      </div>
    </div>
  );
}

function HoursRow({ day, hours, muted = false }: { day: string; hours: string; muted?: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span className={muted ? "text-[var(--ink-3)]" : "text-[var(--ink-2)]"}>{day}</span>
      <span className={"tabular-nums " + (muted ? "text-[var(--ink-3)]" : "text-[var(--ink)] font-medium")}>{hours}</span>
    </li>
  );
}
