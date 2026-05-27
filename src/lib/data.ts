import { ThemeId } from "./themes";

/* ─────────────────────────── Partner ─────────────────────────── */
export type Tier = "Bronze" | "Sølv" | "Guld";
export type Faggruppe = "Låsesmed" | "Tømrer" | "Elektriker" | "Maler" | "VVS" | "Ejendomsservice" | "Murer";
export type Region = "Nordsjælland" | "Hovedstaden" | "Vestkysten" | "Bornholm" | "Lolland-Falster" | "Fyn" | "Østjylland" | "Nordjylland";

/* Unsplash CDN helper — used for partner cover photos & specialist portraits. */
const UNSPLASH = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

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
  coverImage?: string;   // Unsplash CDN URL — workman / workshop / van photo
  ejerPortrait?: string; // Unsplash CDN URL — portrait of the owner
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
  coverImage: UNSPLASH("1581094794329-c8112a89af12"),
  ejerPortrait: UNSPLASH("1463453091185-61582044d556", 400),
};

export const PARTNERS: PartnerProfile[] = [
  CURRENT_PARTNER,
  { id: "p-bornholm-sikring", firma: "Bornholm Sikring ApS", ejer: "Lars Kofoed", postnr: "3700", by: "Rønne", region: "Bornholm", telefon: "+45 56 95 22 41", email: "info@bornholm-sikring.dk", webadresse: "bornholm-sikring.dk", tier: "Guld", points: 3120, pointsTilNæste: 4000, faggruppe: "Låsesmed", specialer: ["Smart locks", "Alarmer", "Adgangskontrol"], initialer: "BS", logoBg: "#002D59", medlemSiden: "februar 2026", rating: 4.9, antalSager: 287, beskrivelse: "Ø-dækkende sikringsspecialist. Alle bornholmske sommerhusområder.", coverImage: UNSPLASH("1556909114-f6e7ad7d3136"), ejerPortrait: UNSPLASH("1500648767791-00dcc994a43e", 400) },
  { id: "p-tisvilde-toemrer", firma: "Tisvilde Tømrer & Bygning", ejer: "Henrik Larsen", postnr: "3220", by: "Tisvildeleje", region: "Nordsjælland", telefon: "+45 48 70 33 12", email: "henrik@tisvilde-tomrer.dk", webadresse: "tisvilde-tomrer.dk", tier: "Sølv", points: 1820, pointsTilNæste: 2000, faggruppe: "Tømrer", specialer: ["Terrasser", "Vinterklargøring", "Træfacader"], initialer: "TT", logoBg: "#5B7F2C", medlemSiden: "maj 2026", rating: 4.7, antalSager: 98, beskrivelse: "Tre generationers tømrere på Nordkysten.", coverImage: UNSPLASH("1504148455328-c376907d081c"), ejerPortrait: UNSPLASH("1531427186611-ecfd6d936c79", 400) },
  { id: "p-blokhus-byg", firma: "Blokhus Byg & Bolig", ejer: "Søren Vinther", postnr: "9492", by: "Blokhus", region: "Vestkysten", telefon: "+45 98 24 75 10", email: "soren@blokhus-byg.dk", webadresse: "blokhus-byg.dk", tier: "Guld", points: 4280, pointsTilNæste: 5000, faggruppe: "Tømrer", specialer: ["Sommerhusrenovering", "Tagrender", "Vinterklargøring"], initialer: "BB", logoBg: "#F49100", medlemSiden: "marts 2026", rating: 5.0, antalSager: 312, beskrivelse: "Vestjyllands største sommerhusrenoverings-virksomhed.", coverImage: UNSPLASH("1504307651254-35680f356dfd"), ejerPortrait: UNSPLASH("1573496359142-b8d87734a5a2", 400) },
  { id: "p-marielyst-laas", firma: "Marielyst Låseteknik", ejer: "Birgitte Holm", postnr: "4873", by: "Væggerløse", region: "Lolland-Falster", telefon: "+45 54 17 88 22", email: "post@marielyst-laas.dk", webadresse: "marielyst-laas.dk", tier: "Sølv", points: 1690, pointsTilNæste: 2000, faggruppe: "Låsesmed", specialer: ["Smart locks", "Sommerhus"], initialer: "ML", logoBg: "#1158A3", medlemSiden: "april 2026", rating: 4.6, antalSager: 76, beskrivelse: "Marielyst, Bøtø og hele Sydhavsøerne.", coverImage: UNSPLASH("1530124566582-a618bc2615dc"), ejerPortrait: UNSPLASH("1438761681033-6461ffad8d80", 400) },
  { id: "p-skagen-el", firma: "Skagen Eltjeneste", ejer: "Jens Pedersen", postnr: "9990", by: "Skagen", region: "Nordjylland", telefon: "+45 98 44 12 30", email: "kontakt@skagen-el.dk", webadresse: "skagen-el.dk", tier: "Sølv", points: 1340, pointsTilNæste: 2000, faggruppe: "Elektriker", specialer: ["Smart home", "Sikringsanlæg", "Sommerhus"], initialer: "SE", logoBg: "#001A33", medlemSiden: "maj 2026", rating: 4.8, antalSager: 64, beskrivelse: "Skagen og Råbjerg Mile-området.", coverImage: UNSPLASH("1591084728795-1149f32d9866"), ejerPortrait: UNSPLASH("1507003211169-0a1dd7228f2d", 400) },
  { id: "p-allinge-maler", firma: "Allinge Malerservice", ejer: "Karina Holm", postnr: "3770", by: "Allinge", region: "Bornholm", telefon: "+45 56 48 12 04", email: "info@allinge-maler.dk", webadresse: "allinge-maler.dk", tier: "Bronze", points: 380, pointsTilNæste: 500, faggruppe: "Maler", specialer: ["Træfacader", "Olierede terrasser"], initialer: "AM", logoBg: "#A88A6E", medlemSiden: "maj 2026", rating: 4.5, antalSager: 22, beskrivelse: "Bornholms træhuse skal stå skarpt.", coverImage: UNSPLASH("1542359649-31e03cd4d909"), ejerPortrait: UNSPLASH("1580489944761-15a19d654956", 400) },
  { id: "p-vvs-loekken", firma: "Løkken VVS & Sommerhus", ejer: "Bent Madsen", postnr: "9480", by: "Løkken", region: "Vestkysten", telefon: "+45 98 99 22 55", email: "bent@lokken-vvs.dk", webadresse: "lokken-vvs.dk", tier: "Guld", points: 3680, pointsTilNæste: 4000, faggruppe: "VVS", specialer: ["Frostsikring", "Vinterlukning", "Vandinstallation"], initialer: "LV", logoBg: "#0C447C", medlemSiden: "februar 2026", rating: 4.9, antalSager: 248, beskrivelse: "Forebyg vandskader — vintertømning og varmestyring.", coverImage: UNSPLASH("1521737711867-e3b97375f902"), ejerPortrait: UNSPLASH("1599566150163-29194dcaad36", 400) },
  { id: "p-ebeltoft-ejendomsservice", firma: "Ebeltoft Ejendomsservice", ejer: "Mette Thygesen", postnr: "8400", by: "Ebeltoft", region: "Østjylland", telefon: "+45 86 34 22 18", email: "kontakt@ebeltoft-es.dk", webadresse: "ebeltoft-es.dk", tier: "Sølv", points: 1980, pointsTilNæste: 2000, faggruppe: "Ejendomsservice", specialer: ["Sommerhusservice", "Tilsyn", "Klargøring"], initialer: "EE", logoBg: "#5B7F2C", medlemSiden: "marts 2026", rating: 4.8, antalSager: 118, beskrivelse: "Helårsservice af sommerhuse i Mols Bjerge og Ebeltoft Vig.", coverImage: UNSPLASH("1568605114967-8130f3a36994"), ejerPortrait: UNSPLASH("1494790108377-be9c29b29330", 400) },
  { id: "p-fanoe-laas", firma: "Fanø Lås & Sikring", ejer: "Erik Brinch", postnr: "6720", by: "Fanø", region: "Vestkysten", telefon: "+45 75 16 22 88", email: "erik@fano-laas.dk", webadresse: "fano-laas.dk", tier: "Sølv", points: 1520, pointsTilNæste: 2000, faggruppe: "Låsesmed", specialer: ["Smart locks", "Ø-service"], initialer: "FL", logoBg: "#1158A3", medlemSiden: "april 2026", rating: 4.7, antalSager: 54, beskrivelse: "Fanøs eneste autoriserede sikringsspecialist.", coverImage: UNSPLASH("1545167622-3a6ac756afa4"), ejerPortrait: UNSPLASH("1554151228-14d9def656e4", 400) },
  { id: "p-aalbaek-byg", firma: "Ålbæk Byggepartner", ejer: "Niels Andersen", postnr: "9982", by: "Ålbæk", region: "Nordjylland", telefon: "+45 98 48 12 04", email: "niels@aalbaek-byg.dk", webadresse: "aalbaek-byg.dk", tier: "Bronze", points: 280, pointsTilNæste: 500, faggruppe: "Tømrer", specialer: ["Tagrender", "Vinterklargøring"], initialer: "ÅB", logoBg: "#A88A6E", medlemSiden: "maj 2026", rating: 4.4, antalSager: 18, beskrivelse: "Nyt tømrerfirma med fokus på sommerhusbæltet nord for Skagen.", coverImage: UNSPLASH("1559548331-f9cb98001426"), ejerPortrait: UNSPLASH("1607746882042-944635dfe10e", 400) },
  { id: "p-vejers-vvs", firma: "Vejers Strand VVS", ejer: "Thomas Riis", postnr: "6853", by: "Vejers Strand", region: "Vestkysten", telefon: "+45 75 27 88 41", email: "thomas@vejers-vvs.dk", webadresse: "vejers-vvs.dk", tier: "Sølv", points: 1240, pointsTilNæste: 2000, faggruppe: "VVS", specialer: ["Vinterlukning", "Frostsikring"], initialer: "VV", logoBg: "#0C447C", medlemSiden: "april 2026", rating: 4.6, antalSager: 71, beskrivelse: "Holder Vejers' sommerhuse tørre om vinteren.", coverImage: UNSPLASH("1565793298595-6a879b1d9492"), ejerPortrait: UNSPLASH("1503387762-592deb58ef4e", 400) },

  /* ─── Round 2: filling region & faggruppe gaps (Hovedstaden, Fyn, Murer) ─── */
  { id: "p-frederiksberg-laas", firma: "Frederiksberg Lås & Sikring", ejer: "Anders Schou", postnr: "2000", by: "Frederiksberg", region: "Hovedstaden", telefon: "+45 33 25 18 04", email: "anders@frb-laas.dk", webadresse: "frb-laas.dk", tier: "Sølv", points: 1750, pointsTilNæste: 2000, faggruppe: "Låsesmed", specialer: ["Boligforeninger", "Adgangskontrol", "Smart locks"], initialer: "FL", logoBg: "#1158A3", medlemSiden: "februar 2026", rating: 4.8, antalSager: 134, beskrivelse: "Storkøbenhavns låsesmed med fokus på boligforeninger og udlejning.", coverImage: UNSPLASH("1606857521015-7f9fcf423740"), ejerPortrait: UNSPLASH("1531427186611-ecfd6d936c79", 400) },
  { id: "p-hellerup-murer", firma: "Hellerup Murermester ApS", ejer: "Klaus Vinter", postnr: "2900", by: "Hellerup", region: "Hovedstaden", telefon: "+45 39 62 22 14", email: "klaus@hellerup-murer.dk", webadresse: "hellerup-murer.dk", tier: "Guld", points: 4120, pointsTilNæste: 5000, faggruppe: "Murer", specialer: ["Facader", "Restaurering", "Indbrudsforstærkning"], initialer: "HM", logoBg: "#A88A6E", medlemSiden: "januar 2026", rating: 4.9, antalSager: 268, beskrivelse: "Murervirksomhed gennem 4 generationer. Specialiseret i strandvejs-villaer.", coverImage: UNSPLASH("1581094271901-8022df4466f9"), ejerPortrait: UNSPLASH("1500648767791-00dcc994a43e", 400) },
  { id: "p-glostrup-el", firma: "Glostrup El & Smart Home", ejer: "Søren Wessman", postnr: "2600", by: "Glostrup", region: "Hovedstaden", telefon: "+45 43 12 88 50", email: "kontakt@glostrup-el.dk", webadresse: "glostrup-el.dk", tier: "Bronze", points: 420, pointsTilNæste: 500, faggruppe: "Elektriker", specialer: ["Smart home", "Alarmer", "EL-installation"], initialer: "GE", logoBg: "#1158A3", medlemSiden: "maj 2026", rating: 4.4, antalSager: 26, beskrivelse: "Nyt firma — fokus på smart home for parcelhuse i Vestegnen.", coverImage: UNSPLASH("1611348586804-61bf6c080437"), ejerPortrait: UNSPLASH("1463453091185-61582044d556", 400) },
  { id: "p-odense-toemrer", firma: "Odense Tømrermester", ejer: "Mette Lindholm", postnr: "5000", by: "Odense C", region: "Fyn", telefon: "+45 66 14 22 33", email: "mette@odense-toemrer.dk", webadresse: "odense-toemrer.dk", tier: "Sølv", points: 1640, pointsTilNæste: 2000, faggruppe: "Tømrer", specialer: ["Renovering", "Tagarbejde", "Køkkener"], initialer: "OT", logoBg: "#5B7F2C", medlemSiden: "marts 2026", rating: 4.7, antalSager: 92, beskrivelse: "Fyns største tømrer-virksomhed under kvindelig ledelse.", coverImage: UNSPLASH("1531545514256-b1400bc00f31"), ejerPortrait: UNSPLASH("1438761681033-6461ffad8d80", 400) },
  { id: "p-faaborg-murer", firma: "Faaborg Murerservice", ejer: "Brian Jepsen", postnr: "5600", by: "Faaborg", region: "Fyn", telefon: "+45 62 61 12 08", email: "brian@faaborg-murer.dk", webadresse: "faaborg-murer.dk", tier: "Bronze", points: 340, pointsTilNæste: 500, faggruppe: "Murer", specialer: ["Skorstene", "Facaderens"], initialer: "FM", logoBg: "#A88A6E", medlemSiden: "april 2026", rating: 4.5, antalSager: 28, beskrivelse: "Sydfyns murer — ø-husene omkring Faaborg og Lyø.", coverImage: UNSPLASH("1583847268964-b28dc8f51f92"), ejerPortrait: UNSPLASH("1554151228-14d9def656e4", 400) },
  { id: "p-middelfart-vvs", firma: "Middelfart VVS-Partner", ejer: "Lone Bach", postnr: "5500", by: "Middelfart", region: "Fyn", telefon: "+45 64 41 88 22", email: "kontakt@middelfart-vvs.dk", webadresse: "middelfart-vvs.dk", tier: "Sølv", points: 1880, pointsTilNæste: 2000, faggruppe: "VVS", specialer: ["Varmepumper", "Sommerhus", "Frostsikring"], initialer: "MV", logoBg: "#0C447C", medlemSiden: "februar 2026", rating: 4.8, antalSager: 156, beskrivelse: "Vestfyn og over Lillebæltsbroen — varmepumpe-specialister.", coverImage: UNSPLASH("1581092446327-9b52bd1570c2"), ejerPortrait: UNSPLASH("1580489944761-15a19d654956", 400) },
  { id: "p-helsingoer-el", firma: "Helsingør Elinstallation", ejer: "Mikkel Bay", postnr: "3000", by: "Helsingør", region: "Nordsjælland", telefon: "+45 49 21 22 04", email: "mikkel@helsingor-el.dk", webadresse: "helsingor-el.dk", tier: "Sølv", points: 1420, pointsTilNæste: 2000, faggruppe: "Elektriker", specialer: ["Smart home", "Solceller", "Ladestandere"], initialer: "HE", logoBg: "#1158A3", medlemSiden: "marts 2026", rating: 4.7, antalSager: 78, beskrivelse: "Hele Nordkysten — fra Helsingør til Hornbæk.", coverImage: UNSPLASH("1591293836027-e05b48473b67"), ejerPortrait: UNSPLASH("1573496359142-b8d87734a5a2", 400) },
  { id: "p-aakirkeby-vvs", firma: "Aakirkeby VVS Ø", ejer: "Pernille Westh", postnr: "3720", by: "Aakirkeby", region: "Bornholm", telefon: "+45 56 97 14 28", email: "info@aakirkeby-vvs.dk", webadresse: "aakirkeby-vvs.dk", tier: "Bronze", points: 460, pointsTilNæste: 500, faggruppe: "VVS", specialer: ["Sommerhus", "Brønde", "Frostsikring"], initialer: "AV", logoBg: "#0C447C", medlemSiden: "april 2026", rating: 4.6, antalSager: 34, beskrivelse: "Bornholmsk VVS — fokus på offgrid-sommerhuse syd for øen.", coverImage: UNSPLASH("1556015048-4d3aa10df74c"), ejerPortrait: UNSPLASH("1607746882042-944635dfe10e", 400) },
  { id: "p-aarhus-toemrer", firma: "Aarhus Tømrerteam", ejer: "Daniel Hove", postnr: "8000", by: "Aarhus C", region: "Østjylland", telefon: "+45 86 12 44 80", email: "daniel@aarhus-toemrer.dk", webadresse: "aarhus-toemrer.dk", tier: "Guld", points: 3940, pointsTilNæste: 5000, faggruppe: "Tømrer", specialer: ["Renovering", "Tilbygning", "Smart home-klargøring"], initialer: "AT", logoBg: "#F49100", medlemSiden: "januar 2026", rating: 4.9, antalSager: 294, beskrivelse: "Aarhus' førende tømrerteam — fra byggeprojekter til parcelhus-renovering.", coverImage: UNSPLASH("1517299321609-52687d1bc55a"), ejerPortrait: UNSPLASH("1599566150163-29194dcaad36", 400) },
  { id: "p-grenaa-maler", firma: "Grenå Malerservice", ejer: "Sanne Frost", postnr: "8500", by: "Grenå", region: "Østjylland", telefon: "+45 86 33 22 18", email: "sanne@grenaa-maler.dk", webadresse: "grenaa-maler.dk", tier: "Sølv", points: 1180, pointsTilNæste: 2000, faggruppe: "Maler", specialer: ["Træfacader", "Indvendigt", "Sommerhus"], initialer: "GM", logoBg: "#A88A6E", medlemSiden: "marts 2026", rating: 4.6, antalSager: 62, beskrivelse: "Nordøstjyske malerfirma — Djursland og Anholt.", coverImage: UNSPLASH("1607400201515-c2c41c07d307"), ejerPortrait: UNSPLASH("1494790108377-be9c29b29330", 400) },
  { id: "p-maribo-byg", firma: "Maribo Byggepartner", ejer: "Tobias Skaarup", postnr: "4930", by: "Maribo", region: "Lolland-Falster", telefon: "+45 54 78 12 22", email: "tobias@maribo-byg.dk", webadresse: "maribo-byg.dk", tier: "Bronze", points: 310, pointsTilNæste: 500, faggruppe: "Tømrer", specialer: ["Sommerhus", "Renovering"], initialer: "MB", logoBg: "#5B7F2C", medlemSiden: "maj 2026", rating: 4.3, antalSager: 14, beskrivelse: "Nystartet tømrer — Lolland-Falster og Sydhavsøerne.", coverImage: UNSPLASH("1486754735734-325b5831c3ad"), ejerPortrait: UNSPLASH("1507003211169-0a1dd7228f2d", 400) },
  { id: "p-henne-maler", firma: "Henne Strand Malerservice", ejer: "Camilla Brink", postnr: "6854", by: "Henne Strand", region: "Vestkysten", telefon: "+45 75 25 44 18", email: "camilla@henne-maler.dk", webadresse: "henne-maler.dk", tier: "Sølv", points: 1320, pointsTilNæste: 2000, faggruppe: "Maler", specialer: ["Sommerhus", "Saltlufts-imprægnering", "Træfacader"], initialer: "HM", logoBg: "#F49100", medlemSiden: "februar 2026", rating: 4.7, antalSager: 88, beskrivelse: "Vestkyst-maler — sommerhuse fra Henne til Vejers og Blåvand.", coverImage: UNSPLASH("1483728642387-6c3bdd6c93e5"), ejerPortrait: UNSPLASH("1438761681033-6461ffad8d80", 400) },
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

/** Art direction sets the visual tone of the ad. Same brand fill-in, different
   "look". Partners pick one before customising. Inspired by ui-ux-pro-max
   banner-design's 22 style options, distilled to 4 that fit Carl Ras' B2B context. */
export type ArtDirection = "photo" | "minimal" | "bold-type" | "editorial";

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
  artDirection?: ArtDirection;
}

