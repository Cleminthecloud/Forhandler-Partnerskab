"use client";
import { useState } from "react";
import { useApp } from "@/components/AppState";
import { PageHeader } from "@/components/PageHeader";
import { useTheme } from "@/components/ThemeProvider";

type NotificationKey =
  | "new-lead"          | "lead-status"
  | "phase-due"         | "phase-overdue"    | "phase-blocked"
  | "event-rsvp"        | "event-reminder"
  | "specialist-msg"    | "forum-mention"
  | "campaign-publish"  | "weekly-digest";

interface NotificationDef {
  key: NotificationKey;
  label: string;
  hint: string;
  email: boolean;
  push: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationDef[] = [
  { key: "new-lead",         label: "Nye leads",                          hint: "Når en sommerhusejer udfylder kontaktformularen til dig",         email: true,  push: true  },
  { key: "lead-status",      label: "Lead-status ændringer",              hint: "Når et lead ændrer status (Vundet, Tabt, etc.)",                  email: false, push: true  },
  { key: "phase-due",        label: "Projekt-fase forfalder",             hint: "24 timer før en fase i en af dine kundeprojekter skal være færdig", email: true, push: true  },
  { key: "phase-overdue",    label: "Projekt-fase forsinket",             hint: "Når en fase har passeret sin slut-uge uden at være markeret færdig", email: true, push: true  },
  { key: "phase-blocked",    label: "Fase blokeret",                      hint: "Når en fase markeres som blokeret — typisk hvor specialist eller kunde holder dig op", email: true, push: false },
  { key: "event-rsvp",       label: "Event-bekræftelser",                 hint: "Når Carl Ras bekræfter din tilmelding",                           email: true,  push: false },
  { key: "event-reminder",   label: "Event-påmindelser",                  hint: "24 timer før et event du er tilmeldt",                            email: true,  push: true  },
  { key: "specialist-msg",   label: "Beskeder fra specialist",            hint: "Når en Carl Ras-specialist svarer dig",                           email: true,  push: true  },
  { key: "forum-mention",    label: "@Omtaler i Forum",                   hint: "Når en partner-kollega tagger dig i en tråd",                     email: false, push: true  },
  { key: "campaign-publish", label: "Nye kampagner",                      hint: "Når Carl Ras udgiver en ny kampagne i et tema",                   email: true,  push: false },
  { key: "weekly-digest",    label: "Ugentlig statusmail",                hint: "Mandagsmail med leads, point, åbne projekter og events",          email: true,  push: false },
];

const CONNECTED_ACCOUNTS = [
  { id: "meta",     name: "Meta Business",  account: "Hornbæk Låseservice · Ad Account",  icon: "f",  color: "#0866FF", connected: true  },
  { id: "google",   name: "Google Ads",     account: "hornbaek-laas.dk · MCC linked",     icon: "G",  color: "#34A853", connected: true  },
  { id: "linkedin", name: "LinkedIn Pages", account: "—",                                   icon: "in", color: "#0A66C2", connected: false },
];

/* Forbundne fakturasystemer — the accounting backends a Danish håndværker
   actually uses to issue invoices. Dinero and e-conomic dominate the SMB
   market; Billy.dk is the lightweight challenger. Picked here so the
   project drawer's "Send til faktura" panel knows where to send. */
const INVOICE_SYSTEMS = [
  { id: "dinero",   name: "Dinero",    account: "Hornbæk Låseservice · CVR 11583811",   tag: "D", color: "#0B3D2E", connected: true  },
  { id: "economic", name: "e-conomic", account: "—",                                     tag: "e", color: "#E2231A", connected: false },
  { id: "billy",    name: "Billy.dk",  account: "—",                                     tag: "B", color: "#1158A3", connected: false },
];

export default function PartnerSettingsPage() {
  const { pushToast } = useApp();
  const { theme, themes, setThemeId } = useTheme();
  const [notifs, setNotifs] = useState<NotificationDef[]>(DEFAULT_NOTIFICATIONS);

  function setChannel(key: NotificationKey, channel: "email" | "push", value: boolean) {
    setNotifs((prev) => prev.map((n) => n.key === key ? { ...n, [channel]: value } : n));
  }

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in min-h-[calc(100vh-48px)]">
      <PageHeader
        eyebrow="Min konto"
        title="Indstillinger"
        lead="Notifikationer, forbundne annoncekonti, og generelle præferencer."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* LEFT — settings sections */}
        <div className="space-y-5">
          {/* Notifications */}
          <section className="card !p-0 overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[var(--line-2)]">
              <div className="text-[15px] font-semibold text-[var(--ink)]">Notifikationer</div>
              <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Vælg hvordan du vil have besked for hver type begivenhed.</div>
            </div>
            <div className="grid grid-cols-[1fr_80px_80px] gap-3 px-6 py-2 border-b border-[var(--line-2)] bg-[var(--canvas-2)] text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
              <span>Begivenhed</span>
              <span className="text-center">Email</span>
              <span className="text-center">Push</span>
            </div>
            <ul>
              {notifs.map((n) => (
                <li key={n.key} className="grid grid-cols-[1fr_80px_80px] gap-3 px-6 py-3 border-b border-[var(--line-2)] last:border-b-0 items-center">
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium text-[var(--ink)]">{n.label}</div>
                    <div className="text-[11.5px] text-[var(--ink-3)] mt-0.5">{n.hint}</div>
                  </div>
                  <div className="grid place-items-center">
                    <Toggle checked={n.email} onChange={(v) => setChannel(n.key, "email", v)} />
                  </div>
                  <div className="grid place-items-center">
                    <Toggle checked={n.push} onChange={(v) => setChannel(n.key, "push", v)} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Integrations */}
          <section className="card">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-[15px] font-semibold text-[var(--ink)]">Forbundne annoncekonti</div>
                <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Bruges af &quot;Send til konto&quot; i Kampagner.</div>
              </div>
            </div>
            <ul className="space-y-2.5">
              {CONNECTED_ACCOUNTS.map((a) => (
                <li key={a.id} className="flex items-center gap-3 p-3 rounded-[var(--r-md)] border border-[var(--line-2)]">
                  <div className="size-10 rounded-md grid place-items-center text-white text-[15px] font-bold shrink-0" style={{ background: a.color }}>{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-[var(--ink)]">{a.name}</div>
                    <div className="text-[11.5px] text-[var(--ink-3)] truncate">{a.connected ? a.account : "Ikke forbundet"}</div>
                  </div>
                  {a.connected ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#2D4A0F] bg-[#E1EFD2] px-2 py-1 rounded-full">
                        <span className="size-1.5 rounded-full bg-[#5B7F2C]" />
                        Forbundet
                      </span>
                      <button onClick={() => pushToast(`${a.name} afbrudt (demo)`)} className="text-[12px] font-semibold text-[var(--ink-3)] hover:text-[#8a1f1f] shrink-0">
                        Afbryd
                      </button>
                    </>
                  ) : (
                    <button onClick={() => pushToast(`${a.name} forbundet (demo)`, "success")} className="btn btn-secondary !py-1.5 shrink-0">
                      Forbind
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Forbundne fakturasystemer — accounting/invoicing connectors.
              Mirror of the ad-account section above but for the partner's
              billing backend. The project drawer reads from this list to
              show "Send til Dinero" (or whichever is connected) as a
              one-tap CTA on every project. */}
          <section className="card" id="fakturasystemer">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-[15px] font-semibold text-[var(--ink)]">Forbundne fakturasystemer</div>
                <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Bruges af &quot;Send til faktura&quot; i Projekter — projektdata flyder direkte til dit regnskab.</div>
              </div>
            </div>
            <ul className="space-y-2.5">
              {INVOICE_SYSTEMS.map((s) => (
                <li key={s.id} className="flex items-center gap-3 p-3 rounded-[var(--r-md)] border border-[var(--line-2)]">
                  <div className="size-10 rounded-md grid place-items-center text-white text-[15px] font-bold shrink-0" style={{ background: s.color }}>{s.tag}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-[var(--ink)]">{s.name}</div>
                    <div className="text-[11.5px] text-[var(--ink-3)] truncate">{s.connected ? s.account : "Ikke forbundet"}</div>
                  </div>
                  {s.connected ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#2D4A0F] bg-[#E1EFD2] px-2 py-1 rounded-full">
                        <span className="size-1.5 rounded-full bg-[#5B7F2C]" />
                        Forbundet
                      </span>
                      <button onClick={() => pushToast(`${s.name} afbrudt (demo)`)} className="text-[12px] font-semibold text-[var(--ink-3)] hover:text-[#8a1f1f] shrink-0">
                        Afbryd
                      </button>
                    </>
                  ) : (
                    <button onClick={() => pushToast(`${s.name} forbundet (demo)`, "success")} className="btn btn-secondary !py-1.5 shrink-0">
                      Forbind
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-[11.5px] text-[var(--ink-3)] mt-3 leading-[1.5]">
              Vi sender kun de felter dit system kræver: kunde, postnr, projektreference, varelinjer og beløb ekskl. moms. Carl Ras gemmer ikke fakturadata.
            </p>
          </section>

          {/* Theme preference */}
          <section className="card">
            <div className="mb-4">
              <div className="text-[15px] font-semibold text-[var(--ink)]">Tema-foretrukket</div>
              <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Standard BU-tema når du logger ind. Du kan altid skifte i toppen af appen.</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => {
                const sel = theme.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={
                      "flex items-center gap-2.5 p-3 rounded-[var(--r-md)] border text-left transition-colors " +
                      (sel
                        ? "border-[var(--accent)] bg-[var(--accent-tint)]"
                        : "border-[var(--line-2)] hover:border-[var(--ink-4)]")
                    }
                  >
                    <span className="size-3 rounded-full shrink-0" style={{ background: t.accent }} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] font-semibold text-[var(--ink)] truncate">{t.label}</span>
                      <span className="block text-[12px] text-[var(--ink-3)] truncate">{t.season}</span>
                    </span>
                    {sel && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-press)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Danger zone */}
          <section className="card !border-[#FBE2E2]">
            <div className="text-[15px] font-semibold text-[#8a1f1f]">Forlad partnerskabet</div>
            <p className="text-[12.5px] text-[var(--ink-2)] mt-2 leading-[1.5] max-w-[520px]">
              Hvis I ikke længere ønsker at være Carl Ras Forhandler-partner, kan I forlade her. I beholder jeres normale B2B-konto på carl-ras.dk — kun partner-funktioner (leads, point, kampagner) ophører.
            </p>
            <button onClick={() => pushToast("Kontakt din partneransvarlige først.")} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#8a1f1f] hover:underline">
              Anmod om udmeldelse →
            </button>
          </section>
        </div>

        {/* RIGHT — quick info */}
        <aside className="space-y-4 self-start lg:sticky lg:top-[72px]">
          <section className="card">
            <div className="t-eyebrow mb-3">Push-notifikationer</div>
            <p className="text-[12.5px] text-[var(--ink-2)] leading-[1.5]">
              Push leveres til din browser når du har Forhandler Partnerskab åbent i en fane.
              Mobil-push kommer i Q3 2026.
            </p>
          </section>

          <section className="card !p-4 bg-[var(--canvas-2)] !border-0">
            <div className="t-eyebrow !text-[12px]">Brug for hjælp?</div>
            <p className="text-[12px] text-[var(--ink-2)] mt-1.5 leading-[1.5]">
              Spørgsmål om indstillinger? Skriv til <strong className="text-[var(--ink)] font-semibold">support@carl-ras.dk</strong> — vi svarer indenfor en arbejdsdag.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* Toggle switch */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={
        "relative w-[36px] h-[20px] rounded-full transition-colors shrink-0 " +
        (checked ? "bg-[var(--accent)]" : "bg-[var(--line)]")
      }
    >
      <span
        className="absolute top-[2px] size-[16px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all"
        style={{ left: checked ? "18px" : "2px" }}
      />
    </button>
  );
}
