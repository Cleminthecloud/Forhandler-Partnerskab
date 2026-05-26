import { DemoTopBar } from "@/components/Shell";
import { PartnerSidebar } from "@/components/PartnerSidebar";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-pearl)]">
      <DemoTopBar />
      <div className="flex flex-1 mx-auto w-full max-w-[1440px]">
        <PartnerSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
