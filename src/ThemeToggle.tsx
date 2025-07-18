import { Button } from "@pathscale/ui";
import { FiMoon, FiSun } from "solid-icons/fi";
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
      class="btn btn-ghost btn-circle"
      aria-label={theme() === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme() === "light" ? <FiMoon class="h-5 w-5" /> : <FiSun class="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
