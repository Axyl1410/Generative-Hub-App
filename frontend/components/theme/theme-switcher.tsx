"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-context";
import { useTranslations } from "next-intl"; // Import useTranslations

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("component.themeSwitcher"); // Sử dụng namespace cho dịch

  return (
    <button
      onClick={toggleTheme}
      className="flex w-full items-center gap-2.5 p-2.5 pl-0"
    >
      <span>
        {theme === "light" ? (
          <Moon strokeWidth={1} size={22} />
        ) : (
          <Sun strokeWidth={1} size={22} />
        )}
      </span>
      <p>{t("go")} {theme === "light" ? t("dark") : t("light")}</p>
    </button>
  );
};

export default ThemeSwitcher;
