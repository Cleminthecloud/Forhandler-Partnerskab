"use client";
import { useState, useMemo } from "react";
import { BLOG_POSTS, BlogPost } from "@/lib/data";
import { THEMES } from "@/lib/themes";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";

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
      <div className="mb-8">
        <PageHeader
          eyebrow="Nyheder fra Carl Ras"
          title="Hvad er nyt"
          lead="Vores specialister deler markedsindsigt, produktnyheder, cases og hvad næste tema bringer. Læs hvad der virker for andre partnere."
        />
      </div>

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

/* All article cards route to the real Carl Ras Specialisten blog. This is
   intentional: the demo's nyheder grid is the funnel — we use it to drive
   traffic to carl-ras.dk where the actual content lives and where SEO,
   newsletter signup, and product cross-sell happen. Each card opens in a
   new tab so the partner doesn't lose their place inside the platform. */
const SPECIALISTEN_URL = "https://www.carl-ras.dk/specialisten/";

/* All three card variants share the /find Airbnb-feel pattern:
   bg-[var(--canvas)] → rounded-[var(--r-xl)] (22px) → overflow-hidden,
   hover lifts the card 1px and bumps shadow from --shadow-1 to --shadow-3,
   image zooms 1.05 over 600ms. Anchors on the photo: category top-left,
   theme top-right, reading time bottom-right. */

function FeaturedCard({ post }: { post: BlogPost }) {
  const tema = post.tema ? THEMES.find((t) => t.id === post.tema) : null;
  return (
    <a
      href={SPECIALISTEN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-[var(--canvas)] rounded-[var(--r-xl)] overflow-hidden transition-all hover:-translate-y-1 shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-3)] cursor-pointer flex flex-col h-full min-h-[420px] no-underline"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--canvas-2)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.titel} className="absolute inset-0 size-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" loading="eager" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 35%, transparent 60%)" }} />

        {/* Top-left: kategori chip */}
        <div className="absolute top-3 left-3">
          <KategoriPill kategori={post.kategori} />
        </div>

        {/* Top-right: tema chip on blurred white */}
        {tema && (
          <span
            className="absolute top-3 right-3 text-[11.5px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.92)", color: tema.accentInk }}
          >
            <span className="inline-block size-1.5 rounded-full mr-1.5 align-middle" style={{ background: tema.accent }} />
            {tema.label}
          </span>
        )}

        {/* Bottom-right: reading time on the image */}
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-[12px] text-white font-semibold drop-shadow">
          <Icon name="clock" size={11} /> {post.læsetid}
        </div>
      </div>
      <div className="p-6 lg:p-7 flex-1 flex flex-col">
        <h2 className="text-[26px] lg:text-[28px] font-semibold text-[var(--cr-navy-deep)] leading-[1.2] tracking-tight group-hover:text-[var(--accent-press)] transition-colors">{post.titel}</h2>
        <p className="text-[14.5px] text-[var(--ink-2)] mt-3 leading-[1.6] line-clamp-3">{post.excerpt}</p>
        <div className="mt-auto pt-5 border-t border-[var(--line-2)] flex items-center gap-3">
          <AuthorChip post={post} size="md" />
          <div className="flex-1" />
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)] group-hover:gap-2 transition-all">
            Læs artiklen <Icon name="chevron-right" size={14} />
          </span>
        </div>
      </div>
    </a>
  );
}

