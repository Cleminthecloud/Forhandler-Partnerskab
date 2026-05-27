"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  ProjectPhase, PhaseStatus, PhaseOwner, ProjectType,
  SPECIALISTS, templateFor,
} from "@/lib/data";

/* =====================================================================
   ProjectPlanner — Gantt-style timeline with click-to-edit phases.

   - Specialist recommendation banner at top (if a template exists for the type)
   - Week-grid header (Uge 1, Uge 2, … N)
   - One row per phase, with a positioned/sized bar colored by status + ansvarlig
   - Click a bar → inline popover to edit name, varighed, ansvarlig, status, delete
   - "+ Tilføj fase" appends a new 1-week phase at the end of the timeline
   - "Anvend specialist-skabelon" applies the template's phases in one click
   ===================================================================== */

interface Props {
  projectType: ProjectType;
  phases: ProjectPhase[];
  onChange: (phases: ProjectPhase[]) => void;
}

const STATUS_STYLE: Record<PhaseStatus, { bar: string; ink: string; label: string; dot: string }> = {
  todo:          { bar: "#ECEEF1", ink: "#515154", label: "Planlagt", dot: "#9CA3AF" },
  "in-progress": { bar: "#E8F0FA", ink: "#0C447C", label: "I gang",   dot: "#1158A3" },
  done:          { bar: "#E1EFD2", ink: "#2D4A0F", label: "Færdig",   dot: "#5B7F2C" },
  blocked:       { bar: "#FBE2E2", ink: "#791F1F", label: "Blokeret", dot: "#C13030" },
};

const OWNER_LABEL: Record<PhaseOwner, string> = {
  partner:    "Partner",
  specialist: "Specialist",
  kunde:      "Kunde",
  "carl-ras": "Carl Ras",
};

const OWNER_STYLE: Record<PhaseOwner, { bg: string; ink: string }> = {
  partner:    { bg: "var(--accent-tint)", ink: "var(--accent-press)" },
  specialist: { bg: "#FCEFCA",            ink: "#6B4A00" },
  kunde:      { bg: "#ECEEF1",            ink: "#4A4F55" },
  "carl-ras": { bg: "#FFF1DC",            ink: "#5C3500" },
};

const WEEK_PX = 64;     // column width per week
const ROW_PX  = 44;     // height of each phase row

