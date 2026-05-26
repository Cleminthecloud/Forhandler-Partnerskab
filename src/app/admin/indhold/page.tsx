"use client";
import { BLOG_POSTS, FORUM_THREADS } from "@/lib/data";
import { useApp } from "@/components/AppState";

export default function AdminIndhold() {
  const { pushToast } = useApp();
  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10">
      <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>INDHOLD · MODERATION</div>
      <h1 className="t-display mt-3 text-[var(--cr-navy-deep)]">Blog, forum &amp; specialist-chat</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Publicér artikler, modérer trådene, hold øje med specialist-svartider.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Blog management */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>BLOG · NYHEDER</div>
            <button onClick={() => pushToast("Editor åbnes…")} className="pill pill-primary text-[12px]">+ Nyt indlæg</button>
          </div>
          <ul className="divide-y divide-[var(--divider-soft)]">
            {BLOG_POSTS.slice(0, 5).map((p) => (
              <li key={p.id} className="py-3 flex items-center gap-3">
                <span className="text-2xl shrink-0">{p.hero}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--cr-navy-deep)] truncate">{p.titel}</div>
                  <div className="text-[11px] text-[var(--ink-muted-48)] truncate">{p.forfatter} · {p.dato} · {p.kategori}</div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF1DC] text-[#324A14] shrink-0">Publiceret</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Forum moderation */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>FORUM · TRÅDE</div>
            <span className="text-[11px] text-[var(--ink-muted-48)]">2 til moderation</span>
          </div>
          <ul className="divide-y divide-[var(--divider-soft)]">
            {FORUM_THREADS.slice(0, 5).map((t) => (
              <li key={t.id} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--cr-navy-deep)] truncate">{t.titel}</div>
                  <div className="text-[11px] text-[var(--ink-muted-48)] truncate">{t.forfatter} · {t.svar} svar · {t.likes} ♡</div>
                </div>
                <button onClick={() => pushToast(`Åbner tråd: ${t.titel}`)} className="text-[12px] font-semibold shrink-0" style={{ color: "var(--cr-blue)" }}>Åbn →</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat queue */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>SPECIALIST-CHAT · KØ</div>
            <span className="text-[11px] text-[var(--ink-muted-48)]">Gns. svartid: 14 min</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "Jens Pedersen", bu: "Sikring", queue: 3, response: "12 min" },
              { name: "Tina Holm", bu: "Træning", queue: 1, response: "30 min" },
              { name: "Morten Bach", bu: "Byg", queue: 5, response: "næste dag" },
            ].map((s) => (
              <div key={s.name} className="p-4 rounded-xl bg-[var(--surface-pearl)]">
                <div className="text-[13px] font-semibold text-[var(--cr-navy-deep)]">{s.name}</div>
                <div className="text-[11px] text-[var(--ink-muted-48)]">{s.bu}</div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-[20px] font-semibold text-[var(--cr-navy-deep)]">{s.queue}</span>
                  <span className="text-[11px] text-[var(--ink-muted-48)]">venter · {s.response}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