export const CAMPAIGNS: Campaign[] = [
  /* ─── Sommer-sikring (4 campaigns, varied art directions) ─── */
  { id: "c-sommer-smartlock", tema: "sommer-sikring", titel: "Smid nøglerne væk", hovedbudskab: "Nu kan du smide nøglerne væk til dit sommerhus", underbudskab: "Smart Lock fra Carl Ras Partner. Installeret af din lokale låsesmed på under en time.", cta: "Book gratis hjemmebesøg", heroEmoji: "🔑", status: "Aktiv", formater: ["print-flyer", "print-poster", "print-magasin", "digital-facebook", "digital-instagram", "digital-google"], artDirection: "photo" },
  { id: "c-sommer-alarm", tema: "sommer-sikring", titel: "Sov roligt — også om vinteren", hovedbudskab: "Alarm med direkte besked til din telefon", underbudskab: "Din lokale specialist sikrer sommerhuset hele året. Carl Ras Partner.", cta: "Ring og hør prisen", heroEmoji: "🛎️", status: "Aktiv", formater: ["print-flyer", "print-poster", "digital-facebook", "digital-email", "digital-google"], artDirection: "photo" },
  { id: "c-sommer-pakke", tema: "sommer-sikring", titel: "Sommerhuspakken 2026", hovedbudskab: "Komplet sikring til sommerhuset — én pris", underbudskab: "Lås, alarm, dørtelefon. Installeret af din lokale Carl Ras Partner.", cta: "Få et samlet tilbud", heroEmoji: "📦", status: "Klar", formater: ["print-flyer", "print-poster", "print-bilstreamer", "digital-facebook", "digital-instagram"], artDirection: "editorial" },
  { id: "c-sommer-airbnb", tema: "sommer-sikring", titel: "Udlej trygt", hovedbudskab: "Nøglefri udlejning. Nye koder hver gæst.", underbudskab: "Gateway G2 + uge-rotation gennem Carl Ras Partner-portalen. 12 partnere kører det allerede.", cta: "Se oplægget", heroEmoji: "🏖️", status: "Klar", formater: ["digital-facebook", "digital-instagram", "digital-email", "print-flyer"], artDirection: "minimal" },

  /* ─── Vinter-byg (4 campaigns, varied art directions) ─── */
  { id: "c-vinter-tagrende", tema: "vinter-byg", titel: "Inden frosten tager fat", hovedbudskab: "Tagrender renset og isolering tjekket inden november", underbudskab: "Din lokale Carl Ras Partner kommer forbi. Helst inden uge 42.", cta: "Book vinter-tjek", heroEmoji: "❄️", status: "Kommende", formater: ["print-flyer", "print-magasin", "digital-facebook", "digital-email"], artDirection: "photo" },
  { id: "c-vinter-frostsikring", tema: "vinter-byg", titel: "Hold vandet i rørene", hovedbudskab: "Frostsikring og vinterlukning", underbudskab: "Carl Ras Partner. VVS-uddannet. Lokal.", cta: "Bestil vinterlukning", heroEmoji: "🧊", status: "Kommende", formater: ["print-flyer", "digital-facebook", "digital-google"], artDirection: "bold-type" },
  { id: "c-vinter-snerydning", tema: "vinter-byg", titel: "Klar når sneen kommer", hovedbudskab: "Sne, salt, snerydning — aftalt på forhånd", underbudskab: "Fast pris for hele sæsonen. Carl Ras Partner i dit område.", cta: "Få sæsonpris", heroEmoji: "🌨️", status: "Kommende", formater: ["print-flyer", "digital-facebook", "digital-email"], artDirection: "minimal" },
  { id: "c-vinter-eftersyn", tema: "vinter-byg", titel: "Hjem efter ferien — alt OK", hovedbudskab: "Sommerhus-eftersyn hver 14. dag", underbudskab: "Vi tjekker varme, vand, og at alt er som det skal være. Foto-rapport via app.", cta: "Tilmeld eftersyn", heroEmoji: "📋", status: "Kommende", formater: ["print-magasin", "digital-facebook", "digital-email"], artDirection: "editorial" },

  /* ─── Indbrud-efterår (3 campaigns, varied art directions) ─── */
  { id: "c-indbrud-hojsaeson", tema: "indbrud-efterar", titel: "Når mørket falder på", hovedbudskab: "Forebyg indbrud inden højsæsonen", underbudskab: "Lokal specialist. Gratis hjemmebesøg. Carl Ras Partner.", cta: "Book sikkerhedstjek", heroEmoji: "🌒", status: "Kommende", formater: ["print-flyer", "print-poster", "digital-facebook", "digital-instagram", "digital-google"], artDirection: "photo" },
  { id: "c-indbrud-belysning", tema: "indbrud-efterar", titel: "Bevægelseslys virker", hovedbudskab: "82% færre indbrud med korrekt udelys", underbudskab: "Smart belysning monteret af din lokale Carl Ras Partner. Tjek dit hus inden ferien.", cta: "Få tilbud på udelys", heroEmoji: "💡", status: "Kommende", formater: ["digital-facebook", "digital-google", "print-flyer"], artDirection: "bold-type" },
  { id: "c-indbrud-naboer", tema: "indbrud-efterar", titel: "Hold øje med hinanden", hovedbudskab: "Nabolag der passer på hinanden — og en Carl Ras Partner i baghånden", underbudskab: "Tip-en-genbo-kampagnen 2026. Gratis sikkerhedstjek til 3 boliger ad gangen.", cta: "Tilmeld dit nabolag", heroEmoji: "🤝", status: "Kommende", formater: ["print-poster", "print-flyer", "digital-facebook"], artDirection: "editorial" },
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

/* =====================================================================
   Certification details — module curriculum, flow stages, partner enrollment.
   Used by /admin/certificering to give a full picture of what's involved
   and where each enrolled partner is in the flow.
   ===================================================================== */

export type CertStage =
  | "Tilmeldt"      // signed up, hasn't started
  | "I gang"        // working through modules
  | "Eksamen booket" // modules done, exam scheduled
  | "Bestået"       // passed, certified
  | "Reprøve";      // failed exam, needs to retake

export interface CertModule {
  titel: string;
  varighed: string;   // "2 timer"
  format: "Online" | "E-learning" | "Workshop" | "Hjemmeopgave" | "Eksamen";
}

export interface CertCurriculum {
  certId: string;
  forudsætninger: string[];      // prerequisite cert titles or skills
  eksamenFormat: string;          // description
  beståelseskrav: string;          // pass requirements
  honorar?: string;                // partner pay for completion
  moduler: CertModule[];
}

export const CERT_CURRICULA: CertCurriculum[] = [
  {
    certId: "cert-cr-sikring-1",
    forudsætninger: ["Aktiv Carl Ras-partner i mindst 3 måneder"],
    eksamenFormat: "60 min multiple choice + 30 min praktisk montage hos Carl Ras Herlev",
    beståelseskrav: "Min. 75% korrekt på teori + bestået montage",
    honorar: "2.500 kr ved bestået (1. forsøg)",
    moduler: [
      { titel: "Sikringsmarkedet i Danmark — segmenter og kunder",   varighed: "1,5 timer", format: "E-learning" },
      { titel: "Fysisk sikring — låse, cylindere, beslag",            varighed: "2,5 timer", format: "E-learning" },
      { titel: "Elektronisk sikring — alarmer, sensorer, sirener",   varighed: "2 timer",   format: "E-learning" },
      { titel: "Smart locks — Carl Ras' Stroxx-sortiment",            varighed: "2 timer",   format: "Workshop" },
      { titel: "Salgssamtaler — fra leads til vundet sag",            varighed: "2 timer",   format: "Workshop" },
      { titel: "Eksamen — teori + praktisk",                          varighed: "2 timer",   format: "Eksamen" },
    ],
  },
  {
    certId: "cert-abus-smart",
    forudsætninger: ["Carl Ras Sikring · Niveau 1"],
    eksamenFormat: "Online proctored eksamen via ABUS Academy",
    beståelseskrav: "Min. 80% korrekt",
    honorar: "1.500 kr + ABUS-installatør-status",
    moduler: [
      { titel: "ABUS Smart Lock-portefølje 2026",                 varighed: "2 timer", format: "E-learning" },
      { titel: "Installation og konfiguration",                   varighed: "2 timer", format: "Workshop" },
      { titel: "Fejlfinding og kundesupport",                     varighed: "2 timer", format: "Hjemmeopgave" },
      { titel: "ABUS-certificeringseksamen",                      varighed: "2 timer", format: "Eksamen" },
    ],
  },
  {
    certId: "cert-cr-sikring-2",
    forudsætninger: ["Carl Ras Sikring · Niveau 1", "Mindst 10 vundne sager i kategorien sikring"],
    eksamenFormat: "90 min skriftlig + casebesvarelse + mundtlig forsvar af case",
    beståelseskrav: "Min. 80% + godkendt case",
    honorar: "5.000 kr + Guld-tier-adgang",
    moduler: [
      { titel: "Adgangskontrol i erhverv — teori og produktvalg",   varighed: "3 timer", format: "E-learning" },
      { titel: "Smart home-integration: STROXX, ABUS, Yale",        varighed: "3 timer", format: "Workshop" },
      { titel: "Salgsteknik mod udlejnings-segmentet",              varighed: "2 timer", format: "Online" },
      { titel: "Kalkulation, tilbud og marginer",                    varighed: "2 timer", format: "Online" },
      { titel: "Case: design en sikringsløsning for et boligkompleks", varighed: "4 timer", format: "Hjemmeopgave" },
      { titel: "Servicekontrakter og opfølgning",                    varighed: "2 timer", format: "E-learning" },
      { titel: "Lovgivning og forsikring",                            varighed: "1 time",  format: "E-learning" },
      { titel: "Eksamen — skriftlig + case-forsvar",                  varighed: "1 time",  format: "Eksamen" },
    ],
  },
  {
    certId: "cert-yale",
    forudsætninger: ["Carl Ras Sikring · Niveau 1"],
    eksamenFormat: "Online proctored eksamen via ASSA ABLOY Academy",
    beståelseskrav: "Min. 75% korrekt",
    honorar: "2.000 kr + Yale Authorized Installer-mærke",
    moduler: [
      { titel: "Yale Doorman L3 — produktoverblik",                varighed: "2 timer", format: "E-learning" },
      { titel: "Installation og opsætning",                         varighed: "2 timer", format: "Workshop" },
      { titel: "Integration med boligforeninger og adgangsstyring", varighed: "2 timer", format: "Workshop" },
      { titel: "Fejlfinding — case-baseret",                        varighed: "2 timer", format: "Hjemmeopgave" },
      { titel: "Yale-certificeringseksamen",                        varighed: "2 timer", format: "Eksamen" },
    ],
  },
  {
    certId: "cert-vinter-1",
    forudsætninger: ["Aktiv Carl Ras-partner"],
    eksamenFormat: "60 min multiple choice + hjemmeopgave",
    beståelseskrav: "Min. 75% + godkendt hjemmeopgave",
    honorar: "2.500 kr ved bestået",
    moduler: [
      { titel: "Vinterklargøring — produktoverblik 2026",      varighed: "2 timer", format: "E-learning" },
      { titel: "Tagrender og afløb — montage og rensning",     varighed: "2 timer", format: "Workshop" },
      { titel: "Frostsikring af vandinstallationer",            varighed: "2 timer", format: "Workshop" },
      { titel: "Vinterlukning af sommerhuse",                    varighed: "2 timer", format: "E-learning" },
      { titel: "Salgssamtaler — sommerhusejer-segmentet",       varighed: "2 timer", format: "Online" },
      { titel: "Eksamen + hjemmeopgave",                        varighed: "2 timer", format: "Eksamen" },
    ],
  },
  {
    certId: "cert-cr-byg-1",
    forudsætninger: ["Aktiv Carl Ras-partner"],
    eksamenFormat: "60 min multiple choice + praktisk demo",
    beståelseskrav: "Min. 75% + bestået demo",
    honorar: "2.500 kr ved bestået",
    moduler: [
      { titel: "Indbrudssikring — markedsoverblik efterår 2026",  varighed: "2 timer", format: "E-learning" },
      { titel: "Forstærkning af døre og vinduer",                  varighed: "2 timer", format: "Workshop" },
      { titel: "Sensorer og kameraer — parcelhus-segmentet",       varighed: "2 timer", format: "Workshop" },
      { titel: "Salg til boligejere — argumentation og pris",      varighed: "2 timer", format: "Online" },
      { titel: "Servicekontrakter og opfølgning",                   varighed: "2 timer", format: "E-learning" },
      { titel: "Eksamen + praktisk demo",                           varighed: "2 timer", format: "Eksamen" },
    ],
  },
];

export interface CertEnrollment {
  partnerId: string;
  certId: string;
  stage: CertStage;
  modulerFærdige: number;
  startet: string;        // ISO date
  forventetFærdig?: string; // ISO date
  eksamenDato?: string;
  score?: number;          // 0-100, set when stage = Bestået or Reprøve
}

/* Synthesized enrollments — gives the admin page realistic state to display. */
export const CERT_ENROLLMENTS: CertEnrollment[] = [
  // cert-cr-sikring-2 (8 modules) — partners mid-flow
  { partnerId: "p-hornbaek-laas",     certId: "cert-cr-sikring-2", stage: "I gang",         modulerFærdige: 3, startet: "2026-03-15", forventetFærdig: "2026-06-20" },
  { partnerId: "p-bornholm-sikring",  certId: "cert-cr-sikring-2", stage: "Eksamen booket", modulerFærdige: 7, startet: "2026-02-10", eksamenDato: "2026-06-18" },
  { partnerId: "p-marielyst-laas",    certId: "cert-cr-sikring-2", stage: "I gang",         modulerFærdige: 5, startet: "2026-03-01", forventetFærdig: "2026-07-01" },
  { partnerId: "p-fanoe-laas",        certId: "cert-cr-sikring-2", stage: "Tilmeldt",        modulerFærdige: 0, startet: "2026-05-20" },

  // cert-cr-sikring-1 (held by 2, plus enrolled others)
  { partnerId: "p-skagen-el",         certId: "cert-cr-sikring-1", stage: "I gang",          modulerFærdige: 4, startet: "2026-04-08", forventetFærdig: "2026-06-10" },
  { partnerId: "p-ebeltoft-ejendomsservice", certId: "cert-cr-sikring-1", stage: "Bestået",  modulerFærdige: 6, startet: "2026-01-20", score: 89 },
  { partnerId: "p-tisvilde-toemrer",  certId: "cert-cr-sikring-1", stage: "Reprøve",         modulerFærdige: 6, startet: "2026-02-05", score: 68, eksamenDato: "2026-06-25" },

  // cert-abus-smart
  { partnerId: "p-hornbaek-laas",     certId: "cert-abus-smart", stage: "Bestået",          modulerFærdige: 4, startet: "2026-03-25", score: 92 },
  { partnerId: "p-bornholm-sikring",  certId: "cert-abus-smart", stage: "I gang",            modulerFærdige: 2, startet: "2026-04-12", forventetFærdig: "2026-06-15" },

  // cert-yale (newer cert)
  { partnerId: "p-vvs-loekken",       certId: "cert-yale", stage: "Tilmeldt",                modulerFærdige: 0, startet: "2026-05-22" },
  { partnerId: "p-marielyst-laas",    certId: "cert-yale", stage: "I gang",                  modulerFærdige: 1, startet: "2026-05-01", forventetFærdig: "2026-07-15" },

  // cert-vinter-1 — building pipeline ahead of Q4 theme
  { partnerId: "p-tisvilde-toemrer",  certId: "cert-vinter-1", stage: "Tilmeldt",            modulerFærdige: 0, startet: "2026-05-18" },
  { partnerId: "p-blokhus-byg",       certId: "cert-vinter-1", stage: "I gang",               modulerFærdige: 2, startet: "2026-04-22", forventetFærdig: "2026-08-01" },
  { partnerId: "p-vejers-vvs",        certId: "cert-vinter-1", stage: "Tilmeldt",             modulerFærdige: 0, startet: "2026-05-25" },
];

export function curriculumFor(certId: string): CertCurriculum | undefined {
  return CERT_CURRICULA.find((c) => c.certId === certId);
}

export function enrollmentsFor(certId: string): CertEnrollment[] {
  return CERT_ENROLLMENTS.filter((e) => e.certId === certId);
}

/* ─────────────────────────── Specialists & chat ─────────────────────────── */
export interface Specialist {
  id: string;
  navn: string;
  rolle: string;
  bu: string;
  initialer: string;
  bg: string;
  portrait?: string;  // Unsplash CDN URL — face for chat & profile
  online: boolean;
  responstid: string;
}

export const SPECIALISTS: Specialist[] = [
  { id: "s-jens",      navn: "Jens Pedersen",   rolle: "Senior Specialist", bu: "Sikring",            initialer: "JP", bg: "#1158A3", online: true,  responstid: "≈ 12 min",  portrait: UNSPLASH("1500648767791-00dcc994a43e", 400) },
  { id: "s-tina",      navn: "Tina Holm",       rolle: "Træningschef",      bu: "Sikring",            initialer: "TH", bg: "#002D59", online: true,  responstid: "≈ 30 min",  portrait: UNSPLASH("1438761681033-6461ffad8d80", 400) },
  { id: "s-morten",    navn: "Morten Bach",     rolle: "Specialist",         bu: "Byg",                initialer: "MB", bg: "#5B7F2C", online: false, responstid: "Næste dag", portrait: UNSPLASH("1573496359142-b8d87734a5a2", 400) },
  { id: "s-marie",     navn: "Marie Lindgren",  rolle: "Specialist",         bu: "Sikring",            initialer: "ML", bg: "#F49100", online: true,  responstid: "≈ 8 min",   portrait: UNSPLASH("1494790108377-be9c29b29330", 400) },
  { id: "s-christian", navn: "Christian Funch", rolle: "Specialist",         bu: "Sikring · Bornholm", initialer: "CF", bg: "#0C447C", online: false, responstid: "I morgen",  portrait: UNSPLASH("1463453091185-61582044d556", 400) },
  { id: "s-henrik",    navn: "Henrik Birk",     rolle: "Specialist",         bu: "Engros Beslag",      initialer: "HB", bg: "#A88A6E", online: true,  responstid: "≈ 20 min",  portrait: UNSPLASH("1599566150163-29194dcaad36", 400) },
];

/* =====================================================================
   Carl Ras Salgskonsulent — the relationship person each partner has
   assigned. Distinct from product specialists. Single canonical record
   used by /partner (konsulent hero card) and /admin/partnere/[id]
   (tilknyttet konsulent rail).
   ===================================================================== */
export interface Konsulent {
  navn: string;
  rolle: string;
  region: Region;
  bu: string;
  initialer: string;
  bg: string;
  portrait: string;
  telefon: string;
  email: string;
  besogIaar: number;
  besogMaal: number;
  sidsteBesog: string;
  naesteBesog: string;
  relation: string;
  online: boolean;
  responstid: string;
}

export const CARL_RAS_KONSULENT: Konsulent = {
  navn: "Dennis Holmberg",
  rolle: "Salgskonsulent",
  region: "Nordsjælland",
  bu: "Sikring · Byg",
  initialer: "DH",
  bg: "#0C447C",
  portrait: UNSPLASH("1531427186611-ecfd6d936c79", 400),
  telefon: "+45 70 26 01 11",
  email: "dennis@carl-ras.dk",
  besogIaar: 4,
  besogMaal: 6,
  sidsteBesog: "19. apr 2026",
  naesteBesog: "3. jun 2026",
  relation: "Stærk · 8.4",
  online: true,
  responstid: "svar inden 2 t",
};

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
  forfatterInitialer: string;
  forfatterBg: string;
  dato: string;
  kategori: "Tema-update" | "Markedsindsigt" | "Værktøj" | "Case" | "Strategi";
  læsetid: string;
  tema?: ThemeId;
  hero: string;   // emoji fallback for small thumbnails
  image: string;  // Unsplash CDN URL — main cover photo
}

