import { ThemeId } from "./themes";

/* ─────────────────────────── Partner ─────────────────────────── */
export type Tier = "Bronze" | "Sølv" | "Guld";
export type Faggruppe = "Låsesmed" | "Tømrer" | "Elektriker" | "Maler" | "VVS" | "Ejendomsservice" | "Murer";
export type Region = "Nordsjælland" | "Hovedstaden" | "Vestkysten" | "Bornholm" | "Lolland-Falster" | "Fyn" | "Østjylland" | "Nordjylland";

export interface PartnerProfile {
  id: string;
  firma: string;
  ejer: string;
  postnr: string;
  by: string;
  region: Region;
  telefon: string;
  email: string;
  webadresse: string;
  tier: Tier;
  points: number;
  pointsTilNæste: number;
  faggruppe: Faggruppe;
  specialer: string[];
  initialer: string;       // monogram for profile chip
  logoBg: string;          // brand-aware color for monogram bg
  medlemSiden: string;
  rating: number;
  antalSager: number;
  beskrivelse: string;
}

export const CURRENT_PARTNER: PartnerProfile = {
  id: "p-hornbaek-laas",
  firma: "Hornbæk Låseservice",
  ejer: "Mads Sørensen",
  postnr: "3100",
  by: "Hornbæk",
  region: "Nordsjælland",
  telefon: "+45 49 70 12 88",
  email: "kontakt@hornbaek-laas.dk",
  webadresse: "hornbaek-laas.dk",
  tier: "Sølv",
  points: 1420,
  pointsTilNæste: 2000,
  faggruppe: "Låsesmed",
  specialer: ["Smart locks", "Sommerhussikring", "Indbrudsforebyggelse"],
  initialer: "HL",
  logoBg: "#1158A3",
  medlemSiden: "april 2026",
  rating: 4.8,
  antalSager: 142,
  beskrivelse: "Familieejet låsesmedfirma siden 2008. Servicerer hele Nordsjælland med fokus på sommerhuse langs kysten — fra Hornbæk til Tisvildeleje.",
};

export const PARTNERS: PartnerProfile[] = [
  CURRENT_PARTNER,
  { id: "p-bornholm-sikring", firma: "Bornholm Sikring ApS", ejer: "Lars Kofoed", postnr: "3700", by: "Rønne", region: "Bornholm", telefon: "+45 56 95 22 41", email: "info@bornholm-sikring.dk", webadresse: "bornholm-sikring.dk", tier: "Guld", points: 3120, pointsTilNæste: 4000, faggruppe: "Låsesmed", specialer: ["Smart locks", "Alarmer", "Adgangskontrol"], initialer: "BS", logoBg: "#002D59", medlemSiden: "februar 2026", rating: 4.9, antalSager: 287, beskrivelse: "Ø-dækkende sikringsspecialist. Alle bornholmske sommerhusområder." },
  { id: "p-tisvilde-toemrer", firma: "Tisvilde Tømrer & Bygning", ejer: "Henrik Larsen", postnr: "3220", by: "Tisvildeleje", region: "Nordsjælland", telefon: "+45 48 70 33 12", email: "henrik@tisvilde-tomrer.dk", webadresse: "tisvilde-tomrer.dk", tier: "Sølv", points: 1820, pointsTilNæste: 2000, faggruppe: "Tømrer", specialer: ["Terrasser", "Vinterklargøring", "Træfacader"], initialer: "TT", logoBg: "#5B7F2C", medlemSiden: "maj 2026", rating: 4.7, antalSager: 98, beskrivelse: "Tre generationers tømrere på Nordkysten." },
  { id: "p-blokhus-byg", firma: "Blokhus Byg & Bolig", ejer: "Søren Vinther", postnr: "9492", by: "Blokhus", region: "Vestkysten", telefon: "+45 98 24 75 10", email: "soren@blokhus-byg.dk", webadresse: "blokhus-byg.dk", tier: "Guld", points: 4280, pointsTilNæste: 5000, faggruppe: "Tømrer", specialer: ["Sommerhusrenovering", "Tagrender", "Vinterklargøring"], initialer: "BB", logoBg: "#F49100", medlemSiden: "marts 2026", rating: 5.0, antalSager: 312, beskrivelse: "Vestjyllands største sommerhusrenoverings-virksomhed." },
  { id: "p-marielyst-laas", firma: "Marielyst Låseteknik", ejer: "Birgitte Holm", postnr: "4873", by: "Væggerløse", region: "Lolland-Falster", telefon: "+45 54 17 88 22", email: "post@marielyst-laas.dk", webadresse: "marielyst-laas.dk", tier: "Sølv", points: 1690, pointsTilNæste: 2000, faggruppe: "Låsesmed", specialer: ["Smart locks", "Sommerhus"], initialer: "ML", logoBg: "#1158A3", medlemSiden: "april 2026", rating: 4.6, antalSager: 76, beskrivelse: "Marielyst, Bøtø og hele Sydhavsøerne." },
  { id: "p-skagen-el", firma: "Skagen Eltjeneste", ejer: "Jens Pedersen", postnr: "9990", by: "Skagen", region: "Nordjylland", telefon: "+45 98 44 12 30", email: "kontakt@skagen-el.dk", webadresse: "skagen-el.dk", tier: "Sølv", points: 1340, pointsTilNæste: 2000, faggruppe: "Elektriker", specialer: ["Smart home", "Sikringsanlæg", "Sommerhus"], initialer: "SE", logoBg: "#001A33", medlemSiden: "maj 2026", rating: 4.8, antalSager: 64, beskrivelse: "Skagen og Råbjerg Mile-området." },
  { id: "p-allinge-maler", firma: "Allinge Malerservice", ejer: "Karina Holm", postnr: "3770", by: "Allinge", region: "Bornholm", telefon: "+45 56 48 12 04", email: "info@allinge-maler.dk", webadresse: "allinge-maler.dk", tier: "Bronze", points: 380, pointsTilNæste: 500, faggruppe: "Maler", specialer: ["Træfacader", "Olierede terrasser"], initialer: "AM", logoBg: "#A88A6E", medlemSiden: "maj 2026", rating: 4.5, antalSager: 22, beskrivelse: "Bornholms træhuse skal stå skarpt." },
  { id: "p-vvs-loekken", firma: "Løkken VVS & Sommerhus", ejer: "Bent Madsen", postnr: "9480", by: "Løkken", region: "Vestkysten", telefon: "+45 98 99 22 55", email: "bent@lokken-vvs.dk", webadresse: "lokken-vvs.dk", tier: "Guld", points: 3680, pointsTilNæste: 4000, faggruppe: "VVS", specialer: ["Frostsikring", "Vinterlukning", "Vandinstallation"], initialer: "LV", logoBg: "#0C447C", medlemSiden: "februar 2026", rating: 4.9, antalSager: 248, beskrivelse: "Forebyg vandskader — vintertømning og varmestyring." },
  { id: "p-ebeltoft-ejendomsservice", firma: "Ebeltoft Ejendomsservice", ejer: "Mette Thygesen", postnr: "8400", by: "Ebeltoft", region: "Østjylland", telefon: "+45 86 34 22 18", email: "kontakt@ebeltoft-es.dk", webadresse: "ebeltoft-es.dk", tier: "Sølv", points: 1980, pointsTilNæste: 2000, faggruppe: "Ejendomsservice", specialer: ["Sommerhusservice", "Tilsyn", "Klargøring"], initialer: "EE", logoBg: "#5B7F2C", medlemSiden: "marts 2026", rating: 4.8, antalSager: 118, beskrivelse: "Helårsservice af sommerhuse i Mols Bjerge og Ebeltoft Vig." },
  { id: "p-fanoe-laas", firma: "Fanø Lås & Sikring", ejer: "Erik Brinch", postnr: "6720", by: "Fanø", region: "Vestkysten", telefon: "+45 75 16 22 88", email: "erik@fano-laas.dk", webadresse: "fano-laas.dk", tier: "Sølv", points: 1520, pointsTilNæste: 2000, faggruppe: "Låsesmed", specialer: ["Smart locks", "Ø-service"], initialer: "FL", logoBg: "#1158A3", medlemSiden: "april 2026", rating: 4.7, antalSager: 54, beskrivelse: "Fanøs eneste autoriserede sikringsspecialist." },
  { id: "p-aalbaek-byg", firma: "Ålbæk Byggepartner", ejer: "Niels Andersen", postnr: "9982", by: "Ålbæk", region: "Nordjylland", telefon: "+45 98 48 12 04", email: "niels@aalbaek-byg.dk", webadresse: "aalbaek-byg.dk", tier: "Bronze", points: 280, pointsTilNæste: 500, faggruppe: "Tømrer", specialer: ["Tagrender", "Vinterklargøring"], initialer: "ÅB", logoBg: "#A88A6E", medlemSiden: "maj 2026", rating: 4.4, antalSager: 18, beskrivelse: "Nyt tømrerfirma med fokus på sommerhusbæltet nord for Skagen." },
  { id: "p-vejers-vvs", firma: "Vejers Strand VVS", ejer: "Thomas Riis", postnr: "6853", by: "Vejers Strand", region: "Vestkysten", telefon: "+45 75 27 88 41", email: "thomas@vejers-vvs.dk", webadresse: "vejers-vvs.dk", tier: "Sølv", points: 1240, pointsTilNæste: 2000, faggruppe: "VVS", specialer: ["Vinterlukning", "Frostsikring"], initialer: "VV", logoBg: "#0C447C", medlemSiden: "april 2026", rating: 4.6, antalSager: 71, beskrivelse: "Holder Vejers' sommerhuse tørre om vinteren." },
];

