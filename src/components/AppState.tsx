"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { Lead, LeadStatus, SEED_LEADS, Product } from "@/lib/data";

export interface BasketItem {
  productId: string;
  navn: string;
  brand: string;
  pris: string;     // formatted "3.737,50 kr"
  qty: number;
  url: string;
  image?: string;
  emoji: string;
}

interface AppState {
  leads: Lead[];
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  addLead: (lead: Omit<Lead, "id" | "dato" | "status">) => Lead;
  toast: { id: number; text: string; kind?: "info" | "success" } | null;
  pushToast: (text: string, kind?: "info" | "success") => void;
  basket: BasketItem[];
  addToBasket: (product: Product, qty?: number) => void;
  removeFromBasket: (productId: string) => void;
  clearBasket: () => void;
}

const Ctx = createContext<AppState | null>(null);
const LS_KEY = "carl-ras-demo-state-v2";

// Lazy load from localStorage during initialization
function loadLeads(): Lead[] {
  if (typeof window === "undefined") return SEED_LEADS;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return SEED_LEADS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.leads) && parsed.leads.length > 0) return parsed.leads;
  } catch {}
  return SEED_LEADS;
}
function loadBasket(): BasketItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.basket)) return parsed.basket;
  } catch {}
  return [];
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(loadLeads);
  const [basket, setBasket] = useState<BasketItem[]>(loadBasket);
  const [toast, setToast] = useState<{ id: number; text: string; kind?: "info" | "success" } | null>(null);

  // Persist to localStorage whenever leads or basket change
  useEffect(() => {
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify({ leads, basket }));
    } catch {}
  }, [leads, basket]);

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

  const pushToast = useCallback((text: string, kind: "info" | "success" = "info") => {
    const id = Date.now();
    setToast({ id, text, kind });
    setTimeout(() => {
      setToast((t) => (t?.id === id ? null : t));
    }, 4200);
  }, []);

  const addToBasket = useCallback((product: Product, qty: number = 1) => {
    setBasket((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          navn: product.navn,
          brand: product.brand,
          pris: product.pris,
          qty,
          url: product.url,
          image: product.image,
          emoji: product.emoji,
        },
      ];
    });
  }, []);

  const removeFromBasket = useCallback((productId: string) => {
    setBasket((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearBasket = useCallback(() => setBasket([]), []);

  const value = useMemo<AppState>(
    () => ({
      leads, updateLeadStatus, addLead,
      toast, pushToast,
      basket, addToBasket, removeFromBasket, clearBasket,
    }),
    [leads, updateLeadStatus, addLead, toast, pushToast, basket, addToBasket, removeFromBasket, clearBasket]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-[var(--ink)] text-white pl-3 pr-5 py-2.5 rounded-full shadow-[var(--shadow-3)] text-[13px] max-w-[420px] font-medium"
          style={{ animation: "slideUpFade 280ms cubic-bezier(0.22,1,0.36,1)" }}
        >
          <span
            className="size-6 rounded-full grid place-items-center shrink-0"
            style={{ background: toast.kind === "success" ? "#5DBA47" : "var(--accent)" }}
            aria-hidden
          >
            {toast.kind === "success" ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16v.5" /></svg>
            )}
          </span>
          <span className="leading-[1.4]">{toast.text}</span>
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
