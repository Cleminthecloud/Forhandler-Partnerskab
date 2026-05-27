"use client";

import { useState, useMemo } from "react";
import { SPECIALISTS } from "@/lib/data";
import { Icon, type IconName } from "./Icon";

export type VisitReason =
  | "projekt"
  | "reklamation"
  | "kontrakt"
  | "sparring"
  | "ny-ejer"
  | "andet";

const REASONS: { id: VisitReason; label: string; icon: IconName; lane: "konsulent" | "specialist" }[] = [
  { id: "projekt",     label: "Projekt på lokationen", icon: "wrench",          lane: "specialist" },
  { id: "sparring",    label: "Faglig sparring",       icon: "lightbulb",       lane: "specialist" },
  { id: "reklamation", label: "Reklamation / fejl",    icon: "alert-triangle",  lane: "konsulent" },
  { id: "kontrakt",    label: "Kontrakt / bonus",      icon: "file-text",       lane: "konsulent" },
  { id: "ny-ejer",     label: "Ny ejer / overdragelse",icon: "handshake",       lane: "konsulent" },
  { id: "andet",       label: "Andet",                 icon: "ellipsis",        lane: "konsulent" },
];

const SUGGESTED_TIMES = [
  { day: "I morgen",   hour: "10:00" },
  { day: "I morgen",   hour: "14:00" },
  { day: "Om 2 dage",  hour: "09:30" },
  { day: "Om 3 dage",  hour: "13:00" },
];

export type BookVisitContext = {
  /** "konsulent" = relationship/Dennis · "specialist" = field expert (Jens, Tina, etc.) */
  lane: "konsulent" | "specialist";
  /** Pre-filled "what's it about" */
  defaultReason?: VisitReason;
  /** Optional context — shows in subtitle */
  subtitle?: string;
  /** Pre-filled address. Default = "Hos partneren". */
  defaultLocation?: string;
  /** Pre-filled customer name for context (project lane) */
  customerName?: string;
  /** Optional pre-filled description (e.g., project notes) */
  defaultDescription?: string;
  /** When project lane, the specialist BU to default to (Sikring, Stroxx, etc.) */
  preferredBu?: string;
};