/* ─────────────────────────── Leads ─────────────────────────── */
export type LeadStatus = "Ny" | "Kontaktet" | "Vundet" | "Tabt";

export interface Lead {
  id: string;
  kunde: string;
  postnr: string;
  by: string;
  telefon: string;
  email: string;
  behov: string;
  beskrivelse: string;
  tema: ThemeId;
  dato: string;       // ISO date
  status: LeadStatus;
  værdi?: string;     // est. value range
  partnerId?: string; // who it was routed to
}

export const SEED_LEADS: Lead[] = [
  { id: "l-001", kunde: "Familien Birkholm", postnr: "3100", by: "Hornbæk", telefon: "+45 22 14 88 12", email: "j.birkholm@gmail.com", behov: "Smart lock + alarm", beskrivelse: "Vi har overtaget sommerhuset efter mine svigerforældre og vil have moderne sikring inden vi udlejer. Helst smart lock så vi kan give koder til gæster.", tema: "sommer-sikring", dato: "2026-05-23", status: "Ny", værdi: "12-18.000 kr", partnerId: "p-hornbaek-laas" },
  { id: "l-002", kunde: "Susanne og Lars Vinge", postnr: "3120", by: "Dronningmølle", telefon: "+45 31 22 55 18", email: "vinge@familien.dk", behov: "Alarm + udvendige sensorer", beskrivelse: "Indbrud i naboejendommen sidste weekend. Vil have alarm op før sæsonen. Helst inden uge 23.", tema: "sommer-sikring", dato: "2026-05-22", status: "Ny", værdi: "18-25.000 kr", partnerId: "p-hornbaek-laas" },
  { id: "l-003", kunde: "Henning Mortensen", postnr: "3140", by: "Ålsgårde", telefon: "+45 40 88 12 04", email: "henningm@mail.dk", behov: "Udskiftning af alle låse", beskrivelse: "Gamle 70'er-låse over hele sommerhuset. Vil have ABUS eller tilsvarende. Ikke nødvendigvis smart.", tema: "sommer-sikring", dato: "2026-05-20", status: "Kontaktet", værdi: "8-12.000 kr", partnerId: "p-hornbaek-laas" },
  { id: "l-004", kunde: "Birte Klausen", postnr: "3100", by: "Hornbæk", telefon: "+45 26 41 22 18", email: "bk@klausen.com", behov: "Smart lock til hovedindgang", beskrivelse: "Skal kunne fjernåbnes når rengøringen kommer.", tema: "sommer-sikring", dato: "2026-05-18", status: "Vundet", værdi: "5-7.000 kr", partnerId: "p-hornbaek-laas" },
  { id: "l-005", kunde: "Familien Brask-Olsen", postnr: "3220", by: "Tisvildeleje", telefon: "+45 22 88 41 04", email: "brask@brask-olsen.dk", behov: "Bryllups-gæstehus sikret", beskrivelse: "Vi holder bryllup på sommerhuset 12. juni og skal have låst inde og ude separat fra hovedhuset.", tema: "sommer-sikring", dato: "2026-05-15", status: "Kontaktet", værdi: "20-30.000 kr", partnerId: "p-hornbaek-laas" },
  { id: "l-006", kunde: "Peter Wedell-Wedellsborg", postnr: "3150", by: "Hellebæk", telefon: "+45 51 22 88 31", email: "peter@wedellsborg.dk", behov: "Adgangskontrol til 3 sommerhuse", beskrivelse: "Familien har tre nabohuse vi udlejer. Vil have samlet system med koder pr. uge.", tema: "sommer-sikring", dato: "2026-05-12", status: "Vundet", værdi: "40-55.000 kr", partnerId: "p-hornbaek-laas" },
  { id: "l-007", kunde: "Anders og Camilla", postnr: "3100", by: "Hornbæk", telefon: "+45 28 41 12 76", email: "anders.c@hej.dk", behov: "Tjek af eksisterende alarm", beskrivelse: "Vores alarm er fra 2014 og ringer ikke længere ud. Vil have den vurderet.", tema: "sommer-sikring", dato: "2026-05-10", status: "Tabt", værdi: "2-4.000 kr", partnerId: "p-hornbaek-laas" },
  { id: "l-008", kunde: "Lone Krarup", postnr: "3120", by: "Dronningmølle", telefon: "+45 27 88 41 22", email: "lone@krarup.dk", behov: "Smart lock + dørtelefon", beskrivelse: "Skal kunne se på telefonen hvem der ringer på når jeg er i byen.", tema: "sommer-sikring", dato: "2026-05-08", status: "Vundet", værdi: "9-13.000 kr", partnerId: "p-hornbaek-laas" },
];

/* ─────────────────────────── Events ─────────────────────────── */
export interface CalendarEvent {
  id: string;
  titel: string;
  type: "Faglig Fredag" | "Regionsmøde" | "Produktdemo" | "Certificering" | "Webinar";
  dato: string;
  tid: string;
  varighed: string;
  lokation: string;
  region: Region | "Online" | "Hele landet";
  vært: string;
  værtRolle: string;
  beskrivelse: string;
  tilmeldte: number;
  pladser: number;
  tema?: ThemeId;
}

export const EVENTS: CalendarEvent[] = [
  { id: "e-001", titel: "Faglig Fredag: Smart Lock-markedet 2026", type: "Faglig Fredag", dato: "2026-06-05", tid: "13:00", varighed: "3 timer", lokation: "Carl Ras Herlev, Mileparken 30", region: "Hovedstaden", vært: "Jens Pedersen", værtRolle: "Senior Specialist · Sikring", beskrivelse: "Hands-on med ABUS, Yale Doorman og Danalock. Kom og prøv det nye Smart Lock Pro-sortiment før det går i butik.", tilmeldte: 24, pladser: 30, tema: "sommer-sikring" },
  { id: "e-002", titel: "Regionsmøde Nordsjælland", type: "Regionsmøde", dato: "2026-06-12", tid: "16:00", varighed: "2 timer", lokation: "Hotel Marienlyst, Helsingør", region: "Nordsjælland", vært: "Dennis Bundgaard Mikkelsen", værtRolle: "Regional Direktør", beskrivelse: "Status på Sommerhus-pilot, leads-flow Q2, og hvad I forventer i højsæsonen. Middag bagefter.", tilmeldte: 18, pladser: 25, tema: "sommer-sikring" },
  { id: "e-003", titel: "ABUS Certificering Niveau 2", type: "Certificering", dato: "2026-06-18", tid: "09:00", varighed: "Hele dagen", lokation: "Carl Ras Herlev", region: "Hovedstaden", vært: "Tina Holm", værtRolle: "Træningschef · Sikring", beskrivelse: "Fuld dags certificering i avancerede ABUS-systemer. Kræver Niveau 1.", tilmeldte: 12, pladser: 16 },
  { id: "e-004", titel: "Webinar: Vinterklargøring 2026", type: "Webinar", dato: "2026-06-22", tid: "14:00", varighed: "1 time", lokation: "Online (Teams)", region: "Online", vært: "Morten Bach", værtRolle: "Specialist · Byg", beskrivelse: "Vores næste tema kommer Q4. Her får du sneak peek på produkterne og kufferten.", tilmeldte: 47, pladser: 200, tema: "vinter-byg" },
  { id: "e-005", titel: "Faglig Fredag Bornholm", type: "Faglig Fredag", dato: "2026-06-26", tid: "13:00", varighed: "3 timer", lokation: "Best Western Hotel Rønne", region: "Bornholm", vært: "Christian Funch", værtRolle: "Specialist · Sikring", beskrivelse: "Ø-specifik snak: sommerhus-sikring, transport-logistik, lokal markedsføring.", tilmeldte: 8, pladser: 18 },
  { id: "e-006", titel: "Produktdemo: STROXX Smart Cylinder", type: "Produktdemo", dato: "2026-07-03", tid: "15:00", varighed: "2 timer", lokation: "Carl Ras Aarhus", region: "Østjylland", vært: "Marie Lindgren", værtRolle: "Specialist · Sikring", beskrivelse: "Ny smart-cylinder fra STROXX. Hands-on installation, priser og marginer.", tilmeldte: 11, pladser: 20 },
  { id: "e-007", titel: "Regionsmøde Vestkysten", type: "Regionsmøde", dato: "2026-07-10", tid: "16:00", varighed: "2 timer", lokation: "Strandhotellet, Blokhus", region: "Vestkysten", vært: "Dennis Bundgaard Mikkelsen", værtRolle: "Regional Direktør", beskrivelse: "Vestkyst-partnere samles. Q3-strategi og marketing-stack.", tilmeldte: 14, pladser: 25 },
];

