"use client";
import { useState, useMemo } from "react";
import { FORUM_THREADS, PARTNERS, CURRENT_PARTNER, ForumThread } from "@/lib/data";
import { useApp } from "@/components/AppState";

const CAT_COLOR: Record<ForumThread["kategori"], { bg: string; ink: string }> = {
  "Tip":           { bg: "#EAF1DC", ink: "#324A14" },
  "Spørgsmål":     { bg: "#E8F0FA", ink: "#0C447C" },
  "Markedsføring": { bg: "#FFF1DC", ink: "#7A4400" },
  "Værktøj":       { bg: "#F3F4F6", ink: "#444" },
  "Snak":          { bg: "#FCE4E6", ink: "#7E0309" },
};

export default function ForumPage() {
  const { pushToast } = useApp();
  const [cat, setCat] = useState<ForumThread["kategori"] | "Alle">("Alle");

  const filtered = useMemo(() => FORUM_THREADS.filter((t) => cat === "Alle" || t.kategori === cat), [cat]);

  // ligesindede-vorslag — partners med samme faggruppe eller region, ikke mig
  const ligesindede = useMemo(() => {
    return PARTNERS.filter((p) =>
      p.id !== CURRENT_PARTNER.id &&
      (p.faggruppe === CURRENT_PARTNER.faggruppe || p.region === CURRENT_PARTNER.region)
    ).slice(0, 4);
  }, []);

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10">
      <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>FORUM &amp; PEER-NETVÆRK</div>
      <h1 className="t-display mt-3 text-[var(--cr-navy-deep)]">Forum</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Stil et spørgsmål til de andre partnere. Del en tip. Find en ligesindet i din region eller faggruppe.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {(["Alle", "Tip", "Spørgsmål", "Markedsføring", "Værktøj", "Snak"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={"px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors " +
                  (cat === c ? "border-transparent bg-[var(--cr-navy-deep)] text-white" : "border-[var(--hairline)] bg-white hover:bg-[var(--surface-pearl)]")}
              >
                {c}
              </button>
            ))}
            <button onClick={() => pushToast("Ny tråd-editor åbnes…")} className="pill pill-primary ml-auto">
              + Ny tråd
            </button>
          </div>

          <div className="space-y-3">
            {filtered.map((t) => {
              const cc = CAT_COLOR[t.kategori];
              return (
                <article key={t.id} className="card hover:shadow-[0_8px_24px_rgba(0,45,89,0.06)] transition-shadow">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: cc.bg, color: cc.ink }}>
                      {t.kategori}
                    </span>
                    <span className="text-[12px] text-[var(--ink-muted-48)]">{t.dato}</span>
                  </div>
                  <h3 className="mt-2 text-[17px] font-semibold text-[var(--cr-navy-deep)] leading-tight">{t.titel}</h3>
                  <p className="text-[14px] text-[var(--ink-muted-80)] mt-2 line-clamp-2">{t.body}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[var(--ink-muted-48)]">
                    <span>
                      <strong className="text-[var(--cr-navy-deep)]">{t.forfatter}</strong> · {t.forfatterFirma} · {t.forfatterRegion}
                    </span>
                    <span className="flex items-center gap-4">
                      <span>💬 {t.svar} svar</span>
                      <span>♡ {t.likes}</span>
                      <span className="hidden sm:inline">Seneste: {t.seneste}</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Find ligesindede */}
        <aside className="space-y-4">
          <div className="card !p-5">
            <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>FIND LIGESINDEDE</div>
            <div className="mt-2 text-[15px] font-semibold text-[var(--cr-navy-deep)]">Partnere som dig</div>
            <p className="text-[12px] text-[var(--ink-muted-48)] mt-1">
              Samme faggruppe ({CURRENT_PARTNER.faggruppe}) eller region ({CURRENT_PARTNER.region}).
            </p>
            <ul className="mt-4 space-y-3">
              {ligesindede.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div className="size-9 rounded-xl grid place-items-center text-white text-[11px] font-semibold shrink-0" style={{ background: p.logoBg }}>
                    {p.initialer}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[var(--cr-navy-deep)] truncate">{p.firma}</div>
                    <div className="text-[11px] text-[var(--ink-muted-48)] truncate">{p.by} · {p.faggruppe} · {p.tier}</div>
                  </div>
                  <button onClick={() => pushToast(`Kontaktforespørgsel sendt til ${p.firma}`)} className="text-[12px] font-semibold text-[var(--cr-blue)] hover:underline shrink-0">
                    Skriv →
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card !p-5 bg-[var(--cr-blue-tint)] !border-0">
            <div className="t-tagline" style={{ color: "var(--cr-navy)" }}>HUSKER DU?</div>
            <div className="mt-2 text-[14px] font-semibold text-[var(--cr-navy-deep)]">Faglig Fredag</div>
            <p className="text-[12px] text-[var(--ink-muted-80)] mt-1">
              Næste lokale samling 5. juni i Herlev. Sølv-partnere fra Sjælland samles. 24/30 tilmeldt.
            </p>
            <a href="/partner/events" className="mt-3 inline-block text-[12px] font-semibold text-[var(--cr-blue)]">
              Se kalenderen →
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
