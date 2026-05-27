"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { PARTNERS, Region, Tier } from "@/lib/data";

const TIERS: Tier[] = ["Bronze", "Sølv", "Guld"];

function tierClass(tier: Tier) {
  const map = { Bronze: "tag tag-bronze", Sølv: "tag tag-soelv", Guld: "tag tag-guld" } as const;
  return map[tier];
}

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
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      <div className="t-eyebrow">Partnere · administration</div>
      <h1 className="t-display mt-3">Partnere</h1>
      <p className="t-body-lg mt-3 max-w-[680px]">
        {PARTNERS.length} aktive partnere på tværs af Gruppens selskaber. Klik for at se profil og opgradere niveau.
      </p>

      {/* Filters */}
      <div className="mt-8 card !p-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Søg firma, ejer eller by…"
          className="flex-1 min-w-[200px] rounded-full px-4 py-2 bg-[var(--canvas-2)] text-[14px] outline-none focus:ring-2 focus:ring-[var(--accent)] border border-transparent"
        />
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as Tier | "Alle")}
          className="rounded-full px-4 py-2 bg-[var(--canvas-2)] text-[14px] border border-transparent focus:ring-2 focus:ring-[var(--accent)] outline-none"
        >
          <option value="Alle">Alle niveauer</option>
          {TIERS.map((t) => <option key={t} value={t}>{t}-partner</option>)}
        </select>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value as Region | "Alle")}
          className="rounded-full px-4 py-2 bg-[var(--canvas-2)] text-[14px] border border-transparent focus:ring-2 focus:ring-[var(--accent)] outline-none"
        >
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="mt-4 text-[12px] text-[var(--ink-3)]">
        Viser {filtered.length} af {PARTNERS.length} partnere
      </div>

      {/* Partner table */}
      <div className="mt-4 card !p-0 overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_140px_120px_80px_120px] gap-4 px-5 py-3 border-b border-[var(--line)] bg-[var(--canvas-2)] text-[12px] uppercase tracking-wider text-[var(--ink-3)] font-semibold">
          <span>Firma · ejer</span>
          <span>Tier</span>
          <span>Faggruppe</span>
          <span>Region</span>
          <span>Sager</span>
          <span>Handling</span>
        </div>
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/admin/partnere/${p.id}`}
            className="grid grid-cols-[1fr_120px_140px_120px_80px_120px] gap-4 px-5 py-4 border-b border-[var(--line-2)] last:border-b-0 items-center hover:bg-[var(--canvas-2)] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-xl grid place-items-center text-white text-[12px] font-semibold shrink-0" style={{ background: p.logoBg }}>
                {p.initialer}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors">{p.firma}</div>
                <div className="text-[12px] text-[var(--ink-3)] truncate">{p.ejer} · {p.by}</div>
              </div>
            </div>
            <span className={tierClass(p.tier)}>{p.tier}</span>
            <span className="text-[13px] text-[var(--ink-2)]">{p.faggruppe}</span>
            <span className="text-[13px] text-[var(--ink-2)]">{p.region}</span>
            <span className="text-[13px] text-[var(--ink)] font-medium tabular-nums">{p.antalSager}</span>
            <span className="text-[13px] font-semibold text-[var(--accent)] text-left inline-flex items-center gap-1">Åbn profil →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
