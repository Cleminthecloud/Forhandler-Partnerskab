"use client";

// Force dynamic rendering — these pages use client hooks (useSearchParams) and/or
// heavy Recharts components that can hang Next.js static page generation.
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  SPECIALISTS, CHAT_THREADS, SCENARIOS, PRODUCTS,
  Product, Scenario, ScenarioChip, ScenarioStep,
} from "@/lib/data";
import { useApp } from "@/components/AppState";
import { PageHeader } from "@/components/PageHeader";

/* =====================================================================
   Specialister — AI-style scripted chat. Each scenario is a deterministic
   state machine. Bot messages reveal one bubble at a time with a typing
   delay, product cards render inline, quick-reply chips advance the flow,
   and "Læg i kurv" actions push to the global basket.
   ===================================================================== */

interface ChatItem {
  id: string;
  kind: "user" | "bot" | "products" | "tilbud-sent" | "suggestions";
  text?: string;
  products?: Product[];
  tid: string;
}

function nowTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
}

function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export default function SpecialisterPage() {
  const { pushToast, basket, addToBasket } = useApp();
  const [activeId, setActiveId] = useState(SPECIALISTS[0].id);
  const [draft, setDraft] = useState("");
  /* Mobile-only navigation between list and chat views. On desktop both
     panes are visible, so this is ignored. Default = list (mobile users
     pick a specialist first; on desktop the first specialist is preselected
     and the list+chat are visible side-by-side). */
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  // Scripted-scenario state
  const [items, setItems] = useState<ChatItem[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const active = SPECIALISTS.find((s) => s.id === activeId)!;
  const seedThread = CHAT_THREADS[activeId];

  /* Switching specialist — reset chat state in handler, not effect, per React 19 rules */
  function switchSpecialist(id: string) {
    // Always advance to chat view on mobile when a specialist is tapped.
    setMobileView("chat");
    if (id === activeId) return;
    setActiveId(id);
    setItems([]);
    setActiveScenario(null);
    setActiveStepId(null);
    setIsTyping(false);
  }

  /* Auto-scroll to bottom on new content */
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [items, isTyping]);

  /* Scenarios available for the active specialist */
  const availableScenarios = useMemo(
    () => SCENARIOS.filter((s) => s.specialistId === activeId),
    [activeId]
  );

  /* Run a step: reveal bot messages with typing delays, then products */
  const runStep = useCallback(async (scenario: Scenario, stepId: string) => {
    const step: ScenarioStep | undefined = scenario.steps[stepId];
    if (!step) return;
    setActiveStepId(stepId);

    // Reveal each bot bubble with typing delay
    for (let i = 0; i < step.bot.length; i++) {
      setIsTyping(true);
      const delay = 700 + Math.min(step.bot[i].length * 12, 1400);
      await new Promise((r) => setTimeout(r, delay));
      setIsTyping(false);
      setItems((prev) => [
        ...prev,
        { id: `b-${Date.now()}-${i}`, kind: "bot", text: step.bot[i], tid: nowTime() },
      ]);
      // Small breath between bubbles
      await new Promise((r) => setTimeout(r, 240));
    }

    // Then products (single message containing the cards)
    if (step.products && step.products.length > 0) {
      const prods = step.products.map(productById).filter(Boolean) as Product[];
      setItems((prev) => [
        ...prev,
        { id: `p-${Date.now()}`, kind: "products", products: prods, tid: nowTime() },
      ]);
    }
  }, []);

  /* Start a scenario */
  const startScenario = useCallback((scenario: Scenario) => {
    setActiveScenario(scenario);
    setItems([
      { id: `u-${Date.now()}`, kind: "user", text: scenario.userText, tid: nowTime() },
    ]);
    setTimeout(() => runStep(scenario, scenario.firstStep), 350);
  }, [runStep]);

  /* Handle chip click */
  const onChip = useCallback((chip: ScenarioChip) => {
    if (!activeScenario || !activeStepId) return;
    const currentStep = activeScenario.steps[activeStepId];
    // Add user echo of the chip choice
    setItems((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, kind: "user", text: chip.label, tid: nowTime() },
    ]);

    if (chip.action.kind === "restart") {
      setTimeout(() => {
        setItems([]);
        setActiveScenario(null);
        setActiveStepId(null);
      }, 300);
      return;
    }

    // Capture `next` in a local — TS narrowing doesn't survive into setTimeout closures
    const nextStepId = chip.action.next;

    // For add-all: drop current step's products into basket
    if (chip.action.kind === "add-all" && currentStep?.products) {
      const productsToAdd = currentStep.products.map(productById).filter(Boolean) as Product[];
      productsToAdd.forEach((p) => addToBasket(p, 25));
      pushToast(`${productsToAdd.length} produkter (×25) lagt i kurv`, "success");
    }

    if (chip.action.kind === "send-tilbud") {
      pushToast("Tilbud sendt til kunde + cc dig", "success");
      setItems((prev) => [
        ...prev,
        { id: `t-${Date.now()}`, kind: "tilbud-sent", tid: nowTime() },
      ]);
    }

    setTimeout(() => runStep(activeScenario, nextStepId), 280);
  }, [activeScenario, activeStepId, runStep, addToBasket, pushToast]);

  /* Handle add-to-basket from a single product card */
  const onAddSingle = useCallback((p: Product) => {
    addToBasket(p, 1);
    pushToast(`${p.brand} ${p.navn.slice(0, 32)}${p.navn.length > 32 ? "…" : ""} lagt i kurv`, "success");
  }, [addToBasket, pushToast]);

  /* Free-text send — fallback when no scenario matches.
     Always surfaces the available scenario suggestions inline right
     after the bot's invitation, so the user can act on what's offered. */
  const send = useCallback(() => {
    if (!draft.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, kind: "user", text: draft.trim(), tid: nowTime() },
    ]);
    setDraft("");
    setTimeout(async () => {
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 900));
      setIsTyping(false);
      const now = Date.now();
      setItems((prev) => [
        ...prev,
        {
          id: `b-${now}`,
          kind: "bot",
          text: `Lad mig hjælpe — vælg et af forslagene herunder, eller skriv lidt mere om hvad du arbejder med. Jeg er hurtigere når jeg ved om det er Smart Lock, alarm eller adgangskontrol.`,
          tid: nowTime(),
        },
        // Show the actual scenarios inline as clickable cards
        { id: `s-${now}`, kind: "suggestions", tid: nowTime() },
      ]);
    }, 400);
  }, [draft]);

  /* Current step (for chip rendering) */
  const currentStep = activeScenario && activeStepId
    ? activeScenario.steps[activeStepId]
    : null;
  const showChips = currentStep && !isTyping && currentStep.chips && currentStep.chips.length > 0;
  const showStarterChips = !activeScenario && items.length === 0;

  /* Basket items related to this conversation — for the right rail */
  const basketTotalKr = useMemo(() => {
    return basket.reduce((sum, b) => {
      const num = parseFloat(b.pris.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, ""));
      return sum + (isNaN(num) ? 0 : num) * b.qty;
    }, 0);
  }, [basket]);

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] animate-in">
      {/* ─── HEADER ─── */}
      <div className="px-6 lg:px-10 xl:px-12 pt-6 pb-3 shrink-0">
        <PageHeader
          variant="compact"
          eyebrow="Tal med Carl Ras"
          title="Specialister"
          themeColor="var(--accent)"
          actions={basket.length > 0 ? (
            <a
              href="https://www.carl-ras.dk"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary !py-1.5"
              data-tt="Gå til carl-ras.dk kurv"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-mt-0.5 mr-1.5 inline">
                <path d="M3 7h18l-2 12H5z" /><path d="M9 7V4h6v3" />
              </svg>
              Kurv ({basket.reduce((n, b) => n + b.qty, 0)})
            </a>
          ) : undefined}
        />
      </div>

      {/* ─── 3-pane editor on desktop; on mobile shows ONE pane at a time
          (list OR chat) controlled by mobileView state. Tapping a specialist
          advances to chat. Back button in chat header returns to list. */}
      <div className="flex-1 grid gap-4 px-0 sm:px-4 lg:px-10 xl:px-12 pb-0 sm:pb-6 grid-cols-1 lg:grid-cols-[260px_1fr_300px] min-h-0">

        {/* LEFT — Specialist list. On mobile: only visible when mobileView=list */}
        <aside className={"card !p-0 overflow-y-auto self-stretch " + (mobileView === "list" ? "block" : "hidden lg:block")}>
          <div className="px-4 py-3 border-b border-[var(--line-2)]">
            <div className="t-eyebrow !text-[12px]">Mine specialister</div>
            <div className="text-[12px] text-[var(--ink-3)] mt-1">6 tilknyttet din region</div>
          </div>
          {SPECIALISTS.map((s) => {
            const sel = activeId === s.id;
            const t = CHAT_THREADS[s.id];
            const last = t?.messages[t.messages.length - 1];
            return (
              <button
                key={s.id}
                onClick={() => switchSpecialist(s.id)}
                className={"w-full text-left px-4 py-3 border-b border-[var(--line-2)] flex items-center gap-3 hover:bg-[var(--canvas-2)] transition-colors " + (sel ? "bg-[var(--accent-tint)]" : "")}
              >
                <SpecialistAvatar specialist={s} size={40} showOnline />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--ink)] truncate">{s.navn}</div>
                  <div className="text-[12px] text-[var(--ink-3)] truncate">{s.rolle} · {s.bu}</div>
                  {last && <div className="text-[12px] text-[var(--ink-3)] truncate mt-0.5">{last.text.slice(0, 38)}{last.text.length > 38 ? "…" : ""}</div>}
                </div>
              </button>
            );
          })}
        </aside>

        {/* CENTER — Chat pane. On mobile: only visible when mobileView=chat */}
        <section className={"flex flex-col sm:rounded-[var(--r-lg)] sm:border sm:border-[var(--line)] bg-[var(--canvas)] overflow-hidden min-h-0 " + (mobileView === "chat" ? "block" : "hidden lg:block")}>
          {/* Chat header — with back button on mobile */}
          <div className="px-3 sm:px-5 py-3 border-b border-[var(--line-2)] flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileView("list")}
              aria-label="Tilbage til specialister"
              className="lg:hidden size-10 rounded-full grid place-items-center text-[var(--ink-2)] hover:bg-[var(--canvas-2)] transition-colors -ml-1 shrink-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <SpecialistAvatar specialist={active} size={40} showOnline />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[var(--ink)]">{active.navn}</span>
                <span className="text-[12px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--accent-tint)] text-[var(--accent-press)]">AI-assisteret</span>
              </div>
              <div className="text-[12px] text-[var(--ink-3)]">
                {active.online ? <><span className="text-[#5DBA47]">●</span> Online · {active.responstid}</> : <><span className="text-[var(--ink-4)]">●</span> Offline · {active.responstid}</>}
                <span className="mx-1.5">·</span>
                {active.rolle} · {active.bu}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-3 bg-[var(--canvas-2)]">
            {/* Existing thread (history) */}
            {items.length === 0 && seedThread && seedThread.messages.length > 0 && (
              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] bg-[var(--canvas-2)] px-2">Tidligere</span>
                </div>
                {seedThread.messages.map((m, i) => (
                  <MessageBubble key={i} from={m.from === "partner" ? "user" : "bot"} text={m.text} tid={m.tid} specialist={active} />
                ))}
                <div className="text-center pt-3">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] bg-[var(--canvas-2)] px-2">I dag</span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {items.length === 0 && (!seedThread || seedThread.messages.length === 0) && (
              <div className="h-full grid place-items-center text-center">
                <div className="max-w-[400px]">
                  <div className="mx-auto w-fit"><SpecialistAvatar specialist={active} size={64} /></div>
                  <div className="mt-4 text-[16px] font-semibold text-[var(--ink)]">Hej — jeg er {active.navn.split(" ")[0]}.</div>
                  <div className="mt-1.5 text-[13px] text-[var(--ink-3)] leading-[1.5]">
                    {active.rolle} hos Carl Ras{active.bu ? " · " + active.bu : ""}. Jeg svarer på spec, finder produkter, og bygger pakker — alt sammen direkte i din kurv hvis du vil.
                  </div>
                </div>
              </div>
            )}

            {/* Scripted scenario messages */}
            {items.map((it) => {
              if (it.kind === "user") return <MessageBubble key={it.id} from="user" text={it.text!} tid={it.tid} specialist={active} />;
              if (it.kind === "bot") return <MessageBubble key={it.id} from="bot" text={it.text!} tid={it.tid} specialist={active} />;
              if (it.kind === "tilbud-sent") return <TilbudSentNote key={it.id} tid={it.tid} />;
              if (it.kind === "products" && it.products) return (
                <ProductCardRow key={it.id} products={it.products} onAdd={onAddSingle} />
              );
              if (it.kind === "suggestions") return (
                <SuggestionsRow key={it.id} scenarios={availableScenarios} onPick={startScenario} />
              );
              return null;
            })}

            {/* Typing indicator */}
            {isTyping && <TypingIndicator specialist={active} />}

            {/* Chips (current step) */}
            {showChips && (
              <div className="flex flex-wrap gap-2 pt-1" style={{ animation: "fadeIn 240ms ease-out both" }}>
                {currentStep!.chips!.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => onChip(c)}
                    className="text-[12.5px] font-medium px-3.5 py-2 rounded-full bg-white border border-[var(--line)] hover:border-[var(--accent)] hover:bg-[var(--accent-tint)] hover:text-[var(--accent-press)] text-[var(--ink-2)] transition-colors"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Starter chips + input */}
          <div className="border-t border-[var(--line-2)] bg-[var(--canvas)] shrink-0">
            {/* Starter chips — when no conversation yet */}
            {showStarterChips && availableScenarios.length > 0 && (
              <div className="px-4 pt-3 pb-1 flex flex-wrap gap-2">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] w-full mb-1">Foreslag</span>
                {availableScenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => startScenario(sc)}
                    className="text-[12.5px] font-medium px-3 py-1.5 rounded-full bg-[var(--canvas-2)] hover:bg-[var(--accent-tint)] hover:text-[var(--accent-press)] text-[var(--ink-2)] transition-colors border border-transparent hover:border-[var(--accent)]"
                  >
                    ✨ {sc.starterLabel}
                  </button>
                ))}
              </div>
            )}

            {/* Free text input */}
            <div className="p-3 flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                placeholder={`Spørg ${active.navn.split(" ")[0]} om et produkt, en pris, en case…`}
                className="flex-1 rounded-full px-4 py-2.5 bg-[var(--canvas-2)] text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent)] border border-transparent transition-all"
              />
              <button onClick={send} disabled={!draft.trim()} className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                Send
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT — Session summary. Hidden on mobile (basket count is in the
            header Kurv link; tip cards aren't useful on a phone). */}
        <aside className="hidden lg:flex flex-col gap-3 self-stretch overflow-y-auto">
          <div className="card !p-4">
            <div className="t-eyebrow mb-3">I denne samtale</div>
            <SessionSummary items={items} />
          </div>

          <div className="card !p-4">
            <div className="flex items-baseline justify-between mb-3">
              <div className="t-eyebrow !text-[12px]">Kurv</div>
              {basket.length > 0 && (
                <span className="text-[12px] text-[var(--ink-3)] tabular-nums">
                  {basket.reduce((n, b) => n + b.qty, 0)} stk
                </span>
              )}
            </div>
            {basket.length === 0 ? (
              <div className="text-[12px] text-[var(--ink-3)] leading-[1.5]">
                Når specialisten foreslår produkter kan du lægge dem direkte i kurv herinde.
              </div>
            ) : (
              <>
                <ul className="space-y-3">
                  {basket.slice(0, 4).map((b) => (
                    <li key={b.productId} className="flex items-center gap-3">
                      <div className="size-14 rounded-[var(--r-md)] bg-white border border-[var(--line-2)] grid place-items-center text-[20px] shrink-0 overflow-hidden p-1.5">
                        {b.image ? (
                          <Image src={b.image} alt={b.navn} width={56} height={56} className="size-full object-contain" />
                        ) : (
                          <span>{b.emoji}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold text-[var(--ink)] truncate">{b.brand}</div>
                        <div className="text-[12px] text-[var(--ink-3)] truncate">×{b.qty} · {b.pris}</div>
                      </div>
                    </li>
                  ))}
                  {basket.length > 4 && (
                    <li className="text-[12px] text-[var(--ink-3)] pl-1">+{basket.length - 4} til</li>
                  )}
                </ul>
                <div className="mt-4 pt-3 border-t border-[var(--line-2)]">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[12px] text-[var(--ink-3)]">Total ex. moms</span>
                    <span className="text-[15px] font-semibold text-[var(--ink)] tabular-nums">
                      {basketTotalKr.toLocaleString("da-DK", { maximumFractionDigits: 0 })} kr
                    </span>
                  </div>
                  <a
                    href="https://www.carl-ras.dk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full !py-2 text-center"
                  >
                    Gå til carl-ras.dk
                  </a>
                </div>
              </>
            )}
          </div>

          <div className="card !p-4 bg-[var(--canvas-2)] !border-0">
            <div className="t-eyebrow !text-[12px]">Tip</div>
            <p className="text-[12px] text-[var(--ink-2)] mt-1.5 leading-[1.5]">
              Specialisten kan også sende et færdigt tilbud til en kunde — med dit logo og pakkepris. Spørg fx <em className="text-[var(--ink)] not-italic font-medium">&quot;Send tilbud til kunde&quot;</em>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =====================================================================
   Sub-components
   ===================================================================== */

/* Shared avatar — renders the specialist's portrait photo if present,
   falls back to the colored initials chip. The green "online" dot is optional. */
function SpecialistAvatar({
  specialist,
  size,
  showOnline,
}: {
  specialist: { bg: string; initialer: string; portrait?: string; navn?: string; online?: boolean };
  size: number;
  showOnline?: boolean;
}) {
  const fontSize = Math.max(10, Math.round(size * 0.32));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {specialist.portrait ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={specialist.portrait}
          alt={specialist.navn ?? specialist.initialer}
          className="size-full rounded-full object-cover"
        />
      ) : (
        <div
          className="size-full rounded-full grid place-items-center text-white font-semibold"
          style={{ background: specialist.bg, fontSize }}
        >
          {specialist.initialer}
        </div>
      )}
      {showOnline && specialist.online && (
        <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-[#5DBA47] ring-2 ring-white" />
      )}
    </div>
  );
}

function MessageBubble({ from, text, tid, specialist }: { from: "user" | "bot"; text: string; tid: string; specialist: { navn: string; bg: string; initialer: string; portrait?: string } }) {
  const isUser = from === "user";
  return (
    <div className={"flex gap-2.5 " + (isUser ? "justify-end" : "justify-start")} style={{ animation: "slideUpFade 280ms cubic-bezier(0.22,1,0.36,1) both" }}>
      {!isUser && (
        <div className="shrink-0 mt-1"><SpecialistAvatar specialist={specialist} size={28} /></div>
      )}
      <div className={"max-w-[78%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-[1.5] " + (isUser
        ? "bg-[var(--accent)] text-white rounded-br-md"
        : "bg-white border border-[var(--line-2)] rounded-bl-md text-[var(--ink)]"
      )}>
        <div>{text}</div>
        <div className={"text-[12px] mt-1 " + (isUser ? "text-white/70" : "text-[var(--ink-3)]")}>
          {tid}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ specialist }: { specialist: { bg: string; initialer: string; portrait?: string; navn?: string } }) {
  return (
    <div className="flex gap-2.5" style={{ animation: "fadeIn 200ms ease-out both" }}>
      <div className="shrink-0 mt-1"><SpecialistAvatar specialist={specialist} size={28} /></div>
      <div className="bg-white border border-[var(--line-2)] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-[var(--ink-3)]" style={{ animation: "typing 1200ms ease-in-out infinite" }} />
        <span className="size-1.5 rounded-full bg-[var(--ink-3)]" style={{ animation: "typing 1200ms ease-in-out 200ms infinite" }} />
        <span className="size-1.5 rounded-full bg-[var(--ink-3)]" style={{ animation: "typing 1200ms ease-in-out 400ms infinite" }} />
      </div>
    </div>
  );
}

function TilbudSentNote({ tid }: { tid: string }) {
  return (
    <div className="flex justify-center my-1" style={{ animation: "slideUpFade 280ms cubic-bezier(0.22,1,0.36,1) both" }}>
      <div className="inline-flex items-center gap-2 text-[11.5px] text-[var(--ink-3)] bg-[var(--canvas)] border border-[var(--line-2)] rounded-full px-3 py-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5DBA47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
        </svg>
        <span><strong className="text-[var(--ink-2)]">Tilbud sendt til kunde</strong> · {tid}</span>
      </div>
    </div>
  );
}

function ProductCardRow({ products, onAdd }: { products: Product[]; onAdd: (p: Product) => void }) {
  return (
    <div className="flex flex-col gap-2.5 pl-9" style={{ animation: "slideUpFade 320ms cubic-bezier(0.22,1,0.36,1) both" }}>
      {products.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
    </div>
  );
}

/* Inline scenario suggestions — shown after the bot's fallback "vælg et af forslagene" message.
   Acts on the same click-handler as the starter chips above the input. */
function SuggestionsRow({ scenarios, onPick }: { scenarios: Scenario[]; onPick: (s: Scenario) => void }) {
  if (scenarios.length === 0) return null;
  return (
    <div className="pl-9" style={{ animation: "slideUpFade 320ms cubic-bezier(0.22,1,0.36,1) both" }}>
      <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-3)] mb-2 pl-0.5">Forslag</div>
      <div className="grid gap-2 max-w-[78%]">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => onPick(sc)}
            className="group flex items-center gap-3 p-3 rounded-[var(--r-md)] bg-white border border-[var(--line-2)] hover:border-[var(--accent)] hover:bg-[var(--accent-tint)] text-left transition-all"
          >
            <span className="size-8 rounded-full grid place-items-center text-[14px] shrink-0 bg-[var(--canvas-2)] group-hover:bg-white transition-colors">
              ✨
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-semibold text-[var(--ink)] truncate">{sc.starterLabel}</span>
              <span className="block text-[11.5px] text-[var(--ink-3)] truncate mt-0.5">{sc.userText.slice(0, 70)}{sc.userText.length > 70 ? "…" : ""}</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--ink-3)] group-hover:text-[var(--accent-press)] shrink-0">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  return (
    <div className="bg-white rounded-[var(--r-md)] border border-[var(--line-2)] p-3 flex items-center gap-4 max-w-[82%] hover:border-[var(--accent)] hover:shadow-[var(--shadow-1)] transition-all">
      <div className="size-24 rounded-[var(--r-md)] bg-white border border-[var(--line-2)] grid place-items-center text-[32px] shrink-0 overflow-hidden p-2">
        {product.image ? (
          <Image src={product.image} alt={product.navn} width={96} height={96} className="object-contain max-h-full max-w-full" />
        ) : (
          <span>{product.emoji}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{product.brand}</span>
          <span className="text-[9.5px] text-[var(--ink-4)] tabular-nums">#{product.id}</span>
        </div>
        <div className="text-[13.5px] font-semibold text-[var(--ink)] mt-1 leading-[1.3] line-clamp-2">{product.navn}</div>
        <div className="text-[12.5px] mt-1.5 flex items-baseline gap-2">
          <span className="font-semibold text-[var(--ink)] tabular-nums">{product.pris}</span>
          {product.margin && (
            <span className="text-[12px] text-[var(--ink-3)]">· {product.margin}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          onClick={() => onAdd(product)}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-press)] transition-colors whitespace-nowrap"
        >
          + Læg i kurv
        </button>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-medium px-3 py-1.5 rounded-full text-[var(--ink-2)] hover:text-[var(--accent)] hover:bg-[var(--canvas-2)] transition-colors whitespace-nowrap text-center"
        >
          Se PDP ↗
        </a>
      </div>
    </div>
  );
}

