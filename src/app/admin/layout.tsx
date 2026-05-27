import { DemoTopBar } from "@/components/Shell";
import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas-2)]">
      <DemoTopBar />
      <div className="flex flex-1 w-full min-h-[calc(100vh-48px)]">
        <AdminSidebar />
        <main className="flex-1 min-w-0 min-h-[calc(100vh-48px)] bg-[var(--canvas-2)]">{children}</main>
      </div>
    </div>
  );
}
