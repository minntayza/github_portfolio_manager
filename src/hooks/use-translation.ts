"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import en from "@/locales/en.json";
import my from "@/locales/my.json";
import type { Language } from "@/types";

const translations: Record<Language, Record<string, any>> = { en, my };

function getNestedValue(obj: Record<string, any>, path: string): string {
  const keys = path.split(".");
  let current: any = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function useTranslation() {
  const [lang, setLang] = useLocalStorage<Language>("devstats-lang", "en");

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations[lang], key);
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    setLang((prev: Language) => (prev === "en" ? "my" : "en"));
  }, [setLang]);

  return { t, lang, setLang, toggleLang };
}
