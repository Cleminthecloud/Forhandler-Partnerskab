"use client";
import { useState } from "react";
import { SPECIALISTS, CHAT_THREADS, ChatThread } from "@/lib/data";
import { useApp } from "@/components/AppState";

export default function SpecialisterPage() {
  const { pushToast } = useApp();
  const [activeId, setActiveId] = useState(SPECIALISTS[0].id);
  const [draft, setDraft] = useState("");
  const active = SPECIALISTS.find((s) => s.id === activeId)!;
  const thread: ChatThread = CHAT_THREADS[activeId] ?? { specialistId: activeId, messages: [] };

  function send() {
    if (!draft.trim()) return;
    pushToast("Besked sendt til " + active.navn);
    setDraft("");
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>TAL MED CARL RAS</div>
      <h1 className="t-display-lg mt-3 text-[var(--cr-navy-deep)]">Specialister</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Stuck i et installationsproblem? Brug for prisliste, salgsargument, eller en demovideo?
        Stil din Carl Ras-specialist et spørgsmål direkte. Svar inden for arbejdsdagen.
      </p>

      <div className="mt-8 card !p-0 overflow-hidden grid lg:grid-cols-[280px_1fr] min-h-[520px]">
        {/* Specialist list */}
        <aside className="border-r border-[var(--hairline)] overflow-y-auto">
          {SPECIALISTS.map((s) => {
            const sel = activeId === s.id;
            const t = CHAT_THREADS[s.id];
            const last = t?.messages[t.messages.length - 1];
            return (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={"w-full text-left px-4 py-3 border-b border-[var(--divider-soft)] flex items-center gap-3 hover:bg-[var(--surface-pearl)] transition-colors " + (sel ? "bg-[var(--cr-blue-tint)]" : "")}
              >
                <div className="relative shrink-0">
                  <div className="size-10 rounded-full grid place-items-center text-white font-semibold text-[13px]" style={{ background: s.bg }}>
                    {s.initialer}
                  </div>
                  {s.online && <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-[#5B7F2C] ring-2 ring-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--cr-navy-deep)] truncate">{s.navn}</div>
                  <div className="text-[11px] text-[var(--ink-muted-48)] truncate">{s.rolle} · {s.bu}</div>
                  {last && <div className="text-[11px] text-[var(--ink-muted-48)] truncate mt-0.5">{last.text.slice(0, 40)}{last.text.length > 40 ? "…" : ""}</div>}
                </div>
              </button>
            );
          })}
        </aside>

        {/* Chat pane */}
        <div className="flex flex-col">
          <div className="px-5 py-4 border-b border-[var(--hairline)] flex items-center gap-3">
            <div className="size-10 rounded-full grid place-items-center text-white font-semibold text-[13px]" style={{ background: active.bg }}>
              {active.initialer}
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[var(--cr-navy-deep)]">{active.navn}</div>
              <div className="text-[12px] text-[var(--ink-muted-48)]">
                {active.online ? <><span className="text-[#5B7F2C]">●</span> Online · </> : <><span className="text-[#9CA3AF]">●</span> Offline · </>}
                {active.responstid}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--surface-pearl)]">
            {thread.messages.length === 0 ? (
              <div className="text-center text-[14px] text-[var(--ink-muted-48)] py-12">
                Start samtalen med {active.navn.split(" ")[0]} ↓
              </div>
            ) : thread.messages.map((m, i) => (
              <div key={i} className={"flex " + (m.from === "partner" ? "justify-end" : "justify-start")}>
                <div
                  className={"max-w-[75%] rounded-2xl px-4 py-3 text-[14px] " + (m.from === "partner" ? "bg-[var(--cr-blue)] text-white rounded-br-md" : "bg-white border border-[var(--hairline)] rounded-bl-md")}
                >
                  <div>{m.text}</div>
                  <div className={"text-[11px] mt-1 " + (m.from === "partner" ? "text-white/70" : "text-[var(--ink-muted-48)]")}>
                    {m.tid}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--hairline)] p-3 flex items-center gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder={`Spørg ${active.navn.split(" ")[0]} om noget…`}
              className="flex-1 rounded-full px-4 py-2.5 bg-[var(--surface-pearl)] text-[14px] outline-none focus:ring-2 focus:ring-[var(--cr-blue)] border border-transparent"
            />
            <button onClick={send} className="pill pill-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
