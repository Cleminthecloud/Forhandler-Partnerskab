"use client";
import { useState } from "react";
import { useApp } from "@/components/AppState";
import { PageHeader } from "@/components/PageHeader";

type NotificationKey =
  | "partner-applied" | "partner-tier-up"
  | "lead-assigned"   | "lead-unclaimed"
  | "event-attendance"| "specialist-mention"
  | "campaign-publish-needed" | "weekly-region-digest";

interface NotificationDef {
  key: NotificationKey;
  label: string;
  hint: string;
  email: boolean;
  slack: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationDef[] = [
  { key: "partner-applied",         label: "Ny partner-ansøgning",        hint: "Når en lokal forhandler ansøger om partnerskab",       email: true,  slack: true  },
  { key: "partner-tier-up",         label: "Tier-opgradering",            hint: "Når en partner rykker fra Sølv → Guld",                email: true,  slack: false },
  { key: "lead-assigned",           label: "Leads tildelt mig",           hint: "Når et lead routes til en af mine partnere",           email: false, slack: true  },
  { key: "lead-unclaimed",          label: "Uafhentede leads · 48 t",    hint: "Lead der ikke er kontaktet inden for 48 timer",        email: true,  slack: true  },
  { key: "event-attendance",        label: "Lav event-tilmelding",        hint: "Når et event er under 50% fyldt 1 uge før",            email: true,  slack: false },
  { key: "specialist-mention",      label: "@Omtaler i chat",             hint: "Når en partner tagger dig i specialist-chat",          email: true,  slack: true  },
  { key: "campaign-publish-needed", label: "Kampagne-publicering",        hint: "Når en kampagne i mit tema kræver godkendelse",        email: true,  slack: false },
  { key: "weekly-region-digest",    label: "Ugentlig region-status",      hint: "Mandagsmail med region-KPIs og partner-aktivitet",     email: true,  slack: false },
];

export default function AdminSettingsPage() {
  const { pushToast } = useApp();
  const [notifs, setNotifs] = useState<NotificationDef[]>(DEFAULT_NOTIFICATIONS);
  const [autoLeadRouting, setAutoLeadRouting] = useState(true);
  const [autoTierUpgrade, setAutoTierUpgrade] = useState(false);
  const [slackChannel, setSlackChannel] = useState("#partners-nordsj");

  function setChannel(key: NotificationKey, channel: "email" | "slack", value: boolean) {
    setNotifs((prev) => prev.map((n) => n.key === key ? { ...n, [channel]: value } : n));
  }

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in min-h-[calc(100vh-48px)]">
      <PageHeader
        eyebrow="Min konto"
        title="Indstillinger"
        lead="Notifikationer, Slack-integration og automatiseringer for din rolle som regional sales lead."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <section className="card !p-0 overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[var(--line-2)]">
              <div className="text-[15px] font-semibold text-[var(--ink)]">Notifikationer</div>
              <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Vælg leverings­kanal pr. begivenhed.</div>
            </div>
            <div className="grid grid-cols-[1fr_80px_80px] gap-3 px-6 py-2 border-b border-[var(--line-2)] bg-[var(--canvas-2)] text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
              <span>Begivenhed</span>
              <span className="text-center">Email</span>
              <span className="text-center">Slack</span>
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
                    <Toggle checked={n.slack} onChange={(v) => setChannel(n.key, "slack", v)} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Automation */}
          <section className="card">
            <div className="mb-4">
              <div className="text-[15px] font-semibold text-[var(--ink)]">Automatiseringer</div>
              <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Lad systemet håndtere rutinen — du bliver kun trukket ind når noget kræver et menneske.</div>
            </div>
            <ul className="divide-y divide-[var(--line-2)]">
              <li className="flex items-start gap-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-[var(--ink)]">Automatisk lead-routing</div>
                  <div className="text-[11.5px] text-[var(--ink-3)] mt-0.5 leading-[1.5]">Tildel automatisk nye leads til nærmeste aktive partner inden for partnerens specialer.</div>
                </div>
                <Toggle checked={autoLeadRouting} onChange={setAutoLeadRouting} />
              </li>
              <li className="flex items-start gap-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-[var(--ink)]">Automatisk tier-opgradering</div>
                  <div className="text-[11.5px] text-[var(--ink-3)] mt-0.5 leading-[1.5]">Ryk partner fra Sølv → Guld når point-grænsen rammes, uden manuel godkendelse.</div>
                </div>
                <Toggle checked={autoTierUpgrade} onChange={setAutoTierUpgrade} />
              </li>
            </ul>
          </section>

          {/* Slack integration */}
          <section className="card">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-[15px] font-semibold text-[var(--ink)]">Slack</div>
                <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Hvor skal Slack-notifikationer leveres?</div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#2D4A0F] bg-[#E1EFD2] px-2 py-1 rounded-full">
                <span className="size-1.5 rounded-full bg-[#5B7F2C]" />
                Forbundet
              </span>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1.5">Standard kanal</label>
                <input
                  type="text"
                  value={slackChannel}
                  onChange={(e) => setSlackChannel(e.target.value)}
                  className="field !text-[13.5px]"
                />
              </div>
              <button onClick={() => pushToast(`Test-besked sendt til ${slackChannel}`, "success")} className="btn btn-secondary !py-2">
                Send test
              </button>
            </div>
          </section>

          {/* Danger zone */}
          <section className="card !border-[#FBE2E2]">
            <div className="text-[15px] font-semibold text-[#8a1f1f]">Adgang</div>
            <p className="text-[12.5px] text-[var(--ink-2)] mt-2 leading-[1.5] max-w-[520px]">
              Slet din session og log ud af alle browsere. Du kan altid logge ind igen med dit Carl Ras SSO.
            </p>
            <button onClick={() => pushToast("Sessioner ryddet (demo)")} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#8a1f1f] hover:underline">
              Log ud af alle sessioner →
            </button>
          </section>
        </div>

        <aside className="space-y-4 self-start lg:sticky lg:top-[72px]">
          <section className="card">
            <div className="t-eyebrow mb-3">Slack-status</div>
            <ul className="space-y-2.5 text-[12.5px]">
              <li className="flex items-baseline justify-between"><span className="text-[var(--ink-3)]">Workspace</span><span className="font-semibold text-[var(--ink)]">Carl Ras HQ</span></li>
              <li className="flex items-baseline justify-between"><span className="text-[var(--ink-3)]">Bot bruger</span><span className="font-semibold text-[var(--ink)]">@forhandler-bot</span></li>
              <li className="flex items-baseline justify-between"><span className="text-[var(--ink-3)]">Beskeder · 7 dage</span><span className="font-semibold text-[var(--ink)] tabular-nums">128</span></li>
            </ul>
          </section>

          <section className="card !p-4 bg-[var(--canvas-2)] !border-0">
            <div className="t-eyebrow !text-[12px]">Brug for hjælp?</div>
            <p className="text-[12px] text-[var(--ink-2)] mt-1.5 leading-[1.5]">
              Drift-spørgsmål: <strong className="text-[var(--ink)] font-semibold">drift@carl-ras.dk</strong>. Vi har vagt mandag-fredag 8-17.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

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