export function ProjectPlanner({ projectType, phases, onChange }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const template = templateFor(projectType);
  const curator = template ? SPECIALISTS.find((s) => s.id === template.curatorSpecialistId) : undefined;
  const hasPlan = phases.length > 0;

  // Total weeks = max end of any phase, min 8 for visual breathing room
  const totalWeeks = useMemo(() => {
    if (phases.length === 0) return 8;
    return Math.max(8, ...phases.map((p) => p.startUge + p.varighedUger)) + 1;
  }, [phases]);

  // Completion stats
  const progress = useMemo(() => {
    if (phases.length === 0) return 0;
    const done = phases.filter((p) => p.status === "done").length;
    return Math.round((done / phases.length) * 100);
  }, [phases]);

  function applyTemplate() {
    if (!template) return;
    const next: ProjectPhase[] = template.phases.map((p, i) => ({
      ...p,
      id: `tpl-${Date.now()}-${i}`,
    }));
    onChange(next);
  }

  function updatePhase(id: string, patch: Partial<ProjectPhase>) {
    onChange(phases.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removePhase(id: string) {
    onChange(phases.filter((p) => p.id !== id));
    setEditId(null);
  }

  function addPhase() {
    const lastEnd = phases.length === 0
      ? 0
      : Math.max(...phases.map((p) => p.startUge + p.varighedUger));
    const newPhase: ProjectPhase = {
      id: `ph-${Date.now()}`,
      navn: "Ny fase",
      startUge: lastEnd,
      varighedUger: 1,
      status: "todo",
      ansvarlig: "partner",
    };
    onChange([...phases, newPhase]);
    setEditId(newPhase.id);
  }

  return (
    <div>
      {/* ── Recommendation banner (only when no plan yet AND template exists) ── */}
      {!hasPlan && template && curator && (
        <div className="rounded-[var(--r-md)] border border-[var(--line-2)] bg-gradient-to-br from-[var(--accent-tint)]/40 to-[var(--canvas-2)] p-4 mb-3">
          <div className="flex items-start gap-3">
            <div
              className="size-10 rounded-full grid place-items-center text-white font-semibold text-[12px] shrink-0"
              style={{ background: curator.bg }}
            >
              {curator.initialer}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-[var(--ink)]">
                {curator.navn.split(" ")[0]} anbefaler et forløb baseret på {template.basedOnCount} lignende {projectType.toLowerCase()}-projekter
              </div>
              <p className="text-[11.5px] text-[var(--ink-3)] mt-1 leading-[1.45]">
                {template.phases.length} faser, ca. {Math.max(...template.phases.map((p) => p.startUge + p.varighedUger))} ugers løb. Du kan altid redigere, fjerne eller tilføje faser bagefter.
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={applyTemplate} className="btn btn-primary !py-1.5">
                  Anvend {curator.navn.split(" ")[0]}s skabelon
                </button>
                <button onClick={addPhase} className="btn btn-secondary !py-1.5">
                  Start fra bunden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state when no template + no plan ── */}
      {!hasPlan && !template && (
        <div className="rounded-[var(--r-md)] border-2 border-dashed border-[var(--line)] p-5 text-center">
          <div className="text-[13px] text-[var(--ink-2)] font-medium">Ingen plan endnu</div>
          <div className="text-[11.5px] text-[var(--ink-3)] mt-1">Tilføj faser for at planlægge kundeforløbet.</div>
          <button onClick={addPhase} className="btn btn-primary !py-1.5 mt-3">
            + Tilføj første fase
          </button>
        </div>
      )}

      {/* ── Gantt + edit ── */}
      {hasPlan && (
        <div>
          {/* Progress summary */}
          <div className="flex items-baseline justify-between mb-2.5">
            <div className="text-[12px] text-[var(--ink-3)]">
              {phases.filter((p) => p.status === "done").length} af {phases.length} faser færdige
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[100px] h-1.5 rounded-full bg-[var(--canvas-2)] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: progress + "%", background: progress === 100 ? "#5B7F2C" : "var(--accent)" }} />
              </div>
              <span className="text-[11.5px] text-[var(--ink-2)] tabular-nums font-semibold">{progress}%</span>
            </div>
          </div>

          {/* Gantt — scrollable horizontally */}
          <div className="rounded-[var(--r-md)] border border-[var(--line-2)] overflow-hidden bg-white">
            <div className="overflow-x-auto scrollbar-hidden" style={{ maxWidth: "100%" }}>
              <div style={{ width: totalWeeks * WEEK_PX, minWidth: "100%" }}>
                {/* Week header */}
                <div className="flex border-b border-[var(--line-2)] bg-[var(--canvas-2)] sticky top-0">
                  {Array.from({ length: totalWeeks }, (_, i) => (
                    <div
                      key={i}
                      className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)] text-center py-2 border-r border-[var(--line-2)] last:border-r-0"
                      style={{ width: WEEK_PX }}
                    >
                      Uge&nbsp;{i + 1}
                    </div>
                  ))}
                </div>

                {/* Phase rows */}
                <div className="relative">
                  {/* Vertical week-gridlines */}
                  <div className="absolute inset-0 pointer-events-none flex">
                    {Array.from({ length: totalWeeks }, (_, i) => (
                      <div key={i} className="border-r border-[var(--line-2)]/60 h-full" style={{ width: WEEK_PX }} />
                    ))}
                  </div>

                  {phases.map((phase) => {
                    const style = STATUS_STYLE[phase.status];
                    const owner = OWNER_STYLE[phase.ansvarlig];
                    const left = phase.startUge * WEEK_PX;
                    const width = phase.varighedUger * WEEK_PX - 4; // -4 for small gap
                    const isEditing = editId === phase.id;
                    return (
                      <div
                        key={phase.id}
                        className="relative border-b border-[var(--line-2)] last:border-b-0"
                        style={{ height: ROW_PX }}
                      >
                        <button
                          onClick={() => setEditId(isEditing ? null : phase.id)}
                          className={
                            "absolute top-1/2 -translate-y-1/2 rounded-[6px] flex items-center gap-2 px-2.5 text-left text-[11.5px] font-medium overflow-hidden transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:z-10 " +
                            (isEditing ? "ring-2 ring-[var(--accent)] z-10" : "")
                          }
                          style={{
                            left, width, height: ROW_PX - 8,
                            background: style.bar,
                            color: style.ink,
                            borderLeft: `3px solid ${owner.ink}`,
                          }}
                          title={phase.beskrivelse ?? phase.navn}
                        >
                          {phase.status === "done" && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                          {phase.status === "in-progress" && (
                            <span className="size-2 rounded-full shrink-0" style={{ background: style.dot, animation: "pulse 1.6s ease-in-out infinite" }} />
                          )}
                          <span className="truncate flex-1">{phase.navn}</span>
                          {phase.fromTemplate && (
                            <span className="text-[9px] opacity-60 shrink-0">✨</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Owner legend + add */}
          <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
            <div className="flex items-center gap-3 text-[11px] text-[var(--ink-3)]">
              {(Object.keys(OWNER_STYLE) as PhaseOwner[]).map((o) => (
                <span key={o} className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-3.5 rounded-sm" style={{ background: OWNER_STYLE[o].ink }} />
                  {OWNER_LABEL[o]}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {template && phases.length === 0 && (
                <button onClick={applyTemplate} className="btn btn-secondary !py-1.5">
                  ✨ Brug skabelon
                </button>
              )}
              <button onClick={addPhase} className="btn btn-secondary !py-1.5">
                + Tilføj fase
              </button>
            </div>
          </div>

          {/* Edit panel — appears when a phase is selected */}
          {editId && (
            <PhaseEditPanel
              phase={phases.find((p) => p.id === editId)!}
              onChange={(patch) => updatePhase(editId, patch)}
              onRemove={() => removePhase(editId)}
              onClose={() => setEditId(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   PhaseEditPanel — inline editor below the Gantt for the selected phase
   ===================================================================== */

function PhaseEditPanel({
  phase, onChange, onRemove, onClose,
}: {
  phase: ProjectPhase;
  onChange: (patch: Partial<ProjectPhase>) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const navnRef = useRef<HTMLInputElement>(null);
  useEffect(() => { navnRef.current?.focus(); }, [phase.id]);

  return (
    <div
      className="mt-3 rounded-[var(--r-md)] border border-[var(--accent)] bg-[var(--accent-tint)]/30 p-4"
      style={{ animation: "slideUpFade 200ms cubic-bezier(0.22,1,0.36,1)" }}
    >
      <div className="flex items-baseline justify-between mb-3">
        <div className="t-eyebrow">Rediger fase</div>
        <button onClick={onClose} className="text-[11px] text-[var(--ink-3)] hover:text-[var(--ink)] font-medium">
          Færdig
        </button>
      </div>

      <div className="grid gap-3">
        {/* Name */}
        <div>
          <label className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1">Navn</label>
          <input
            ref={navnRef}
            type="text"
            value={phase.navn}
            onChange={(e) => onChange({ navn: e.target.value })}
            className="field !text-[13px] !bg-white"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1">Note (valgfri)</label>
          <input
            type="text"
            value={phase.beskrivelse ?? ""}
            onChange={(e) => onChange({ beskrivelse: e.target.value })}
            placeholder="Detaljer kun specialisten og du ser…"
            className="field !text-[13px] !bg-white"
          />
        </div>

        {/* Schedule + ownership row */}
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1">Start uge</label>
            <input
              type="number"
              min={0}
              value={phase.startUge}
              onChange={(e) => onChange({ startUge: Math.max(0, parseInt(e.target.value || "0", 10) || 0) })}
              className="field !text-[13px] !bg-white tabular-nums"
            />
          </div>
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1">Varighed (uger)</label>
            <input
              type="number"
              min={1}
              value={phase.varighedUger}
              onChange={(e) => onChange({ varighedUger: Math.max(1, parseInt(e.target.value || "1", 10) || 1) })}
              className="field !text-[13px] !bg-white tabular-nums"
            />
          </div>
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1">Ansvarlig</label>
            <select
              value={phase.ansvarlig}
              onChange={(e) => onChange({ ansvarlig: e.target.value as PhaseOwner })}
              className="field !text-[13px] !bg-white"
            >
              {(Object.keys(OWNER_LABEL) as PhaseOwner[]).map((o) => (
                <option key={o} value={o}>{OWNER_LABEL[o]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1">Status</label>
            <select
              value={phase.status}
              onChange={(e) => onChange({ status: e.target.value as PhaseStatus })}
              className="field !text-[13px] !bg-white"
            >
              {(Object.keys(STATUS_STYLE) as PhaseStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_STYLE[s].label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button onClick={onRemove} className="text-[11.5px] font-semibold text-[#8a1f1f] hover:underline">
            Slet fase
          </button>
        </div>
      </div>
    </div>
  );
}
