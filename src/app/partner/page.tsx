"use client";

// Force dynamic rendering — these pages use client hooks (useSearchParams) and/or
// heavy Recharts components that can hang Next.js static page generation.
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useApp } from "@/components/AppState";
import { BookVisitDialog } from "@/components/BookVisitDialog";
import {
  CURRENT_PARTNER,
  CAMPAIGNS,
  EVENTS,
  BLOG_POSTS,
  CHAT_THREADS,
  SPECIALISTS,
  PARTNERS,
  FORUM_THREADS,
  PARTNER_PERFORMANCE,
} from "@/lib/data";
import { Radial, BarMini } from "@/components/Charts";
import { MiniArea, InteractiveArea } from "@/components/ChartsInteractive";

type DateRange = "uge" | "maaned" | "kvartal";

export default function PartnerDashboard() {
  const { theme } = useTheme();
  const { leads, pushToast } = useApp();
  const [range, setRange] = useState<DateRange>("uge");
  const [showKonsulentBook, setShowKonsulentBook] = useState(false);

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

  const myRegionPartners = PARTNERS.filter(
    (p) => p.region === CURRENT_PARTNER.region && p.id !== CURRENT_PARTNER.id
  );
  const myRegionEvent = upcoming.find((e) => e.region === CURRENT_PARTNER.region);
  const topThread = [...FORUM_THREADS].sort((a, b) => b.likes - a.likes)[0];

  const pointsPct = Math.round(
    (CURRENT_PARTNER.points / CURRENT_PARTNER.pointsTilNæste) * 100
  );

  return (
    <div className="px-6 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      {/* ─── HEADER ─── */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="t-eyebrow flex items-center gap-2">
            <span className="theme-dot" style={{ background: theme.accent }} />
            <span>{theme.label} · {theme.season}</span>
          </div>
          <h1 className="t-display mt-2">
            God morgen, {CURRENT_PARTNER.ejer.split(" ")[0]}.
          </h1>
          <p className="t-body-lg mt-2 max-w-[560px]">
            {newLeads.length > 0 ? (
              <>
                Du har <strong className="text-[var(--ink)] font-semibold">{newLeads.length} nye leads</strong> i denne uge. Konverteringen er steget til 51%.
              </>
            ) : (
              <>Alt er ajourført. Næste lead-push starter mandag.</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SegmentedRange value={range} onChange={setRange} />
          <Link href="/partner/kampagner" className="btn btn-primary">
            Åbn Materialer
          </Link>
        </div>
      </header>

      {/* ─── KPI ROW (4 tall tiles with sparklines) ─── */}
      <section aria-label="Nøgletal" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <KpiTile
          label="Nye leads"
          value={newLeads.length}
          delta="+2"
          deltaPositive
          sparkline={PARTNER_PERFORMANCE.leadsByWeek}
          sparkColor={theme.accent}
        />
        <KpiTile
          label="Vundne sager"
          value={wonLeads.length}
          delta="+1 sidste 30 dage"
          deltaPositive
          sparkline={[1, 1, 0, 2, 1, 3, 2, 3]}
          sparkColor="#2D4A0F"
        />
        <KpiTile
          label="Konvertering"
          value="51%"
          delta="+3 pp"
          deltaPositive
          sparkline={PARTNER_PERFORMANCE.conversionByWeek}
          sparkColor="var(--accent)"
        />
        <KpiTile
          label="Sølv → Guld"
          value={`${pointsPct}%`}
          delta={`${(CURRENT_PARTNER.pointsTilNæste - CURRENT_PARTNER.points).toLocaleString("da-DK")} point igen`}
          sparkline={PARTNER_PERFORMANCE.pointsByWeek}
          sparkColor="#C99A20"
        />
      </section>

      {/* ─── HERO ROW: Active campaign + Tier radial ─── */}
      <section className="grid gap-4 lg:grid-cols-[1.7fr_1fr] mb-4">
        {/* Active campaign card — bold, image-feeling */}
        {activeCampaign && (
          <Link
            href="/partner/kampagner"
            aria-label={`Åbn kampagnen ${activeCampaign.titel}`}
            className="block rounded-[20px] overflow-hidden group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-3)]"
            style={{ background: theme.accentSoft }}
          >
            <div className="grid lg:grid-cols-[1.3fr_1fr] h-full">
              <div className="p-7 lg:p-9 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: theme.accentInk }}>
                    Aktiv kampagne
                  </div>
                  <h2
                    className="mt-2 font-semibold leading-[1.04] tracking-[-0.022em]"
                    style={{ color: theme.accentInk, fontSize: "clamp(28px, 3.2vw, 42px)" }}
                  >
                    {activeCampaign.titel}
                  </h2>
                  <p className="mt-3 text-[15px] leading-[1.45] max-w-[420px]" style={{ color: theme.accentInk, opacity: 0.78 }}>
                    {activeCampaign.hovedbudskab}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline gap-6 mb-5">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: theme.accentInk, opacity: 0.62 }}>
                        Formater
                      </div>
                      <div className="text-[22px] font-semibold mt-0.5 tabular-nums" style={{ color: theme.accentInk }}>
                        {activeCampaign.formater.length}
                      </div>
                    </div>
                    <div className="w-px h-9" style={{ background: theme.accentInk, opacity: 0.18 }} />
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: theme.accentInk, opacity: 0.62 }}>
                        Brugt af partnere
                      </div>
                      <div className="text-[22px] font-semibold mt-0.5 tabular-nums" style={{ color: theme.accentInk }}>
                        23
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 text-[14px] font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: theme.accentInk }}>
                    Brug i Materialer
                    <ArrowRight />
                  </div>
                </div>
              </div>

              <div
                className="hidden lg:flex items-center justify-center relative overflow-hidden min-h-[260px]"
                style={{
                  background: `radial-gradient(circle at 50% 45%, ${theme.accent}30 0%, transparent 70%)`,
                }}
                aria-hidden="true"
              >
                <div className="text-[180px] leading-none select-none" style={{ filter: "drop-shadow(0 14px 32px rgba(0,0,0,0.18))" }}>
                  {activeCampaign.heroEmoji}
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Tier-progress radial */}
        <div className="card card-lg flex flex-col">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="t-h3">Tier-progression</h3>
            <span className="t-caption">{CURRENT_PARTNER.tier} → Guld</span>
          </div>
          <p className="text-[12px] text-[var(--ink-3)] mb-4">
            {(CURRENT_PARTNER.pointsTilNæste - CURRENT_PARTNER.points).toLocaleString("da-DK")} point til næste niveau
          </p>

          <div className="flex-1 grid place-items-center my-4">
            <Radial
              value={pointsPct}
              size={180}
              thickness={16}
              color="#C99A20"
              trackColor="var(--canvas-2)"
              label={`${pointsPct}%`}
              sub={`${CURRENT_PARTNER.points.toLocaleString("da-DK")} / ${CURRENT_PARTNER.pointsTilNæste.toLocaleString("da-DK")}`}
            />
          </div>

          <div className="grid grid-cols-3 gap-1 text-center pt-3 border-t border-[var(--line-2)]">
            <TierDot tier="Bronze" current={CURRENT_PARTNER.tier === "Bronze"} done />
            <TierDot tier="Sølv"   current={CURRENT_PARTNER.tier === "Sølv"}   done />
            <TierDot tier="Guld"   current={CURRENT_PARTNER.tier === "Guld"} />
          </div>
        </div>
      </section>

      {/* ─── PERFORMANCE ROW ─── */}
      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr] mb-4">
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h3 className="t-h3">Leads pr. uge</h3>
              <p className="t-caption mt-0.5">Seneste 8 uger · alle kanaler</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-semibold text-[var(--ink)] leading-none tabular-nums">
                {PARTNER_PERFORMANCE.leadsByWeek[PARTNER_PERFORMANCE.leadsByWeek.length - 1]}
              </span>
              <span className="text-[12px] font-semibold text-[#2D4A0F]">+3 vs. forrige</span>
            </div>
          </div>
          <InteractiveArea
            data={PARTNER_PERFORMANCE.leadsByWeek.map((v, i) => ({ label: PARTNER_PERFORMANCE.weekLabels[i], value: v }))}
            color={theme.accent}
            height={200}
            unit="leads"
          />
        </div>

        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h3 className="t-h3">Top formater</h3>
              <p className="t-caption mt-0.5">Hentet denne måned</p>
            </div>
            <span className="text-[12px] text-[var(--ink-3)] tabular-nums">47 i alt</span>
          </div>
          <BarMini rows={PARTNER_PERFORMANCE.formatsThisMonth} />
        </div>
      </section>

      {/* ─── 3-COL DATA ROW ─── */}
      <section className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-4">
        {/* Nye leads */}
        <Link href="/partner/leads" className="card card-hover block">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="t-h3">Nye leads</h3>
            <span className="t-caption">{newLeads.length} venter</span>
          </div>
          <ul className="divide-y divide-[var(--line-2)] -mx-1">
            {newLeads.slice(0, 3).map((l) => (
              <li key={l.id} className="py-2.5 px-1 flex items-center gap-3">
                <span className="size-1.5 rounded-full shrink-0 bg-[var(--accent)]" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[var(--ink)] truncate">{l.kunde}</div>
                  <div className="text-[12px] text-[var(--ink-3)] truncate">{l.behov}</div>
                </div>
                <span className="text-[11px] text-[var(--ink-3)] shrink-0 tabular-nums">{l.værdi}</span>
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

        {/* Næste event */}
        <Link href="/partner/events" className="card card-hover block">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="t-h3">Næste event</h3>
            <span className="t-caption">{nextEvent.tilmeldte}/{nextEvent.pladser}</span>
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
            <h3 className="t-h3">Din region</h3>
            <span className="t-caption">{CURRENT_PARTNER.region}</span>
          </div>
          <ul className="divide-y divide-[var(--line-2)] -mx-1">
            {myRegionPartners.slice(0, 3).map((p) => (
              <li key={p.id} className="py-2.5 px-1 flex items-center gap-3">
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
              <div className="text-[12px] text-[var(--ink-3)] mt-0.5">
                {new Date(myRegionEvent.dato).toLocaleDateString("da-DK", { day: "numeric", month: "long" })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── DIN CARL RAS KONSULENT (CRM hero card) ─── */}
      <section className="mb-4">
        <div
          className="rounded-[var(--r-xl)] overflow-hidden border flex flex-wrap items-center gap-6 p-6 lg:p-7"
          style={{ borderColor: "#0C447C20", background: "linear-gradient(135deg, #F0F6FC 0%, #FFFFFF 55%)" }}
        >
          {/* Avatar + identity */}
          <div className="flex items-center gap-4 flex-1 min-w-[280px]">
            <div className="size-16 rounded-full grid place-items-center text-white font-bold text-[20px] shrink-0 shadow-[var(--shadow-1)]" style={{ background: "#0C447C" }}>
              DH
            </div>
            <div className="min-w-0">
              <div className="t-eyebrow !text-[10px]" style={{ color: "#0C447C" }}>Din Carl Ras-konsulent</div>
              <div className="text-[18px] font-semibold text-[var(--ink)] mt-0.5 leading-tight">Dennis Holmberg</div>
              <div className="text-[12.5px] text-[var(--ink-3)] mt-0.5">Salgskonsulent · {CURRENT_PARTNER.region} · {CURRENT_PARTNER.faggruppe}</div>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#324A14]">
                  <span className="size-1.5 rounded-full" style={{ background: "#5B7F2C" }} /> Online · svar inden 2 t
                </span>
                <span className="text-[11px] text-[var(--ink-3)]">Sidste besøg 19. apr</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-center shrink-0 px-2">
            <div>
              <div className="text-[11px] text-[var(--ink-3)] uppercase tracking-wider font-semibold">Besøg i år</div>
              <div className="text-[20px] font-semibold text-[var(--ink)] mt-1 tabular-nums">4</div>
            </div>
            <div className="w-px bg-[var(--line-2)]" />
            <div>
              <div className="text-[11px] text-[var(--ink-3)] uppercase tracking-wider font-semibold">Næste besøg</div>
              <div className="text-[14px] font-semibold text-[var(--ink)] mt-1 tabular-nums">3. jun</div>
            </div>
            <div className="w-px bg-[var(--line-2)]" />
            <div>
              <div className="text-[11px] text-[var(--ink-3)] uppercase tracking-wider font-semibold">Relation</div>
              <div className="text-[14px] font-semibold mt-1" style={{ color: "#2D4A0F" }}>Stærk · 8.4</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setShowKonsulentBook(true)}
              className="btn btn-primary"
            >
              📅 Book besøg
            </button>
            <button
              onClick={() => pushToast("Beskedseditor åbnes…")}
              className="btn btn-secondary"
            >
              Skriv til Dennis
            </button>
            <a
              href="tel:+4570260111"
              className="btn btn-secondary"
              aria-label="Ring til Dennis"
            >
              📞
            </a>
          </div>
        </div>
      </section>

      {/* ─── ACTIVITY + CONTENT ROW ─── */}
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
        {/* Activity feed */}
        <div className="card card-lg">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="t-h3">Aktivitet</h3>
            <span className="t-caption">Seneste 7 dage</span>
          </div>
          <ul className="space-y-4">
            {PARTNER_PERFORMANCE.activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="size-8 rounded-full grid place-items-center shrink-0 text-white"
                  style={{ background: a.color }}
                  aria-hidden="true"
                >
                  <ActivityIcon kind={a.icon} />
                </span>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="text-[14px] text-[var(--ink)] leading-snug">{a.text}</div>
                  <div className="text-[12px] text-[var(--ink-3)] mt-0.5">{a.tid}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Specialist chat */}
        <Link href="/partner/specialister" className="card card-hover block">
          <h3 className="t-h3 mb-4">Tal med Carl Ras</h3>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="size-10 rounded-full text-white font-semibold grid place-items-center shrink-0 text-[13px]"
              style={{ background: latestChatSpec.bg }}
              aria-hidden="true"
            >
              {latestChatSpec.initialer}
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-[var(--ink)]">{latestChatSpec.navn}</div>
              <div className="text-[12px] text-[var(--ink-3)]">{latestChatSpec.bu}</div>
            </div>
          </div>
          <p className="text-[13px] text-[var(--ink-2)] line-clamp-3 leading-[1.5]">{latestChatMsg.text}</p>
          <div className="mt-4 text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1">
            Læs samtalen <ArrowRight />
          </div>
        </Link>

        {/* Blog + forum stacked */}
        <div className="flex flex-col gap-4">
          <Link href="/partner/nyheder" className="card card-hover block flex-1">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="t-h3">Nyt fra Carl Ras</h3>
              <span className="t-caption">{latestPost.dato}</span>
            </div>
            <div className="text-[14px] font-semibold text-[var(--ink)] leading-snug">{latestPost.titel}</div>
            <p className="mt-1 text-[12px] text-[var(--ink-3)] line-clamp-2 leading-[1.5]">{latestPost.excerpt}</p>
            <div className="mt-3 text-[13px] font-semibold text-[var(--accent)] inline-flex items-center gap-1">
              Læs hele <ArrowRight />
            </div>
          </Link>
          <Link href="/partner/forum" className="card card-hover block flex-1">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="t-h3">Forum trender</h3>
              <span className="t-caption">♡ {topThread.likes}</span>
            </div>
            <div className="text-[14px] font-semibold text-[var(--ink)] leading-snug line-clamp-2">{topThread.titel}</div>
            <div className="mt-2 text-[12px] text-[var(--ink-3)]">
              {topThread.forfatter} · {topThread.svar} svar
            </div>
          </Link>
        </div>
      </section>

      {/* Booking dialog — konsulent lane */}
      <BookVisitDialog
        open={showKonsulentBook}
        onClose={() => setShowKonsulentBook(false)}
        context={{
          lane: "konsulent",
          subtitle: "Dennis Holmberg ringer dig op og bekræfter inden for 2 timer i åbningstid.",
          defaultLocation: `${CURRENT_PARTNER.firma} · ${CURRENT_PARTNER.postnr} ${CURRENT_PARTNER.by}`,
        }}
        onConfirm={(d) => {
          setShowKonsulentBook(false);
          pushToast(
            d.akut
              ? `📞 Akut-anmodning sendt — Dennis ringer inden for 30 min.`
              : `📅 Besøg booket med Dennis ${d.when ? "· " + new Date(d.when).toLocaleDateString("da-DK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}`,
            "success"
          );
        }}
      />
    </div>
  );
}

/* ─────────── small components ─────────── */

function SegmentedRange({ value, onChange }: { value: DateRange; onChange: (v: DateRange) => void }) {
  const options: { id: DateRange; label: string }[] = [
    { id: "uge",     label: "Uge" },
    { id: "maaned",  label: "Måned" },
    { id: "kvartal", label: "Kvartal" },
  ];
  return (
    <div className="inline-flex rounded-full bg-[var(--canvas-2)] p-1">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={
            "px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors " +
            (value === o.id ? "bg-white text-[var(--ink)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]" : "text-[var(--ink-3)] hover:text-[var(--ink)]")
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function KpiTile({
  label,
  value,
  delta,
  deltaPositive,
  sparkline,
  sparkColor = "var(--accent)",
}: {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  sparkline?: number[];
  sparkColor?: string;
}) {
  const chartData = sparkline?.map((v, i) => ({ label: `Uge ${i + 1}`, value: v }));
  return (
    <div className="bg-[var(--canvas)] rounded-[var(--r-lg)] border border-[var(--line)] p-5 flex flex-col transition-all hover:shadow-[var(--shadow-1)]">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-[var(--ink-3)] font-medium">{label}</span>
        {delta && (
          <span className={"text-[11px] font-semibold " + (deltaPositive ? "text-[#2D4A0F]" : "text-[var(--ink-3)]")}>
            {delta}
          </span>
        )}
      </div>
      <div className="mt-2 text-[32px] font-semibold leading-none tracking-tight text-[var(--ink)] tabular-nums">
        {value}
      </div>
      {chartData && (
        <div className="mt-3 -mx-1">
          <MiniArea data={chartData} color={sparkColor} height={44} />
        </div>
      )}
    </div>
  );
}

function TierDot({ tier, current, done }: { tier: "Bronze" | "Sølv" | "Guld"; current?: boolean; done?: boolean }) {
  const color = tier === "Guld" ? "#C99A20" : tier === "Sølv" ? "#7E8993" : "#9C6A3F";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={"size-6 rounded-full grid place-items-center text-white " + (current ? "ring-2 ring-offset-2 ring-offset-white" : "")}
        style={{ background: done ? color : "var(--line)", borderColor: color }}
      >
        {done && (
          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </div>
      <span className={"text-[11px] " + (current ? "font-semibold text-[var(--ink)]" : "text-[var(--ink-3)]")}>{tier}</span>
    </div>
  );
}

function DateChip({ iso }: { iso: string }) {
  const d = new Date(iso);
  const month = d.toLocaleDateString("da-DK", { month: "short" }).replace(".", "").toUpperCase();
  return (
    <div className="rounded-xl bg-[var(--canvas-2)] px-3 py-2 text-center shrink-0 min-w-[52px]">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{month}</div>
      <div className="text-[22px] font-bold leading-none mt-0.5 text-[var(--ink)] tabular-nums">{d.getDate()}</div>
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

function ActivityIcon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    lead:     "M3 8l5 4 5-4M3 8v7h10V8M3 8l5-4 5 4",
    download: "M8 3v8m0 0l-3-3m3 3l3-3M3 13h10",
    chat:     "M3 4h10v8H6l-3 2z",
    won:      "M3 8l3 3 7-7",
    event:    "M3 5h10v8H3zM3 7h10M5 3v3M11 3v3",
  };
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[kind] ?? paths.lead} />
    </svg>
  );
}
