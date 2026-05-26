"use client";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { CURRENT_PARTNER, CAMPAIGNS, EVENTS, BLOG_POSTS, CHAT_THREADS, SPECIALISTS } from "@/lib/data";

export default function PartnerDashboard() {
  const { theme } = useTheme();
  const { leads } = useApp();

  const myLeads = leads.filter((l) => l.partnerId === CURRENT_PARTNER.id);
  const newLeads = myLeads.filter((l) => l.status === "Ny");
  const wonLeads = myLeads.filter((l) => l.status === "Vundet");

  const activeCampaign =
    CAMPAIGNS.find((c) => c.tema === theme.id && c.status === "Aktiv") ??
    CAMPAIGNS.find((c) => c.tema === theme.id);
  const nextEvent = EVENTS
    .filter((e) => new Date(e.dato) >= new Date("2026-05-26"))
    .sort((a, b) => a.dato.localeCompare(b.dato))[0];
  const latestPost = BLOG_POSTS[0];
  const latestThread = Object.values(CHAT_THREADS)[0];
  const latestChatSpec = SPECIALISTS.find((s) => s.id === latestThread.specialistId)!;
  const latestChatMsg = latestThread.messages[latestThread.messages.length - 1];

  return (
    <div className="px-6 lg:px-12 py-10 lg:py-14 max-w-[1180px]">
      {/* Greeting */}
      <header className="mb-12">
        <div className="t-tagline">
          {theme.label} · {theme.season}
        </div>
        <h1 className="t-display-lg mt-3">
          God morgen, {CURRENT_PARTNER.ejer.split(" ")[0]}.
        </h1>
        <p className="t-lead mt-3 max-w-[640px]">
          {newLeads.length > 0 ? (
            <>
              Du har <strong className="text-[var(--ink)] font-semibold">{newLeads.length} nye leads</strong> at se på i denne uge.
            </>
          ) : (
            <>Alt er ajourført — næste lead-push er mandag.</>
          )}
        </p>
      </header>

      {/* KPI row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <Kpi label="Nye leads" value={newLeads.length} sub="i denne uge" />
        <Kpi label="Vundne sager" value={wonLeads.length} sub="seneste 30 dage" />
        <Kpi label="Konvertering" value="51%" sub="3 pp over snittet" />
        <Kpi label="Point" value={CURRENT_PARTNER.points.toLocaleString("da-DK")} sub={`${CURRENT_PARTNER.pointsTilNæste - CURRENT_PARTNER.points} til Guld`} />
      </section>

      {/* Hero campaign card */}
      {activeCampaign && (
        <Link
          href="/partner/kampagner"
          className="block rounded-[18px] mb-12 overflow-hidden group transition-shadow hover:shadow-[0_12px_30px_rgba(0,26,51,0.10)]"
          style={{ background: theme.accentSoft, border: `1px solid ${theme.accentSoft}` }}
        >
          <div className="grid lg:grid-cols-[1fr_280px]">
            <div className="p-8 lg:p-10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: theme.accentInk }}>
                Aktiv kampagne · klar at bruge
              </div>
              <h2 className="mt-3 text-[28px] lg:text-[32px] font-semibold leading-[1.1] tracking-tight" style={{ color: theme.accentInk }}>
                {activeCampaign.titel}
              </h2>
              <p className="mt-3 text-[16px] leading-[1.5]" style={{ color: theme.accentInk, opacity: 0.85 }}>
                {activeCampaign.hovedbudskab}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-medium" style={{ color: theme.accentInk, opacity: 0.7 }}>
                  {activeCampaign.formater.length} formater klar:
                </span>
                {activeCampaign.formater.slice(0, 4).map((f) => (
                  <span key={f} className="text-[11px] px-2.5 py-1 rounded-full bg-white/60 text-[#1D1D1F] font-medium">
                    {labelForFormat(f)}
                  </span>
                ))}
                {activeCampaign.formater.length > 4 && (
                  <span className="text-[12px]" style={{ color: theme.accentInk, opacity: 0.7 }}>
                    +{activeCampaign.formater.length - 4} flere
                  </span>
                )}
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold" style={{ color: theme.accentInk }}>
                Brug i Materialer
                <svg width="14" height="14" viewBox="0 0 14 14" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="hidden lg:grid place-items-center text-[140px] leading-none p-6" style={{ background: `linear-gradient(135deg, ${theme.accent}22 0%, transparent 100%)` }}>
              {activeCampaign.heroEmoji}
            </div>
          </div>
        </Link>
      )}

      {/* Two-column main */}
      <section className="grid gap-4 lg:grid-cols-2 mb-12">
        {/* Leads */}
        <Link href="/partner/leads" className="card card-hover block">
          <div className="flex items-baseline justify-between">
            <div className="t-tagline">Nye leads · denne uge</div>
            <span className="text-[12px] text-[var(--ink-60)]">Carl Ras Partnerfinder</span>
          </div>
          <div className="mt-3 text-[28px] font-semibold leading-none text-[var(--ink)]">
            {newLeads.length} {newLeads.length === 1 ? "lead venter" : "leads venter"}
          </div>
          <ul className="mt-5 divide-y divide-[var(--divider)]">
            {newLeads.slice(0, 3).map((l) => (
              <li key={l.id} className="py-3 flex items-center gap-3">
                <span className="size-2 rounded-full shrink-0" style={{ background: theme.accent }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-[var(--ink)] truncate">{l.kunde}</div>
                  <div className="text-[12px] text-[var(--ink-60)] truncate">{l.behov} · {l.postnr} {l.by}</div>
                </div>
                <span className="text-[12px] text-[var(--ink-60)] shrink-0">{l.værdi}</span>
              </li>
            ))}
            {newLeads.length === 0 && (
              <li className="py-6 text-center text-[14px] text-[var(--ink-60)]">
                Ingen nye leads — næste push starter mandag.
              </li>
            )}
          </ul>
          <div className="mt-4 text-[14px] font-semibold text-[var(--cr-blue)]">Åbn indbakken →</div>
        </Link>

        {/* Next event */}
        <Link href="/partner/events" className="card card-hover block">
          <div className="t-tagline">Næste event</div>
          <div className="mt-4 flex items-start gap-4">
            <div className="rounded-xl bg-[var(--cr-blue-tint)] text-[var(--cr-navy)] px-3 py-2 text-center shrink-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{formatMonth(nextEvent.dato)}</div>
              <div className="text-[24px] font-bold leading-none mt-0.5">{formatDay(nextEvent.dato)}</div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] font-semibold text-[var(--ink)] leading-snug">{nextEvent.titel}</div>
              <div className="text-[13px] text-[var(--ink-60)] mt-1">{nextEvent.tid} · {nextEvent.lokation.split(",")[0]}</div>
              <div className="text-[13px] text-[var(--ink-60)] mt-0.5">Vært: {nextEvent.vært}</div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[12px] text-[var(--ink-60)]">{nextEvent.tilmeldte}/{nextEvent.pladser} tilmeldt</span>
            <span className="text-[14px] font-semibold text-[var(--cr-blue)]">Tilmeld →</span>
          </div>
        </Link>
      </section>

      {/* Secondary row: specialist chat + blog */}
      <section className="grid gap-4 lg:grid-cols-2 mb-6">
        <Link href="/partner/specialister" className="card card-hover block">
          <div className="t-tagline">Tal med Carl Ras</div>
          <div className="mt-4 flex items-center gap-3">
            <div
              className="size-10 rounded-full text-white font-semibold grid place-items-center shrink-0 text-[13px]"
              style={{ background: latestChatSpec.bg }}
            >
              {latestChatSpec.initialer}
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-[var(--ink)]">{latestChatSpec.navn}</div>
              <div className="text-[12px] text-[var(--ink-60)]">{latestChatSpec.rolle} · {latestChatSpec.bu}</div>
            </div>
          </div>
          <p className="mt-3 text-[14px] text-[var(--ink-80)] line-clamp-2">{latestChatMsg.text}</p>
          <div className="mt-4 text-[14px] font-semibold text-[var(--cr-blue)]">Læs samtalen →</div>
        </Link>

        <Link href="/partner/nyheder" className="card card-hover block">
          <div className="flex items-center justify-between">
            <div className="t-tagline">Nyt fra Carl Ras</div>
            <span className="text-[12px] text-[var(--ink-60)]">{latestPost.dato}</span>
          </div>
          <div className="mt-4 flex items-start gap-4">
            <div className="size-11 rounded-xl bg-[var(--surface-pearl)] grid place-items-center text-[22px] shrink-0">{latestPost.hero}</div>
            <div className="min-w-0">
              <div className="text-[16px] font-semibold text-[var(--ink)] leading-snug">{latestPost.titel}</div>
              <p className="mt-1 text-[13px] text-[var(--ink-60)] line-clamp-2">{latestPost.excerpt}</p>
            </div>
          </div>
          <div className="mt-4 text-[14px] font-semibold text-[var(--cr-blue)]">Læs hele →</div>
        </Link>
      </section>
    </div>
  );
}

/* ───────── helpers ───────── */
function Kpi({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="card-pearl !p-4">
      <div className="text-[12px] text-[var(--ink-60)] font-medium">{label}</div>
      <div className="mt-1 text-[26px] font-semibold leading-none tracking-tight text-[var(--ink)]">{value}</div>
      <div className="text-[11px] text-[var(--ink-60)] mt-2">{sub}</div>
    </div>
  );
}

function labelForFormat(f: string): string {
  return f
    .replace("print-flyer", "Flyer A5")
    .replace("print-poster", "Poster A3")
    .replace("print-magasin", "Magasin")
    .replace("print-bilstreamer", "Bilstreamer")
    .replace("digital-facebook", "Facebook")
    .replace("digital-instagram", "Instagram")
    .replace("digital-email", "Email")
    .replace("digital-google", "Google");
}

function formatMonth(iso: string) {
  return new Date(iso).toLocaleDateString("da-DK", { month: "short" }).replace(".", "").toUpperCase();
}
function formatDay(iso: string) {
  return String(new Date(iso).getDate());
}