function SessionSummary({ items }: { items: ChatItem[] }) {
  const productsMentioned = items
    .filter((i) => i.kind === "products" && i.products)
    .flatMap((i) => i.products!)
    .reduce((acc, p) => acc.set(p.id, p), new Map<string, Product>());
  const userQuestions = items.filter((i) => i.kind === "user").length;

  if (items.length === 0) {
    return (
      <div className="text-[12px] text-[var(--ink-3)] leading-[1.5]">
        Vælg et af de foreslåede emner nedenfor, eller stil et spørgsmål. Jeg holder styr på produkter og handlinger her.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11.5px]">
        <span className="text-[var(--ink-3)]">Spørgsmål stillet</span>
        <span className="font-semibold text-[var(--ink)] tabular-nums">{userQuestions}</span>
      </div>
      <div className="flex items-center justify-between text-[11.5px]">
        <span className="text-[var(--ink-3)]">Produkter foreslået</span>
        <span className="font-semibold text-[var(--ink)] tabular-nums">{productsMentioned.size}</span>
      </div>
      {productsMentioned.size > 0 && (
        <div className="pt-3 border-t border-[var(--line-2)]">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-2">Anbefalede</div>
          <ul className="space-y-1.5">
            {[...productsMentioned.values()].map((p) => (
              <li key={p.id} className="flex items-center gap-2 text-[11.5px]">
                <span className="text-[14px]">{p.emoji}</span>
                <span className="text-[var(--ink-2)] truncate">{p.brand} {p.navn.slice(0, 20)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
