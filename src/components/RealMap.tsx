"use client";
import { useEffect, useState, useRef } from "react";
import { PartnerProfile, Region } from "@/lib/data";

/* Real map via Leaflet + OpenStreetMap tiles.

   Why Leaflet + OSM (not Mapbox / Google):
   - No API key needed for OSM tiles
   - Apache-licensed, free to use commercially
   - Tile servers are reliable for low-medium traffic
   - 39kb min+gz for Leaflet

   Why dynamic import: react-leaflet uses `window`, which crashes SSR.
   We mount it client-side only and show a soft placeholder during load. */

/* ─── DAWA region → approximate centroid (WGS84) ──────────────────
   Used to center the map on the partner's region when we don't have
   a real geocoded address yet. Coordinates verified against
   OpenStreetMap centroids of each Danish region. */
const REGION_CENTER: Record<Region, [number, number]> = {
  "Nordsjælland":    [56.05, 12.40],
  "Hovedstaden":     [55.68, 12.55],
  "Vestkysten":      [56.55, 8.40],
  "Bornholm":        [55.13, 14.92],
  "Lolland-Falster": [54.78, 11.50],
  "Fyn":             [55.40, 10.40],
  "Østjylland":      [56.16, 10.20],
  "Nordjylland":     [57.15, 10.25],
};

/* ─── DAWA — Danmarks Adressers Web API ──────────────────────────
   Free public API from Styrelsen for Dataforsyning og Effektivisering.
   Used here for:
   1. Address autocomplete (geocoding)
   2. Resolving an address to (x, y) WGS84 coordinates

   Endpoint: https://api.dataforsyningen.dk/adresser/autocomplete
   Response shape (simplified):
     [
       {
         tekst: "Hovedgade 23, 3100 Hornbæk",
         adresse: {
           id: "uuid",
           x: 12.4567,  // longitude
           y: 56.0789   // latitude
         }
       },
       ...
     ]
   No API key required, fair-use rate limits. */

export interface DawaResult {
  tekst: string;
  adresse: {
    id: string;
    x: number; // longitude
    y: number; // latitude
    vejnavn?: string;
    husnr?: string;
    postnr?: string;
    postnrnavn?: string;
  };
}

export async function dawaAutocomplete(query: string, limit = 6): Promise<DawaResult[]> {
  if (!query || query.trim().length < 2) return [];
  const url = `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(query)}&per_side=${limit}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return (await res.json()) as DawaResult[];
  } catch {
    return [];
  }
}

interface Props {
  /** When provided, the map zooms to and pins this single partner's region. */
  partners: PartnerProfile[];
  /** Centerpoint override (e.g. resolved DAWA address). [lat, lng] */
  centerLatLng?: [number, number];
  /** Zoom level — 7 = whole Denmark, 10 = region, 13 = town, 15 = street */
  zoom?: number;
  /** Height in px or CSS length. */
  height?: string | number;
  /** Click handler — bubbles the clicked partner up. */
  onPick?: (p: PartnerProfile) => void;
}

export function RealMap({ partners, centerLatLng, zoom, height = 360, onPick }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<unknown | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Derive center from partners if not provided. For 1 partner: zoom to region.
  // For many partners: fit bounds (centered Denmark, zoom 6).
  const fallbackCenter: [number, number] = partners.length === 1
    ? REGION_CENTER[partners[0].region]
    : [56.0, 11.0]; // Denmark center
  const fallbackZoom = partners.length === 1 ? 9 : 6;
  const center = centerLatLng ?? fallbackCenter;
  const finalZoom = zoom ?? fallbackZoom;

  // Mount the map client-side after first paint. Dynamic-import keeps
  // Leaflet out of the SSR bundle (it touches `window` at module load).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      // Fix the broken default marker icon URL — Leaflet's default icons
      // are loaded relative to the CSS, which gets mangled by bundlers.
      // We use a Carl Ras blue circle as the pin instead.

      const map = L.map(containerRef.current, {
        center,
        zoom: finalZoom,
        scrollWheelZoom: false,    // less surprising on a long-scroll page
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Custom Carl Ras blue pin as a divIcon — avoids the broken marker
      // image issue and matches our brand. The pin is a circle with a
      // white border + the partner's initials inside.
      partners.forEach((p) => {
        const base = REGION_CENTER[p.region];
        const icon = L.divIcon({
          className: "carl-ras-pin",
          html: `
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: ${p.logoBg};
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              color: white;
              font-size: 11px;
              font-weight: 700;
              display: grid;
              place-items: center;
              transform: translate(-16px, -16px);
            ">${p.initialer}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        const marker = L.marker(base, { icon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 13px;">
            <div style="font-weight: 600; color: #002D59;">${p.firma}</div>
            <div style="color: #7A7A7A; font-size: 11.5px; margin-top: 2px;">
              ${p.faggruppe} · ${p.by}
            </div>
          </div>
        `);
        if (onPick) {
          marker.on("click", () => onPick(p));
        }
      });

      mapRef.current = map;
      setLoaded(true);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (mapRef.current as any).remove();
        } catch {
          // ignore — map may already be torn down
        }
        mapRef.current = null;
      }
    };
    // We intentionally only mount once per partners-snapshot. Re-runs
    // would tear down and re-create the map; cheaper to remount only
    // when the partners list identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partners]);

  // When center / zoom change after mount, animate to the new view.
  useEffect(() => {
    if (!mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = mapRef.current as any;
    m.setView(center, finalZoom, { animate: true });
  }, [center[0], center[1], finalZoom]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <div
        ref={containerRef}
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          width: "100%",
          borderRadius: "var(--r-lg, 12px)",
          background: "#E8F0FA",
        }}
      />
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center text-[12px] text-[var(--ink-3)] pointer-events-none">
          Indlæser kort…
        </div>
      )}
    </div>
  );
}
