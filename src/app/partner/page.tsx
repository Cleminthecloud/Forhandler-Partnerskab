"use client";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { CURRENT_PARTNER, CAMPAIGNS, EVENTS, BLOG_POSTS, CHAT_THREADS, SPECIALISTS, PARTNERS, FORUM_THREADS } from "@/lib/data";

export default function PartnerDashboard() {
  const { theme } = useTheme();
  const { leads } = useApp();

  const myLeads = leads.filter((l) => l.partnerId === CURRENT_PARTNER.id);
  const newLeads = myLeads.filter((l) => l.status === "Ny");
  const wonLeads = myLeads.filter((l) => l.status === "Vundet");

  const activeCampaign =
    CAMPAIGNS.find((c) => c.tema === theme.id && c.status === "Aktiv") ??
    CAMPAIGNS.find((c) => c.tema === theme.id);
  const upcoming = EVENTS
    .filter((e) => new Date(e.dato) >= new Date("2026-05-26"))
    .sort((a, b) => a.dato.localeCompare(b.dato));
  const nextEvent = upcoming[0];
  const latestPost = BLOG_POSTS[0];
  const latestThread = Object.values(CHAT_THREADS)[0];
  const latestChatSpec = SPECIALISTS.find((s) => s.id === latestThread.specialistId)!;
  const latestChatMsg = latestThread.messages[latestThread.messages.length - 1];

  // "Din region" data
  const myRegionPartners = PARTNERS.filter((p) => p.region === CURRENT_PARTNER.region && p.id !== CURRENT_PARTNER.id);
  const myRegionEvent = upcoming.find((e) => e.region === CURRENT_PARTNER.region);
  const topThread = [...FORUM_THREADS].sort((a, b) => b.likes - a.likes)[0];

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      {/* ─── HEADER ───────────────────────────────────────────────── */}
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="t-eyebrow flex items-center gap-2">
            <span className="theme-dot" style={{ background: theme.accent }} />
            <span>{theme.label} · {theme.season}</span>
          </div>
          <h1 className="t-display mt-3">
            God morgen, {CURRENT_PARTNER.ejer.split(" ")[0]}.
          </h1>
          <p className="t-body-lg mt-3 max-w-[640px]">
            {newLeads.length > 0 ? (
              <>
                Du har <strong className="text-[var(--ink)] font-semibold">{newLeads.length} nye leads</strong>{" "}
                fra Carl Ras Partnerfinder. Aktiv kampagne: {activeCampaign?.titel}.
              </>
            ) : (
              <>Alt er ajourført. Næste lead-push starter mandag.</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/partner/leads" className="btn btn-secondary">Se alle leads</Link>
          <Link href="/partner/kampagner" className="btn btn-primary">Åbn Materialer</Link>
        </div>
      </header>

      {/* ─── KPI ROW ──────────────────────────────────────────────── */}
      <section aria-label="Nøgletal" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Kpi label="Nye leads"      value={newLeads.length}     sub="i denne uge" delta="+2" />
        <Kpi label="Vundne sager"   value={wonLeads.length}     sub="seneste 30 dage" delta="+1" />
        <Kpi label="Konvertering"   value="51%"                  sub="3 pp over snittet" />
        <Kpi label="Point til Guld" value={`${CURRENT_PARTNER.pointsTilNæste - CURRENT_PARTNER.points}`} sub={`${Math.round((CURRENT_PARTNER.points / CURRENT_PARTNER.pointsTilNæste) * 100)}% af vejen`} />
      </section>

      {/* ─── HERO: active campaign ───────────────────────────────── */}
      {activeCampaign && (
        <Link
          href="/partner/kampagner"
          aria-label={`Åbn kampagnen ${activeCampaign.titel} i Materialer`}
          className="block rounded-[20px] mb-8 overflow-hidden group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-3)]"
          style={{ background: theme.accentSoft }}
        >
          <div className="grid lg:grid-cols-[1.4fr_1fr]">
            <div className="p-8 lg:p-10 xl:p-12">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: theme.accentInk }}>
                Aktiv kampagne · klar at bruge
              </div>
              <h2
                className="mt-3 font-semibold leading-[1.05] tracking-[-0.02em]"
                style={{ color: theme.accentInk, fontSize: "clamp(32px, 3.6vw, 48px)" }}
              >
                {activeCampaign.titel}
              </h2>
              <p className="mt-4 text-[17px] leading-[1.45] max-w-[560px]" style={{ color: theme.accentInk, opacity: 0.78 }}>
                {activeCampaign.hovedbudskab}
              </p>

              <div className="mt-8 flex items-center gap-6">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: theme.accentInk, opacity: 0.6 }}>
                    Formater
                  </div>
                  <div className="text-[20px] font-semibold mt-0.5" style={{ color: theme.accentInk }}>
                    {activeCampaign.formater.length}
                  </div>
                </div>
                <div className="w-px h-10" style={{ background: theme.accentInk, opacity: 0.15 }} />
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: theme.accentInk, opacity: 0.6 }}>
                    Brugt af partnere
                  </div>
                  <div className="text-[20px] font-semibold mt-0.5" style={{ color: theme.accentInk }}>
                    23 <span className="text-[13px] font-normal" style={{ opacity: 0.7 }}>denne uge</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: theme.accentInk }}>
                Brug i Materialer
                <ArrowRight />
              </div>
            </div>

            {/* Right panel — product-tile feel with a soft radial halo */}
            <div
              className="hidden lg:flex items-center justify-center relative overflow-hidden"
              style={{
                background: `radial-gradient(circle at 50% 45%, ${theme.accent}26 0%, transparent 70%)`,
              }}
              aria-hidden="true"
            >
              <div className="text-[200px] leading-none select-none" style={{ filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.18))" }}>
                {activeCampaign.heroEmoji}
              </div>
              {/* Tiny preview chips at bottom */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-1.5">
                {activeCampaign.formater.slice(0, 4).map((f) => (
                  <span key={f} className="text-[11px] px-2 py-1 rounded-full bg-white/70 backdrop-blur-sm font-medium" style={{ color: theme.accentInk }}>
                    {labelForFormat(f)}
                  </span>
                ))}
                {activeCampaign.formater.length > 4 && (
                  <span className="text-[11px] px-2 py-1 rounded-full font-medium" style={{ color: theme.accentInk, opacity: 0.7 }}>
                    +{activeCampaign.formater.length - 4}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ─── 3-COL: leads | event | region ──────────────────────── */}
      <section className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-8">
        {/* Leads */}
        <Link href="/partner/leads" className="card card-hover block">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="t-h3">Nye leads</h3>
            <span className="t-caption">Carl-ras.dk</span>
          </div>
          <div className="text-[28px] font-semibold leading-none text-[var(--ink)] mb-4">
            {newLeads.length} <span className="text-[var(--ink-3)] text-[15px] font-normal">venter</span>
          </div>
          <ul className="divide-y divide-[var(--line-2)] -mx-2">
            {newLeads.slice(0, 3).map((l) => (
              <li key={l.id} className="py-2.5 px-2 flex items-center gap-3">
                <span className="size-1.5 rounded-full shrink-0 bg-[var(--accent)]" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[var(--ink)] truncate">{l.kunde}</div>
                  <div className="text-[12px] text-[var(--ink-3)] truncate">{l.behov}</div>
                </div>
                <span className="text-[11px] text-[var(--ink-3)] shrink-0">{l.værdi}</span>
              </li>
            ))}
            {newLeads.length === 0 && (
              <li className="py-6 text-center text-[14px] text-[var(--ink-3)]">Ingen nye leads.</li>
            )}
          </ul>
          <div className="mt-4 text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1">
            Åbn indbakken <ArrowRight />
          </div>
        </Link>

        {/* Next event */}
        <Link href="/partner/events" className="card card-hover block">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="t-h3">Næste event</h3>
            <span className="t-caption">{nextEvent.tilmeldte}/{nextEvent.pladser} tilmeldt</span>
          </div>
          <div className="flex items-start gap-4">
            <DateChip iso={nextEvent.dato} />
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold text-[var(--ink)] leading-snug">{nextEvent.titel}</div>
              <div className="text-[12px] text-[var(--ink-3)] mt-1.5">
                {nextEvent.tid} · {nextEvent.lokation.split(",")[0]}
              </div>
              <div className="text-[12px] text-[var(--ink-3)] mt-0.5">
                Vært: <span className="text-[var(--ink-2)]">{nextEvent.vært}</span>
              </div>
            </div>
          </div>
          <div className="mt-5 text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1">
            Tilmeld <ArrowRight />
          </div>
        </Link>

        {/* Din region */}
        <div className="card md:col-span-2 xl:col-span-1">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="t-h3">Din region · {CURRENT_PARTNER.region}</h3>
            <span className="t-caption">{myRegionPartners.length} partnere</span>
          </div>
          <ul className="divide-y divide-[var(--line-2)] -mx-2">
            {myRegionPartners.slice(0, 3).map((p) => (
              <li key={p.id} className="py-2.5 px-2 flex items-center gap-3">
                <div className="size-7 rounded-lg grid place-items-center text-white text-[10px] font-semibold shrink-0" style={{ background: p.logoBg }} aria-hidden="true">
                  {p.initialer}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[var(--ink)] truncate">{p.firma}</div>
                  <div className="text-[12px] text-[var(--ink-3)] truncate">{p.faggruppe} · {p.by}</div>
                </div>
                <span className="text-[11px] text-[var(--ink-3)] shrink-0">{p.tier}</span>
              </li>
            ))}
          </ul>
          {myRegionEvent && (
            <div className="mt-4 pt-4 border-t border-[var(--line-2)]">
              <div className="t-caption mb-1">Lokal samling</div>
              <div className="text-[13px] font-medium text-[var(--ink)] truncate">{myRegionEvent.titel}</div>
              <div className="text-[12px] text-[var(--ink-3)]">
                {new Date(myRegionEvent.dato).toLocaleDateString("da-DK", { day: "numeric", month: "long" })} · {myRegionEvent.lokation.split(",")[0]}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── 3-COL: chat | blog | forum ─────────────────────────── */}
      <section className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <Link href="/partner/specialister" className="card card-hover block">
          <h3 className="t-h3 mb-4">Tal med Carl Ras</h3>
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-full text-white font-semibold grid place-items-center shrink-0 text-[13px]"
              style={{ background: latestChatSpec.bg }}
              aria-hidden="true"
            >
              {latestChatSpec.initialer}
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-[var(--ink)]">{latestChatSpec.navn}</div>
              <div className="text-[12px] text-[var(--ink-3)]">{latestChatSpec.rolle} · {latestChatSpec.bu}</div>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-[var(--ink-2)] line-clamp-3 leading-[1.5]">{latestChatMsg.text}</p>
          <div className="mt-4 text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1">
            Læs samtalen <ArrowRight />
          </div>
        </Link>

        <Link href="/partner/nyheder" className="card card-hover block">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="t-h3">Nyt fra Carl Ras</h3>
            <span className="t-caption">{latestPost.dato}</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="size-11 rounded-xl bg-[var(--canvas-2)] grid place-items-center text-[22px] shrink-0" aria-hidden="true">
              {latestPost.hero}
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-[var(--ink)] leading-snug">{latestPost.titel}</div>
              <p className="mt-1 text-[12px] text-[var(--ink-3)] line-clamp-2 leading-[1.5]">{latestPost.excerpt}</p>
            </div>
          </div>
          <div className="mt-4 text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1">
            Læs hele <ArrowRight />
          </div>
        </Link>

        <Link href="/partner/forum" className="card card-hover block">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="t-h3">Forum · trender lige nu</h3>
            <span className="t-caption">♡ {topThread.likes}</span>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-[var(--ink)] leading-snug">{topThread.titel}</div>
            <p className="mt-1 text-[12px] text-[var(--ink-3)] line-clamp-2 leading-[1.5]">{topThread.body}</p>
            <div className="text-[12px] text-[var(--ink-3)] mt-2">
              {topThread.forfatter} · {topThread.forfatterFirma}
            </div>
          </div>
          <div className="mt-4 text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1">
            Læs tråden <ArrowRight />
          </div>
        </Link>
      </section>
    </div>
  );
}

/* ───── helpers ───── */
function Kpi({ label, value, sub, delta }: { label: string; value: string | number; sub: string; delta?: string }) {
  return (
    <div className="bg-[var(--canvas)] rounded-[var(--r-lg)] border border-[var(--line)] p-4 transition-shadow hover:shadow-[var(--shadow-1)]">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-[var(--ink-3)] font-medium">{label}</span>
        {delta && <span className="text-[11px] font-semibold text-[#2D4A0F]">{delta}</span>}
      </div>
      <div className="mt-2 text-[26px] font-semibold leading-none tracking-tight text-[var(--ink)] tabular-nums">{value}</div>
      <div className="text-[11px] text-[var(--ink-3)] mt-1.5">{sub}</div>
    </div>
  );
}

function DateChip({ iso }: { iso: string }) {
  const d = new Date(iso);
  const month = d.toLocaleDateString("da-DK", { month: "short" }).replace(".", "").toUpperCase();
  return (
    <div className="rounded-xl bg-[var(--canvas-2)] px-3 py-2 text-center shrink-0 min-w-[52px]">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{month}</div>
      <div className="text-[22px] font-bold leading-none mt-0.5 text-[var(--ink)]">{d.getDate()}</div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function labelForFormat(f: string): string {
  const map: Record<string, string> = {
    "print-flyer": "Flyer",
    "print-poster": "Poster",
    "print-magasin": "Magasin",
    "print-bilstreamer": "Bilstreamer",
    "digital-facebook": "Facebook",
    "digital-instagram": "Instagram",
    "digital-email": "Email",
    "digital-google": "Google",
  };
  return map[f] ?? f;
}
