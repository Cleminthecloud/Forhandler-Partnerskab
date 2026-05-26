import { DemoTopBar } from "@/components/Shell";
import { PartnerSidebar } from "@/components/PartnerSidebar";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas-2)]">
      <DemoTopBar />
      <div className="flex flex-1 w-full">
        <PartnerSidebar />
        <div className="flex-1 min-w-0 bg-[var(--canvas-2)]">{children}</div>
      </div>
    </div>
  );
}
