"use client";
import { useState, useMemo } from "react";
import { FORUM_THREADS, PARTNERS, CURRENT_PARTNER, ForumThread, ForumReply } from "@/lib/data";
import { useApp } from "@/components/AppState";

const CAT_COLOR: Record<ForumThread["kategori"], { bg: string; ink: string }> = {
  "Tip":           { bg: "#EAF1DC", ink: "#324A14" },
  "Spørgsmål":     { bg: "#E8F0FA", ink: "#0C447C" },
  "Markedsføring": { bg: "#FFF1DC", ink: "#7A4400" },
  "Værktøj":       { bg: "#F3F4F6", ink: "#444" },
  "Snak":          { bg: "#FCE4E6", ink: "#7E0309" },
};

function fallbackReplies(thread: ForumThread): ForumReply[] {
  return [
    { forfatter: "Mads Sørensen", firma: "Hornbæk Låseservice", region: "Nordsjælland", tid: "for 1 t", body: "Spændende vinkel — vi har set noget lignende i Nordsjælland. Lad mig grave noter frem.", likes: 3 },
    { forfatter: "Henrik Larsen", firma: "Tisvilde Tømrer & Bygning", region: "Nordsjælland", tid: "for 30 min", body: "+1 til det. Det er præcis den slags vi har brug for at dele mere af.", likes: 5, reactions: [{ emoji: "👍", count: 2 }] },
    { forfatter: thread.forfatter, firma: thread.forfatterFirma, region: thread.forfatterRegion, tid: "for 15 min", body: "Tak for input — opdaterer med noter inden weekenden 🙏", likes: 2 },
  ];
}