/* ─────────────────────────── Campaigns ─────────────────────────── */
export type FormatKind = "print-flyer" | "print-poster" | "print-magasin" | "print-bilstreamer" | "digital-facebook" | "digital-instagram" | "digital-email" | "digital-google";

export interface CampaignFormat {
  id: FormatKind;
  label: string;
  category: "print" | "digital";
  dim: string;
  blurb: string;
}

export const FORMATS: CampaignFormat[] = [
  { id: "print-flyer", label: "Flyer A5", category: "print", dim: "148 × 210 mm", blurb: "Stikkes i postkasser i sommerhusområdet." },
  { id: "print-poster", label: "Poster A3", category: "print", dim: "297 × 420 mm", blurb: "Til lokalkøbmanden, brugsen, marinaen." },
  { id: "print-magasin", label: "Magasin-annonce", category: "print", dim: "210 × 297 mm helside", blurb: "Hornbæk Lokalblad, Lokalavisen Nordsjælland." },
  { id: "print-bilstreamer", label: "Bilstreamer", category: "print", dim: "1000 × 200 mm", blurb: "Magnetisk eller perm — Carl Ras Partner på din bil." },
  { id: "digital-facebook", label: "Facebook-opslag", category: "digital", dim: "1080 × 1080 px", blurb: "Klar til at poste på dit lokale opslag." },
  { id: "digital-instagram", label: "Instagram story", category: "digital", dim: "1080 × 1920 px", blurb: "9:16 story format, video eller still." },
  { id: "digital-email", label: "Email-signatur", category: "digital", dim: "600 × 200 px", blurb: "Carl Ras Partner-badge i din email-footer." },
  { id: "digital-google", label: "Google-annonce", category: "digital", dim: "300 × 250 px display", blurb: "Geo-targeted i dit lokalområde." },
];

export interface Campaign {
  id: string;
  tema: ThemeId;
  titel: string;
  hovedbudskab: string;
  underbudskab: string;
  cta: string;
  heroEmoji: string;
  status: "Aktiv" | "Klar" | "Kommende";
  formater: FormatKind[];
}

export const CAMPAIGNS: Campaign[] = [
  { id: "c-sommer-smartlock", tema: "sommer-sikring", titel: "Smid nøglerne væk", hovedbudskab: "Nu kan du smide nøglerne væk til dit sommerhus", underbudskab: "Smart Lock fra Carl Ras Partner. Installeret af din lokale låsesmed på under en time.", cta: "Book gratis hjemmebesøg", heroEmoji: "🔑", status: "Aktiv", formater: ["print-flyer", "print-poster", "print-magasin", "digital-facebook", "digital-instagram", "digital-google"] },
  { id: "c-sommer-alarm", tema: "sommer-sikring", titel: "Sov roligt — også om vinteren", hovedbudskab: "Alarm med direkte besked til din telefon", underbudskab: "Din lokale specialist sikrer sommerhuset hele året. Carl Ras Partner.", cta: "Ring og hør prisen", heroEmoji: "🛎️", status: "Aktiv", formater: ["print-flyer", "print-poster", "digital-facebook", "digital-email", "digital-google"] },
  { id: "c-sommer-pakke", tema: "sommer-sikring", titel: "Sommerhuspakken 2026", hovedbudskab: "Komplet sikring til sommerhuset — én pris", underbudskab: "Lås, alarm, dørtelefon. Installeret af din lokale Carl Ras Partner.", cta: "Få et samlet tilbud", heroEmoji: "📦", status: "Klar", formater: ["print-flyer", "print-poster", "print-bilstreamer", "digital-facebook", "digital-instagram"] },
  { id: "c-vinter-tagrende", tema: "vinter-byg", titel: "Inden frosten tager fat", hovedbudskab: "Tagrender renset og isolering tjekket inden november", underbudskab: "Din lokale Carl Ras Partner kommer forbi. Helst inden uge 42.", cta: "Book vinter-tjek", heroEmoji: "❄️", status: "Kommende", formater: ["print-flyer", "print-magasin", "digital-facebook", "digital-email"] },
  { id: "c-vinter-frostsikring", tema: "vinter-byg", titel: "Hold vandet i rørene", hovedbudskab: "Frostsikring og vinterlukning", underbudskab: "Carl Ras Partner. VVS-uddannet. Lokal.", cta: "Bestil vinterlukning", heroEmoji: "🧊", status: "Kommende", formater: ["print-flyer", "digital-facebook", "digital-google"] },
  { id: "c-indbrud-hojsaeson", tema: "indbrud-efterar", titel: "Når mørket falder på", hovedbudskab: "Forebyg indbrud inden højsæsonen", underbudskab: "Lokal specialist. Gratis hjemmebesøg. Carl Ras Partner.", cta: "Book sikkerhedstjek", heroEmoji: "🌒", status: "Kommende", formater: ["print-flyer", "print-poster", "digital-facebook", "digital-instagram", "digital-google"] },
];

/* ─────────────────────────── Certifications ─────────────────────────── */
export interface Certification {
  id: string;
  titel: string;
  udsteder: string;
  beskrivelse: string;
  niveau: "Niveau 1" | "Niveau 2" | "Niveau 3" | "Specialist";
  moduler: number;
  varighed: string;
  tema?: ThemeId;
  ikon: string;
}

export const CERTS_HELD: { cert: Certification; opnået: string; gyldigTil: string }[] = [
  {
    cert: { id: "cert-cr-sikring-1", titel: "Carl Ras Sikring · Niveau 1", udsteder: "Carl Ras Sikring", beskrivelse: "Grundkursus i fysisk og elektronisk sikring. Sortiment, salgsargumenter, basiscertificering.", niveau: "Niveau 1", moduler: 6, varighed: "12 timer", tema: "sommer-sikring", ikon: "🛡️" },
    opnået: "12. april 2026", gyldigTil: "12. april 2028",
  },
  {
    cert: { id: "cert-abus-smart", titel: "ABUS Smart Lock Certified", udsteder: "ABUS Pfaffenhain", beskrivelse: "Officiel installations- og servicecertificering på ABUS' Smart Lock-portefølje.", niveau: "Specialist", moduler: 4, varighed: "8 timer", tema: "sommer-sikring", ikon: "🔐" },
    opnået: "28. april 2026", gyldigTil: "28. april 2027",
  },
];

export const CERTS_AVAILABLE: { cert: Certification; modulerFærdige: number }[] = [
  { cert: { id: "cert-cr-sikring-2", titel: "Carl Ras Sikring · Niveau 2", udsteder: "Carl Ras Sikring", beskrivelse: "Avanceret sikring: adgangskontrol til erhverv, integration med smart home, salgsteknik mod udlejnings-segmentet.", niveau: "Niveau 2", moduler: 8, varighed: "18 timer", tema: "sommer-sikring", ikon: "🛡️" }, modulerFærdige: 3 },
  { cert: { id: "cert-yale", titel: "Yale Doorman Pro", udsteder: "ASSA ABLOY", beskrivelse: "Yale Doorman L3 — installation, integration med boligforeninger, fejlfinding.", niveau: "Specialist", moduler: 5, varighed: "10 timer", tema: "sommer-sikring", ikon: "🚪" }, modulerFærdige: 0 },
  { cert: { id: "cert-vinter-1", titel: "Vinterklargøring · Niveau 1", udsteder: "Carl Ras Byg", beskrivelse: "Næste tema. Tagrender, frostsikring, vinterlukning. Grundpakken til sommerhusmarkedet.", niveau: "Niveau 1", moduler: 6, varighed: "12 timer", tema: "vinter-byg", ikon: "🍂" }, modulerFærdige: 0 },
  { cert: { id: "cert-cr-byg-1", titel: "Indbrudssikring · Niveau 1", udsteder: "Carl Ras Sikring", beskrivelse: "Næste sæsons fokus: parcelhus-segmentet om efteråret. Klargøres til lancering Q3.", niveau: "Niveau 1", moduler: 6, varighed: "12 timer", tema: "indbrud-efterar", ikon: "🔒" }, modulerFærdige: 0 },
];

