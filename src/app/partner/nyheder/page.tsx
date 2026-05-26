"use client";
import { useState, useMemo } from "react";
import { BLOG_POSTS, BlogPost } from "@/lib/data";
import { THEMES } from "@/lib/themes";

const KAT_COLOR: Record<BlogPost["kategori"], { bg: string; ink: string }> = {
  "Tema-update":     { bg: "#FFF1DC", ink: "#7A4400" },
  "Markedsindsigt":  { bg: "#E8F0FA", ink: "#0C447C" },
  "Værktøj":         { bg: "#F3F4F6", ink: "#444" },
  "Case":            { bg: "#EAF1DC", ink: "#324A14" },
  "Strategi":        { bg: "#FCE4E6", ink: "#7E0309" },
};

export default function NyhederPage() {
  const [cat, setCat] = useState<BlogPost["kategori"] | "Alle">("Alle");
  const filtered = useMemo(() => BLOG_POSTS.filter((p) => cat === "Alle" || p.kategori === cat), [cat]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10">
      <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>NYHEDER FRA CARL RAS</div>
      <h1 className="t-display mt-3 text-[var(--cr-navy-deep)]">Hvad er nyt</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Vores specialister deler markedsindsigt, produktnyheder, cases, og hvad næste tema bringer.
        Læs hvad der virker for andre partnere.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {(["Alle", "Tema-update", "Markedsindsigt", "Case", "Værktøj", "Strategi"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={"px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors " +
              (cat === c ? "border-transparent bg-[var(--cr-navy-deep)] text-white" : "border-[var(--hairline)] bg-white hover:bg-[var(--surface-pearl)]")}
          >
            {c}
          </button>
        ))}
      </div>

      {featured && (
        <article className="mt-8 card !p-0 overflow-hidden grid md:grid-cols-[1fr_300px]">
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: KAT_COLOR[featured.kategori].bg, color: KAT_COLOR[featured.kategori].ink }}>
                {featured.kategori}
              </span>
              {featured.tema && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{
                  background: THEMES.find((t) => t.id === featured.tema)?.accentSoft,
                  color: THEMES.find((t) => t.id === featured.tema)?.accentInk,
                }}>
                  {THEMES.find((t) => t.id === featured.tema)?.label}
                </span>
              )}
              <span className="text-[12px] text-[var(--ink-muted-48)]">{featured.dato} · {featured.læsetid}</span>
            </div>
            <h2 className="mt-3 text-[28px] font-semibold text-[var(--cr-navy-deep)] leading-tight tracking-tight">{featured.titel}</h2>
            <p className="text-[15px] text-[var(--ink-muted-80)] mt-3 leading-relaxed">{featured.excerpt}</p>
            <div className="mt-5 flex items-center gap-3 text-[13px]">
              <span className="text-[var(--ink-muted-48)]">Skrevet af</span>
              <strong className="text-[var(--cr-navy-deep)]">{featured.forfatter}</strong>
              <span className="text-[var(--ink-muted-48)]">· {featured.forfatterRolle}</span>
            </div>
            <button className="mt-6 pill pill-primary">Læs hele artiklen →</button>
          </div>
          <div className="hidden md:grid place-items-center bg-[var(--cr-blue-tint)] text-[120px]">
            {featured.hero}
          </div>
        </article>
      )}

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <article key={p.id} className="card hover:shadow-[0_8px_24px_rgba(0,45,89,0.06)] transition-shadow flex flex-col">
            <div className="size-14 rounded-2xl grid place-items-center text-3xl bg-[var(--surface-pearl)]">{p.hero}</div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: KAT_COLOR[p.kategori].bg, color: KAT_COLOR[p.kategori].ink }}>
                {p.kategori}
              </span>
              <span className="text-[11px] text-[var(--ink-muted-48)]">{p.læsetid}</span>
            </div>
            <h3 className="mt-2 text-[16px] font-semibold text-[var(--cr-navy-deep)] leading-tight">{p.titel}</h3>
            <p className="text-[13px] text-[var(--ink-muted-80)] mt-2 line-clamp-3 flex-1">{p.excerpt}</p>
            <div className="mt-3 text-[12px] text-[var(--ink-muted-48)]">
              {p.forfatter} · {p.dato}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
