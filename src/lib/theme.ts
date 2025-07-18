import { createEffect, createSignal } from "solid-js";

export type ThemeValue = "light" | "dark";

const getInitialTheme = (): ThemeValue => {
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem("theme") as ThemeValue | null;
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const [theme, setTheme] = createSignal<ThemeValue>("light");

if (typeof window !== "undefined") {
  const initialTheme = getInitialTheme();
  setTheme(initialTheme);
  document.documentElement.setAttribute("data-theme", initialTheme);
}

createEffect(() => {
  const current = theme();
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", current);
    localStorage.setItem("theme", current);
  }
});

export { setTheme, theme };
