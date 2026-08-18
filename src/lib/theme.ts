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

/*
 * Track the theme; write the DOM in the effect argument.
 *
 * Solid 2 splits `createEffect` into what to watch and what to do about it,
 * and a single-argument call is typed `never`. The write also has to stay out
 * of the tracked phase: a side effect there runs while the computation is
 * still being tracked, which is how a write that feeds its own read becomes a
 * loop rather than an error.
 */
createEffect(
  () => theme(),
  (current) => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", current);
      localStorage.setItem("theme", current);
    }
  },
);

export { setTheme, theme };