/* ─────────────────────────── Specialists & chat ─────────────────────────── */
export interface Specialist {
  id: string;
  navn: string;
  rolle: string;
  bu: string;
  initialer: string;
  bg: string;
  online: boolean;
  responstid: string;
}

export const SPECIALISTS: Specialist[] = [
  { id: "s-jens", navn: "Jens Pedersen", rolle: "Senior Specialist", bu: "Sikring", initialer: "JP", bg: "#1158A3", online: true, responstid: "≈ 12 min" },
  { id: "s-tina", navn: "Tina Holm", rolle: "Træningschef", bu: "Sikring", initialer: "TH", bg: "#002D59", online: true, responstid: "≈ 30 min" },
  { id: "s-morten", navn: "Morten Bach", rolle: "Specialist", bu: "Byg", initialer: "MB", bg: "#5B7F2C", online: false, responstid: "Næste dag" },
  { id: "s-marie", navn: "Marie Lindgren", rolle: "Specialist", bu: "Sikring", initialer: "ML", bg: "#F49100", online: true, responstid: "≈ 8 min" },
  { id: "s-christian", navn: "Christian Funch", rolle: "Specialist", bu: "Sikring · Bornholm", initialer: "CF", bg: "#0C447C", online: false, responstid: "I morgen" },
  { id: "s-henrik", navn: "Henrik Birk", rolle: "Specialist", bu: "Engros Beslag", initialer: "HB", bg: "#A88A6E", online: true, responstid: "≈ 20 min" },
];

export interface ChatMessage { from: "partner" | "specialist"; text: string; tid: string; }
export interface ChatThread { specialistId: string; messages: ChatMessage[]; }

export const CHAT_THREADS: Record<string, ChatThread> = {
  "s-jens": {
    specialistId: "s-jens",
    messages: [
      { from: "specialist", text: "Hej Mads — så du den nye STROXX Smart Cylinder vi har på lager nu? Den er hurtigere at installere end ABUS-versionen.", tid: "11:42" },
      { from: "partner", text: "Ja, så jeg fik prøven i går. Kan vi få det op på pakkeprisen til Sommerhuspakke 2026?", tid: "11:58" },
      { from: "specialist", text: "Den ligger i tilbudsmotoren fra mandag — du kan tilbyde den som opgradering for +800,-. Jeg sender prisliste.", tid: "12:03" },
    ],
  },
  "s-marie": {
    specialistId: "s-marie",
    messages: [
      { from: "partner", text: "Marie — er der en kundecase på Yale Doorman i sommerhus jeg kan vise en kunde?", tid: "i går · 14:18" },
      { from: "specialist", text: "Ja, der er en god en fra Tisvilde — jeg sender PDF'en til dig nu. Kan også arrangere video-introduktion til kunden hvis du vil.", tid: "i går · 14:22" },
    ],
  },
};

/* ─────────────────────────── AI-style scripted scenarios ───────────────────────────
   These power the /partner/specialister chat. They feel AI-driven but are fully
   deterministic — branching state machine. Each step can render bot text bubbles,
   product cards, and quick-reply chips. Chips advance the scenario by id.
   ──────────────────────────────────────────────────────────────────────────────── */

export type ScenarioChipAction =
  | { kind: "next"; next: string }
  | { kind: "add-all"; next: string }       // adds current step's products to basket, advances
  | { kind: "send-tilbud"; next: string }   // opens tilbud modal, advances
  | { kind: "restart" };                    // resets scenario

export interface ScenarioChip {
  label: string;
  action: ScenarioChipAction;
}

export interface ScenarioStep {
  /** Bot messages — array of bubbles. Each renders with typing delay. */
  bot: string[];
  /** Product ids to render as cards in chat after bot messages */
  products?: string[];
  /** Quick-reply chips below the bubble */
  chips?: ScenarioChip[];
}