function avatarColor(name: string): string {
  const palette = ["#1158A3", "#002D59", "#5B7F2C", "#A88A6E", "#F49100", "#0C447C", "#7A5B3E"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return palette[h % palette.length];
}

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function ForumPage() {
  const { pushToast } = useApp();
  const [cat, setCat] = useState<ForumThread["kategori"] | "Alle">("Alle");
  const [search, setSearch] = useState("");
  const [openThread, setOpenThread] = useState<ForumThread | null>(null);
  const [draft, setDraft] = useState("");

  const filtered = useMemo(() => {
    return FORUM_THREADS.filter((t) => {
      if (cat !== "Alle" && t.kategori !== cat) return false;
      if (search && !(t.titel + t.body).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [cat, search]);

  const ligesindede = useMemo(() => {
    return PARTNERS.filter((p) =>
      p.id !== CURRENT_PARTNER.id &&
      (p.faggruppe === CURRENT_PARTNER.faggruppe || p.region === CURRENT_PARTNER.region)
    ).slice(0, 4);
  }, []);

  const trending = useMemo(() => [...FORUM_THREADS].sort((a, b) => b.likes - a.likes).slice(0, 3), []);

  function postReply() {
    if (!draft.trim()) return;
    pushToast("Dit svar er sendt");
    setDraft("");
  }

  return (
    <div className="px-6 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      <header className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <div>
          <div className="t-eyebrow">Forum &amp; peer-netværk</div>
          <h1 className="t-display mt-3">Forum</h1>
          <p className="t-body-lg mt-3 max-w-[600px]">
            Stil et spørgsmål. Del en tip. Find en ligesindet i din region eller faggruppe.
          </p>
        </div>
        <button onClick={() => pushToast("Ny tråd-editor åbnes…")} className="btn btn-primary">
          + Ny tråd
        </button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <main>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-[var(--canvas)] border border-[var(--line)] rounded-full pl-4 pr-2 h-10 flex-1 min-w-[260px] focus-within:border-[var(--accent)] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--ink-3)]"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Søg i tråde…"
                className="flex-1 bg-transparent outline-none text-[14px]"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["Alle", "Tip", "Spørgsmål", "Markedsføring", "Værktøj", "Snak"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={"px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors " +
                    (cat === c ? "bg-[var(--ink)] text-white" : "bg-[var(--canvas)] border border-[var(--line)] hover:bg-[var(--canvas-2)]")}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <ul className="space-y-3">
            {filtered.map((t) => {
              const cc = CAT_COLOR[t.kategori];
              const ac = avatarColor(t.forfatter);
              const lastReply = (t.replies && t.replies[t.replies.length - 1]) ?? null;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setOpenThread(t)}
                    className="w-full text-left card card-hover block group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="size-10 rounded-full grid place-items-center text-white font-semibold text-[12px] shrink-0"
                        style={{ background: ac }}
                      >
                        {initials(t.forfatter)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide" style={{ background: cc.bg, color: cc.ink }}>
                            {t.kategori}
                          </span>
                          <span className="text-[12px] text-[var(--ink-3)]">{t.dato}</span>
                          <span className="text-[12px] text-[var(--ink-3)]">·</span>
                          <span className="text-[12px] text-[var(--ink-3)]">{t.forfatter} · {t.forfatterFirma}</span>
                        </div>
                        <h3 className="text-[17px] font-semibold text-[var(--ink)] leading-snug group-hover:text-[var(--accent)] transition-colors">{t.titel}</h3>
                        <p className="text-[14px] text-[var(--ink-2)] mt-1.5 line-clamp-2 leading-[1.5]">{t.body}</p>

                        {lastReply && (
                          <div className="mt-3 pt-3 border-t border-[var(--line-2)] flex items-start gap-2">
                            <div
                              className="size-6 rounded-full grid place-items-center text-white font-semibold text-[9px] shrink-0"
                              style={{ background: avatarColor(lastReply.forfatter) }}
                            >
                              {initials(lastReply.forfatter)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px]">
                                <span className="font-semibold text-[var(--ink)]">{lastReply.forfatter}</span>
                                <span className="text-[var(--ink-3)]"> · {lastReply.tid}</span>
                              </div>
                              <div className="text-[12px] text-[var(--ink-2)] line-clamp-1">{lastReply.body}</div>
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-4 text-[12px] text-[var(--ink-3)]">
                          <span className="inline-flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11a8 8 0 11-3-6.2L21 3v6h-6"/></svg>
                            {t.svar} svar
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                            {t.likes}
                          </span>
                          <span className="ml-auto inline-flex items-center gap-1.5 text-[var(--accent)] font-semibold">
                            Åbn tråd →
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="card text-center py-10 text-[var(--ink-3)]">Ingen tråde matcher.</li>
            )}
          </ul>
        </main>

        <aside className="space-y-4 self-start xl:sticky xl:top-4">
          <div className="card">
            <div className="t-eyebrow !text-[var(--accent)]">Find ligesindede</div>
            <div className="text-[15px] font-semibold mt-1 text-[var(--ink)]">Partnere som dig</div>
            <p className="text-[12px] text-[var(--ink-3)] mt-1">
              Samme faggruppe ({CURRENT_PARTNER.faggruppe}) eller region.
            </p>
            <ul className="mt-4 space-y-3">
              {ligesindede.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div className="size-9 rounded-xl grid place-items-center text-white text-[11px] font-semibold shrink-0" style={{ background: p.logoBg }}>
                    {p.initialer}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[var(--ink)] truncate">{p.firma}</div>
                    <div className="text-[11px] text-[var(--ink-3)] truncate">{p.by} · {p.tier}</div>
                  </div>
                  <button onClick={() => pushToast(`Forbindelsesforespørgsel sendt til ${p.firma}`)} className="text-[12px] font-semibold text-[var(--accent)] hover:underline shrink-0">
                    Skriv
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="t-eyebrow !text-[var(--accent)]">Trender</div>
            <ul className="mt-3 space-y-3">
              {trending.map((t) => (
                <li key={t.id}>
                  <button onClick={() => setOpenThread(t)} className="text-left block w-full group">
                    <div className="text-[13px] font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] line-clamp-2">{t.titel}</div>
                    <div className="text-[11px] text-[var(--ink-3)] mt-0.5">♡ {t.likes} · 💬 {t.svar}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {openThread && (
        <ThreadDrawer
          thread={openThread}
          onClose={() => setOpenThread(null)}
          draft={draft}
          setDraft={setDraft}
          onPost={postReply}
        />
      )}
    </div>
  );
}

function ThreadDrawer({
  thread, onClose, draft, setDraft, onPost,
}: {
  thread: ForumThread;
  onClose: () => void;
  draft: string;
  setDraft: (s: string) => void;
  onPost: () => void;
}) {
  const replies = thread.replies ?? fallbackReplies(thread);
  const cc = CAT_COLOR[thread.kategori];
  const ac = avatarColor(thread.forfatter);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-[820px] bg-white h-full flex flex-col shadow-2xl animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[var(--line-2)] flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide" style={{ background: cc.bg, color: cc.ink }}>
                {thread.kategori}
              </span>
              <span className="text-[12px] text-[var(--ink-3)]">{thread.dato}</span>
            </div>
            <h2 className="t-h2 mt-2 leading-tight">{thread.titel}</h2>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-full hover:bg-[var(--canvas-2)] grid place-items-center text-[var(--ink-2)] shrink-0"
            aria-label="Luk"
          >
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 bg-[var(--canvas-2)] space-y-4">
          <article className="bg-white rounded-[var(--r-lg)] p-5 border border-[var(--line-2)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full grid place-items-center text-white font-semibold text-[12px]" style={{ background: ac }}>
                {initials(thread.forfatter)}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[var(--ink)]">{thread.forfatter}</div>
                <div className="text-[11px] text-[var(--ink-3)]">{thread.forfatterFirma} · {thread.forfatterRegion}</div>
              </div>
              <span className="ml-auto text-[11px] text-[var(--ink-3)]">{thread.dato}</span>
            </div>
            <p className="text-[14px] text-[var(--ink)] leading-[1.55]">{thread.body}</p>
            <div className="mt-4 flex items-center gap-4 text-[12px]">
              <button className="inline-flex items-center gap-1.5 text-[var(--ink-3)] hover:text-[#E30613] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                {thread.likes}
              </button>
              <button className="inline-flex items-center gap-1.5 text-[var(--ink-3)] hover:text-[var(--accent)] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11a8 8 0 11-3-6.2L21 3v6h-6"/></svg>
                Svar
              </button>
            </div>
          </article>

          {replies.map((r, i) => {
            const rc = avatarColor(r.forfatter);
            return (
              <article key={i} className="bg-white rounded-[var(--r-lg)] p-4 border border-[var(--line-2)] ml-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full grid place-items-center text-white font-semibold text-[11px]" style={{ background: rc }}>
                    {initials(r.forfatter)}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--ink)]">{r.forfatter}</div>
                    <div className="text-[11px] text-[var(--ink-3)]">{r.firma} · {r.region}</div>
                  </div>
                  <span className="ml-auto text-[11px] text-[var(--ink-3)]">{r.tid}</span>
                </div>
                <p className="text-[14px] text-[var(--ink)] leading-[1.55]">{r.body}</p>
                <div className="mt-3 flex items-center gap-3 text-[12px]">
                  <button className="inline-flex items-center gap-1.5 text-[var(--ink-3)] hover:text-[#E30613] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                    {r.likes}
                  </button>
                  {r.reactions?.map((rx) => (
                    <span key={rx.emoji} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--canvas-2)] text-[11px]">
                      {rx.emoji} {rx.count}
                    </span>
                  ))}
                  <button className="ml-auto text-[var(--accent)] font-semibold hover:underline">Svar</button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-[var(--line-2)] bg-white">
          <div className="flex gap-3">
            <div className="size-9 rounded-full grid place-items-center text-white font-semibold text-[11px] shrink-0" style={{ background: CURRENT_PARTNER.logoBg }}>
              {CURRENT_PARTNER.initialer}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onPost(); } }}
                placeholder="Skriv et svar…"
                className="flex-1 rounded-full px-4 py-2.5 bg-[var(--canvas-2)] text-[14px] outline-none border border-transparent focus:border-[var(--accent)] focus:bg-white transition-colors"
              />
              <button onClick={onPost} className="btn btn-primary" disabled={!draft.trim()}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