/* Editorial photos served via Unsplash CDN. URLs use auto=format & fit=crop
   so the same source can serve crisp small thumbnails and big hero crops. */
const IMG = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`;

export const BLOG_POSTS: BlogPost[] = [
  { id: "b-001", titel: "Vinterklargøring kommer Q4 — her er hvad I skal vide", excerpt: "Næste tema i årshjulet er klar i konceptform. Tagrender, frostsikring og vinterlukning bliver kufferten for tømrer- og VVS-partnerne. Sølv- og Guld-partnere får første adgang fra september.", forfatter: "Morten Bach", forfatterRolle: "Specialist · Byg", forfatterInitialer: "MB", forfatterBg: "#5B7F2C", dato: "23. maj 2026", kategori: "Tema-update", læsetid: "4 min", tema: "vinter-byg", hero: "🍂", image: IMG("1483728642387-6c3bdd6c93e5") },
  { id: "b-002", titel: "Sådan får du flest leads fra Partnerfinder", excerpt: "Vi har analyseret hvilke partnerprofiler der konverterer flest opslag til kontakt. Tre ting flytter nålen markant — og to ting ingen tror på.", forfatter: "Marie Lindgren", forfatterRolle: "Specialist · Sikring", forfatterInitialer: "ML", forfatterBg: "#F49100", dato: "18. maj 2026", kategori: "Markedsindsigt", læsetid: "6 min", hero: "📈", image: IMG("1460925895917-afdab827c52f") },
  { id: "b-003", titel: "Case: Hornbæk Låseservice gik fra 4 til 12 leads om måneden", excerpt: "Mads Sørensen er Sølv-partner siden april. Han bruger Materialer-pakken konsekvent og er aktiv i forummet. Sådan ser hans hverdag ud — fra morgenkaffe til sidste hjemmebesøg.", forfatter: "Jens Pedersen", forfatterRolle: "Senior Specialist · Sikring", forfatterInitialer: "JP", forfatterBg: "#1158A3", dato: "15. maj 2026", kategori: "Case", læsetid: "5 min", tema: "sommer-sikring", hero: "🏆", image: IMG("1581094794329-c8112a89af12") },
  { id: "b-004", titel: "STROXX Smart Cylinder — 60 dage i felten", excerpt: "Vi har kørt en 60-dages test på den nye STROXX-cylinder i tre forskellige sommerhuse. Saltluft, vintertemperatur, og 200 kode-skift. Her er hvad vi fandt — og hvad I bør fortælle kunden.", forfatter: "Jens Pedersen", forfatterRolle: "Senior Specialist · Sikring", forfatterInitialer: "JP", forfatterBg: "#1158A3", dato: "12. maj 2026", kategori: "Værktøj", læsetid: "7 min", tema: "sommer-sikring", hero: "🔧", image: IMG("1558618666-fcd25c85cd64") },
  { id: "b-005", titel: "Hvorfor lokal markedsføring slår national 4 til 1", excerpt: "Vi har sammenlignet 8 ugers leads fra Carl Ras' nationale Facebook-kampagne med 8 ugers leads fra partnernes lokale flyers. Resultatet overrasker — selv os.", forfatter: "Peter Bak Torjusen", forfatterRolle: "Direktør · Digital & Marketing", forfatterInitialer: "PT", forfatterBg: "#002D59", dato: "8. maj 2026", kategori: "Strategi", læsetid: "5 min", hero: "📊", image: IMG("1572021335469-31706a17aaef") },
  { id: "b-006", titel: "Niveau 2-certificering: hvad får du adgang til?", excerpt: "Sølv-partnere kan nu booke Niveau 2-certificeringen. Her er produktlisten, marginerne, eksamensformatet — og hvad næste step er for dig.", forfatter: "Tina Holm", forfatterRolle: "Træningschef · Sikring", forfatterInitialer: "TH", forfatterBg: "#002D59", dato: "5. maj 2026", kategori: "Værktøj", læsetid: "4 min", tema: "sommer-sikring", hero: "🎓", image: IMG("1552581234-26160f608093") },
  { id: "b-007", titel: "Sommerhus-segmentet: 3 ejertyper, 3 købsmønstre", excerpt: "Pensionisten, det travle par fra storbyen, og udlejer-investoren køber radikalt forskelligt. Vi viser dig hvordan du gennemskuer typen i første samtale — og hvad du så skal pitche.", forfatter: "Marie Lindgren", forfatterRolle: "Specialist · Sikring", forfatterInitialer: "ML", forfatterBg: "#F49100", dato: "2. maj 2026", kategori: "Markedsindsigt", læsetid: "8 min", tema: "sommer-sikring", hero: "🏖️", image: IMG("1568605114967-8130f3a36994") },
  { id: "b-008", titel: "Sådan kobler du STROXX og ABUS i én løsning", excerpt: "STROXX' nye Gateway G2 kan tale med ABUS' alarmcentral. Her er den tekniske integration trin for trin, med fejlsøgning i bunden. Læseplan til Niveau 2-certificeringen.", forfatter: "Christian Funch", forfatterRolle: "Specialist · Sikring · Bornholm", forfatterInitialer: "CF", forfatterBg: "#0C447C", dato: "28. april 2026", kategori: "Værktøj", læsetid: "9 min", tema: "sommer-sikring", hero: "🔌", image: IMG("1504148455328-c376907d081c") },
  { id: "b-009", titel: "Q1-rapporten: hvad partnernes data fortæller os", excerpt: "47 aktive partnere, 412 vundne sager, 18% vækst i konverteringsraten. Vi pakker tallene ud og viser hvor mulighederne ligger — region for region.", forfatter: "Peter Bak Torjusen", forfatterRolle: "Direktør · Digital & Marketing", forfatterInitialer: "PT", forfatterBg: "#002D59", dato: "24. april 2026", kategori: "Strategi", læsetid: "10 min", hero: "📑", image: IMG("1611348586804-61bf6c080437") },
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

/* ─────────────────────────── Customer projects ───────────────────────────
   Partners manage their own customer projects through a 5-stage pipeline:
   Konsultation → Tilbud → Aftalt → I gang → Færdig. Each project carries
   the products in scope, an optional booked specialist, expected revenue,
   timeline, and free-form notes.
   ─────────────────────────────────────────────────────────────────────── */

export type ProjectStatus = "Konsultation" | "Tilbud" | "Aftalt" | "I gang" | "Færdig";
export type ProjectType = "Sommerhus" | "Bolig" | "Erhverv" | "Udlejning" | "Ejendom";
export type PhaseStatus = "todo" | "in-progress" | "done" | "blocked";
export type PhaseOwner = "partner" | "specialist" | "kunde" | "carl-ras";

export interface ProjectPhase {
  id: string;
  navn: string;
  beskrivelse?: string;
  startUge: number;        // weeks from project start (0 = first week)
  varighedUger: number;    // duration in weeks
  status: PhaseStatus;
  ansvarlig: PhaseOwner;
  produktIds?: string[];
  /** Was this phase added by the specialist-recommended template? */
  fromTemplate?: boolean;
}

export interface ProjectNote {
  tid: string;       // e.g. "for 2 dage"
  forfatter: string; // partner name
  body: string;
}

export interface Project {
  id: string;
  partnerId: string;
  kunde: string;
  kontakt: string;       // email or phone
  type: ProjectType;
  by: string;
  status: ProjectStatus;
  enheder: number;
  produktIds: string[];
  specialistId?: string;
  hjemmebesøgDato?: string;  // ISO date
  forventetKr: number;        // expected revenue in DKK
  marginPct: number;
  deadline?: string;          // ISO date
  noter: ProjectNote[];
  oprettet: string;           // ISO date
  emoji: string;
  /** Optional project plan — if empty, the partner can apply the
   *  specialist-recommended template for their project type. */
  phases?: ProjectPhase[];
}

/* =====================================================================
   Project templates — specialist-recommended phase sequences per type.
   When a partner opens a new project they can apply the matching template
   in one click, then tweak phases (rename, resize, reorder, status).
   ===================================================================== */

export interface ProjectTemplate {
  type: ProjectType;
  /** Specialist who curated this template — drives the recommendation banner */
  curatorSpecialistId: string;
  /** Number of similar projects the curator has based this on */
  basedOnCount: number;
  phases: Omit<ProjectPhase, "id">[];
}

/* Tokens replaced when a template is applied to a real project:
 *   {{kunde}}      → project.kunde
 *   {{partner}}    → CURRENT_PARTNER.ejer (e.g. Mads)
 *   {{specialist}} → specialist on project (or template's curator's first name)
 */
export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    type: "Sommerhus",
    curatorSpecialistId: "s-jens",
    basedOnCount: 18,
    phases: [
      { navn: "{{partner}}: måle døre + tjekke eksisterende cylindere",     startUge: 0, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true, beskrivelse: "Hjemmebesøg hos {{kunde}}. Tag prøver med fra Carl Ras til at vise i hånden." },
      { navn: "{{specialist}}: sammensætte pakketilbud + Smart Lock-spec",   startUge: 1, varighedUger: 1, status: "todo", ansvarlig: "specialist", fromTemplate: true, beskrivelse: "STROXX ST-2 + Gateway G2 + Pebble røgalarm. {{specialist}} verificerer pris." },
      { navn: "{{partner}}: sende skriftligt tilbud til {{kunde}}",          startUge: 2, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true },
      { navn: "{{kunde}}: tage stilling",                                    startUge: 3, varighedUger: 1, status: "todo", ansvarlig: "kunde",      fromTemplate: true },
      { navn: "Carl Ras: pakke + sende materialer",                          startUge: 4, varighedUger: 1, status: "todo", ansvarlig: "carl-ras",   fromTemplate: true, beskrivelse: "Levering til værkstedet. Husk at tjekke alle dele før installation." },
      { navn: "{{partner}}: skifte cylinder + montere Smart Lock",           startUge: 5, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true, beskrivelse: "Ca. 30 min pr. dør. Husk at tage gamle nøgler med tilbage til kunden." },
      { navn: "{{partner}}: opsætte app + lære {{kunde}} kode-administration", startUge: 5, varighedUger: 1, status: "todo", ansvarlig: "partner",  fromTemplate: true, beskrivelse: "Vis kunden hvordan de tilføjer familie, ændrer koder, og deler adgang." },
      { navn: "{{partner}}: ringe efter 30 dage og høre om alt virker",       startUge: 9, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true },
    ],
  },
  {
    type: "Udlejning",
    curatorSpecialistId: "s-jens",
    basedOnCount: 24,
    phases: [
      { navn: "{{partner}}: køre rundt og måle alle enheder op",              startUge: 0, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true, beskrivelse: "Notér eksisterende cylinder-type pr. enhed. Tag fotos af dørene." },
      { navn: "{{specialist}}: lave bulk-tilbud + spec til kode-rotation",   startUge: 1, varighedUger: 2, status: "todo", ansvarlig: "specialist", fromTemplate: true, beskrivelse: "{{specialist}} har forhandlet pakkepris for ≥10 enheder. Kode-rotation kører via app eller Airbnb-integration." },
      { navn: "{{kunde}}: bestyrelsen skriver kontrakt under",                startUge: 3, varighedUger: 1, status: "todo", ansvarlig: "kunde",      fromTemplate: true },
      { navn: "Carl Ras: levere alle materialer i én bulk-forsendelse",       startUge: 4, varighedUger: 1, status: "todo", ansvarlig: "carl-ras",   fromTemplate: true, beskrivelse: "Spar leveringsgebyr — alt kommer på én pall." },
      { navn: "{{partner}}: installere Smart Locks + gateways i alle enheder", startUge: 5, varighedUger: 3, status: "todo", ansvarlig: "partner",  fromTemplate: true, beskrivelse: "Planlæg 8 enheder pr. uge. Tag en hjælper med — det er hurtigere parvis." },
      { navn: "{{specialist}}: koble Airbnb-kalender på automatisk kode-rotation", startUge: 8, varighedUger: 1, status: "todo", ansvarlig: "specialist", fromTemplate: true, beskrivelse: "Zapier-flow: ny booking → ny kode → SMS til lejer dagen før." },
      { navn: "{{partner}}: lære udlejer at administrere koder selv",         startUge: 9, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true },
      { navn: "{{partner}}: 60-dages tjek — er der døre der binder?",         startUge: 13, varighedUger: 1, status: "todo", ansvarlig: "partner",   fromTemplate: true },
    ],
  },
  {
    type: "Bolig",
    curatorSpecialistId: "s-marie",
    basedOnCount: 41,
    phases: [
      { navn: "{{partner}}: hjemmebesøg + demo af Smart Lock i hånden",       startUge: 0, varighedUger: 1, status: "todo", ansvarlig: "partner", fromTemplate: true },
      { navn: "{{partner}}: sende kort tilbud (1 side)",                      startUge: 1, varighedUger: 1, status: "todo", ansvarlig: "partner", fromTemplate: true },
      { navn: "{{kunde}}: tage stilling",                                     startUge: 2, varighedUger: 1, status: "todo", ansvarlig: "kunde",   fromTemplate: true },
      { navn: "Carl Ras: sende STROXX cylinder + monteringsskruer",           startUge: 3, varighedUger: 1, status: "todo", ansvarlig: "carl-ras", fromTemplate: true },
      { navn: "{{partner}}: skifte cylinder + sætte Smart Lock på (≈45 min)", startUge: 4, varighedUger: 1, status: "todo", ansvarlig: "partner", fromTemplate: true, beskrivelse: "Husk at tage de gamle nøgler med — kunden vil gerne beholde dem." },
      { navn: "{{partner}}: vise {{kunde}} hvordan app og familie-deling virker", startUge: 4, varighedUger: 1, status: "todo", ansvarlig: "partner", fromTemplate: true },
      { navn: "{{partner}}: ringe efter 14 dage",                             startUge: 6, varighedUger: 1, status: "todo", ansvarlig: "partner", fromTemplate: true },
    ],
  },
  {
    type: "Erhverv",
    curatorSpecialistId: "s-jens",
    basedOnCount: 9,
    phases: [
      { navn: "{{partner}} + {{specialist}}: besøg butik, opmåle døre + planlægge alarm-zoner", startUge: 0, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true, beskrivelse: "Tag mål på personaledøren, hoveddøren og baglokalet. Notér eksisterende alarm-installation." },
      { navn: "{{specialist}}: spec af alarm + dørlukker + adgangskontrol",                    startUge: 1, varighedUger: 2, status: "todo", ansvarlig: "specialist", fromTemplate: true, beskrivelse: "Dormakaba ED100 + Housegard alarm + STROXX adgangskontrol til personale." },
      { navn: "{{partner}}: sende tilbud til {{kunde}}",                                       startUge: 3, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true },
      { navn: "{{kunde}}: skrive kontrakt under + betale depositum",                           startUge: 4, varighedUger: 1, status: "todo", ansvarlig: "kunde",      fromTemplate: true },
      { navn: "Carl Ras: levere alarm-pakke + cylindere + dørlukker",                          startUge: 5, varighedUger: 2, status: "todo", ansvarlig: "carl-ras",   fromTemplate: true },
      { navn: "{{partner}}: installere alarm + dørlukker (efter butikkens lukketid)",          startUge: 7, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true, beskrivelse: "Aften-arbejde — ca. 4 timer. Tag en assistent med." },
      { navn: "{{partner}}: instruere personalet i alarm-koder + dagligt rutine",              startUge: 8, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true },
      { navn: "Carl Ras: aktivere 24/7 service-aftale",                                        startUge: 9, varighedUger: 1, status: "todo", ansvarlig: "carl-ras",   fromTemplate: true },
    ],
  },
  {
    type: "Ejendom",
    curatorSpecialistId: "s-jens",
    basedOnCount: 6,
    phases: [
      { navn: "{{specialist}}: gennemgå hele porteføljen + prioritere enheder",                startUge: 0, varighedUger: 2, status: "todo", ansvarlig: "specialist", fromTemplate: true },
      { navn: "{{partner}}: lave individuel pakke-pris pr. ejendom",                           startUge: 2, varighedUger: 1, status: "todo", ansvarlig: "partner",    fromTemplate: true },
      { navn: "{{kunde}}: træffe beslutning pr. ejendom",                                      startUge: 3, varighedUger: 2, status: "todo", ansvarlig: "kunde",      fromTemplate: true },
      { navn: "Carl Ras: bulk-levering til {{partner}}s værksted",                             startUge: 5, varighedUger: 1, status: "todo", ansvarlig: "carl-ras",   fromTemplate: true },
      { navn: "{{partner}}: installere Smart Locks + gateways (≈4 enheder/uge)",               startUge: 6, varighedUger: 4, status: "todo", ansvarlig: "partner",    fromTemplate: true },
      { navn: "{{specialist}}: præsentere status for bestyrelsen",                             startUge: 10, varighedUger: 1, status: "todo", ansvarlig: "specialist", fromTemplate: true },
    ],
  },
];

export function templateFor(type: ProjectType): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find((t) => t.type === type);
}

/** Apply a template's phases to a project — interpolates {{kunde}}, {{partner}}, {{specialist}} */
export function applyTemplate(
  template: ProjectTemplate,
  ctx: { kunde: string; partner: string; specialist: string }
): ProjectPhase[] {
  function interpolate(s: string): string {
    return s
      .replace(/\{\{kunde\}\}/g, ctx.kunde)
      .replace(/\{\{partner\}\}/g, ctx.partner)
      .replace(/\{\{specialist\}\}/g, ctx.specialist);
  }
  return template.phases.map((p, i) => ({
    ...p,
    id: `tpl-${Date.now()}-${i}`,
    navn: interpolate(p.navn),
    beskrivelse: p.beskrivelse ? interpolate(p.beskrivelse) : undefined,
  }));
}

export const PROJECTS: Project[] = [
  {
    id: "pr-001",
    partnerId: "p-hornbaek-laas",
    kunde: "Sommerhusforening Hornbæk Strand",
    kontakt: "best@hornbaek-strand.dk",
    type: "Udlejning",
    by: "Hornbæk",
    status: "Tilbud",
    enheder: 25,
    produktIds: ["40013215", "40013955", "55011840"],
    specialistId: "s-jens",
    hjemmebesøgDato: "2026-06-04",
    forventetKr: 123100,
    marginPct: 18,
    deadline: "2026-07-15",
    noter: [
      { tid: "for 3 dage",  forfatter: "Mads Sørensen", body: "Hjemmebesøg gennemført med 4 fra bestyrelsen. De vil have demo af kode-rotation før de underskriver." },
      { tid: "for 1 dag",   forfatter: "Mads Sørensen", body: "Sendt tilbudspakke med Jens' anbefaling — STROXX ST-2 + Gateway G2 + Pebble røgalarm. Venter på svar." },
    ],
    oprettet: "2026-05-15",
    emoji: "🏖️",
    phases: [
      { id: "ph-001-a", navn: "Mads: køre rundt og måle alle 25 enheder op", startUge: 0, varighedUger: 1, status: "done",        ansvarlig: "partner",    fromTemplate: true, beskrivelse: "25 sommerhuse, alle med eksisterende cylindere. Fotos taget." },
      { id: "ph-001-b", navn: "Jens: lave bulk-tilbud + spec til kode-rotation", startUge: 1, varighedUger: 2, status: "in-progress", ansvarlig: "specialist", fromTemplate: true, beskrivelse: "Pakkepris med 18% rabat ved bulk. Airbnb-integration på roadmap." },
      { id: "ph-001-c", navn: "Bestyrelsen: skrive kontrakt under",          startUge: 3, varighedUger: 1, status: "todo",        ansvarlig: "kunde",      fromTemplate: true },
      { id: "ph-001-d", navn: "Carl Ras: levere alle materialer i én bulk-forsendelse", startUge: 4, varighedUger: 1, status: "todo", ansvarlig: "carl-ras", fromTemplate: true },
      { id: "ph-001-e", navn: "Mads: installere Smart Locks + gateways (8 enheder/uge)", startUge: 5, varighedUger: 3, status: "todo", ansvarlig: "partner", fromTemplate: true, beskrivelse: "Tager Anders med — det er hurtigere parvis." },
      { id: "ph-001-f", navn: "Jens: koble Airbnb-kalender på automatisk kode-rotation", startUge: 8, varighedUger: 1, status: "todo", ansvarlig: "specialist", fromTemplate: true },
      { id: "ph-001-g", navn: "Mads: lære udlejer at administrere koder selv", startUge: 9, varighedUger: 1, status: "todo", ansvarlig: "partner", fromTemplate: true },
    ],
  },
  {
    id: "pr-002",
    partnerId: "p-hornbaek-laas",
    kunde: "Familie Eriksen",
    kontakt: "te@eriksen.dk",
    type: "Sommerhus",
    by: "Tisvilde",
    status: "Aftalt",
    enheder: 1,
    produktIds: ["40013215", "40013955"],
    specialistId: "s-marie",
    hjemmebesøgDato: "2026-06-01",
    forventetKr: 4711,
    marginPct: 18,
    deadline: "2026-06-10",
    noter: [
      { tid: "i går", forfatter: "Mads Sørensen", body: "Aftale skrevet under. Installation booket til 1/6 kl 10. Marie tager med som backup." },
    ],
    oprettet: "2026-05-20",
    emoji: "🏡",
  },
  {
    id: "pr-003",
    partnerId: "p-hornbaek-laas",
    kunde: "Ejendomsservice Nordsjælland A/S",
    kontakt: "indkøb@ens-as.dk",
    type: "Ejendom",
    by: "Helsingør",
    status: "Konsultation",
    enheder: 8,
    produktIds: ["40013216", "40013955"],
    forventetKr: 36514,
    marginPct: 18,
    deadline: "2026-08-30",
    noter: [
      { tid: "for 5 timer", forfatter: "Mads Sørensen", body: "Indledende kontakt — de har 8 udlejningsejendomme og overvejer Smart Lock-opgradering. Skal sende prislister og case-study." },
    ],
    oprettet: "2026-05-26",
    emoji: "🏢",
  },
  {
    id: "pr-004",
    partnerId: "p-hornbaek-laas",
    kunde: "Café Hornbæk Havn",
    kontakt: "kim@cafehavnen.dk",
    type: "Erhverv",
    by: "Hornbæk",
    status: "I gang",
    enheder: 3,
    produktIds: ["55011841", "41008815"],
    specialistId: "s-jens",
    forventetKr: 7860,
    marginPct: 20,
    deadline: "2026-06-08",
    noter: [
      { tid: "i går",       forfatter: "Mads Sørensen", body: "Installation 1/3 enheder færdig. Resten i næste uge." },
      { tid: "for 4 dage",  forfatter: "Mads Sørensen", body: "Kim vil have alarm + automatisk dørlukker — Jens har spec'et Dormakaba ED100." },
    ],
    oprettet: "2026-05-10",
    emoji: "☕",
    phases: [
      { id: "ph-004-a", navn: "Mads + Jens: besøg Cafén, opmåle døre + planlægge alarm-zoner", startUge: 0, varighedUger: 1, status: "done", ansvarlig: "partner", fromTemplate: true },
      { id: "ph-004-b", navn: "Jens: spec af Dormakaba dørlukker + Housegard alarm", startUge: 1, varighedUger: 2, status: "done", ansvarlig: "specialist", fromTemplate: true },
      { id: "ph-004-c", navn: "Kim: skrive kontrakt under + betale depositum", startUge: 3, varighedUger: 1, status: "done", ansvarlig: "kunde", fromTemplate: true },
      { id: "ph-004-d", navn: "Carl Ras: levere alarm-pakke + dørlukker + cylindere", startUge: 4, varighedUger: 2, status: "done", ansvarlig: "carl-ras", fromTemplate: true },
      { id: "ph-004-e", navn: "Mads: installere alarm + dørlukker (efter Cafén lukker)", startUge: 6, varighedUger: 1, status: "in-progress", ansvarlig: "partner", fromTemplate: true, beskrivelse: "1/3 enheder færdig. Resten i næste uge — Anders tager med." },
      { id: "ph-004-f", navn: "Mads: instruere Kims personale i alarm-koder", startUge: 7, varighedUger: 1, status: "todo", ansvarlig: "partner", fromTemplate: true },
      { id: "ph-004-g", navn: "Carl Ras: aktivere 24/7 service-aftale", startUge: 8, varighedUger: 1, status: "todo", ansvarlig: "carl-ras", fromTemplate: true },
    ],
  },
  {
    id: "pr-005",
    partnerId: "p-hornbaek-laas",
    kunde: "Familie Birk",
    kontakt: "+45 28 14 02 91",
    type: "Bolig",
    by: "Hornbæk",
    status: "Færdig",
    enheder: 1,
    produktIds: ["40013215"],
    specialistId: "s-jens",
    forventetKr: 3738,
    marginPct: 18,
    deadline: "2026-05-22",
    noter: [
      { tid: "for 4 dage", forfatter: "Mads Sørensen", body: "Færdig, kunde tilfreds. Fået testimonial til /find profilen." },
    ],
    oprettet: "2026-05-12",
    emoji: "🔑",
  },
  {
    id: "pr-006",
    partnerId: "p-hornbaek-laas",
    kunde: "Sommerhus Maja Lund",
    kontakt: "maja.lund@gmail.com",
    type: "Sommerhus",
    by: "Tisvildeleje",
    status: "Konsultation",
    enheder: 1,
    produktIds: ["40013215", "55011840"],
    forventetKr: 3951,
    marginPct: 18,
    deadline: "2026-07-01",
    noter: [
      { tid: "for 2 dage", forfatter: "Mads Sørensen", body: "Henvendelse via Carl Ras finder. Vil have nøglefri adgang inden sommerferien — privatejet, ingen udlejning." },
    ],
    oprettet: "2026-05-25",
    emoji: "🏝️",
  },
];

export function projectsForPartner(partnerId: string): Project[] {
  return PROJECTS.filter((p) => p.partnerId === partnerId).sort((a, b) => b.oprettet.localeCompare(a.oprettet));
}

/* ─────────────────────────── Carl Ras products (real PDPs) ─────────────────────────── */
export type ProductBadge = "NEW" | "OFFER" | "BLÅ PRIS";

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
  badge?: ProductBadge;  // NEW / OFFER / BLÅ PRIS — shown in product cards
  førpris?: string;      // when badge is OFFER — strikethrough price
}

export const PRODUCTS: Product[] = [
  // Smart locks — real product photos pulled from carl-ras.dk PDPs
  { id: "40013215", brand: "STROXX", navn: "Smart Lock ST-2 sort XLOCK · skandinavisk lås", pris: "3.737,50 kr", url: "https://www.carl-ras.dk/langskiltesaet-smart-lock-st-2-sort-xlock-t-skandinavisk-las/?product=40013215/40013215", kategori: "Smart Lock", margin: "≈18% partner", emoji: "🔐", image: "/products/stroxx-st-2-skandinavisk.jpg", badge: "BLÅ PRIS" },
  { id: "40013216", brand: "STROXX", navn: "Smart Lock ST-2 RS XLOCK · europæisk lås", pris: "3.612,50 kr", url: "https://www.carl-ras.dk/langskiltesaet-smart-lock-st-2-rs-xlock-t-europaeisk-las/?product=40013216/40013216", kategori: "Smart Lock", margin: "≈18% partner", emoji: "🔐", image: "/products/stroxx-st-2-europaeisk.jpg", badge: "OFFER", førpris: "4.124,00 kr" },
  { id: "40013955", brand: "STROXX", navn: "Gateway Smart Lock G2 hvid · XLOCK WIFI",     pris: "973,75 kr",   url: "https://www.carl-ras.dk/gateway-smart-lock-g2-hvid-xlock-wifi/?product=40013955/40013955", kategori: "Adgangskontrol", margin: "≈22% partner", emoji: "📡", image: "/products/stroxx-gateway-g2.jpg", badge: "NEW" },

  // Alarm / smoke / motion
  { id: "55011840", brand: "Housegard", navn: "Røgalarm Pebble 10 års SA701 · optisk",    pris: "213,75 kr",   url: "https://www.carl-ras.dk/roegalarm-pebble-10ars-sa701-optisk/?product=55011840/55011840", kategori: "Brand & røg", margin: "≈25% partner", emoji: "🛎️", image: "/products/housegard-pebble.jpg", badge: "BLÅ PRIS" },
  { id: "55011841", brand: "Housegard", navn: "Røgalarm Luma trådløs seriekoblet · 2-pak", pris: "561,25 kr",   url: "https://www.carl-ras.dk/roegalarm-luma-10ars-tradlos-seriekoblet-a-2-stk/?product=55011841/55011841", kategori: "Brand & røg", margin: "≈25% partner", emoji: "🛎️", image: "/products/housegard-luma.jpg", badge: "NEW" },
  { id: "41008815", brand: "Dormakaba", navn: "Normalarm Sølv 0-225 mm t/ED100 og ED250", pris: "1.948,75 kr", url: "https://www.carl-ras.dk/normalarm-soelv-0-225-mm-t-ed100-og-ed250-ny/?product=41008815/41008815", kategori: "Alarm", margin: "≈20% partner", emoji: "🚨", image: "/products/dormakaba-normalarm.jpg", badge: "OFFER", førpris: "2.299,00 kr" },
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