export interface Scenario {
  id: string;
  /** Label on the starter chip above the input */
  starterLabel: string;
  /** What gets shown as a user message when starter chip is clicked */
  userText: string;
  /** Specialist who should be active for this scenario */
  specialistId: string;
  /** The starting step */
  firstStep: string;
  steps: Record<string, ScenarioStep>;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "sommerhus-25",
    starterLabel: "Pakke til 25 sommerhuse",
    userText: "Jeg har 25 sommerhuse i Hornbæk-området som skal sikres. Hvad anbefaler du?",
    specialistId: "s-jens",
    firstStep: "ask-segment",
    steps: {
      "ask-segment": {
        bot: [
          "Spændende — 25 enheder er en god volumen at lave en pakke på.",
          "Først: er det udlejningssommerhuse, privatejede, eller en blanding? Det styrer om vi skal vælge cylinder med ekstern kode-administration.",
        ],
        chips: [
          { label: "Udlejning", action: { kind: "next", next: "rec-udlejning" } },
          { label: "Private", action: { kind: "next", next: "rec-private" } },
          { label: "Blanding", action: { kind: "next", next: "rec-udlejning" } },
        ],
      },
      "rec-udlejning": {
        bot: [
          "Så er det STROXX Smart Lock ST-2 + Gateway G2 vi skal kigge på.",
          "Udlejer styrer koderne fra app'en — ny kode pr. uge eller pr. booking via Airbnb-integration. Plus Housegard Pebble røgalarm som er lovpligtig på sommerhuse.",
          "Her er den anbefalede pakke pr. enhed:",
        ],
        products: ["40013215", "40013955", "55011840"],
        chips: [
          { label: "Hvad koster det totalt?", action: { kind: "next", next: "pricing" } },
          { label: "Vis mig en kundecase", action: { kind: "next", next: "case-tisvilde" } },
          { label: "Book hjemmebesøg", action: { kind: "next", next: "book-besøg" } },
        ],
      },
      "rec-private": {
        bot: [
          "For privatejede sommerhuse er det typisk Smart Lock + røgalarm — uden Gateway, fordi ejer selv er der.",
          "Anbefaling pr. enhed:",
        ],
        products: ["40013215", "55011840"],
        chips: [
          { label: "Hvad koster det totalt?", action: { kind: "next", next: "pricing-private" } },
          { label: "Skift til udlejnings-version", action: { kind: "next", next: "rec-udlejning" } },
        ],
      },
      pricing: {
        bot: [
          "Pr. enhed ≈ 4.924 kr ex. moms. For 25 enheder = 123.100 kr.",
          "Med din Sølv-margin på ≈18% har du ~22.158 kr i partnerprovision på den her ordre. Hvis du opgraderer til Guld inden årsskiftet er det ≈24% = ~29.500 kr.",
          "Vil du lægge hele pakken i kurven (×25 af hver) eller sende et færdigt tilbud til kunden?",
        ],
        chips: [
          { label: "Læg alt i kurv (×25)", action: { kind: "add-all", next: "after-basket" } },
          { label: "Send tilbud til kunde", action: { kind: "send-tilbud", next: "after-tilbud" } },
          { label: "Først — vis kundecase", action: { kind: "next", next: "case-tisvilde" } },
        ],
      },
      "pricing-private": {
        bot: [
          "Pr. enhed ≈ 3.951 kr ex. moms. For 25 enheder = 98.775 kr.",
          "Din Sølv-margin på den her er ~17.780 kr.",
        ],
        chips: [
          { label: "Læg alt i kurv (×25)", action: { kind: "add-all", next: "after-basket" } },
          { label: "Send tilbud til kunde", action: { kind: "send-tilbud", next: "after-tilbud" } },
        ],
      },
      "case-tisvilde": {
        bot: [
          "Carl Ras-partner Tisvilde Låseteknik leverede 18 enheder i april 2026 til en udlejningsportefølje.",
          "Setup: STROXX + Gateway + ugentlig kode-rotation via Airbnb-kalender. 0 servicebesøg på 6 måneder. Udlejer sparer ~4 timer/uge.",
          "Jeg sender PDF-casen til din email — den er lavet i Carl Ras-skabelon så du kan vise den til kunden direkte.",
        ],
        chips: [
          { label: "Tilbage til prisen", action: { kind: "next", next: "pricing" } },
          { label: "Læg alt i kurv (×25)", action: { kind: "add-all", next: "after-basket" } },
        ],
      },
      "book-besøg": {
        bot: [
          "Jeg åbner en kalender-prompt så I kan finde en tid. Hvis kunden vil have mig med — bare ring 8h før, så kører jeg op fra Glostrup.",
          "Indtil da: jeg har sendt din salgsslide-pakke (4 slides + prisliste) til din email.",
        ],
        chips: [
          { label: "Læg pakken i kurv (×25)", action: { kind: "add-all", next: "after-basket" } },
          { label: "Send tilbud til kunde", action: { kind: "send-tilbud", next: "after-tilbud" } },
        ],
      },
      "after-basket": {
        bot: [
          "Lagt i kurven. Du kan tjekke ud direkte på carl-ras.dk eller fortsætte herinde.",
          "Tip: hvis kunden vil have det leveret + installeret som én pakkepris, har vi en service-add-on på 1.450 kr pr. enhed via Carl Ras Sikring-partneren i Helsingør.",
        ],
        chips: [
          { label: "Tilføj installation (×25)", action: { kind: "next", next: "install-added" } },
          { label: "Send tilbud til kunde nu", action: { kind: "send-tilbud", next: "after-tilbud" } },
          { label: "Starte forfra", action: { kind: "restart" } },
        ],
      },
      "install-added": {
        bot: [
          "Notér det — installation ×25 lægges på tilbuddet (36.250 kr i tillægsservice, du tager 12% provision = 4.350 kr).",
        ],
        chips: [
          { label: "Send tilbud til kunde", action: { kind: "send-tilbud", next: "after-tilbud" } },
          { label: "Starte forfra", action: { kind: "restart" } },
        ],
      },
      "after-tilbud": {
        bot: [
          "Tilbud genereret med dit logo, kontaktinfo, pakkepris og opsætnings-spec. Sender til kunden + cc dig.",
          "Hvis kunden tøver, ring mig — jeg kan hoppe på et 15-min teknisk Q&A-kald.",
        ],
        chips: [
          { label: "Starte forfra", action: { kind: "restart" } },
        ],
      },
    },
  },

  {
    id: "smart-lock-1door",
    starterLabel: "Smart Lock til én dør",
    userText: "Kunde vil have Smart Lock til hoveddøren hjemme. Hvilket anbefaler du?",
    specialistId: "s-jens",
    firstStep: "rec",
    steps: {
      rec: {
        bot: [
          "STROXX ST-2 i 90% af tilfældene. Hurtigere installation end ABUS Smart Lock Pro (≈12 min vs 35 min), full battery-management fra app'en, og bedre support på dansk.",
          "Hvis kunden vil styre koderne ude fra hus (ferie, håndværker, rengøring) → tilføj Gateway G2.",
        ],
        products: ["40013215", "40013955"],
        chips: [
          { label: "Hvorfor ikke ABUS?", action: { kind: "next", next: "abus" } },
          { label: "Hvad koster det?", action: { kind: "next", next: "pris" } },
          { label: "Læg i kurv", action: { kind: "add-all", next: "basket" } },
        ],
      },
      abus: {
        bot: [
          "ABUS er solid, men ST-2 vinder på 3 ting: 1) installation, 2) batteriet (12 mdr vs 6 mdr i typisk brug), og 3) prisen pr. enhed (~1.200 kr mindre i indkøb).",
          "ABUS Smart Lock Pro vinder hvis kunden allerede har ABUS-økosystem (cylindre, hængelåse etc).",
        ],
        chips: [
          { label: "OK — vis prisen", action: { kind: "next", next: "pris" } },
          { label: "Læg ST-2 i kurv", action: { kind: "add-all", next: "basket" } },
        ],
      },
      pris: {
        bot: [
          "ST-2 alene: 3.737,50 kr ex. moms · din margin ≈673 kr.",
          "ST-2 + Gateway G2: 4.711,25 kr · margin ≈848 kr.",
          "Til sammenligning: ABUS Pro er 4.890 kr alene, så ST-2 + Gateway koster mindre OG dækker mere.",
        ],
        chips: [
          { label: "Læg pakken i kurv", action: { kind: "add-all", next: "basket" } },
          { label: "Læg kun ST-2 i kurv", action: { kind: "next", next: "single-basket" } },
        ],
      },
      "single-basket": {
        bot: ["OK — kun ST-2 lagt i kurven."],
        chips: [
          { label: "Starte forfra", action: { kind: "restart" } },
        ],
      },
      basket: {
        bot: [
          "Begge produkter i kurven. Hvis kunden booker installation samtidig kan du tilbyde det som flat-fee 1.450 kr (carl-ras Sikring-rate).",
        ],
        chips: [
          { label: "Starte forfra", action: { kind: "restart" } },
        ],
      },
    },
  },

  {
    id: "hot-vestkysten",
    starterLabel: "Hvad sælger bedst lige nu?",
    userText: "Hvad sælger bedst på min region (Nordsjælland) lige nu?",
    specialistId: "s-jens",
    firstStep: "top",
    steps: {
      top: {
        bot: [
          "Top 3 på Nordsjælland i Q1 2026 (på tværs af alle partnere):",
        ],
        products: ["40013955", "40013215", "55011841"],
        chips: [
          { label: "Hvorfor sælger Gateway?", action: { kind: "next", next: "why-gateway" } },
          { label: "Send mig prislisten", action: { kind: "next", next: "prisliste" } },
        ],
      },
      "why-gateway": {
        bot: [
          "Gateway G2 toppede i Q1 fordi Q4 2025 var Smart Lock-tungt — kunderne der købte cylindre i jul vil nu have remote-kode-styring.",
          "Up-sell pattern: hvis du har solgt en ST-2 inden for de sidste 6 måneder, er der ≈35% sandsynlighed for at samme kunde også vil tage Gateway hvis du nævner det.",
        ],
        chips: [
          { label: "Send mig en up-sell-liste", action: { kind: "next", next: "upsell-liste" } },
          { label: "Starte forfra", action: { kind: "restart" } },
        ],
      },
      prisliste: {
        bot: [
          "Sendt til din email — opdateret pr. 1. maj 2026 med dine Sølv-priser indregnet.",
        ],
        chips: [
          { label: "Starte forfra", action: { kind: "restart" } },
        ],
      },
      "upsell-liste": {
        bot: [
          "Sendt — 14 kunder fra dine sidste 6 mdr's ST-2-salg uden Gateway. Hver er ≈970 kr ekstra omsætning hvis de konverterer.",
        ],
        chips: [
          { label: "Starte forfra", action: { kind: "restart" } },
        ],
      },
    },
  },
];


export interface ForumReply {
  forfatter: string;
  firma: string;
  region: Region;
  tid: string;
  body: string;
  likes: number;
  reactions?: { emoji: string; count: number }[];
}

export interface ForumThread {
  id: string;
  titel: string;
  forfatter: string;
  forfatterFirma: string;
  forfatterRegion: Region;
  dato: string;
  kategori: "Tip" | "Spørgsmål" | "Markedsføring" | "Værktøj" | "Snak";
  body: string;
  svar: number;
  likes: number;
  seneste: string;
  replies?: ForumReply[];
}

