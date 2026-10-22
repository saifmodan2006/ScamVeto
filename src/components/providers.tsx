"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { Locale } from "@/lib/validation/schemas";
import { dictionary } from "@/lib/i18n/dictionaries";
const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (v: Locale) => void;
}>({ locale: "en", setLocale: () => {} });
export function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
export function useLocale() {
  const value = useContext(LocaleContext);
  return { ...value, t: dictionary(value.locale) };
}
