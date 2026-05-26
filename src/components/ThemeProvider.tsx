"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { DEFAULT_THEME, THEMES, Theme, ThemeId } from "@/lib/themes";

interface Ctx {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  themes: Theme[];
}

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME);
  const theme = useMemo(() => THEMES.find((t) => t.id === themeId)!, [themeId]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-accent-soft", theme.accentSoft);
    root.style.setProperty("--theme-accent-ink", theme.accentInk);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, themeId, setThemeId, themes: THEMES }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error("useTheme must be used within ThemeProvider");
  return v;
}