export function BookVisitDialog({
  open,
  onClose,
  onConfirm,
  context,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    reason: VisitReason;
    when: string;
    where: string;
    description: string;
    akut: boolean;
    specialistId?: string;
  }) => void;
  context: BookVisitContext;
}) {
  const [reason, setReason] = useState<VisitReason>(context.defaultReason ?? (context.lane === "specialist" ? "projekt" : "sparring"));
  const [when, setWhen] = useState("");
  const [where, setWhere] = useState(context.defaultLocation ?? "Hos os på adressen");
  const [description, setDescription] = useState(context.defaultDescription ?? "");
  const [akut, setAkut] = useState(false);
  const [specialistId, setSpecialistId] = useState<string>(() => {
    if (context.lane === "konsulent") return "";
    const match = context.preferredBu
      ? SPECIALISTS.find((s) => s.bu.toLowerCase().includes(context.preferredBu!.toLowerCase()))
      : null;
    return (match ?? SPECIALISTS[0]).id;
  });

  const filteredReasons = useMemo(
    () => REASONS.filter((r) => r.lane === context.lane || r.id === "andet"),
    [context.lane]
  );

  const selectedSpec = SPECIALISTS.find((s) => s.id === specialistId);

  if (!open) return null;

  const isKonsulent = context.lane === "konsulent";
  const title = isKonsulent ? "Book besøg af din konsulent" : "Bestil specialist på lokationen";
  const subtitleText =
    context.subtitle ?? (isKonsulent
      ? "Dennis Holmberg kontakter dig og bekræfter inden for 2 timer i åbningstid."
      : "Vi sender den rette tekniker ud — typisk inden for 3 hverdage.");

  function pickTime(label: string, hour: string) {
    const date = new Date();
    if (label.startsWith("Om")) {
      const n = parseInt(label.replace("Om ", ""), 10);
      date.setDate(date.getDate() + n);
    } else {
      date.setDate(date.getDate() + 1);
    }
    const [h, m] = hour.split(":");
    date.setHours(parseInt(h), parseInt(m), 0, 0);
    setWhen(date.toISOString().slice(0, 16));
  }

  function submit() {
    onConfirm({ reason, when, where, description, akut, specialistId: isKonsulent ? undefined : specialistId });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/45 grid place-items-center p-4 animate-in" onClick={onClose}>
      <div className="bg-white rounded-[var(--r-xl)] max-w-xl w-full shadow-[var(--shadow-4)] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-[var(--line-2)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="t-eyebrow">{isKonsulent ? "Din konsulent" : "Bestil specialist"}</div>
              <h3 className="t-h2 mt-1.5">{title}</h3>
              <p className="text-[13px] text-[var(--ink-3)] mt-2 leading-[1.5]">{subtitleText}</p>
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-full grid place-items-center hover:bg-[var(--canvas-2)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors shrink-0"
              aria-label="Luk"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          {/* Customer context (project lane) */}
          {context.customerName && (
            <div className="rounded-[var(--r-md)] bg-[var(--canvas-2)] p-3 flex items-center gap-3">
              <div className="size-9 rounded-lg bg-white grid place-items-center shrink-0 shadow-[var(--shadow-1)] text-[var(--ink-2)]">
                <Icon name="home" size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-[var(--ink-3)] uppercase tracking-wider font-semibold">Kunde</div>
                <div className="text-[14px] font-semibold text-[var(--ink)] truncate">{context.customerName}</div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-2">Hvad handler det om?</label>
            <div className="grid grid-cols-2 gap-2">
              {filteredReasons.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReason(r.id)}
                  className={
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--r-md)] border text-left transition-colors " +
                    (reason === r.id
                      ? "border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--ink)]"
                      : "border-[var(--line-2)] bg-white text-[var(--ink-2)] hover:border-[var(--ink-3)]")
                  }
                >
                  <Icon name={r.icon} size={16} className={reason === r.id ? "text-[var(--accent-press)]" : "text-[var(--ink-3)]"} />
                  <span className="text-[12.5px] font-medium leading-tight">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Specialist picker (specialist lane only) */}
          {!isKonsulent && (
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-2">Specialist</label>
              <select
                value={specialistId}
                onChange={(e) => setSpecialistId(e.target.value)}
                className="w-full px-3 py-2 rounded-[var(--r-sm)] border border-[var(--line-2)] text-[13.5px] bg-white focus:outline-none focus:border-[var(--accent)]"
              >
                {SPECIALISTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.navn} · {s.rolle} ({s.bu})</option>
                ))}
              </select>
              {selectedSpec && (
                <div className="mt-2 text-[11.5px] text-[var(--ink-3)] inline-flex items-center gap-1.5">
                  <Icon name="clock" size={12} /> {selectedSpec.bu}-specialist · typisk svartid 24 timer
                </div>
              )}
            </div>
          )}

          {/* Suggested times */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-2">Hvornår passer det?</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {SUGGESTED_TIMES.map((t) => (
                <button
                  key={`${t.day}-${t.hour}`}
                  onClick={() => pickTime(t.day, t.hour)}
                  className="px-3 py-1.5 rounded-full bg-[var(--canvas-2)] hover:bg-[var(--accent-tint)] text-[12px] font-medium text-[var(--ink-2)] transition-colors"
                >
                  {t.day} · {t.hour}
                </button>
              ))}
            </div>
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="w-full px-3 py-2 rounded-[var(--r-sm)] border border-[var(--line-2)] text-[13.5px] bg-white focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-2">Hvor?</label>
            <input
              type="text"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder="Hos partneren · kundens adresse · Carl Ras showroom"
              className="w-full px-3 py-2 rounded-[var(--r-sm)] border border-[var(--line-2)] text-[13.5px] bg-white focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-2">
              Beskrivelse <span className="text-[var(--ink-3)] font-normal normal-case tracking-normal">— hvad skal vi forberede?</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={isKonsulent
                ? "Fx vi vil drøfte den nye bonustrappe og gennemgå Q2-tal …"
                : "Fx kompliceret Stroxx-installation i etageejendom · 12 lejligheder · vi mangler råd til kabling …"}
              className="w-full px-3 py-2 rounded-[var(--r-sm)] border border-[var(--line-2)] text-[13px] bg-white focus:outline-none focus:border-[var(--accent)] resize-none leading-[1.5]"
            />
          </div>

          {/* Akut toggle */}
          <label className="flex items-start gap-3 p-3 rounded-[var(--r-md)] border border-[var(--line-2)] cursor-pointer hover:bg-[var(--canvas-2)] transition-colors">
            <input
              type="checkbox"
              checked={akut}
              onChange={(e) => setAkut(e.target.checked)}
              className="mt-0.5 size-4 accent-[var(--accent)] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[var(--ink)]">Akut? Ring i stedet for email</div>
              <div className="text-[11.5px] text-[var(--ink-3)] mt-0.5 leading-[1.4]">
                {isKonsulent
                  ? "Dennis ringer dig op inden for 30 min i åbningstid (08–16)."
                  : "Vi ringer dig op inden for 1 time i åbningstid og sætter specialisten direkte på."}
              </div>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-[var(--line-2)] bg-[var(--canvas-2)] flex items-center justify-between gap-3 rounded-b-[var(--r-xl)]">
          <div className="text-[11.5px] text-[var(--ink-3)] leading-[1.4] flex-1 min-w-0 inline-flex items-center gap-1.5">
            {akut ? (
              <><Icon name="phone-call" size={13} /> Du bliver ringet op snarest.</>
            ) : (
              <><Icon name="mail" size={13} /> Du modtager en kalender-invite + email-bekræftelse.</>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={onClose} className="btn btn-secondary">Annullér</button>
            <button
              onClick={submit}
              disabled={!when || !description}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              <Icon name={akut ? "phone-call" : "calendar"} size={14} />
              {akut ? "Send akut-anmodning" : "Book besøg"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
