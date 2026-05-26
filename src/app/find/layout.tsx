import { CarlRasHeader } from "@/components/CarlRasHeader";
import { DemoTopBar } from "@/components/Shell";

export default function FindLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CarlRasHeader />
      {/* Floating demo control — keeps the carl-ras.dk illusion intact */}
      <DemoTopBar floating />
      <main className="flex-1">{children}</main>

      {/* carl-ras.dk-style footer */}
      <footer className="mt-16 bg-[var(--cr-navy-deep)] text-white">
        <div className="mx-auto max-w-[1280px] px-6 py-12 grid gap-8 md:grid-cols-4">
          <div>
            <div className="font-bold text-[18px]">Carl Ras</div>
            <p className="text-[13px] text-white/70 mt-2 max-w-[220px]">
              Familieejet dansk grossist siden 1934. Værktøj, beslag og arbejdstøj til håndværkere.
            </p>
          </div>
          {[
            { title: "Sortiment", items: ["Værktøj", "Beslag", "Arbejdstøj", "Sikring", "Byg & bolig"] },
            { title: "Om Carl Ras", items: ["Vores selskaber", "Karriere", "Bæredygtighed", "Presse"] },
            { title: "Service", items: ["Find butik", "Find en partner", "Kontakt", "B2B-login"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-white/70">{col.title}</div>
              <ul className="mt-3 space-y-2 text-[13px]">
                {col.items.map((i) => <li key={i}><a href="#" className="hover:underline">{i}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-[1280px] px-6 py-5 flex flex-wrap justify-between gap-3 text-[12px] text-white/60">
            <span>© 2026 Carl Ras Gruppen · CVR 11583811</span>
            <span>Mileparken 30, 2730 Herlev</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
