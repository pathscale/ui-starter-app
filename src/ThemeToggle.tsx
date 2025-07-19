import { Button } from "@pathscale/ui";
import type { Component } from "solid-js";
import { setTheme, theme } from "~/lib/theme";

export const ThemeToggle: Component = () => {
  const toggleTheme = () => {
    const currentTheme = theme();
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      aria-label={theme() === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme() === "light" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-5 w-5"
          role="img"
          aria-label="Moon Icon"
        >
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-5 w-5"
          role="img"
          aria-label="Sun Icon"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )}
    </Button>
  );
};

export default ThemeToggle;