export const FORUM_THREADS: ForumThread[] = [
  { id: "f-001", titel: "Hvordan håndterer I gæstekoder til Smart Lock i højsæsonen?", forfatter: "Lars Kofoed", forfatterFirma: "Bornholm Sikring", forfatterRegion: "Bornholm", dato: "for 2 timer", kategori: "Spørgsmål", body: "Vi får flere forespørgsler fra udlejere som vil have ugentlige koder. Hvordan har I sat det op uden at det bliver et helvede at administrere?", svar: 14, likes: 22, seneste: "Søren Vinther · for 12 min",
    replies: [
      { forfatter: "Søren Vinther", firma: "Blokhus Byg & Bolig", region: "Vestkysten", tid: "for 1 t", body: "Vi bruger Gateway G2 + en uge-kode-rotation gennem partner-portalen. Udlejerne får en ny kode hver mandag morgen via SMS. Tager 2 minutter at sætte op pr. hus.", likes: 8, reactions: [{ emoji: "🔥", count: 3 }, { emoji: "👍", count: 5 }] },
      { forfatter: "Birgitte Holm", firma: "Marielyst Låseteknik", region: "Lolland-Falster", tid: "for 45 min", body: "+1 til Søren. Vi har koblet det op til Airbnb-kalenderen via Zapier, så koden ændres automatisk når der kommer ny booking. Spar én time om ugen pr. udlejnings-hus.", likes: 11 },
      { forfatter: "Erik Brinch", firma: "Fanø Lås & Sikring", region: "Vestkysten", tid: "for 30 min", body: "Smart. Vi har bare hardcodet 'sommerkode' og 'vinterkode' for nu — men det her ser bedre ud. Linker du Zapier-templaten?", likes: 2 },
      { forfatter: "Søren Vinther", firma: "Blokhus Byg & Bolig", region: "Vestkysten", tid: "for 12 min", body: "Sender den i DM 👍 Også til andre der vil have den.", likes: 4, reactions: [{ emoji: "🙏", count: 2 }] },
    ]
  },
  { id: "f-002", titel: "Tip: Lokalavis-annoncer giver stadig leads", forfatter: "Søren Vinther", forfatterFirma: "Blokhus Byg & Bolig", forfatterRegion: "Vestkysten", dato: "i går", kategori: "Markedsføring", body: "Vi har kørt Carl Ras-flyeren i Lokalavisen Vendsyssel hver uge siden marts — 11 leads, 4 jobs. Bedre ROI end Facebook.", svar: 8, likes: 31, seneste: "Bent Madsen · i går" },
  { id: "f-003", titel: "Bilstreameren — hvor får I den printet bedst?", forfatter: "Thomas Riis", forfatterFirma: "Vejers Strand VVS", forfatterRegion: "Vestkysten", dato: "for 2 dage", kategori: "Værktøj", body: "Carl Ras trykker den i Herlev men leveringstid er 5 dage. Findes der lokale tryk vi kan bruge med samme filer?", svar: 6, likes: 9, seneste: "Henrik Larsen · for 18 timer" },
  { id: "f-004", titel: "Erfaringer med STROXX Smart Cylinder?", forfatter: "Erik Brinch", forfatterFirma: "Fanø Lås & Sikring", forfatterRegion: "Vestkysten", dato: "for 3 dage", kategori: "Spørgsmål", body: "Jeg har lige fået testeksemplaret. Hvordan klarer den sig vs. ABUS i salt-luft (vi har en del af det her)?", svar: 11, likes: 14, seneste: "Lars Kofoed · for 1 dag" },
  { id: "f-005", titel: "Faglig Fredag i Hornbæk — hvem kommer?", forfatter: "Mads Sørensen", forfatterFirma: "Hornbæk Låseservice", forfatterRegion: "Nordsjælland", dato: "for 4 dage", kategori: "Snak", body: "Jeg overvejer at arrangere uformel snak hos os fredag d. 19/6 efter den officielle. Bornholm-folkene må gerne bo over.", svar: 7, likes: 18, seneste: "Birgitte Holm · for 2 dage" },
  { id: "f-006", titel: "Tip: Smart-lock som krydsalg på service-besøg", forfatter: "Mette Thygesen", forfatterFirma: "Ebeltoft Ejendomsservice", forfatterRegion: "Østjylland", dato: "for 5 dage", kategori: "Tip", body: "Vi er ejendomsservice, men 3 ud af 10 kunder har spurgt om Smart Lock når vi nævnte det. Inviterer låsesmed-partner med på besøg som henviser → vi får 5% finder's fee. Vinder begge.", svar: 16, likes: 42, seneste: "Henrik Larsen · for 1 dag" },
];

/* ─────────────────────────── News / Blog ─────────────────────────── */
export interface BlogPost {
  id: string;
  titel: string;
  excerpt: string;
  forfatter: string;
  forfatterRolle: string;
  dato: string;
  kategori: "Tema-update" | "Markedsindsigt" | "Værktøj" | "Case" | "Strategi";
  læsetid: string;
  tema?: ThemeId;
  hero: string;
}

export const BLOG_POSTS: BlogPost[] = [
  { id: "b-001", titel: "Vinterklargøring kommer Q4 — her er hvad I skal vide", excerpt: "Næste tema i årshjulet er klar i konceptform. Tagrender, frostsikring og vinterlukning bliver kufferten for tømrer- og VVS-partnerne. Sølv- og Guld-partnere får første adgang fra september.", forfatter: "Morten Bach", forfatterRolle: "Specialist · Byg", dato: "23. maj 2026", kategori: "Tema-update", læsetid: "4 min", tema: "vinter-byg", hero: "🍂" },
  { id: "b-002", titel: "Sådan får du flest leads fra Partnerfinder", excerpt: "Vi har analyseret hvilke partnerprofiler der konverterer flest opslag til kontakt. Tre ting flytter nålen markant — og to ting ingen tror på.", forfatter: "Marie Lindgren", forfatterRolle: "Specialist · Sikring", dato: "18. maj 2026", kategori: "Markedsindsigt", læsetid: "6 min", hero: "📈" },
  { id: "b-003", titel: "Case: Hornbæk Låseservice gik fra 4 til 12 leads om måneden", excerpt: "Mads Sørensen er Sølv-partner siden april. Han bruger Materialer-pakken konsekvent og er aktiv i forummet. Sådan ser hans hverdag ud.", forfatter: "Jens Pedersen", forfatterRolle: "Senior Specialist · Sikring", dato: "15. maj 2026", kategori: "Case", læsetid: "5 min", tema: "sommer-sikring", hero: "🏆" },
  { id: "b-004", titel: "STROXX Smart Cylinder — vores tests", excerpt: "Vi har kørt en 60-dages test på den nye STROXX-cylinder i tre forskellige sommerhuse. Saltluft, vintertemperatur, og 200 kode-skift. Her er hvad vi fandt.", forfatter: "Jens Pedersen", forfatterRolle: "Senior Specialist · Sikring", dato: "12. maj 2026", kategori: "Værktøj", læsetid: "7 min", tema: "sommer-sikring", hero: "🔧" },
  { id: "b-005", titel: "Hvorfor lokal markedsføring slår national markedsføring 4 til 1", excerpt: "Vi har sammenlignet 8 ugers leads fra Carl Ras' nationale Facebook-kampagne med 8 ugers leads fra partnernes lokale flyers. Resultatet overrasker.", forfatter: "Peter Bak Torjusen", forfatterRolle: "Direktør · Digital & Marketing", dato: "8. maj 2026", kategori: "Strategi", læsetid: "5 min", hero: "📊" },
  { id: "b-006", titel: "Niveau 2-certificering: hvad får du adgang til?", excerpt: "Sølv-partnere kan nu booke Niveau 2-certificeringen. Her er produktlisten, marginerne og hvad næste step er for dig.", forfatter: "Tina Holm", forfatterRolle: "Træningschef · Sikring", dato: "5. maj 2026", kategori: "Værktøj", læsetid: "4 min", tema: "sommer-sikring", hero: "🎓" },
];

/* ─────────────────────────── Partner performance series ─────────────────────────── */
export const PARTNER_PERFORMANCE = {
  leadsByWeek:       [3, 2, 4, 5, 3, 6, 4, 7],
  conversionByWeek:  [38, 42, 45, 41, 48, 50, 49, 51],
  pointsByWeek:      [820, 950, 1080, 1180, 1240, 1310, 1380, 1420],
  weekLabels:        ["U17","U18","U19","U20","U21","U22","U23","U24"],

  formatsThisMonth: [
    { label: "Flyer A5",         value: 18, color: "#1158A3" },
    { label: "Facebook-opslag",  value: 14, color: "#4D87C2" },
    { label: "Magasin-annonce",  value: 9,  color: "#7CA5D2" },
    { label: "Bilstreamer",      value: 4,  color: "#A8C2DF" },
    { label: "Email-signatur",   value: 2,  color: "#C7D5E5" },
  ],

  activity: [
    { tid: "for 18 min",   text: "Familien Birkholm sendte en lead-forespørgsel",       icon: "lead",     color: "#F49100" },
    { tid: "for 2 t",      text: "Hentet flyer for 'Smid nøglerne væk'",                icon: "download", color: "#1158A3" },
    { tid: "for 4 t",      text: "Jens Pedersen besvarede din chat om STROXX-cylindre", icon: "chat",     color: "#5B7F2C" },
    { tid: "i går",        text: "Vundet sag · Birte Klausen (Smart lock)",             icon: "won",      color: "#2D4A0F" },
    { tid: "2 dage siden", text: "Tilmeldt Faglig Fredag 5. juni",                      icon: "event",    color: "#6E6E73" },
  ],
};

