"use client";
import { useMemo, useState } from "react";
import { PARTNERS, Region, Tier, Faggruppe } from "@/lib/data";

const TIERS: Tier[] = ["Bronze", "Sølv", "Guld"];

export default function AdminPartnere() {
  const [q, setQ] = useState("");
  const [tierFilter, setTierFilter] = useState<Tier | "Alle">("Alle");
  const [regionFilter, setRegionFilter] = useState<Region | "Alle">("Alle");

  const filtered = useMemo(() => {
    return PARTNERS.filter((p) => {
      if (tierFilter !== "Alle" && p.tier !== tierFilter) return false;
      if (regionFilter !== "Alle" && p.region !== regionFilter) return false;
      if (q && !(p.firma + p.ejer + p.by).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, tierFilter, regionFilter]);

  const regions: Array<Region | "Alle"> = ["Alle", "Nordsjælland", "Vestkysten", "Bornholm", "Lolland-Falster", "Hovedstaden", "Østjylland", "Nordjylland"];

  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>PARTNERE · ADMINISTRATION</div>
      <h1 className="t-display-lg mt-3 text-[var(--cr-navy-deep)]">Partnere</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        {PARTNERS.length} aktive partnere på tværs af Gruppens selskaber. Klik for at se profil og opgradere niveau.
      </p>

      {/* Filters */}
      <div className="mt-8 card !p-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Søg firma, ejer eller by…"
          className="flex-1 min-w-[200px] rounded-full px-4 py-2 bg-[var(--surface-pearl)] text-[14px] outline-none focus:ring-2 focus:ring-[var(--cr-blue)] border border-transparent"
        />
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as Tier | "Alle")}
          className="rounded-full px-4 py-2 bg-[var(--surface-pearl)] text-[14px] border border-transparent focus:ring-2 focus:ring-[var(--cr-blue)] outline-none"
        >
          <option value="Alle">Alle niveauer</option>
          {TIERS.map((t) => <option key={t} value={t}>{t}-partner</option>)}
        </select>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value as Region | "Alle")}
          className="rounded-full px-4 py-2 bg-[var(--surface-pearl)] text-[14px] border border-transparent focus:ring-2 focus:ring-[var(--cr-blue)] outline-none"
        >
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="mt-4 text-[12px] text-[var(--ink-muted-48)]">
        Viser {filtered.length} af {PARTNERS.length} partnere
      </div>

      {/* Partner table */}
      <div className="mt-4 card !p-0 overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_140px_100px_100px_120px] gap-4 px-5 py-3 border-b border-[var(--hairline)] bg-[var(--surface-pearl)] text-[11px] uppercase tracking-wider text-[var(--ink-muted-48)] font-semibold">
          <span>Firma · ejer</span>
          <span>Tier</span>
          <span>Faggruppe</span>
          <span>Region</span>
          <span>Sager</span>
          <span>Handling</span>
        </div>
        {filtered.map((p) => (
          <div key={p.id} className="grid grid-cols-[1fr_120px_140px_100px_100px_120px] gap-4 px-5 py-4 border-b border-[var(--divider-soft)] last:border-b-0 items-center hover:bg-[var(--surface-pearl)] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-xl grid place-items-center text-white text-[12px] font-semibold shrink-0" style={{ background: p.logoBg }}>
                {p.initialer}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[var(--cr-navy-deep)] truncate">{p.firma}</div>
                <div className="text-[12px] text-[var(--ink-muted-48)] truncate">{p.ejer} · {p.by}</div>
              </div>
            </div>
            <span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{
                background: p.tier === "Guld" ? "#FFF4D6" : p.tier === "Sølv" ? "#F1F3F5" : "#FBE9DC",
                color: p.tier === "Guld" ? "#7A5300" : p.tier === "Sølv" ? "#52595E" : "#7A3F12",
              }}>{p.tier}</span>
            </span>
            <span className="text-[13px] text-[var(--ink-muted-80)]">{p.faggruppe}</span>
            <span className="text-[13px] text-[var(--ink-muted-80)]">{p.region}</span>
            <span className="text-[13px] text-[var(--cr-navy-deep)] font-medium">{p.antalSager}</span>
            <button className="text-[13px] font-semibold text-[var(--cr-blue)] text-left">Åbn profil →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
