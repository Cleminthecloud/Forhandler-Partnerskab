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
    <div className="px-6 lg:px-12 py-10 lg:py-14 max-w-[1180px] animate-in">
      {/* ─── HEADER: greeting + lead context ───────────────────────── */}
      <header className="mb-12">
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
      </header>

      {/* ─── KPI ROW: secondary information, subtle ────────────────── */}
      <section aria-label="Nøgletal" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <Kpi label="Nye leads"      value={newLeads.length}     sub="i denne uge" />
        <Kpi label="Vundne sager"   value={wonLeads.length}     sub="seneste 30 dage" />
        <Kpi label="Konvertering"   value="51%"                  sub="3 pp over snittet" />
        <Kpi label="Point"          value={CURRENT_PARTNER.points.toLocaleString("da-DK")} sub={`${CURRENT_PARTNER.pointsTilNæste - CURRENT_PARTNER.points} til Guld`} />
      </section>

      {/* ─── HERO: ONE primary call to action ───────────────────────
           This is the only place theme accent is used at scale.
           Everything else stays on the neutral system.            */}
      {activeCampaign && (
        <Link
          href="/partner/kampagner"
          aria-label={`Åbn kampagnen ${activeCampaign.titel} i Materialer`}
          data-theme-active
          className="block rounded-[20px] mb-12 overflow-hidden group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-3)]"
          style={{ background: theme.accentSoft }}
        >
          <div className="grid lg:grid-cols-[1fr_300px]">
            <div className="p-8 lg:p-10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: theme.accentInk }}>
                Aktiv kampagne · klar at bruge
              </div>
              <h2
                className="mt-3 font-semibold leading-[1.08] tracking-[-0.018em]"
                style={{ color: theme.accentInk, fontSize: "clamp(28px, 3.2vw, 36px)" }}
              >
                {activeCampaign.titel}
              </h2>
              <p className="mt-3 text-[16px] leading-[1.5] max-w-[480px]" style={{ color: theme.accentInk, opacity: 0.82 }}>
                {activeCampaign.hovedbudskab}
              </p>

              <div className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: theme.accentInk }}>
                Brug i Materialer
                <ArrowRight />
              </div>
            </div>

            <div
              className="hidden lg:grid place-items-center text-[140px] leading-none p-6"
              style={{ background: `linear-gradient(135deg, ${theme.accent}22 0%, transparent 100%)` }}
              aria-hidden="true"
            >
              {activeCampaign.heroEmoji}
            </div>
          </div>
        </Link>
      )}

      {/* ─── TWO-COLUMN: leads + next event ─────────────────────── */}
      <section className="grid gap-4 lg:grid-cols-2 mb-12">
        {/* Leads */}
        <Link href="/partner/leads" className="card card-hover block">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="t-h3">Nye leads</h3>
            <span className="t-caption">Carl-ras.dk Partnerfinder</span>
          </div>

          <div className="text-[28px] font-semibold leading-none text-[var(--ink)] mb-4">
            {newLeads.length} <span className="text-[var(--ink-3)] text-[16px] font-normal">{newLeads.length === 1 ? "venter" : "venter"} på dig</span>
          </div>

          <ul className="divide-y divide-[var(--line-2)] -mx-2">
            {newLeads.slice(0, 3).map((l) => (
              <li key={l.id} className="py-2.5 px-2 flex items-center gap-3">
                <span className="size-1.5 rounded-full shrink-0 bg-[var(--accent)]" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-[var(--ink)] truncate">{l.kunde}</div>
                  <div className="text-[12px] text-[var(--ink-3)] truncate">{l.behov} · {l.postnr} {l.by}</div>
                </div>
                <span className="text-[12px] text-[var(--ink-3)] shrink-0 hidden sm:inline">{l.værdi}</span>
              </li>
            ))}
            {newLeads.length === 0 && (
              <li className="py-6 text-center text-[14px] text-[var(--ink-3)]">
                Ingen nye leads — næste push starter mandag.
              </li>
            )}
          </ul>

          <div className="mt-5 text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1">
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
              <div className="text-[16px] font-semibold text-[var(--ink)] leading-snug">{nextEvent.titel}</div>
              <div className="text-[13px] text-[var(--ink-3)] mt-1.5">
                {nextEvent.tid} · {nextEvent.lokation.split(",")[0]}
              </div>
              <div className="text-[13px] text-[var(--ink-3)] mt-0.5">
                Vært: <span className="text-[var(--ink-2)]">{nextEvent.vært}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1">
            Tilmeld <ArrowRight />
          </div>
        </Link>
      </section>

      {/* ─── SECONDARY: chat + blog ─────────────────────────────── */}
      <section className="grid gap-4 lg:grid-cols-2">
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
          <p className="mt-3 text-[14px] text-[var(--ink-2)] line-clamp-2 leading-[1.5]">{latestChatMsg.text}</p>
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
              <div className="text-[15px] font-semibold text-[var(--ink)] leading-snug">{latestPost.titel}</div>
              <p className="mt-1 text-[13px] text-[var(--ink-3)] line-clamp-2 leading-[1.5]">{latestPost.excerpt}</p>
            </div>
          </div>
          <div className="mt-4 text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1">
            Læs hele <ArrowRight />
          </div>
        </Link>
      </section>
    </div>
  );
}

/* ───── small components ───── */

function Kpi({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="card-pearl !p-4 transition-colors duration-200">
      <div className="text-[12px] text-[var(--ink-3)] font-medium">{label}</div>
      <div className="mt-1 text-[24px] font-semibold leading-none tracking-tight text-[var(--ink)]">{value}</div>
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
