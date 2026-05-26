export type ThemeId = "sommer-sikring" | "vinter-byg" | "indbrud-efterar";

export interface Theme {
  id: ThemeId;
  label: string;            // "Sommerhussikring"
  bu: string;               // "Sikring" / "Byg"
  season: string;           // "Sommer 2026"
  status: "Aktiv" | "Næste" | "Planlagt";
  accent: string;           // hex used for --theme-accent
  accentSoft: string;
  accentInk: string;
  tagline: string;
  hero: string;             // 1-liner used on hero cards
  flagEmoji: string;
}

export const THEMES: Theme[] = [
  {
    id: "sommer-sikring",
    label: "Sommerhussikring",
    bu: "Carl Ras Sikring",
    season: "Sommer 2026",
    status: "Aktiv",
    accent: "#F49100",
    accentSoft: "#FFF1DC",
    accentInk: "#7A4400",
    tagline: "Test #1 · 90-dages pilot",
    hero: "Smart locks, alarmer og sikringspakker til sommerhuset. Konsulentens kuffert er klar.",
    flagEmoji: "☀️",
  },
  {
    id: "vinter-byg",
    label: "Vinterklargøring",
    bu: "Carl Ras Byg",
    season: "Efterår 2026",
    status: "Næste",
    accent: "#5B7F2C",
    accentSoft: "#EAF1DC",
    accentInk: "#324A14",
    tagline: "Næste tema · klar Q4",
    hero: "Tagrender, isolering og frostsikring. Tømrerens kuffert er under udvikling.",
    flagEmoji: "🍂",
  },
  {
    id: "indbrud-efterar",
    label: "Indbrudssikring efterår",
    bu: "Carl Ras Sikring",
    season: "Efterår 2026",
    status: "Planlagt",
    accent: "#E30613",
    accentSoft: "#FCE4E6",
    accentInk: "#7E0309",
    tagline: "Cross-tema · samme partner",
    hero: "Når mørket falder på. Indbrudssikring til parcelhusets højsæson.",
    flagEmoji: "🔒",
  },
];

export const DEFAULT_THEME: ThemeId = "sommer-sikring";
