"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("crate-theme");
    } catch {}
    setTheme(saved === "light" || saved === "dark" ? saved : systemTheme());
  }, []);

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
  }, [theme]);

  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="outline"
      aria-label={`Switch to ${next} theme`}
      onClick={() => {
        setTheme(next);
        try {
          localStorage.setItem("crate-theme", next);
        } catch {}
      }}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
