"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  CURRENT_PARTNER, PROJECTS, PRODUCTS, SPECIALISTS,
  Project, ProjectStatus, ProjectType, Product,
  productsForBehov,
} from "@/lib/data";
import { useApp } from "@/components/AppState";
import { PageHeader } from "@/components/PageHeader";

const STATUS_ORDER: ProjectStatus[] = ["Konsultation", "Tilbud", "Aftalt", "I gang", "Færdig"];

const STATUS_STYLE: Record<ProjectStatus, { bg: string; ink: string; dot: string }> = {
  Konsultation:   { bg: "#FFF1DC", ink: "#5C3500", dot: "#F49100" },  // theme orange — early funnel
  Tilbud:         { bg: "#E8F0FA", ink: "#0C447C", dot: "#1158A3" },
  Aftalt:         { bg: "#E1EFD2", ink: "#2D4A0F", dot: "#5B7F2C" },
  "I gang":       { bg: "#FCEFCA", ink: "#6B4A00", dot: "#C99A20" },
  Færdig:         { bg: "#ECEEF1", ink: "#4A4F55", dot: "#7E8993" },
};

const TYPE_EMOJI: Record<ProjectType, string> = {
  Sommerhus:  "🏖️",
  Bolig:      "🏡",
  Erhverv:    "🏢",
  Udlejning:  "🏘️",
  Ejendom:    "🏗️",
};