/* ─────────────────────────── Admin: aggregate stats ─────────────────────────── */
export const ADMIN_STATS = {
  aktivePartnere: 47,
  partnereByTier: { Bronze: 18, "Sølv": 21, Guld: 8 },
  partnereByRegion: {
    Nordsjælland: 11,
    Vestkysten: 9,
    Bornholm: 5,
    "Lolland-Falster": 4,
    Hovedstaden: 7,
    Fyn: 3,
    Østjylland: 5,
    Nordjylland: 3,
  } as Record<Region, number>,
  leadsDenneUge: 38,
  leadsForrigeUge: 29,
  leadsKonverteret: 0.42,
  omsætningDenneMåned: 487000,   // DKK
  omsætningForrigeMåned: 412000,
  aktiveTema: "sommer-sikring" as ThemeId,
};

/* ─────────────────────────── Partner sales analytics (admin profile) ─────────────────────────── */
export interface PartnerSales {
  // YoY rollups
  omsætning12mo: number;
  omsætningYoY: number;        // +/- percent
  sagerYTD: number;
  sagerYoY: number;
  rabatTotalDKK: number;       // total discount granted, this year
  rabatPct: number;            // effective discount %
  kontaktOmkostningPerSag: number;  // cost-per-sale (visits + delivery + support)
  npsScore: number;            // -100 to +100
  npsRespondenter: number;
  betalingsdageGns: number;    // average days-to-pay
  // Monthly series (last 12 months, oldest first)
  monthlyOmsætning: number[];
  monthlyLabels: string[];
  monthlySager: number[];
  // Category breakdown of spend
  kategoriSplit: { label: string; value: number; color: string }[];
  // Insights — what we've learned
  insights: { title: string; body: string; emoji: string }[];
  // Activity log
  activity: { tid: string; type: "ordre" | "lead" | "kursus" | "kontakt" | "tier"; text: string }[];
  // Predicted next purchase (used by "Send forudsigt-tilbud")
  predictedOffer: {
    productIds: string[];        // ids that exist in PRODUCTS
    reason: string;              // 1-line explanation
    estimatedValue: string;      // pretty kr
    confidence: number;          // 0–100
  };
}

const DA_MONTHS = ["Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "Maj"];

/** Generate plausible sales data for a partner based on tier + faggruppe. */
function buildPartnerSales(tier: Tier, faggruppe: Faggruppe, seed: number): PartnerSales {
  // Tier-driven base figures
  const tierMult = tier === "Guld" ? 2.4 : tier === "Sølv" ? 1.0 : 0.42;
  const baseAnnual = 120000 * tierMult;
  const omsætning12mo = Math.round(baseAnnual * (0.85 + ((seed % 30) / 100)));
  const omsætningYoY = Math.round(((seed * 13) % 28) - 4);  // -4..+23
  const sagerYTD = Math.round((tier === "Guld" ? 180 : tier === "Sølv" ? 95 : 28) * (0.85 + ((seed % 20) / 100)));
  const sagerYoY = Math.round(((seed * 17) % 22) - 2);
  const rabatPct = +(tier === "Guld" ? 14 : tier === "Sølv" ? 10 : 5).toFixed(0);
  const rabatTotalDKK = Math.round(omsætning12mo * (rabatPct / 100));
  const kontaktOmkostningPerSag = tier === "Guld" ? 145 : tier === "Sølv" ? 220 : 310;
  const npsScore = tier === "Guld" ? 72 + (seed % 18) : tier === "Sølv" ? 48 + (seed % 22) : 22 + (seed % 28);
  const betalingsdageGns = tier === "Guld" ? 14 + (seed % 6) : tier === "Sølv" ? 21 + (seed % 8) : 28 + (seed % 12);

  // Monthly omsætning — slight upward trend, with seasonal wobble
  const monthlyOmsætning = DA_MONTHS.map((_, i) => {
    const base = baseAnnual / 12;
    const seasonal = Math.sin((i + (seed % 6)) / 12 * Math.PI * 2) * 0.18;
    const trend = i * 0.012;
    const noise = ((seed * (i + 1)) % 17) / 100 - 0.08;
    return Math.round(base * (1 + seasonal + trend + noise));
  });
  const monthlySager = monthlyOmsætning.map((v) => Math.max(1, Math.round(v / 950)));

  // Category split by faggruppe
  const split = (() => {
    switch (faggruppe) {
      case "Låsesmed":
        return [
          { label: "Smart Lock", value: 38 + (seed % 8), color: "#1158A3" },
          { label: "Adgangskontrol", value: 22 + (seed % 6), color: "#4D87C2" },
          { label: "Alarm & sensor", value: 18 + (seed % 5), color: "#7CA5D2" },
          { label: "Beslag & cylinder", value: 14, color: "#A8C2DF" },
          { label: "Værktøj", value: 8, color: "#C7D5E5" },
        ];
      case "Tømrer":
        return [
          { label: "Værktøj", value: 32, color: "#5B7F2C" },
          { label: "Befæstigelse", value: 26, color: "#7AA13D" },
          { label: "Beslag", value: 18, color: "#A0BE71" },
          { label: "Arbejdstøj", value: 14, color: "#C2D6A0" },
          { label: "Smart Lock (nyt)", value: 10, color: "#1158A3" },
        ];
      case "VVS":
        return [
          { label: "Vand & frostsikring", value: 35, color: "#0C447C" },
          { label: "Værktøj", value: 24, color: "#4D87C2" },
          { label: "Beslag", value: 16, color: "#7CA5D2" },
          { label: "Alarm", value: 15, color: "#A8C2DF" },
          { label: "Smart Lock", value: 10, color: "#1158A3" },
        ];
      default:
        return [
          { label: "Værktøj", value: 32, color: "#1158A3" },
          { label: "Arbejdstøj", value: 24, color: "#4D87C2" },
          { label: "Sikring", value: 18, color: "#7CA5D2" },
          { label: "Beslag", value: 16, color: "#A8C2DF" },
          { label: "Andet", value: 10, color: "#C7D5E5" },
        ];
    }
  })();

  // Insights vary by tier + faggruppe — meaningful, brand-relevant observations
  const insights = (() => {
    const base = [
      { emoji: "📈", title: "Køber 1.8× smart-lock vs. region-snittet", body: "Stærkt forspring på Smart Lock-segmentet. Oplagt at flytte konsulent-besøg til 1. tirsdag i måneden hvor de typisk bestiller." },
      { emoji: "🕒", title: "Bestiller typisk mandag–tirsdag", body: "73% af ordrer falder i ugens første dage. Marketing-pushes om søndag aften har 2× højere åbningsrate." },
      { emoji: "💸", title: `Effektiv rabat-sats: ${rabatPct}%`, body: tier === "Guld" ? "Tæt på det maksimale for tier. Overvej værdi-add fremfor flere %." : tier === "Sølv" ? "I midten af partner-segmentet. Performer over forventning." : "Lav effektiv rabat — vækstpotentiale via volume." },
    ];
    if (faggruppe === "Låsesmed") base.push({ emoji: "🔓", title: "Aldrig købt vinterklargøring", body: "Klassisk cross-sell mulighed når Q4-temaet lanceres. Smart-lock kunder konverterer godt på frostsikring." });
    return base;
  })();

  const activity = [
    { tid: "i går · 14:22",     type: "ordre" as const,   text: `Ordre #{${(seed * 31).toString(36).slice(0,6)}} · 8.420 kr · Smart Lock ST-2 + Gateway` },
    { tid: "2 dage siden",      type: "lead" as const,    text: "Lead modtaget fra carl-ras.dk — Familien Birkholm, Hornbæk" },
    { tid: "5 dage siden",      type: "kursus" as const,  text: "Færdig: ABUS Smart Lock Certified · score 92%" },
    { tid: "1 uge siden",       type: "kontakt" as const, text: "Konsulent-besøg af Tina H. · 2 timer" },
    { tid: "2 uger siden",      type: "ordre" as const,   text: "Ordre · 14.110 kr · 3× Smart Lock + tilbehør" },
    { tid: "3 uger siden",      type: "tier" as const,    text: tier === "Bronze" ? "Tilmeldt programmet · Bronze" : `Opgraderet til ${tier}-partner` },
  ];

  // Predicted offer based on faggruppe — pick from real PRODUCTS
  const predictedOffer = (() => {
    if (faggruppe === "Låsesmed") {
      return {
        productIds: ["40013955", "40013216", "55011841"],
        reason: "Baseret på køb af 3× Smart Lock ST-2 sort i de sidste 60 dage og 11 leads i pipeline. Mangler typisk gateway + ekstra røgalarmer.",
        estimatedValue: "≈ 8.900 kr",
        confidence: 84,
      };
    }
    if (faggruppe === "Tømrer") {
      return {
        productIds: ["40013215", "55011840"],
        reason: "Vintertema lanceres Q4. Tømrere køber typisk smart-lock som cross-sell efter første sommer-job.",
        estimatedValue: "≈ 4.200 kr",
        confidence: 62,
      };
    }
    return {
      productIds: ["55011840", "55011841", "41008815"],
      reason: "Genbestillings-mønster: køber alarm-produkter hver 4. måned. Tid til ny bestilling om 2 uger.",
      estimatedValue: "≈ 3.100 kr",
      confidence: 71,
    };
  })();

  return {
    omsætning12mo,
    omsætningYoY,
    sagerYTD,
    sagerYoY,
    rabatTotalDKK,
    rabatPct,
    kontaktOmkostningPerSag,
    npsScore,
    npsRespondenter: Math.round(sagerYTD * 0.22),
    betalingsdageGns,
    monthlyOmsætning,
    monthlyLabels: DA_MONTHS,
    monthlySager,
    kategoriSplit: split,
    insights,
    activity,
    predictedOffer,
  };
}

/** Lazy-computed per-partner sales data. */
const SALES_CACHE = new Map<string, PartnerSales>();
export function salesFor(partnerId: string): PartnerSales {
  const cached = SALES_CACHE.get(partnerId);
  if (cached) return cached;
  const p = PARTNERS.find((x) => x.id === partnerId);
  if (!p) {
    return buildPartnerSales("Sølv", "Låsesmed", 7);
  }
  // Stable deterministic seed from partner id
  let seed = 0;
  for (let i = 0; i < partnerId.length; i++) seed = (seed * 31 + partnerId.charCodeAt(i)) >>> 0;
  const data = buildPartnerSales(p.tier, p.faggruppe, seed % 100);
  SALES_CACHE.set(partnerId, data);
  return data;
}

/* ─────────────────────────── Carl Ras products (real PDPs) ─────────────────────────── */
export interface Product {
  id: string;
  brand: string;
  navn: string;
  pris: string;
  url: string;
  kategori: "Smart Lock" | "Adgangskontrol" | "Alarm" | "Brand & røg" | "Tilbehør";
  margin?: string;
  emoji: string;
  image?: string;        // optional /public/products/xxx.jpg path
}

export const PRODUCTS: Product[] = [
  // Smart locks — real product photos
  { id: "40013215", brand: "STROXX", navn: "Smart Lock ST-2 sort XLOCK · skandinavisk lås", pris: "3.737,50 kr", url: "https://www.carl-ras.dk/langskiltesaet-smart-lock-st-2-sort-xlock-t-skandinavisk-las/?product=40013215/40013215", kategori: "Smart Lock", margin: "≈18% partner", emoji: "🔐", image: "/products/stroxx-smart-lock.jpg" },
  { id: "40013216", brand: "STROXX", navn: "Smart Lock ST-2 RS XLOCK · europæisk lås", pris: "3.612,50 kr", url: "https://www.carl-ras.dk/langskiltesaet-smart-lock-st-2-rs-xlock-t-europaeisk-las/?product=40013216/40013216", kategori: "Smart Lock", margin: "≈18% partner", emoji: "🔐", image: "/products/stroxx-smart-lock.jpg" },
  { id: "40013955", brand: "STROXX", navn: "Gateway Smart Lock G2 hvid · XLOCK WIFI",     pris: "973,75 kr",   url: "https://www.carl-ras.dk/gateway-smart-lock-g2-hvid-xlock-wifi/?product=40013955/40013955", kategori: "Adgangskontrol", margin: "≈22% partner", emoji: "📡", image: "/products/stroxx-gateway-g2.jpg" },

  // Alarm / smoke / motion
  { id: "55011840", brand: "Housegard", navn: "Røgalarm Pebble 10 års SA701 · optisk",    pris: "213,75 kr",   url: "https://www.carl-ras.dk/roegalarm-pebble-10ars-sa701-optisk/?product=55011840/55011840", kategori: "Brand & røg", margin: "≈25% partner", emoji: "🛎️", image: "/products/housegard-pebble.jpg" },
  { id: "55011841", brand: "Housegard", navn: "Røgalarm Luma trådløs seriekoblet · 2-pak", pris: "561,25 kr",   url: "https://www.carl-ras.dk/roegalarm-luma-10ars-tradlos-seriekoblet-a-2-stk/?product=55011841/55011841", kategori: "Brand & røg", margin: "≈25% partner", emoji: "🛎️", image: "/products/housegard-pebble.jpg" },
  { id: "41008815", brand: "Dormakaba", navn: "Normalarm Sølv 0-225 mm t/ED100 og ED250", pris: "1.948,75 kr", url: "https://www.carl-ras.dk/normalarm-soelv-0-225-mm-t-ed100-og-ed250-ny/?product=41008815/41008815", kategori: "Alarm", margin: "≈20% partner", emoji: "🚨" },
];

/** Map: lead.behov substring → suggested product ids in order of relevance */
export const PRODUCT_RECS_BY_BEHOV: { match: RegExp; products: string[]; træning?: string }[] = [
  { match: /smart\s*lock|nøgle|kode/i,           products: ["40013215", "40013955", "55011840"], træning: "cert-abus-smart" },
  { match: /alarm.*sensor|udvendig/i,            products: ["55011841", "41008815", "55011840"], træning: "cert-cr-sikring-2" },
  { match: /adgangskontrol|udlej/i,              products: ["40013955", "40013216", "40013215"], træning: "cert-yale" },
  { match: /alarm|sirene/i,                      products: ["55011840", "55011841", "41008815"], træning: "cert-cr-sikring-2" },
  { match: /låse|cylinder|udskift/i,             products: ["40013215", "40013216"],             træning: "cert-cr-sikring-1" },
];

export function productsForBehov(behov: string): { products: Product[]; træningId?: string } {
  for (const r of PRODUCT_RECS_BY_BEHOV) {
    if (r.match.test(behov)) {
      return {
        products: r.products.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean),
        træningId: r.træning,
      };
    }
  }
  return { products: PRODUCTS.slice(0, 3) };
}

