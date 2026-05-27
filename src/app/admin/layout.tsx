import { DemoTopBar } from "@/components/Shell";
import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas-2)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-[var(--r-md)] focus:bg-[var(--ink)] focus:text-white focus:no-underline focus:shadow-[var(--shadow-3)]"
      >
        Spring til indhold
      </a>
      <DemoTopBar />
      <div className="flex flex-1 w-full min-h-[calc(100vh-48px)]">
        <AdminSidebar />
        <main id="main" tabIndex={-1} className="flex-1 min-w-0 min-h-[calc(100vh-48px)] bg-[var(--canvas-2)] outline-none">{children}</main>
      </div>
    </div>
  );
}