function SecondaryCard({ post }: { post: BlogPost }) {
  return (
    <a
      href={SPECIALISTEN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-[var(--canvas)] rounded-[var(--r-xl)] overflow-hidden transition-all hover:-translate-y-1 shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-3)] cursor-pointer flex no-underline"
    >
      <div className="relative w-[40%] shrink-0 overflow-hidden bg-[var(--canvas-2)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.titel} className="absolute inset-0 size-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" loading="lazy" />
      </div>
      <div className="p-4 lg:p-5 flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <KategoriPill kategori={post.kategori} small />
          <span className="text-[12px] text-[var(--ink-3)] tabular-nums inline-flex items-center gap-1">
            <Icon name="clock" size={10} /> {post.læsetid}
          </span>
        </div>
        <h3 className="mt-2 text-[15.5px] font-semibold text-[var(--cr-navy-deep)] leading-[1.3] line-clamp-3 group-hover:text-[var(--accent-press)] transition-colors">{post.titel}</h3>
        <p className="text-[12.5px] text-[var(--ink-3)] mt-1.5 leading-[1.5] line-clamp-2">{post.excerpt}</p>
        <div className="mt-auto pt-3 border-t border-[var(--line-2)]">
          <AuthorChip post={post} size="sm" />
        </div>
      </div>
    </a>
  );
}

function ArticleCard({ post }: { post: BlogPost }) {
  const tema = post.tema ? THEMES.find((t) => t.id === post.tema) : null;
  return (
    <a
      href={SPECIALISTEN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-[var(--canvas)] rounded-[var(--r-xl)] overflow-hidden transition-all hover:-translate-y-1 shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-3)] cursor-pointer flex flex-col h-full no-underline"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--canvas-2)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.titel} className="absolute inset-0 size-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 40%)" }} />

        {/* Top-left: kategori chip */}
        <div className="absolute top-3 left-3">
          <KategoriPill kategori={post.kategori} />
        </div>

        {/* Bottom-right: reading time on the image */}
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-[12px] text-white font-semibold drop-shadow">
          <Icon name="clock" size={11} /> {post.læsetid}
        </div>

        {/* Bottom-left: theme dot if present */}
        {tema && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-[11.5px] text-white font-semibold drop-shadow">
            <span className="size-2 rounded-full" style={{ background: tema.accent }} />
            {tema.label}
          </span>
        )}
      </div>
      <div className="p-4 lg:p-5 flex-1 flex flex-col">
        <h3 className="text-[15.5px] font-semibold text-[var(--cr-navy-deep)] leading-[1.3] line-clamp-2 min-h-[40px] group-hover:text-[var(--accent-press)] transition-colors">{post.titel}</h3>
        <p className="text-[12.5px] text-[var(--ink-3)] mt-2 leading-[1.5] line-clamp-3 flex-1">{post.excerpt}</p>
        <div className="mt-3 pt-3 border-t border-[var(--line-2)] flex items-center justify-between gap-3">
          <AuthorChip post={post} size="sm" />
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)] group-hover:gap-1.5 transition-all shrink-0">
            Læs <Icon name="chevron-right" size={12} />
          </span>
        </div>
      </div>
    </a>
  );
}

/* ──────────────────────── Subcomponents ──────────────────────── */

function KategoriPill({ kategori, small }: { kategori: BlogPost["kategori"]; small?: boolean }) {
  const c = KAT_COLOR[kategori];
  return (
    <span
      className={
        "inline-flex font-semibold uppercase tracking-wide rounded-full " +
        (small ? "text-[9.5px] px-1.5 py-0.5" : "text-[12px] px-2 py-0.5")
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
  const role = size === "md" ? "text-[12px]" : "text-[12px]";
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {/* Portrait if present, else colored initials disc — same dimensions
          so the layout doesn't shift between specialists. */}
      {post.forfatterPortrait ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.forfatterPortrait}
          alt={post.forfatter}
          className={`${av} rounded-full object-cover shrink-0`}
        />
      ) : (
        <div
          className={`${av} rounded-full grid place-items-center text-white font-semibold shrink-0`}
          style={{ background: post.forfatterBg, fontSize: size === "md" ? 12 : 10 }}
        >
          {post.forfatterInitialer}
        </div>
      )}
      <div className="min-w-0">
        <div className={`${txt} font-semibold text-[var(--ink)] truncate leading-tight`}>{post.forfatter}</div>
        <div className={`${role} text-[var(--ink-3)] truncate leading-tight mt-0.5`}>{post.forfatterRolle} · {post.dato}</div>
      </div>
    </div>
  );
}
