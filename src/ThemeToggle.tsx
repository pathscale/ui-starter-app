import { Component } from "solid-js";
import { setTheme, theme } from "~/lib/theme";
import { FiMoon, FiSun } from "solid-icons/fi";

export const ThemeToggle: Component = () => {
  const toggleTheme = () => {
    const currentTheme = theme();
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class="btn btn-ghost btn-circle"
      aria-label={
        theme() === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
    >
      {theme() === "light" ? (
        <FiMoon class="w-5 h-5" />
      ) : (
        <FiSun class="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
