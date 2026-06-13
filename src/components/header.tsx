"use client";

import { useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export function Header() {
  const { t, lang, toggleLang } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  // Apply Burmese font class when language is Burmese
  useEffect(() => {
    if (lang === "my") {
      document.documentElement.classList.add("font-my");
    } else {
      document.documentElement.classList.remove("font-my");
    }
  }, [lang]);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">{t("app.title")}</h1>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {t("app.subtitle")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={toggleLang}>
          {lang === "en" ? "🇲🇲" : "🇺🇸"}
        </Button>
      </div>
    </header>
  );
}
