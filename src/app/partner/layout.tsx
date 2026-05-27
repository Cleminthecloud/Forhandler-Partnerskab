import { DemoTopBar } from "@/components/Shell";
import { PartnerSidebar } from "@/components/PartnerSidebar";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas-2)]">
      <DemoTopBar />
      <div className="flex flex-1 w-full min-h-[calc(100vh-48px)]">
        <PartnerSidebar />
        {/* Pages get min-h so the parchment background always fills viewport even when
            their content is short. Pages can opt-in to full-viewport layouts (canvas-app
            pattern) by using h-[calc(100vh-48px)] internally. */}
        <main className="flex-1 min-w-0 min-h-[calc(100vh-48px)] bg-[var(--canvas-2)]">{children}</main>
      </div>
    </div>
  );
}
