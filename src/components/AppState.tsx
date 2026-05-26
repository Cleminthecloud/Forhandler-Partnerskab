"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { Lead, LeadStatus, SEED_LEADS } from "@/lib/data";

interface AppState {
  leads: Lead[];
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  addLead: (lead: Omit<Lead, "id" | "dato" | "status">) => Lead;
  toast: { id: number; text: string } | null;
  pushToast: (text: string) => void;
}

const Ctx = createContext<AppState | null>(null);
const LS_KEY = "carl-ras-demo-state-v1";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  // hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.leads)) setLeads(parsed.leads);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ leads }));
    } catch {}
  }, [leads]);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const addLead = useCallback((lead: Omit<Lead, "id" | "dato" | "status">): Lead => {
    const newLead: Lead = {
      ...lead,
      id: "l-" + Date.now().toString(36),
      dato: new Date().toISOString().slice(0, 10),
      status: "Ny",
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, []);

  const pushToast = useCallback((text: string) => {
    const id = Date.now();
    setToast({ id, text });
    setTimeout(() => {
      setToast((t) => (t?.id === id ? null : t));
    }, 4000);
  }, []);

  const value = useMemo<AppState>(
    () => ({ leads, updateLeadStatus, addLead, toast, pushToast }),
    [leads, updateLeadStatus, addLead, toast, pushToast]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--cr-navy-deep)] text-white px-5 py-3 rounded-xl shadow-xl text-sm max-w-[360px]">
          {toast.text}
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppStateProvider");
  return v;
}