/* ─────────────────────────── Event detail content ─────────────────────────── */
export const EVENT_DETAIL: Record<string, { hero: string; agenda: string[]; medbringer: string[]; faktura: string }> = {
  "e-001": {
    hero: "linear-gradient(135deg, #1158A3 0%, #002D59 100%)",
    agenda: [
      "13:00 · Velkomst + STROXX Smart Lock ST-2 hands-on",
      "13:45 · ABUS Smart Lock Pro — installation case-study",
      "14:30 · Pause + netværk",
      "15:00 · Yale Doorman L3 — udlejningssegment",
      "15:30 · Q&A + ny prisliste + medie-pakke gennemgang",
    ],
    medbringer: ["Tablet eller laptop", "Eksisterende kundespørgsmål", "Sultne hjerner"],
    faktura: "Gratis for Sølv- og Guld-partnere. Bronze: 499 kr inkl. forplejning.",
  },
  "e-002": {
    hero: "linear-gradient(135deg, #002D59 0%, #001A33 100%)",
    agenda: [
      "16:00 · Status på Sommerhus-pilot Nordsjælland",
      "16:30 · Q2 leads-flow gennemgang pr. partner",
      "17:00 · Højsæson 2026 — hvad forventer vi",
      "17:30 · Middag på Hotel Marienlyst",
    ],
    medbringer: ["Egen bil eller del transport"],
    faktura: "Gratis. Middag dækket af Carl Ras.",
  },
  "e-003": {
    hero: "linear-gradient(135deg, #1158A3 0%, #5B7F2C 100%)",
    agenda: [
      "09:00 · ABUS Niveau 2 — pensum",
      "10:30 · Hands-on: avanceret cylinder-konfiguration",
      "12:00 · Frokost",
      "13:00 · Salgsteknik mod udlejnings-segment",
      "15:00 · Eksamen + certificering",
    ],
    medbringer: ["ABUS Niveau 1 certifikat", "Eget værktøjssæt"],
    faktura: "Inkluderet i Sølv-partnerskab (3.500 kr værdi)",
  },
};

export function getEventDetail(eventId: string) {
  return EVENT_DETAIL[eventId] ?? {
    hero: "linear-gradient(135deg, #1158A3 0%, #002D59 100%)",
    agenda: ["Detaljeret program kommer snart.", "Tilmeld for at modtage opdateringer."],
    medbringer: ["Tablet eller laptop"],
    faktura: "Gratis for Sølv- og Guld-partnere.",
  };
}
