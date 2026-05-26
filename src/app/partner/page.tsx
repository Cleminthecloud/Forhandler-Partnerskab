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

  const activeCampaign = CAMPAIGNS.find((c) => c.tema === theme.id && c.status === "Aktiv") ?? CAMPAIGNS.find((c) => c.tema === theme.id);
  const nextEvent = EVENTS.filter((e) => new Date(e.dato) >= new Date("2026-05-26")).sort((a, b) => a.dato.localeCompare(b.dato))[0];
  const latestPost = BLOG_POSTS[0];
  const latestChat = Object.values(CHAT_THREADS)[0];
  const latestChatSpecialist = SPECIALISTS.find((s) => s.id === latestChat.specialistId)!;
  const latestChatMsg = latestChat.messages[latestChat.messages.length - 1];

  return (
    <div className="p-6 lg:p-10 max-w-[1180px]">
      {/* Greeting */}
      <div className="t-tagline" style={{ color: theme.accentInk }}>
        {theme.flagEmoji} {theme.label.toUpperCase()} · {theme.season.toUpperCase()}
      </div>
      <h1 className="t-display-lg mt-3 text-[var(--cr-navy-deep)]">God morgen, {CURRENT_PARTNER.ejer.split(" ")[0]}.</h1>
      <p className="t-lead mt-2">
        {newLeads.length > 0 ? (
          <>Du har <strong style={{ color: theme.accentInk }}>{newLeads.length} nye leads</strong> at se på. Aktiv kampagne: <strong>{activeCampaign?.titel ?? "—"}</strong>.</>
        ) : (
          <>Alt er ajourført. Aktiv kampagne: <strong>{activeCampaign?.titel ?? "—"}</strong>.</>
        )}
      </p>

      {/* KPI tiles */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile label="Nye leads" value={newLeads.length} sub="i denne uge" accent />
        <KpiTile label="Vundne sager" value={wonLeads.length} sub="seneste 30 dage" />
        <KpiTile label="Konvertering" value="51%" sub="3 over gennemsnit" />
        <KpiTile label="Point" value={CURRENT_PARTNER.points.toLocaleString("da-DK")} sub={`${CURRENT_PARTNER.pointsTilNæste - CURRENT_PARTNER.points} til Guld`} />
      </div>

      {/* Main grid */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {/* Active campaign — big card */}
        <Link
          href="/partner/kampagner"
          className="lg:col-span-2 card group block transition-shadow hover:shadow-[0_10px_30px_rgba(0,45,89,0.06)]"
          style={{ borderColor: theme.accentSoft }}
        >
          <div className="flex items-start gap-5">
            <div
              className="size-14 rounded-2xl grid place-items-center text-3xl shrink-0"
              style={{ background: theme.accentSoft }}
            >
              {activeCampaign?.heroEmoji ?? theme.flagEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="t-tagline" style={{ color: theme.accentInk }}>AKTIV KAMPAGNE</div>
              <div className="t-display mt-1 text-[var(--cr-navy-deep)]">{activeCampaign?.titel ?? "Ingen aktiv kampagne"}</div>
              <p className="t-body mt-2 text-[var(--ink-muted-80)]">{activeCampaign?.hovedbudskab}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="t-caption">Tilgængelige formater:</span>
                {activeCampaign?.formater.slice(0, 5).map((f) => (
                  <span key={f} className="text-[11px] px-2 py-1 rounded-full bg-[var(--surface-pearl)] border border-[var(--hairline)]">
                    {f.replace("print-", "").replace("digital-", "")}
                  </span>
                ))}
                {activeCampaign && activeCampaign.formater.length > 5 && (
                  <span className="text-[11px] text-[var(--ink-muted-48)]">
                    +{activeCampaign.formater.length - 5} flere
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 inline-flex items-center gap-1.5 font-semibold text-[14px]" style={{ color: theme.accentInk }}>
            Brug i Materialer →
          </div>
        </Link>

        {/* Next event */}
        <Link
          href="/partner/events"
          className="card hover:shadow-[0_10px_30px_rgba(0,45,89,0.06)] transition-shadow block"
        >
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>NÆSTE EVENT</div>
          <div className="mt-2 flex items-start gap-3">
            <div className="rounded-lg bg-[var(--cr-blue-tint)] text-[var(--cr-navy-deep)] px-2.5 py-1.5 text-center shrink-0">
              <div className="text-[10px] uppercase tracking-wide">{formatMonth(nextEvent.dato)}</div>
              <div className="text-[18px] font-bold leading-none">{formatDay(nextEvent.dato)}</div>
            </div>
            <div className="min-w-0">
              <div className="t-body-strong text-[var(--cr-navy-deep)]">{nextEvent.titel}</div>
              <div className="t-caption mt-1">
                {nextEvent.tid} · {nextEvent.lokation.split(",")[0]}
              </div>
              <div className="t-caption mt-1">Vært: {nextEvent.vært}</div>
            </div>
          </div>
          <div className="mt-4 text-[12px] flex items-center justify-between">
            <span className="text-[var(--ink-muted-48)]">{nextEvent.tilmeldte}/{nextEvent.pladser} tilmeldt</span>
            <span className="font-semibold" style={{ color: "var(--cr-blue)" }}>Tilmeld →</span>
          </div>
        </Link>

        {/* Lead inbox preview */}
        <Link href="/partner/leads" className="card lg:col-span-2 hover:shadow-[0_10px_30px_rgba(0,45,89,0.06)] transition-shadow block">
          <div className="flex items-center justify-between">
            <div>
              <div className="t-tagline" style={{ color: theme.accentInk }}>NYE LEADS · DENNE UGE</div>
              <div className="t-display mt-1 text-[var(--cr-navy-deep)]">{newLeads.length} venter på dig</div>
            </div>
            <span
              className="pill"
              style={{ background: theme.accent, color: "white" }}
            >
              Åbn indbakken →
            </span>
          </div>
          <ul className="mt-4 divide-y divide-[var(--divider-soft)]">
            {newLeads.slice(0, 3).map((l) => (
              <li key={l.id} className="py-3 flex items-center gap-3">
                <span className="size-2 rounded-full shrink-0" style={{ background: theme.accent }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-[var(--cr-navy-deep)] truncate">
                    {l.kunde} · {l.behov}
                  </div>
                  <div className="text-[12px] text-[var(--ink-muted-48)] truncate">
                    {l.postnr} {l.by} · {l.værdi}
                  </div>
                </div>
                <span className="text-[12px] text-[var(--ink-muted-48)] shrink-0">{relativeDate(l.dato)}</span>
              </li>
            ))}
            {newLeads.length === 0 && (
              <li className="py-6 text-center text-[14px] text-[var(--ink-muted-48)]">
                Ingen nye leads lige nu. Næste push starter mandag.
              </li>
            )}
          </ul>
        </Link>

        {/* Specialist chat preview */}
        <Link href="/partner/specialister" className="card hover:shadow-[0_10px_30px_rgba(0,45,89,0.06)] transition-shadow block">
          <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>TAL MED CARL RAS</div>
          <div className="mt-3 flex items-center gap-3">
            <div
              className="size-10 rounded-full text-white font-semibold grid place-items-center shrink-0 text-[14px]"
              style={{ background: latestChatSpecialist.bg }}
            >
              {latestChatSpecialist.initialer}
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-[var(--cr-navy-deep)]">{latestChatSpecialist.navn}</div>
              <div className="text-[12px] text-[var(--ink-muted-48)]">{latestChatSpecialist.rolle} · {latestChatSpecialist.bu}</div>
            </div>
          </div>
          <p className="mt-3 text-[13px] line-clamp-3 text-[var(--ink-muted-80)]">{latestChatMsg.text}</p>
          <div className="mt-3 text-[12px] font-semibold" style={{ color: "var(--cr-blue)" }}>Læs samtalen →</div>
        </Link>

        {/* Blog */}
        <Link href="/partner/nyheder" className="card lg:col-span-3 hover:shadow-[0_10px_30px_rgba(0,45,89,0.06)] transition-shadow block">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>NYT FRA CARL RAS</div>
            <span className="t-caption">Opdateret {latestPost.dato}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="size-12 rounded-xl bg-[var(--cr-blue-tint)] grid place-items-center text-2xl shrink-0">{latestPost.hero}</div>
            <div className="min-w-0 flex-1">
              <div className="t-display text-[var(--cr-navy-deep)]">{latestPost.titel}</div>
              <p className="t-body mt-1 text-[var(--ink-muted-80)] max-w-[680px]">{latestPost.excerpt}</p>
            </div>
            <span className="font-semibold text-[14px] shrink-0" style={{ color: "var(--cr-blue)" }}>Læs hele →</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

function KpiTile({ label, value, sub, accent }: { label: string; value: string | number; sub: string; accent?: boolean }) {
  return (
    <div className="card-pearl">
      <div className="t-caption">{label}</div>
      <div className="mt-1 text-[28px] font-semibold leading-none tracking-tight" style={{ color: accent ? "var(--theme-accent-ink)" : "var(--cr-navy-deep)" }}>
        {value}
      </div>
      <div className="t-caption mt-1.5">{sub}</div>
    </div>
  );
}

function formatMonth(iso: string) {
  return new Date(iso).toLocaleDateString("da-DK", { month: "short" }).replace(".", "").toUpperCase();
}
function formatDay(iso: string) {
  return String(new Date(iso).getDate());
}
function relativeDate(iso: string) {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "i dag";
  if (days === 1) return "i går";
  if (days < 7) return `for ${days} dage siden`;
  return new Date(iso).toLocaleDateString("da-DK", { day: "numeric", month: "short" });
}