export default function ProjekterPage() {
  const { pushToast, addToBasket } = useApp();
  const [projects, setProjects] = useState<Project[]>(() =>
    PROJECTS.filter((p) => p.partnerId === CURRENT_PARTNER.id)
  );
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [activeStatus, setActiveStatus] = useState<ProjectStatus | "Alle">("Alle");
  const [showNew, setShowNew] = useState(false);

  // Close drawer on ESC
  useEffect(() => {
    if (!openProject) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenProject(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openProject]);

  const counts = useMemo(() => {
    const c: Record<ProjectStatus, number> = { Konsultation: 0, Tilbud: 0, Aftalt: 0, "I gang": 0, Færdig: 0 };
    projects.forEach((p) => { c[p.status]++; });
    return c;
  }, [projects]);

  const filtered = useMemo(
    () => activeStatus === "Alle" ? projects : projects.filter((p) => p.status === activeStatus),
    [projects, activeStatus]
  );

  const totalPipeline = useMemo(
    () => projects
      .filter((p) => p.status !== "Færdig")
      .reduce((sum, p) => sum + p.forventetKr, 0),
    [projects]
  );
  const aktivProvisionEst = useMemo(
    () => projects
      .filter((p) => p.status !== "Færdig" && p.status !== "Konsultation")
      .reduce((sum, p) => sum + (p.forventetKr * p.marginPct / 100), 0),
    [projects]
  );

  const updateStatus = useCallback((id: string, status: ProjectStatus) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    setOpenProject((cur) => cur && cur.id === id ? { ...cur, status } : cur);
    pushToast(`Status opdateret til "${status}"`, "success");
  }, [pushToast]);

  const addProjectProductsToBasket = useCallback((project: Project) => {
    const prods = project.produktIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as Product[];
    prods.forEach((p) => addToBasket(p, project.enheder));
    pushToast(`${prods.length} produkter (×${project.enheder}) lagt i kurv`, "success");
  }, [addToBasket, pushToast]);

  return (
    <div className="px-8 lg:px-10 xl:px-12 py-8 lg:py-10 animate-in">
      <PageHeader
        eyebrow="Salg · projekter"
        title="Kundeprojekter"
        lead="Hold styr på dine kundeforløb fra første konsultation til installation er færdig. Hver projekt samler kunde, produkter, specialist og forventet provision."
        actions={
          <button onClick={() => setShowNew(true)} className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="-mt-0.5 mr-1.5 inline" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nyt projekt
          </button>
        }
      />

      {/* ─── KPI strip ─── */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Aktive projekter" value={projects.filter((p) => p.status !== "Færdig").length.toString()} delta={`${counts.Konsultation} nye`} />
        <Tile label="Pipeline-værdi" value={`${(totalPipeline / 1000).toLocaleString("da-DK", { maximumFractionDigits: 1 })}k kr`} delta="ex. moms" subtle />
        <Tile label="Forventet provision" value={`${(aktivProvisionEst / 1000).toLocaleString("da-DK", { maximumFractionDigits: 1 })}k kr`} delta="aktive aftaler" />
        <Tile label="Vundne (12 mdr)" value={projects.filter((p) => p.status === "Færdig").length.toString()} delta="+1 sidste uge" />
      </section>

      {/* ─── Status pipeline ─── */}
      <section className="mt-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveStatus("Alle")}
          className={"px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors " +
            (activeStatus === "Alle"
              ? "bg-[var(--ink)] text-white"
              : "bg-[var(--canvas-2)] text-[var(--ink-2)] hover:bg-[var(--line-2)]")}
        >
          Alle <span className="opacity-65 tabular-nums">· {projects.length}</span>
        </button>
        {STATUS_ORDER.map((s) => {
          const sel = activeStatus === s;
          const style = STATUS_STYLE[s];
          return (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={"px-3.5 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-2 transition-all " +
                (sel ? "bg-[var(--ink)] text-white" : "bg-[var(--canvas-2)] text-[var(--ink-2)] hover:bg-[var(--line-2)]")}
            >
              <span className="size-1.5 rounded-full" style={{ background: sel ? "white" : style.dot }} />
              {s} <span className="opacity-65 tabular-nums">· {counts[s]}</span>
            </button>
          );
        })}
      </section>

      {/* ─── Project cards ─── */}
      <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 card !p-10 text-center">
            <div className="text-[14px] text-[var(--ink-3)]">Ingen projekter i &quot;{activeStatus}&quot;.</div>
          </div>
        ) : filtered.map((p) => {
          const style = STATUS_STYLE[p.status];
          const products = p.produktIds.map((id) => PRODUCTS.find((x) => x.id === id)).filter(Boolean) as Product[];
          const specialist = p.specialistId ? SPECIALISTS.find((s) => s.id === p.specialistId) : null;
          return (
            <button
              key={p.id}
              onClick={() => setOpenProject(p)}
              className="card card-hover text-left flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="size-11 rounded-xl grid place-items-center text-[22px] shrink-0" style={{ background: "var(--canvas-2)" }}>
                  {p.emoji ?? TYPE_EMOJI[p.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-[var(--ink)] leading-tight truncate">{p.kunde}</div>
                  <div className="text-[12px] text-[var(--ink-3)] mt-0.5 truncate">{p.type} · {p.by} · {p.enheder} {p.enheder === 1 ? "enhed" : "enheder"}</div>
                </div>
                <span
                  className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
                  style={{ background: style.bg, color: style.ink }}
                >
                  {p.status}
                </span>
              </div>

              {/* Product micro-strip */}
              <div className="flex items-center gap-1.5">
                {products.slice(0, 4).map((prod) => (
                  <div
                    key={prod.id}
                    className="size-8 rounded-md bg-[var(--canvas-2)] grid place-items-center overflow-hidden text-[14px] shrink-0"
                    title={prod.brand + " " + prod.navn}
                  >
                    {prod.image ? (
                      <Image src={prod.image} alt={prod.navn} width={32} height={32} className="object-cover size-8" />
                    ) : (
                      <span>{prod.emoji}</span>
                    )}
                  </div>
                ))}
                {products.length > 4 && (
                  <span className="text-[11px] text-[var(--ink-3)] ml-1">+{products.length - 4}</span>
                )}
                <div className="ml-auto text-right">
                  <div className="text-[13.5px] font-semibold text-[var(--ink)] tabular-nums">
                    {(p.forventetKr / 1000).toLocaleString("da-DK", { maximumFractionDigits: 1 })}k kr
                  </div>
                  <div className="text-[10.5px] text-[var(--ink-3)]">
                    ~{Math.round(p.forventetKr * p.marginPct / 100).toLocaleString("da-DK")} kr i provision
                  </div>
                </div>
              </div>

              {/* Footer row: specialist + deadline */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-[var(--line-2)]">
                {specialist ? (
                  <div className="flex items-center gap-1.5">
                    <div className="size-5 rounded-full grid place-items-center text-white font-semibold text-[9px] shrink-0" style={{ background: specialist.bg }}>
                      {specialist.initialer}
                    </div>
                    <span className="text-[11px] text-[var(--ink-2)] truncate">{specialist.navn.split(" ")[0]}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[var(--ink-3)] italic">Ingen specialist booket</span>
                )}
                {p.deadline && (
                  <span className="ml-auto text-[11px] text-[var(--ink-3)] tabular-nums">
                    Frist {new Date(p.deadline).toLocaleDateString("da-DK", { day: "numeric", month: "short" })}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </section>

      {/* ─── Project detail drawer ─── */}
      {openProject && (
        <ProjectDrawer
          project={openProject}
          onClose={() => setOpenProject(null)}
          onUpdateStatus={updateStatus}
          onAddAllToBasket={() => addProjectProductsToBasket(openProject)}
          onSendTilbud={() => {
            pushToast(`Tilbud sendt til ${openProject.kunde}`, "success");
            updateStatus(openProject.id, "Tilbud");
          }}
          onBookSpecialist={(specialistId, dato) => {
            setProjects((prev) => prev.map((p) =>
              p.id === openProject.id ? { ...p, specialistId, hjemmebesøgDato: dato } : p
            ));
            setOpenProject((cur) => cur ? { ...cur, specialistId, hjemmebesøgDato: dato } : cur);
            const sp = SPECIALISTS.find((s) => s.id === specialistId);
            pushToast(`Hjemmebesøg booket med ${sp?.navn.split(" ")[0]} · ${new Date(dato).toLocaleDateString("da-DK", { day: "numeric", month: "short" })}`, "success");
          }}
        />
      )}

      {/* ─── New project sheet (lightweight) ─── */}
      {showNew && (
        <div className="fixed inset-0 z-50 bg-black/45 grid place-items-center p-6 animate-in" onClick={() => setShowNew(false)}>
          <div className="bg-white rounded-[var(--r-xl)] max-w-md w-full p-7 shadow-[var(--shadow-4)]" onClick={(e) => e.stopPropagation()}>
            <div className="t-eyebrow">Nyt projekt</div>
            <h3 className="t-h2 mt-2">Opret et kundeprojekt</h3>
            <p className="t-body mt-3">
              I demo-modus: nye projekter oprettes fra et lead i Leads-fanen, eller fra en specialist-chat (klik &quot;Send tilbud&quot;). Den fulde formular kommer senere.
            </p>
            <div className="mt-5 flex gap-2 justify-end">
              <button className="btn btn-secondary" onClick={() => setShowNew(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   ProjectDrawer — slide-in right pane with full project detail
   ===================================================================== */

function ProjectDrawer({
  project, onClose, onUpdateStatus, onAddAllToBasket, onSendTilbud, onBookSpecialist,
}: {
  project: Project;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
  onAddAllToBasket: () => void;
  onSendTilbud: () => void;
  onBookSpecialist: (specialistId: string, dato: string) => void;
}) {
  const { addToBasket, pushToast } = useApp();
  const [showBookForm, setShowBookForm] = useState(false);
  const [bookSpecialistId, setBookSpecialistId] = useState(SPECIALISTS[0].id);
  const [bookDato, setBookDato] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  const products = project.produktIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as Product[];
  const specialist = project.specialistId ? SPECIALISTS.find((s) => s.id === project.specialistId) : null;
  const style = STATUS_STYLE[project.status];

  // Cross-sell suggestion: products from PRODUCT_RECS that aren't already in project
  const crossSell: Product[] = useMemo(() => {
    const inScope = new Set(project.produktIds);
    const behovHint = project.type === "Udlejning" ? "adgangskontrol udlejning" : project.type === "Sommerhus" ? "smart lock" : "låse";
    const { products: recs } = productsForBehov(behovHint);
    return recs.filter((p) => !inScope.has(p.id)).slice(0, 2);
  }, [project.produktIds, project.type]);

  return (
    <div className="fixed inset-0 z-40 animate-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
      <aside
        className="absolute top-[48px] right-0 bottom-0 w-[720px] max-w-[96vw] bg-white border-l border-[var(--line)] shadow-[-8px_0_24px_rgba(0,0,0,0.10)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideInRight 280ms cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* Drawer header */}
        <div className="px-7 py-5 border-b border-[var(--line-2)] flex items-start gap-4">
          <div className="size-14 rounded-2xl grid place-items-center text-[26px] shrink-0" style={{ background: "var(--canvas-2)" }}>
            {project.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="t-eyebrow !text-[10px]">{project.type} · {project.by}</div>
            <div className="text-[20px] font-semibold text-[var(--ink)] mt-1 leading-tight">{project.kunde}</div>
            <div className="text-[12.5px] text-[var(--ink-3)] mt-1">{project.kontakt}</div>
          </div>
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
            style={{ background: style.bg, color: style.ink }}
          >
            {project.status}
          </span>
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

        {/* Status pipeline picker */}
        <div className="px-7 py-3 border-b border-[var(--line-2)] flex items-center gap-1">
          {STATUS_ORDER.map((s, i) => {
            const sel = project.status === s;
            const passed = STATUS_ORDER.indexOf(project.status) > i;
            return (
              <button
                key={s}
                onClick={() => onUpdateStatus(project.id, s)}
                className={
                  "flex-1 text-[11px] font-semibold uppercase tracking-wider py-1.5 rounded transition-colors border " +
                  (sel
                    ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                    : passed
                      ? "bg-[var(--canvas-2)] text-[var(--ink-2)] border-transparent"
                      : "bg-transparent text-[var(--ink-3)] border-transparent hover:bg-[var(--canvas-2)] hover:text-[var(--ink-2)]")
                }
              >
                {s}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-6">
          {/* KPI row */}
          <section className="grid grid-cols-3 gap-3">
            <DrawerStat label="Enheder" value={project.enheder.toString()} />
            <DrawerStat label="Forventet" value={`${(project.forventetKr / 1000).toLocaleString("da-DK", { maximumFractionDigits: 1 })}k kr`} />
            <DrawerStat
              label="Din provision"
              value={`${Math.round(project.forventetKr * project.marginPct / 100).toLocaleString("da-DK")} kr`}
              hint={`${project.marginPct}% margin`}
            />
          </section>

          {/* Products in scope */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <div className="t-eyebrow">Produkter i tilbud · {products.length}</div>
              <button onClick={onAddAllToBasket} className="text-[12px] font-semibold text-[var(--accent)] hover:underline">
                + Læg alle i kurv (×{project.enheder})
              </button>
            </div>
            <ul className="space-y-2">
              {products.map((p) => (
                <li key={p.id} className="flex items-center gap-3 p-2.5 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
                  <div className="size-10 rounded-md bg-white grid place-items-center text-[18px] shrink-0 overflow-hidden">
                    {p.image ? <Image src={p.image} alt={p.navn} width={40} height={40} className="object-cover size-10" /> : <span>{p.emoji}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[var(--ink)] truncate">{p.brand} <span className="font-normal text-[var(--ink-2)]">· {p.navn}</span></div>
                    <div className="text-[11px] text-[var(--ink-3)] tabular-nums">#{p.id} · {p.pris}</div>
                  </div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-[var(--ink-3)] hover:text-[var(--accent)] shrink-0">PDP ↗</a>
                </li>
              ))}
            </ul>
          </section>

          {/* Cross-sell */}
          {crossSell.length > 0 && (
            <section>
              <div className="t-eyebrow mb-3">Kryds-salg — kunder med {project.type.toLowerCase()} køber også</div>
              <ul className="space-y-2">
                {crossSell.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 p-2.5 rounded-[var(--r-md)] border border-dashed border-[var(--line)]">
                    <div className="size-10 rounded-md bg-[var(--canvas-2)] grid place-items-center text-[18px] shrink-0 overflow-hidden">
                      {p.image ? <Image src={p.image} alt={p.navn} width={40} height={40} className="object-cover size-10" /> : <span>{p.emoji}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-[var(--ink)] truncate">{p.brand} <span className="font-normal text-[var(--ink-2)]">· {p.navn}</span></div>
                      <div className="text-[11px] text-[var(--ink-3)] tabular-nums">{p.pris} · {p.margin}</div>
                    </div>
                    <button
                      onClick={() => { addToBasket(p, project.enheder); pushToast(`${p.brand} lagt i kurv (×${project.enheder})`, "success"); }}
                      className="text-[11px] font-semibold text-[var(--accent)] hover:underline shrink-0"
                    >
                      + Tilføj
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Specialist booking */}
          <section>
            <div className="t-eyebrow mb-3">Specialist</div>
            {specialist ? (
              <div className="flex items-center gap-3 p-3 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
                <div className="size-10 rounded-full grid place-items-center text-white font-semibold text-[13px] shrink-0" style={{ background: specialist.bg }}>
                  {specialist.initialer}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--ink)]">{specialist.navn}</div>
                  <div className="text-[11.5px] text-[var(--ink-3)]">
                    {specialist.rolle} · {specialist.bu}
                    {project.hjemmebesøgDato && (
                      <> · Hjemmebesøg {new Date(project.hjemmebesøgDato).toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" })}</>
                    )}
                  </div>
                </div>
                <button onClick={() => setShowBookForm(true)} className="text-[11.5px] font-semibold text-[var(--accent)] hover:underline shrink-0">Skift</button>
              </div>
            ) : (
              <button
                onClick={() => setShowBookForm(true)}
                className="w-full p-4 rounded-[var(--r-md)] border-2 border-dashed border-[var(--line)] hover:border-[var(--accent)] hover:bg-[var(--accent-tint)] transition-colors text-center"
              >
                <div className="text-[13px] font-semibold text-[var(--ink-2)]">+ Book hjemmebesøg</div>
                <div className="text-[11px] text-[var(--ink-3)] mt-1">Få en Carl Ras-specialist med ud til kunden</div>
              </button>
            )}

            {showBookForm && (
              <div className="mt-3 p-4 rounded-[var(--r-md)] bg-[var(--canvas-2)] space-y-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1.5">Specialist</label>
                  <select
                    value={bookSpecialistId}
                    onChange={(e) => setBookSpecialistId(e.target.value)}
                    className="field !bg-white !text-[13px]"
                  >
                    {SPECIALISTS.map((s) => (
                      <option key={s.id} value={s.id}>{s.navn} · {s.rolle} ({s.bu})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)] block mb-1.5">Dato</label>
                  <input
                    type="date"
                    value={bookDato}
                    onChange={(e) => setBookDato(e.target.value)}
                    className="field !bg-white !text-[13px]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowBookForm(false)} className="btn btn-secondary !py-1.5">Annullér</button>
                  <button
                    onClick={() => { onBookSpecialist(bookSpecialistId, bookDato); setShowBookForm(false); }}
                    className="btn btn-primary !py-1.5"
                  >
                    Book
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Activity log */}
          <section>
            <div className="t-eyebrow mb-3">Aktivitet · {project.noter.length}</div>
            <ul className="space-y-3">
              {project.noter.map((n, i) => (
                <li key={i} className="flex gap-3">
                  <div className="size-7 rounded-full bg-[var(--accent-tint)] grid place-items-center text-[10px] font-semibold text-[var(--accent-press)] shrink-0">
                    {n.forfatter.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[12.5px] font-semibold text-[var(--ink)]">{n.forfatter}</span>
                      <span className="text-[10.5px] text-[var(--ink-3)]">{n.tid}</span>
                    </div>
                    <p className="text-[12.5px] text-[var(--ink-2)] leading-[1.5] mt-0.5">{n.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="text-[10px] text-[var(--ink-3)] pt-3 border-t border-[var(--line-2)]">
            Oprettet {new Date(project.oprettet).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })}
            {project.deadline && <> · frist {new Date(project.deadline).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })}</>}
          </section>
        </div>

        {/* Footer actions */}
        <div className="px-7 py-4 border-t border-[var(--line-2)] bg-[var(--canvas)] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[var(--ink-3)]">Projekt #{project.id.replace("pr-", "")}</span>
          <div className="flex gap-2">
            <button onClick={onAddAllToBasket} className="btn btn-secondary !py-1.5" data-tt={`Læg alle ${project.produktIds.length} produkter ×${project.enheder} i kurv`}>
              Læg alt i kurv
            </button>
            <button onClick={onSendTilbud} className="btn btn-primary !py-1.5">
              Send tilbud til kunde
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* =====================================================================
   Small UI primitives
   ===================================================================== */

function Tile({ label, value, delta, subtle = false }: { label: string; value: string; delta?: string; subtle?: boolean }) {
  return (
    <div className="card">
      <div className="t-caption">{label}</div>
      <div className="text-[26px] font-semibold mt-1 leading-none text-[var(--ink)] tabular-nums">{value}</div>
      {delta && (
        <div className={"text-[11.5px] mt-2 font-medium " + (subtle ? "text-[var(--ink-3)]" : "text-[#2D4A0F]")}>
          {delta}
        </div>
      )}
    </div>
  );
}

function DrawerStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="p-3 rounded-[var(--r-md)] bg-[var(--canvas-2)]">
      <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{label}</div>
      <div className="text-[18px] font-semibold mt-1 leading-none text-[var(--ink)] tabular-nums">{value}</div>
      {hint && <div className="text-[10.5px] text-[var(--ink-3)] mt-1">{hint}</div>}
    </div>
  );
}
