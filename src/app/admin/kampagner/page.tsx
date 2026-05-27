"use client";
import { CAMPAIGNS } from "@/lib/data";
import { THEMES } from "@/lib/themes";
import { useApp } from "@/components/AppState";

export default function AdminKampagner() {
  const { pushToast } = useApp();
  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10">
      <div className="t-tagline" style={{ color: "var(--cr-blue)" }}>KAMPAGNER · UDGIVELSE</div>
      <h1 className="t-display mt-3 text-[var(--cr-navy-deep)]">Kampagner pr. tema</h1>
      <p className="t-lead mt-2 max-w-[680px]">
        Tegn nye kampagner, opdatér eksisterende, publicér til partnernes Materialer-værktøjskasse.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button onClick={() => pushToast("Kampagne-editor åbnes…")} className="pill pill-primary">+ Ny kampagne</button>
        <button onClick={() => pushToast("Import fra Canva startes…")} className="pill pill-light">Import fra Canva</button>
        <button onClick={() => pushToast("Eksport til Adobe…")} className="pill pill-light">Eksport til Adobe</button>
      </div>

      {THEMES.map((theme) => {
        const themed = CAMPAIGNS.filter((c) => c.tema === theme.id);
        return (
          <section key={theme.id} className="mt-10">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="size-3 rounded-full" style={{ background: theme.accent }} />
              <h2 className="text-[20px] font-semibold text-[var(--cr-navy-deep)]">{theme.label}</h2>
              <span className="text-[12px] text-[var(--ink-muted-48)]">{theme.bu} · {theme.season}</span>
              <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ml-auto" style={{ background: theme.accentSoft, color: theme.accentInk }}>
                {theme.status}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {themed.map((c) => (
                <div key={c.id} className="card">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl grid place-items-center text-2xl shrink-0" style={{ background: theme.accentSoft }}>
                      {c.heroEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="t-body-strong text-[var(--cr-navy-deep)]">{c.titel}</div>
                      <p className="text-[12px] text-[var(--ink-muted-48)] line-clamp-2 mt-1">{c.hovedbudskab}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: theme.accentSoft, color: theme.accentInk }}>
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {c.formater.map((f) => (
                      <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-pearl)] border border-[var(--hairline)]">
                        {f.replace("print-", "").replace("digital-", "")}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => pushToast(`Redigerer "${c.titel}"`)} className="pill pill-light text-[12px] flex-1">Redigér</button>
                    <button onClick={() => pushToast(`Statistik for "${c.titel}"`)} className="pill pill-light text-[12px] flex-1">Stats</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
