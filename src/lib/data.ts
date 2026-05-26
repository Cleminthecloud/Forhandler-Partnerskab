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

/* ─────────────────────────── Forum ─────────────────────────── */
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
}

export const FORUM_THREADS: ForumThread[] = [
  { id: "f-001", titel: "Hvordan håndterer I gæstekoder til Smart Lock i højsæsonen?", forfatter: "Lars Kofoed", forfatterFirma: "Bornholm Sikring", forfatterRegion: "Bornholm", dato: "for 2 timer", kategori: "Spørgsmål", body: "Vi får flere forespørgsler fra udlejere som vil have ugentlige koder. Hvordan har I sat det op uden at det bliver et helvede at administrere?", svar: 14, likes: 22, seneste: "Søren Vinther · for 12 min" },
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
