import { Button, Icon } from "@pathscale/ui";
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
      variant="ghost"
      width="square"
      onClick={toggleTheme}
      aria-label={theme() === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <Icon
        src={theme() === "light" ? "icon-[lucide--moon]" : "icon-[lucide--sun]"}
        width={20}
        height={20}
      />
    </Button>
  );
};

export default ThemeToggle;
