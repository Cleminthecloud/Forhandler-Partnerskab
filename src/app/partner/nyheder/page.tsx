"use client";
import { useState, useMemo } from "react";
import { BLOG_POSTS, BlogPost } from "@/lib/data";
import { THEMES } from "@/lib/themes";
import { Icon } from "@/components/Icon";

const KAT_COLOR: Record<BlogPost["kategori"], { bg: string; ink: string }> = {
  "Tema-update":     { bg: "#FFF1DC", ink: "#7A4400" },
  "Markedsindsigt":  { bg: "#E8F0FA", ink: "#0C447C" },
  "Værktøj":         { bg: "#F3F4F6", ink: "#3A3F44" },
  "Case":            { bg: "#EAF1DC", ink: "#324A14" },
  "Strategi":        { bg: "#FCE4E6", ink: "#7E0309" },
};

const KAT_FILTERS = ["Alle", "Tema-update", "Markedsindsigt", "Case", "Værktøj", "Strategi"] as const;

export default function NyhederPage() {
  const [cat, setCat] = useState<BlogPost["kategori"] | "Alle">("Alle");
  const filtered = useMemo(() => BLOG_POSTS.filter((p) => cat === "Alle" || p.kategori === cat), [cat]);

  const featured = filtered[0];
  const secondary = filtered.slice(1, 3);   // 2 medium cards alongside featured
  const rest = filtered.slice(3);            // remaining go into the grid

  return (
    <div className="px-6 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      {/* ─── HEADER ─── */}
      <header className="mb-8 max-w-[820px]">
        <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>NYHEDER FRA CARL RAS</div>
        <h1 className="t-display mt-3 text-[var(--cr-navy-deep)]">Hvad er nyt</h1>
        <p className="t-lead mt-2">
          Vores specialister deler markedsindsigt, produktnyheder, cases og hvad næste tema bringer.
          Læs hvad der virker for andre partnere.
        </p>
      </header>

      {/* ─── FILTER ─── */}
      <div className="mb-7 flex flex-wrap gap-1.5">
        {KAT_FILTERS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              "px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors border " +
              (cat === c
                ? "bg-[var(--cr-navy-deep)] text-white border-transparent"
                : "bg-white text-[var(--ink-2)] border-[var(--line-2)] hover:border-[var(--ink-3)]")
            }
          >
            {c}
          </button>
        ))}
        <div className="flex-1" />
        <div className="text-[12px] text-[var(--ink-3)] inline-flex items-center gap-1.5 self-center">
          <Icon name="book-open" size={13} /> {filtered.length} artikler
        </div>
      </div>

      {/* ─── HERO + SECONDARY ─── */}
      {featured && (
        <section className="grid gap-3 lg:grid-cols-[1.7fr_1fr] mb-6">
          {/* Featured */}
          <FeaturedCard post={featured} />

          {/* Secondary stack */}
          <div className="grid gap-3 grid-rows-2 min-h-[420px]">
            {secondary.map((p) => (
              <SecondaryCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── GRID ─── */}
      {rest.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {rest.map((p) => (
            <ArticleCard key={p.id} post={p} />
          ))}
        </section>
      )}

      {filtered.length === 0 && (
        <div className="card p-10 text-center">
          <div className="t-h3 text-[var(--ink-3)]">Ingen artikler i denne kategori endnu</div>
          <p className="t-body !text-[var(--ink-3)] mt-2">Prøv en anden kategori — eller kig forbi igen om et par dage.</p>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Cards ──────────────────────── */

function FeaturedCard({ post }: { post: BlogPost }) {
  const tema = post.tema ? THEMES.find((t) => t.id === post.tema) : null;
  return (
    <article className="card !p-0 overflow-hidden flex flex-col group cursor-pointer hover:shadow-[var(--shadow-3)] transition-shadow h-full min-h-[420px]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--canvas-2)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.titel} className="size-full object-cover group-hover:scale-[1.02] transition-transform duration-500" loading="eager" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          <KategoriPill kategori={post.kategori} />
          {tema && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: tema.accentSoft, color: tema.accentInk }}
            >
              {tema.label}
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-4 inline-flex items-center gap-1.5 text-[12px] text-white/90 font-medium">
          <Icon name="clock" size={11} /> {post.læsetid}
        </div>
      </div>
      <div className="p-6 lg:p-7 flex-1 flex flex-col">
        <h2 className="text-[26px] lg:text-[28px] font-semibold text-[var(--cr-navy-deep)] leading-[1.2] tracking-tight">{post.titel}</h2>
        <p className="text-[14.5px] text-[var(--ink-2)] mt-3 leading-[1.6] line-clamp-3">{post.excerpt}</p>
        <div className="mt-auto pt-5 flex items-center gap-3">
          <AuthorChip post={post} size="md" />
          <div className="flex-1" />
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent-press)] group-hover:gap-2 transition-all">
            Læs artiklen <Icon name="chevron-right" size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

function SecondaryCard({ post }: { post: BlogPost }) {
  return (
    <article className="card !p-0 overflow-hidden flex group cursor-pointer hover:shadow-[var(--shadow-2)] transition-shadow">
      <div className="relative w-[40%] shrink-0 overflow-hidden bg-[var(--canvas-2)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.titel} className="size-full object-cover group-hover:scale-[1.04] transition-transform duration-500" loading="lazy" />
      </div>
      <div className="p-4 lg:p-5 flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <KategoriPill kategori={post.kategori} small />
          <span className="text-[12px] text-[var(--ink-3)] tabular-nums">{post.læsetid}</span>
        </div>
        <h3 className="mt-2 text-[15.5px] font-semibold text-[var(--cr-navy-deep)] leading-[1.3] line-clamp-3">{post.titel}</h3>
        <p className="text-[12.5px] text-[var(--ink-3)] mt-1.5 leading-[1.5] line-clamp-2">{post.excerpt}</p>
        <div className="mt-auto pt-3">
          <AuthorChip post={post} size="sm" />
        </div>
      </div>
    </article>
  );
}

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <article className="card !p-0 overflow-hidden flex flex-col h-full group cursor-pointer hover:shadow-[var(--shadow-2)] transition-shadow">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--canvas-2)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.titel} className="size-full object-cover group-hover:scale-[1.04] transition-transform duration-500" loading="lazy" />
        <div className="absolute top-3 left-3">
          <KategoriPill kategori={post.kategori} />
        </div>
      </div>
      <div className="p-4 lg:p-5 flex-1 flex flex-col">
        <h3 className="text-[15.5px] font-semibold text-[var(--cr-navy-deep)] leading-[1.3] line-clamp-2 min-h-[40px]">{post.titel}</h3>
        <p className="text-[12.5px] text-[var(--ink-3)] mt-2 leading-[1.5] line-clamp-3 flex-1">{post.excerpt}</p>
        <div className="mt-3 pt-3 border-t border-[var(--line-2)] flex items-center justify-between gap-3">
          <AuthorChip post={post} size="sm" />
          <span className="text-[12px] text-[var(--ink-3)] tabular-nums inline-flex items-center gap-1 shrink-0">
            <Icon name="clock" size={10} /> {post.læsetid}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ──────────────────────── Subcomponents ──────────────────────── */

function KategoriPill({ kategori, small }: { kategori: BlogPost["kategori"]; small?: boolean }) {
  const c = KAT_COLOR[kategori];
  return (
    <span
      className={
        "inline-flex font-semibold uppercase tracking-wide rounded-full " +
        (small ? "text-[9.5px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5")
      }
      style={{ background: c.bg, color: c.ink }}
    >
      {kategori}
    </span>
  );
}

function AuthorChip({ post, size }: { post: BlogPost; size: "sm" | "md" }) {
  const av = size === "md" ? "size-9" : "size-7";
  const txt = size === "md" ? "text-[13.5px]" : "text-[12px]";
  const role = size === "md" ? "text-[12px]" : "text-[10.5px]";
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div
        className={`${av} rounded-full grid place-items-center text-white font-semibold shrink-0`}
        style={{ background: post.forfatterBg, fontSize: size === "md" ? 12 : 10 }}
      >
        {post.forfatterInitialer}
      </div>
      <div className="min-w-0">
        <div className={`${txt} font-semibold text-[var(--ink)] truncate leading-tight`}>{post.forfatter}</div>
        <div className={`${role} text-[var(--ink-3)] truncate leading-tight mt-0.5`}>{post.forfatterRolle} · {post.dato}</div>
      </div>
    </div>
  );
}
